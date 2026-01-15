-- Create usage statistics table for tracking and rate limiting
CREATE TABLE
IF NOT EXISTS public.usage_stats
(
    id UUID DEFAULT gen_random_uuid
() PRIMARY KEY,
    user_id UUID REFERENCES auth.users
(id) ON
DELETE CASCADE NOT NULL,
    provider TEXT
NOT NULL,
    model TEXT NOT NULL,
    mode TEXT NOT NULL,
    tokens_input INTEGER DEFAULT 0,
    tokens_output INTEGER DEFAULT 0,
    tokens_total INTEGER GENERATED ALWAYS AS
(tokens_input + tokens_output) STORED,
    cost_usd DECIMAL
(10, 6) DEFAULT 0,
    response_time_ms INTEGER,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW
()
);

-- Indexes for analytics queries
CREATE INDEX
IF NOT EXISTS idx_usage_stats_user_date ON public.usage_stats
(user_id, date DESC);
CREATE INDEX
IF NOT EXISTS idx_usage_stats_provider ON public.usage_stats
(provider, date DESC);
CREATE INDEX
IF NOT EXISTS idx_usage_stats_date ON public.usage_stats
(date DESC);

-- Enable RLS
ALTER TABLE public.usage_stats ENABLE ROW LEVEL SECURITY;

-- Users can view their own stats
DROP POLICY
IF EXISTS "Users can view own usage stats" ON public.usage_stats;
CREATE POLICY "Users can view own usage stats" 
    ON public.usage_stats FOR
SELECT
    USING (auth.uid() = user_id);

DROP POLICY
IF EXISTS "Users can insert own usage stats" ON public.usage_stats;
CREATE POLICY "Users can insert own usage stats" 
    ON public.usage_stats FOR
INSERT 
    WITH CHECK (auth.uid() =
user_id);

-- Aggregated daily stats view
CREATE OR REPLACE VIEW public.daily_usage_summary AS
SELECT
    user_id,
    date,
    provider,
    COUNT(*) as request_count,
    SUM(tokens_total) as total_tokens,
    SUM(cost_usd) as total_cost,
    AVG(response_time_ms)
::INTEGER as avg_response_time,
    COUNT
(*) FILTER
(WHERE success = TRUE) as successful_requests,
    COUNT
(*) FILTER
(WHERE success = FALSE) as failed_requests
FROM public.usage_stats
GROUP BY user_id, date, provider;

-- Function to get user's usage for current month
CREATE OR REPLACE FUNCTION public.get_monthly_usage
(p_user_id UUID)
RETURNS TABLE
(
    provider TEXT,
    total_requests BIGINT,
    total_tokens BIGINT,
    total_cost DECIMAL,
    avg_response_time INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        us.provider,
        COUNT(*)
    ::BIGINT as total_requests,
        COALESCE
    (SUM
    (us.tokens_total), 0)::BIGINT as total_tokens,
        COALESCE
    (SUM
    (us.cost_usd), 0) as total_cost,
        COALESCE
    (AVG
    (us.response_time_ms), 0)::INTEGER as avg_response_time
    FROM public.usage_stats us
    WHERE us.user_id = p_user_id
      AND us.date >= date_trunc
    ('month', CURRENT_DATE)
    GROUP BY us.provider;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
