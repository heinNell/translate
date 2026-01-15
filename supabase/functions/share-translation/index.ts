// Supabase Edge Function: Share Translation
// Creates a shareable link for a translation

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ShareRequest {
  translation_id: string
  title?: string
  expires_in_days?: number
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

    const body: ShareRequest = await req.json()

    if (!body.translation_id) {
      throw new Error('Missing translation_id')
    }

    // Verify the translation belongs to the user
    const { data: translation, error: translationError } = await supabaseClient
      .from('translations')
      .select('id')
      .eq('id', body.translation_id)
      .eq('user_id', user.id)
      .single()

    if (translationError || !translation) {
      throw new Error('Translation not found')
    }

    // Calculate expiration
    let expiresAt = null
    if (body.expires_in_days) {
      expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + body.expires_in_days)
    }

    // Create share
    const { data: share, error: shareError } = await supabaseClient
      .from('shared_translations')
      .insert({
        translation_id: body.translation_id,
        user_id: user.id,
        title: body.title,
        expires_at: expiresAt
      })
      .select()
      .single()

    if (shareError) {
      throw new Error('Failed to create share')
    }

    const shareUrl = `${Deno.env.get('PUBLIC_SITE_URL')}/share/${share.share_code}`

    return new Response(
      JSON.stringify({ 
        success: true, 
        share_code: share.share_code,
        share_url: shareUrl,
        expires_at: share.expires_at
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
