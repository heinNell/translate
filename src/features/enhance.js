/**
 * Enhancement Feature Module
 */

import { TEXT_LIMITS } from '../config/constants.js';
import { apiClient } from '../core/api-client.js';
import { providerRegistry } from '../providers/index.js';
import { extractJson } from '../utils/helpers.js';
import { getEnhancementSystemPrompt } from './prompts.js';

class EnhancementService {
  constructor() {
    this.currentEnhancement = null;
  }

  /**
   * Enhance text
   * @param {string} text - Text to enhance
   * @returns {Promise<Object>} Enhancement result
   */
  async enhance(text) {
    // Validate input
    if (!text || !text.trim()) {
      throw new Error('Please enter some text to enhance.');
    }

    if (text.length > TEXT_LIMITS.maxTranslationLength) {
      throw new Error(`Text is too long. Maximum ${TEXT_LIMITS.maxTranslationLength} characters allowed.`);
    }

    // Get API config
    const apiConfig = providerRegistry.getApiConfig();
    if (!apiConfig.isConfigured) {
      throw new Error('Please configure your API key in Settings.');
    }

    // Execute with fallback
    const result = await apiClient.executeWithFallback(
      () => this.callEnhancementAPI(text),
      { showNotifications: true }
    );

    this.currentEnhancement = result;
    return result;
  }

  /**
   * Call enhancement API
   * @param {string} text - Text to enhance
   * @returns {Promise<Object>}
   */
  async callEnhancementAPI(text) {
    const systemPrompt = getEnhancementSystemPrompt();
    const apiConfig = providerRegistry.getApiConfig();
    const provider = providerRegistry.getCurrent();

    // Build messages
    const userContent = `Please enhance the following text. Provide improved sentence structure, suggestions for additions, and ideas to enhance the information:\n\n"${text}"`;

    const messages = apiConfig.isO1Model
      ? [{ role: 'user', content: `${systemPrompt}\n\n---\n\n${userContent}` }]
      : [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ];

    // Make request
    const requestBody = provider.formatRequest(messages, 16000, 0.4);
    
    const response = await fetch(apiConfig.endpoint, {
      method: 'POST',
      headers: apiConfig.headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      await apiClient.handleError(response);
    }

    const data = await response.json();
    const content = provider.parseResponse(data);

    if (!content) {
      throw new Error('No enhancement received from API');
    }

    // Parse JSON response
    const result = extractJson(content);
    
    if (result) {
      return result;
    }

    // Fallback
    return {
      enhancedText: content.replace(/[{}"]/g, '').trim(),
      structureImprovements: [],
      suggestedAdditions: [],
      enhancementIdeas: [],
      alternativeVersions: [],
      toneSuggestions: [],
      clarityScore: 0.7,
      clarityNote: 'Unable to provide detailed analysis.'
    };
  }

  /**
   * Get current enhancement
   * @returns {Object|null}
   */
  getCurrent() {
    return this.currentEnhancement;
  }

  /**
   * Clear current enhancement
   */
  clear() {
    this.currentEnhancement = null;
  }
}

// Export singleton
export const enhancementService = new EnhancementService();
export default enhancementService;
