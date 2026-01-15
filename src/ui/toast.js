/**
 * Toast Notification System
 */

import { TOAST_TYPES } from '../config/constants.js';

class ToastManager {
  constructor() {
    this.container = null;
    this.toasts = [];
    this.maxToasts = 5;
    this.defaultDuration = 3000;
  }

  /**
   * Initialize toast container
   */
  init() {
    this.container = document.getElementById('toastContainer');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toastContainer';
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  }

  /**
   * Show a toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type (success, error, warning, info)
   * @param {number} duration - Duration in ms
   */
  show(message, type = TOAST_TYPES.INFO, duration = this.defaultDuration) {
    if (!this.container) this.init();

    // Limit number of toasts
    while (this.toasts.length >= this.maxToasts) {
      this.removeOldest();
    }

    const toast = this.createToastElement(message, type);
    this.container.appendChild(toast);
    this.toasts.push(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('visible');
    });

    // Auto dismiss
    setTimeout(() => this.dismiss(toast), duration);

    return toast;
  }

  /**
   * Create toast DOM element
   * @param {string} message - Toast message
   * @param {string} type - Toast type
   * @returns {HTMLElement}
   */
  createToastElement(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
      [TOAST_TYPES.SUCCESS]: '✓',
      [TOAST_TYPES.ERROR]: '✕',
      [TOAST_TYPES.WARNING]: '⚠',
      [TOAST_TYPES.INFO]: 'ℹ'
    };

    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons[TOAST_TYPES.INFO]}</span>
      <span class="toast-message">${this.escapeHtml(message)}</span>
      <button class="toast-close" aria-label="Close">&times;</button>
    `;

    // Close button handler
    toast.querySelector('.toast-close').addEventListener('click', () => {
      this.dismiss(toast);
    });

    return toast;
  }

  /**
   * Dismiss a toast
   * @param {HTMLElement} toast - Toast element
   */
  dismiss(toast) {
    if (!toast || !toast.parentNode) return;

    toast.classList.remove('visible');
    toast.classList.add('hiding');

    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      const index = this.toasts.indexOf(toast);
      if (index > -1) {
        this.toasts.splice(index, 1);
      }
    }, 300);
  }

  /**
   * Remove oldest toast
   */
  removeOldest() {
    if (this.toasts.length > 0) {
      this.dismiss(this.toasts[0]);
    }
  }

  /**
   * Clear all toasts
   */
  clearAll() {
    [...this.toasts].forEach(toast => this.dismiss(toast));
  }

  /**
   * Escape HTML
   * @param {string} text - Text to escape
   * @returns {string}
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Convenience methods
  success(message, duration) {
    return this.show(message, TOAST_TYPES.SUCCESS, duration);
  }

  error(message, duration) {
    return this.show(message, TOAST_TYPES.ERROR, duration);
  }

  warning(message, duration) {
    return this.show(message, TOAST_TYPES.WARNING, duration);
  }

  info(message, duration) {
    return this.show(message, TOAST_TYPES.INFO, duration);
  }
}

// Export singleton
export const toast = new ToastManager();
export default toast;
