/**
 * OpenRouter Provider
 */

import { API_ENDPOINTS } from '../config/constants.js';
import { BaseProvider } from './base-provider.js';

export class OpenRouterProvider extends BaseProvider {
  constructor() {
    super('openrouter');
    this.model = 'anthropic/claude-3.5-sonnet';
  }

  getEndpoint() {
    return API_ENDPOINTS.openrouter;
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Afrikaans Translator'
    };
  }

  formatRequest(messages, maxTokens = 4000, temperature = 0.7) {
    return {
      model: this.model,
      messages: messages,
      max_tokens: maxTokens,
      temperature: temperature
    };
  }

  parseResponse(data) {
    return data.choices?.[0]?.message?.content || '';
  }

  setModel(model) {
    this.model = model;
  }

  getModel() {
    return this.model;
  }
}

export default OpenRouterProvider;
