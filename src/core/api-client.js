/**
 * API Client - Handles all API requests with retry and fallback logic
 */

import { RETRY_CONFIG } from '../config/constants.js';
import { providerRegistry } from '../providers/index.js';
import { toast } from '../ui/toast.js';
import { getBackoffDelay, sleep } from '../utils/helpers.js';
import { storage } from '../utils/storage.js';

class ApiClient {
  constructor() {
    this.fallbackEnabled = storage.isFallbackEnabled();
  }

  /**
   * Execute API call with retry and fallback logic
   * @param {Function} apiCallFn - API call function
   * @param {Object} options - Options
   * @returns {Promise<*>}
   */
  async executeWithFallback(apiCallFn, options = {}) {
    const {
      maxRetries = RETRY_CONFIG.maxRetries,
      showNotifications = true
    } = options;

    const provider = providerRegistry.getCurrent();
    const originalModel = provider.getModel();
    const triedModels = [originalModel];
    let lastError = null;
    let currentModel = originalModel;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Update model if using fallback
        if (currentModel !== originalModel) {
          provider.setModel(currentModel);
          if (showNotifications) {
            toast.info(`Trying fallback model: ${currentModel}`);
          }
        }

        const result = await apiCallFn();
        
        // Track success
        providerRegistry.trackModelSuccess(currentModel);
        provider.setModel(originalModel);
        return result;

      } catch (error) {
        lastError = error;
        const statusCode = error.statusCode || 0;

        console.warn(`API attempt ${attempt}/${maxRetries} failed for ${currentModel}:`, error.message);
        providerRegistry.trackModelFailure(currentModel);

        // Check if we should retry with backoff
        if (attempt < maxRetries && this.isRetryableError(error, statusCode)) {
          const delay = getBackoffDelay(attempt);
          if (showNotifications) {
            toast.warning(`Rate limited. Retrying in ${delay / 1000}s...`);
          }
          await sleep(delay);
          continue;
        }

        // Try fallback model
        if (this.fallbackEnabled && this.shouldFallback(error, statusCode)) {
          const fallback = providerRegistry.getNextFallbackModel(currentModel, triedModels);

          if (fallback) {
            if (typeof fallback === 'object' && fallback.switchProvider) {
              providerRegistry.setCurrent(fallback.switchProvider);
              currentModel = fallback.model;
            } else {
              currentModel = fallback;
            }

            triedModels.push(currentModel);
            if (showNotifications) {
              toast.info('Switching to fallback model...');
            }
            continue;
          }
        }
      }
    }

    // Restore original model
    provider.setModel(originalModel);
    throw lastError || new Error('All models failed. Please try again later.');
  }

  /**
   * Check if error is retryable
   * @param {Error} error - Error object
   * @param {number} statusCode - HTTP status code
   * @returns {boolean}
   */
  isRetryableError(error, statusCode) {
    // Rate limit errors
    if (statusCode === 429) return true;
    
    // Server errors
    if (statusCode >= 500 && statusCode < 600) return true;
    
    // Network errors
    if (error.message?.includes('network') || error.message?.includes('fetch')) {
      return true;
    }

    return false;
  }

  /**
   * Check if we should try fallback
   * @param {Error} error - Error object
   * @param {number} statusCode - HTTP status code
   * @returns {boolean}
   */
  shouldFallback(error, statusCode) {
    // Rate limit
    if (statusCode === 429) return true;
    
    // Model not available
    if (statusCode === 404) return true;
    
    // Server errors
    if (statusCode >= 500) return true;
    
    // Capacity issues
    if (error.message?.includes('capacity') || error.message?.includes('overloaded')) {
      return true;
    }

    return false;
  }

  /**
   * Make API request
   * @param {string} endpoint - API endpoint
   * @param {Object} headers - Request headers
   * @param {Object} body - Request body
   * @returns {Promise<Object>}
   */
  async request(endpoint, headers, body) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      await this.handleError(response);
    }

    return response.json();
  }

  /**
   * Make streaming API request
   * @param {string} endpoint - API endpoint
   * @param {Object} headers - Request headers
   * @param {Object} body - Request body
   * @param {Function} onChunk - Callback for each chunk
   * @param {AbortController} controller - Abort controller
   * @returns {Promise<string>}
   */
  async streamRequest(endpoint, headers, body, onChunk, controller = null) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...body, stream: true }),
      signal: controller?.signal
    });

    if (!response.ok) {
      await this.handleError(response);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.delta?.content || 
                          json.delta?.text || '';
            
            if (content) {
              fullContent += content;
              if (onChunk) onChunk(content, fullContent);
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    }

    return fullContent;
  }

  /**
   * Handle API error
   * @param {Response} response - Fetch response
   */
  async handleError(response) {
    let errorMessage = `API Error: ${response.status}`;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.error?.message || 
                    errorData.message || 
                    errorData.detail ||
                    errorMessage;
    } catch {
      // Use default error message
    }

    const error = new Error(errorMessage);
    error.statusCode = response.status;
    throw error;
  }

  /**
   * Toggle fallback mode
   * @param {boolean} enabled
   */
  setFallbackEnabled(enabled) {
    this.fallbackEnabled = enabled;
    storage.setFallbackEnabled(enabled);
  }

  /**
   * Check if fallback is enabled
   * @returns {boolean}
   */
  isFallbackEnabled() {
    return this.fallbackEnabled;
  }
}

// Export singleton
export const apiClient = new ApiClient();
export default apiClient;
