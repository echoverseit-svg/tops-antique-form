# Security & Keys

**CRITICAL: Never commit secrets to your repository!**

This includes:
- Supabase service role keys
- JWT secrets
- Access codes and passwords
- API keys
- Database credentials

If you believe a Supabase service_role key has been leaked or posted publicly, do the following immediately:

1. Rotate the key in Supabase dashboard
   - Project → Settings → API → Reveal / Regenerate service_role key

2. Update Vercel environment variables
   - Project → Settings → Environment Variables
   - Set SUPABASE_SERVICE_ROLE_KEY to the new value (mark as "Secret" in Vercel)
   - Also ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set for client builds

3. Invalidate the old key (rotation does this), and avoid reusing it anywhere.

4. If the old key was committed to git and pushed to a public repo, consider using a history rewrite tool (BFG or git filter-repo) to remove it from history.

## Environment Variables Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual values in `.env`

3. **NEVER commit `.env` to git** - it's already in `.gitignore`

4. For production deployment, set environment variables in your hosting platform (Vercel, Netlify, etc.)

## Local Development Recommendations

- Keep service-role keys only in your running shell when needed
- Do NOT store them in .env files that may be committed
- Use `.env.local` for development-specific overrides
- All `.env*` files are in `.gitignore` except `.env.example`

## Access Code Security

The application uses client-side access codes for form and admin access:
- `VITE_ACCESS_CODE` - Required to access the application form
- `VITE_ADMIN_PASSWORD` - Required to access admin dashboard

**Important Notes:**
- These are stored in environment variables but are still visible in client-side code
- For production use, implement proper server-side authentication (Supabase Auth recommended)
- Current implementation is basic protection, not enterprise-grade security
- Consider implementing rate limiting to prevent brute force attempts

## Contact

If you need help rotating keys or validating deployments, provide a sanitized log (no keys) and I can guide the steps.