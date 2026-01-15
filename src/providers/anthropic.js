/**
 * Anthropic Provider (Direct API)
 */

import { API_ENDPOINTS } from '../config/constants.js';
import { BaseProvider } from './base-provider.js';

export class AnthropicProvider extends BaseProvider {
  constructor() {
    super('anthropic');
    this.model = 'claude-3-5-sonnet-20241022';
  }

  getEndpoint() {
    return API_ENDPOINTS.anthropic;
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    };
  }

  formatRequest(messages, maxTokens = 4000, temperature = 0.7) {
    // Anthropic uses a different format - separate system from messages
    const systemMessage = messages.find(m => m.role === 'system');
    const otherMessages = messages.filter(m => m.role !== 'system');

    return {
      model: this.model,
      max_tokens: maxTokens,
      system: systemMessage?.content || '',
      messages: otherMessages
    };
  }

  parseResponse(data) {
    return data.content?.[0]?.text || '';
  }

  supportsStreaming() {
    return true;
  }

  setModel(model) {
    this.model = model;
  }

  getModel() {
    return this.model;
  }
}

export default AnthropicProvider;
