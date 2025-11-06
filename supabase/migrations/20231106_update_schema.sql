-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Application Status enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
        CREATE TYPE application_status AS ENUM (
            'pending',
            'under_review',
            'approved',
            'rejected'
        );
    END IF;
END $$;

-- TOPS Applications Table
CREATE TABLE IF NOT EXISTS tops_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Personal Information
    full_name VARCHAR(255) NOT NULL,
    complete_address TEXT NOT NULL,
    municipality VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    birthday DATE NOT NULL,
    age INTEGER NOT NULL,
    sex VARCHAR(20) NOT NULL,
    
    -- School Information
    school_level VARCHAR(50) NOT NULL,
    school_name VARCHAR(255) NOT NULL,
    school_address TEXT NOT NULL,
    school_head_name VARCHAR(255) NOT NULL,
    school_head_email VARCHAR(255) NOT NULL,
    school_head_mobile VARCHAR(20) NOT NULL,
    class_advisor_name VARCHAR(255) NOT NULL,
    class_advisor_email VARCHAR(255) NOT NULL,
    class_advisor_mobile VARCHAR(20) NOT NULL,
    
    -- Required Documents
    nomination_letter_url TEXT NOT NULL,
    academic_records_url TEXT NOT NULL,
    certificate_truthfulness_url TEXT NOT NULL,
    photo_2x2_url TEXT NOT NULL,
    
    -- Achievement Claims (stored as JSONB for flexibility)
    academic_claims JSONB NOT NULL,
    leadership_claims JSONB NOT NULL,
    community_service_claims JSONB NOT NULL,
    
    -- Status and Tracking
    status application_status DEFAULT 'pending',
    public_status_token UUID UNIQUE DEFAULT uuid_generate_v4(),
    reviewer_notes TEXT,
    reviewer_id UUID,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    
    -- Privacy Agreement
    data_privacy_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT age_range CHECK (age >= 12 AND age <= 30)
);

-- Create an index on public_status_token for faster lookups
CREATE INDEX IF NOT EXISTS idx_applications_token ON tops_applications(public_status_token);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_applications_status ON tops_applications(status);

-- Create a trigger to automatically update the updated_at timestamp
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add update trigger to tops_applications
DROP TRIGGER IF EXISTS update_tops_applications_updated_at ON tops_applications;
CREATE TRIGGER update_tops_applications_updated_at
    BEFORE UPDATE ON tops_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Reviews Table for tracking review history
CREATE TABLE IF NOT EXISTS application_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES tops_applications(id),
    reviewer_id UUID NOT NULL,
    status application_status NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT fk_application
        FOREIGN KEY(application_id) 
        REFERENCES tops_applications(id)
        ON DELETE CASCADE
);

-- Create an index on application_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_reviews_application ON application_reviews(application_id);

-- Achievement Types enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'achievement_level') THEN
        CREATE TYPE achievement_level AS ENUM (
            'school',
            'district',
            'division',
            'regional',
            'national',
            'international'
        );
    END IF;
END $$;

-- Achievement Categories Table
CREATE TABLE IF NOT EXISTS achievement_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- 'academic', 'leadership', 'community'
    level achievement_level NOT NULL,
    points INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT unique_category_name_level 
        UNIQUE (name, level)
);

-- Add update trigger to achievement_categories
DROP TRIGGER IF EXISTS update_achievement_categories_updated_at ON achievement_categories;
CREATE TRIGGER update_achievement_categories_updated_at
    BEFORE UPDATE ON achievement_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Sample Achievement Categories
INSERT INTO achievement_categories (name, description, type, level, points) VALUES
    ('Academic Competition Winner', 'First place in academic competitions', 'academic', 'school', 5),
    ('Academic Competition Winner', 'First place in academic competitions', 'academic', 'district', 10),
    ('Academic Competition Winner', 'First place in academic competitions', 'academic', 'division', 15),
    ('Academic Competition Winner', 'First place in academic competitions', 'academic', 'regional', 20),
    ('Academic Competition Winner', 'First place in academic competitions', 'academic', 'national', 25),
    ('Student Council President', 'Served as Student Council President', 'leadership', 'school', 10),
    ('Community Service Project Lead', 'Led community service initiatives', 'community', 'school', 8),
    ('Community Service Project Lead', 'Led community service initiatives', 'community', 'district', 12)
