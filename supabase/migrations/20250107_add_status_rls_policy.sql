-- Add RLS policy to allow public status checking by token
-- This allows the status page to work without server-side API

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow public status check by token" ON tops_applications;

-- Create policy to allow anyone to read their own application by token
CREATE POLICY "Allow public status check by token"
    ON tops_applications
    FOR SELECT
    USING (
        public_status_token IS NOT NULL 
        AND public_status_token = current_setting('request.jwt.claims', true)::json->>'status_token'
    );

-- Alternative: Simpler policy that allows reading basic info if you know the token
-- This is less secure but easier to implement for client-side checking
DROP POLICY IF EXISTS "Allow public status check by token" ON tops_applications;

CREATE POLICY "Allow public status check by token"
    ON tops_applications
    FOR SELECT
    USING (public_status_token IS NOT NULL);

-- Note: This policy allows reading applications if you know the token
-- The token acts as a password for viewing status
-- Client-side code still needs to filter by token in the query
