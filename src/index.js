/**
 * Main Application Entry Point
 * 
 * This file initializes and coordinates all modules
 */

// Config
export * from './config/constants.js';
export { signature } from './config/signature.js';

// Utils
export * from './utils/helpers.js';
export { StorageManager } from './utils/storage.js';

// Providers
export { ProviderRegistry, providerRegistry } from './providers/index.js';

// UI
export { ModalManager } from './ui/modal.js';
export { SpeechManager } from './ui/speech.js';
export { ThemeManager } from './ui/theme.js';
export { ToastManager } from './ui/toast.js';

// Core
export { ApiClient } from './core/api-client.js';

// Features
export { EmailService } from './features/email.js';
export { EnhancementService } from './features/enhance.js';
export { PromptBuilder } from './features/prompts.js';
export { TranslationService } from './features/translate.js';

// Import singletons for initialization
import { providerRegistry } from './providers/index.js';
import { theme } from './ui/theme.js';
import { toast } from './ui/toast.js';

/**
 * Initialize all modules
 */
export function initializeApp() {
  // Initialize theme
  theme.init();
  
  // Initialize providers
  providerRegistry.initProviders();
  
  console.log('✅ App modules initialized');
  
  return {
    theme,
    toast,
    providers: providerRegistry
  };
}

// Auto-initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    // DOM already loaded
    initializeApp();
  }
}

