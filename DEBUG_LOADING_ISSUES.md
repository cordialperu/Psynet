# Debug Guide: App Loading Issues

## Changes Made

### 1. Enhanced Logging in main.tsx
- Added console logs to track app initialization
- Logs environment, base URL, and root element detection
- Enhanced error handlers with stack traces
- Wrapped render in try-catch block

### 2. Enhanced App.tsx
- Added useEffect to log when App component mounts
- Logs current route on mount
- This helps identify if App component is rendering

### 3. Fixed CountryProvider
- Added try-catch around localStorage access
- Prevents crash if localStorage is unavailable (e.g., private browsing)
- Falls back to default country "MX" on errors

### 4. Enhanced home-apple-v3.tsx Query
- Added try-catch in useQuery queryFn
- Returns empty array instead of throwing on fetch errors
- Added console logs for debugging API calls

### 5. Added QueryClient Logging
- Logs when QueryClient initializes successfully
- Helps identify if there's an initialization issue

## How to Diagnose

### Step 1: Check Browser Console
Open the browser developer console (F12) and look for these logs:

1. **Expected startup sequence:**
   ```
   QueryClient initialized successfully
   main.tsx loaded, initializing app...
   Environment: production
   Base URL: /
   Root element: <div id="root">
   Creating React root and rendering...
   App render initiated
   App mounted successfully
   Current route: /
   ```

2. **If you don't see "App mounted successfully":**
   - Check for errors between "App render initiated" and where it stops
   - This indicates a crash in one of the providers or App component

3. **If you see localStorage errors:**
   - The app should still work (we added fallbacks)
   - But note if it's causing other issues

### Step 2: Check Network Tab
1. Look for the initial API call: `/api/therapies/published?country=MX`
2. Check if it returns:
   - **200 OK with demo data** ✅ Good - demo fallback is working
   - **500 Error** ⚠️ Server error - check Vercel function logs
   - **No request** ❌ App crashed before making the request

### Step 3: Check Vercel Function Logs
If you have access to Vercel dashboard:
1. Go to your project → Functions
2. Check the logs for `/api/therapies/published`
3. Look for our console.log statements:
   - "Fetching published therapies with filters: ..."
   - "Database error, returning demo data: ..."
   - "Returned X therapies"

### Step 4: Test Locally
To test if the issue is Vercel-specific:

```bash
npm run dev
```

Then open http://localhost:5000 and check:
- Does it load locally?
- Check the same console logs
- If it works locally but not on Vercel, the issue is deployment-related

## Common Issues and Solutions

### Issue 1: White Screen, No Console Logs
**Cause:** JavaScript bundle not loading or syntax error
**Solution:** 
- Check if `/assets/index-D90LXV_V.js` loads in Network tab
- Look for 404 errors on assets
- Check Vercel build logs for errors

### Issue 2: Logs Stop at "Creating React root"
**Cause:** React render crash (likely in a provider)
**Solution:**
- Check if there's an error after that log
- Most likely CountryProvider or QueryClientProvider
- We've already added error handling, so this shouldn't happen now

### Issue 3: "Connection Error" After Logs
**Cause:** API request failing and not using demo fallback
**Solution:**
- Check if `/api/therapies/published` returns 200 with demo data
- If 500, check server logs
- Verify demo-data.ts is included in build

### Issue 4: App Loads But Shows Nothing
**Cause:** Query returns empty array or component rendering issue
**Solution:**
- Open React DevTools
- Check if components are rendering
- Verify therapies state in home-apple-v3 component

## Deployment Steps

Since git push isn't working, you need to:

### Option 1: Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Find your project
3. Go to Settings → Git
4. Trigger a manual deployment or reconnect git

### Option 2: Vercel CLI with Team Access
```bash
# Login to Vercel
npx vercel login

# Link to existing project
npx vercel link

# Deploy
npx vercel --prod
```

### Option 3: Push via Vercel Git Integration
If the repository exists but you don't have access:
1. Ask team admin to grant access
2. Or get the correct git remote URL
3. Update with: `git remote set-url origin <correct-url>`

## Expected Behavior Now

With all the changes, the app should:
1. ✅ Load even if database is unavailable (uses demo data)
2. ✅ Handle localStorage errors gracefully
3. ✅ Log detailed information for debugging
4. ✅ Show 5 demo therapies from Mexico
5. ✅ Handle query errors without crashing

## Files Modified

1. `/client/src/main.tsx` - Enhanced initialization logging
2. `/client/src/App.tsx` - Added mount logging
3. `/client/src/contexts/country-context.tsx` - Added localStorage error handling
4. `/client/src/pages/home-apple-v3.tsx` - Added query error handling
5. `/client/src/lib/queryClient.ts` - Added initialization logging

## Next Steps

1. **Deploy these changes** (see deployment options above)
2. **Open browser console** on https://psynet.vercel.app/
3. **Copy all console logs** and share them
4. **Check Vercel function logs** if you have access
5. **Report exactly where the logs stop** to pinpoint the issue

The logging is now comprehensive enough that we'll see exactly where the app is failing.
