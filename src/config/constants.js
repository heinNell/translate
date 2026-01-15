/**
 * Application Constants & Configuration
 */

// API Endpoints
export const API_ENDPOINTS = {
  openrouter: 'https://openrouter.ai/api/v1/chat/completions',
  anthropic: 'https://api.anthropic.com/v1/messages',
  openai: 'https://api.openai.com/v1/chat/completions',
  google: 'https://generativelanguage.googleapis.com/v1beta/models',
  deepseek: 'https://api.deepseek.com/v1/chat/completions',
  grok: 'https://api.x.ai/v1/chat/completions',
  morph: 'https://api.morphllm.com/v1/chat/completions',
  groq: 'https://api.groq.com/openai/v1/chat/completions',
  together: 'https://api.together.xyz/v1/chat/completions',
  ollama: 'http://localhost:11434/v1/chat/completions'
};

// Default Models for each provider
export const DEFAULT_MODELS = {
  openrouter: 'anthropic/claude-3.5-sonnet',
  anthropic: 'claude-3-5-sonnet-20241022',
  openai: 'gpt-4o-mini',
  google: 'gemini-1.5-flash',
  deepseek: 'deepseek-chat',
  grok: 'grok-beta',
  morph: 'morph-v1',
  groq: 'llama-3.3-70b-versatile',
  together: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
  ollama: 'llama3.2'
};

// Fallback Model Chains - ordered by priority
export const FALLBACK_CHAINS = {
  openrouter: [
    'anthropic/claude-3.5-sonnet',
    'anthropic/claude-3-haiku',
    'openai/gpt-4o-mini',
    'openai/gpt-4o',
    'google/gemini-1.5-flash',
    'google/gemini-1.5-pro',
    'meta-llama/llama-3.1-70b-instruct',
    'mistralai/mistral-large',
    'deepseek/deepseek-chat'
  ],
  anthropic: [
    'claude-3-5-sonnet-20241022',
    'claude-3-haiku-20240307',
    'claude-3-opus-20240229'
  ],
  openai: [
    'gpt-4o-mini',
    'gpt-4o',
    'gpt-4-turbo',
    'gpt-3.5-turbo'
  ],
  google: [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro'
  ],
  deepseek: [
    'deepseek-chat',
    'deepseek-coder'
  ],
  grok: [
    'grok-beta'
  ],
  morph: [
    'morph-v1'
  ],
  groq: [
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
    'qwen/qwen3-32b',
    'deepseek-r1-distill-llama-70b'
  ],
  together: [
    'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    'meta-llama/Llama-3.2-3B-Instruct-Turbo',
    'mistralai/Mixtral-8x7B-Instruct-v0.1',
    'Qwen/Qwen2.5-7B-Instruct-Turbo'
  ],
  ollama: [
    'llama3.2',
    'llama3.1',
    'mistral',
    'qwen2.5'
  ]
};

// Cross-provider fallback order
export const PROVIDER_FALLBACK_ORDER = [
  'openrouter', 'groq', 'ollama', 'together', 
  'openai', 'anthropic', 'google', 'deepseek', 'grok', 'morph'
];

// Storage Keys
export const STORAGE_KEYS = {
  // API Keys
  openrouterApiKey: 'openrouter_api_key',
  anthropicApiKey: 'anthropic_api_key',
  openaiApiKey: 'openai_api_key',
  googleApiKey: 'google_api_key',
  deepseekApiKey: 'deepseek_api_key',
  grokApiKey: 'grok_api_key',
  morphApiKey: 'morph_api_key',
  groqApiKey: 'groq_api_key',
  togetherApiKey: 'together_api_key',
  ollamaUrl: 'ollama_url',
  
  // Models
  openrouterModel: 'openrouter_model',
  anthropicModel: 'anthropic_model',
  openaiModel: 'openai_model',
  googleModel: 'google_model',
  deepseekModel: 'deepseek_model',
  grokModel: 'grok_model',
  morphModel: 'morph_model',
  groqModel: 'groq_model',
  togetherModel: 'together_model',
  ollamaModel: 'ollama_model',
  
  // Settings
  currentProvider: 'current_provider',
  fallbackEnabled: 'fallback_enabled',
  darkMode: 'dark_mode',
  
  // History
  translationHistory: 'translation_history',
  chatConversations: 'chat_conversations',
  currentChatId: 'current_chat_id',
  agentConversationHistory: 'agent_conversation_history',
  strategyConversationHistory: 'strategy_conversation_history',
  chatSystemPrompt: 'chat_system_prompt',
  totalTokensUsed: 'total_tokens_used'
};

// Application Modes
export const APP_MODES = {
  CHAT: 'chat',
  TRANSLATE: 'translate',
  ENHANCE: 'enhance',
  EMAIL: 'email',
  AGENT: 'agent',
  STRATEGY: 'strategy'
};

// Toast Types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Speech Settings
export const SPEECH_SETTINGS = {
  pauseBetweenSentences: 400,
  defaultRate: 0.9,
  defaultPitch: 1.0,
  defaultVolume: 1.0
};

// Retry Configuration
export const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000
};

// Text Limits
export const TEXT_LIMITS = {
  maxTranslationLength: 5000,
  maxHistoryItems: 50,
  maxChatMessages: 20
};

// System Prompt Templates
export const PROMPT_TEMPLATES = {
  general: 'You are a helpful, friendly AI assistant. Provide clear, accurate, and thoughtful responses. Be concise but thorough.',
  coder: 'You are an expert software engineer and coding assistant. Help with code review, debugging, optimization, and explaining complex concepts. Provide working code examples with clear explanations.',
  writer: 'You are a creative writing assistant with expertise in various writing styles. Help with storytelling, editing, improving prose, and generating creative content. Offer constructive feedback and suggestions.',
  analyst: 'You are a data analysis expert. Help interpret data, suggest analytical approaches, explain statistical concepts, and provide insights. Use clear visualizations and examples when helpful.',
  translator: 'You are an expert translator with deep knowledge of languages and cultures. Translate accurately while preserving meaning, tone, and cultural context. Explain nuances when relevant.'
};

// Afrikaans Abbreviations (for sentence splitting)
export const AFRIKAANS_ABBREVIATIONS = [
  'mnr', 'mev', 'mej', 'dr', 'prof', 'ds', 'adv', 'me', 'sr', 'jr',
  'mr', 'mrs', 'ms', 'dr', 'prof', 'rev', 'hon', 'gen', 'col', 'lt',
  'st', 'vs', 'etc', 'eg', 'ie', 'no', 'nr', 'tel', 'fax', 'ref',
  'dept', 'govt', 'corp', 'inc', 'ltd', 'co', 'bpk', 'edms', 'pty'
];

// Vision-capable Models
export const VISION_MODELS = [
  'gpt-4o', 'gpt-4-vision', 'gpt-4-turbo',
  'claude-3', 'claude-3.5',
  'gemini-1.5', 'gemini-2',
  'grok-2-vision', 'grok-vision'
];
