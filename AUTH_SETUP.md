# 🔒 Authentication Setup Guide

## Complete Supabase Authentication Implementation

Your portfolio now has **full authentication** protecting the admin routes. Here's how to set it up:

---

## ✅ What's Been Implemented

1. **Login Page** (`/admin/login`) - Email/password authentication
2. **Signup Page** (`/admin/signup`) - User registration with email confirmation
3. **Logout Functionality** - Secure sign out from admin pages
4. **Protected Routes** - All `/admin/*` routes require authentication
5. **Session Management** - Automatic session refresh and validation
6. **Auth Callback** - Handle email verification and OAuth redirects
7. **User Display** - Shows logged-in user email in admin header

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project (free tier is fine)
4. Wait 2-3 minutes for project setup

### Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy these values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### Step 3: Configure Environment Variables

Edit `frontend/.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Replace the placeholder values with your actual Supabase credentials!

### Step 4: Enable Email Authentication

In Supabase Dashboard:
1. Go to **Authentication** > **Providers**
2. Ensure **Email** is enabled (it's on by default)
3. Configure email templates if desired

### Step 5: Restart Dev Server

```bash
# Kill the current dev server (Ctrl+C)
cd frontend
npm run dev
```

---

## 🔐 How It Works

### Authentication Flow

```
1. User visits /admin → Middleware checks session
2. No session? → Redirect to /admin/login
3. User logs in → Supabase authenticates
4. Success → Redirect to /admin dashboard
5. User navigates admin pages → Session validated
6. Logout → Clear session, redirect to login
```

### Protected Routes

All routes under `/admin/*` are protected except:
- `/admin/login` - Login page
- `/admin/signup` - Registration page

### File Structure

```
frontend/src/
├── lib/
│   ├── auth-server.ts     # Server-side auth utilities
│   └── auth-client.ts     # Client-side auth hook
├── components/
│   └── LogoutButton.tsx   # Logout component
├── app/
│   ├── admin/
│   │   ├── login/        # Login page
│   │   └── signup/       # Signup page
│   └── auth/
│       └── callback/     # OAuth/email callback
└── middleware.ts          # Route protection
```

---

## 👤 Creating Your Admin Account

### Option 1: Self-Registration (Development)

1. Visit: http://localhost:3000/admin/signup
2. Enter your email and password
3. Check your email for confirmation link
4. Click the link to verify
5. You can now log in at `/admin/login`

### Option 2: Direct Database Insert (Production)

If you want to bypass email verification:

1. Go to Supabase Dashboard > **Authentication** > **Users**
2. Click "Add user" > "Create new user"
3. Enter email and password
4. User is created and verified automatically

### Option 3: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Create user
supabase auth users create your@email.com --password yourpassword
```

---

## 🔒 Security Features

### 1. Session Management
- Automatic session refresh
- Secure cookie-based authentication
- Session expires after inactivity

### 2. Route Protection
- Middleware validates every request
- Unauthenticated users redirected to login
- Authenticated users can't access auth pages

### 3. CSRF Protection
- Built-in with Supabase Auth
- Secure token exchange
- Protected cookies

### 4. Password Requirements
- Minimum 6 characters (configurable in Supabase)
- Can enable additional requirements in Supabase settings

---

## 🎨 Customization

### Change Login Redirect URL

Edit `frontend/src/lib/auth-client.ts`:

```typescript
// After successful login
router.push('/admin') // Change to your desired route
```

### Customize Email Templates

In Supabase Dashboard:
1. **Authentication** > **Email Templates**
2. Customize:
   - Confirmation email
   - Password reset email
   - Magic link email

### Add Social Providers (Google, GitHub, etc.)

1. In Supabase: **Authentication** > **Providers**
2. Enable desired provider (Google, GitHub, etc.)
3. Configure OAuth credentials
4. Add social login buttons to login page

Example Google login button:

```typescript
// In login page
const handleGoogleLogin = async () => {
  const supabase = createClientComponentClient()
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
}
```

---

## 🔧 Advanced Configuration

### Restrict Admin Access by Email Domain

Edit `frontend/src/lib/auth-server.ts`:

```typescript
export const isAdmin = cache(async () => {
  const user = await getUser()
  if (!user) return false
  
  // Only allow specific domain
  const isAdminUser = user.email?.endsWith('@yourdomain.com')
  
  return isAdminUser
})
```

### Add Role-Based Access Control (RBAC)

1. Add role field to user metadata
2. Check role in middleware or page components
3. Example:

```typescript
// Check role
const user = await getUser()
const isAdmin = user?.user_metadata?.role === 'admin'
```

### Enable Multi-Factor Authentication (MFA)

In Supabase Dashboard:
1. **Authentication** > **MFA**
2. Enable TOTP (Time-based One-Time Password)
3. Users can enable MFA in their account settings

---

## 🐛 Troubleshooting

### Error: "Invalid API Key"

**Solution**: Check that your API keys are correct in `.env.local`

```bash
# Verify keys are set correctly
cat frontend/.env.local | grep SUPABASE
```

### Error: "Email not confirmed"

**Solutions**:
1. Check spam folder for confirmation email
2. Manually confirm user in Supabase Dashboard
3. Disable email confirmation in Supabase settings (dev only!)

### Login Redirects to Wrong URL

**Solution**: Check callback URL in `auth-client.ts`:

```typescript
options: {
  emailRedirectTo: `${window.location.origin}/auth/callback`,
}
```

### Session Not Persisting

**Solutions**:
1. Clear browser cookies
2. Check that cookies are enabled
3. Verify middleware is running (check terminal logs)

### "403 Forbidden" on Admin Pages

**Solution**: Check that user is properly authenticated:

```bash
# Check session in browser DevTools
localStorage.getItem('supabase.auth.token')
```

---

## 📱 Mobile/Production Considerations

### Configure Production Redirect URLs

In Supabase Dashboard:
1. **Authentication** > **URL Configuration**
2. Add your production domain:
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: `https://yourdomain.com/auth/callback`

### HTTPS Required for Production

Supabase requires HTTPS in production. Vercel provides this automatically.

### Environment Variables on Vercel

Add to Vercel project settings:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🎯 Testing Authentication

### Test Checklist

- [ ] Visit `/admin` → Should redirect to `/admin/login`
- [ ] Try logging in with wrong credentials → Should show error
- [ ] Sign up new account → Should send confirmation email
- [ ] Confirm email → Should be able to log in
- [ ] Log in successfully → Should redirect to `/admin`
- [ ] Navigate admin pages → Should stay logged in
- [ ] Click logout → Should redirect to login page
- [ ] Try accessing `/admin` after logout → Should redirect to login

---

## 📊 Monitoring

### View Active Sessions

Supabase Dashboard:
1. **Authentication** > **Users**
2. See all registered users
3. View last sign-in time
4. Manually remove users if needed

### Auth Logs

Check logs in Supabase Dashboard:
1. **Authentication** > **Logs**
2. See login attempts, errors, etc.

---

## 🚀 Next Steps

1. **Set up Supabase** (5 min)
2. **Configure .env.local** (1 min)
3. **Create admin account** (2 min)
4. **Test authentication** (5 min)
5. **Customize if needed** (optional)

---

## 💡 Pro Tips

### Development
- Use test email for development
- Keep email confirmation enabled (catches issues early)
- Test logout functionality regularly

### Production
- Use strong passwords
- Enable MFA for admin accounts
- Regularly review user list
- Monitor auth logs for suspicious activity
- Set up proper email templates

---

## 🔗 Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Supabase Auth UI](https://supabase.com/docs/guides/auth/auth-helpers/auth-ui)

---

**Your admin routes are now secure!** 🎉

Once you configure Supabase credentials, only authenticated users can access the admin dashboard.
