# Database Setup Instructions

## ⚠️ IMPORTANT: Complete This Step Before Using the Application

The application requires a database table in Supabase. Follow these steps to set it up:

## Step-by-Step Instructions

### 1. Access Supabase SQL Editor

1. Open your browser and go to: https://mlnzzooejmkhgghmhzsi.supabase.co
2. Log in with your credentials (Password: `2rwmmU86c8Dcbxd9`)
3. In the left sidebar, click on **SQL Editor**

### 2. Run the Setup SQL

Copy and paste the following SQL code into the SQL Editor:

```sql
-- Create the antique_applications table
CREATE TABLE IF NOT EXISTS antique_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  antique_description TEXT NOT NULL,
  estimated_age TEXT NOT NULL,
  condition TEXT NOT NULL,
  provenance TEXT NOT NULL,
  photos TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE antique_applications ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public inserts (anyone can submit an application)
CREATE POLICY "Allow public inserts" ON antique_applications
  FOR INSERT
  WITH CHECK (true);

-- Create a policy to allow authenticated reads (for admin dashboard)
CREATE POLICY "Allow authenticated reads" ON antique_applications
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create an index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_antique_applications_created_at 
  ON antique_applications(created_at DESC);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_antique_applications_email 
  ON antique_applications(email);
```

### 3. Execute the SQL

1. After pasting the SQL code, click the **Run** button (or press `Ctrl+Enter`)
2. You should see a success message: "Success. No rows returned"
3. This means the table was created successfully!

### 4. Verify the Table

1. In the left sidebar, click on **Table Editor**
2. You should see `antique_applications` in the list of tables
3. Click on it to view the table structure

## Table Structure

The `antique_applications` table has the following columns:

| Column Name           | Type      | Description                          |
|-----------------------|-----------|--------------------------------------|
| id                    | UUID      | Unique identifier (auto-generated)   |
| full_name             | TEXT      | Applicant's full name                |
| email                 | TEXT      | Applicant's email address            |
| phone                 | TEXT      | Applicant's phone number             |
| address               | TEXT      | Applicant's address                  |
| antique_description   | TEXT      | Description of the antique           |
| estimated_age         | TEXT      | Estimated age of the antique         |
| condition             | TEXT      | Condition of the antique             |
| provenance            | TEXT      | History/provenance of the antique    |
| photos                | TEXT[]    | Array of photo URLs (future use)     |
| created_at            | TIMESTAMP | Submission timestamp                 |

## Security Policies

The table has Row Level Security (RLS) enabled with two policies:

1. **Public Inserts**: Anyone can submit an application (insert data)
2. **Authenticated Reads**: Only authenticated users can view submissions

This ensures that:
- ✅ Anyone can fill out and submit the form
- ✅ Only authorized admins can view the submissions
- ✅ Data is protected from unauthorized access

## Troubleshooting

### Error: "relation already exists"
- This means the table was already created. You're good to go!

### Error: "permission denied"
- Make sure you're logged in as the project owner
- Check that you have the correct permissions

### Error: "syntax error"
- Make sure you copied the entire SQL code
- Check for any missing characters

## Next Steps

Once the database is set up:

1. The application is already running at `http://localhost:3000`
2. Test the form by submitting a sample application
3. View submissions in Supabase Table Editor

## Viewing Submissions

To view all submitted applications:

1. Go to Supabase Dashboard
2. Click **Table Editor** → **antique_applications**
3. You'll see all submissions with timestamps
4. You can export data as CSV if needed

## Connection Details (Already Configured)

The application is already connected to Supabase with:
- **Project URL**: https://mlnzzooejmkhgghmhzsi.supabase.co
- **API Key**: Configured in `.env.local`
- **Password**: 2rwmmU86c8Dcbxd9

✅ No additional configuration needed!
