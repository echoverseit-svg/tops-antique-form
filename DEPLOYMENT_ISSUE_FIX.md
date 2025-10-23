# Deployment Issue: Access Code Screen Not Showing

## Problem
The deployed version on Vercel shows the form directly instead of the access code screen, while localhost shows the access code screen correctly.

## Root Cause
The access code authorization is stored in the browser's `sessionStorage`. If someone previously entered the correct access code on that browser, it remains stored and bypasses the access code screen on subsequent visits.

## Solutions

### Solution 1: Clear Browser Session Storage (Quick Fix)
1. Open the Vercel deployed URL in an **incognito/private browser window**
2. You should now see the access code screen
3. This confirms the issue is cached authorization

### Solution 2: Use Reset URL Parameter (Added)
Visit your deployed URL with `?reset=true` at the end:
```
https://topsantiqueforms.vercel.app?reset=true
```
This will clear the session storage and show the access code screen.

### Solution 3: Clear Browser Data
1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Find "Session Storage" → your domain
4. Delete the `form_authorized` key
5. Refresh the page

## Files Modified

### 1. `vercel.json` (Created)
- Added cache control headers to prevent caching issues
- Configured proper routing for single-page application

### 2. `src/App.tsx` (Updated)
- Added URL parameter check for `?reset=true`
- Allows clearing session storage via URL
- Automatically removes the parameter from URL after reset

## Testing
1. **Local**: Run `npm run dev` - should show access code screen ✓
2. **Deployed**: Visit with `?reset=true` - should show access code screen
3. **After entering code**: Should remember authorization for the session

## Access Codes
- **Form Access**: `TOPS2025`
- **Admin Access**: `TOPS2025Admin`

## Deployment Steps
1. Commit the changes:
   ```bash
   git add .
   git commit -m "Fix: Add session reset and cache control"
   git push
   ```
2. Vercel will automatically redeploy
3. Test with `?reset=true` parameter if needed
