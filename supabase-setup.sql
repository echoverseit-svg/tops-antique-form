-- Create the TOPS applications table
CREATE TABLE IF NOT EXISTS tops_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- I. General Information
  full_name TEXT NOT NULL,
  complete_address TEXT NOT NULL,
  municipality TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
  birthday DATE NOT NULL,
  age INTEGER NOT NULL,
  sex TEXT NOT NULL,
  
  -- School Details
  school_level TEXT NOT NULL,
  school_name TEXT NOT NULL,
  school_address TEXT NOT NULL,
  school_head_name TEXT NOT NULL,
  school_head_email TEXT NOT NULL,
  school_head_mobile TEXT NOT NULL,
  class_advisor_name TEXT NOT NULL,
  class_advisor_email TEXT NOT NULL,
  class_advisor_mobile TEXT NOT NULL,
  
  -- II. Requirements (file URLs)
  nomination_letter_url TEXT,
  academic_records_url TEXT,
  certificate_truthfulness_url TEXT,
  photo_2x2_url TEXT,
  
  -- III. Academic Profile (up to 20 claims) - stored as JSONB
  academic_claims JSONB DEFAULT '[]'::jsonb,
  
  -- IV. Leadership Profile (up to 20 claims) - stored as JSONB
  leadership_claims JSONB DEFAULT '[]'::jsonb,
  
  -- V. Community Service Profile (up to 20 claims) - stored as JSONB
  community_service_claims JSONB DEFAULT '[]'::jsonb,
  
  -- Status and Tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
  public_status_token TEXT UNIQUE,
  
  -- Data Privacy Confirmation
  data_privacy_accepted BOOLEAN NOT NULL DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE tops_applications ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public inserts (anyone can submit an application)
CREATE POLICY "Allow public inserts" ON tops_applications
  FOR INSERT
  WITH CHECK (true);

-- Create a policy to allow authenticated reads (for admin dashboard)
CREATE POLICY "Allow authenticated reads" ON tops_applications
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_tops_applications_created_at 
  ON tops_applications(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tops_applications_email 
  ON tops_applications(email);

CREATE INDEX IF NOT EXISTS idx_tops_applications_municipality 
  ON tops_applications(municipality);

CREATE INDEX IF NOT EXISTS idx_tops_applications_status_token 
  ON tops_applications(public_status_token);

CREATE INDEX IF NOT EXISTS idx_tops_applications_status 
  ON tops_applications(status);

-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('tops-uploads', 'tops-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'tops-uploads');

CREATE POLICY "Allow public reads" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'tops-uploads');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_tops_applications_updated_at BEFORE UPDATE
    ON tops_applications FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
