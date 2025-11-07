-- Migration: Add status and public_status_token columns to existing tops_applications table
-- Run this if you already have the tops_applications table without these columns

-- Add status column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tops_applications' AND column_name = 'status'
    ) THEN
        ALTER TABLE tops_applications 
        ADD COLUMN status TEXT DEFAULT 'pending' 
        CHECK (status IN ('pending', 'under_review', 'approved', 'rejected'));
        
        RAISE NOTICE 'Added status column to tops_applications';
    ELSE
        RAISE NOTICE 'Column status already exists';
    END IF;
END $$;

-- Add public_status_token column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tops_applications' AND column_name = 'public_status_token'
    ) THEN
        ALTER TABLE tops_applications 
        ADD COLUMN public_status_token TEXT UNIQUE;
        
        RAISE NOTICE 'Added public_status_token column to tops_applications';
    ELSE
        RAISE NOTICE 'Column public_status_token already exists';
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_tops_applications_status_token 
    ON tops_applications(public_status_token);

CREATE INDEX IF NOT EXISTS idx_tops_applications_status 
    ON tops_applications(status);

-- Update existing rows to have default status if null
UPDATE tops_applications 
SET status = 'pending' 
WHERE status IS NULL;

-- Final completion notice
DO $$ 
BEGIN
    RAISE NOTICE 'Migration completed successfully';
END $$;
