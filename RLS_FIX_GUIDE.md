# Fixing RLS Policy Error

## Problem

You're seeing this error:
```
new row violates row-level security policy for table "contact_submissions"
```

## Root Cause

This error occurs because:
1. **RLS is enabled** on the table (which is good for security)
2. **No INSERT policy exists** for the `anon` role, OR
3. **The policy exists but isn't working** due to configuration issues

## Solution Options

### Option 1: Fix RLS Policies (Recommended)

Run the **fixed SQL schema** (`supabase-schema-fixed.sql`) which:
- ✅ Creates the correct INSERT policy for anonymous users
- ✅ Adds SELECT policy so `.select()` works after insert (optional)
- ✅ Grants proper permissions

**Steps:**
1. Open Supabase Dashboard → SQL Editor
2. Copy and run `supabase-schema-fixed.sql`
3. Verify policies exist: Check Table Editor → contact_submissions → RLS Policies

### Option 2: Simplified - Remove .select() (Already Done)

The client code has been updated to **not use `.select()`** after insert, which means:
- ✅ Inserts will work even with strict RLS
- ✅ We don't need to return the inserted data
- ⚠️ You won't get the inserted row back (but that's fine for anonymous inserts)

**Status:** ✅ This fix is already applied in `src/lib/supabase.ts`

## Verification Steps

### 1. Check if RLS is Enabled
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'contact_submissions';
```
Should show: `rowsecurity = true`

### 2. Check Existing Policies
```sql
SELECT * 
FROM pg_policies 
WHERE tablename = 'contact_submissions';
```
Should show at least one INSERT policy for `anon` role.

### 3. Check Grants
```sql
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'contact_submissions' 
AND grantee = 'anon';
```
Should show: `INSERT` (and optionally `SELECT`)

### 4. Test the Policy
```sql
-- Test as anon role (simulate what your app does)
SET ROLE anon;
INSERT INTO contact_submissions (request_type, email, name, message)
VALUES ('virtual-call', 'test@example.com', 'Test User', 'Test message');
RESET ROLE;
```

If this works, your RLS is configured correctly!

## Common Issues

### Issue 1: Policy Doesn't Exist
**Symptom:** Error persists after running schema
**Fix:** Make sure the CREATE POLICY statement ran successfully
**Check:** `SELECT * FROM pg_policies WHERE tablename = 'contact_submissions';`

### Issue 2: Wrong Role
**Symptom:** Policy exists but still fails
**Fix:** Verify you're using the `anon` key (not `service_role`)
**Check:** In your `.env.local`, use `VITE_SUPABASE_ANON_KEY` (not service role key)

### Issue 3: Conflicting Policies
**Symptom:** Multiple policies causing conflicts
**Fix:** Drop all policies and recreate them fresh
```sql
-- Drop all policies
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated selects" ON public.contact_submissions;
DROP POLICY IF EXISTS "Block anonymous selects" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow anonymous select own inserts" ON public.contact_submissions;

-- Recreate the INSERT policy
CREATE POLICY "Allow anonymous inserts"
ON public.contact_submissions
FOR INSERT
TO anon
WITH CHECK (true);
```

### Issue 4: Grants Missing
**Symptom:** Policy exists but operation fails
**Fix:** Ensure grants are in place
```sql
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON public.contact_submissions TO anon;
```

## Quick Fix Script

Run this in Supabase SQL Editor for a quick fix:

```sql
-- Enable RLS (if not already enabled)
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.contact_submissions;

-- Create the INSERT policy
CREATE POLICY "Allow anonymous inserts"
ON public.contact_submissions
FOR INSERT
TO anon
WITH CHECK (true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON public.contact_submissions TO anon;
```

## After Fixing

1. ✅ Test the form submission
2. ✅ Check Supabase Dashboard → Table Editor → contact_submissions
3. ✅ Verify the row was inserted
4. ✅ Check browser console for any other errors

## Security Note

The current setup allows:
- ✅ Anonymous users to INSERT (submit forms)
- ✅ Anonymous users cannot SELECT (prevents data leakage)
- ✅ Authenticated users can SELECT (for future admin panel)

This is a secure configuration for a public contact form!

