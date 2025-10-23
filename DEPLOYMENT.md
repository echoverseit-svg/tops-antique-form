# 🚀 Deploy TOPS Form to Vercel

## Prerequisites
- GitHub account
- Vercel account (free at vercel.com)
- Git installed on your computer

## Step 1: Push to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - TOPS Application Form"
   ```

2. **Create a new repository on GitHub**:
   - Go to https://github.com/new
   - Name it: `tops-antique-form`
   - Don't initialize with README (you already have code)
   - Click "Create repository"

3. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/tops-antique-form.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

### Option A: Using Vercel Dashboard (Easiest)

1. **Go to Vercel**: https://vercel.com
2. **Sign in** with GitHub
3. **Click "Add New Project"**
4. **Import** your `tops-antique-form` repository
5. **Configure Project**:
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`

6. **Add Environment Variables**:
   Click "Environment Variables" and add:
   ```
   VITE_SUPABASE_URL = https://mlnzzooejmkhgghmhzsi.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sbnp6b29lam1raGdnaG1oenNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNjE2ODgsImV4cCI6MjA3NjczNzY4OH0.pCyw9fp8hK6-QmiyS0lQkmzdQpwtyVPzwtTXfzInzzY
   ```

7. **Click "Deploy"**

### Option B: Using Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Follow prompts**:
   - Set up and deploy? **Y**
   - Which scope? (Select your account)
   - Link to existing project? **N**
   - Project name? **tops-antique-form**
   - Directory? **./
   - Override settings? **N**

5. **Add environment variables**:
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   ```

6. **Deploy to production**:
   ```bash
   vercel --prod
   ```

## Step 3: Verify Deployment

1. **Visit your URL**: `https://tops-antique-form.vercel.app` (or your custom URL)
2. **Test the form**: Fill out and submit
3. **Check admin dashboard**: Go to `/admin`
4. **Verify Supabase connection**: Check if data is saved

## Step 4: Custom Domain (Optional)

1. Go to your Vercel project settings
2. Click **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

## Important Notes

### ⚠️ Security
- ✅ `.env` file is NOT deployed (in `.gitignore`)
- ✅ Environment variables are set in Vercel dashboard
- ✅ Supabase credentials are secure
- ⚠️ Admin dashboard has no password (add authentication later)

### 🔄 Automatic Deployments
- Every `git push` to `main` branch = automatic deployment
- Preview deployments for pull requests
- Rollback to previous versions anytime

### 📊 Monitoring
- View deployment logs in Vercel dashboard
- Check analytics and performance
- Monitor function invocations

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

### Form Doesn't Submit
- Check browser console for errors
- Verify Supabase environment variables
- Check Supabase policies are set up

### Files Don't Upload
- Verify storage bucket exists: `tops-uploads`
- Check storage policies in Supabase
- Ensure bucket is public

## Update Deployment

To update your live site:
```bash
git add .
git commit -m "Update message"
git push
```

Vercel will automatically rebuild and deploy! 🎉

## URLs

- **Production**: https://tops-antique-form.vercel.app
- **Admin Dashboard**: https://tops-antique-form.vercel.app/admin
- **Supabase Dashboard**: https://mlnzzooejmkhgghmhzsi.supabase.co

## Support

For issues:
1. Check Vercel deployment logs
2. Check browser console
3. Check Supabase logs
4. Review this guide
