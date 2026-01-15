/**
 * Theme Manager - Handles dark/light mode
 */

import { storage } from '../utils/storage.js';

class ThemeManager {
  constructor() {
    this.isDark = false;
    this.listeners = [];
  }

  /**
   * Initialize theme
   */
  init() {
    // Load saved preference
    this.isDark = storage.isDarkMode();
    
    // Apply theme
    this.apply();

    // Listen for system preference changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!storage.has('dark_mode')) {
          this.isDark = e.matches;
          this.apply();
        }
      });
    }
  }

  /**
   * Apply current theme
   */
  apply() {
    document.body.classList.toggle('dark-mode', this.isDark);
    
    // Update meta theme-color
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.content = this.isDark ? '#1e293b' : '#ffffff';
    }

    // Notify listeners
    this.listeners.forEach(fn => fn(this.isDark));
  }

  /**
   * Toggle theme
   */
  toggle() {
    this.isDark = !this.isDark;
    storage.setDarkMode(this.isDark);
    this.apply();
    return this.isDark;
  }

  /**
   * Set theme
   * @param {boolean} dark - Whether to use dark mode
   */
  set(dark) {
    this.isDark = dark;
    storage.setDarkMode(dark);
    this.apply();
  }

  /**
   * Get current theme
   * @returns {boolean}
   */
  get() {
    return this.isDark;
  }

  /**
   * Subscribe to theme changes
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) this.listeners.splice(index, 1);
    };
  }
}

// Export singleton
export const theme = new ThemeManager();
export default theme;
