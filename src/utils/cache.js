/**
 * Cache Utility - LRU Cache with TTL for translation results
 * Reduces API calls and improves response time for repeated translations
 */

/**
 * @typedef {Object} CacheEntry
 * @property {*} value - Cached value
 * @property {number} timestamp - When the entry was created
 * @property {number} hits - Number of times accessed
 */

/**
 * @typedef {Object} CacheOptions
 * @property {number} maxSize - Maximum number of entries
 * @property {number} ttl - Time to live in milliseconds
 * @property {string} storageKey - Key for localStorage persistence
 */

const DEFAULT_OPTIONS = {
  maxSize: 500,
  ttl: 24 * 60 * 60 * 1000, // 24 hours
  storageKey: 'translation_cache'
};

class TranslationCache {
  /**
   * @param {CacheOptions} options
   */
  constructor(options = {}) {
    /** @type {CacheOptions} */
    this.options = { ...DEFAULT_OPTIONS, ...options };
    
    /** @type {Map<string, CacheEntry>} */
    this.cache = new Map();
    
    /** @type {number} */
    this.hits = 0;
    
    /** @type {number} */
    this.misses = 0;
    
    this.loadFromStorage();
  }

  /**
   * Generate cache key from input parameters
   * @param {string} text - Input text
   * @param {string} mode - Translation mode (translate, enhance, email, etc.)
   * @param {string} provider - AI provider
   * @param {string} model - Model name
   * @returns {string} Cache key
   */
  generateKey(text, mode, provider, model) {
    // Normalize text for better cache hits
    const normalizedText = text.trim().toLowerCase();
    return `${mode}:${provider}:${model}:${this.hashString(normalizedText)}`;
  }

  /**
   * Simple string hash for cache keys
   * @param {string} str - Input string
   * @returns {string} Hash
   */
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  /**
   * Get cached translation
   * @param {string} key - Cache key
   * @returns {*|null} Cached value or null
   */
  get(key) {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.misses++;
      return null;
    }
    
    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.options.ttl) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }
    
    // Update access count and move to end (LRU)
    entry.hits++;
    this.cache.delete(key);
    this.cache.set(key, entry);
    
    this.hits++;
    return entry.value;
  }

  /**
   * Store translation in cache
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   */
  set(key, value) {
    // Evict oldest entries if at capacity
    while (this.cache.size >= this.options.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      hits: 0
    });
    
    // Debounce save to storage
    this.scheduleSave();
  }

  /**
   * Check if key exists and is valid
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  has(key) {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() - entry.timestamp > this.options.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Clear the entire cache
   */
  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
    localStorage.removeItem(this.options.storageKey);
  }

  /**
   * Remove expired entries
   */
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp > this.options.ttl) {
        this.cache.delete(key);
      }
    }
    this.saveToStorage();
  }

  /**
   * Get cache statistics
   * @returns {{size: number, hits: number, misses: number, hitRate: number}}
   */
  getStats() {
    const total = this.hits + this.misses;
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? (this.hits / total * 100).toFixed(1) : 0
    };
  }

  /**
   * Schedule a debounced save to localStorage
   * @private
   */
  scheduleSave() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => this.saveToStorage(), 1000);
  }

  /**
   * Save cache to localStorage
   * @private
   */
  saveToStorage() {
    try {
      const entries = Array.from(this.cache.entries())
        .slice(-100); // Only persist last 100 entries
      
      localStorage.setItem(this.options.storageKey, JSON.stringify({
        version: 1,
        entries,
        stats: { hits: this.hits, misses: this.misses }
      }));
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
    }
  }

  /**
   * Load cache from localStorage
   * @private
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.options.storageKey);
      if (!stored) return;
      
      const data = JSON.parse(stored);
      if (data.version !== 1) return;
      
      // Restore entries, filtering expired ones
      const now = Date.now();
      for (const [key, entry] of data.entries) {
        if (now - entry.timestamp <= this.options.ttl) {
          this.cache.set(key, entry);
        }
      }
      
      if (data.stats) {
        this.hits = data.stats.hits || 0;
        this.misses = data.stats.misses || 0;
      }
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
    }
  }
}

// Singleton instance
export const translationCache = new TranslationCache();

/**
 * Cached translation wrapper
 * @param {Function} translateFn - Original translation function
 * @param {string} text - Input text
 * @param {string} mode - Translation mode
 * @param {string} provider - Provider name
 * @param {string} model - Model name
 * @returns {Promise<*>}
 */
export async function cachedTranslate(translateFn, text, mode, provider, model) {
  const key = translationCache.generateKey(text, mode, provider, model);
  
  // Check cache first
  const cached = translationCache.get(key);
  if (cached !== null) {
    console.log('Cache hit:', key);
    return cached;
  }
  
  // Execute translation
  const result = await translateFn();
  
  // Cache the result
  translationCache.set(key, result);
  
  return result;
}

export default translationCache;
