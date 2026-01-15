-- Create user profiles table (extends Supabase auth.users)
CREATE TABLE
IF NOT EXISTS public.profiles
(
    id UUID REFERENCES auth.users
(id) ON
DELETE CASCADE PRIMARY KEY,
    email TEXT,
    display_name TEXT,
    avatar_url TEXT,
    preferred_provider TEXT
DEFAULT 'openrouter',
    preferred_model TEXT,
    theme TEXT DEFAULT 'system' CHECK
(theme IN
('light', 'dark', 'system')),
    language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW
(),
    updated_at TIMESTAMPTZ DEFAULT NOW
()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own profile (use DROP IF EXISTS pattern)
DROP POLICY
IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR
SELECT
    USING (auth.uid() = id);

DROP POLICY
IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR
UPDATE 
    USING (auth.uid()
= id);

DROP POLICY
IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
    ON public.profiles FOR
INSERT 
    WITH CHECK (auth.uid() =
id);

-- Create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user
()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles
        (id, email, display_name)
    VALUES
        (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created
ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER
INSERT ON
auth.users
FOR EACH ROW
EXECUTE
FUNCTION public.handle_new_user
();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at
()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW
();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at
ON public.profiles;
CREATE TRIGGER profiles_updated_at
    BEFORE
UPDATE ON public.profiles
    FOR EACH ROW
EXECUTE
FUNCTION public.update_updated_at
();
