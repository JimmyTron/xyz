-- =====================================================
-- QUICK FIX for RLS Policy Error
-- =====================================================
-- Run this in Supabase SQL Editor to fix the error immediately

-- Step 1: Ensure RLS is enabled
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop any conflicting policies
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated selects" ON public.contact_submissions;
DROP POLICY IF EXISTS "Block anonymous selects" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow anon insert" ON public.contact_submissions;
DROP POLICY IF EXISTS "anon_insert_policy" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow anonymous select own inserts" ON public.contact_submissions;

-- Step 3: Create the INSERT policy for anonymous users
CREATE POLICY "Allow anonymous inserts"
ON public.contact_submissions
FOR INSERT
TO anon
WITH CHECK (true);

-- Step 4: Create SELECT policy for authenticated users (for admin panel)
CREATE POLICY "Allow authenticated selects"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (true);

-- Step 5: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON public.contact_submissions TO anon;

-- Step 6: Verify the policies were created
-- You can check this in Supabase Dashboard → Table Editor → contact_submissions → RLS Policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'contact_submissions';

-- If you see "Allow anonymous inserts" policy listed, you're good to go!
-- Now test your form submission again.

