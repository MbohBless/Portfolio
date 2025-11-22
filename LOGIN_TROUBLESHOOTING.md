# 🐛 Login Issue Troubleshooting

## Issue: Login button doesn't redirect

### Most Common Cause: Unverified Email

Supabase requires email verification by default. If you signed up but didn't click the verification link in your email, you won't be able to log in.

### Quick Fix Options:

#### Option 1: Verify Your Email (Recommended)
1. Check your email inbox (and spam folder)
2. Look for email from Supabase
3. Click the verification link
4. Try logging in again

#### Option 2: Disable Email Confirmation (Development Only)
1. Go to Supabase Dashboard
2. Navigate to **Authentication** > **Providers** > **Email**
3. Turn OFF "Confirm email"
4. Try logging in again
5. **Important**: Re-enable this in production!

#### Option 3: Manually Verify User in Supabase
1. Go to Supabase Dashboard
2. Navigate to **Authentication** > **Users**
3. Find your user
4. Click the user email
5. Look for "Email Confirmed" - if it says "No", manually confirm it
6. Try logging in again

#### Option 4: Create User Directly in Supabase Dashboard
1. Go to Supabase Dashboard
2. **Authentication** > **Users** > **Add User**
3. Choose "Create new user"
4. Enter email and password
5. User is automatically verified
6. Log in with these credentials

### Debugging Steps:

1. **Check Browser Console**
   - Open DevTools (F12)
   - Look at Console tab
   - You should see login attempt messages:
     - 🔐 Attempting login
     - 📊 Login response
     - ✅ Login successful OR ❌ Error message

2. **Check Network Tab**
   - Open DevTools (F12)
   - Go to Network tab
   - Try logging in
   - Look for request to `/auth/v1/token?grant_type=password`
   - Check the response

3. **Verify Supabase Configuration**
   ```bash
   # Check if env variables are set
   cat frontend/.env.local | grep SUPABASE
   
   # Should show:
   # NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   # NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
   ```

4. **Test Supabase Connection**
   - Open browser console on login page
   - Run:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
   // Should show your Supabase URL
   ```

### Error Messages and Solutions:

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Email not confirmed" | User hasn't verified email | Click verification link or disable email confirmation |
| "Invalid login credentials" | Wrong email/password | Check credentials, try password reset |
| "Login failed: No session created" | Session creation issue | Check Supabase configuration, try logging out and in again |
| No error, but nothing happens | JavaScript error | Check browser console for errors |

### Test With Debug Mode:

The login has been updated with console logging. Open browser DevTools console and try logging in. You should see:

```
🔐 Attempting login for: your@email.com
📊 Login response: { data: true, error: undefined }
✅ Login successful, redirecting...
```

Or if there's an error:
```
🔐 Attempting login for: your@email.com
📊 Login response: { data: false, error: 'Email not confirmed' }
❌ Login error: [error details]
❌ Sign in error: [error message]
```

### Still Not Working?

1. **Clear browser cache and cookies**
   - Ctrl+Shift+Delete (Chrome/Edge)
   - Clear all site data for localhost:3000

2. **Restart dev server**
   ```bash
   # Kill server (Ctrl+C)
   cd frontend
   npm run dev
   ```

3. **Check Supabase project status**
   - Go to Supabase Dashboard
   - Verify project is "Active" (not paused)

4. **Create a test account**
   - Use Supabase Dashboard to create verified user
   - Try logging in with that account

5. **Check middleware**
   - Temporarily disable middleware protection
   - See if you can access /admin directly
   - This helps identify if issue is auth or routing

### Quick Test Script:

Open browser console on the login page and run:

```javascript
// Test Supabase connection
const { createClient } = await import('@supabase/supabase-js')
const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_ANON_KEY'
)

// Test login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'your@email.com',
  password: 'yourpassword'
})

console.log('Result:', { data, error })
```

Replace YOUR_SUPABASE_URL and YOUR_ANON_KEY with your actual values from `.env.local`.

### Contact for Help:

If none of these work, check:
1. Browser console errors
2. Network tab for failed requests  
3. Supabase Dashboard logs
4. Share error messages for further debugging
