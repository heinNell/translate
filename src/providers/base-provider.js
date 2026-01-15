/**
 * Base Provider - Abstract class for all AI providers
 */

export class BaseProvider {
  constructor(name) {
    this.name = name;
    this.apiKey = '';
  }

  /**
   * Get the API endpoint
   * @returns {string}
   */
  getEndpoint() {
    throw new Error('Must implement getEndpoint()');
  }

  /**
   * Get request headers
   * @returns {Object}
   */
  getHeaders() {
    throw new Error('Must implement getHeaders()');
  }

  /**
   * Format request body
   * @param {Array} messages - Chat messages
   * @param {number} maxTokens - Maximum tokens
   * @param {number} temperature - Temperature setting
   * @returns {Object}
   */
  formatRequest(messages, maxTokens = 4000, temperature = 0.7) {
    throw new Error('Must implement formatRequest()');
  }

  /**
   * Parse API response
   * @param {Object} data - Response data
   * @returns {string} Extracted content
   */
  parseResponse(data) {
    throw new Error('Must implement parseResponse()');
  }

  /**
   * Check if provider is configured (has API key)
   * @returns {boolean}
   */
  isConfigured() {
    return Boolean(this.apiKey);
  }

  /**
   * Check if provider supports streaming
   * @returns {boolean}
   */
  supportsStreaming() {
    return true;
  }

  /**
   * Set API key
   * @param {string} apiKey
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * Get provider configuration
   * @returns {Object}
   */
  getConfig() {
    return {
      name: this.name,
      endpoint: this.getEndpoint(),
      headers: this.getHeaders(),
      isConfigured: this.isConfigured(),
      supportsStreaming: this.supportsStreaming()
    };
  }
}

export default BaseProvider;
