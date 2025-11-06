-- Add public_status_token column to allow applicants to view their submission via a token
ALTER TABLE tops_applications
ADD COLUMN IF NOT EXISTS public_status_token TEXT UNIQUE;

-- Optionally populate existing rows with a token (uncomment if desired)
-- UPDATE tops_applications SET public_status_token = gen_random_uuid() WHERE public_status_token IS NULL;

-- Create an index for faster lookup by token
CREATE INDEX IF NOT EXISTS idx_tops_applications_public_status_token
  ON tops_applications(public_status_token);

-- Note: To expose applicant status publicly you should create a secure server-side endpoint
-- that accepts the token and returns only non-sensitive fields and comments where is_internal = false.
-- Never expose the service_role key in client code.
