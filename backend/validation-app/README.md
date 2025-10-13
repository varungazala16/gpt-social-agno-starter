# Auth Test Dashboard

Simple frontend testbed for testing authentication with the SocialGPT API, including Google OAuth.

## Setup

1. **Configure Supabase credentials**

   Open `app.js` and update the following variables:

   ```javascript
   const SUPABASE_URL = 'https://your-project.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key';
   ```

   Get these from your Supabase dashboard under Settings → API.

2. **Enable CORS in your FastAPI backend**

   Update `app/main.py` to add CORS middleware:

   ```python
   from fastapi.middleware.cors import CORSMiddleware

   app.add_middleware(
       CORSMiddleware,
       allow_origins=settings.all_cors_origins,
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

3. **Start the FastAPI backend**

   ```bash
   cd ..  # Go back to backend directory
   uvicorn app.main:app --reload
   ```

   The API will be available at `http://localhost:8000`

4. **Serve the test frontend**

   Open a new terminal and run:

   ```bash
   cd test-auth
   python3 -m http.server 3000
   ```

   Or use any other static file server.

5. **Open the test dashboard**

   Navigate to `http://localhost:3000` in your browser.

## Features

### 📝 Sign Up
- Create a new user account
- Automatically stores the access token

### 🔑 Login
- Login with existing credentials (email/password)
- **OR** Sign in with Google OAuth
- Stores access token in localStorage

### 🛡️ Protected Routes
- Test the `/example/protected` endpoint
- Test the `/auth/me` endpoint
- Both require authentication

### 🧹 Clear Token
- Remove stored token to test unauthorized access

## Testing Flow

1. **Create an account** using the signup form
2. **Note the access token** displayed after signup/login
3. **Test protected routes** to verify authentication works
4. **Clear token** and try protected routes to verify they're actually protected
5. **Login again** to get a new token

## API Endpoints Tested

- `POST /api/v1/auth/signup` - Create new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user (protected)
- `GET /api/v1/example/protected` - Example protected route

## Troubleshooting

- **CORS errors**: Make sure CORS is enabled in the backend
- **Connection refused**: Make sure the backend is running on port 8000
- **401 Unauthorized**: Token might be expired or invalid, try logging in again
