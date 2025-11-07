-- Add policies to allow deletes for admin operations
-- ⚠️ WARNING: These policies allow public deletes for DEVELOPMENT ONLY
-- For production, use proper authentication or server-side API with service role key

-- Add DELETE policy for applications (public for dev, should use auth in production)
DROP POLICY IF EXISTS "Allow public deletes for dev" ON tops_applications;

CREATE POLICY "Allow public deletes for dev"
    ON tops_applications
    FOR DELETE
    USING (true);

-- Add UPDATE policy for applications (public for dev)
DROP POLICY IF EXISTS "Allow public updates for dev" ON tops_applications;

CREATE POLICY "Allow public updates for dev"
    ON tops_applications
    FOR UPDATE
    USING (true);

-- Add DELETE policy for storage (public for dev)
DROP POLICY IF EXISTS "Allow public storage deletes for dev" ON storage.objects;

CREATE POLICY "Allow public storage deletes for dev"
    ON storage.objects
    FOR DELETE
    USING (bucket_id = 'tops-uploads');

-- Add UPDATE policy for storage (public for dev)
DROP POLICY IF EXISTS "Allow public storage updates for dev" ON storage.objects;

CREATE POLICY "Allow public storage updates for dev"
    ON storage.objects
    FOR UPDATE
    USING (bucket_id = 'tops-uploads');

-- Success message
DO $$ 
BEGIN
    RAISE NOTICE 'Successfully added DELETE and UPDATE policies for admin operations';
    RAISE WARNING 'These policies allow PUBLIC deletes - FOR DEVELOPMENT ONLY!';
    RAISE WARNING 'For production: Use server-side API with service role key OR implement Supabase Auth';
END $$;

-- TODO for Production:
-- 1. Remove these public delete/update policies
-- 2. Implement proper authentication using Supabase Auth
-- 3. Replace "USING (true)" with "USING (auth.role() = 'authenticated')"
-- 4. Add admin role checking for extra security
