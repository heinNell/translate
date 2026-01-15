/**
 * Supabase Client Module
 * Handles authentication and API calls to Supabase backend
 */

import { createClient } from '@supabase/supabase-js';

// These will be replaced with actual values from environment
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * @typedef {Object} Profile
 * @property {string} id
 * @property {string} email
 * @property {string} display_name
 * @property {string} preferred_provider
 * @property {string} preferred_model
 * @property {string} theme
 */

/**
 * @typedef {Object} Translation
 * @property {string} id
 * @property {string} source_text
 * @property {string} translated_text
 * @property {string} mode
 * @property {string} provider
 * @property {string} model
 * @property {string} formality
 * @property {Object[]} alternatives
 * @property {string} cultural_notes
 * @property {boolean} is_favorite
 * @property {string} created_at
 */

/**
 * @typedef {Object} UsageStats
 * @property {Object[]} monthly_usage
 * @property {Object[]} daily_usage
 * @property {Object} totals
 */

class SupabaseClient {
    constructor() {
        /** @type {import('@supabase/supabase-js').SupabaseClient | null} */
        this.client = null;
        /** @type {import('@supabase/supabase-js').User | null} */
        this.user = null;
        /** @type {Function[]} */
        this.authListeners = [];
    }

    /**
     * Initialize the Supabase client
     * @returns {boolean} Whether initialization was successful
     */
    init() {
        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            console.warn('Supabase credentials not configured. Cloud features disabled.');
            return false;
        }

