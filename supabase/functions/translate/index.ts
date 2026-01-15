// Supabase Edge Function: Translate via AI Provider
// This proxies requests through Supabase for secure API key handling

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Provider endpoint configurations
const PROVIDER_ENDPOINTS: Record<string, string> = {
  openrouter: 'https://openrouter.ai/api/v1/chat/completions',
  anthropic: 'https://api.anthropic.com/v1/messages',
  openai: 'https://api.openai.com/v1/chat/completions',
  google: 'https://generativelanguage.googleapis.com/v1beta/models',
  deepseek: 'https://api.deepseek.com/v1/chat/completions',
  grok: 'https://api.x.ai/v1/chat/completions',
  morph: 'https://api.morphllm.com/v1/chat/completions',
  groq: 'https://api.groq.com/openai/v1/chat/completions',
  together: 'https://api.together.xyz/v1/chat/completions',
}

interface TranslateRequest {
  text: string
  mode: 'translate' | 'chat' | 'email' | 'enhance' | 'agent' | 'strategy'
  provider: string
  model: string
  stream?: boolean
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get auth token from request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // Verify user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Parse request body
    const body: TranslateRequest = await req.json()
    const { text, mode, provider, model, stream = false } = body

    if (!text || !provider || !model) {
      throw new Error('Missing required fields: text, provider, model')
    }

    // Get user's API key for this provider
    const encryptionKey = Deno.env.get('API_KEY_ENCRYPTION_SECRET')
    if (!encryptionKey) {
      throw new Error('Server configuration error')
    }

    const { data: keyData, error: keyError } = await supabaseClient
      .rpc('decrypt_api_key_for_user', {
        p_user_id: user.id,
        p_provider: provider,
        p_encryption_key: encryptionKey
      })

    if (keyError || !keyData) {
      throw new Error(`No API key found for provider: ${provider}`)
    }

    const apiKey = keyData

    // Build provider-specific request
    const startTime = Date.now()
    let response: Response

    if (provider === 'anthropic') {
      response = await callAnthropic(apiKey, model, text, mode, stream)
    } else if (provider === 'google') {
      response = await callGoogle(apiKey, model, text, mode, stream)
    } else {
      // OpenAI-compatible providers
      response = await callOpenAICompatible(
        PROVIDER_ENDPOINTS[provider],
        apiKey,
        model,
        text,
        mode,
        stream,
        provider
      )
    }

    const responseTime = Date.now() - startTime

    // Log usage stats
    const responseData = stream ? null : await response.clone().json()
    const tokensUsed = responseData?.usage?.total_tokens || 0

    await supabaseClient.from('usage_stats').insert({
      user_id: user.id,
      provider,
      model,
      mode,
      tokens_input: responseData?.usage?.prompt_tokens || 0,
      tokens_output: responseData?.usage?.completion_tokens || 0,
      response_time_ms: responseTime,
      success: response.ok,
      error_message: response.ok ? null : responseData?.error?.message
    })

    // Return response
    if (stream) {
      return new Response(response.body, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
      })
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

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

// Anthropic API call
async function callAnthropic(
  apiKey: string,
  model: string,
  text: string,
  mode: string,
  stream: boolean
): Promise<Response> {
  const prompt = buildPrompt(text, mode)
  
  return fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      stream,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
}

// Google Gemini API call
async function callGoogle(
  apiKey: string,
  model: string,
  text: string,
  mode: string,
  stream: boolean
): Promise<Response> {
  const prompt = buildPrompt(text, mode)
  const endpoint = stream ? 'streamGenerateContent' : 'generateContent'
  
  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:${endpoint}?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 4096 },
      }),
    }
  )
}

// OpenAI-compatible API call
async function callOpenAICompatible(
  endpoint: string,
  apiKey: string,
  model: string,
  text: string,
  mode: string,
  stream: boolean,
  provider: string
): Promise<Response> {
  const prompt = buildPrompt(text, mode)
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  }

  // OpenRouter specific headers
  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = 'https://afrikaans-translator.vercel.app'
    headers['X-Title'] = 'Afrikaans Translator'
  }

  return fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      stream,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4096,
    }),
  })
}

// Build prompt based on mode
function buildPrompt(text: string, mode: string): string {
  const prompts: Record<string, string> = {
    translate: `Translate the following Afrikaans text to English. Provide:
1. The translation
2. Formality level (formal/informal/neutral)
3. Any cultural context if relevant
4. Alternative translations if applicable

Text: ${text}`,
    
    chat: text,
    
    email: `Translate and format the following Afrikaans email to professional English:

${text}`,
    
    enhance: `Improve and enhance the following text while maintaining its meaning:

${text}`,
    
    agent: `You are a knowledgeable assistant. Please provide a comprehensive answer to:

${text}`,
    
    strategy: `Analyze the following from a strategic business perspective:

${text}`,
  }

  return prompts[mode] || prompts.translate
}
