# Admin Dashboard Instructions

## 🔐 Accessing the Admin Dashboard

### Method 1: Click the Button
1. Go to the main form page
2. Click the **"Admin Dashboard"** button at the top
3. You'll be redirected to the admin dashboard

### Method 2: Direct URL
1. Navigate to: `http://localhost:5173/admin`
2. Or in production: `https://your-domain.com/admin`

## 📊 Admin Dashboard Features

### View All Applications
- See all submitted applications in a table
- View applicant details (name, email, phone, school, etc.)
- See claim counts for Academic, Leadership, and Community Service

### Search & Filter
- **Search**: By name, email, or municipality
- **Filter by Municipality**: Select specific municipality
- **Filter by School Level**: Elementary, Junior High, or Senior High

### Download Options

#### 1. Download CSV
- Downloads a spreadsheet with all basic information
- Includes: Name, contact info, school details, file URLs, claim counts
- Perfect for Excel/Google Sheets

#### 2. Download JSON
- Downloads all data in JSON format
- Includes all fields and metadata
- Good for data processing

#### 3. Download Detailed Report
- Downloads complete data including ALL claims
- Each claim with full details (name, type, rank, level, modality, file URL)
- Best for comprehensive analysis

#### 4. View Individual Details
- Click "View Details" on any row
- Downloads that specific application as JSON
- Includes all claims and uploaded file URLs

## 📁 Accessing Uploaded Files

### From the Dashboard
1. In the downloaded CSV/JSON, you'll see file URLs like:
   ```
   https://mlnzzooejmkhgghmhzsi.supabase.co/storage/v1/object/public/tops-uploads/filename.pdf
   ```
2. Click or copy these URLs to view/download files

### From Supabase Storage
1. Go to: https://mlnzzooejmkhgghmhzsi.supabase.co
2. Login with password: `2rwmmU86c8Dcbxd9`
3. Click **Storage** → **tops-uploads** bucket
4. Browse and download all files

## 🔒 Security Note

**Important**: The admin dashboard currently has no authentication. Anyone who knows the URL can access it.

### To Add Password Protection (Recommended):

1. **Option A: Simple Password**
   - Add a password prompt before showing the dashboard
   - Store password in environment variable

2. **Option B: Supabase Auth**
   - Use Supabase authentication
   - Only logged-in users can view dashboard
   - Already configured in the database policies!

3. **Option C: Hide the Button**
   - Remove the "Admin Dashboard" button from the main page
   - Only access via direct URL `/admin`
   - Share URL only with authorized personnel

## 📈 Data Structure

### Main Application Fields
- Personal info (name, address, email, phone, birthday, age, sex)
- School details (level, name, address, head, advisor contacts)
- Requirement files (4 URLs)
- Data privacy acceptance
- Timestamps (created_at, updated_at)

### Claims (JSONB Arrays)
Each claim contains:
- `name`: Award/certificate name
- `type_of_participation`: Type of involvement
- `rank`: Position/rank achieved
- `level`: Competition/event level
- `modality`: Face-to-face/Online/Hybrid (Leadership & Community only)
- `file_url`: Certificate file URL

## 💡 Tips

1. **Regular Backups**: Download data regularly (weekly recommended)
2. **File Management**: Download files from Supabase Storage periodically
3. **Data Analysis**: Use CSV for quick analysis in Excel/Sheets
4. **Detailed Review**: Use JSON detailed report for complete information
5. **Search Efficiently**: Use filters to find specific applications quickly

## 🆘 Troubleshooting

### "Error loading applications"
- Make sure the database is set up (run `supabase-setup.sql`)
- Check Supabase connection in `.env` file

### "No data to download"
- No applications have been submitted yet
- Check if data is visible in Supabase Table Editor

### Files not loading
- Check if storage bucket `tops-uploads` exists
- Verify storage policies are set up correctly

## 📞 Support

For technical issues:
1. Check browser console for errors (F12)
2. Verify Supabase credentials in `.env`
3. Ensure database and storage are properly configured
