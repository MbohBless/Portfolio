# 🔐 Authentication Quick Reference

## Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/admin/login` | Login page | Public |
| `/admin/signup` | Registration page | Public |
| `/admin` | Dashboard | Protected |
| `/admin/projects` | Manage projects | Protected |
| `/admin/publications` | Manage publications | Protected |
| `/admin/blog` | Manage blog posts | Protected |
| `/auth/callback` | OAuth/Email callback | Public |

---

## Files Created

### Auth Utilities
- `src/lib/auth-server.ts` - Server-side auth (getUser, getSession, isAuthenticated)
- `src/lib/auth-client.ts` - Client-side hook (useAuth with signIn, signOut, signUp)

### Components
- `src/components/LogoutButton.tsx` - Logout button for admin pages

### Pages
- `src/app/admin/login/page.tsx` - Login form
- `src/app/admin/signup/page.tsx` - Registration form
- `src/app/auth/callback/route.ts` - Auth callback handler

### Configuration
- `src/middleware.ts` - Route protection (UPDATED)
- All admin pages - Added user display and logout (UPDATED)

---

## Setup Steps

### 1. Create Supabase Project
```
Visit: https://supabase.com
Create free project (2-3 min setup time)
```

### 2. Get API Keys
```
Dashboard > Settings > API
Copy: Project URL & anon/public key
```

### 3. Configure .env.local
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

### 4. Create Admin Account
```
Visit: http://localhost:3000/admin/signup
OR
Supabase Dashboard > Authentication > Add User
```

---

## Usage Examples

### Server Component (Admin Pages)
```typescript
import { getUser } from '@/lib/auth-server'

export default async function AdminPage() {
  const user = await getUser()
  
  return <div>Logged in as: {user?.email}</div>
}
```

### Client Component (Forms, Buttons)
```typescript
'use client'
import { useAuth } from '@/lib/auth-client'

export function MyComponent() {
  const { signOut, loading } = useAuth()
  
  return (
    <button onClick={signOut} disabled={loading}>
      Logout
    </button>
  )
}
```

---

## Testing

### Manual Test Flow
1. Visit `/admin` → Redirects to `/admin/login` ✅
2. Try wrong password → Shows error ✅
3. Sign up → Sends confirmation email ✅
4. Log in correctly → Redirects to `/admin` ✅
5. Navigate admin pages → Stays logged in ✅
6. Click logout → Redirects to login ✅

### Without Supabase Setup
- Login page shows "Development Mode" warning
- Can view pages but auth won't work
- Configure Supabase to enable auth

---

## Common Operations

### Check if User is Authenticated
```typescript
import { isAuthenticated } from '@/lib/auth-server'

const isLoggedIn = await isAuthenticated()
```

### Get Current User
```typescript
import { getUser } from '@/lib/auth-server'

const user = await getUser()
console.log(user?.email)
```

### Sign In (Client)
```typescript
const { signIn } = useAuth()
await signIn('user@example.com', 'password')
```

### Sign Out (Client)
```typescript
const { signOut } = useAuth()
await signOut()
```

---

## Security Notes

✅ **Enabled:**
- Route protection via middleware
- Session-based authentication
- Secure cookie storage
- Automatic session refresh
- CSRF protection (built-in)

⚠️ **To Configure:**
- Set strong password policy in Supabase
- Enable MFA for admin accounts (optional)
- Restrict admin access by email domain (optional)
- Configure proper email templates

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't access admin | Configure Supabase in `.env.local` |
| Login fails | Check API keys are correct |
| Email not received | Check Supabase email settings |
| Session lost | Clear cookies, log in again |
| Redirect loop | Check middleware config |

---

## Next Steps

1. ✅ Configure Supabase credentials
2. ✅ Create your admin account
3. ✅ Test login/logout flow
4. ⏳ Customize email templates (optional)
5. ⏳ Add social providers (optional)
6. ⏳ Enable MFA (optional)

---

See **AUTH_SETUP.md** for detailed documentation.
