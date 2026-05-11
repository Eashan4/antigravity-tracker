# Authentication Setup Guide

This guide explains how to set up authentication for Antigravity Quota, including Google OAuth and email/password login.

---

## Overview

Antigravity Quota uses **Supabase Auth** for authentication. This means:
- ✅ No separate backend needed
- ✅ Supabase handles user management, sessions, and OAuth
- ✅ All auth data stored securely in Supabase

---

## 1. Email/Password Login

Email/password authentication works **out of the box** with Supabase. No additional configuration needed!

Users can:
- Sign up with email and password
- Sign in with email and password
- Reset their password via email

**To enable email auth in Supabase:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Settings**
4. Ensure **Email** provider is enabled (it is by default)

---

## 2. Google OAuth Setup

To enable "Sign in with Google", follow these steps:

### Step 1: Enable Google Provider in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Google** and click the toggle to enable it
5. Leave it open — you'll need to paste credentials next

### Step 2: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. If you don't have a project, create one:
   - Click **Select Project** → **New Project**
   - Name it something like "Antigravity Quota"
   - Click **Create**

3. Go to **Credentials** → **Create Credentials** → **OAuth client ID**

4. Configure the OAuth client:
   - **Application type**: Web application
   - **Name**: Antigravity Quota (or your choice)
   - **Authorized JavaScript origins**: Leave empty
   - **Authorized redirect URIs**: Add your Supabase callback URL

5. **Important**: Get your redirect URI from Supabase:
   - In Supabase Authentication → Providers → Google
   - Look for the redirect URL field
   - It will look like: `https://your-project.supabase.co/auth/v1/callback`

6. Copy the redirect URI and add it to Google Cloud:
   - Paste it in **Authorized redirect URIs**
   - Click **Create**

7. Copy the **Client ID** and **Client Secret** from the popup

### Step 3: Add Credentials to Supabase

1. Back in Supabase **Authentication** → **Providers** → **Google**
2. Paste your **Client ID** in the Client ID field
3. Paste your **Client Secret** in the Client Secret field
4. Click **Save**

### Step 4: Test Google Sign-In

1. Start your local dev server: `npm run dev`
2. Or visit your deployed site
3. Click "Sign in with Google"
4. Complete the OAuth flow
5. You should be logged in!

---

## 3. Supabase Database Tables (Required)

For the app to work properly, create these tables in Supabase SQL Editor:

```sql
-- Accounts table
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  avatar TEXT,
  provider TEXT DEFAULT 'gmail',
  status TEXT DEFAULT 'active',
  gemini_quota_used INT DEFAULT 0,
  gemini_quota_total INT DEFAULT 50000,
  antigravity_quota_used INT DEFAULT 0,
  antigravity_quota_total INT DEFAULT 10000,
  requests_today INT DEFAULT 0,
  requests_total INT DEFAULT 0,
  last_used TEXT,
  health INT DEFAULT 100,
  latency INT DEFAULT 0,
  region TEXT DEFAULT 'us-east-1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Models table
CREATE TABLE models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  version TEXT,
  status TEXT DEFAULT 'active',
  latency INT DEFAULT 0,
  usage_count INT DEFAULT 0,
  quota_allocation INT DEFAULT 25,
  routing_priority INT DEFAULT 1,
  capabilities TEXT[],
  avg_response_time INT DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0,
  access_url TEXT,
  platform TEXT,
  context_window TEXT,
  pricing_tier TEXT,
  refresh_interval TEXT,
  supports_thinking BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Routing events table
CREATE TABLE routing_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  source TEXT,
  target TEXT,
  model TEXT,
  status TEXT DEFAULT 'completed',
  latency INT DEFAULT 0,
  tokens_used INT DEFAULT 0,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  type TEXT DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE routing_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies (allow authenticated users to access their own data)
CREATE POLICY "Users can view own accounts" ON accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own accounts" ON accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view all models" ON models FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view own events" ON routing_events FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
```

---

## 4. Testing Authentication

### Local Testing
```bash
npm run dev
# Visit http://localhost:3000
# Click Sign In / Get Started
```

### Production Testing
```
# Your deployed URL: https://antigravity-tracker-sage.vercel.app
# Auth callback: /auth/callback
```

---

## 5. Troubleshooting

### "OAuth callback URL mismatch" error
- Make sure the redirect URI in Google Cloud Console matches exactly what's in Supabase
- Include `https://` and the trailing `/auth/v1/callback`

### "Sign in with Google" button not working
- Verify Google provider is enabled in Supabase
- Check that Client ID and Client Secret are correct
- Ensure the app URL in Supabase matches your deployment URL

### Users can't sign up
- Check Supabase Authentication → Settings → Allow new users to sign up
- Verify email confirmation settings

---

## 6. Security Best Practices

1. **Enable email confirmation** (recommended):
   - Supabase Dashboard → Authentication → Settings → Confirm email = ON

2. **Set up row-level security** (RLS):
   - Users can only access their own data
   - Already configured in the SQL above

3. **Use environment variables**:
   - Never commit `NEXT_PUBLIC_SUPABASE_URL` or keys to git
   - Already configured via Vercel dashboard

4. **Monitor auth usage**:
   - Check Supabase Dashboard → Authentication → Logs for suspicious activity

---

## 7. Deployment Checklist

- [ ] Supabase project created
- [ ] Environment variables added to Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Google OAuth configured (if using Google sign-in)
- [ ] Database tables created
- [ ] Row Level Security enabled
- [ ] Tested authentication flow
