-- Add a policy to allow public reads for the admin dashboard
-- This allows anyone to view submissions (you can add password protection later)

CREATE POLICY allow_public_select ON public.tops_applications
  FOR SELECT
  TO public
  USING (true);
