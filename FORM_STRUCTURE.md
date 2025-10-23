# TOPS Application Form - Complete Structure

## Overview
This is a comprehensive 64-section application form for the **21st TOPS (Ten Outstanding Pupils and Students) Antique Awards**.

## 7-Step Multi-Step Form

### Step 1: General Information (Section 1)
**Fields:**
- Full Name (Last, First, MI) *
- Complete Address *
- Municipality *
- Phone Number *
- Email *
- Birthday *
- Age *
- Sex * (Male/Female)

### Step 2: School Details (Section 2)
**Fields:**
- School Level * (Elementary/Junior High School/Senior High School)
- Name of School *
- Address of School *

**School Head Information:**
- Full Name of School Head *
- Email Address *
- Mobile Number *

**Class Advisor Information:**
- Full Name of Class Advisor *
- Email Address *
- Mobile Number *

### Step 3: Requirements (Section 3)
**Required Document Uploads:**
1. Nomination letter signed by at least three (3) members of the School Screening Committee *
2. Academic records (Form 137 for Elementary / SF 10 for Senior High) *
3. Certificate of the truthfulness of information *
4. A clear 2x2 picture taken within the last twelve (12) months *

### Step 4: Academic Profile (Sections 4-23)
**Maximum 20 Claims**

Each claim includes:
- Name of award or certificate *
- Type of Participation * (Individual/Group/Team)
- Rank * (1st Place/2nd Place/3rd Place/Champion/Participant)
- Level * (School/District/Division/Regional/National/International/Provincial/Municipal/Barangay/Other)
- Upload Certificate * (PDF, DOC, DOCX, JPG, JPEG, PNG)

**Note:** Users can add "N/A" if no claims to report

### Step 5: Leadership Profile (Sections 24-43)
**Maximum 20 Claims**

Each claim includes:
- Name of award or certificate *
- Type of Participation * (President/Vice President/Secretary/Treasurer/Member/Other)
- Rank/Position * (President/Vice President/Secretary/Treasurer/Auditor/PRO/Member/Chairperson/Co-Chairperson/Officer/Other)
- Level * (School/District/Division/Regional/National/International/Provincial/Municipal/Barangay/Other)
- Modality * (Face-to-face/Online/Hybrid)
- Upload Certificate * (PDF, DOC, DOCX, JPG, JPEG, PNG)

**Note:** Users can add "N/A" if no claims to report

### Step 6: Community Service Profile (Sections 44-63)
**Maximum 20 Claims**

Each claim includes:
- Name of award or certificate *
- Type of Participation * (Organizer/Volunteer/Participant/Speaker/Facilitator/Other)
- Rank/Position * (Organizer/Lead Volunteer/Volunteer/Participant/Coordinator/Member/Other/N/A)
- Level * (School/Barangay/Municipal/Provincial/Regional/National/International/Other)
- Modality * (Face-to-face/Online/Hybrid)
- Upload Certificate * (PDF, DOC, DOCX, JPG, JPEG, PNG)

**Note:** Users can add "N/A" if no claims to report

### Step 7: Data Privacy and Confirmation (Section 64)
**Important Notice:**
Once this form has been submitted, no further edits can be made.

**Three Declarations:**

1. **Data Privacy:**
   - I understand that my personal information will be collected and used solely for evaluating my nomination
   - I consent to the processing and storage of my information
   - I acknowledge that all information will be kept confidential

2. **Truthfulness:**
   - I affirm that all information provided is accurate, complete, and truthful
   - I understand that false information may result in disqualification

3. **Confirmation:**
   - I have read and understood the guidelines and requirements
   - I agree to comply with them

**Final Checkbox:**
- I hereby acknowledge and accept the terms outlined above *

## Technical Implementation

### Component Structure
```
src/
├── components/
│   ├── TOPSMultiStepForm.tsx          # Main orchestrator
│   └── sections/
│       ├── GeneralInfoSection.tsx      # Step 1
│       ├── SchoolDetailsSection.tsx    # Step 2
│       ├── RequirementsSection.tsx     # Step 3
│       ├── AcademicProfileSection.tsx  # Step 4 (Sections 4-23)
│       ├── LeadershipProfileSection.tsx # Step 5 (Sections 24-43)
│       ├── CommunityServiceSection.tsx # Step 6 (Sections 44-63)
│       └── DataPrivacySection.tsx      # Step 7 (Section 64)
```

### Database Schema
- **Table:** `tops_applications`
- **Storage Bucket:** `tops-uploads` (for file uploads)
- **Claims Storage:** JSONB format for flexible claim management

### Features
- ✅ Progress bar showing current step
- ✅ Step indicators (1-7)
- ✅ Previous/Next navigation
- ✅ Dynamic claim addition/removal
- ✅ File upload with progress indication
- ✅ Form validation
- ✅ Data persistence in Supabase
- ✅ Success confirmation page

## User Experience Flow

1. **Start:** User sees Step 1 (General Information)
2. **Navigate:** User fills form and clicks "Next" to proceed
3. **Add Claims:** In steps 4-6, user can add multiple claims dynamically
4. **Upload Files:** User uploads required documents and certificates
5. **Review:** Step 7 shows data privacy terms
6. **Submit:** User accepts terms and submits application
7. **Confirmation:** Success message displayed

## Validation Rules
- All fields marked with * are required
- Email fields must be valid email format
- Phone numbers should be valid format
- Date fields must be valid dates
- File uploads must be in accepted formats
- At least one claim should be added in each profile section (or "N/A")
- Data privacy checkbox must be checked before submission

## File Upload Specifications
- **Accepted Formats:** PDF, DOC, DOCX, JPG, JPEG, PNG
- **Storage:** Supabase Storage bucket `tops-uploads`
- **Naming:** Timestamped with random string for uniqueness
- **Access:** Public URLs generated for database storage

## Total Section Count
- **Main Steps:** 7
- **Total Sections:** 64
  - Section 1: General Information
  - Section 2: School Details
  - Section 3: Requirements
  - Sections 4-23: Academic Profile (20 claims)
  - Sections 24-43: Leadership Profile (20 claims)
  - Sections 44-63: Community Service Profile (20 claims)
  - Section 64: Data Privacy & Confirmation
