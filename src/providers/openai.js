/**
 * OpenAI Provider
 */

import { API_ENDPOINTS } from '../config/constants.js';
import { isO1Model } from '../utils/helpers.js';
import { BaseProvider } from './base-provider.js';

export class OpenAIProvider extends BaseProvider {
  constructor() {
    super('openai');
    this.model = 'gpt-4o-mini';
  }

  getEndpoint() {
    return API_ENDPOINTS.openai;
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };
  }

  formatRequest(messages, maxTokens = 4000, temperature = 0.7) {
    const request = {
      model: this.model,
      messages: messages,
      max_tokens: maxTokens
    };

    // O1 models don't support temperature
    if (!isO1Model(this.model)) {
      request.temperature = temperature;
    }

    return request;
  }

  parseResponse(data) {
    return data.choices?.[0]?.message?.content || '';
  }

  isO1Model() {
    return isO1Model(this.model);
  }

  setModel(model) {
    this.model = model;
  }

  getModel() {
    return this.model;
  }
}

export default OpenAIProvider;
