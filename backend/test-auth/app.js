// Configuration
const API_BASE_URL = 'http://localhost:8000/api/v1';
const TOKEN_KEY = 'auth_token';

// TODO: Replace these with your actual Supabase credentials
const SUPABASE_URL = 'https://sqhqtbfsvukurkbabbfm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxaHF0YmZzdnVrdXJrYmFiYmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3ODY4NzIsImV4cCI6MjA3NTM2Mjg3Mn0.ZjOEikwuDzNYx7DaQ5Iv65K8pjDeG1lPWZQFrM4bmZ8';

// State
let currentToken = localStorage.getItem(TOKEN_KEY);
let supabase = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initSupabase();
    handleOAuthCallback();
    handleSocialCallback();
    updateAuthStatus();
    setupEventListeners();
});

function initSupabase() {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

function setupEventListeners() {
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('googleLoginBtn').addEventListener('click', handleGoogleLogin);
    document.getElementById('testProtectedBtn').addEventListener('click', testProtectedRoute);
    document.getElementById('getMeBtn').addEventListener('click', getCurrentUser);
    document.getElementById('clearTokenBtn').addEventListener('click', clearToken);

    // Social connections
    document.getElementById('connectTikTokBtn').addEventListener('click', () => connectSocialAccount('tiktok'));
    document.getElementById('connectInstagramBtn').addEventListener('click', () => connectSocialAccount('instagram'));
    document.getElementById('connectYouTubeBtn').addEventListener('click', () => connectSocialAccount('youtube'));
    document.getElementById('listConnectionsBtn').addEventListener('click', listConnections);

    // TikTok account & videos
    document.getElementById('getTikTokAccountBtn').addEventListener('click', getTikTokAccount);
    document.getElementById('getTikTokVideosBtn').addEventListener('click', getTikTokVideos);
}

function updateAuthStatus() {
    const statusEl = document.getElementById('authStatus');
    if (currentToken) {
        statusEl.textContent = 'Authenticated';
        statusEl.className = 'status authenticated';
    } else {
        statusEl.textContent = 'Not Authenticated';
        statusEl.className = 'status not-authenticated';
    }
}

function showResponse(elementId, data, isError = false) {
    const el = document.getElementById(elementId);
    el.className = `response show ${isError ? 'error' : 'success'}`;
    el.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}

function showToken(token) {
    const el = document.getElementById('tokenDisplay');
    el.className = 'token-display show';
    el.innerHTML = `<strong>Access Token:</strong><br>${token}`;
}

async function handleSignup(e) {
    e.preventDefault();

    const email = document.getElementById('signupEmail').value;
    const name = document.getElementById('signupName').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, name, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Signup failed');
        }

        showResponse('signupResponse', data);

        // Store token if available
        if (data.session?.access_token) {
            currentToken = data.session.access_token;
            localStorage.setItem(TOKEN_KEY, currentToken);
            updateAuthStatus();
            showToken(currentToken);
        }

        // Clear form
        document.getElementById('signupForm').reset();
    } catch (error) {
        showResponse('signupResponse', { error: error.message }, true);
    }
}

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Login failed');
        }

        showResponse('loginResponse', data);

        // Store token
        currentToken = data.access_token;
        localStorage.setItem(TOKEN_KEY, currentToken);
        updateAuthStatus();
        showToken(currentToken);

        // Clear form
        document.getElementById('loginForm').reset();
    } catch (error) {
        showResponse('loginResponse', { error: error.message }, true);
    }
}

