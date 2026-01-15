-- Create translations history table
CREATE TABLE IF NOT EXISTS public.translations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    source_text TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    source_language TEXT DEFAULT 'af',
    target_language TEXT DEFAULT 'en',
    mode TEXT DEFAULT 'translate' CHECK (mode IN ('translate', 'chat', 'email', 'enhance', 'agent', 'strategy')),
    provider TEXT NOT NULL,
    model TEXT NOT NULL,
    formality TEXT CHECK (formality IN ('formal', 'informal', 'neutral')),
    alternatives JSONB DEFAULT '[]'::jsonb,
    cultural_notes TEXT,
    tokens_used INTEGER DEFAULT 0,
    response_time_ms INTEGER,
    is_favorite BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_translations_user_id ON public.translations(user_id);
CREATE INDEX IF NOT EXISTS idx_translations_created_at ON public.translations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_translations_mode ON public.translations(mode);
CREATE INDEX IF NOT EXISTS idx_translations_is_favorite ON public.translations(is_favorite) WHERE is_favorite = TRUE;

-- Enable RLS
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Users can only access their own translations
DROP POLICY IF EXISTS "Users can view own translations" ON public.translations;
CREATE POLICY "Users can view own translations" 
    ON public.translations FOR SELECT 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own translations" ON public.translations;
CREATE POLICY "Users can insert own translations" 
    ON public.translations FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own translations" ON public.translations;
CREATE POLICY "Users can update own translations" 
    ON public.translations FOR UPDATE 
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own translations" ON public.translations;
CREATE POLICY "Users can delete own translations" 
    ON public.translations FOR DELETE 
    USING (auth.uid() = user_id);

-- Full-text search on translations
ALTER TABLE public.translations ADD COLUMN IF NOT EXISTS search_vector tsvector
    GENERATED ALWAYS AS (
        setweight(to_tsvector('english', COALESCE(source_text, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(translated_text, '')), 'B')
    ) STORED;

CREATE INDEX IF NOT EXISTS idx_translations_search ON public.translations USING GIN(search_vector);
