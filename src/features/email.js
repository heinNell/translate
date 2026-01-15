/**
 * Email Translation Feature Module
 */

import { TEXT_LIMITS } from '../config/constants.js';
import { emailSignatureHTML, emailSignaturePlainText } from '../config/signature.js';
import { apiClient } from '../core/api-client.js';
import { providerRegistry } from '../providers/index.js';
import { extractJson } from '../utils/helpers.js';
import { getEmailSystemPrompt } from './prompts.js';

class EmailService {
  constructor() {
    this.currentEmail = null;
    this.signature = emailSignaturePlainText;
    this.signatureHTML = emailSignatureHTML;
  }

  /**
   * Translate email from Afrikaans to English
   * @param {string} text - Afrikaans email text
   * @returns {Promise<Object>} Email translation result
   */
  async translateEmail(text) {
    // Validate input
    if (!text || !text.trim()) {
      throw new Error('Please enter some Afrikaans email text to translate.');
    }

    if (text.length > TEXT_LIMITS.maxTranslationLength) {
      throw new Error(`Text is too long. Maximum ${TEXT_LIMITS.maxTranslationLength} characters allowed.`);
    }

    // Get API config
    const apiConfig = providerRegistry.getApiConfig();
    if (!apiConfig.isConfigured) {
      throw new Error('Please configure your API key in Settings.');
    }

    // Execute API call
    const result = await this.callEmailAPI(text);
    
    // Add signature
    result.signature = this.signature;
    
    this.currentEmail = result;
    return result;
  }

  /**
   * Call email translation API
   * @param {string} text - Text to translate
   * @returns {Promise<Object>}
   */
  async callEmailAPI(text) {
    const systemPrompt = getEmailSystemPrompt();
    const apiConfig = providerRegistry.getApiConfig();
    const provider = providerRegistry.getCurrent();

    // Build messages
    const userContent = `Translate the following Afrikaans email text to English and format it as a professional email ready for copy-pasting:\n\n"${text}"`;

    const messages = apiConfig.isO1Model
      ? [{ role: 'user', content: `${systemPrompt}\n\n---\n\n${userContent}` }]
      : [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent }
        ];

    // Make request
    const requestBody = provider.formatRequest(messages, 8000, 0.3);
    
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
      return result;
    }

    // Fallback
    const bodyText = content.replace(/[{}"]/g, '').trim();
    return {
      subject: 'Email',
      greeting: 'Hello,',
      body: bodyText,
      closing: 'Kind regards,',
      signature: '[Your Name]',
      fullEmail: `Hello,\n\n${bodyText}\n\nKind regards,\n[Your Name]`,
      alternativeGreetings: [],
      alternativeClosings: [],
      emailTone: { detected: ['neutral'], suggestions: '' },
      alternativeVersions: []
    };
  }

  /**
   * Format full email with signature
   * @param {Object} email - Email object
   * @param {string} greeting - Selected greeting
   * @param {string} closing - Selected closing
   * @returns {string}
   */
  formatFullEmail(email, greeting = null, closing = null) {
    const g = greeting || email.greeting;
    const c = closing || email.closing;
    return `${g}\n\n${email.body}\n\n${c}\n\n${this.signature}`;
  }

  /**
   * Get current email
   * @returns {Object|null}
   */
  getCurrent() {
    return this.currentEmail;
  }

  /**
   * Clear current email
   */
  clear() {
    this.currentEmail = null;
  }

  /**
   * Set custom signature
   * @param {string} signature - Plain text signature
   */
  setSignature(signature) {
    this.signature = signature;
  }

  /**
   * Get signature
   * @returns {string}
   */
  getSignature() {
    return this.signature;
  }
}

// Export singleton
export const emailService = new EmailService();
export default emailService;