async function testProtectedRoute() {
    if (!currentToken) {
        showResponse('protectedResponse', { error: 'No token available. Please login first.' }, true);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/example/protected`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${currentToken}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Request failed');
        }

        showResponse('protectedResponse', data);
    } catch (error) {
        showResponse('protectedResponse', { error: error.message }, true);
    }
}

async function getCurrentUser() {
    if (!currentToken) {
        showResponse('protectedResponse', { error: 'No token available. Please login first.' }, true);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${currentToken}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Request failed');
        }

        showResponse('protectedResponse', data);
    } catch (error) {
        showResponse('protectedResponse', { error: error.message }, true);
    }
}

async function handleGoogleLogin() {
    if (!supabase) {
        showResponse('loginResponse', {
            error: 'Supabase not configured. Please update SUPABASE_URL and SUPABASE_ANON_KEY in app.js'
        }, true);
        return;
    }

    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + window.location.pathname
            }
        });

        if (error) throw error;

        // User will be redirected to Google
        // After auth, they'll be redirected back and handleOAuthCallback will run
    } catch (error) {
        showResponse('loginResponse', { error: error.message }, true);
    }
}

async function handleOAuthCallback() {
    // Check if we're returning from an OAuth flow
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');

    if (accessToken) {
        currentToken = accessToken;
        localStorage.setItem(TOKEN_KEY, currentToken);
        updateAuthStatus();
        showToken(currentToken);

        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname);

        showResponse('loginResponse', {
            message: 'Google OAuth login successful!',
            access_token: accessToken.substring(0, 20) + '...',
            refresh_token: refreshToken ? refreshToken.substring(0, 20) + '...' : null
        });
    }
}

function clearToken() {
    currentToken = null;
    localStorage.removeItem(TOKEN_KEY);
    updateAuthStatus();
    document.getElementById('tokenDisplay').className = 'token-display';
    showResponse('protectedResponse', { message: 'Token cleared successfully' });
}


// ===== Social Account Connections =====

async function connectSocialAccount(platform) {
    if (!currentToken) {
        showResponse('connectionsResponse', { error: 'Please login first to connect social accounts' }, true);
        return;
    }

    try {
        // Get authorization URL
        const response = await fetch(`${API_BASE_URL}/${platform}/oauth2/authorize`, {
            headers: {
                'Authorization': `Bearer ${currentToken}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to get authorization URL');
        }

        // Store platform in sessionStorage to handle callback
        sessionStorage.setItem('connecting_platform', platform);

        // Redirect to OAuth provider
        window.location.href = data.authorization_url;

    } catch (error) {
        showResponse('connectionsResponse', { error: error.message }, true);
    }
}

async function handleSocialCallback() {
    // Check if we're returning from a social OAuth flow
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const platform = sessionStorage.getItem('connecting_platform');

    if (code && state && platform && currentToken) {
        try {
            // Exchange code for connection
            const response = await fetch(
                `${API_BASE_URL}/${platform}/oauth2/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`,
                {
                    headers: {
                        'Authorization': `Bearer ${currentToken}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Failed to connect account');
            }

            // Clean up
            sessionStorage.removeItem('connecting_platform');
            window.history.replaceState({}, document.title, window.location.pathname);

            // Show success message
            showResponse('connectionsResponse', {
                message: `✅ ${platform.toUpperCase()} connected successfully!`,
                account: data.account
            });

        } catch (error) {
            showResponse('connectionsResponse', { error: error.message }, true);
            sessionStorage.removeItem('connecting_platform');
        }
    }
}

async function listConnections() {
    if (!currentToken) {
        showResponse('connectionsResponse', { error: 'Please login first' }, true);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/connections`, {
            headers: {
                'Authorization': `Bearer ${currentToken}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to fetch connections');
        }

        if (data.total === 0) {
            showResponse('connectionsResponse', {
                message: 'No social accounts connected yet',
                total: 0
            });
        } else {
            showResponse('connectionsResponse', {
                message: `You have ${data.total} connected account(s)`,
                accounts: data.accounts
            });
        }

    } catch (error) {
        showResponse('connectionsResponse', { error: error.message }, true);
    }
}

async function getTikTokAccount() {
    if (!currentToken) {
        showResponse('tiktokResponse', { error: 'Please login first' }, true);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/tiktok/account`, {
            headers: {
                'Authorization': `Bearer ${currentToken}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to fetch TikTok account');
        }

        showResponse('tiktokResponse', {
            message: '✅ TikTok Account Info',
            account: {
                platform: data.platform,
                username: data.platform_username,
                user_id: data.platform_user_id,
                scopes: data.scopes,
                connected_at: data.created_at,
                metadata: data.platform_metadata
            }
        });

    } catch (error) {
        showResponse('tiktokResponse', { error: error.message }, true);
    }
}

async function getTikTokVideos() {
    if (!currentToken) {
        showResponse('tiktokResponse', { error: 'Please login first' }, true);
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/tiktok/videos?max_count=10`, {
            headers: {
                'Authorization': `Bearer ${currentToken}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || 'Failed to fetch TikTok videos');
        }

        showResponse('tiktokResponse', {
            message: `✅ TikTok Videos (${data.data?.videos?.length || 0} videos)`,
            videos: data.data?.videos || [],
            has_more: data.data?.has_more || false
        });

    } catch (error) {
        showResponse('tiktokResponse', { error: error.message }, true);
    }
}
