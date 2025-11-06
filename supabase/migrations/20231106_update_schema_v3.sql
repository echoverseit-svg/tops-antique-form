-- Migration script to update the schema (v2)

-- 1. First, drop any existing foreign key constraints that might conflict
DO $$ 
BEGIN
    -- Drop FKs from application_comments
    IF EXISTS (
        SELECT 1 
        FROM information_schema.constraint_column_usage 
        WHERE table_name = 'application_comments' AND constraint_name = 'fk_application'
    ) THEN
        ALTER TABLE application_comments DROP CONSTRAINT fk_application;
    END IF;

    -- Drop FKs from application_reviews
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE table_name = 'application_reviews' AND constraint_type = 'FOREIGN KEY'
    ) THEN
        ALTER TABLE application_reviews DROP CONSTRAINT IF EXISTS application_reviews_application_id_fkey;
        ALTER TABLE application_reviews DROP CONSTRAINT IF EXISTS application_reviews_reviewer_id_fkey;
    END IF;
END $$;

-- 2. Drop existing triggers
DROP TRIGGER IF EXISTS update_tops_applications_updated_at ON tops_applications;
DROP TRIGGER IF EXISTS update_achievement_categories_updated_at ON achievement_categories;
DROP TRIGGER IF EXISTS update_application_comments_updated_at ON application_comments;
DROP TRIGGER IF EXISTS update_reviewers_updated_at ON reviewers;

-- 3. Drop existing policies
DROP POLICY IF EXISTS "Allow reviewer management" ON reviewers;
DROP POLICY IF EXISTS "Allow public access to own application" ON tops_applications;
DROP POLICY IF EXISTS "Allow authenticated users to submit applications" ON tops_applications;
DROP POLICY IF EXISTS "Allow reviewers to update applications" ON tops_applications;

-- 4. Create or update the reviewers table
CREATE TABLE IF NOT EXISTS reviewers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Add reviewer_id column to tops_applications if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'tops_applications' AND column_name = 'reviewer_id'
    ) THEN
        ALTER TABLE tops_applications ADD COLUMN reviewer_id UUID REFERENCES reviewers(id);
    END IF;
END $$;

-- 6. Update application_reviews table
ALTER TABLE application_reviews 
    ALTER COLUMN reviewer_id TYPE UUID,
    ADD CONSTRAINT application_reviews_reviewer_id_fkey 
        FOREIGN KEY (reviewer_id) REFERENCES reviewers(id);

-- 7. Update application_comments table
ALTER TABLE application_comments 
    DROP COLUMN IF EXISTS user_id,
    ADD COLUMN IF NOT EXISTS reviewer_id UUID,
    ADD CONSTRAINT application_comments_reviewer_id_fkey 
        FOREIGN KEY (reviewer_id) REFERENCES reviewers(id);

-- 8. Create or replace the update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. Recreate all triggers
CREATE TRIGGER update_tops_applications_updated_at
    BEFORE UPDATE ON tops_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_achievement_categories_updated_at
    BEFORE UPDATE ON achievement_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_application_comments_updated_at
    BEFORE UPDATE ON application_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviewers_updated_at
    BEFORE UPDATE ON reviewers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 10. Create or update indexes
CREATE INDEX IF NOT EXISTS idx_applications_token ON tops_applications(public_status_token);
CREATE INDEX IF NOT EXISTS idx_applications_status ON tops_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_reviewer ON tops_applications(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_application ON application_reviews(application_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON application_reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_comments_application ON application_comments(application_id);
CREATE INDEX IF NOT EXISTS idx_comments_reviewer ON application_comments(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviewers_user_id ON reviewers(user_id);

-- 11. Enable RLS on all tables
ALTER TABLE reviewers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tops_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_categories ENABLE ROW LEVEL SECURITY;

-- 12. Create RLS policies
CREATE POLICY "Allow reviewer management"
    ON reviewers
    TO authenticated
    USING (auth.uid() IN (
        SELECT user_id FROM reviewers WHERE is_active = true
    ));

CREATE POLICY "Allow public access to own application"
    ON tops_applications FOR SELECT
    USING (public_status_token IS NOT NULL OR 
           auth.uid() IN (SELECT user_id FROM reviewers WHERE is_active = true));

CREATE POLICY "Allow authenticated users to submit applications"
    ON tops_applications FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow reviewers to update applications"
    ON tops_applications FOR UPDATE
    TO authenticated
    USING (auth.uid() IN (
        SELECT user_id FROM reviewers WHERE is_active = true
    ));