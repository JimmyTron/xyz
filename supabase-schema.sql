-- =====================================================
-- Supabase Database Schema for Contact Submissions
-- =====================================================
-- Run this SQL in your Supabase SQL Editor

-- WARNING: This schema contains destructive operations (DROP POLICY, DROP TRIGGER).
-- Please ensure you are intentionally resetting policies or triggers, 
-- and confirm that you do NOT need to preserve any existing RLS policies or trigger logic 
-- before executing this script in a production environment.

-- Create the contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_type TEXT NOT NULL CHECK (request_type IN ('virtual-call', 'task-request')),
  email TEXT NOT NULL,
  name TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at 
  ON public.contact_submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_status 
  ON public.contact_submissions(status);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_email 
  ON public.contact_submissions(email);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- The following statements REMOVE existing RLS policies if present.
-- This is a DESTRUCTIVE action and is intended to give a clean policy setup for test/dev environments.
-- REMOVE or MODIFY these lines if you need to keep other policies!
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated selects" ON public.contact_submissions;
DROP POLICY IF EXISTS "Block anonymous selects" ON public.contact_submissions;

-- RLS Policy: Allow anonymous users to INSERT
CREATE POLICY "Allow anonymous inserts"
ON public.contact_submissions
FOR INSERT
TO anon
WITH CHECK (true);

-- RLS Policy: Allow authenticated users to SELECT (for admin panel later)
CREATE POLICY "Allow authenticated selects"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (true);

-- RLS Policy: Block anonymous SELECT (prevent data leakage)
CREATE POLICY "Block anonymous selects"
ON public.contact_submissions
FOR SELECT
TO anon
USING (false);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- The following statements REMOVE and recreate the update trigger.
-- This will delete the existing trigger logic (if any).
-- Confirm this is what you want for your environment.
DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON public.contact_submissions;
CREATE TRIGGER update_contact_submissions_updated_at
    BEFORE UPDATE ON public.contact_submissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Add email validation (requires pg_trgm extension)
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON public.contact_submissions TO anon;
GRANT SELECT ON public.contact_submissions TO authenticated;

-- Optional: Create a view for admin dashboard (future use)
-- Note: Explicitly set SECURITY INVOKER to avoid security linter warnings
-- SECURITY INVOKER uses the permissions of the querying user (respects RLS)
CREATE OR REPLACE VIEW public.contact_submissions_summary
WITH (security_invoker = true) AS
SELECT 
  id,
  request_type,
  email,
  name,
  LEFT(message, 100) as message_preview,
  status,
  created_at,
  updated_at
FROM public.contact_submissions
ORDER BY created_at DESC;

GRANT SELECT ON public.contact_submissions_summary TO authenticated;

