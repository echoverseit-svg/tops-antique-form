Local dev API helper

This repository includes a small local dev API at `scripts/dev-api.js` that mimics the serverless admin endpoints used in production.

Purpose
- Let the Admin Dashboard call service-role-backed endpoints during local development without deploying to Vercel.

Usage (local only)
1. Install dependencies if you haven't:
   npm install

2. Set required environment variables in your shell (PowerShell example):

```powershell
$env:SUPABASE_URL = 'https://<your-project>.supabase.co'
$env:SUPABASE_SERVICE_ROLE_KEY = '<your-service-role-key>'
$env:VITE_API_BASE_URL = 'http://localhost:3001'
```

3. Start the local API server:

```powershell
npm run dev:api
```

4. Start the frontend in a separate terminal:

```powershell
npm run dev
```

Security notes
- The `SUPABASE_SERVICE_ROLE_KEY` is a secret and must NOT be committed to source control. Only set it in your local shell or CI / Vercel environment variables.
- Do NOT expose the service role key to the browser or in any client-side env variables (those must be prefixed with `VITE_`).

Deployment to Vercel
- You do NOT need this local dev API for Vercel. Vercel will run the serverless functions in `api/` for you. Make sure you set the following environment variables in Vercel dashboard:
  - SUPABASE_SERVICE_ROLE_KEY (server-only)
  - SUPABASE_URL
  - VITE_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY

If you don't want the local helper in the repo, you can delete `scripts/dev-api.js`.
