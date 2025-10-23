# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Set Up Supabase Database

1. Go to your Supabase project: https://mlnzzooejmkhgghmhzsi.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Copy and paste the contents of `supabase-setup.sql` file
4. Click **Run** to create the database table

### Step 2: Run the Application

Open a terminal in this directory and run:

```bash
npm run dev
```

The application will automatically open in your browser at `http://localhost:3000`

### Step 3: Test the Form

1. Fill out the application form with test data
2. Click "Submit Application"
3. Verify the data in Supabase:
   - Go to **Table Editor** in Supabase
   - Select `antique_applications` table
   - You should see your submitted data

## 🔧 Troubleshooting

### If the form doesn't submit:

1. Check that the database table was created correctly
2. Verify the environment variables in `.env.local`
3. Check the browser console for error messages
4. Ensure Row Level Security policies are set up correctly

### If you see connection errors:

1. Verify your Supabase project URL is correct
2. Check that your API key is valid
3. Ensure your internet connection is stable

## 📊 View Submitted Applications

To view all submitted applications in Supabase:

1. Go to your Supabase dashboard
2. Click on **Table Editor**
3. Select the `antique_applications` table
4. You'll see all submitted applications with timestamps

## 🎨 Customize the Form

- **Colors**: Edit `tailwind.config.js` to change the color scheme
- **Form Fields**: Modify `src/components/ApplicationForm.tsx`
- **Validation**: Add custom validation in the form component
- **Styling**: Update `src/index.css` for global styles

## 📝 Next Steps

- Add image upload functionality for antique photos
- Create an admin dashboard to view submissions
- Add email notifications for new submissions
- Implement form field validation
- Add analytics tracking

## 🔐 Security Notes

- The `.env.local` file contains your Supabase credentials
- Never commit `.env.local` to version control (it's in `.gitignore`)
- The anon key is safe to use in the browser
- Row Level Security policies protect your data

## 📞 Support

For issues or questions, contact the development team at EchoverseIT.
