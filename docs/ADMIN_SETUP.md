# Admin Authentication Setup

This guide explains how to set up admin authentication for the PhishGuard application using Supabase Auth.

## Overview

The PhishGuard admin dashboard uses Supabase Auth with email/password authentication to protect admin routes.

## Features

- ✅ Email/password authentication via Supabase Auth
- ✅ Protected routes (redirect to login if not authenticated)
- ✅ Session persistence across page refreshes
- ✅ Logout functionality
- ✅ Auth state management via React Context

## Creating an Admin User

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Add user** → **Create new user**
4. Enter admin credentials:
   - **Email**: `admin@yourcompany.com`
   - **Password**: Create a strong password
5. Click **Create user**
6. The user is now created and can log in

### Option 2: Using Supabase SQL Editor

1. Go to **SQL Editor** in Supabase dashboard
2. Run this query to create an admin user:

```sql
-- Create admin user via Supabase Auth
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@yourcompany.com',
  crypt('your-secure-password', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  ''
);
```

**Note**: Replace `admin@yourcompany.com` and `your-secure-password` with your actual credentials.

### Option 3: Using Supabase CLI

```bash
# Sign up a new user
supabase auth sign-up --email admin@yourcompany.com --password your-secure-password
```

## Admin Routes

The following routes are protected and require authentication:

- `/admin` - Admin dashboard with submission data
- `/generate` - QR code generator

Unauthenticated users are automatically redirected to `/admin/login`.

## How Authentication Works

### 1. **AuthContext** (`src/contexts/AuthContext.tsx`)
Provides authentication state and methods throughout the app:
- `user` - Current authenticated user (or null)
- `session` - Current session (or null)
- `loading` - Loading state while checking auth
- `signIn(email, password)` - Sign in method
- `signOut()` - Sign out method

### 2. **AdminLogin** (`src/components/AdminLogin.tsx`)
Login form component that:
- Accepts email and password
- Uses `signIn()` from AuthContext
- Shows error messages for failed login
- Redirects to `/admin` on success

### 3. **ProtectedRoute** (`src/components/ProtectedRoute.tsx`)
Wrapper component that:
- Checks if user is authenticated
- Shows loading state while checking
- Redirects to `/admin/login` if not authenticated
- Renders children if authenticated

### 4. **AdminRoute** (`src/components/AdminRoute.tsx`)
Admin dashboard component with:
- Logout button in header
- Access to submission data
- Only accessible when authenticated

## Session Management

Sessions are managed automatically by Supabase:
- Sessions persist across page refreshes
- Sessions are stored securely in browser
- Session expiration handled by Supabase
- Auto-refresh on token expiration

## Security Considerations

### Row Level Security (RLS)

Ensure your `phishing_submissions` table has proper RLS policies:

```sql
-- Allow authenticated users to read submissions
CREATE POLICY "Authenticated users can read submissions"
ON phishing_submissions
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to update submissions
CREATE POLICY "Authenticated users can update submissions"
ON phishing_submissions
FOR UPDATE
TO authenticated
USING (true);
```

### Email Confirmation

By default, Supabase requires email confirmation. To disable this for admin users:

1. Go to **Authentication** → **Settings**
2. Scroll to **Email Auth**
3. Disable **Enable email confirmations** (optional)

Or manually confirm the user's email in the dashboard.

## Testing Authentication

### 1. Test Login Flow
1. Navigate to `/admin`
2. Should redirect to `/admin/login`
3. Enter admin credentials
4. Should redirect to `/admin` on success
5. Should see logout button in dashboard

### 2. Test Session Persistence
1. Log in successfully
2. Refresh the page
3. Should remain logged in

### 3. Test Logout
1. Click logout button in admin dashboard
2. Should redirect to `/admin/login`
3. Try accessing `/admin` - should redirect to login

### 4. Test Protected Routes
1. Without logging in, try to access:
   - `/admin` → should redirect to `/admin/login`
   - `/generate` → should redirect to `/admin/login`

## Troubleshooting

### "Invalid credentials" error
- Verify email and password are correct
- Check if email is confirmed in Supabase dashboard
- Ensure user exists in Authentication → Users

### Session not persisting
- Check browser console for errors
- Verify Supabase URL and keys are correct
- Clear browser storage and try again

### Can't access protected routes
- Ensure you're logged in
- Check browser console for auth errors
- Verify AuthProvider is wrapping the app in `main.tsx`

## Environment Variables

No additional environment variables needed beyond existing Supabase config:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Next Steps

After setting up admin authentication:
1. Create admin user(s) in Supabase
2. Test login/logout flow
3. Proceed with admin dashboard features
4. Consider adding role-based access control (RBAC) in future
