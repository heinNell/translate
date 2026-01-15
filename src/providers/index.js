/**
 * Provider Registry - Factory for creating and managing providers
 */

import { DEFAULT_MODELS, FALLBACK_CHAINS } from '../config/constants.js';
import { storage } from '../utils/storage.js';
import { AnthropicProvider } from './anthropic.js';
import { DeepSeekProvider } from './deepseek.js';
import { GoogleProvider } from './google.js';
import { GrokProvider } from './grok.js';
import { GroqProvider } from './groq.js';
import { MorphProvider } from './morph.js';
import { OllamaProvider } from './ollama.js';
import { OpenAIProvider } from './openai.js';
import { OpenRouterProvider } from './openrouter.js';
import { TogetherProvider } from './together.js';

class ProviderRegistry {
  constructor() {
    this.providers = new Map();
    this.currentProvider = null;
    this.modelHealth = {};
    this.initProviders();
  }

  /**
   * Initialize all providers
   */
  initProviders() {
    // Create provider instances
    this.register('openrouter', new OpenRouterProvider());
    this.register('anthropic', new AnthropicProvider());
    this.register('openai', new OpenAIProvider());
    this.register('google', new GoogleProvider());
    this.register('groq', new GroqProvider());
    this.register('together', new TogetherProvider());
    this.register('ollama', new OllamaProvider());
    this.register('deepseek', new DeepSeekProvider());
    this.register('grok', new GrokProvider());
    this.register('morph', new MorphProvider());

    // Load saved settings
    this.loadFromStorage();
  }

  /**
   * Register a provider
   * @param {string} name - Provider name
   * @param {BaseProvider} provider - Provider instance
   */
  register(name, provider) {
    this.providers.set(name, provider);
  }

  /**
   * Get a provider by name
   * @param {string} name - Provider name
   * @returns {BaseProvider|null}
   */
  get(name) {
    return this.providers.get(name) || null;
  }

  /**
   * Get current provider
   * @returns {BaseProvider}
   */
  getCurrent() {
    return this.get(this.currentProvider) || this.get('openrouter');
  }

  /**
   * Set current provider
   * @param {string} name - Provider name
   */
  setCurrent(name) {
    if (this.providers.has(name)) {
      this.currentProvider = name;
      storage.setCurrentProvider(name);
    }
  }

  /**
   * Load settings from storage
   */
  loadFromStorage() {
    // Load current provider
    this.currentProvider = storage.getCurrentProvider();

    // Load API keys and models for each provider
    this.providers.forEach((provider, name) => {
      // Load API key
      const apiKey = storage.getApiKey(name);
      if (apiKey) {
        provider.setApiKey(apiKey);
      }

      // Load model
      const model = storage.getModel(name, DEFAULT_MODELS[name]);
      if (model) {
        provider.setModel(model);
      }

      // Special handling for Ollama URL
      if (name === 'ollama') {
        const url = storage.getOllamaUrl();
        provider.setBaseUrl(url);
      }
    });
  }

  /**
   * Save API key for a provider
   * @param {string} name - Provider name
   * @param {string} apiKey - API key
   */
  saveApiKey(name, apiKey) {
    const provider = this.get(name);
    if (provider) {
      provider.setApiKey(apiKey);
      storage.setApiKey(name, apiKey);
    }
  }

  /**
   * Save model for a provider
   * @param {string} name - Provider name
   * @param {string} model - Model ID
   */
  saveModel(name, model) {
    const provider = this.get(name);
    if (provider) {
      provider.setModel(model);
      storage.setModel(name, model);
    }
  }

  /**
   * Get all provider names
   * @returns {Array<string>}
   */
  getProviderNames() {
    return Array.from(this.providers.keys());
  }

  /**
   * Get all configured providers
   * @returns {Array<BaseProvider>}
   */
  getConfiguredProviders() {
    return Array.from(this.providers.values()).filter(p => p.isConfigured());
  }

  /**
   * Get free providers
   * @returns {Array<BaseProvider>}
   */
  getFreeProviders() {
    return Array.from(this.providers.values()).filter(p => p.isFree?.() === true);
  }

