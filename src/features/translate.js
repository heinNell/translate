/**
 * Translation Feature Module
 */

import { TEXT_LIMITS } from '../config/constants.js';
import { apiClient } from '../core/api-client.js';
import { providerRegistry } from '../providers/index.js';
import { extractJson } from '../utils/helpers.js';
import { storage } from '../utils/storage.js';
import { getTranslationSystemPrompt } from './prompts.js';

class TranslationService {
  constructor() {
    this.currentTranslation = null;
  }

  /**
   * Translate Afrikaans text to English
   * @param {string} text - Afrikaans text
   * @returns {Promise<Object>} Translation result
   */
  async translate(text) {
    // Validate input
    if (!text || !text.trim()) {
      throw new Error('Please enter some Afrikaans text to translate.');
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
      () => this.callTranslationAPI(text),
      { showNotifications: true }
    );

    this.currentTranslation = result;
    return result;
  }

  /**
   * Call translation API
   * @param {string} text - Text to translate
   * @returns {Promise<Object>}
   */
  async callTranslationAPI(text) {
    // Get translation history for context
    const history = storage.getTranslationHistory().slice(-5);
    const systemPrompt = getTranslationSystemPrompt(history);
    
    const apiConfig = providerRegistry.getApiConfig();
    const provider = providerRegistry.getCurrent();

    // Build messages
    const userContent = `Translate the following Afrikaans text to English, provide comprehensive linguistic analysis, AND analyze the content's domain to provide intelligent insights, strategic recommendations, and alternative approaches:\n\n"${text}"`;

    const messages = apiConfig.isO1Model
      ? [{ role: 'user', content: `${systemPrompt}\n\n---\n\n${userContent}` }]
      : [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ];

    // Make request
    const requestBody = provider.formatRequest(messages, 16000, 0.3);
    
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
      throw new Error('No translation received from API');
    }

    // Parse JSON response
    const result = extractJson(content);
    
    if (result) {
      // Save to history
      storage.addToTranslationHistory({
        input: text,
        output: result.translation
      });
      
      return result;
    }

    // Fallback for non-JSON response
    return {
      translation: content.replace(/[{}"]/g, '').trim(),
      formality: 'neutral',
      alternatives: [],
      sentenceSuggestions: [],
      grammarAnalysis: null,
      toneAnalysis: null,
      improvements: [],
      relatedPhrases: [],
      culturalNote: null,
      idiomExplanation: null,
      confidence: 0.7,
      contentIntelligence: null,
      expandedContext: null
    };
  }

  /**
   * Get current translation
   * @returns {Object|null}
   */
  getCurrent() {
    return this.currentTranslation;
  }

  /**
   * Clear current translation
   */
  clear() {
    this.currentTranslation = null;
  }
}

// Export singleton
export const translationService = new TranslationService();
export default translationService;
