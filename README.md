# 21st TOPS (Ten Outstanding Pupils and Students) Antique - Application Form

A comprehensive, multi-step web application for submitting TOPS award nominations with 64 sections, built with React, TypeScript, Vite, TailwindCSS, and Supabase.

## Features

- 🎨 Beautiful, modern UI with TailwindCSS
- 📱 Fully responsive design
- 🔐 Secure Supabase backend integration
- ✨ Real-time form validation
- 🚀 Fast development with Vite
- 📝 TypeScript for type safety
- 📊 Multi-step form with progress tracking (7 main sections, 64 total sections)
- 📤 File upload functionality for certificates and documents
- 🎯 Dynamic claim management (up to 20 claims per category)
- ✅ Data privacy compliance with confirmation

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

## Database Setup

Before running the application, you need to create the required table in your Supabase database:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the following SQL command:

```sql
CREATE TABLE antique_applications (
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

-- Create a policy to allow inserts
CREATE POLICY "Allow public inserts" ON antique_applications
  FOR INSERT
  WITH CHECK (true);

-- Create a policy to allow reads (optional, for admin dashboard)
CREATE POLICY "Allow authenticated reads" ON antique_applications
  FOR SELECT
  USING (auth.role() = 'authenticated');
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. The environment variables are already configured in `.env.local`:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY

## Development

Start the development server:

```bash
npm run dev
```

The application will open automatically at `http://localhost:3000`

## Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   └── ApplicationForm.tsx    # Main form component
├── lib/
│   └── supabase.ts           # Supabase client configuration
├── types/
│   └── index.ts              # TypeScript type definitions
├── App.tsx                   # Main application component
├── main.tsx                  # Application entry point
└── index.css                 # Global styles with Tailwind
```

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Supabase** - Backend as a Service
- **Lucide React** - Beautiful icon library

## Form Structure (64 Sections)

The application form is organized into 7 main steps covering 64 sections:

### Step 1: General Information (Section 1)
- Full Name (Last, First, MI)
- Complete Address
- Municipality
- Phone Number
- Email
- Birthday
- Age
- Sex

### Step 2: School Details (Section 2)
- School Level (Elementary/Junior High/Senior High)
- School Name and Address
- School Head Information (Name, Email, Mobile)
- Class Advisor Information (Name, Email, Mobile)

### Step 3: Requirements (Section 3)
- Nomination Letter (signed by 3+ committee members)
- Academic Records (Form 137/SF 10)
- Certificate of Truthfulness
- 2x2 Photo (within 12 months)

### Step 4: Academic Profile (Sections 4-23)
- Up to 20 academic achievement claims
- Each claim includes:
  - Name of award/certificate
  - Type of Participation (Individual/Group/Team)
  - Rank (1st/2nd/3rd/Champion/Participant)
  - Level (School/District/Division/Regional/National/International)
  - Certificate upload

### Step 5: Leadership Profile (Sections 24-43)
- Up to 20 leadership experience claims
- Each claim includes:
  - Name of award/certificate
  - Type of Participation (President/VP/Secretary/etc.)
  - Rank/Position
  - Level
  - Modality (Face-to-face/Online/Hybrid)
  - Certificate upload

### Step 6: Community Service Profile (Sections 44-63)
- Up to 20 community service claims
- Each claim includes:
  - Name of award/certificate
  - Type of Participation (Organizer/Volunteer/Participant/etc.)
  - Rank/Position
  - Level
  - Modality
  - Certificate upload

### Step 7: Data Privacy & Confirmation (Section 64)
- Data Privacy Agreement
- Truthfulness Declaration
- Confirmation of Guidelines
- Final submission

## License

Private - EchoverseIT
\nchore: trigger redeploy 2025-11-06T16:18:46
