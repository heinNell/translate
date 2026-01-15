/**
 * Grok Provider (xAI)
 */

import { API_ENDPOINTS } from '../config/constants.js';
import { BaseProvider } from './base-provider.js';

export class GrokProvider extends BaseProvider {
  constructor() {
    super('grok');
    this.model = 'grok-beta';
  }

  getEndpoint() {
    return API_ENDPOINTS.grok;
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
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

export default GrokProvider;
