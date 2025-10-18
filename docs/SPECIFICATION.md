# 🔐 Authentication Learning Platform - Full Specification

**Version:** 1.0  
**Last Updated:** October 18, 2025  
**Purpose:** Educational - Deep understanding of authentication mechanisms

---

## 1. Project Overview

### 1.1 Vision
Build an interactive, self-contained learning platform that teaches authentication mechanisms through:
- Visual flow diagrams with animations
- Interactive demos (click-to-execute)
- Real-time request/response visualization
- Production-quality code examples
- Security best practices & attack scenarios

### 1.2 Goals
1. Understand authentication **flow & architecture** (not just theory)
2. Learn security implications of each design choice
3. Gain ability to implement authentication in production
4. Understand when to use which method (Session vs JWT vs OAuth)

### 1.3 Target Audience
- Developers new to authentication
- Want to learn deeply, not just "make it work"
- Prefer learning through interactive visualization + code

### 1.4 Non-Goals
- ❌ Building a production auth service (Auth0, Firebase alternative)
- ❌ User account management features (avatar, profile)
- ❌ Email verification, password reset flows
- ❌ Complex role-based access control (RBAC)
- ❌ Database optimization or scaling

---

## 2. Learning Objectives

By the end of this learning platform, you should understand:

### 2.1 Session/Cookie Authentication
- [ ] How HTTP is stateless and why sessions solve this
- [ ] Session ID generation & security
- [ ] Cookie attributes (HttpOnly, Secure, SameSite)
- [ ] Server-side session storage
- [ ] Session invalidation & logout
- [ ] Vulnerabilities: Session fixation, hijacking, CSRF

### 2.2 JWT (JSON Web Tokens)
- [ ] JWT structure (header.payload.signature)
- [ ] Why signature is needed (integrity, not confidentiality)
- [ ] Claims & expiration
- [ ] Stateless nature (pros & cons)
- [ ] Refresh token pattern
- [ ] Vulnerabilities: Token compromise, algorithm confusion, key leakage

