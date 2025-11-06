-- Create enum type for application status
CREATE TYPE application_status AS ENUM ('pending', 'under_review', 'approved', 'rejected');

-- Add status column to tops_applications
ALTER TABLE tops_applications 
ADD COLUMN IF NOT EXISTS status application_status DEFAULT 'pending';

-- Create comments table
CREATE TABLE IF NOT EXISTS application_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES tops_applications(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  is_internal BOOLEAN DEFAULT false -- whether the comment is internal (admin-only) or can be seen by the applicant
);

-- Enable Row Level Security
ALTER TABLE application_comments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to create comments
CREATE POLICY "Allow authenticated creates" ON application_comments
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to read comments
CREATE POLICY "Allow authenticated reads" ON application_comments
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_application_comments_application_id 
  ON application_comments(application_id);

CREATE INDEX IF NOT EXISTS idx_application_comments_created_at 
  ON application_comments(created_at DESC);

-- Add trigger for updated_at
CREATE TRIGGER update_application_comments_updated_at BEFORE UPDATE
    ON application_comments FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();