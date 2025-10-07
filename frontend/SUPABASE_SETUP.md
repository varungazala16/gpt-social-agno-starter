# Supabase Setup Instructions

This guide will help you set up Supabase for the Video Studio application, including authentication, file storage, and admin access.

## Prerequisites

- A Supabase account (sign up at [https://supabase.com](https://supabase.com))
- Your application repository cloned locally

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in the project details:
   - **Name**: Video Studio (or your preferred name)
   - **Database Password**: Choose a strong password (save this securely)
   - **Region**: Select the region closest to your users
4. Click "Create new project"
5. Wait for the project to be provisioned (this may take a few minutes)

## Step 2: Get Your API Keys

1. Once your project is ready, go to **Project Settings** (gear icon in the sidebar)
2. Navigate to **API** section
3. You'll need two values:
   - **Project URL**: Found under "Project URL" (looks like `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key**: Found under "Project API keys" → "anon public"

## Step 3: Configure Environment Variables

1. In your project root, create a `.env.local` file (or copy from `.env.example`):

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Admin Configuration
ADMIN_EMAIL=your-admin-email@example.com
```

2. Replace the placeholder values:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Project URL from Step 2
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your anon public key from Step 2
   - `ADMIN_EMAIL`: The email address that will have admin access

## Step 4: Disable Email Confirmation (Optional, for Development)

By default, Supabase requires email confirmation for new signups. To disable this for development:

1. In your Supabase dashboard, go to **Authentication** in the sidebar
2. Click on **Providers** 
3. Find **Email** provider and click on it
4. Scroll down to **Email confirmation**
5. Toggle **Enable email confirmations** to **OFF**
6. Click **Save**

**Note**: This is recommended for development only. For production, you should keep email confirmation enabled for security.

## Step 5: Set Up Storage Bucket

The application stores videos in a Supabase Storage bucket. Set it up as follows:

1. In your Supabase dashboard, go to **Storage** in the sidebar
2. Click **Create a new bucket**
3. Enter the bucket name: `videos`
4. Set the bucket to **Public** (toggle the Public bucket option)
5. Click **Create bucket**

### Configure Storage Policies

After creating the bucket, set up Row Level Security (RLS) policies:

1. Click on the `videos` bucket
2. Go to **Policies** tab
3. Click **New Policy**

**Policy 1: Allow authenticated users to upload to their own folder**
- Policy name: `Allow users to upload their own videos`
- Target roles: `authenticated`
- Policy definition: `INSERT`
- Using expression:
```sql
bucket_id = 'videos' AND (storage.foldername(name))[1] = auth.uid()::text
```

**Policy 2: Allow authenticated users to read from their own folder**
- Policy name: `Allow users to read their own videos`
- Target roles: `authenticated` 
- Policy definition: `SELECT`
- Using expression:
```sql
bucket_id = 'videos' AND (storage.foldername(name))[1] = auth.uid()::text
```

**Policy 3: Allow authenticated users to delete their own videos**
- Policy name: `Allow users to delete their own videos`
- Target roles: `authenticated`
- Policy definition: `DELETE`
- Using expression:
```sql
bucket_id = 'videos' AND (storage.foldername(name))[1] = auth.uid()::text
```

**Alternative Simple Setup (Less Secure):**

If you want a simpler setup for development, you can create policies that allow all authenticated users to perform all operations:

1. For SELECT, INSERT, UPDATE, DELETE operations, use this policy:
   - Target roles: `authenticated`
   - Using expression: `bucket_id = 'videos'`

## Step 6: Configure Authentication Settings

1. In your Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Add your site URL:
   - **Site URL**: `http://localhost:3000` (for development)
   - For production, add your production URL (e.g., `https://yourdomain.com`)
3. Add redirect URLs:
   - Add: `http://localhost:3000/auth/callback`
   - For production, also add: `https://yourdomain.com/auth/callback`
4. Click **Save**

## Step 7: Set Up Admin Access

The application uses two methods to determine admin access:

1. **Email-based**: Set the `ADMIN_EMAIL` environment variable to your email
2. **Role-based**: Add a `role` field to user metadata

### Method 1: Email-based (Recommended for single admin)

Simply set the `ADMIN_EMAIL` environment variable to your email address as shown in Step 3.

### Method 2: Role-based (For multiple admins)

To grant admin access via user metadata:

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Find the user you want to make admin
3. Click on the user to view details
4. In the **Raw User Meta Data** section, click **Edit**
5. Add the following JSON:
```json
{
  "role": "admin"
}
```
6. Click **Save**

## Step 8: Run the Application

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Testing the Setup

### Test Authentication:

1. Navigate to [http://localhost:3000/signup](http://localhost:3000/signup)
2. Create a new account with your email
3. If email confirmation is disabled, you'll be logged in immediately
4. If enabled, check your email for a confirmation link

### Test File Upload:

1. After logging in, go to the **Upload** tab
2. Upload a video file
3. The video should appear in the **Gallery** tab
4. Videos are stored in Supabase Storage under `videos/{user-id}/`

### Test Admin Access:

1. Make sure you're logged in with the email specified in `ADMIN_EMAIL`
2. You should see an "Admin" button in the header
3. Click it to access the admin dashboard
4. The admin page shows all registered users

## Troubleshooting

### Issue: "Not authenticated" error when uploading

- **Solution**: Make sure you're logged in. Check that cookies are enabled in your browser.

### Issue: Videos not appearing in gallery

- **Solution**: 
  - Check that the `videos` bucket exists and is public
  - Verify storage policies are set up correctly
  - Check browser console for any errors

### Issue: Can't access admin page

- **Solution**:
  - Verify `ADMIN_EMAIL` in `.env.local` matches your logged-in email exactly
  - Or add `"role": "admin"` to user metadata as described in Step 7
  - Restart the dev server after changing environment variables

### Issue: Email confirmation not disabled

- **Solution**: 
  - Go to Authentication → Providers → Email
  - Make sure "Enable email confirmations" is toggled OFF
  - Click Save

## Production Deployment

When deploying to production:

1. Update environment variables on your hosting platform (Vercel, Netlify, etc.)
2. Update Site URL and Redirect URLs in Supabase dashboard to your production URL
3. **Enable email confirmation** for security
4. Consider implementing additional security measures:
   - Rate limiting
   - File size limits
   - File type validation
   - CAPTCHA for signup

## Security Notes

- Never commit `.env.local` or `.env` files to version control
- Keep your database password and service role key secure (service role key has admin privileges)
- The `anon` key is safe to expose in client-side code
- Use RLS policies to secure your data
- For production, always enable email confirmation
- Regularly review your storage policies and user access

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
