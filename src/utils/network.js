/**
 * Network Utility - Handles connectivity detection and offline support
 */

/**
 * @typedef {Object} NetworkStatus
 * @property {boolean} online - Whether the browser is online
 * @property {string} effectiveType - Connection type (4g, 3g, 2g, slow-2g)
 * @property {number} downlink - Downlink speed in Mbps
 * @property {number} rtt - Round-trip time in ms
 */

/**
 * @typedef {Object} NetworkEvents
 * @property {Function} onOnline - Called when coming online
 * @property {Function} onOffline - Called when going offline
 * @property {Function} onSlowConnection - Called when connection is slow
 */

class NetworkManager {
  constructor() {
    /** @type {boolean} */
    this.online = navigator.onLine;
    
    /** @type {Set<Function>} */
    this.onlineListeners = new Set();
    
    /** @type {Set<Function>} */
    this.offlineListeners = new Set();
    
    /** @type {Set<Function>} */
    this.changeListeners = new Set();
    
    /** @type {Array<{action: Function, args: any[]}>} */
    this.pendingActions = [];
    
    this.init();
  }

  /**
   * Initialize network event listeners
   * @private
   */
  init() {
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
    
    // Check connection quality if available
    if ('connection' in navigator) {
      /** @type {any} */
      const connection = navigator.connection;
      connection?.addEventListener('change', () => this.handleConnectionChange());
    }
  }

  /**
   * Handle coming online
   * @private
   */
  handleOnline() {
    this.online = true;
    this.onlineListeners.forEach(listener => listener());
    this.changeListeners.forEach(listener => listener(this.getStatus()));
    
    // Process pending actions
    this.processPendingActions();
  }

  /**
   * Handle going offline
   * @private
   */
  handleOffline() {
    this.online = false;
    this.offlineListeners.forEach(listener => listener());
    this.changeListeners.forEach(listener => listener(this.getStatus()));
  }

  /**
   * Handle connection quality change
   * @private
   */
  handleConnectionChange() {
    this.changeListeners.forEach(listener => listener(this.getStatus()));
  }

  /**
   * Get current network status
   * @returns {NetworkStatus}
   */
  getStatus() {
    /** @type {NetworkStatus} */
    const status = {
      online: navigator.onLine,
      effectiveType: '4g',
      downlink: 10,
      rtt: 50
    };
    
    if ('connection' in navigator) {
      /** @type {any} */
      const connection = navigator.connection;
      if (connection) {
        status.effectiveType = connection.effectiveType || '4g';
        status.downlink = connection.downlink || 10;
        status.rtt = connection.rtt || 50;
      }
    }
    
    return status;
  }

  /**
   * Check if currently online
   * @returns {boolean}
   */
  isOnline() {
    return navigator.onLine;
  }

  /**
   * Check if connection is slow
   * @returns {boolean}
   */
  isSlowConnection() {
    const status = this.getStatus();
    return status.effectiveType === 'slow-2g' || 
           status.effectiveType === '2g' ||
           status.rtt > 500;
  }

  /**
   * Subscribe to online event
   * @param {Function} callback
   * @returns {Function} Unsubscribe function
   */
  onOnline(callback) {
    this.onlineListeners.add(callback);
    return () => this.onlineListeners.delete(callback);
  }

  /**
   * Subscribe to offline event
   * @param {Function} callback
   * @returns {Function} Unsubscribe function
   */
  onOffline(callback) {
    this.offlineListeners.add(callback);
    return () => this.offlineListeners.delete(callback);
  }

  /**
   * Subscribe to any network change
   * @param {Function} callback
   * @returns {Function} Unsubscribe function
   */
  onChange(callback) {
    this.changeListeners.add(callback);
    return () => this.changeListeners.delete(callback);
  }

  /**
   * Queue action to run when online
   * @param {Function} action - Action to run
   * @param {...any} args - Arguments to pass to action
   */
  queueForOnline(action, ...args) {
    if (this.isOnline()) {
      action(...args);
    } else {
      this.pendingActions.push({ action, args });
    }
  }

  /**
   * Process pending actions when coming online
   * @private
   */
  async processPendingActions() {
    const actions = [...this.pendingActions];
    this.pendingActions = [];
    
    for (const { action, args } of actions) {
      try {
        await action(...args);
      } catch (error) {
        console.error('Failed to process pending action:', error);
      }
    }
  }

  /**
   * Wrap fetch with offline detection
   * @param {string} url - URL to fetch
   * @param {RequestInit} options - Fetch options
   * @returns {Promise<Response>}
   */
  async fetch(url, options = {}) {
    if (!this.isOnline()) {
      throw new NetworkError('No internet connection. Please check your network and try again.');
    }
    
    return fetch(url, options);
  }

  /**
   * Show offline notification UI
   */
  showOfflineNotification() {
    // Check if notification already exists
    if (document.getElementById('offline-notification')) return;
    
    const notification = document.createElement('div');
    notification.id = 'offline-notification';
    notification.className = 'offline-notification';
    notification.innerHTML = `
      <div class="offline-content">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="1" y1="1" x2="23" y2="23"></line>
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
          <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
          <line x1="12" y1="20" x2="12.01" y2="20"></line>
        </svg>
        <span>You're offline. Some features may be unavailable.</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove when online
    const removeNotification = () => {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    };
    
    this.onOnline(removeNotification);
  }

  /**
   * Hide offline notification
   */
  hideOfflineNotification() {
    const notification = document.getElementById('offline-notification');
    if (notification) {
      notification.classList.add('fade-out');
      setTimeout(() => notification.remove(), 300);
    }
  }
}

/**
 * Custom error class for network errors
 */
export class NetworkError extends Error {
  /**
   * @param {string} message
   */
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
    this.isNetworkError = true;
  }
}

// Singleton instance
export const networkManager = new NetworkManager();

export default networkManager;
