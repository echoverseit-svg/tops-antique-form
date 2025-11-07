# Quick Setup Guide - TOPS Antique Form

## 🚀 First Time Setup

### 1. Clone & Install
```bash
cd "d:\EchoverseIT\New Version ticket support\Tops Antique form"
npm install
```

### 2. Environment Configuration
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your values:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - VITE_ACCESS_CODE (change from default)
# - VITE_ADMIN_PASSWORD (change from default)
```

### 3. Database Setup
```bash
# If this is a NEW database:
# Run supabase-setup.sql in Supabase SQL Editor

# If database ALREADY EXISTS:
# Run supabase/migrations/20250107_add_status_and_token.sql
```

### 4. Start Development Server
```bash
npm run dev
```

Application will open at `http://localhost:3000`

---

## 🔐 Important Security Steps

### Change Default Passwords!
The default passwords are:
- Form Access: `TOPS2025`
- Admin Access: `TOPS2025Admin`

**You MUST change these before deploying to production!**

Edit your `.env` file:
```env
VITE_ACCESS_CODE=YourSecureCodeHere
VITE_ADMIN_PASSWORD=YourSecurePasswordHere
```

### Never Commit .env
The `.env` file is already in `.gitignore`, but double-check:
```bash
git status
# .env should NOT appear in the list
```

---

## 📱 Application URLs

- **Main Form:** `http://localhost:3000/`
- **Admin Dashboard:** `http://localhost:3000/admin`
- **Status Check:** `http://localhost:3000/status`

---

## 🗄️ Database Requirements

Your Supabase database needs:

### Tables
- `tops_applications` (main table)
- `application_comments` (optional, for status comments)
- `reviewers` (optional, for admin system)

### Storage Buckets
- `tops-uploads` (must be public)

### Row Level Security (RLS)
- Public INSERT on `tops_applications`
- Public READ on `tops-uploads` storage

---

## 🧪 Testing Your Setup

### 1. Test Form Access
1. Go to `http://localhost:3000`
2. Enter your `VITE_ACCESS_CODE`
3. Should show the application form

### 2. Test File Upload
1. Complete General Info section
2. Go to Requirements section
3. Try uploading a PDF (< 5MB)
4. Should upload successfully

### 3. Test Admin Access
1. Go to `http://localhost:3000/admin`
2. Enter your `VITE_ADMIN_PASSWORD`
3. Should show admin dashboard

### 4. Test Form Submission
1. Fill out entire form
2. Submit application
3. Should receive a status token
4. Test status page with token

---

## 🐛 Common Issues

### "Missing Supabase environment variables"
- Check `.env` file exists
- Verify `VITE_SUPABASE_URL` is set
- Verify `VITE_SUPABASE_ANON_KEY` is set
- Restart dev server after changes

### "Error loading applications" in Admin
- Check database table exists
- Verify RLS policies allow reads
- Check browser console for specific error

### File Upload Fails
- Verify `tops-uploads` bucket exists
- Check storage policies allow public uploads
- Ensure file is < 5MB
- Ensure file is PDF/JPG/PNG

### "Invalid access code"
- Check `.env` has correct `VITE_ACCESS_CODE`
- Restart dev server after changing `.env`
- Code is case-sensitive

---

## 📦 Deployment to Production

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to vercel.com
   - Import your GitHub repository
   - Configure project

3. **Set Environment Variables**
   In Vercel dashboard → Settings → Environment Variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_ACCESS_CODE=your_secure_code
   VITE_ADMIN_PASSWORD=your_secure_password
   ```

4. **Deploy**
   - Vercel will auto-deploy
   - Access via your Vercel URL

### Netlify Deployment

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Environment Variables**
   Site settings → Environment variables → Add all VITE_ variables

3. **Deploy**
   - Connect GitHub repo
   - Netlify will auto-build and deploy

---

## 📚 Additional Resources

- **Full Documentation:** See `README.md`
- **Security Guide:** See `SECURITY.md`
- **Admin Instructions:** See `ADMIN_INSTRUCTIONS.md`
- **Changes Applied:** See `CODE_REVIEW_FIXES.md`
- **Database Setup:** See `DATABASE_SETUP_INSTRUCTIONS.md`

---

## 🆘 Getting Help

If you need assistance:

1. Check console for error messages (F12 in browser)
2. Review the documentation files above
3. Verify all environment variables are set
4. Ensure database migration completed successfully

Common checks:
```bash
# Check if .env exists
ls -la .env

# Check if node_modules installed
ls node_modules

# Check if Vite is running
npm run dev
```

---

## ✅ Setup Checklist

- [ ] Cloned repository
- [ ] Ran `npm install`
- [ ] Created `.env` from `.env.example`
- [ ] Set all environment variables
- [ ] Changed default passwords
- [ ] Ran database setup SQL
- [ ] Started dev server successfully
- [ ] Tested form access with access code
- [ ] Tested file upload
- [ ] Tested admin access
- [ ] Tested form submission
- [ ] Verified status check works

If all checkboxes are complete, you're ready to go! 🎉

---

**Last Updated:** November 7, 2025  
**Version:** 1.0.0
