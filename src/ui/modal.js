/**
 * Modal Manager - Handles modal dialogs
 */

class ModalManager {
  constructor() {
    this.modals = new Map();
    this.activeModal = null;
    this.initKeyboardHandler();
  }

  /**
   * Initialize keyboard handler for modals
   */
  initKeyboardHandler() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.hide(this.activeModal);
      }
    });
  }

  /**
   * Register a modal
   * @param {string} id - Modal ID
   * @param {HTMLElement} element - Modal element
   */
  register(id, element) {
    if (!element) return;
    
    this.modals.set(id, {
      element,
      onShow: null,
      onHide: null
    });

    // Close on backdrop click
    element.addEventListener('click', (e) => {
      if (e.target === element) {
        this.hide(id);
      }
    });
  }

  /**
   * Show a modal
   * @param {string} id - Modal ID
   * @param {Object} options - Options
   */
  show(id, options = {}) {
    const modal = this.modals.get(id);
    if (!modal) return;

    // Hide any active modal first
    if (this.activeModal && this.activeModal !== id) {
      this.hide(this.activeModal, false);
    }

    modal.element.classList.add('visible');
    this.activeModal = id;

    // Call onShow callback
    if (options.onShow) {
      options.onShow(modal.element);
    }

    // Focus first focusable element
    this.focusFirst(modal.element);
  }

  /**
   * Hide a modal
   * @param {string} id - Modal ID
   * @param {boolean} animate - Whether to animate
   */
  hide(id, animate = true) {
    const modal = this.modals.get(id);
    if (!modal) return;

    if (animate) {
      modal.element.classList.add('hiding');
      setTimeout(() => {
        modal.element.classList.remove('visible', 'hiding');
      }, 200);
    } else {
      modal.element.classList.remove('visible');
    }

    if (this.activeModal === id) {
      this.activeModal = null;
    }

    // Call onHide callback
    if (modal.onHide) {
      modal.onHide(modal.element);
    }
  }

  /**
   * Toggle modal visibility
   * @param {string} id - Modal ID
   */
  toggle(id) {
    const modal = this.modals.get(id);
    if (!modal) return;

    if (modal.element.classList.contains('visible')) {
      this.hide(id);
    } else {
      this.show(id);
    }
  }

  /**
   * Check if modal is visible
   * @param {string} id - Modal ID
   * @returns {boolean}
   */
  isVisible(id) {
    const modal = this.modals.get(id);
    return modal ? modal.element.classList.contains('visible') : false;
  }

  /**
   * Focus first focusable element in modal
   * @param {HTMLElement} container - Container element
   */
  focusFirst(container) {
    const focusable = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length > 0) {
      setTimeout(() => focusable[0].focus(), 100);
    }
  }

  /**
   * Trap focus within modal
   * @param {KeyboardEvent} e - Keyboard event
   * @param {HTMLElement} container - Container element
   */
  trapFocus(e, container) {
    const focusable = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
}

// Export singleton
export const modal = new ModalManager();
export default modal;
