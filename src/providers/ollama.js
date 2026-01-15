/**
 * Ollama Provider (Local/Free)
 */

import { BaseProvider } from './base-provider.js';

export class OllamaProvider extends BaseProvider {
  constructor() {
    super('ollama');
    this.model = 'llama3.2';
    this.baseUrl = 'http://localhost:11434';
  }

  getEndpoint() {
    return `${this.baseUrl}/v1/chat/completions`;
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json'
    };
  }

  formatRequest(messages, maxTokens = 4000, temperature = 0.7) {
    return {
      model: this.model,
      messages: messages,
      max_tokens: maxTokens,
      temperature: temperature,
      stream: false
    };
  }

  parseResponse(data) {
    return data.choices?.[0]?.message?.content || '';
  }

  // Ollama doesn't need an API key
  isConfigured() {
    return true;
  }

  // Local = free
  isFree() {
    return true;
  }

  isLocal() {
    return true;
  }

  supportsStreaming() {
    return true;
  }

  setBaseUrl(url) {
    this.baseUrl = url;
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  setModel(model) {
    this.model = model;
  }

  getModel() {
    return this.model;
  }
}

export default OllamaProvider;
