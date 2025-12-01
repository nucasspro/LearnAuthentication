/**
 * OAuth 2.0 Authentication - Learning Content
 *
 * Story Theme: DELEGATION PROTOCOL
 * Metaphor: Security clearance delegation in a corporate espionage world
 * Tone: Third-party trust, authorization delegation, secure handoff
 */


export const oauthAuthContent = {
  storyHook: {
    title: "DELEGATION PROTOCOL",
    subtitle: "OAuth 2.0 Authorization Framework",
    clearanceLevel: "Advanced Access",
    status: "ACTIVE",
    narrative: `The year is 2084. You're a corporate security consultant hired by multiple megacorporations. Each corp has its own security system, but they need to share data without exposing their master credentials.

Enter the DELEGATION PROTOCOL - a sophisticated system where one entity can grant LIMITED, TEMPORARY access to another without revealing their primary credentials. Think of it as issuing a visitor badge instead of handing over your master keycard.

Your mission: Master the art of secure delegation in a world where trust is scarce and data breaches cost billions.`,
  },

  sections: [
    // ============================================
    // ESSENTIAL KNOWLEDGE (10 minutes)
    // ============================================
    {
      id: 'section-1',
      category: 'essential' as const,
      title: 'The Visitor Badge: What is OAuth 2.0?',
      icon: 'Shield',
      estimatedTime: '3 min',
      content: `OAuth 2.0 is an **authorization framework** that allows third-party applications to obtain LIMITED access to user accounts WITHOUT exposing passwords.

**Real-World Analogy:**
You're at NeoTech Tower, and a delivery courier needs to drop off a package in your office. Instead of giving them your master keycard (your password), security issues them a **temporary visitor badge** that:
- Only works for today
- Only grants access to the lobby and your floor
- Can be revoked at any time
- Expires automatically after 8 hours

That's OAuth 2.0 - controlled delegation of access.

**Key Terminology:**
- **Resource Owner**: You (the user with the data)
- **Client**: Third-party app requesting access (the courier)
- **Authorization Server**: Issues access tokens (security desk)
- **Resource Server**: Holds protected data (your office)
- **Access Token**: Temporary credential (visitor badge)
- **Scope**: Permissions granted (which floors can be accessed)`,

      keyPoints: [
        'OAuth 2.0 is for AUTHORIZATION, not authentication',
        'Users grant limited access without sharing passwords',
        'Tokens have scopes (permissions) and expiration times',
        'Common for "Login with Google/GitHub/Facebook"',
        'More complex than session/JWT, but more secure for third-party access',
      ],

      visual: `
┌─────────────────────────────────────────────────────────┐
│         DELEGATION PROTOCOL FLOW (Authorization Code)    │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  1. CLIENT requests authorization                        │
│     "Hey user, can I access your data?"                  │
│                                                           │
│  2. USER approves on Authorization Server                │
│     "Yes, but only read access to my profile"            │
│                                                           │
│  3. AUTH SERVER returns authorization code               │
│     Code: abc123 (single-use, expires in 10 min)         │
│                                                           │
│  4. CLIENT exchanges code for access token               │
│     Sends: code + client_secret (proves identity)        │
│                                                           │
│  5. AUTH SERVER issues access token                      │
│     Token: eyJhbG... (expires in 1 hour, scope: read)    │
│                                                           │
│  6. CLIENT uses token to access protected resources      │
│     Header: Authorization: Bearer eyJhbG...              │
│                                                           │
└─────────────────────────────────────────────────────────┘`,
    },

    {
      id: 'section-2',
      category: 'essential' as const,
      title: 'The Four Grant Types: Choosing Your Delegation Strategy',
      icon: 'GitBranch',
      estimatedTime: '4 min',
      content: `OAuth 2.0 provides **four grant types** (flows) for different scenarios. Think of these as different types of visitor badges for different situations.

**1. Authorization Code Flow** (Most Secure)
- **Use Case**: Server-side web applications
- **Security**: Client secret stored on server (never exposed to browser)
- **Example**: "Login with Google" on a web app
- **Steps**: User authorizes → Get code → Exchange code for token (server-side)

**2. Implicit Flow** (DEPRECATED - Don't Use!)
- **Use Case**: Was for browser-based apps (SPAs)
- **Security**: INSECURE - tokens exposed in browser URL
- **Status**: Replaced by Authorization Code + PKCE
- **Why Deprecated**: Vulnerable to token theft via browser history

**3. Client Credentials Flow**
- **Use Case**: Machine-to-machine (no user involved)
- **Security**: Client authenticates with secret
- **Example**: Microservice accessing another service's API
- **Steps**: Client sends credentials → Gets token → Access resources

**4. Resource Owner Password Credentials** (Legacy)
- **Use Case**: Trusted first-party apps only
- **Security**: User provides password to client (defeats OAuth purpose!)
- **Status**: Use only when you control both client and server
- **Example**: Mobile app for your own service

**Modern Best Practice: Authorization Code + PKCE**
- PKCE = Proof Key for Code Exchange
- Adds security layer even without client secret
- Required for mobile/SPA apps
- Recommended for ALL OAuth flows now`,

      keyPoints: [
        'Authorization Code Flow: Most secure for server-side apps',
        'Implicit Flow: DEPRECATED - use Auth Code + PKCE instead',
        'Client Credentials: Machine-to-machine, no user login',
        'Password Grant: Legacy, avoid unless you own everything',
        'PKCE: Essential for mobile/SPA, recommended for all flows',
      ],

      codeExamples: {
        javascript: [{
          language: 'javascript' as const,
          label: 'JavaScript (Express)',
          code: `// Authorization Code Flow (with PKCE)
const express = require('express');
const crypto = require('crypto');
const axios = require('axios');

const app = express();

// OAuth configuration
const OAUTH_CONFIG = {
  clientId: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
  authorizationUrl: 'https://provider.com/oauth/authorize',
  tokenUrl: 'https://provider.com/oauth/token',
  redirectUri: 'https://yourapp.com/oauth/callback',
  scope: 'read:profile read:email',
};

// Step 1: Redirect user to authorization server
app.get('/login', (req, res) => {
  // Generate PKCE code verifier (random string)
  const codeVerifier = crypto.randomBytes(32).toString('base64url');

  // Generate code challenge (SHA256 hash of verifier)
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  // Store verifier in session for later
  req.session.codeVerifier = codeVerifier;

  // Build authorization URL
  const authUrl = new URL(OAUTH_CONFIG.authorizationUrl);
  authUrl.searchParams.set('client_id', OAUTH_CONFIG.clientId);
  authUrl.searchParams.set('redirect_uri', OAUTH_CONFIG.redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', OAUTH_CONFIG.scope);
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');
  authUrl.searchParams.set('state', crypto.randomBytes(16).toString('hex')); // CSRF protection

  // Redirect user to provider's authorization page
  res.redirect(authUrl.toString());
});

// Step 2: Handle callback with authorization code
app.get('/oauth/callback', async (req, res) => {
  const { code, state } = req.query;

  // Validate state parameter (CSRF protection)
  if (!state || state !== req.session.oauthState) {
    return res.status(400).send('Invalid state parameter');
  }

  try {
    // Step 3: Exchange authorization code for access token
    const tokenResponse = await axios.post(OAUTH_CONFIG.tokenUrl, {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: OAUTH_CONFIG.redirectUri,
      client_id: OAUTH_CONFIG.clientId,
      client_secret: OAUTH_CONFIG.clientSecret,
      code_verifier: req.session.codeVerifier, // PKCE verification
    });

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // Step 4: Use access token to fetch user data
    const userResponse = await axios.get('https://provider.com/api/user', {
      headers: {
        'Authorization': \`Bearer \${access_token}\`,
      },
    });

    // Store tokens securely (encrypted in database)
    req.session.accessToken = access_token;
    req.session.refreshToken = refresh_token;
    req.session.user = userResponse.data;

    res.redirect('/dashboard');
  } catch (error) {
    console.error('OAuth error:', error.response?.data || error.message);
    res.status(500).send('Authentication failed');
  }
});

// Use access token for API requests
app.get('/api/profile', async (req, res) => {
  const accessToken = req.session.accessToken;

  if (!accessToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const response = await axios.get('https://provider.com/api/profile', {
      headers: {
        'Authorization': \`Bearer \${accessToken}\`,
      },
    });

    res.json(response.data);
  } catch (error) {
    if (error.response?.status === 401) {
      // Token expired - try refresh token flow
      return res.status(401).json({ error: 'Token expired, please re-authenticate' });
    }
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});`,
        }],

        python: [{
          language: 'python' as const,
          label: 'Python (Flask)',
          code: `from flask import Flask, redirect, request, session, url_for
import requests
import secrets
import hashlib
import base64

app = Flask(__name__)
app.secret_key = secrets.token_hex(32)

# OAuth configuration
OAUTH_CONFIG = {
    'client_id': 'your_client_id',
    'client_secret': 'your_client_secret',
    'authorization_url': 'https://provider.com/oauth/authorize',
    'token_url': 'https://provider.com/oauth/token',
    'redirect_uri': 'https://yourapp.com/oauth/callback',
    'scope': 'read:profile read:email',
}

def generate_pkce_pair():
    """Generate PKCE code verifier and challenge"""
    # Code verifier: 43-128 character random string
    code_verifier = base64.urlsafe_b64encode(secrets.token_bytes(32)).decode('utf-8').rstrip('=')

    # Code challenge: SHA256 hash of verifier
    code_challenge = base64.urlsafe_b64encode(
        hashlib.sha256(code_verifier.encode()).digest()
    ).decode('utf-8').rstrip('=')

    return code_verifier, code_challenge

@app.route('/login')
def login():
    """Step 1: Redirect to authorization server"""
    # Generate PKCE parameters
    code_verifier, code_challenge = generate_pkce_pair()
    state = secrets.token_hex(16)

    # Store in session for callback validation
    session['code_verifier'] = code_verifier
    session['oauth_state'] = state

    # Build authorization URL
    params = {
        'client_id': OAUTH_CONFIG['client_id'],
        'redirect_uri': OAUTH_CONFIG['redirect_uri'],
        'response_type': 'code',
        'scope': OAUTH_CONFIG['scope'],
        'code_challenge': code_challenge,
        'code_challenge_method': 'S256',
        'state': state,
    }

    auth_url = f"{OAUTH_CONFIG['authorization_url']}?{requests.compat.urlencode(params)}"
    return redirect(auth_url)

@app.route('/oauth/callback')
def oauth_callback():
    """Step 2: Handle authorization code callback"""
    code = request.args.get('code')
    state = request.args.get('state')

    # Validate state (CSRF protection)
    if not state or state != session.get('oauth_state'):
        return 'Invalid state parameter', 400

    # Step 3: Exchange code for access token
    token_data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': OAUTH_CONFIG['redirect_uri'],
        'client_id': OAUTH_CONFIG['client_id'],
        'client_secret': OAUTH_CONFIG['client_secret'],
        'code_verifier': session['code_verifier'],  # PKCE
    }

    try:
        token_response = requests.post(OAUTH_CONFIG['token_url'], data=token_data)
        token_response.raise_for_status()
        tokens = token_response.json()

        access_token = tokens['access_token']
        refresh_token = tokens.get('refresh_token')

        # Step 4: Fetch user profile
        headers = {'Authorization': f'Bearer {access_token}'}
        user_response = requests.get('https://provider.com/api/user', headers=headers)
        user_response.raise_for_status()

        # Store in session (in production, use encrypted database)
        session['access_token'] = access_token
        session['refresh_token'] = refresh_token
        session['user'] = user_response.json()

        return redirect('/dashboard')

    except requests.RequestException as e:
        print(f'OAuth error: {e}')
        return 'Authentication failed', 500`,
        }],

        csharp: [{
          language: 'csharp' as const,
          label: 'C# (ASP.NET Core)',
          code: `using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;

[ApiController]
[Route("oauth")]
public class OAuthController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly HttpClient _httpClient;

    public OAuthController(IConfiguration config, IHttpClientFactory httpClientFactory)
    {
        _config = config;
        _httpClient = httpClientFactory.CreateClient();
    }

    [HttpGet("login")]
    public IActionResult Login()
    {
        // Generate PKCE code verifier
        var codeVerifier = GenerateCodeVerifier();
        var codeChallenge = GenerateCodeChallenge(codeVerifier);
        var state = GenerateRandomString(32);

        // Store in session for callback validation
        HttpContext.Session.SetString("code_verifier", codeVerifier);
        HttpContext.Session.SetString("oauth_state", state);

        // Build authorization URL
        var authUrl = $"{_config["OAuth:AuthorizationUrl"]}?" +
            $"client_id={_config["OAuth:ClientId"]}&" +
            $"redirect_uri={Uri.EscapeDataString(_config["OAuth:RedirectUri"])}&" +
            $"response_type=code&" +
            $"scope={Uri.EscapeDataString(_config["OAuth:Scope"])}&" +
            $"code_challenge={codeChallenge}&" +
            $"code_challenge_method=S256&" +
            $"state={state}";

        return Redirect(authUrl);
    }

    [HttpGet("callback")]
    public async Task<IActionResult> Callback(string code, string state)
    {
        // Validate state parameter (CSRF protection)
        var storedState = HttpContext.Session.GetString("oauth_state");
        if (string.IsNullOrEmpty(state) || state != storedState)
        {
            return BadRequest("Invalid state parameter");
        }

        var codeVerifier = HttpContext.Session.GetString("code_verifier");

        // Exchange authorization code for access token
        var tokenRequest = new Dictionary<string, string>
        {
            { "grant_type", "authorization_code" },
            { "code", code },
            { "redirect_uri", _config["OAuth:RedirectUri"] },
            { "client_id", _config["OAuth:ClientId"] },
            { "client_secret", _config["OAuth:ClientSecret"] },
            { "code_verifier", codeVerifier }
        };

        var tokenResponse = await _httpClient.PostAsync(
            _config["OAuth:TokenUrl"],
            new FormUrlEncodedContent(tokenRequest)
        );

        if (!tokenResponse.IsSuccessStatusCode)
        {
            return StatusCode(500, "Failed to obtain access token");
        }

        var tokenData = await tokenResponse.Content.ReadFromJsonAsync<TokenResponse>();

        // Fetch user profile
        _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {tokenData.AccessToken}");
        var userResponse = await _httpClient.GetAsync("https://provider.com/api/user");
        var userData = await userResponse.Content.ReadFromJsonAsync<UserProfile>();

        // Store tokens in session (use encrypted storage in production)
        HttpContext.Session.SetString("access_token", tokenData.AccessToken);
        HttpContext.Session.SetString("user_id", userData.Id);

        return Redirect("/dashboard");
    }

    private string GenerateCodeVerifier()
    {
        var bytes = new byte[32];
        RandomNumberGenerator.Fill(bytes);
        return Convert.ToBase64String(bytes)
            .TrimEnd('=')
            .Replace('+', '-')
            .Replace('/', '_');
    }

    private string GenerateCodeChallenge(string codeVerifier)
    {
        using var sha256 = SHA256.Create();
        var hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(codeVerifier));
        return Convert.ToBase64String(hash)
            .TrimEnd('=')
            .Replace('+', '-')
            .Replace('/', '_');
    }

    private string GenerateRandomString(int length)
    {
        var bytes = new byte[length];
        RandomNumberGenerator.Fill(bytes);
        return Convert.ToHexString(bytes).ToLower();
    }
}

public class TokenResponse
{
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
    public int ExpiresIn { get; set; }
}`,
        }],

        ruby: [{
          language: 'ruby' as const,
          label: 'Ruby (Sinatra)',
          code: `require 'sinatra'
require 'securerandom'
require 'digest'
require 'base64'
require 'httparty'

# OAuth Configuration
OAUTH_CONFIG = {
  client_id: ENV['OAUTH_CLIENT_ID'],
  client_secret: ENV['OAUTH_CLIENT_SECRET'],
  authorization_url: 'https://provider.com/oauth/authorize',
  token_url: 'https://provider.com/oauth/token',
  redirect_uri: 'https://yourapp.com/oauth/callback',
  scope: 'read:profile read:email'
}

enable :sessions
set :session_secret, ENV['SESSION_SECRET']

# Generate PKCE code verifier and challenge
def generate_pkce_pair
  # Code verifier: 43-128 character random string
  code_verifier = Base64.urlsafe_encode64(SecureRandom.random_bytes(32), padding: false)

  # Code challenge: SHA256 hash of verifier
  code_challenge = Base64.urlsafe_encode64(
    Digest::SHA256.digest(code_verifier),
    padding: false
  )

  [code_verifier, code_challenge]
end

# Step 1: Redirect to authorization server
get '/login' do
  # Generate PKCE parameters
  code_verifier, code_challenge = generate_pkce_pair
  state = SecureRandom.hex(16)

  # Store in session
  session[:code_verifier] = code_verifier
  session[:oauth_state] = state

  # Build authorization URL
  params = {
    client_id: OAUTH_CONFIG[:client_id],
    redirect_uri: OAUTH_CONFIG[:redirect_uri],
    response_type: 'code',
    scope: OAUTH_CONFIG[:scope],
    code_challenge: code_challenge,
    code_challenge_method: 'S256',
    state: state
  }

  auth_url = "#{OAUTH_CONFIG[:authorization_url]}?#{URI.encode_www_form(params)}"
  redirect auth_url
end

# Step 2: Handle authorization callback
get '/oauth/callback' do
  code = params[:code]
  state = params[:state]

  # Validate state (CSRF protection)
  halt 400, 'Invalid state parameter' unless state == session[:oauth_state]

  # Step 3: Exchange code for access token
  token_params = {
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: OAUTH_CONFIG[:redirect_uri],
    client_id: OAUTH_CONFIG[:client_id],
    client_secret: OAUTH_CONFIG[:client_secret],
    code_verifier: session[:code_verifier]
  }

  begin
    token_response = HTTParty.post(
      OAUTH_CONFIG[:token_url],
      body: token_params
    )

    tokens = JSON.parse(token_response.body)
    access_token = tokens['access_token']
    refresh_token = tokens['refresh_token']

    # Step 4: Fetch user profile
    user_response = HTTParty.get(
      'https://provider.com/api/user',
      headers: { 'Authorization' => "Bearer #{access_token}" }
    )

    user_data = JSON.parse(user_response.body)

    # Store in session
    session[:access_token] = access_token
    session[:refresh_token] = refresh_token
    session[:user] = user_data

    redirect '/dashboard'

  rescue => e
    puts "OAuth error: #{e.message}"
    halt 500, 'Authentication failed'
  end
end`,
        }],
      },
    },

    {
      id: 'section-3',
      category: 'essential' as const,
      title: 'Scopes & Permissions: Controlling Access Levels',
      icon: 'Lock',
      estimatedTime: '3 min',
      content: `**Scopes** define WHAT the access token can do. Think of them as specific permissions on your visitor badge.

**Example Scopes:**
- \`read:profile\` - View basic profile info
- \`read:email\` - Access email address
- \`write:posts\` - Create new posts
- \`delete:account\` - Delete user account (dangerous!)

**Scope Anatomy:**
\`\`\`
action:resource
  ↓       ↓
read:profile
\`\`\`

**Best Practices:**

1. **Principle of Least Privilege**
   - Request ONLY the scopes you need
   - Don't ask for \`admin:*\` if you only need \`read:email\`

2. **User Consent**
   - Users see requested scopes during authorization
   - Suspicious scopes = users decline authorization

3. **Scope Validation**
   - Resource server MUST check token scopes
   - Don't trust the token alone - verify permissions

4. **Hierarchical Scopes** (some providers)
   - \`read:profile\` might include \`read:username\`
   - Check provider documentation

**Common Pitfall:**
Even if a token has \`admin:*\` scope, you must still validate that the USER has admin permissions in YOUR system. The token proves what the CLIENT can do, not what the USER is allowed to do.`,

      keyPoints: [
        'Scopes define permissions granted to the access token',
        'Follow least privilege - request minimum necessary scopes',
        'Users review scopes before granting authorization',
        'Resource server MUST validate scopes on every request',
        'Token scopes ≠ User permissions (validate both!)',
      ],

      codeExamples: {
        javascript: [{
          language: 'javascript' as const,
          label: 'JavaScript (Express)',
          code: `// Scope validation middleware
function requireScope(...requiredScopes) {
  return (req, res, next) => {
    const accessToken = req.headers.authorization?.replace('Bearer ', '');

    if (!accessToken) {
      return res.status(401).json({ error: 'Missing access token' });
    }

    // Verify and decode token (using JWT library)
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    // Extract scopes from token
    const tokenScopes = decoded.scope?.split(' ') || [];

    // Check if token has ALL required scopes
    const hasAllScopes = requiredScopes.every(scope =>
      tokenScopes.includes(scope)
    );

    if (!hasAllScopes) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required: requiredScopes,
        granted: tokenScopes,
      });
    }

    // Also check user permissions in YOUR system
    const user = await db.users.findById(decoded.sub);
    if (!user || user.banned) {
      return res.status(403).json({ error: 'User not authorized' });
    }

    req.user = user;
    req.scopes = tokenScopes;
    next();
  };
}

// Usage: Protect routes with scope requirements
app.get('/api/profile',
  requireScope('read:profile'),
  async (req, res) => {
    res.json({ username: req.user.username });
  }
);

app.post('/api/posts',
  requireScope('write:posts'),
  async (req, res) => {
    const post = await db.posts.create({
      userId: req.user.id,
      content: req.body.content,
    });
    res.json(post);
  }
);

app.delete('/api/account',
  requireScope('delete:account', 'admin:users'),  // Requires BOTH scopes
  async (req, res) => {
    await db.users.delete(req.user.id);
    res.json({ message: 'Account deleted' });
  }
);`,
        }],
      },
    },

    // ============================================
    // IMPORTANT KNOWLEDGE (15 minutes)
    // ============================================
    {
      id: 'section-4',
      category: 'important' as const,
      title: 'Access Tokens vs Refresh Tokens: The Two-Key System',
      icon: 'Key',
      estimatedTime: '5 min',
      content: `OAuth uses TWO types of tokens for enhanced security:

**Access Token** (Short-lived visitor badge)
- **Purpose**: Access protected resources
- **Lifetime**: 15 minutes - 1 hour (short!)
- **Storage**: Memory or sessionStorage (never localStorage!)
- **Usage**: Sent with EVERY API request
- **If stolen**: Limited damage (expires soon)

**Refresh Token** (Long-lived master key)
- **Purpose**: Obtain NEW access tokens without re-login
- **Lifetime**: Days, weeks, or months
- **Storage**: HTTP-Only secure cookie or encrypted database
- **Usage**: ONLY sent to token endpoint to get new access token
- **If stolen**: Major damage (can generate unlimited access tokens)

**Why Two Tokens?**

1. **Security Trade-off**
   - Access tokens are used frequently → higher theft risk
   - Refresh tokens used rarely → lower theft risk
   - Short-lived access tokens limit damage if stolen

2. **User Experience**
   - Users stay logged in for days/weeks (refresh token)
   - But attackers can't use stolen access token for long

3. **Revocation**
   - Access tokens can't be revoked (stateless)
   - Refresh tokens CAN be revoked (stored in database)

**Refresh Token Flow:**
\`\`\`
1. Access token expires (401 Unauthorized)
2. Client sends refresh token to /oauth/token
3. Server validates refresh token
4. Server issues NEW access token (and optionally new refresh token)
5. Client retries original request with new access token
\`\`\`

**Refresh Token Rotation** (Best Practice)
- When issuing new access token, also issue NEW refresh token
- Invalidate old refresh token
- Prevents replay attacks if refresh token is stolen`,

      keyPoints: [
        'Access tokens: Short-lived (minutes), used for API requests',
        'Refresh tokens: Long-lived (days), used to get new access tokens',
        'Access tokens in memory/sessionStorage, refresh tokens in HTTP-Only cookies',
        'Refresh token rotation: Issue new refresh token each time, invalidate old one',
        'Refresh tokens can be revoked; access tokens cannot (stateless)',
      ],

      codeExamples: {
        javascript: [{
          language: 'javascript' as const,
          label: 'JavaScript (Express)',
          code: `// Token refresh endpoint
app.post('/oauth/token', async (req, res) => {
  const { grant_type, refresh_token } = req.body;

  if (grant_type !== 'refresh_token') {
    return res.status(400).json({ error: 'invalid_grant' });
  }

  if (!refresh_token) {
    return res.status(400).json({ error: 'missing_refresh_token' });
  }

  try {
    // Find refresh token in database
    const tokenRecord = await db.refreshTokens.findOne({
      token: hashToken(refresh_token),
      revoked: false,
      expiresAt: { $gt: new Date() },
    });

    if (!tokenRecord) {
      return res.status(401).json({ error: 'invalid_refresh_token' });
    }

    // REFRESH TOKEN ROTATION: Revoke old token
    await db.refreshTokens.update(tokenRecord.id, { revoked: true });

    // Generate NEW access token
    const newAccessToken = jwt.sign(
      {
        sub: tokenRecord.userId,
        scope: tokenRecord.scope,
        type: 'access',
      },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }  // Short-lived
    );

    // Generate NEW refresh token
    const newRefreshToken = crypto.randomBytes(32).toString('hex');
    const newRefreshTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    // Store new refresh token
    await db.refreshTokens.create({
      token: hashToken(newRefreshToken),
      userId: tokenRecord.userId,
      scope: tokenRecord.scope,
      expiresAt: newRefreshTokenExpiry,
      revoked: false,
    });

    res.json({
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      token_type: 'Bearer',
      expires_in: 900,  // 15 minutes in seconds
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'server_error' });
  }
});

// Client-side: Automatic token refresh
let accessToken = null;
let refreshToken = getRefreshTokenFromCookie();

async function fetchWithAuth(url, options = {}) {
  // Try request with current access token
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': \`Bearer \${accessToken}\`,
    },
  });

  // If 401 Unauthorized, try refreshing token
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();

    if (!refreshed) {
      // Refresh failed - redirect to login
      window.location.href = '/login';
      return;
    }

    // Retry original request with new access token
    response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': \`Bearer \${accessToken}\`,
      },
    });
  }

  return response;
}

async function refreshAccessToken() {
  try {
    const response = await fetch('/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    accessToken = data.access_token;
    refreshToken = data.refresh_token;  // Update refresh token (rotation)

    return true;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
}`,
        }],
      },
    },

    {
      id: 'section-5',
      category: 'important' as const,
      title: 'State Parameter: CSRF Protection for OAuth',
      icon: 'Shield',
      estimatedTime: '5 min',
      content: `The **state parameter** is OAuth's primary defense against **Cross-Site Request Forgery (CSRF)** attacks.

**How It Works:**

1. **Before redirect**: Generate random string, store in session
2. **Authorization URL**: Include state as query parameter
3. **After callback**: Verify state matches stored value
4. **If mismatch**: Reject the authorization (possible CSRF attack)

**Attack Scenario WITHOUT State:**

\`\`\`
1. Attacker tricks victim to visit: evil.com
2. evil.com redirects to:
   yourapp.com/oauth/callback?code=ATTACKERS_CODE
3. Your app exchanges code for token
4. Victim is now logged into ATTACKER'S account!
5. Victim enters credit card → attacker sees it
\`\`\`

**Defense WITH State:**

\`\`\`
1. Your app generates: state=abc123, stores in victim's session
2. Redirect URL: provider.com/auth?state=abc123
3. Provider redirects back: yourapp.com/callback?code=xyz&state=abc123
4. Your app verifies: stored state (abc123) === returned state (abc123) ✓
5. If attacker tries: yourapp.com/callback?code=EVIL&state=WRONG
   → Your app rejects (state mismatch)
\`\`\`

**Best Practices:**

1. **Always use state** - NEVER skip this parameter
2. **Cryptographically random** - Use crypto.randomBytes(), not Math.random()
3. **Single-use** - Delete from session after validation
4. **Bind to session** - State must be tied to user's session
5. **Short expiration** - State should expire after 10 minutes

**Advanced: Stateless State Parameter**

Instead of storing in session, encode data in state itself:
\`\`\`javascript
const state = jwt.sign({
  csrf: crypto.randomBytes(16).toString('hex'),
  returnTo: '/dashboard',
  timestamp: Date.now(),
}, process.env.STATE_SECRET, { expiresIn: '10m' });
\`\`\``,

      keyPoints: [
        'State parameter prevents CSRF attacks in OAuth flow',
        'Generate random state before redirect, verify after callback',
        'State mismatch = reject authorization (possible attack)',
        'Must be cryptographically random (not Math.random())',
        'Can encode additional data (return URL, nonce) in state',
      ],

      codeExamples: {
        javascript: [{
          language: 'javascript' as const,
          label: 'JavaScript (Express)',
          code: `const crypto = require('crypto');

// Generate and store state before redirect
app.get('/login', (req, res) => {
  // Generate cryptographically random state
  const state = crypto.randomBytes(32).toString('hex');

  // Store in session (or signed cookie)
  req.session.oauthState = state;
  req.session.oauthStateCreatedAt = Date.now();

  // Optional: Store return URL in session
  req.session.returnTo = req.query.returnTo || '/dashboard';

  const authUrl = \`https://provider.com/oauth/authorize?\` +
    \`client_id=\${CLIENT_ID}&\` +
    \`redirect_uri=\${encodeURIComponent(REDIRECT_URI)}&\` +
    \`response_type=code&\` +
    \`scope=read:profile&\` +
    \`state=\${state}\`;  // Include state parameter

  res.redirect(authUrl);
});

// Validate state in callback
app.get('/oauth/callback', async (req, res) => {
  const { code, state } = req.query;

  // CRITICAL: Validate state parameter
  const storedState = req.session.oauthState;
  const stateCreatedAt = req.session.oauthStateCreatedAt;

  // Check 1: State exists
  if (!storedState) {
    console.error('CSRF attempt: No stored state found');
    return res.status(400).send('Invalid OAuth state - no session found');
  }

  // Check 2: State matches
  if (state !== storedState) {
    console.error('CSRF attempt: State mismatch', {
      received: state,
      expected: storedState,
    });
    return res.status(400).send('Invalid OAuth state - CSRF detected');
  }

  // Check 3: State not expired (10 minute limit)
  const stateAge = Date.now() - stateCreatedAt;
  if (stateAge > 10 * 60 * 1000) {
    console.error('CSRF attempt: State expired', { ageMs: stateAge });
    return res.status(400).send('OAuth state expired');
  }

  // IMPORTANT: Delete state after validation (single-use)
  delete req.session.oauthState;
  delete req.session.oauthStateCreatedAt;

  // State validated - proceed with token exchange
  try {
    const tokenResponse = await exchangeCodeForToken(code);
    const returnTo = req.session.returnTo || '/dashboard';
    delete req.session.returnTo;

    res.redirect(returnTo);
  } catch (error) {
    res.status(500).send('OAuth failed');
  }
});

// Advanced: Stateless state parameter (JWT-based)
const jwt = require('jsonwebtoken');

function generateStatelessState(returnTo = '/') {
  return jwt.sign({
    csrf: crypto.randomBytes(16).toString('hex'),
    returnTo: returnTo,
    timestamp: Date.now(),
  }, process.env.STATE_SECRET, {
    expiresIn: '10m',
    algorithm: 'HS256',
  });
}

function validateStatelessState(state) {
  try {
    const decoded = jwt.verify(state, process.env.STATE_SECRET);

    // Additional validation: check timestamp
    const age = Date.now() - decoded.timestamp;
    if (age > 10 * 60 * 1000) {
      return { valid: false, error: 'State expired' };
    }

    return { valid: true, data: decoded };
  } catch (error) {
    return { valid: false, error: 'Invalid state signature' };
  }
}`,
        }],
      },
    },

    {
      id: 'section-6',
      category: 'important' as const,
      title: 'PKCE: Securing Mobile & SPA Applications',
      icon: 'Smartphone',
      estimatedTime: '5 min',
      content: `**PKCE** (Proof Key for Code Exchange, RFC 7636) protects OAuth flows when you CAN'T keep a client secret safe.

**The Problem:**
- Mobile apps can be decompiled → secrets extracted
- SPAs run in browser → secrets visible in JavaScript
- Without client_secret, authorization code can be stolen

**The Solution: PKCE**

PKCE adds a **dynamic secret** that changes for every authorization request, making stolen codes useless.

**How PKCE Works:**

1. **Before redirect**: Client generates random \`code_verifier\`
2. **Compute challenge**: \`code_challenge = SHA256(code_verifier)\`
3. **Authorization URL**: Include \`code_challenge\` (NOT the verifier!)
4. **Callback**: Receive authorization code
5. **Token exchange**: Send \`code\` + original \`code_verifier\`
6. **Server validates**: SHA256(received verifier) === stored challenge?

**Why It's Secure:**

Even if attacker steals authorization code from callback URL, they DON'T have the code_verifier (stored in client memory), so they can't exchange it for a token.

**Code Challenge Methods:**
- **S256** (Recommended): SHA-256 hash of verifier
- **plain** (Legacy): Verifier sent directly (less secure, deprecated)

**When to Use PKCE:**
- ✅ **Always** for mobile apps (iOS, Android)
- ✅ **Always** for Single-Page Apps (React, Vue, Angular)
- ✅ **Recommended** for ALL OAuth flows (even server-side)
- ❌ Never skip it for public clients`,

      keyPoints: [
        'PKCE protects OAuth when client_secret cannot be stored securely',
        'Required for mobile apps and SPAs (public clients)',
        'Generates dynamic code_verifier, sends SHA256 hash as code_challenge',
        'Server validates verifier matches challenge during token exchange',
        'Recommended for ALL OAuth flows, not just public clients',
      ],

      codeExamples: {
        javascript: [{
          language: 'javascript' as const,
          label: 'JavaScript (Browser/SPA)',
          code: `// PKCE for Browser-Based Apps (SPA)
class OAuthClient {
  constructor(config) {
    this.clientId = config.clientId;
    this.redirectUri = config.redirectUri;
    this.authorizationUrl = config.authorizationUrl;
    this.tokenUrl = config.tokenUrl;
  }

  // Generate PKCE code verifier (random string)
  generateCodeVerifier() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return this.base64URLEncode(array);
  }

  // Generate code challenge (SHA-256 hash of verifier)
  async generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return this.base64URLEncode(new Uint8Array(hash));
  }

  // Base64-URL encoding (RFC 7636)
  base64URLEncode(buffer) {
    const base64 = btoa(String.fromCharCode(...buffer));
    return base64
      .replace(/\\+/g, '-')
      .replace(/\\//g, '_')
      .replace(/=/g, '');
  }

  // Step 1: Start OAuth flow with PKCE
  async login() {
    // Generate PKCE parameters
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    const state = this.generateCodeVerifier(); // Reuse for state (random string)

    // Store verifier and state in sessionStorage (NOT localStorage!)
    sessionStorage.setItem('pkce_code_verifier', codeVerifier);
    sessionStorage.setItem('oauth_state', state);

    // Build authorization URL
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'read:profile read:email',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',  // SHA-256
      state: state,
    });

    // Redirect to authorization server
    window.location.href = \`\${this.authorizationUrl}?\${params}\`;
  }

  // Step 2: Handle callback and exchange code for token
  async handleCallback() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    // Validate state (CSRF protection)
    const storedState = sessionStorage.getItem('oauth_state');
    if (!state || state !== storedState) {
      throw new Error('Invalid state parameter - CSRF detected');
    }

    // Retrieve code verifier
    const codeVerifier = sessionStorage.getItem('pkce_code_verifier');
    if (!codeVerifier) {
      throw new Error('Code verifier not found');
    }

    // Clean up stored values
    sessionStorage.removeItem('oauth_state');
    sessionStorage.removeItem('pkce_code_verifier');

    // Exchange code for token (with code_verifier)
    const tokenResponse = await fetch(this.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.redirectUri,
        client_id: this.clientId,
        code_verifier: codeVerifier,  // PKCE verification
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      throw new Error(\`Token exchange failed: \${error.error_description}\`);
    }

    const tokens = await tokenResponse.json();

    // Store access token in memory (NOT localStorage!)
    this.accessToken = tokens.access_token;

    return tokens;
  }

  // Make authenticated API request
  async fetch(url, options = {}) {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': \`Bearer \${this.accessToken}\`,
      },
    });
  }
}

// Usage
const oauth = new OAuthClient({
  clientId: 'your_client_id',
  redirectUri: 'https://yourapp.com/callback',
  authorizationUrl: 'https://provider.com/oauth/authorize',
  tokenUrl: 'https://provider.com/oauth/token',
});

// Start login flow
document.getElementById('login-btn').addEventListener('click', () => {
  oauth.login();
});

// Handle callback on return
if (window.location.pathname === '/callback') {
  oauth.handleCallback()
    .then(tokens => {
      console.log('Logged in successfully!');
      window.location.href = '/dashboard';
    })
    .catch(error => {
      console.error('OAuth error:', error);
    });
}`,
        }],
      },
    },

    // ============================================
    // ADVANCED KNOWLEDGE (20 minutes)
    // ============================================
    {
      id: 'section-7',
      category: 'advanced' as const,
      title: 'Token Introspection & Revocation',
      icon: 'Search',
      estimatedTime: '7 min',
      content: `**Token Introspection** (RFC 7662) allows resource servers to validate access tokens and retrieve metadata.

**Why Introspection?**

Problem: Resource server receives opaque access token (random string, not JWT)
Question: Is this token valid? What scopes does it have? Who is the user?

Solution: Call introspection endpoint to get token metadata

**Introspection Request:**
\`\`\`http
POST /oauth/introspect
Content-Type: application/x-www-form-urlencoded
Authorization: Basic base64(client_id:client_secret)

token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

**Introspection Response:**
\`\`\`json
{
  "active": true,
  "scope": "read:profile write:posts",
  "client_id": "app123",
  "username": "alice",
  "token_type": "Bearer",
  "exp": 1735689600,
  "iat": 1735686000,
  "sub": "user_12345"
}
\`\`\`

**Token Revocation** (RFC 7009)

Immediately invalidate access/refresh tokens before expiration.

**Use Cases:**
- User logs out
- User changes password
- Admin disables account
- Security breach detected
- App uninstalled

**Revocation Request:**
\`\`\`http
POST /oauth/revoke
Content-Type: application/x-www-form-urlencoded

token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
token_type_hint=refresh_token
\`\`\`

**Revocation Response:**
\`\`\`http
HTTP/1.1 200 OK
\`\`\`
(Success always returns 200, even if token doesn't exist - prevents timing attacks)

**Implementation Considerations:**

1. **Access Tokens (JWTs)**
   - Stateless → Can't be revoked directly
   - Solution: Short expiration (15 min) + refresh token revocation
   - Or: Maintain JWT blacklist (defeats stateless purpose)

2. **Refresh Tokens**
   - Stored in database → Can be revoked immediately
   - Mark as \`revoked: true\` in database

3. **Cascade Revocation**
   - Revoking refresh token should invalidate ALL access tokens issued from it
   - Maintain token family tree in database`,

      keyPoints: [
        'Introspection: Validate opaque tokens and retrieve metadata',
        'Revocation: Immediately invalidate tokens before expiration',
        'Access tokens (JWT) hard to revoke; use short expiration',
        'Refresh tokens easy to revoke; stored in database',
        'Revocation endpoint always returns 200 OK (prevent info leakage)',
      ],

      codeExamples: {
        javascript: [{
          language: 'javascript' as const,
          label: 'JavaScript (Express)',
          code: `// Token Introspection Endpoint
app.post('/oauth/introspect', authenticateClient, async (req, res) => {
  const { token, token_type_hint } = req.body;

  if (!token) {
    return res.json({ active: false });
  }

  try {
    let tokenRecord;

    // Check if it's a refresh token
    if (token_type_hint === 'refresh_token' || !token.startsWith('eyJ')) {
      tokenRecord = await db.refreshTokens.findOne({
        token: hashToken(token),
        revoked: false,
        expiresAt: { $gt: new Date() },
      });

      if (tokenRecord) {
        const user = await db.users.findById(tokenRecord.userId);
        return res.json({
          active: true,
          scope: tokenRecord.scope,
          client_id: req.client.clientId,
          username: user.username,
          token_type: 'refresh_token',
          exp: Math.floor(tokenRecord.expiresAt.getTime() / 1000),
          sub: tokenRecord.userId,
        });
      }
    }

    // Check if it's an access token (JWT)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if user still exists and is active
      const user = await db.users.findById(decoded.sub);
      if (!user || user.banned) {
        return res.json({ active: false });
      }

      // Check if token is blacklisted (if using blacklist)
      const isBlacklisted = await db.tokenBlacklist.exists({
        jti: decoded.jti,
      });

      if (isBlacklisted) {
        return res.json({ active: false });
      }

      return res.json({
        active: true,
        scope: decoded.scope,
        client_id: decoded.client_id,
        username: user.username,
        token_type: 'Bearer',
        exp: decoded.exp,
        iat: decoded.iat,
        sub: decoded.sub,
      });
    } catch (jwtError) {
      // Invalid JWT or expired
      return res.json({ active: false });
    }

  } catch (error) {
    console.error('Introspection error:', error);
    return res.json({ active: false });
  }
});

// Token Revocation Endpoint
app.post('/oauth/revoke', authenticateClient, async (req, res) => {
  const { token, token_type_hint } = req.body;

  if (!token) {
    // Always return 200 OK (even for missing token)
    return res.status(200).send();
  }

  try {
    // Try to revoke as refresh token
    if (token_type_hint === 'refresh_token' || !token.startsWith('eyJ')) {
      const result = await db.refreshTokens.update(
        { token: hashToken(token) },
        { revoked: true, revokedAt: new Date() }
      );

      if (result.modifiedCount > 0) {
        console.log('Refresh token revoked:', hashToken(token));
      }
    }

    // If it's an access token (JWT), add to blacklist
    if (token.startsWith('eyJ')) {
      try {
        const decoded = jwt.decode(token);

        if (decoded && decoded.jti) {
          // Add to blacklist (TTL = remaining token lifetime)
          const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

          if (expiresIn > 0) {
            await db.tokenBlacklist.create({
              jti: decoded.jti,
              expiresAt: new Date(decoded.exp * 1000),
            });
            console.log('Access token blacklisted:', decoded.jti);
          }
        }
      } catch (jwtError) {
        // Invalid JWT - ignore
      }
    }

    // ALWAYS return 200 OK (RFC 7009)
    res.status(200).send();

  } catch (error) {
    console.error('Revocation error:', error);
    // Even on error, return 200 OK
    res.status(200).send();
  }
});

// Middleware: Authenticate client for introspection/revocation
function authenticateClient(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'client_authentication_failed' });
  }

  const credentials = Buffer.from(authHeader.slice(6), 'base64').toString();
  const [clientId, clientSecret] = credentials.split(':');

  // Validate client credentials
  const client = db.clients.findOne({ clientId });

  if (!client || client.clientSecret !== hashSecret(clientSecret)) {
    return res.status(401).json({ error: 'invalid_client' });
  }

  req.client = client;
  next();
}

// Cascade Revocation: Revoke all tokens for a user
async function revokeAllUserTokens(userId) {
  // Revoke all refresh tokens
  await db.refreshTokens.updateMany(
    { userId, revoked: false },
    { revoked: true, revokedAt: new Date() }
  );

  // Get all active access token JTIs and blacklist them
  const activeTokens = await db.issuedTokens.find({
    userId,
    expiresAt: { $gt: new Date() },
  });

  for (const token of activeTokens) {
    await db.tokenBlacklist.create({
      jti: token.jti,
      expiresAt: token.expiresAt,
    });
  }

  console.log(\`Revoked all tokens for user: \${userId}\`);
}`,
        }],
      },
    },

    {
      id: 'section-8',
      category: 'advanced' as const,
      title: 'Dynamic Client Registration (DCR)',
      icon: 'UserPlus',
      estimatedTime: '6 min',
      content: `**Dynamic Client Registration** (RFC 7591) allows clients to register themselves programmatically without manual admin approval.

**Traditional Registration:**
1. Developer visits provider's website
2. Fills out form (app name, redirect URIs)
3. Admin manually reviews and approves
4. Developer receives client_id and client_secret

**Dynamic Registration:**
1. Client sends POST request to registration endpoint
2. Server validates request and issues credentials automatically
3. Client immediately starts using OAuth

**Use Cases:**
- Multi-tenant SaaS platforms (each tenant = separate client)
- IoT devices (millions of devices need unique credentials)
- Developer portals (instant API access without approval queue)

**Registration Request:**
\`\`\`http
POST /oauth/register
Content-Type: application/json

{
  "redirect_uris": ["https://client.example.com/callback"],
  "token_endpoint_auth_method": "client_secret_basic",
  "grant_types": ["authorization_code", "refresh_token"],
  "response_types": ["code"],
  "client_name": "My Awesome App",
  "client_uri": "https://client.example.com",
  "logo_uri": "https://client.example.com/logo.png",
  "scope": "read:profile read:email",
  "contacts": ["admin@client.example.com"]
}
\`\`\`

**Registration Response:**
\`\`\`json
{
  "client_id": "s6BhdRkqt3",
  "client_secret": "ZJYCqe3GGRvdrudKyZS0XhGv_Z45DuKhCUk0gBR1vZk",
  "client_id_issued_at": 1735686000,
  "client_secret_expires_at": 1767222000,
  "redirect_uris": ["https://client.example.com/callback"],
  "grant_types": ["authorization_code", "refresh_token"],
  "token_endpoint_auth_method": "client_secret_basic"
}
\`\`\`

**Security Considerations:**

1. **Validation** - Strict validation of redirect_uris (prevent open redirect)
2. **Rate Limiting** - Prevent abuse (1000s of client registrations)
3. **Whitelist** - Only allow certain domains to register
4. **Client Authentication** - Require initial access token for registration
5. **Expiration** - Auto-delete unused clients after 90 days`,

      keyPoints: [
        'DCR: Programmatic client registration without manual approval',
        'Useful for multi-tenant SaaS, IoT, developer portals',
        'Client posts metadata, receives client_id and client_secret',
        'Must validate redirect_uris to prevent open redirect attacks',
        'Rate limit registration endpoint to prevent abuse',
      ],

      codeExamples: {
        javascript: [{
          language: 'javascript' as const,
          label: 'JavaScript (Express)',
          code: `const crypto = require('crypto');

// Dynamic Client Registration Endpoint
app.post('/oauth/register', async (req, res) => {
  const {
    redirect_uris,
    token_endpoint_auth_method,
    grant_types,
    response_types,
    client_name,
    client_uri,
    logo_uri,
    scope,
    contacts,
  } = req.body;

  // Validation 1: Required fields
  if (!redirect_uris || redirect_uris.length === 0) {
    return res.status(400).json({
      error: 'invalid_client_metadata',
      error_description: 'redirect_uris is required',
    });
  }

  if (!client_name) {
    return res.status(400).json({
      error: 'invalid_client_metadata',
      error_description: 'client_name is required',
    });
  }

  // Validation 2: Redirect URI format and domain whitelist
  const allowedDomains = ['example.com', 'myapp.io', 'localhost'];

  for (const uri of redirect_uris) {
    try {
      const url = new URL(uri);

      // Must be HTTPS (except localhost)
      if (url.protocol !== 'https:' && url.hostname !== 'localhost') {
        return res.status(400).json({
          error: 'invalid_redirect_uri',
          error_description: 'Redirect URIs must use HTTPS',
        });
      }

      // Check domain whitelist
      const isAllowed = allowedDomains.some(domain =>
        url.hostname === domain || url.hostname.endsWith(\`.\${domain}\`)
      );

      if (!isAllowed) {
        return res.status(400).json({
          error: 'invalid_redirect_uri',
          error_description: \`Domain \${url.hostname} is not allowed\`,
        });
      }

      // No wildcards or fragments
      if (uri.includes('*') || url.hash) {
        return res.status(400).json({
          error: 'invalid_redirect_uri',
          error_description: 'Wildcards and fragments not allowed in redirect URIs',
        });
      }

    } catch (e) {
      return res.status(400).json({
        error: 'invalid_redirect_uri',
        error_description: \`Invalid URI: \${uri}\`,
      });
    }
  }

  // Validation 3: Grant types
  const supportedGrantTypes = ['authorization_code', 'refresh_token', 'client_credentials'];
  const requestedGrants = grant_types || ['authorization_code'];

  const invalidGrants = requestedGrants.filter(g => !supportedGrantTypes.includes(g));
  if (invalidGrants.length > 0) {
    return res.status(400).json({
      error: 'invalid_client_metadata',
      error_description: \`Unsupported grant types: \${invalidGrants.join(', ')}\`,
    });
  }

  // Validation 4: Scopes
  const allowedScopes = ['read:profile', 'read:email', 'write:posts'];
  const requestedScopes = scope ? scope.split(' ') : ['read:profile'];

  const invalidScopes = requestedScopes.filter(s => !allowedScopes.includes(s));
  if (invalidScopes.length > 0) {
    return res.status(400).json({
      error: 'invalid_client_metadata',
      error_description: \`Invalid scopes: \${invalidScopes.join(', ')}\`,
    });
  }

  // Rate limiting check
  const clientIp = req.ip;
  const recentRegistrations = await db.clientRegistrations.count({
    ipAddress: clientIp,
    createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) }, // Last hour
  });

  if (recentRegistrations >= 5) {
    return res.status(429).json({
      error: 'rate_limit_exceeded',
      error_description: 'Too many registration attempts. Try again later.',
    });
  }

  // Generate credentials
  const clientId = \`client_\${crypto.randomBytes(16).toString('hex')}\`;
  const clientSecret = crypto.randomBytes(32).toString('base64url');
  const clientSecretHash = await hashPassword(clientSecret);

  const now = Math.floor(Date.now() / 1000);
  const secretExpiresAt = now + (365 * 24 * 60 * 60); // 1 year

  // Store client
  const newClient = await db.clients.create({
    clientId,
    clientSecretHash,
    clientName: client_name,
    redirectUris: redirect_uris,
    grantTypes: requestedGrants,
    responseTypes: response_types || ['code'],
    tokenEndpointAuthMethod: token_endpoint_auth_method || 'client_secret_basic',
    scope: requestedScopes.join(' '),
    clientUri: client_uri,
    logoUri: logo_uri,
    contacts: contacts || [],
    createdAt: new Date(),
    clientSecretExpiresAt: new Date(secretExpiresAt * 1000),
    registeredBy: 'dynamic',
    ipAddress: clientIp,
  });

  // Log registration
  console.log('New client registered:', {
    clientId,
    clientName: client_name,
    ipAddress: clientIp,
  });

  // Return client credentials (RFC 7591 response)
  res.status(201).json({
    client_id: clientId,
    client_secret: clientSecret,  // Only time secret is shown!
    client_id_issued_at: now,
    client_secret_expires_at: secretExpiresAt,
    redirect_uris: redirect_uris,
    grant_types: requestedGrants,
    response_types: response_types || ['code'],
    token_endpoint_auth_method: token_endpoint_auth_method || 'client_secret_basic',
    scope: requestedScopes.join(' '),
  });
});

// Client Configuration Endpoint (read/update/delete registered client)
app.get('/oauth/register/:client_id', authenticateClient, async (req, res) => {
  const client = await db.clients.findOne({ clientId: req.params.client_id });

  if (!client || client.clientId !== req.client.clientId) {
    return res.status(404).json({ error: 'client_not_found' });
  }

  res.json({
    client_id: client.clientId,
    client_name: client.clientName,
    redirect_uris: client.redirectUris,
    grant_types: client.grantTypes,
    scope: client.scope,
    // Don't return client_secret on read
  });
});

app.delete('/oauth/register/:client_id', authenticateClient, async (req, res) => {
  const result = await db.clients.deleteOne({
    clientId: req.params.client_id,
    clientId: req.client.clientId,  // Can only delete own client
  });

  if (result.deletedCount === 0) {
    return res.status(404).json({ error: 'client_not_found' });
  }

  res.status(204).send();
});`,
        }],
      },
    },

    {
      id: 'section-9',
      category: 'advanced' as const,
      title: 'OAuth Security Best Practices & Production Checklist',
      icon: 'ShieldCheck',
      estimatedTime: '7 min',
      content: `**Production-Ready OAuth 2.0 Implementation Checklist**

**1. Authorization Flow Security**
- ✅ Use Authorization Code Flow (not Implicit)
- ✅ Implement PKCE for ALL clients (especially mobile/SPA)
- ✅ Validate \`state\` parameter (CSRF protection)
- ✅ Validate \`redirect_uri\` against registered URIs (exact match)
- ✅ Short-lived authorization codes (10 minutes max, single-use)

**2. Token Security**
- ✅ Access tokens: 15-60 minutes expiration
- ✅ Refresh tokens: Days/weeks expiration, stored encrypted
- ✅ Implement refresh token rotation
- ✅ Use HTTPS for ALL requests (enforce TLS 1.2+)
- ✅ HTTP-Only, Secure, SameSite cookies for refresh tokens
- ✅ Never store tokens in localStorage (XSS risk)

**3. Client Security**
- ✅ Validate client credentials on token requests
- ✅ Store client_secret hashed (bcrypt/Argon2)
- ✅ Rotate client secrets regularly
- ✅ Whitelist redirect URIs (no wildcards, exact match)
- ✅ Rate limit token endpoint (10 req/min per client)

**4. Scope Management**
- ✅ Define granular scopes (read:profile, write:posts)
- ✅ Validate scopes on every resource access
- ✅ Default to minimum scopes if none requested
- ✅ User consent screen shows requested scopes clearly

**5. Additional Security Layers**
- ✅ Implement token introspection endpoint
- ✅ Implement token revocation endpoint
- ✅ Log all authorization/token requests (audit trail)
- ✅ Monitor for suspicious patterns (many failed auths)
- ✅ Implement IP whitelisting for sensitive clients
- ✅ Use JWT with short expiration for access tokens
- ✅ Sign JWTs with RS256 (not HS256) for public verification

**6. Error Handling**
- ❌ Don't reveal why authentication failed ("Invalid credentials" not "User not found")
- ✅ Return generic OAuth error codes (invalid_request, invalid_client)
- ✅ Log detailed errors server-side for debugging
- ❌ Don't include sensitive data in error responses

**7. Common Vulnerabilities to Prevent**

**Open Redirect Attack**
\`\`\`javascript
// ❌ VULNERABLE
if (req.query.redirect_uri.startsWith('https://')) {
  // Attacker: https://evil.com
}

// ✅ SECURE
const registeredUris = client.redirect_uris;
if (!registeredUris.includes(req.query.redirect_uri)) {
  return res.status(400).json({ error: 'invalid_redirect_uri' });
}
\`\`\`

**Authorization Code Injection**
\`\`\`javascript
// ✅ DEFENSE: Bind code to client_id and redirect_uri
await db.authCodes.create({
  code: authCode,
  clientId: client.clientId,
  redirectUri: req.query.redirect_uri,  // Must match on exchange
  codeChallenge: req.query.code_challenge,  // PKCE
});
\`\`\`

**Token Replay Attack**
\`\`\`javascript
// ✅ DEFENSE: Single-use authorization codes
const code = await db.authCodes.findOneAndDelete({ code: req.body.code });
if (!code) {
  return res.status(400).json({ error: 'invalid_grant' });
}
\`\`\``,

      keyPoints: [
        'Use Authorization Code + PKCE for all flows',
        'Short-lived access tokens, encrypted refresh tokens with rotation',
        'HTTPS everywhere, validate redirect_uri with exact match',
        'Never store tokens in localStorage, use HTTP-Only cookies',
        'Implement rate limiting, audit logging, and token revocation',
      ],
    },
  ],

  securityScenarios: [
    {
      id: 'scenario-1',
      title: 'Redirect URI Manipulation (Open Redirect)',
      threatLevel: 'HIGH' as const,
      attack: 'Attacker tricks authorization server to send authorization code to malicious server by manipulating redirect_uri parameter.',
      exploitation: 'Without strict redirect_uri validation, attackers can intercept authorization codes by setting redirect_uri=https://evil.com in the OAuth flow.',
      defense: 'Register redirect URIs during client registration (whitelist). Validate redirect_uri with EXACT match (no wildcards, no partial matches). Enforce HTTPS for all redirect URIs (except localhost for development). Bind authorization code to redirect_uri and validate again on token exchange.',
      vulnerableCode: {
        language: 'javascript' as const,
        label: 'Vulnerable Code',
        code: `// ❌ VULNERABLE: No redirect_uri validation
app.get('/oauth/authorize', (req, res) => {
  const { client_id, redirect_uri, state } = req.query;

  // Look up client
  const client = db.clients.findOne({ clientId: client_id });

  // ❌ BAD: Allowing any redirect_uri!
  // Attacker can set redirect_uri=https://evil.com

  // User approves authorization
  const authCode = generateAuthCode();

  // ❌ DANGEROUS: Redirecting to attacker-controlled domain
  res.redirect(\`\${redirect_uri}?code=\${authCode}&state=\${state}\`);
  // Result: Authorization code sent to evil.com
});`,
      },
      secureCode: {
        language: 'javascript' as const,
        label: 'Secure Code',
        code: `// ✅ SECURE: Strict redirect_uri validation
app.get('/oauth/authorize', (req, res) => {
  const { client_id, redirect_uri, state } = req.query;

  // Look up client
  const client = db.clients.findOne({ clientId: client_id });

  if (!client) {
    return res.status(400).send('Unknown client');
  }

  // ✅ CRITICAL: Validate redirect_uri against registered URIs
  const isValidRedirect = client.redirect_uris.some(registered => {
    // EXACT match - no wildcards, no subdomain tricks
    return registered === redirect_uri;
  });

  if (!isValidRedirect) {
    console.error('Invalid redirect_uri attempted:', {
      clientId: client_id,
      attempted: redirect_uri,
      registered: client.redirect_uris,
    });
    return res.status(400).send('Invalid redirect_uri');
  }

  // ✅ Additional check: HTTPS required (except localhost for dev)
  try {
    const url = new URL(redirect_uri);
    if (url.protocol !== 'https:' && url.hostname !== 'localhost') {
      return res.status(400).send('redirect_uri must use HTTPS');
    }
  } catch (e) {
    return res.status(400).send('Invalid redirect_uri format');
  }

  // User approves authorization
  const authCode = generateAuthCode();

  // Store code with bound redirect_uri for validation on token exchange
  await db.authCodes.create({
    code: authCode,
    clientId: client.clientId,
    redirectUri: redirect_uri,  // Bind to this URI
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  // Safe to redirect
  res.redirect(\`\${redirect_uri}?code=\${authCode}&state=\${state}\`);
});

// Token endpoint also validates redirect_uri
app.post('/oauth/token', async (req, res) => {
  const { code, redirect_uri } = req.body;

  const authCode = await db.authCodes.findOne({ code });

  // ✅ Verify redirect_uri matches the one used in authorization
  if (authCode.redirectUri !== redirect_uri) {
    return res.status(400).json({ error: 'invalid_grant' });
  }

  // Proceed with token issuance...
});`,
      },
    },
    {
      id: 'scenario-2',
      title: 'CSRF Attack via Missing State Parameter',
      threatLevel: 'HIGH' as const,
      attack: 'Attacker tricks victim into logging into the attacker\'s account, allowing attacker to see victim\'s activity (e.g., credit card entered).',
      exploitation: 'Without state parameter validation, attackers can craft malicious callback URLs with their authorization codes and trick victims into clicking them, logging victims into the attacker\'s account.',
      defense: 'Always generate cryptographically random state parameter before redirecting to authorization server. Store state in user\'s session and validate it matches in the callback. Delete state after validation (single-use). Set state expiration (10 minutes maximum). Log state mismatches as potential CSRF attempts.',
      vulnerableCode: {
        language: 'javascript' as const,
        label: 'Vulnerable Code',
        code: `// ❌ VULNERABLE: No state parameter validation
app.get('/login', (req, res) => {
  const authUrl = \`https://provider.com/oauth/authorize?\` +
    \`client_id=\${CLIENT_ID}&\` +
    \`redirect_uri=\${REDIRECT_URI}&\` +
    \`response_type=code&\` +
    \`scope=read:profile\`;
    // ❌ Missing state parameter!

  res.redirect(authUrl);
});

app.get('/oauth/callback', async (req, res) => {
  const { code } = req.query;
  // ❌ No state validation!

  // Exchange code for token
  const tokens = await exchangeCodeForToken(code);

  // User is now logged in
  req.session.accessToken = tokens.access_token;
  res.redirect('/dashboard');
});

// Attack scenario:
// 1. Attacker starts OAuth flow for THEIR account, gets callback URL:
//    yourapp.com/oauth/callback?code=ATTACKERS_CODE
// 2. Attacker sends this link to victim via email/phishing
// 3. Victim clicks link → logged into ATTACKER'S account
// 4. Victim enters credit card → attacker sees it!`,
      },
      secureCode: {
        language: 'javascript' as const,
        label: 'Secure Code',
        code: `// ✅ SECURE: Proper state parameter implementation
const crypto = require('crypto');

app.get('/login', (req, res) => {
  // ✅ Generate cryptographically random state
  const state = crypto.randomBytes(32).toString('hex');

  // ✅ Store state in user's session
  req.session.oauthState = state;
  req.session.oauthStateCreatedAt = Date.now();

  const authUrl = \`https://provider.com/oauth/authorize?\` +
    \`client_id=\${CLIENT_ID}&\` +
    \`redirect_uri=\${REDIRECT_URI}&\` +
    \`response_type=code&\` +
    \`scope=read:profile&\` +
    \`state=\${state}\`;  // ✅ Include state parameter

  res.redirect(authUrl);
});

app.get('/oauth/callback', async (req, res) => {
  const { code, state } = req.query;

  // ✅ CRITICAL: Validate state parameter
  const storedState = req.session.oauthState;
  const stateCreatedAt = req.session.oauthStateCreatedAt;

  // Check 1: State exists in session
  if (!storedState) {
    console.error('CSRF attempt: No stored state found');
    return res.status(400).send('Invalid OAuth state');
  }

  // Check 2: State matches
  if (state !== storedState) {
    console.error('CSRF attempt detected:', {
      received: state,
      expected: storedState,
      userIp: req.ip,
    });
    return res.status(400).send('Invalid OAuth state - possible CSRF attack');
  }

  // Check 3: State not expired (10 minute limit)
  const stateAge = Date.now() - stateCreatedAt;
  if (stateAge > 10 * 60 * 1000) {
    console.error('OAuth state expired');
    return res.status(400).send('OAuth state expired');
  }

  // ✅ Delete state after validation (single-use)
  delete req.session.oauthState;
  delete req.session.oauthStateCreatedAt;

  // State validated - proceed safely
  const tokens = await exchangeCodeForToken(code);
  req.session.accessToken = tokens.access_token;
  res.redirect('/dashboard');
});

// Attack now fails:
// 1. Attacker gets: yourapp.com/oauth/callback?code=EVIL&state=attacker_state
// 2. Victim clicks link
// 3. Your app checks: victim's session state ≠ attacker_state
// 4. Request rejected → attack prevented!`,
      },
    },
    {
      id: 'scenario-3',
      title: 'Authorization Code Interception (No PKCE)',
      threatLevel: 'MEDIUM' as const,
      attack: 'On mobile apps or SPAs, attacker intercepts authorization code from callback URL and exchanges it for access token (no client_secret protection).',
      exploitation: 'Malicious apps can register the same custom URL scheme and intercept authorization codes from deep links. Without PKCE, stolen codes can be exchanged for tokens.',
      defense: 'ALWAYS implement PKCE for mobile apps and SPAs (public clients). Use S256 (SHA-256) code challenge method, not "plain". Store code_verifier securely in app memory. Server MUST validate code_verifier matches code_challenge. Use custom URL schemes with app links/universal links for iOS/Android.',
      vulnerableCode: {
        language: 'javascript' as const,
        label: 'Vulnerable Code',
        code: `// ❌ VULNERABLE: Mobile app without PKCE
// Mobile App Code
async function login() {
  const authUrl = \`https://provider.com/oauth/authorize?\` +
    \`client_id=mobile_app_123&\` +
    \`redirect_uri=myapp://callback&\` +
    \`response_type=code&\` +
    \`state=\${randomState()}\`;
    // ❌ No PKCE code_challenge!

  // Open browser for authorization
  await openBrowser(authUrl);
}

// Handle deep link callback
function handleCallback(url) {
  const params = parseUrl(url);
  const code = params.code;

  // ❌ Exchange code for token WITHOUT code_verifier
  fetch('https://provider.com/oauth/token', {
    method: 'POST',
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'myapp://callback',
      client_id: 'mobile_app_123',
      // ❌ No client_secret (public client)
      // ❌ No code_verifier (no PKCE)
    }),
  });
}

// Attack scenario:
// 1. Malicious app registers custom URL scheme: myapp://
// 2. User authorizes legitimate app
// 3. Callback: myapp://callback?code=abc123
// 4. Malicious app intercepts deep link, steals code
// 5. Malicious app exchanges code for token (no PKCE to stop it!)`,
      },
      secureCode: {
        language: 'javascript' as const,
        label: 'Secure Code',
        code: `// ✅ SECURE: Mobile app with PKCE
import crypto from 'crypto';

// Generate PKCE parameters
function generatePKCE() {
  // Code verifier: Random 43-128 character string
  const codeVerifier = crypto.randomBytes(32).toString('base64url');

  // Code challenge: SHA-256 hash of verifier
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  return { codeVerifier, codeChallenge };
}

async function login() {
  // ✅ Generate PKCE parameters
  const { codeVerifier, codeChallenge } = generatePKCE();
  const state = crypto.randomBytes(16).toString('hex');

  // ✅ Store code_verifier securely (in-memory or secure storage)
  await secureStorage.set('pkce_code_verifier', codeVerifier);
  await secureStorage.set('oauth_state', state);

  // ✅ Include code_challenge in authorization URL
  const authUrl = \`https://provider.com/oauth/authorize?\` +
    \`client_id=mobile_app_123&\` +
    \`redirect_uri=myapp://callback&\` +
    \`response_type=code&\` +
    \`state=\${state}&\` +
    \`code_challenge=\${codeChallenge}&\` +  // ✅ PKCE challenge
    \`code_challenge_method=S256\`;  // ✅ SHA-256

  await openBrowser(authUrl);
}

async function handleCallback(url) {
  const params = parseUrl(url);
  const code = params.code;
  const state = params.state;

  // Validate state
  const storedState = await secureStorage.get('oauth_state');
  if (state !== storedState) {
    throw new Error('Invalid state - CSRF attack');
  }

  // ✅ Retrieve code_verifier
  const codeVerifier = await secureStorage.get('pkce_code_verifier');

  // ✅ Exchange code for token WITH code_verifier
  const response = await fetch('https://provider.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'myapp://callback',
      client_id: 'mobile_app_123',
      code_verifier: codeVerifier,  // ✅ PKCE verification
    }),
  });

  const tokens = await response.json();

  // Clean up
  await secureStorage.delete('pkce_code_verifier');
  await secureStorage.delete('oauth_state');

  return tokens;
}

// Server-side: Validate PKCE on token exchange
app.post('/oauth/token', async (req, res) => {
  const { code, code_verifier } = req.body;

  // Retrieve stored authorization code
  const authCode = await db.authCodes.findOne({ code });

  if (!authCode || !authCode.codeChallenge) {
    return res.status(400).json({ error: 'invalid_grant' });
  }

  // ✅ CRITICAL: Verify code_verifier matches code_challenge
  const computedChallenge = crypto
    .createHash('sha256')
    .update(code_verifier)
    .digest('base64url');

  if (computedChallenge !== authCode.codeChallenge) {
    console.error('PKCE validation failed - possible code theft');
    return res.status(400).json({ error: 'invalid_grant' });
  }

  // PKCE validated - issue token
  const accessToken = generateAccessToken(authCode.userId);
  res.json({ access_token: accessToken });
});

// Attack now fails:
// 1. Malicious app intercepts: myapp://callback?code=abc123
// 2. Tries to exchange code for token
// 3. Server asks for code_verifier
// 4. Malicious app doesn't have it (stored in legitimate app's memory)
// 5. Server validates SHA256(code_verifier) ≠ stored code_challenge
// 6. Token exchange rejected → attack prevented!`,
      },
    },
  ],

  challenges: [
    {
      id: 'challenge-1',
      title: 'Implement Authorization Code Flow',
      difficulty: 'Easy' as const,
      points: 100,
      description: 'Build a complete OAuth 2.0 authorization code flow with PKCE for a browser-based application. User should be redirected to mock authorization server, approve scopes, and receive access token.',
    },
    {
      id: 'challenge-2',
      title: 'Secure Refresh Token Rotation',
      difficulty: 'Medium' as const,
      points: 200,
      description: 'Implement refresh token rotation where each token refresh returns a NEW refresh token and invalidates the old one. Detect refresh token reuse attacks (if old token is used again, revoke entire token family).',
    },
    {
      id: 'challenge-3',
      title: 'Break the OAuth Flow',
      difficulty: 'Hard' as const,
      points: 300,
      description: 'Given a vulnerable OAuth implementation, exploit it using: (1) Redirect URI manipulation, (2) State parameter CSRF attack, and (3) Authorization code interception. Then FIX all vulnerabilities.',
    },
  ],

  achievements: {
    protocolInitiate: {
      title: 'Protocol Initiate',
      description: 'Complete all Essential sections',
      icon: 'Shield',
      color: 'text-green-400',
    },
    securityOperative: {
      title: 'Security Operative',
      description: 'Complete all Essential + Important sections',
      icon: 'ShieldCheck',
      color: 'text-blue-400',
    },
    eliteGuardian: {
      title: 'Elite Guardian',
      description: 'Complete all sections + 2 challenges',
      icon: 'ShieldAlert',
      color: 'text-purple-400',
    },
    masterArchitect: {
      title: 'Master Architect',
      description: 'Complete everything + all challenges',
      icon: 'Crown',
      color: 'text-yellow-400',
    },
  },

  crossReferences: {
    session: {
      title: 'Session-Based Authentication',
      comparison: 'Session auth stores state on server; OAuth delegates authorization to third party without sharing passwords.',
    },
    jwt: {
      title: 'JWT Authentication',
      comparison: 'OAuth often uses JWTs as access tokens, but JWT is a token format while OAuth is an authorization framework.',
    },
    mfa: {
      title: 'Multi-Factor Authentication',
      comparison: 'MFA can be combined with OAuth - users authenticate to OAuth provider with 2FA, then authorize your app.',
    },
  },
};

// Export code examples for components
export const codeExamples = {
  authorizationCodeFlow: oauthAuthContent.sections[1].codeExamples,
  scopeValidation: oauthAuthContent.sections[2].codeExamples,
  refreshTokenFlow: oauthAuthContent.sections[3].codeExamples,
  stateParameter: oauthAuthContent.sections[4].codeExamples,
  pkceImplementation: oauthAuthContent.sections[5].codeExamples,
  introspectionRevocation: oauthAuthContent.sections[6].codeExamples,
  dynamicClientRegistration: oauthAuthContent.sections[7].codeExamples,
};

export const securityScenarios = oauthAuthContent.securityScenarios;
export const challenges = oauthAuthContent.challenges;
