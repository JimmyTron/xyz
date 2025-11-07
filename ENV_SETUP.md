# Environment Variables Setup

Create a `.env.local` file in the root of your project with the following:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

## How to get these values:

1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the "Project URL" → Use as `VITE_SUPABASE_URL`
4. Copy the "anon public" key → Use as `VITE_SUPABASE_ANON_KEY`

## Security Notes:

- ✅ The `.env.local` file is gitignored by default (never commit it)
- ✅ The anon key is safe to use in frontend code (it's public)
- ✅ Row Level Security (RLS) policies protect your data
- ✅ Never commit your service_role key (if you get one later)