ON CONFLICT DO NOTHING;

-- Comments Table for application discussion
CREATE TABLE IF NOT EXISTS application_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES tops_applications(id),
    user_id UUID NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT fk_application
        FOREIGN KEY(application_id) 
        REFERENCES tops_applications(id)
        ON DELETE CASCADE
);

-- Add update trigger to application_comments
DROP TRIGGER IF EXISTS update_application_comments_updated_at ON application_comments;
CREATE TRIGGER update_application_comments_updated_at
    BEFORE UPDATE ON application_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_comments_application ON application_comments(application_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON application_comments(user_id);

-- Create reviewers table if it doesn't exist
CREATE TABLE IF NOT EXISTS reviewers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add update trigger to reviewers
DROP TRIGGER IF EXISTS update_reviewers_updated_at ON reviewers;
CREATE TRIGGER update_reviewers_updated_at
    BEFORE UPDATE ON reviewers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE tops_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviewers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public access to own application" ON tops_applications;
DROP POLICY IF EXISTS "Allow authenticated users to submit applications" ON tops_applications;
DROP POLICY IF EXISTS "Allow reviewers to update applications" ON tops_applications;

-- Allow public read access to applications through status token
CREATE POLICY "Allow public access to own application"
    ON tops_applications FOR SELECT
    USING (auth.uid() IS NOT NULL OR public_status_token IS NOT NULL);

-- Allow insert access to authenticated users
CREATE POLICY "Allow authenticated users to submit applications"
    ON tops_applications FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow reviewers to update applications
CREATE POLICY "Allow reviewers to update applications"
    ON tops_applications FOR UPDATE
    TO authenticated
    USING (auth.uid() IN (
        SELECT user_id FROM reviewers WHERE is_active = true
    ));

-- Drop and recreate the view for application statistics
DROP VIEW IF EXISTS application_statistics;
CREATE OR REPLACE VIEW application_statistics AS
SELECT
    municipality,
    status,
    COUNT(*) as count,
    MIN(created_at) as earliest_submission,
    MAX(created_at) as latest_submission
FROM tops_applications
GROUP BY municipality, status;

-- Drop and recreate function to calculate application score
DROP FUNCTION IF EXISTS calculate_application_score(UUID);
CREATE OR REPLACE FUNCTION calculate_application_score(application_id UUID)
RETURNS INTEGER AS $$
DECLARE
    total_score INTEGER := 0;
    app_record RECORD;
BEGIN
    -- Get the application
    SELECT * INTO app_record FROM tops_applications WHERE id = application_id;
    
    -- Calculate academic score
    SELECT COALESCE(SUM(ac.points), 0) INTO total_score
    FROM jsonb_array_elements(app_record.academic_claims) as claims
    JOIN achievement_categories ac ON 
        ac.name = claims->>'name' AND
        ac.level::text = claims->>'level' AND
        ac.type = 'academic';
        
    -- Add leadership score
    SELECT total_score + COALESCE(SUM(ac.points), 0) INTO total_score
    FROM jsonb_array_elements(app_record.leadership_claims) as claims
    JOIN achievement_categories ac ON 
        ac.name = claims->>'name' AND
        ac.level::text = claims->>'level' AND
        ac.type = 'leadership';
        
    -- Add community service score
    SELECT total_score + COALESCE(SUM(ac.points), 0) INTO total_score
    FROM jsonb_array_elements(app_record.community_service_claims) as claims
    JOIN achievement_categories ac ON 
        ac.name = claims->>'name' AND
        ac.level::text = claims->>'level' AND
        ac.type = 'community';
        
    RETURN total_score;
END;
$$ LANGUAGE plpgsql;