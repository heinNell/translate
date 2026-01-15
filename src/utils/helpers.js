/**
 * Helper Utilities
 */

import { AFRIKAANS_ABBREVIATIONS } from '../config/constants.js';

/**
 * Debounce function - delays execution until after wait ms have elapsed
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle function - ensures function is called at most once per wait ms
 * @param {Function} fn - Function to throttle
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(fn, wait = 100) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= wait) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}

/**
 * Sleep utility - pause execution for specified time
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Format number with K/M suffixes
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

/**
 * Generate unique ID
 * @param {string} prefix - Optional prefix
 * @returns {string} Unique ID
 */
export function generateId(prefix = '') {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if string is valid JSON
 * @param {string} str - String to check
 * @returns {boolean}
 */
export function isValidJson(str) {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract JSON from text that may contain other content
 * @param {string} text - Text containing JSON
 * @returns {Object|null} Parsed JSON or null
 */
export function extractJson(text) {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Split text into sentences with intelligent handling
 * @param {string} text - Text to split
 * @returns {Array<string>} Array of sentences
 */
export function splitIntoSentences(text) {
  if (!text || typeof text !== 'string') return [];
  
  // Create regex pattern for abbreviations
  const abbrPattern = AFRIKAANS_ABBREVIATIONS.join('|');
  
  // Protect abbreviations by replacing periods temporarily
  let processed = text;
  const protectedItems = [];
  let protectIndex = 0;
  
  // Protect abbreviations (case insensitive)
  const abbrRegex = new RegExp(`\\b(${abbrPattern})\\.`, 'gi');
  processed = processed.replace(abbrRegex, (match) => {
    const placeholder = `__ABBR${protectIndex}__`;
    protectedItems.push({ placeholder, original: match });
    protectIndex++;
    return placeholder;
  });
  
  // Protect numbers with decimals
  processed = processed.replace(/(\d+)\.(\d+)/g, (match) => {
    const placeholder = `__NUM${protectIndex}__`;
    protectedItems.push({ placeholder, original: match });
    protectIndex++;
    return placeholder;
  });
  
  // Protect ellipsis
  processed = processed.replace(/\.{3,}/g, (match) => {
    const placeholder = `__ELL${protectIndex}__`;
    protectedItems.push({ placeholder, original: match });
    protectIndex++;
    return placeholder;
  });
  
  // Protect email addresses
  processed = processed.replace(/\S+@\S+\.\S+/g, (match) => {
    const placeholder = `__EMAIL${protectIndex}__`;
    protectedItems.push({ placeholder, original: match });
    protectIndex++;
    return placeholder;
  });
  
  // Protect URLs
  processed = processed.replace(/https?:\/\/[^\s]+/g, (match) => {
    const placeholder = `__URL${protectIndex}__`;
    protectedItems.push({ placeholder, original: match });
    protectIndex++;
    return placeholder;
  });
  
  // Split on sentence-ending punctuation
  const sentenceEnders = /([.!?]+)(\s+|$)/g;
  const rawSentences = processed.split(sentenceEnders);
  
  // Reconstruct sentences
  const sentences = [];
  let currentSentence = '';
  
  for (let i = 0; i < rawSentences.length; i++) {
    const part = rawSentences[i];
    if (!part) continue;
    
    if (/^[.!?]+$/.test(part)) {
      currentSentence += part;
    } else if (/^\s+$/.test(part)) {
      if (currentSentence.trim()) {
        sentences.push(currentSentence.trim());
        currentSentence = '';
      }
    } else {
      currentSentence += part;
    }
  }
  
  if (currentSentence.trim()) {
    sentences.push(currentSentence.trim());
  }
  
  // Restore protected items
  const restoredSentences = sentences.map(sentence => {
    let restored = sentence;
    protectedItems.forEach(item => {
      restored = restored.replace(item.placeholder, item.original);
    });
    return restored;
  });
  
  return restoredSentences.filter(s => s && s.length > 1);
}

/**
 * Get readable model name from model ID
 * @param {string} modelId - Model ID
 * @returns {string} Human-readable name
 */
export function getReadableModelName(modelId) {
  if (!modelId) return 'AI Model';
  
  const modelNames = {
    'anthropic/claude-3.5-sonnet': 'Claude 3.5 Sonnet',
    'anthropic/claude-3-opus': 'Claude 3 Opus',
    'anthropic/claude-3-haiku': 'Claude 3 Haiku',
    'openai/gpt-4-turbo': 'GPT-4 Turbo',
    'openai/gpt-4o': 'GPT-4o',
    'openai/gpt-4o-mini': 'GPT-4o Mini',
    'google/gemini-pro': 'Gemini Pro',
    'google/gemini-1.5-pro': 'Gemini 1.5 Pro',
    'deepseek/deepseek-chat': 'DeepSeek',
    'meta/llama-3': 'Llama 3',
    'claude-3-5-sonnet-20241022': 'Claude 3.5 Sonnet',
    'claude-3-opus-20240229': 'Claude 3 Opus',
    'gpt-4-turbo-preview': 'GPT-4 Turbo',
    'gpt-4o': 'GPT-4o',
    'gpt-4o-mini': 'GPT-4o Mini',
    'gemini-1.5-pro': 'Gemini 1.5 Pro',
    'gemini-1.5-flash': 'Gemini 1.5 Flash',
    'deepseek-chat': 'DeepSeek',
    'llama-3.3-70b-versatile': 'Llama 3.3 70B',
    'llama-3.1-8b-instant': 'Llama 3.1 8B',
    'llama3.2': 'Llama 3.2',
    'mistral': 'Mistral',
    'qwen2.5': 'Qwen 2.5'
  };
  
  return modelNames[modelId] || modelId.split('/').pop()?.replace(/-/g, ' ') || 'AI Model';
}

/**
 * Check if model supports vision
 * @param {string} model - Model ID
 * @returns {boolean}
 */
export function isVisionModel(model) {
  const visionKeywords = [
    'gpt-4o', 'gpt-4-vision', 'gpt-4-turbo',
    'claude-3', 'claude-3.5',
    'gemini-1.5', 'gemini-2',
    'grok-2-vision', 'grok-vision'
  ];
  const modelLower = model.toLowerCase();
  return visionKeywords.some(vm => modelLower.includes(vm));
}

/**
 * Check if model is O1 (doesn't support system messages)
 * @param {string} model - Model ID
 * @returns {boolean}
 */
export function isO1Model(model) {
  return model.includes('o1-') || model.includes('/o1');
}

/**
 * Calculate exponential backoff delay
 * @param {number} attempt - Current attempt number (1-based)
 * @param {number} baseDelay - Base delay in ms
 * @param {number} maxDelay - Maximum delay in ms
 * @returns {number} Delay in ms
 */
export function getBackoffDelay(attempt, baseDelay = 1000, maxDelay = 10000) {
  const delay = baseDelay * Math.pow(2, attempt - 1);
  return Math.min(delay, maxDelay);
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncate(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export function formatDate(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString();
}

/**
 * Format time for display
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted time
 */
export function formatTime(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString();
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Download content as file
 * @param {string} content - Content to download
 * @param {string} filename - File name
 * @param {string} mimeType - MIME type
 */
export function downloadFile(content, filename, mimeType = 'application/json') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
