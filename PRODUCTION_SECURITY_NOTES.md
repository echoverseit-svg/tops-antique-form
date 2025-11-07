# ⚠️ Production Security Notes

## 🚨 CRITICAL: Delete Operations Security

### Current Status (Development)
The delete functionality currently uses **PUBLIC policies** that allow anyone with the anon key to delete data. This is **ACCEPTABLE FOR LOCAL DEVELOPMENT ONLY**.

**Migration Applied:** `20250107_add_delete_policies.sql`

---

## ❌ Why This Is Not Secure for Production

The current setup allows:
- ✅ Anyone can delete applications
- ✅ Anyone can delete files from storage
- ✅ No authentication required
- ✅ No admin role checking

**Risk Level:** 🔴 **CRITICAL** - Anyone who accesses `/admin` and knows the password can delete all data.

---

## ✅ Solutions for Production

### **Option 1: Implement Supabase Auth (RECOMMENDED)**

This is the most secure and proper solution.

#### Step 1: Enable Supabase Auth
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

#### Step 2: Add Login to Admin Dashboard
```typescript
// Example login function
const loginAdmin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error
  return data
}
```

#### Step 3: Update RLS Policies
Run this SQL in Supabase:
```sql
-- Remove dev policies
DROP POLICY IF EXISTS "Allow public deletes for dev" ON tops_applications;
DROP POLICY IF EXISTS "Allow public updates for dev" ON tops_applications;
DROP POLICY IF EXISTS "Allow public storage deletes for dev" ON storage.objects;
DROP POLICY IF EXISTS "Allow public storage updates for dev" ON storage.objects;

-- Add secure policies
CREATE POLICY "Allow authenticated deletes"
    ON tops_applications
    FOR DELETE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated updates"
    ON tops_applications
    FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated storage deletes"
    ON storage.objects
    FOR DELETE
    USING (bucket_id = 'tops-uploads' AND auth.role() = 'authenticated');
```

#### Step 4: Create Admin Users
In Supabase Dashboard:
1. Go to Authentication → Users
2. Add admin users with email/password
3. Optionally: Add custom claims for role-based access

---

### **Option 2: Use Server-Side API with Service Role Key**

Keep client-side simple, handle deletes on server.

#### Step 1: Set Up Vercel Serverless Functions
Already exists in `/api` folder, just needs deployment.

#### Step 2: Set Environment Variables
In Vercel/Netlify:
```
SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

#### Step 3: Remove Public Delete Policies
```sql
DROP POLICY IF EXISTS "Allow public deletes for dev" ON tops_applications;
DROP POLICY IF EXISTS "Allow public updates for dev" ON tops_applications;
DROP POLICY IF EXISTS "Allow public storage deletes for dev" ON storage.objects;
DROP POLICY IF EXISTS "Allow public storage updates for dev" ON storage.objects;
```

The API endpoints will handle deletes with service role key (bypasses RLS).

---

### **Option 3: IP Whitelist + Basic Auth (Quick but Limited)**

For small-scale or internal use only.

#### Add IP Restrictions
In Supabase Dashboard → Settings → API:
- Restrict API access to specific IPs
- Only allow admin IP addresses

#### Still Keep Delete Policies Restricted
Still implement Option 1 or 2 above for proper security.

---

## 📋 Production Deployment Checklist

Before deploying to production, ensure:

### Security
- [ ] Remove or replace public delete policies
- [ ] Implement authentication (Option 1 or 2)
- [ ] Test delete operations with new auth
- [ ] Change all default passwords in `.env`
- [ ] Rotate Supabase keys if they were exposed
- [ ] Enable Supabase Auth email verification
- [ ] Set up admin user accounts

### Database
- [ ] Review all RLS policies
- [ ] Test policies with different user roles
- [ ] Backup database before deployment
- [ ] Document policy changes

### Application
- [ ] Update admin dashboard to use auth
- [ ] Add proper session management
- [ ] Implement logout functionality
- [ ] Add admin activity logging (optional)
- [ ] Test all CRUD operations

### Environment
- [ ] Set production environment variables
- [ ] Remove development-only policies
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Set up monitoring/alerts

---

## 🔍 How to Check Current Policies

Run this in Supabase SQL Editor:

```sql
-- Check tops_applications policies
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'tops_applications';

-- Check storage policies
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects';
```

Look for policies with names containing "dev" - these need to be removed for production.

---

## 📝 Current Development Setup

### What Works Now
- ✅ Delete applications from admin dashboard
- ✅ Delete files from storage
- ✅ Works in local development
- ✅ No API server needed for dev

### What's Insecure
- ❌ No authentication required
- ❌ Anyone with anon key can delete
- ❌ Client-side password is not secure
- ❌ No audit trail for deletions

---

## 🚀 Quick Migration Path

### For Production Launch:

1. **Deploy the app first** with current setup (deletes won't work)
2. **Set up Vercel environment variables** with service role key
3. **Deletes will automatically use server API** (already implemented)
4. **Later: Implement Supabase Auth** for better security

This gives you time to implement proper auth without blocking launch.

---

## 📞 Need Help?

If implementing auth seems complex:
1. Deploy first without delete functionality
2. Use Supabase dashboard for manual deletes
3. Implement auth in a future update

Remember: **It's better to launch without deletes than to launch with insecure deletes!**

---

**Last Updated:** November 7, 2025  
**Status:** Development policies active - NOT PRODUCTION READY
