-- Add status column to tops_applications
ALTER TABLE tops_applications 
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending'
CHECK (status IN ('pending', 'under_review', 'approved', 'rejected'));