// Supabase Edge Function: Get Usage Stats
// Returns user's usage statistics and analytics

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Get monthly usage by provider
    const { data: monthlyUsage, error: monthlyError } = await supabaseClient
      .rpc('get_monthly_usage', { p_user_id: user.id })

    if (monthlyError) {
      throw new Error('Failed to fetch monthly usage')
    }

    // Get daily usage for last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: dailyUsage, error: dailyError } = await supabaseClient
      .from('usage_stats')
      .select('date, provider, tokens_total, cost_usd, success')
      .eq('user_id', user.id)
      .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('date', { ascending: true })

    if (dailyError) {
      throw new Error('Failed to fetch daily usage')
    }

    // Aggregate daily data
    const dailyAggregated = dailyUsage.reduce((acc: Record<string, any>, row) => {
      const date = row.date
      if (!acc[date]) {
        acc[date] = { date, requests: 0, tokens: 0, cost: 0, success: 0, failed: 0 }
      }
      acc[date].requests++
      acc[date].tokens += row.tokens_total || 0
      acc[date].cost += parseFloat(row.cost_usd) || 0
      if (row.success) {
        acc[date].success++
      } else {
        acc[date].failed++
      }
      return acc
    }, {})

    // Get total counts
    const { count: totalTranslations } = await supabaseClient
      .from('translations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    const { count: totalFavorites } = await supabaseClient
      .from('translations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_favorite', true)

    return new Response(
      JSON.stringify({
        monthly_usage: monthlyUsage,
        daily_usage: Object.values(dailyAggregated),
        totals: {
          translations: totalTranslations || 0,
          favorites: totalFavorites || 0
        }
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