### 2.3 OAuth 2.0 Flow
- [ ] Authorization code flow (most common)
- [ ] Redirect-based delegation
- [ ] Why OAuth ≠ authentication (it's authorization)
- [ ] OpenID Connect for authentication
- [ ] Implicit vs Authorization Code flow
- [ ] PKCE for public clients

### 2.4 Multi-Factor Authentication (MFA/2FA)
- [ ] Something you know (password)
- [ ] Something you have (phone, hardware key)
- [ ] Something you are (biometrics)
- [ ] TOTP-based 2FA
- [ ] Recovery codes

### 2.5 Security Principles
- [ ] Password hashing (bcrypt, not SHA)
- [ ] Salt & why it matters
- [ ] HTTPS requirement
- [ ] OWASP Top 10 auth vulnerabilities
- [ ] Timing attacks & mitigation
- [ ] Token storage best practices

---

## 3. Architecture Design

### 3.1 Technology Stack

```
Frontend:       Next.js 14+ (TypeScript)
Backend:        Next.js API routes (TypeScript)
Data Layer:     In-Memory Mock DB (TypeScript objects)
Styling:        Tailwind CSS
Visualization:  React + SVG/Canvas
Interactions:   React hooks + animations
```

### 3.2 High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Web Browser                        │
│  ┌──────────────────────────────────────────────┐  │
│  │         Learning Platform (Next.js)          │  │
│  │  ┌────────────────────────────────────────┐  │  │
│  │  │  Interactive UI Components             │  │  │
│  │  │  - Authentication Method Selector      │  │  │
│  │  │  - Flow Diagram Visualizer             │  │  │
│  │  │  - Interactive Demo Forms              │  │  │
│  │  │  - Request/Response Viewer             │  │  │
│  │  │  - Code Block with Highlights          │  │  │
│  │  └────────────────────────────────────────┘  │  │
│  │                     ↕                         │  │
│  │  ┌────────────────────────────────────────┐  │  │
│  │  │  Next.js Frontend Pages                │  │  │
│  │  │  - /index (Learning Hub)               │  │  │
│  │  │  - /session-demo                       │  │  │
│  │  │  - /jwt-demo                           │  │  │
│  │  │  - /oauth-demo                         │  │  │
│  │  │  - /mfa-demo                           │  │  │
│  │  │  - /dashboard (Protected Route)        │  │  │
│  │  └────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────┘  │
│                     ↕                               │
│  ┌──────────────────────────────────────────────┐  │
│  │  Next.js API Routes (/api/auth/*)           │  │
│  │  - POST /api/auth/login                     │  │
│  │  - POST /api/auth/logout                    │  │
│  │  - GET  /api/auth/verify                    │  │
│  │  - POST /api/auth/jwt-sign                  │  │
│  │  - POST /api/auth/refresh-token             │  │
│  │  - GET  /api/auth/protected-test            │  │
│  │  - GET  /api/auth/session-check             │  │
│  │  - POST /api/auth/mfa/setup                 │  │
│  │  - POST /api/auth/mfa/verify                │  │
│  └──────────────────────────────────────────────┘  │
│                     ↕                               │
│  ┌──────────────────────────────────────────────┐  │
│  │  In-Memory Mock Database                    │  │
│  │  (lib/mock-db.ts)                           │  │
│  │  - users[]                                  │  │
│  │  - sessions{}                               │  │
│  │  - tokens{}                                 │  │
│  │  - refreshTokens{}                          │  │
│  │  - mfaSecrets{}                             │  │
│  │  - auditLogs[]                              │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### 3.3 Data Flow Example: Login with Session

```
1. User enters username/password in UI
   ↓
2. Frontend: POST /api/auth/login { username, password }
   ↓
3. Backend:
   a) Find user in mockDB.users
   b) Compare password vs passwordHash (bcrypt.compare)
   c) If match: Generate random sessionId
   d) Store in mockDB.sessions[sessionId] = { userId, expiresAt, createdAt }
   e) Set HTTP-Only cookie: "SessionID=xyz123"
   f) Return { success: true, user: { id, username, email } }
   ↓
4. Frontend:
   a) Receive response
   b) Cookie auto-saved by browser (HTTP-Only)
   c) Visualize: Flow diagram shows each step with animation
   d) Show request/response in Network Viewer component
   ↓
5. Future requests:
   a) Browser auto-sends Cookie header
   b) Backend verifies sessionId still in mockDB.sessions
   c) Allows/denies based on session validity
```

### 3.4 Directory Structure

```
auth-learning-platform/
├── pages/
│   ├── _app.tsx                 (App wrapper, global state)
│   ├── _document.tsx            (Document template)
│   ├── index.tsx                (Learning Hub - choose topic)
│   ├── session-demo.tsx         (Session/Cookie interactive demo)
│   ├── jwt-demo.tsx             (JWT interactive demo)
│   ├── oauth-demo.tsx           (OAuth 2.0 flow visualization)
│   ├── mfa-demo.tsx             (MFA/2FA demo)
│   ├── dashboard.tsx            (Protected route - requires auth)
│   └── api/
│       ├── auth/
│       │   ├── login.ts         (Session login endpoint)
│       │   ├── logout.ts        (Session logout endpoint)
│       │   ├── verify.ts        (Verify current auth status)
│       │   ├── jwt-sign.ts      (Generate JWT token)
│       │   ├── jwt-verify.ts    (Verify JWT token)
│       │   ├── refresh-token.ts (Refresh JWT)
│       │   ├── session-check.ts (Check session validity)
│       │   ├── protected-test.ts (Test protected resource)
│       │   └── mfa/
│       │       ├── setup.ts     (Setup TOTP secret)
│       │       └── verify.ts    (Verify TOTP code)
│       └── mock-db.ts           (Mock database operations)
├── components/
│   ├── layouts/
│   │   └── MainLayout.tsx       (Header, sidebar, footer)
│   ├── auth/
│   │   ├── LoginForm.tsx        (Username/password form)
│   │   ├── LogoutButton.tsx     (Logout action)
│   │   ├── ProtectedRoute.tsx   (Protected route wrapper)
│   │   └── AuthStatus.tsx       (Show current auth status)
│   ├── visualization/
│   │   ├── FlowDiagram.tsx      (Session/JWT/OAuth flow with animation)
│   │   ├── StepByStep.tsx       (Step-by-step breakdown)
│   │   ├── NetworkViewer.tsx    (Show HTTP requests/responses)
│   │   └── TokenViewer.tsx      (Decode & display JWT/Session)
│   ├── demo/
│   │   ├── InteractiveDemo.tsx  (Demo controller)
│   │   ├── CodeBlock.tsx        (Syntax-highlighted code)
│   │   ├── RequestBuilder.tsx   (Build custom requests)
│   │   └── ResponseDisplay.tsx  (Show response data)
│   └── shared/
│       ├── Tabs.tsx             (Tabbed content)
│       ├── Badge.tsx            (Labels/tags)
│       └── Alert.tsx            (Informational alerts)
├── lib/
│   ├── mock-db.ts              (In-memory database with mock data)
│   ├── auth.ts                 (Auth utility functions)
│   ├── jwt.ts                  (JWT generation/verification)
│   ├── crypto.ts               (Hashing, encryption utilities)
│   ├── types.ts                (Shared TypeScript types)
│   └── constants.ts            (Constants, config)
├── styles/
│   ├── globals.css             (Global styles)
│   └── animations.css          (Animation definitions)
├── public/
│   └── (static assets)
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## 4. Authentication Methods Specification

### 4.1 Session & Cookie Authentication

#### 4.1.1 Flow Overview
```
User                          Server
  │                             │
  ├─────  POST /login  ────────>│
  │   (username, password)      │
  │                             │
  │<── Set-Cookie: SessionID ───┤
  │    (HTTP-Only, Secure)      │
  │                             │
  ├─────  GET /dashboard ───────>│ (with Cookie header)
  │                             │
  │<─── Dashboard HTML ─────────┤
  │                             │
```

#### 4.1.2 Key Concepts (RFC 6265)
- **Session ID:** Random string (min 128 bits entropy)
- **Storage:** Server-side (in mockDB for this project)
- **Cookie Attributes:**
  - `HttpOnly`: Cannot be accessed via JavaScript (XSS protection)
  - `Secure`: Only sent over HTTPS
  - `SameSite=Strict`: CSRF protection
  - `Max-Age` or `Expires`: Expiration time
  - `Path=/`: Sent with all requests to this path
  - `Domain`: Restrict to specific domain

#### 4.1.3 Implementation Details
```typescript
// Generation: 
sessionId = crypto.randomBytes(32).toString('hex')

// Storage:
mockDB.sessions[sessionId] = {
  userId: number,
  createdAt: Date,
  expiresAt: Date,
  lastActivity: Date
}

// Verification:
- Extract sessionId from Cookie
- Lookup in mockDB.sessions
- Check if not expired
- Check if not invalidated (logout)
```

#### 4.1.4 Vulnerabilities & Mitigations

| Vulnerability | Risk | Mitigation |
|---|---|---|
| Session Fixation | Attacker sets known sessionId | Regenerate session after login |
| Session Hijacking | MITM steals cookie | Use HTTPS + Secure flag |
| CSRF | Cross-site request forgery | SameSite=Strict flag |
| XSS | JavaScript steals cookie | HttpOnly flag |
| Replay | Old session reused | Use timestamps, invalidate on logout |

#### 4.1.5 Pros & Cons

**Pros:**
- ✅ Simple & well-understood
- ✅ Server has full control (revoke instantly)
- ✅ Automatic browser handling
- ✅ Works with traditional server architecture

**Cons:**
- ❌ Server memory/DB required to store sessions
- ❌ Scaling issues (session affinity in load balancing)
- ❌ Cannot share across subdomains easily
- ❌ Dependent on cookies

#### 4.1.6 Real-World Usage
- Traditional web apps (Rails, Django, ASP.NET)
- Enterprise applications
- When you need instant revocation

#### 4.1.7 RFC Reference
- RFC 6265: HTTP State Management Mechanism (Cookies)
- OWASP: Session Management Cheat Sheet

---

### 4.2 JWT (JSON Web Token) Authentication

#### 4.2.1 Flow Overview
```
User                          Server
  │                             │
  ├─────  POST /login  ────────>│
  │   (username, password)      │
  │                             │
  │<── { token: "xxx.yyy.zzz" }─┤
  │                             │
  ├─────  GET /dashboard ───────>│ 
  │    (Authorization: Bearer xxx.yyy.zzz)
  │                             │
  │<─── Dashboard HTML ─────────┤
  │                             │
```

#### 4.2.2 JWT Structure (RFC 7519)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

Breaking down:
1. Header: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
   Base64URL decoded: { "alg": "HS256", "typ": "JWT" }

2. Payload: eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ
   Base64URL decoded: { "sub": "1234567890", "name": "John Doe", "iat": 1516239022 }

3. Signature: SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
   HMAC-SHA256(header + "." + payload, SECRET)
```

#### 4.2.3 Key Concepts
- **Stateless:** Server doesn't store token, only verifies signature
- **Claims:** Data contained in payload (sub, name, exp, iat, etc)
- **Signature:** Proves token hasn't been tampered with (integrity, NOT confidentiality)
- **Expiration:** Token automatically invalid after exp timestamp

#### 4.2.4 Standard Claims (RFC 7519 Section 4.1)
```typescript
{
  "iss": "issuer",           // Who created the token
  "sub": "subject",          // Who the token is about (usually user ID)
  "aud": "audience",         // Who is intended to receive
  "exp": 1234567890,         // Expiration time (Unix timestamp)
  "nbf": 1234567890,         // Not valid before this time
  "iat": 1234567890,         // Issued at (when token was created)
  "jti": "unique-id",        // JWT ID (unique identifier)
  
  // Custom claims:
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin"
}
```

#### 4.2.5 Implementation Details
```typescript
// Generation:
const token = jwt.sign(
  {
    sub: userId,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  },
  SECRET_KEY,
  { algorithm: 'HS256' }
);

// Verification:
try {
  const decoded = jwt.verify(token, SECRET_KEY);
  // Token is valid
} catch (error) {
  if (error.name === 'TokenExpiredError') {
    // Token expired
  } else if (error.name === 'JsonWebTokenError') {
    // Invalid signature or malformed
  }
}
```

#### 4.2.6 Token Storage Location (Frontend)
```
❌ localStorage:     Easy for XSS attacks to steal
❌ sessionStorage:   Vulnerable to XSS
✅ Memory:          Cleared on refresh (session-like)
✅ HTTP-Only Cookie: Cannot be accessed by JavaScript
✅ Encrypted Cookie: Double protection
```

For this learning project: **Use localStorage** (easier to demo), but explain XSS risk.

#### 4.2.7 Refresh Token Pattern

```
Access Token (short-lived, 15 min):
- Included in Authorization header
- Small payload for quick verification
- If compromised, limited damage

Refresh Token (long-lived, 7 days):
- Stored securely (HTTP-Only cookie or localStorage)
- Only sent to /refresh-token endpoint
- Used to get new access token

Flow:
1. POST /login → returns access + refresh token
2. Use access token until expiration
3. POST /refresh-token (with refresh token) → new access token
4. Continue using new access token
5. If refresh token expires → must login again
```

#### 4.2.8 Vulnerabilities & Mitigations

| Vulnerability | Risk | Mitigation |
|---|---|---|
| Token Theft | XSS/MITM steals token | Use HTTPS, HTTP-Only cookies, short expiration |
| Algorithm Confusion | Attacker uses 'none' algorithm | Verify algorithm in token, enforce specific algorithm |
| Key Leakage | Secret key compromised | Rotate keys regularly, strong secret |
| Token Reuse | Replay attack | Add jti claim, token blacklist |
| Expiration Not Checked | Expired token still valid | Always verify exp claim |

#### 4.2.9 Pros & Cons

**Pros:**
- ✅ Stateless (no server storage needed)
- ✅ Works across subdomains (CORS-friendly)
- ✅ Scales better than sessions
- ✅ Mobile-friendly (no cookies)
- ✅ Can encode user data

**Cons:**
- ❌ Cannot instantly revoke (must wait for expiration)
- ❌ Token size larger than session ID
- ❌ Signature overhead
- ❌ Data in token is visible (not encrypted)

#### 4.2.10 Real-World Usage
- Mobile apps
- Single Page Applications (SPAs)
- Microservices
- API-first architectures
- When scaling horizontally

#### 4.2.11 RFC Reference
- RFC 7519: JSON Web Token (JWT)
- RFC 7518: JSON Web Algorithms (JWA)

---

### 4.3 OAuth 2.0 Authorization (Visualization & Mock Flow)

**Note:** For this learning project, OAuth will be:
1. **Flow visualization** (animated diagram of authorization code flow)
2. **Mock implementation** (local simulated OAuth provider)
3. **NOT** real integration with Google/GitHub (can be added later)

#### 4.3.1 Why OAuth (and What It's NOT)

```
❌ OAuth is NOT authentication (who are you?)
✅ OAuth is authorization (what can you access?)

But OAuth 2.0 + OpenID Connect = Authentication
```

#### 4.3.2 Authorization Code Flow (RFC 6749 Section 1.3.1)

```
Resource           Authorization      Client          User
Owner              Server            (App)          Agent
(User)                                             (Browser)
  │                  │                  │            │
  │──────── Wants to login ────────────────────────> │
  │                  │                  │ Redirect   │
  │                  │                  │ to OAuth   │
  │<──────────────────────────────────────────────── │
  │                  │                  │            │
  │─────────────────────> Consent? <────────────────>│
  │                  │                  │            │
  │<──────── Auth Code ────────────────────────────  │
  │                  │                  │            │
  │                  │ (Backend)        │            │
  │                  │ POST /token      │            │
  │                  │ code + secret    │            │
  │                  │ ←───────────────>│            │
  │                  │                  │            │
  │                  │ Access Token     │            │
  │                  │ ←───────────────>│            │
  │                  │                  │            │
  │                  │ User Info        │            │
  │                  │ ←───────────────>│            │
  │<──────────────────────────────────── Create session
  │                  │                  │            │
```

#### 4.3.3 Key Components

1. **Resource Owner:** User (you)
2. **Authorization Server:** OAuth provider (Google, GitHub)
3. **Resource Server:** API with user data (Google API)
4. **Client:** Our learning app (in this case, localhost)

#### 4.3.4 Authorization Code Flow Steps

```
1. User clicks "Login with Google"
   └─> redirect to: https://accounts.google.com/o/oauth2/v2/auth?
       client_id=YOUR_CLIENT_ID&
       redirect_uri=http://localhost:3000/api/oauth/callback&
       response_type=code&
       scope=openid%20email%20profile

2. User logs into Google, grants permission
   └─> Google redirects to: http://localhost:3000/api/oauth/callback?code=AUTH_CODE

3. Our backend receives code, exchanges for token
   └─> POST https://oauth2.googleapis.com/token
       {
         code: AUTH_CODE,
         client_id: YOUR_CLIENT_ID,
         client_secret: YOUR_SECRET,
         redirect_uri: http://localhost:3000/api/oauth/callback,
         grant_type: authorization_code
       }

4. Google returns access token
   └─> { access_token: "...", expires_in: 3600, ... }

5. We use access token to get user info
   └─> GET https://www.googleapis.com/oauth2/v2/userinfo
       Authorization: Bearer ACCESS_TOKEN

6. Create session/JWT in our app
   └─> User is logged in locally
```

#### 4.3.5 Mock OAuth Implementation (For Learning)

Since we can't integrate real OAuth locally without setup, we'll create:

```typescript
// Simulated OAuth provider
mockOAuthProvider = {
  authorize: (clientId, redirectUri, scope) => {
    // Simulate user clicking "Allow"
    return {
      authCode: generateAuthCode(),
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 min
    }
  },
  
  exchangeCode: (authCode, clientSecret) => {
    // Exchange code for token
    return {
      accessToken: generateJWT(),
      refreshToken: generateRefreshToken(),
      expiresIn: 3600
    }
  },
  
  getUserInfo: (accessToken) => {
    // Return mock user data
    return {
      id: '123',
      email: 'user@example.com',
      name: 'John Doe',
      picture: 'https://...'
    }
  }
}
```

#### 4.3.6 PKCE for Public Clients (RFC 7636)

For mobile/SPA (no backend secret):

```
Without PKCE (vulnerable):
1. code = authorization code (visible in redirect)
2. Attacker intercepts code
3. Attacker can exchange code for token (no secret needed)

With PKCE:
1. code_challenge = SHA256(random_string)
2. Send code_challenge in auth request
3. Receive code
4. Exchange code + code_verifier (random_string) for token
5. Server verifies: SHA256(code_verifier) == code_challenge
6. Even if attacker has code, they can't get token (no verifier)
```

#### 4.3.7 Real-World Flows

| Flow | Use Case | Security |
|---|---|---|
| Authorization Code | Server-side apps | ✅ Most secure |
| Authorization Code + PKCE | Mobile/SPA | ✅ Secure for public clients |
| Implicit | Old SPAs | ❌ Deprecated (insecure) |
| Client Credentials | Service-to-service | ✅ For non-user resources |
| Resource Owner Password | Legacy | ❌ Avoid (expose password) |

#### 4.3.8 OpenID Connect (OIDC)

OAuth 2.0 is authorization. For authentication, use:

```
OAuth 2.0 + OpenID Connect = Proper authentication

Difference:
- OAuth: "What can user access?"
- OpenID Connect: "Who is the user?" (adds ID token)

ID Token (JWT):
{
  "iss": "https://accounts.google.com",
  "sub": "user_id",
  "aud": "client_id",
  "exp": 1234567890,
  "iat": 1234567800,
  "email": "user@example.com",
  "email_verified": true,
  "name": "John Doe"
}
```

#### 4.3.9 RFC Reference
- RFC 6749: OAuth 2.0 Authorization Framework
- RFC 6234: PKCE (Proof Key for Public Clients)
- OpenID Connect Core 1.0: Authentication

---

### 4.4 Multi-Factor Authentication (MFA/2FA)

#### 4.4.1 Three Types of Factors

| Factor | Example | Security |
|--------|---------|----------|
| Something you know | Password, PIN | Low (can be guessed/phished) |
| Something you have | Phone, hardware key | High (physical theft risk) |
| Something you are | Fingerprint, face | Very High (biometric) |

**Good MFA:** Combine 2+ different types

#### 4.4.2 TOTP-Based 2FA (Time-based One-Time Password)

Most common for learning: **TOTP** (RFC 6238)

```
1. Setup:
   - Generate random secret (base32 encoded)
   - Share QR code with user (user scans in Authenticator app)
   - User confirms by entering one-time code

2. Authentication:
   - User provides password
   - Server verifies password
   - Server asks for TOTP code
   - User opens Authenticator app (Google Authenticator, Authy, etc)
   - App shows 6-digit code that changes every 30 seconds
   - User enters code
   - Server verifies: TOTP(secret, time) == entered code
   - If match: user authenticated

3. Recovery:
   - Generate recovery codes (one-time use)
   - User stores securely
   - If phone lost, use recovery code to regain access
```

#### 4.4.3 Implementation

```typescript
// Setup TOTP
import speakeasy from 'speakeasy';

const secret = speakeasy.generateSecret({
  name: 'Auth Learning Platform (user@example.com)',
  issuer: 'Auth Learning Platform'
});

// secret.base32 → show QR code to user
// secret.ascii → for manual entry

// Store secret in mockDB
mockDB.mfaSecrets[userId] = {
  secret: secret.base32,
  enabled: false,
  backupCodes: generateBackupCodes(10),
  createdAt: Date.now()
}

// Verify TOTP code
const verified = speakeasy.totp.verify({
  secret: mockDB.mfaSecrets[userId].secret,
  encoding: 'base32',
  token: userEnteredCode,
  window: 2 // Allow ±2 time steps (60 seconds tolerance)
});

if (verified) {
  // Success
}
```

#### 4.4.4 MFA Flow

```
User                          Server
  │                             │
  ├─────  POST /login  ────────>│
  │  (username, password)       │
  │                             │
  │<─── Enter 2FA Code ─────────┤
  │  (if MFA enabled)           │
  │                             │
  ├─────  POST /verify-2fa ────>│
  │  (code)                     │
  │                             │
  │<──── Session/JWT ───────────┤
  │                             │
```

#### 4.4.5 Recovery Codes

```
When setting up 2FA:
- Generate 10 one-time backup codes
- User downloads/screenshots them
- Stored safely
- If phone lost: use 1 backup code instead of 2FA
- Each code valid once only
```

#### 4.4.6 Vulnerabilities & Mitigations

| Issue | Mitigation |
|-------|-----------|
| Time drift | Allow ±2 time steps (60s window) |
| Code reuse | Track used codes, prevent reuse |
| Phone loss | Backup codes |
| Phishing TOTP | Browser extension warnings, phishing-resistant keys |

#### 4.4.7 RFC Reference
- RFC 6238: TOTP (Time-based One-Time Password)
- RFC 4226: HOTP (HMAC-based One-Time Password)

---

## 5. API Specification (OpenAPI-style)

### 5.1 Authentication Endpoints

#### 5.1.1 POST /api/auth/login
**Purpose:** Session-based login

```typescript
Request:
{
  "username": string,
  "password": string
}

Response 200 OK:
{
  "success": true,
  "user": {
    "id": number,
    "username": string,
    "email": string,
    "role": "admin" | "user"
  }
}

Response 401 Unauthorized:
{
  "error": "Invalid credentials"
}

Side Effects:
- Creates session in mockDB.sessions
- Sets HTTP-Only cookie: SessionID=...
```

#### 5.1.2 POST /api/auth/logout
**Purpose:** Invalidate session

```typescript
Request:
(no body, requires valid SessionID cookie)

Response 200 OK:
{
  "success": true,
  "message": "Logged out"
}

Side Effects:
- Removes sessionId from mockDB.sessions
- Browser clears cookie
```

#### 5.1.3 GET /api/auth/verify
**Purpose:** Check current auth status

```typescript
Request:
(requires SessionID cookie or Authorization header with JWT)

Response 200 OK:
{
  "authenticated": true,
  "user": {
    "id": number,
    "username": string,
    "email": string
  },
  "method": "session" | "jwt"
}

Response 401 Unauthorized:
{
  "authenticated": false,
  "error": "No valid session/token"
}
```

#### 5.1.4 POST /api/auth/jwt-sign
**Purpose:** Generate JWT token

```typescript
Request:
{
  "username": string,
  "password": string
}

Response 200 OK:
{
  "success": true,
  "accessToken": string,
  "refreshToken": string,
  "expiresIn": 3600,
  "user": {
    "id": number,
    "username": string
  }
}

Response 401 Unauthorized:
{
  "error": "Invalid credentials"
}

Note:
- accessToken: 15-minute expiration (for learning)
- refreshToken: 7-day expiration
```

#### 5.1.5 POST /api/auth/jwt-verify
**Purpose:** Verify JWT token validity

```typescript
Request:
{
  "token": string
}

Response 200 OK:
{
  "valid": true,
  "decoded": {
    "sub": string,
    "email": string,
    "iat": number,
    "exp": number
  }
}

Response 401 Unauthorized:
{
  "valid": false,
  "error": "Invalid signature" | "Token expired" | "Malformed"
}
```

#### 5.1.6 POST /api/auth/refresh-token
**Purpose:** Get new access token using refresh token

```typescript
Request:
{
  "refreshToken": string
}

Response 200 OK:
{
  "accessToken": string,
  "expiresIn": 3600
}

Response 401 Unauthorized:
{
  "error": "Invalid or expired refresh token"
}
```

#### 5.1.7 GET /api/auth/session-check
**Purpose:** Debug - check session state

```typescript
Response 200 OK:
{
  "sessionId": string,
  "userId": number,
  "createdAt": ISO8601,
  "expiresAt": ISO8601,
  "lastActivity": ISO8601,
  "expired": boolean
}

Response 401 Unauthorized:
{
  "error": "No active session"
}
```

#### 5.1.8 GET /api/auth/protected-test
**Purpose:** Test protected resource access

```typescript
Request:
(requires valid SessionID cookie or Authorization: Bearer JWT)

Response 200 OK:
{
  "message": "You have access to protected resource",
  "data": {
    "secretInfo": "This is only visible to authenticated users"
  }
}

Response 401 Unauthorized:
{
  "error": "Authentication required"
}

Response 403 Forbidden:
{
  "error": "Insufficient permissions"
}
```

#### 5.1.9 POST /api/auth/mfa/setup
**Purpose:** Initialize MFA for user

```typescript
Request:
{
  "userId": number
}

Response 200 OK:
{
  "secret": string,          // base32 encoded
  "qrCode": string,          // data:image/png;base64,...
  "manualEntry": string,     // Manual entry string
  "backupCodes": string[]    // 10 backup codes
}
```

#### 5.1.10 POST /api/auth/mfa/verify
**Purpose:** Verify TOTP code during login

```typescript
Request:
{
  "userId": number,
  "code": string,            // 6-digit code from authenticator
  "useBackupCode": boolean   // Optional: use backup code instead
}

Response 200 OK:
{
  "success": true,
  "message": "2FA verified"
}

Response 401 Unauthorized:
{
  "error": "Invalid code"
}
```

### 5.2 Mock Database Operations

#### 5.2.1 User Management
```typescript
interface User {
  id: number;
  username: string;
  email: string;
  passwordHash: string;  // bcrypt hash
  role: "admin" | "user";
  mfaEnabled: boolean;
  createdAt: Date;
}

mockDB.users = [
  {
    id: 1,
    username: "admin",
    email: "admin@example.com",
    passwordHash: "$2b$10$...",
    role: "admin",
    mfaEnabled: false,
    createdAt: new Date()
  },
  {
    id: 2,
    username: "user",
    email: "user@example.com",
    passwordHash: "$2b$10$...",
    role: "user",
    mfaEnabled: false,
    createdAt: new Date()
  }
]
```

#### 5.2.2 Session Management
```typescript
interface Session {
  userId: number;
  createdAt: Date;
  expiresAt: Date;
  lastActivity: Date;
}

mockDB.sessions = {
  "abc123xyz": {
    userId: 1,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    lastActivity: new Date()
  }
}
```

#### 5.2.3 Token Management
```typescript
interface TokenRecord {
  userId: number;
  type: "access" | "refresh";
  issuedAt: Date;
  expiresAt: Date;
  revokedAt: Date | null;
}

mockDB.tokens = {
  "jwt_token_here": {
    userId: 1,
    type: "access",
    issuedAt: new Date(),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    revokedAt: null
  }
}
```

#### 5.2.4 MFA Secrets
```typescript
interface MFASecret {
  userId: number;
  secret: string;          // base32 encoded TOTP secret
  enabled: boolean;
  backupCodes: string[];   // Unused backup codes
  usedCodes: string[];     // Used backup codes (for replay prevention)
  createdAt: Date;
}

mockDB.mfaSecrets = {
  "1": {
    userId: 1,
    secret: "JBSWY3DPEBLW64TMMQ======",
    enabled: false,
    backupCodes: ["code1", "code2", ...],
    usedCodes: [],
    createdAt: new Date()
  }
}
```

#### 5.2.5 Audit Logs
```typescript
interface AuditLog {
  id: number;
  userId: number | null;   // null for failed login
  action: string;
  status: "success" | "failure";
  timestamp: Date;
  metadata?: {
    username?: string;
    reason?: string;
    ip?: string;
  }
}

mockDB.auditLogs = [
  {
    id: 1,
    userId: 1,
    action: "login",
    status: "success",
    timestamp: new Date(),
    metadata: { username: "admin" }
  }
]
```

---

## 6. Security Requirements (OWASP-Based)

### 6.1 OWASP Top 10 Authentication Issues

| Issue | Mitigation | Implementation |
|-------|-----------|-----------------|
| **Broken Authentication** | Strong password hashing, MFA | bcrypt, TOTP |
| **Broken Session Management** | Secure session attributes | HttpOnly, Secure, SameSite |
| **Credential Exposure** | HTTPS, never log passwords | Always HTTPS, hash immediately |
| **Insufficient Logging** | Log auth events | auditLogs in mockDB |
| **Account Enumeration** | Generic error messages | "Invalid credentials" (not "user not found") |
| **Token Exposure** | Short expiration, secure storage | 15min access, HTTP-Only |
| **CSRF** | SameSite cookies, CSRF tokens | SameSite=Strict |
| **XSS** | HttpOnly cookies, Content-Security-Policy | HttpOnly flag, sanitize inputs |
| **Weak Password Policy** | Min 8 chars, complexity | Enforce in validation |
| **Lack of Rate Limiting** | Limit login attempts | Implement in future iteration |

### 6.2 Password Hashing

**Never** use:
- ❌ SHA256, MD5 (fast = easy to crack)
- ❌ Plain text (obviously)
- ❌ Single salt (rainbow table attacks)

**Always** use:
- ✅ bcrypt (slow by design, built-in salt)
- ✅ Argon2 (memory-hard, best for 2024)
- ✅ scrypt (memory-hard)

```typescript
// Hashing password on signup/login
import bcrypt from 'bcryptjs';

const passwordHash = await bcrypt.hash(password, 10);
// 10 = cost (higher = slower, more secure)

// Verifying password
const isValid = await bcrypt.compare(password, passwordHash);
```

### 6.3 HTTPS Requirement

All authentication **must** use HTTPS in production:
- ✅ Prevents MITM attacks
- ✅ Required for Secure cookie flag
- ✅ Required for CORS credentials

For local development: http://localhost is allowed (browser special case)

### 6.4 Cookie Security Attributes

```typescript
// CORRECT:
res.setHeader(
  'Set-Cookie',
  `SessionID=${sessionId}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${24 * 60 * 60}`
);

// Breakdown:
// HttpOnly:     Cannot access via JavaScript (XSS protection)
// Secure:       Only sent over HTTPS
// SameSite=Strict: Not sent in cross-site requests (CSRF protection)
// Path=/:       Sent with all requests to this app
// Max-Age:      Expires in 24 hours
```

### 6.5 Token Security

**Access Token:**
- ✅ Short-lived (15 minutes)
- ✅ Included in Authorization header
- ✅ If compromised, limited damage

**Refresh Token:**
- ✅ Long-lived (7 days)
- ✅ Stored securely (HTTP-Only cookie)
- ✅ Only sent to /refresh endpoint
- ✅ Can be rotated/revoked

**Token Storage (Frontend):**
```typescript
// For learning/demos:
localStorage.setItem('token', accessToken);  // Easy to demo XSS

// Production:
// Use HTTP-Only cookie (cannot access via JS, but harder to demo)
```

### 6.6 Input Validation

All user inputs must be validated:

```typescript
// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  return res.status(400).json({ error: "Invalid email" });
}

// Username validation
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
if (!usernameRegex.test(username)) {
  return res.status(400).json({ error: "Username must be 3-20 chars, alphanumeric" });
}

// Password length
if (password.length < 8) {
  return res.status(400).json({ error: "Password must be at least 8 characters" });
}
```

### 6.7 Error Handling

**DON'T reveal information to attackers:**

```typescript
// ❌ WRONG:
return res.status(401).json({ error: "User 'admin' not found" });
// ^ Reveals that 'admin' user doesn't exist

// ✅ CORRECT:
return res.status(401).json({ error: "Invalid credentials" });
// ^ Generic, doesn't leak user existence
```

### 6.8 Rate Limiting (Future Enhancement)

For production, implement:
```typescript
// Limit login attempts per IP: 5 attempts per 15 minutes
// Limit password resets per email: 3 per hour
// Limit API requests per user: 100 per minute
```

For this learning project: Skip (add note for future)

---

## 7. Component Structure & Responsibilities

### 7.1 Page Components

#### pages/index.tsx (Learning Hub)
```
Purpose: Main learning platform homepage
Content:
  - Welcome message
  - Choose authentication method
  - Quick start guides
  - Learning path visualization
```

#### pages/session-demo.tsx
```
Purpose: Interactive Session/Cookie authentication
Layout:
  [Left]                    [Right]
  - Explanation             - Interactive Demo
  - Flow diagram            - Login form
  - Code example            - Session viewer
  - Security notes          - Network requests
```

#### pages/jwt-demo.tsx
```
Purpose: Interactive JWT authentication
Layout:
  [Left]                    [Right]
  - JWT structure           - Token generator
  - Claims explanation      - Token decoder
  - RFC reference           - Refresh token demo
  - Best practices          - Signature verification
```

#### pages/oauth-demo.tsx
```
Purpose: OAuth 2.0 flow visualization
Layout:
  - Authorization flow animation
  - Step-by-step breakdown
  - Code exchange simulation
  - Token flow diagram
```

#### pages/mfa-demo.tsx
```
Purpose: Multi-Factor Authentication demo
Layout:
  - TOTP setup flow
  - QR code generation
  - Authenticator simulation
  - Recovery codes
```

#### pages/dashboard.tsx
```
Purpose: Protected route (requires authentication)
Features:
  - Show only if authenticated
  - Display user info
  - Test API access
  - Logout button
```

### 7.2 Component Specifications

#### FlowDiagram.tsx
```typescript
Props:
  - method: "session" | "jwt" | "oauth" | "mfa"
  - interactive: boolean
  - onStepClick: (step: number) => void

Features:
  - SVG-based flow diagram
  - Animated transitions
  - Click to highlight each step
  - Show request/response for each step
```

#### InteractiveDemo.tsx
```typescript
Props:
  - method: "session" | "jwt"
  - onRequest: (data: any) => void
  - onResponse: (data: any) => void

Features:
  - Form for user input
  - Submit button
  - Real-time visualization
  - Response display
```

#### NetworkViewer.tsx
```typescript
Props:
  - requests: Array<{ method, url, headers, body, response }>

Features:
  - List of HTTP requests
  - Expandable request/response
  - Syntax highlighting
  - Copy buttons
```

#### TokenViewer.tsx
```typescript
Props:
  - token: string
  - type: "session" | "jwt" | "refresh"

Features:
  - Decode JWT to show payload
  - Display cookie attributes
  - Show expiration status
  - Visualize token structure
```

#### CodeBlock.tsx
```typescript
Props:
  - code: string
  - language: "typescript" | "javascript" | "bash"
  - highlight: string[] (lines to highlight)

Features:
  - Syntax highlighting
  - Line numbers
  - Copy to clipboard
  - Theme (light/dark)
```

---

## 8. User Flows & Diagrams

### 8.1 Session Login Flow (Full)

```
User                    Browser                 Our Server              Mock DB
│                          │                         │                     │
├── Click "Login" ──────────>│                       │                     │
│                          │                         │                     │
├── Enter username/pass ───>│                       │                     │
│                          │                         │                     │
├── Click "Submit" ────────>│                       │                     │
│                          │                         │                     │
│<──── Show spinner ────────┤                       │                     │
│                          │                         │                     │
│                          ├── POST /api/auth/login ─>│                     │
│                          │  {username, password}   │                     │
│                          │                         ├─ Find user in DB ──>│
│                          │                         │<─ Return user ──────┤
│                          │                         │                     │
│                          │                         ├─ Compare password ──┤
│                          │                         │<─ Match? ──────────┘│
│                          │                         │                     │
│                          │                         ├─ Generate sessionId │
│                          │                         │                     │
│                          │                         ├─ Store in DB ─────>│
│                          │                         │<─ Stored ──────────┘│
│                          │                         │                     │
│                          │<─── 200 OK ────────────┤                     │
│                          │ Set-Cookie: SessionID   │                     │
│                          │ {user: {...}}          │                     │
│                          │                         │                     │
│<─── Hide spinner ────────┤                         │                     │
│<─── Redirect to /dash ───┤                         │                     │
│                          │                         │                     │
│                          ├── GET /api/auth/verify ─>│                     │
│                          │ (with SessionID cookie) │                     │
│                          │                         ├─ Lookup sessionId ─>│
│                          │                         │<─ Found, not exp ───┤
│                          │<─── 200 OK ────────────┤                     │
│                          │ {authenticated: true}   │                     │
│                          │                         │                     │
│<─── Show dashboard ──────┤                         │                     │
│                          │                         │                     │
```

### 8.2 JWT Refresh Token Flow

```
User                    Browser                 Our Server              Mock DB
│                          │                         │                     │
│                          │ (After 15 min, token    │                     │
│                          │  access token expires)  │                     │
│                          │                         │                     │
├── Make API request ──────>│                       │                     │
│                          │                         │                     │
│                          ├── GET /api/data ───────>│                     │
│                          │ Auth: Bearer TOKEN      │                     │
│                          │ (token expired!)        │                     │
│                          │                         │                     │
│                          │<─── 401 Unauthorized ──┤                     │
│                          │ "Token expired"         │                     │
│                          │                         │                     │
│<─── Token expired ───────┤                         │                     │
│                          │                         │                     │
│                          ├── POST /refresh-token ─>│                     │
│                          │ {refreshToken: ...}     │                     │
│                          │                         ├─ Verify refresh ───>│
│                          │                         │<─ Valid ───────────┘│
│                          │                         │                     │
│                          │                         ├─ Generate new JWT   │
│                          │<─── 200 OK ────────────┤                     │
│                          │ {accessToken: new_jwt}  │                     │
│                          │                         │                     │
│<─── Update token ────────┤                         │                     │
│                          │                         │                     │
├── Retry API request ─────>│                       │                     │
│                          │                         │                     │
│                          ├── GET /api/data ───────>│                     │
│                          │ Auth: Bearer NEW_TOKEN  │                     │
│                          │                         ├─ Verify signature   │
│                          │<─── 200 OK ────────────┤                     │
│                          │ {data: ...}             │                     │
│                          │                         │                     │
│<─── Show data ───────────┤                         │                     │
│                          │                         │                     │
```

### 8.3 OAuth 2.0 Flow (Simplified)

```
User        Browser         Our App         OAuth Provider
│               │               │                   │
├─ Click "Login with Google" ──>│                  │
│               │               │                  │
│               │<─ Redirect ────────────────────>│
│               │ (to Google login)                │
│               │                                  │
│               ├─ Enter Google credentials ──────>│
│               │                                  │
│               │<─ "Allow app access?" ─────────┤
│               │                                  │
│               ├─ Click "Allow" ───────────────>│
│               │                                  │
│               │<─ Redirect with auth code ──────┤
│               │ (back to our app)                │
│               │                                  │
│               │ GET /callback?code=AUTH_CODE    │
│               │ (Backend intercepts)            │
│               │                                  │
│               │ [Behind the scenes]              │
│               │ POST /token ──────────────────>│
│               │ code + client_secret            │
│               │                                  │
│               │<─ Access Token ────────────────┤
│               │                                  │
│               │ GET /userinfo ────────────────>│
│               │ (with access token)             │
│               │                                  │
│               │<─ User Info ───────────────────┤
│               │                                  │
│               │<─ Redirect to /dashboard ───────┤
│               │                                  │
│<── Logged in! ─────────────────────────────────┤
│               │                                  │
```

---

## 9. Development Checklist

### 9.1 Phase 1: Setup & Structure (Haiku)
- [ ] Create Next.js project with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Create project directory structure
- [ ] Setup environment variables (.env.local)
- [ ] Create mock database (lib/mock-db.ts)
- [ ] Create TypeScript types (lib/types.ts)

### 9.2 Phase 2: Core Components (Haiku)
- [ ] Create MainLayout component (header, sidebar, footer)
- [ ] Create LoginForm component
- [ ] Create LogoutButton component
- [ ] Create ProtectedRoute wrapper
- [ ] Create AuthStatus component (show current auth)
- [ ] Create CodeBlock component (syntax highlighting)
- [ ] Create NetworkViewer component

### 9.3 Phase 3: Session Authentication (Sonnet)
- [ ] Implement /api/auth/login endpoint
- [ ] Implement /api/auth/logout endpoint
- [ ] Implement /api/auth/verify endpoint
- [ ] Implement /api/auth/session-check endpoint
- [ ] Create FlowDiagram component for Session flow
- [ ] Create InteractiveDemo for Session login
- [ ] Create pages/session-demo.tsx
- [ ] Add session security explanation & documentation

### 9.4 Phase 4: JWT Authentication (Sonnet)
- [ ] Implement JWT signing (lib/jwt.ts)
- [ ] Implement /api/auth/jwt-sign endpoint
- [ ] Implement /api/auth/jwt-verify endpoint
- [ ] Implement /api/auth/refresh-token endpoint
- [ ] Create TokenViewer component (decode JWT)
- [ ] Create FlowDiagram for JWT flow
- [ ] Create InteractiveDemo for JWT
- [ ] Create pages/jwt-demo.tsx
- [ ] Add JWT security explanation & documentation

### 9.5 Phase 5: OAuth 2.0 Visualization (Haiku)
- [ ] Create mock OAuth provider (lib/mock-oauth.ts)
- [ ] Create FlowDiagram for OAuth flow (animated)
- [ ] Create /api/auth/oauth/authorize endpoint (mock)
- [ ] Create /api/auth/oauth/callback endpoint (mock)
- [ ] Create pages/oauth-demo.tsx
- [ ] Add OAuth explanation & PKCE details

### 9.6 Phase 6: MFA/2FA (Sonnet)
- [ ] Setup speakeasy library for TOTP
- [ ] Implement /api/auth/mfa/setup endpoint
- [ ] Implement /api/auth/mfa/verify endpoint
- [ ] Create QR code generator component
- [ ] Create Authenticator simulator
- [ ] Create FlowDiagram for MFA flow
- [ ] Create pages/mfa-demo.tsx
- [ ] Add MFA explanation & security notes

### 9.7 Phase 7: Protected Routes & Dashboard (Haiku)
- [ ] Create /api/auth/protected-test endpoint
- [ ] Create pages/dashboard.tsx (protected)
- [ ] Implement middleware for route protection
- [ ] Add permission checking (role-based)

### 9.8 Phase 8: Learning Content & Documentation (Me)
- [ ] Add RFC references to each auth method
- [ ] Add security vulnerability explanations
- [ ] Add best practices sections
- [ ] Add real-world usage examples
- [ ] Add attack scenario explanations
- [ ] Add comparison tables (Session vs JWT vs OAuth)
- [ ] Create learning path (recommended order)

### 9.9 Phase 9: Testing & Refinement
- [ ] Test all login/logout flows
- [ ] Test token expiration & refresh
- [ ] Test protected routes
- [ ] Test MFA setup & verification
- [ ] Verify all visualizations are accurate
- [ ] Test error handling
- [ ] Test on different browsers

### 9.10 Phase 10: Deployment & Polish
- [ ] Add loading states & animations
- [ ] Improve error messages
- [ ] Add dark mode support
- [ ] Responsive design polish
- [ ] Performance optimization
- [ ] Deploy to Vercel

---

## 10. Learning Resources & References

### 10.1 RFCs & Standards
- **RFC 6265:** HTTP State Management Mechanism (Cookies)
- **RFC 7519:** JSON Web Token (JWT)
- **RFC 7518:** JSON Web Algorithms (JWA)
- **RFC 6749:** OAuth 2.0 Authorization Framework
- **RFC 7636:** PKCE (Proof Key for Public Clients)
- **RFC 6238:** TOTP (Time-based One-Time Password)
- **RFC 4226:** HOTP (HMAC-based One-Time Password)

### 10.2 Security Resources
- **OWASP Authentication Cheat Sheet:** https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- **OWASP Session Management:** https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- **OWASP Top 10:** https://owasp.org/www-project-top-ten/

### 10.3 Library Documentation
- **jsonwebtoken (npm):** https://www.npmjs.com/package/jsonwebtoken
- **bcryptjs (npm):** https://www.npmjs.com/package/bcryptjs
- **speakeasy (npm):** https://www.npmjs.com/package/speakeasy
- **Next.js Authentication:** https://nextjs.org/docs/authentication

### 10.4 Real-World Examples
- **Firebase Authentication:** https://firebase.google.com/docs/auth
- **Auth0 Docs:** https://auth0.com/docs
- **Passport.js:** http://www.passportjs.org/
- **NextAuth.js:** https://next-auth.js.org/

---

## 11. Environment Setup & Configuration

### 11.1 .env.local (Development)
```
# JWT Secret (for signing tokens)
JWT_SECRET=your_super_secret_key_min_32_chars

# Session Secret (for signing session cookies)
SESSION_SECRET=another_super_secret_key_min_32_chars

# MFA Issuer Name (for TOTP QR code)
MFA_ISSUER=Auth Learning Platform

# App URL (for callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 11.2 package.json Dependencies
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.1.0",
    "speakeasy": "^2.0.0",
    "qrcode": "^1.5.3"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/jsonwebtoken": "^9.0.0"
  }
}
```

---

## 12. Success Criteria

By the end of this project, you should be able to:

### 12.1 Knowledge
- [ ] Explain how sessions work (RFC 6265)
- [ ] Explain JWT structure and signature (RFC 7519)
- [ ] Explain OAuth 2.0 authorization code flow (RFC 6749)
- [ ] Explain TOTP-based 2FA (RFC 6238)
- [ ] Identify security vulnerabilities in each method
- [ ] Choose appropriate authentication method for use case

### 12.2 Skills
- [ ] Implement session-based authentication
- [ ] Implement JWT-based authentication with refresh tokens
- [ ] Visualize OAuth authorization flow
- [ ] Setup TOTP 2FA
- [ ] Create protected routes
- [ ] Handle authentication errors properly
- [ ] Use bcrypt for password hashing

### 12.3 Production Readiness
- [ ] Understand OWASP authentication top 10
- [ ] Apply security best practices
- [ ] Know when to use HTTPS (always)
- [ ] Know how to store tokens securely
- [ ] Know password hashing best practices
- [ ] Know how to prevent common attacks

### 12.4 Real-World Application
- [ ] Could implement auth in production app
- [ ] Could migrate between authentication methods
- [ ] Could evaluate third-party auth services (Auth0, Firebase)
- [ ] Could debug authentication issues in production

---

## 13. Future Enhancements (Out of Scope)

These features can be added after completing core learning:

1. **Real OAuth Integration**
   - Integrate actual Google/GitHub OAuth
   - Setup required: Client ID, Client Secret, Redirect URLs

2. **Advanced MFA**
   - WebAuthn/FIDO2 (hardware keys)
   - SMS-based 2FA
   - Email-based 2FA

3. **Advanced Security**
   - Rate limiting & brute force protection
   - Account lockout mechanisms
   - Anomaly detection
   - Geo-blocking

4. **Additional Auth Methods**
   - SAML 2.0 (enterprise)
   - mTLS (certificate-based)
   - Passwordless authentication (magic links)

5. **Database Integration**
   - Replace mock DB with real PostgreSQL/MongoDB
   - Implement migrations
   - Add query optimization

6. **Production Deployment**
   - Setup on Vercel/Railway/Heroku
   - Configure SSL/TLS
   - Setup logging & monitoring
   - Implement secrets management

---

## 14. Implementation Notes

### 14.1 Key Decisions Rationale

**Why in-memory mock DB?**
- ✅ Learning focus on auth logic, not database
- ✅ No external dependencies
- ✅ Fast development & testing
- ✅ Easy to inspect state for debugging
- ✅ Data resets on server restart (clean state for learning)

**Why Next.js full-stack?**
- ✅ Single language (TypeScript everywhere)
- ✅ No context switching
- ✅ Easier type sharing between FE & BE
- ✅ API routes built-in
- ✅ Simpler deployment

**Why in-memory visualization?**
- ✅ Understand flow visually, not just theory
- ✅ Interactive demos > static docs
- ✅ Can see request/response in real-time
- ✅ Helps retain knowledge

**Why RFC-based explanations?**
- ✅ Learn the standards, not just implementation
- ✅ Standards are stable across frameworks
- ✅ Understanding RFCs helps with production code
- ✅ Can apply knowledge anywhere

### 14.2 Common Pitfalls to Avoid

❌ **Storing passwords in plain text**
```typescript
// WRONG
user.password = "password123"

// CORRECT
user.passwordHash = bcrypt.hash("password123")
```

❌ **Trusting client-side authentication**
```typescript
// WRONG
const isAdmin = localStorage.getItem('role') === 'admin'

// CORRECT
const decoded = jwt.verify(token, SECRET)
const isAdmin = decoded.role === 'admin'
```

❌ **Storing JWT in localStorage (vulnerable to XSS)**
```typescript
// Less secure
localStorage.setItem('token', jwt)

// More secure
// Use HTTP-Only cookie (for prod)
// Note: localStorage used in this learning project for easy demoing
```

❌ **Not checking token expiration**
```typescript
// WRONG
jwt.verify(token, SECRET) // Might throw error

// CORRECT
try {
  jwt.verify(token, SECRET)
} catch (error) {
  if (error.name === 'TokenExpiredError') {
    // Handle refresh
  }
}
```

❌ **Sending secrets in response**
```typescript
// WRONG
return {
  user: user,
  databasePassword: 'secret'
}

// CORRECT
return {
  user: {
    id: user.id,
    username: user.username,
    email: user.email
  }
}
```

### 14.3 Testing the Implementation

**Manual Testing Checklist:**

1. **Session Auth:**
   - [ ] Login with valid credentials → Session created
   - [ ] Logout → Session deleted
   - [ ] Refresh page → Still logged in (session persists)
   - [ ] Wait for expiration → Auto logout
   - [ ] Try expired session → Get 401
   - [ ] Login with invalid creds → Get 401

2. **JWT Auth:**
   - [ ] Login → Get access + refresh token
   - [ ] Use access token → Works
   - [ ] Wait for expiration → Get 401
   - [ ] Use refresh token → Get new access token
   - [ ] Use old token → Get 401
   - [ ] Modify token → Get 401 (signature invalid)

3. **MFA:**
   - [ ] Setup TOTP → Get secret + QR code
   - [ ] Scan QR → Authenticator app shows codes
   - [ ] Enter correct code → Success
   - [ ] Enter wrong code → Failure
   - [ ] Use backup code → Works
   - [ ] Reuse backup code → Fails

4. **Protected Routes:**
   - [ ] Access /dashboard without auth → Redirect to login
   - [ ] Login → Access /dashboard → Works
   - [ ] Logout → Access /dashboard → Redirect to login

---

## 15. Success Metrics

### How to Know You've Learned Successfully:

**Can you explain:**
1. Why HTTP needs sessions/tokens? (Statelessness)
2. Session ID vs JWT token? (Trade-offs)
3. Why bcrypt over SHA? (Timing attacks)
4. HttpOnly cookie purpose? (XSS protection)
5. JWT signature purpose? (Integrity, not confidentiality)
6. Refresh token pattern? (Why 2 tokens)
7. OAuth purpose? (Authorization, not authentication)
8. TOTP setup? (Time-synchronized codes)

**Can you implement:**
1. Session login/logout flow
2. JWT generation with claims
3. JWT verification with expiration check
4. Refresh token exchange
5. Protected API endpoints
6. TOTP verification
7. Password hashing with bcrypt
8. Secure cookie attributes

**Can you identify:**
1. Session fixation vulnerability
2. XSS attack on localStorage
3. CSRF on unprotected endpoint
4. Token exposure in logs
5. Weak password hashing
6. Insufficient token expiration
7. Account enumeration via error messages
8. Missing HTTPS in production

---

## 16. Quick Reference

### Session vs JWT vs OAuth

```
┌─────────────┬──────────────────┬───────────────────┬──────────────────┐
│ Property    │ Session/Cookie   │ JWT               │ OAuth            │
├─────────────┼──────────────────┼───────────────────┼──────────────────┤
│ Stateless   │ ❌ (server store)│ ✅ (no storage)   │ ✅ (delegated)    │
│ Scalable    │ ❌ (session affin)│ ✅ (horizontal)   │ ✅               │
│ Revokable   │ ✅ (instant)     │ ❌ (wait expiry)  │ ✅               │
│ Mobile      │ ❌ (cookie based)│ ✅                │ ✅               │
│ CORS        │ ❌ (complex)     │ ✅                │ ✅               │
│ Learn curve │ 🟡 (medium)      │ 🟡 (medium)       │ 🔴 (hard)        │
│ Use case    │ Traditional web  │ SPAs, APIs, Mobile│ Multi-app, SSO   │
└─────────────┴──────────────────┴───────────────────┴──────────────────┘
```

### Authentication Methods Comparison

```
Attribute              Session        JWT           OAuth         SAML
─────────────────────────────────────────────────────────────────────
Standard              RFC 6265       RFC 7519      RFC 6749      OASIS
Protocol              Cookie-based   Token-based   Delegation    XML-based
Storage               Server-side    Client/Server Delegated     N/A
Revocation            Immediate      On expiry     Delegated     N/A
Token size            Small (ID)     Large (data)  Medium        Large
Performance           Fast           Very Fast     Moderate      Slow
Complexity            Simple         Medium        Complex       Complex
Mobile friendly       ❌             ✅            ✅            ❌
Microservices         ❌             ✅            ✅            ❌
Enterprise            ❌             ❌            ✅            ✅✅
```

### Password Hashing Comparison

```
Algorithm  Speed      Salt    Tunable  Parallelizable  Recommended
─────────────────────────────────────────────────────────────────
MD5        🚀🚀🚀      Auto    ❌       ❌              ❌ NEVER
SHA256     🚀🚀       Auto    ❌       ❌              ❌ NEVER
bcrypt     🐢         Auto    ✅       ❌              ✅ GOOD
scrypt     🐢🐢       Manual  ✅       ✅              ✅ GOOD
Argon2     🐢🐢🐢      Manual  ✅       ✅              ✅✅ BEST
```

---

## Appendix A: Sample Mock Users

For testing, pre-populated users:

```typescript
// Username: admin
// Password: admin123
// Email: admin@example.com
// Role: admin

// Username: user
// Password: user123
// Email: user@example.com
// Role: user

// Username: demo
// Password: demo123
// Email: demo@example.com
// Role: user
```

---

## Appendix B: Security Checklist for Production

Before deploying authentication to production:

- [ ] Use HTTPS only (no HTTP)
- [ ] Use bcrypt or Argon2 for passwords
- [ ] Implement rate limiting on login
- [ ] Implement account lockout
- [ ] Use strong JWT secret (min 256 bits)
- [ ] Set appropriate token expiration
- [ ] Use refresh token rotation
- [ ] Implement CSRF protection
- [ ] Use HttpOnly, Secure, SameSite cookies
- [ ] Implement audit logging
- [ ] Monitor for suspicious activity
- [ ] Implement password complexity requirements
- [ ] Implement MFA for sensitive operations
- [ ] Store secrets in environment variables
- [ ] Never log passwords or tokens
- [ ] Implement secure session timeout
- [ ] Use CORS appropriately
- [ ] Implement Content Security Policy (CSP)
- [ ] Regular security audits
- [ ] Keep dependencies updated

---

**Document Version:** 1.0  
**Last Updated:** October 18, 2025  
**Status:** Ready for Implementation  
**Next Step:** Phase 1 - Setup & Structure (Haiku)