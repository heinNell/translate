/**
 * Together AI Provider (Free tier available)
 */

import { API_ENDPOINTS } from '../config/constants.js';
import { BaseProvider } from './base-provider.js';

export class TogetherProvider extends BaseProvider {
  constructor() {
    super('together');
    this.model = 'meta-llama/Llama-3.3-70B-Instruct-Turbo';
  }

  getEndpoint() {
    return API_ENDPOINTS.together;
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

  // Together has free tier credits
  isFree() {
    return true;
  }

  setModel(model) {
    this.model = model;
  }

  getModel() {
    return this.model;
  }
}

export default TogetherProvider;
