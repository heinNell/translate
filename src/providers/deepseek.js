/**
 * DeepSeek Provider
 */

import { API_ENDPOINTS } from '../config/constants.js';
import { BaseProvider } from './base-provider.js';

export class DeepSeekProvider extends BaseProvider {
  constructor() {
    super('deepseek');
    this.model = 'deepseek-chat';
  }

  getEndpoint() {
    return API_ENDPOINTS.deepseek;
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

export default DeepSeekProvider;
