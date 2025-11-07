-- Convert public_status_token from UUID to TEXT type
-- This allows for shorter, more user-friendly tokens

-- Step 1: Drop ALL existing policies that might reference this column
DROP POLICY IF EXISTS "Allow public access to own application" ON tops_applications;
DROP POLICY IF EXISTS "Allow public status check by token" ON tops_applications;
DROP POLICY IF EXISTS "Allow authenticated users to submit applications" ON tops_applications;
DROP POLICY IF EXISTS "Allow reviewers to update applications" ON tops_applications;
DROP POLICY IF EXISTS "Allow public inserts" ON tops_applications;
DROP POLICY IF EXISTS "Allow authenticated reads" ON tops_applications;

-- Step 2: Drop the unique constraint temporarily
ALTER TABLE tops_applications 
DROP CONSTRAINT IF EXISTS tops_applications_public_status_token_key;

-- Step 3: Convert the column type from UUID to TEXT
ALTER TABLE tops_applications 
ALTER COLUMN public_status_token TYPE TEXT USING public_status_token::TEXT;

-- Step 4: Re-add the unique constraint
ALTER TABLE tops_applications 
ADD CONSTRAINT tops_applications_public_status_token_key 
UNIQUE (public_status_token);

-- Step 5: Recreate essential policies
-- Allow public inserts (anyone can submit an application)
CREATE POLICY "Allow public inserts" ON tops_applications
  FOR INSERT
  WITH CHECK (true);

-- Allow public status checking by token
CREATE POLICY "Allow public status check by token" ON tops_applications
  FOR SELECT
  USING (public_status_token IS NOT NULL);

-- Step 6: Add RLS policy for authenticated reads (admin access)
CREATE POLICY "Allow authenticated reads" ON tops_applications
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Success message
DO $$ 
BEGIN
    RAISE NOTICE 'Successfully converted public_status_token to TEXT and added RLS policy';
END $$;
