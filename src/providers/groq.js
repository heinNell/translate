/**
 * Groq Provider (Free tier)
 */

import { API_ENDPOINTS } from '../config/constants.js';
import { BaseProvider } from './base-provider.js';

export class GroqProvider extends BaseProvider {
  constructor() {
    super('groq');
    this.model = 'llama-3.3-70b-versatile';
  }

  getEndpoint() {
    return API_ENDPOINTS.groq;
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

  // Groq has a free tier
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

export default GroqProvider;