        this.client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true
            }
        });

        // Listen for auth changes
        this.client.auth.onAuthStateChange((event, session) => {
            this.user = session?.user || null;
            this.authListeners.forEach(listener => listener(this.user, event));
        });

        return true;
    }

    /**
     * Check if Supabase is configured
     * @returns {boolean}
     */
    isConfigured() {
        return this.client !== null;
    }

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        return this.user !== null;
    }

    /**
     * Subscribe to auth state changes
     * @param {Function} listener 
     * @returns {Function} Unsubscribe function
     */
    onAuthChange(listener) {
        this.authListeners.push(listener);
        return () => {
            this.authListeners = this.authListeners.filter(l => l !== listener);
        };
    }

    // ==================== AUTH ====================

    /**
     * Sign up with email and password
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<{user: Object, error: Error | null}>}
     */
    async signUp(email, password) {
        if (!this.client) return { user: null, error: new Error('Not configured') };
        
        const { data, error } = await this.client.auth.signUp({
            email,
            password
        });
        return { user: data?.user, error };
    }

    /**
     * Sign in with email and password
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<{user: Object, error: Error | null}>}
     */
    async signIn(email, password) {
        if (!this.client) return { user: null, error: new Error('Not configured') };
        
        const { data, error } = await this.client.auth.signInWithPassword({
            email,
            password
        });
        return { user: data?.user, error };
    }

    /**
     * Sign in with OAuth provider
     * @param {'google' | 'github'} provider 
     * @returns {Promise<{error: Error | null}>}
     */
    async signInWithProvider(provider) {
        if (!this.client) return { error: new Error('Not configured') };
        
        const { error } = await this.client.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: window.location.origin
            }
        });
        return { error };
    }

    /**
     * Sign out
     * @returns {Promise<{error: Error | null}>}
     */
    async signOut() {
        if (!this.client) return { error: new Error('Not configured') };
        
        const { error } = await this.client.auth.signOut();
        return { error };
    }

    /**
     * Reset password
     * @param {string} email 
     * @returns {Promise<{error: Error | null}>}
     */
    async resetPassword(email) {
        if (!this.client) return { error: new Error('Not configured') };
        
        const { error } = await this.client.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        });
        return { error };
    }

    // ==================== PROFILE ====================

    /**
     * Get current user's profile
     * @returns {Promise<Profile | null>}
     */
    async getProfile() {
        if (!this.client || !this.user) return null;
        
        const { data, error } = await this.client
            .from('profiles')
            .select('*')
            .eq('id', this.user.id)
            .single();
        
        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
        return data;
    }

    /**
     * Update user's profile
     * @param {Partial<Profile>} updates 
     * @returns {Promise<{success: boolean, error: Error | null}>}
     */
    async updateProfile(updates) {
        if (!this.client || !this.user) {
            return { success: false, error: new Error('Not authenticated') };
        }
        
        const { error } = await this.client
            .from('profiles')
            .update(updates)
            .eq('id', this.user.id);
        
        return { success: !error, error };
    }

    // ==================== API KEYS ====================

    /**
     * Save an API key securely
     * @param {string} provider 
     * @param {string} apiKey 
     * @returns {Promise<{success: boolean, hint: string, error: Error | null}>}
     */
    async saveApiKey(provider, apiKey) {
        if (!this.client || !this.user) {
            return { success: false, hint: '', error: new Error('Not authenticated') };
        }
        
        const { data, error } = await this.client.functions.invoke('save-api-key', {
            body: { provider, apiKey }
        });
        
        if (error) {
            return { success: false, hint: '', error };
        }
        return { success: true, hint: data.hint, error: null };
    }

    /**
     * Get list of configured API keys (hints only, not actual keys)
     * @returns {Promise<Array<{provider: string, hint: string, is_valid: boolean}>>}
     */
    async getApiKeysList() {
        if (!this.client || !this.user) return [];
        
        const { data, error } = await this.client
            .from('api_keys')
            .select('provider, key_hint, is_valid')
            .eq('user_id', this.user.id);
        
        if (error) {
            console.error('Error fetching API keys:', error);
            return [];
        }
        
        return data.map(row => ({
            provider: row.provider,
            hint: row.key_hint,
            is_valid: row.is_valid
        }));
    }

    /**
     * Delete an API key
     * @param {string} provider 
     * @returns {Promise<{success: boolean, error: Error | null}>}
     */
    async deleteApiKey(provider) {
        if (!this.client || !this.user) {
            return { success: false, error: new Error('Not authenticated') };
        }
        
        const { error } = await this.client
            .from('api_keys')
            .delete()
            .eq('user_id', this.user.id)
            .eq('provider', provider);
        
        return { success: !error, error };
    }

    // ==================== TRANSLATIONS ====================

    /**
     * Translate text via cloud function
     * @param {Object} params
     * @param {string} params.text
     * @param {string} params.mode
     * @param {string} params.provider
     * @param {string} params.model
     * @param {boolean} [params.stream]
     * @returns {Promise<{result: Object, error: Error | null}>}
     */
    async translate({ text, mode, provider, model, stream = false }) {
        if (!this.client || !this.user) {
            return { result: null, error: new Error('Not authenticated') };
        }
        
        const { data, error } = await this.client.functions.invoke('translate', {
            body: { text, mode, provider, model, stream }
        });
        
        return { result: data, error };
    }

    /**
     * Save a translation to history
     * @param {Object} translation 
     * @returns {Promise<{id: string, error: Error | null}>}
     */
    async saveTranslation(translation) {
        if (!this.client || !this.user) {
            return { id: null, error: new Error('Not authenticated') };
        }
        
        const { data, error } = await this.client.functions.invoke('save-translation', {
            body: translation
        });
        
        return { id: data?.translation?.id, error };
    }

    /**
     * Get translation history
     * @param {Object} params
     * @param {number} [params.page]
     * @param {number} [params.limit]
     * @param {string} [params.search]
     * @param {string} [params.mode]
     * @param {boolean} [params.favorites_only]
     * @returns {Promise<{translations: Translation[], pagination: Object, error: Error | null}>}
     */
    async getHistory({ page = 1, limit = 20, search, mode, favorites_only } = {}) {
        if (!this.client || !this.user) {
            return { translations: [], pagination: {}, error: new Error('Not authenticated') };
        }
        
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (search) params.set('search', search);
        if (mode) params.set('mode', mode);
        if (favorites_only) params.set('favorites_only', 'true');
        
        const { data, error } = await this.client.functions.invoke('get-history', {
            body: null,
            headers: {},
            method: 'GET'
        });
        
        if (error) {
            return { translations: [], pagination: {}, error };
        }
        return { translations: data.translations, pagination: data.pagination, error: null };
    }

    /**
     * Toggle favorite status
     * @param {string} translationId 
     * @param {boolean} isFavorite 
     * @returns {Promise<{success: boolean, error: Error | null}>}
     */
    async toggleFavorite(translationId, isFavorite) {
        if (!this.client || !this.user) {
            return { success: false, error: new Error('Not authenticated') };
        }
        
        const { error } = await this.client
            .from('translations')
            .update({ is_favorite: isFavorite })
            .eq('id', translationId)
            .eq('user_id', this.user.id);
        
        return { success: !error, error };
    }

    /**
     * Delete a translation
     * @param {string} translationId 
     * @returns {Promise<{success: boolean, error: Error | null}>}
     */
    async deleteTranslation(translationId) {
        if (!this.client || !this.user) {
            return { success: false, error: new Error('Not authenticated') };
        }
        
        const { error } = await this.client
            .from('translations')
            .update({ is_deleted: true })
            .eq('id', translationId)
            .eq('user_id', this.user.id);
        
        return { success: !error, error };
    }

    // ==================== SHARING ====================

    /**
     * Share a translation
     * @param {string} translationId 
     * @param {Object} options
     * @param {string} [options.title]
     * @param {number} [options.expires_in_days]
     * @returns {Promise<{share_url: string, share_code: string, error: Error | null}>}
     */
    async shareTranslation(translationId, { title, expires_in_days } = {}) {
        if (!this.client || !this.user) {
            return { share_url: '', share_code: '', error: new Error('Not authenticated') };
        }
        
        const { data, error } = await this.client.functions.invoke('share-translation', {
            body: { translation_id: translationId, title, expires_in_days }
        });
        
        if (error) {
            return { share_url: '', share_code: '', error };
        }
        return { share_url: data.share_url, share_code: data.share_code, error: null };
    }

    /**
     * Get a shared translation by code (public, no auth required)
     * @param {string} shareCode 
     * @returns {Promise<{translation: Object, error: Error | null}>}
     */
    async getSharedTranslation(shareCode) {
        if (!this.client) {
            return { translation: null, error: new Error('Not configured') };
        }
        
        const { data, error } = await this.client
            .rpc('get_shared_translation', { p_share_code: shareCode });
        
        if (error || !data || data.length === 0) {
            return { translation: null, error: error || new Error('Not found') };
        }
        return { translation: data[0], error: null };
    }

    // ==================== USAGE STATS ====================

    /**
     * Get usage statistics
     * @returns {Promise<UsageStats | null>}
     */
    async getUsageStats() {
        if (!this.client || !this.user) return null;
        
        const { data, error } = await this.client.functions.invoke('get-usage');
        
        if (error) {
            console.error('Error fetching usage stats:', error);
            return null;
        }
        return data;
    }
}

// Export singleton instance
export const supabase = new SupabaseClient();

// Also export the class for testing
export { SupabaseClient };
