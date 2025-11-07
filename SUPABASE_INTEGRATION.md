# Supabase Integration Guide

## Quick Start

### 1. Supabase Setup

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project (or use existing)
3. Go to **SQL Editor**
4. Copy and paste the contents of `supabase-schema.sql`
5. Click **Run** to create the table and policies

### 2. Get API Credentials

1. In Supabase Dashboard, go to **Settings → API**
2. Copy the **Project URL** → This is your `VITE_SUPABASE_URL`
3. Copy the **anon public** key → This is your `VITE_SUPABASE_ANON_KEY`

### 3. Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

**Important:** Never commit `.env.local` to git (it's already in `.gitignore`)

### 4. Test the Integration

1. Start your dev server: `npm run dev`
2. Open the contact form
3. Fill in the form and submit
4. Check Supabase Dashboard → Table Editor → `contact_submissions` to see your data

## File Structure

```
jimmy/
├── src/
│   ├── lib/
│   │   └── supabase.ts          # Supabase client & helper functions
│   └── App.tsx                   # Updated with Supabase integration
├── supabase-schema.sql           # Database schema (run in Supabase SQL Editor)
├── SUPABASE_DATA_FLOW.md         # Detailed data flow documentation
├── DATA_FLOW_DIAGRAM.md          # Visual data flow diagrams
├── DATABASE_SECURITY_OPTIONS.md  # Security options analysis
└── ENV_SETUP.md                  # Environment variables guide
```

## Data Flow Summary

```
User fills form
    ↓
React validates input
    ↓
submitContactForm() transforms data (camelCase → snake_case)
    ↓
Supabase client sends POST request
    ↓
Supabase API validates & applies RLS policies
    ↓
PostgreSQL inserts data
    ↓
Success response returned
    ↓
User sees confirmation message
```

## What Gets Stored

When a user submits the contact form, the following data is saved:

```typescript
{
  id: "uuid-auto-generated",
  request_type: "virtual-call" | "task-request",
  email: "user@example.com",
  name: "John Doe",                    // optional
  message: "I'd like to discuss...",   // optional
  status: "pending",                   // auto-set
  created_at: "2024-01-15T10:30:00Z", // auto-generated
  updated_at: "2024-01-15T10:30:00Z"  // auto-generated
}
```

## Security Features

✅ **Row Level Security (RLS)** - Anonymous users can INSERT but not SELECT  
✅ **API Key Authentication** - All requests validated  
✅ **HTTPS Encryption** - All traffic encrypted  
✅ **Input Validation** - Client and server-side validation  
✅ **Database Constraints** - Data integrity enforced  

## Viewing Submissions

### Option 1: Supabase Dashboard
1. Go to Supabase Dashboard
2. Navigate to **Table Editor**
3. Select `contact_submissions` table
4. View all submissions

### Option 2: Future Admin Panel (To Be Built)
- Build authenticated admin view
- Query submissions via Supabase client
- Use service_role key for full access (backend only)

## Troubleshooting

### Error: "Missing Supabase environment variables"
- ✅ Check that `.env.local` exists
- ✅ Verify variable names are correct (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- ✅ Restart dev server after creating `.env.local`

### Error: "new row violates row-level security policy"
- ✅ Verify RLS policies are set up correctly
- ✅ Check that `supabase-schema.sql` was run successfully
- ✅ Ensure "Allow anonymous inserts" policy exists

### Error: "Failed to submit form"
- ✅ Check browser console for detailed error
- ✅ Verify Supabase project is active
- ✅ Check API key is correct
- ✅ Verify table name matches (`contact_submissions`)

### Form submits but no data appears
- ✅ Check Supabase Dashboard → Table Editor
- ✅ Verify RLS policies allow INSERT for anon role
- ✅ Check browser Network tab for API response

## Next Steps

1. **Set up email notifications** (Supabase Edge Functions)
2. **Build admin panel** to view submissions
3. **Add spam protection** (rate limiting, CAPTCHA)
4. **Set up monitoring** (Supabase dashboard alerts)
5. **Add analytics** (track submission rates)

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

