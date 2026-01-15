// Supabase Edge Function: Save API Key
// Securely encrypts and stores API keys

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const VALID_PROVIDERS = [
  'openrouter', 'anthropic', 'openai', 'google',
  'deepseek', 'grok', 'morph', 'groq', 'together', 'ollama'
]

interface SaveKeyRequest {
  provider: string
  apiKey: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    const body: SaveKeyRequest = await req.json()
    const { provider, apiKey } = body

    if (!provider || !apiKey) {
      throw new Error('Missing required fields: provider, apiKey')
    }

    if (!VALID_PROVIDERS.includes(provider)) {
      throw new Error(`Invalid provider: ${provider}`)
    }

    // Get encryption key from environment
    const encryptionKey = Deno.env.get('API_KEY_ENCRYPTION_SECRET')
    if (!encryptionKey) {
      throw new Error('Server configuration error')
    }

    // Encrypt the API key using database function
    const { data: encryptedKey, error: encryptError } = await supabaseClient
      .rpc('encrypt_api_key', {
        plain_key: apiKey,
        encryption_key: encryptionKey
      })

    if (encryptError) {
      throw new Error('Failed to encrypt API key')
    }

    // Get last 4 characters as hint
    const keyHint = apiKey.slice(-4)

    // Upsert the API key
    const { error: upsertError } = await supabaseClient
      .from('api_keys')
      .upsert({
        user_id: user.id,
        provider,
        encrypted_key: encryptedKey,
        key_hint: keyHint,
        is_valid: true,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,provider'
      })

    if (upsertError) {
      throw new Error('Failed to save API key')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `API key saved for ${provider}`,
        hint: `****${keyHint}`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