  /**
   * Get API config for current provider
   * @returns {Object}
   */
  getApiConfig() {
    const provider = this.getCurrent();
    return {
      name: provider.name,
      endpoint: provider.getEndpoint(),
      headers: provider.getHeaders(),
      model: provider.getModel(),
      isConfigured: provider.isConfigured(),
      supportsStreaming: provider.supportsStreaming(),
      isO1Model: provider.isO1Model?.() || false,
      isGoogleGemini: provider.name === 'google',
      isAnthropicDirect: provider.name === 'anthropic'
    };
  }

  /**
   * Format request body for current provider
   * @param {Array} messages - Messages array
   * @param {number} maxTokens - Max tokens
   * @param {number} temperature - Temperature
   * @returns {Object}
   */
  formatRequest(messages, maxTokens = 4000, temperature = 0.7) {
    return this.getCurrent().formatRequest(messages, maxTokens, temperature);
  }

  /**
   * Parse response from current provider
   * @param {Object} data - Response data
   * @returns {string}
   */
  parseResponse(data) {
    return this.getCurrent().parseResponse(data);
  }

  // ==================== Fallback System ====================

  /**
   * Get fallback chain for current provider
   * @returns {Array<string>}
   */
  getFallbackChain() {
    return FALLBACK_CHAINS[this.currentProvider] || FALLBACK_CHAINS.openrouter;
  }

  /**
   * Check if model is available
   * @param {string} modelId - Model ID
   * @returns {boolean}
   */
  isModelAvailable(modelId) {
    const health = this.modelHealth[modelId];
    if (!health) return true;
    
    // Check if enough time has passed since last failure
    if (!health.available && health.lastFailure) {
      const timeSinceFailure = Date.now() - health.lastFailure;
      if (timeSinceFailure > 5 * 60 * 1000) { // 5 minutes
        health.available = true;
        health.failures = 0;
      }
    }
    
    return health.available;
  }

  /**
   * Track model success
   * @param {string} modelId - Model ID
   */
  trackModelSuccess(modelId) {
    if (!this.modelHealth[modelId]) {
      this.modelHealth[modelId] = { failures: 0, available: true };
    }
    this.modelHealth[modelId].failures = 0;
    this.modelHealth[modelId].available = true;
  }

  /**
   * Track model failure
   * @param {string} modelId - Model ID
   */
  trackModelFailure(modelId) {
    if (!this.modelHealth[modelId]) {
      this.modelHealth[modelId] = { failures: 0, available: true };
    }
    this.modelHealth[modelId].failures++;
    this.modelHealth[modelId].lastFailure = Date.now();
    
    // Mark as unavailable after 3 failures
    if (this.modelHealth[modelId].failures >= 3) {
      this.modelHealth[modelId].available = false;
    }
  }

  /**
   * Get next fallback model
   * @param {string} currentModel - Current model
   * @param {Array<string>} triedModels - Already tried models
   * @returns {string|Object|null}
   */
  getNextFallbackModel(currentModel, triedModels = []) {
    const chain = this.getFallbackChain();
    
    for (const model of chain) {
      if (model !== currentModel && 
          !triedModels.includes(model) && 
          this.isModelAvailable(model)) {
        return model;
      }
    }
    
    // Cross-provider fallback to OpenRouter
    const openrouterKey = storage.getApiKey('openrouter');
    if (openrouterKey && this.currentProvider !== 'openrouter') {
      for (const model of FALLBACK_CHAINS.openrouter) {
        if (!triedModels.includes(model) && this.isModelAvailable(model)) {
          return { model, switchProvider: 'openrouter' };
        }
      }
    }
    
    return null;
  }

  /**
   * Get model health status
   * @returns {Array<Object>}
   */
  getModelHealthStatus() {
    return Object.entries(this.modelHealth).map(([model, health]) => ({
      model,
      available: health.available,
      failures: health.failures,
      lastFailure: health.lastFailure ? new Date(health.lastFailure).toLocaleTimeString() : null
    }));
  }

  /**
   * Reset model health
   */
  resetModelHealth() {
    this.modelHealth = {};
  }
}

// Export singleton instance
export const providerRegistry = new ProviderRegistry();
export default providerRegistry;

// Also export individual providers for direct use
export {
    AnthropicProvider, DeepSeekProvider, GoogleProvider, GrokProvider, GroqProvider, MorphProvider, OllamaProvider, OpenAIProvider, OpenRouterProvider, TogetherProvider
};

