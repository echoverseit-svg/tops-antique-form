-- Idempotent migration for application_comments
-- This script drops conflicting policies/triggers if they exist, then creates the table, policies, indexes, and trigger safely.

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS application_comments (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES tops_applications(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  is_internal BOOLEAN DEFAULT false
);

-- Ensure RLS is enabled (no-op if already enabled)
ALTER TABLE application_comments ENABLE ROW LEVEL SECURITY;

-- Drop policies if they already exist to avoid duplication errors
DROP POLICY IF EXISTS "Allow authenticated creates" ON application_comments;
DROP POLICY IF EXISTS "Allow authenticated reads" ON application_comments;

-- Create policies (safe to run multiple times because we dropped existing ones)
CREATE POLICY "Allow authenticated creates" ON application_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated reads" ON application_comments
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes if missing
CREATE INDEX IF NOT EXISTS idx_application_comments_application_id 
  ON application_comments(application_id);

CREATE INDEX IF NOT EXISTS idx_application_comments_created_at 
  ON application_comments(created_at DESC);

-- Add or replace trigger function for updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists, then create it
DROP TRIGGER IF EXISTS set_timestamp ON application_comments;

CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON application_comments
  FOR EACH ROW
  EXECUTE PROCEDURE trigger_set_timestamp();