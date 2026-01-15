/**
 * Google Gemini Provider
 */

import { API_ENDPOINTS } from '../config/constants.js';
import { BaseProvider } from './base-provider.js';

export class GoogleProvider extends BaseProvider {
  constructor() {
    super('google');
    this.model = 'gemini-1.5-flash';
  }

  getEndpoint() {
    return `${API_ENDPOINTS.google}/${this.model}:generateContent?key=${this.apiKey}`;
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json'
    };
  }

  formatRequest(messages, maxTokens = 4000, temperature = 0.7) {
    // Convert messages to Gemini format
    const contents = messages
      .filter(m => m.role !== 'system')
      .map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

    // Add system instruction if present
    const systemMessage = messages.find(m => m.role === 'system');
    
    return {
      contents: contents,
      systemInstruction: systemMessage ? { parts: [{ text: systemMessage.content }] } : undefined,
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: temperature
      }
    };
  }

  parseResponse(data) {
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  supportsStreaming() {
    return false; // Gemini streaming requires different handling
  }

  setModel(model) {
    this.model = model;
  }

  getModel() {
    return this.model;
  }
}

export default GoogleProvider;
