# Supabase Backend Setup

This directory contains the Supabase configuration for the Afrikaans Translator app.

## 📋 Prerequisites

1. Install Supabase CLI:

   ```bash
   npm install -g supabase
   ```

2. Create a Supabase project at [supabase.com](https://supabase.com)

## 🚀 Setup Instructions

### 1. Link your project

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_ID
```

### 2. Run migrations

```bash
supabase db push
```

This will create all the tables:

- `profiles` - User profiles (extends auth.users)
- `translations` - Translation history
- `api_keys` - Encrypted API key storage
- `usage_stats` - Usage analytics
- `shared_translations` - Public sharing

### 3. Deploy Edge Functions

```bash
supabase functions deploy translate
supabase functions deploy save-api-key
supabase functions deploy get-history
supabase functions deploy save-translation
supabase functions deploy share-translation
supabase functions deploy get-usage
```

### 4. Set Environment Variables

In Supabase Dashboard → Settings → Edge Functions, add:

```
API_KEY_ENCRYPTION_SECRET=your-32-char-secret-key-here
PUBLIC_SITE_URL=https://afrikaans-translator.vercel.app
```

Generate a secret:

```bash
openssl rand -hex 16
```

### 5. Configure Frontend

Create `.env.local` in project root:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 📁 Structure

```
supabase/
├── config.toml              # Supabase project config
├── migrations/              # Database migrations
│   ├── 20260115000001_create_users_profile.sql
│   ├── 20260115000002_create_translations.sql
│   ├── 20260115000003_create_api_keys.sql
│   ├── 20260115000004_create_usage_stats.sql
│   └── 20260115000005_create_shared_translations.sql
└── functions/               # Edge Functions
    ├── translate/           # Main translation endpoint
    ├── save-api-key/        # Secure API key storage
    ├── get-history/         # Translation history
    ├── save-translation/    # Save to history
    ├── share-translation/   # Create share links
    └── get-usage/           # Usage analytics
```

## 🔐 Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Encrypted API Keys**: Keys encrypted with pgcrypto before storage
- **JWT Authentication**: All edge functions require valid auth token
- **Rate Limiting**: Configurable via Supabase dashboard

## 📊 Database Schema

### profiles

| Column             | Type | Description               |
| ------------------ | ---- | ------------------------- |
| id                 | UUID | User ID (from auth.users) |
| email              | TEXT | User email                |
| display_name       | TEXT | Display name              |
| preferred_provider | TEXT | Default AI provider       |
| preferred_model    | TEXT | Default model             |
| theme              | TEXT | UI theme preference       |

### translations

| Column          | Type        | Description              |
| --------------- | ----------- | ------------------------ |
| id              | UUID        | Translation ID           |
| user_id         | UUID        | Owner                    |
| source_text     | TEXT        | Original text            |
| translated_text | TEXT        | Translated text          |
| mode            | TEXT        | translate/chat/email/etc |
| provider        | TEXT        | AI provider used         |
| model           | TEXT        | Model used               |
| is_favorite     | BOOLEAN     | Favorited                |
| created_at      | TIMESTAMPTZ | Creation time            |

### api_keys

| Column        | Type    | Description       |
| ------------- | ------- | ----------------- |
| id            | UUID    | Key ID            |
| user_id       | UUID    | Owner             |
| provider      | TEXT    | Provider name     |
| encrypted_key | TEXT    | Encrypted API key |
| key_hint      | TEXT    | Last 4 chars      |
| is_valid      | BOOLEAN | Key validity      |

## 🔗 API Endpoints

All endpoints require `Authorization: Bearer <jwt>` header.

### POST /functions/v1/translate

Translate text via AI provider.

### POST /functions/v1/save-api-key

Store encrypted API key.

### GET /functions/v1/get-history

Get translation history with pagination.

### POST /functions/v1/save-translation

Save translation to history.

### POST /functions/v1/share-translation

Create shareable link.

### GET /functions/v1/get-usage

Get usage statistics.
