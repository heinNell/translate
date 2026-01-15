-- Create shared translations table for public sharing
CREATE TABLE
IF NOT EXISTS public.shared_translations
(
    id UUID DEFAULT gen_random_uuid
() PRIMARY KEY,
    translation_id UUID REFERENCES public.translations
(id) ON
DELETE CASCADE NOT NULL,
    user_id UUID
REFERENCES auth.users
(id) ON
DELETE CASCADE NOT NULL,
    share_code TEXT
UNIQUE NOT NULL DEFAULT encode
(gen_random_bytes
(8), 'hex'),
    title TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    view_count INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW
()
);

-- Index for share code lookups
CREATE INDEX
IF NOT EXISTS idx_shared_translations_code ON public.shared_translations
(share_code);

-- Enable RLS
ALTER TABLE public.shared_translations ENABLE ROW LEVEL SECURITY;

-- Anyone can view public shared translations
DROP POLICY
IF EXISTS "Anyone can view public shares" ON public.shared_translations;
CREATE POLICY "Anyone can view public shares" 
    ON public.shared_translations FOR
SELECT
    USING (is_public = TRUE AND (expires_at IS NULL OR expires_at > NOW()));

-- Users can manage their own shares
DROP POLICY
IF EXISTS "Users can manage own shares" ON public.shared_translations;
CREATE POLICY "Users can manage own shares" 
    ON public.shared_translations FOR ALL 
    USING
(auth.uid
() = user_id);

-- Function to get shared translation by code
CREATE OR REPLACE FUNCTION public.get_shared_translation
(p_share_code TEXT)
RETURNS TABLE
(
    source_text TEXT,
    translated_text TEXT,
    source_language TEXT,
    target_language TEXT,
    mode TEXT,
    formality TEXT,
    alternatives JSONB,
    cultural_notes TEXT,
    title TEXT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    -- Increment view count
    UPDATE public.shared_translations 
    SET view_count = view_count + 1 
    WHERE share_code = p_share_code;

    -- Return translation data
    RETURN QUERY
    SELECT
        t.source_text,
        t.translated_text,
        t.source_language,
        t.target_language,
        t.mode,
        t.formality,
        t.alternatives,
        t.cultural_notes,
        s.title,
        t.created_at
    FROM public.shared_translations s
        JOIN public.translations t ON t.id = s.translation_id
    WHERE s.share_code = p_share_code
        AND s.is_public = TRUE
        AND (s.expires_at IS NULL OR s.expires_at > NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
