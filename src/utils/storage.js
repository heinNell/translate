/**
 * Storage Utility - Handles localStorage operations with optional encryption
 */

import { STORAGE_KEYS } from '../config/constants.js';

class StorageManager {
  constructor() {
    this.prefix = 'translator_';
  }

  /**
   * Get item from localStorage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} Stored value or default
   */
  get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      if (value === null) return defaultValue;
      
      // Try to parse as JSON
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error(`Error reading from storage: ${key}`, error);
      return defaultValue;
    }
  }

  /**
   * Set item in localStorage
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   */
  set(key, value) {
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error writing to storage: ${key}`, error);
    }
  }

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from storage: ${key}`, error);
    }
  }

  /**
   * Check if key exists
   * @param {string} key - Storage key
   * @returns {boolean}
   */
  has(key) {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Clear all app-related storage
   */
  clearAll() {
    Object.values(STORAGE_KEYS).forEach(key => {
      this.remove(key);
    });
  }

  // ==================== API Key Management ====================

  /**
   * Get API key for a provider
   * @param {string} provider - Provider name
   * @returns {string} API key or empty string
   */
  getApiKey(provider) {
    const keyMap = {
      openrouter: STORAGE_KEYS.openrouterApiKey,
      anthropic: STORAGE_KEYS.anthropicApiKey,
      openai: STORAGE_KEYS.openaiApiKey,
      google: STORAGE_KEYS.googleApiKey,
      deepseek: STORAGE_KEYS.deepseekApiKey,
      grok: STORAGE_KEYS.grokApiKey,
      morph: STORAGE_KEYS.morphApiKey,
      groq: STORAGE_KEYS.groqApiKey,
      together: STORAGE_KEYS.togetherApiKey
    };
    
    return this.get(keyMap[provider], '');
  }

  /**
   * Set API key for a provider
   * @param {string} provider - Provider name
   * @param {string} apiKey - API key
   */
  setApiKey(provider, apiKey) {
    const keyMap = {
      openrouter: STORAGE_KEYS.openrouterApiKey,
      anthropic: STORAGE_KEYS.anthropicApiKey,
      openai: STORAGE_KEYS.openaiApiKey,
      google: STORAGE_KEYS.googleApiKey,
      deepseek: STORAGE_KEYS.deepseekApiKey,
      grok: STORAGE_KEYS.grokApiKey,
      morph: STORAGE_KEYS.morphApiKey,
      groq: STORAGE_KEYS.groqApiKey,
      together: STORAGE_KEYS.togetherApiKey
    };
    
    this.set(keyMap[provider], apiKey);
  }

  // ==================== Model Management ====================

  /**
   * Get model for a provider
   * @param {string} provider - Provider name
   * @param {string} defaultModel - Default model
   * @returns {string} Model ID
   */
  getModel(provider, defaultModel = '') {
    const keyMap = {
      openrouter: STORAGE_KEYS.openrouterModel,
      anthropic: STORAGE_KEYS.anthropicModel,
      openai: STORAGE_KEYS.openaiModel,
      google: STORAGE_KEYS.googleModel,
      deepseek: STORAGE_KEYS.deepseekModel,
      grok: STORAGE_KEYS.grokModel,
      morph: STORAGE_KEYS.morphModel,
      groq: STORAGE_KEYS.groqModel,
      together: STORAGE_KEYS.togetherModel,
      ollama: STORAGE_KEYS.ollamaModel
    };
    
    return this.get(keyMap[provider], defaultModel);
  }

  /**
   * Set model for a provider
   * @param {string} provider - Provider name
   * @param {string} model - Model ID
   */
  setModel(provider, model) {
    const keyMap = {
      openrouter: STORAGE_KEYS.openrouterModel,
      anthropic: STORAGE_KEYS.anthropicModel,
      openai: STORAGE_KEYS.openaiModel,
      google: STORAGE_KEYS.googleModel,
      deepseek: STORAGE_KEYS.deepseekModel,
      grok: STORAGE_KEYS.grokModel,
      morph: STORAGE_KEYS.morphModel,
      groq: STORAGE_KEYS.groqModel,
      together: STORAGE_KEYS.togetherModel,
      ollama: STORAGE_KEYS.ollamaModel
    };
    
    this.set(keyMap[provider], model);
  }

  // ==================== History Management ====================

  /**
   * Get translation history
   * @returns {Array} Translation history
   */
  getTranslationHistory() {
    return this.get(STORAGE_KEYS.translationHistory, []);
  }

  /**
   * Add to translation history
   * @param {Object} entry - Translation entry
   * @param {number} maxItems - Maximum items to keep
   */
  addToTranslationHistory(entry, maxItems = 50) {
    const history = this.getTranslationHistory();
    history.push({
      ...entry,
      timestamp: new Date().toISOString()
    });
    
    // Keep only the last N items
    const trimmed = history.slice(-maxItems);
    this.set(STORAGE_KEYS.translationHistory, trimmed);
  }

  /**
   * Get chat conversations
   * @returns {Array} Chat conversations
   */
  getChatConversations() {
    return this.get(STORAGE_KEYS.chatConversations, []);
  }

  /**
   * Save chat conversations
   * @param {Array} conversations - Conversations array
   */
  saveChatConversations(conversations) {
    this.set(STORAGE_KEYS.chatConversations, conversations);
  }

  // ==================== Settings ====================

  /**
   * Get current provider
   * @returns {string} Current provider
   */
  getCurrentProvider() {
    return this.get(STORAGE_KEYS.currentProvider, 'openrouter');
  }

  /**
   * Set current provider
   * @param {string} provider - Provider name
   */
  setCurrentProvider(provider) {
    this.set(STORAGE_KEYS.currentProvider, provider);
  }

  /**
   * Get Ollama URL
   * @returns {string} Ollama URL
   */
  getOllamaUrl() {
    return this.get(STORAGE_KEYS.ollamaUrl, 'http://localhost:11434');
  }

  /**
   * Set Ollama URL
   * @param {string} url - Ollama URL
   */
  setOllamaUrl(url) {
    this.set(STORAGE_KEYS.ollamaUrl, url);
  }

  /**
   * Check if fallback is enabled
   * @returns {boolean}
   */
  isFallbackEnabled() {
    return this.get(STORAGE_KEYS.fallbackEnabled, true);
  }

  /**
   * Set fallback enabled
   * @param {boolean} enabled
   */
  setFallbackEnabled(enabled) {
    this.set(STORAGE_KEYS.fallbackEnabled, enabled);
  }

  /**
   * Check if dark mode is enabled
   * @returns {boolean}
   */
  isDarkMode() {
    return this.get(STORAGE_KEYS.darkMode, false);
  }

  /**
   * Set dark mode
   * @param {boolean} enabled
   */
  setDarkMode(enabled) {
    this.set(STORAGE_KEYS.darkMode, enabled);
  }

  // ==================== Token Tracking ====================

  /**
   * Get total tokens used
   * @returns {number}
   */
  getTotalTokens() {
    return this.get(STORAGE_KEYS.totalTokensUsed, 0);
  }

  /**
   * Add tokens used
   * @param {number} tokens
   */
  addTokensUsed(tokens) {
    const current = this.getTotalTokens();
    this.set(STORAGE_KEYS.totalTokensUsed, current + tokens);
  }
}

// Export singleton instance
export const storage = new StorageManager();
export default storage;
