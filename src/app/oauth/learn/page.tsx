/**
 * OAuth 2.0 Learning Page
 * Comprehensive guide to authorization delegation
 * Reference: SPECIFICATION Section 4.3, RFC 6749
 */

'use client';

import { Button } from '@/components/shared';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LearnOAuthPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            OAuth 2.0
          </h1>
          <p className="text-xl text-gray-600">
            Learn how authorization delegation enables secure third-party access
          </p>
          <div className="mt-4 flex gap-3">
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
              RFC 6749
            </span>
            <span className="px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm font-semibold">
              Authorization
            </span>
            <span className="px-3 py-1 bg-fuchsia-100 text-fuchsia-800 rounded-full text-sm font-semibold">
              Delegation
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* What is OAuth */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What is OAuth 2.0?</h2>

            <div className="space-y-4 text-gray-700">
              <p className="text-lg leading-relaxed">
                OAuth 2.0 is an <strong>authorization</strong> framework that enables applications to obtain limited access to user accounts on an HTTP service. It allows users to grant third-party access to their resources <strong>without sharing passwords</strong>.
              </p>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 my-6">
                <h3 className="font-bold text-purple-900 mb-3 text-lg">Real-World Examples</h3>
                <ul className="space-y-2 text-purple-800">
                  <li className="flex gap-2">
                    <span className="text-purple-600">•</span>
                    <div>&quot;Sign in with Google&quot; - App accesses your Google profile</div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-600">•</span>
                    <div>&quot;Connect GitHub&quot; - CI/CD tool deploys from your repos</div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-600">•</span>
                    <div>&quot;Import Contacts&quot; - Email app reads your contact list</div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-purple-600">•</span>
                    <div>&quot;Post to Twitter&quot; - Scheduler tweets on your behalf</div>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-6">
                <h3 className="font-bold text-yellow-900 mb-3 text-lg">⚠️ Important: OAuth is NOT Authentication</h3>
                <p className="text-yellow-800 mb-2">
                  OAuth is designed for <strong>authorization</strong> (granting access), not <strong>authentication</strong> (proving identity). For authentication, use <strong>OpenID Connect</strong> (built on top of OAuth 2.0).
                </p>
                <p className="text-sm text-yellow-700">
                  Common misconception: Using OAuth access token as proof of identity. This is insecure without OpenID Connect&apos;s ID token.
                </p>
              </div>
            </div>
          </section>

          {/* OAuth vs Authentication */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">OAuth vs Authentication</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">Aspect</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">OAuth 2.0</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">Session/JWT Auth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-4 font-semibold">Purpose</td>
                    <td className="px-4 py-4 text-purple-700">Authorization (granting access)</td>
                    <td className="px-4 py-4 text-blue-700">Authentication (proving identity)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-4 font-semibold">Question Answered</td>
                    <td className="px-4 py-4">&quot;What can you do?&quot;</td>
                    <td className="px-4 py-4">&quot;Who are you?&quot;</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-4 font-semibold">Use Case</td>
                    <td className="px-4 py-4">Third-party app access</td>
                    <td className="px-4 py-4">Direct user login</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-4 font-semibold">Credentials</td>
                    <td className="px-4 py-4">User never shares password</td>
                    <td className="px-4 py-4">User enters password directly</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-4 font-semibold">Token Type</td>
                    <td className="px-4 py-4">Access token (for API calls)</td>
                    <td className="px-4 py-4">Session ID or JWT</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-900 text-sm">
                <strong>For Authentication:</strong> Use OpenID Connect (OIDC), which adds an ID token on top of OAuth 2.0. The ID token proves the user&apos;s identity, while the access token grants permissions.
              </p>
            </div>
          </section>

          {/* Authorization Code Flow */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Authorization Code Flow (Most Secure)</h2>

            <p className="text-gray-700 mb-6">
              The most common and secure OAuth flow, recommended for web applications with a backend.
            </p>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-6">
              <h3 className="font-bold text-purple-900 mb-3 text-lg">Step-by-Step Flow</h3>
              <ol className="space-y-4 text-purple-800">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                  <div>
                    <strong>User clicks &quot;Login with Provider&quot;</strong>
                    <p className="text-sm mt-1">App redirects to OAuth provider&apos;s authorization page</p>
                    <code className="block mt-1 text-xs bg-purple-100 p-2 rounded">
                      {`https://oauth.provider.com/authorize?\n  client_id=abc123&\n  redirect_uri=https://yourapp.com/callback&\n  response_type=code&\n  scope=email profile&\n  state=random_csrf_token`}
                    </code>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                  <div>
                    <strong>User sees consent screen</strong>
                    <p className="text-sm mt-1">&quot;YourApp wants to access your email and profile. Allow?&quot;</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                  <div>
                    <strong>User grants permission</strong>
                    <p className="text-sm mt-1">Clicks &quot;Allow&quot; on provider&apos;s page</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                  <div>
                    <strong>Provider redirects with authorization code</strong>
                    <p className="text-sm mt-1">User sent back to your app with one-time code</p>
                    <code className="block mt-1 text-xs bg-purple-100 p-2 rounded">
                      {`https://yourapp.com/callback?\n  code=AUTHORIZATION_CODE&\n  state=random_csrf_token`}
                    </code>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">5</span>
                  <div>
                    <strong>Backend exchanges code for access token</strong>
                    <p className="text-sm mt-1">Server-side request includes client_secret (NEVER exposed to browser)</p>
                    <code className="block mt-1 text-xs bg-purple-100 p-2 rounded">
                      {`POST https://oauth.provider.com/token\nBody: {\n  grant_type: "authorization_code",\n  code: "AUTHORIZATION_CODE",\n  client_id: "abc123",\n  client_secret: "SECRET",\n  redirect_uri: "https://yourapp.com/callback"\n}`}
                    </code>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">6</span>
                  <div>
                    <strong>Your app creates session/JWT</strong>
                    <p className="text-sm mt-1">Use access token to get user info, then create your own session</p>
                    <code className="block mt-1 text-xs bg-purple-100 p-2 rounded">
                      {`// Get user profile from OAuth provider\nconst profile = await fetch('https://api.provider.com/me', {\n  headers: { Authorization: 'Bearer ' + accessToken }\n});\n\n// Create your own session\nconst session = createSession(profile.userId);`}
                    </code>
                  </div>
                </li>
              </ol>
            </div>

            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-900 text-sm">
                <strong>Why this is secure:</strong> The authorization code can only be exchanged once, and the exchange happens server-side with client_secret. Even if the code is intercepted, attacker can&apos;t use it without the secret.
              </p>
            </div>
          </section>

          {/* OAuth Players */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">The Four OAuth Players</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-blue-500 bg-blue-50 p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">1. Resource Owner</h3>
                <p className="text-blue-800 text-sm mb-2">
                  <strong>Who:</strong> The user (person)
                </p>
                <p className="text-blue-700 text-sm">
                  The person who owns the data and can grant access to it. They decide what permissions to give.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 bg-purple-50 p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-2">2. Authorization Server</h3>
                <p className="text-purple-800 text-sm mb-2">
                  <strong>Who:</strong> OAuth provider (Google, GitHub, etc.)
                </p>
                <p className="text-purple-700 text-sm">
                  Authenticates the user, shows consent screen, issues access tokens. Endpoints: /authorize and /token.
                </p>
              </div>

              <div className="border-l-4 border-green-500 bg-green-50 p-6">
                <h3 className="text-xl font-bold text-green-900 mb-2">3. Resource Server</h3>
                <p className="text-green-800 text-sm mb-2">
                  <strong>Who:</strong> API server with user data
                </p>
                <p className="text-green-700 text-sm">
                  Hosts the protected resources (user data). Validates access tokens and returns data if token is valid.
                </p>
              </div>

              <div className="border-l-4 border-orange-500 bg-orange-50 p-6">
                <h3 className="text-xl font-bold text-orange-900 mb-2">4. Client</h3>
                <p className="text-orange-800 text-sm mb-2">
                  <strong>Who:</strong> Your application
                </p>
                <p className="text-orange-700 text-sm">
                  The app requesting access to user data. Initiates OAuth flow, receives tokens, makes API calls.
                </p>
              </div>
            </div>
          </section>

          {/* PKCE */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">PKCE (RFC 7636) - For Public Clients</h2>

            <p className="text-gray-700 mb-6">
              PKCE (Proof Key for Code Exchange) is an extension to OAuth 2.0 that prevents authorization code interception attacks. <strong>Required for mobile apps and SPAs</strong> where client_secret can&apos;t be kept secure.
            </p>

            <div className="bg-violet-50 border-l-4 border-violet-500 p-6 mb-6">
              <h3 className="font-bold text-violet-900 mb-3 text-lg">Why PKCE?</h3>
              <p className="text-violet-800 mb-2">
                Public clients (mobile apps, SPAs) can&apos;t keep client_secret safe because:
              </p>
              <ul className="text-violet-700 text-sm space-y-1">
                <li>• Anyone can decompile a mobile app</li>
                <li>• Browser JavaScript is visible to users</li>
                <li>• Malicious apps can intercept authorization code</li>
              </ul>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-6">
              <h3 className="font-bold text-purple-900 mb-3 text-lg">PKCE Flow</h3>
              <ol className="space-y-3 text-purple-800 text-sm">
                <li>
                  <strong>1. App generates code_verifier:</strong> Random 43-128 character string
                  <code className="block mt-1 text-xs bg-purple-100 p-2 rounded">
                    code_verifier = random_string(64)
                  </code>
                </li>
                <li>
                  <strong>2. App creates code_challenge:</strong> SHA256 hash of verifier
                  <code className="block mt-1 text-xs bg-purple-100 p-2 rounded">
                    code_challenge = base64url(sha256(code_verifier))
                  </code>
                </li>
                <li>
                  <strong>3. App sends code_challenge in /authorize:</strong>
                  <code className="block mt-1 text-xs bg-purple-100 p-2 rounded">
                    {`/authorize?...&code_challenge=CHALLENGE&code_challenge_method=S256`}
                  </code>
                </li>
                <li>
                  <strong>4. Provider returns authorization code</strong>
                </li>
                <li>
                  <strong>5. App sends code + code_verifier to /token:</strong>
                  <code className="block mt-1 text-xs bg-purple-100 p-2 rounded">
                    {`POST /token\nBody: { code, code_verifier, ... }`}
                  </code>
                </li>
                <li>
                  <strong>6. Provider verifies:</strong> sha256(code_verifier) === code_challenge
                </li>
              </ol>
            </div>

            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-900 text-sm">
                <strong>Security:</strong> Even if authorization code is intercepted, attacker can&apos;t exchange it without the original code_verifier (which never leaves the app).
              </p>
            </div>
          </section>

          {/* Token Types */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Token Types</h2>

            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 bg-blue-50 p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">Access Token</h3>
                <ul className="text-blue-800 space-y-2 text-sm">
                  <li>✓ <strong>Purpose:</strong> Make API calls to resource server</li>
                  <li>✓ <strong>Lifetime:</strong> Short (1 hour typical)</li>
                  <li>✓ <strong>Format:</strong> Opaque string or JWT</li>
                  <li>✓ <strong>Usage:</strong> <code className="bg-blue-100 px-1">Authorization: Bearer ACCESS_TOKEN</code></li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 bg-purple-50 p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-2">Refresh Token</h3>
                <ul className="text-purple-800 space-y-2 text-sm">
                  <li>✓ <strong>Purpose:</strong> Get new access token when it expires</li>
                  <li>✓ <strong>Lifetime:</strong> Long (90 days typical, or until revoked)</li>
                  <li>✓ <strong>Format:</strong> Opaque string</li>
                  <li>✓ <strong>Security:</strong> Can be revoked in database</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 bg-green-50 p-6">
                <h3 className="text-xl font-bold text-green-900 mb-2">ID Token (OpenID Connect Only)</h3>
                <ul className="text-green-800 space-y-2 text-sm">
                  <li>✓ <strong>Purpose:</strong> Proves user identity (authentication)</li>
                  <li>✓ <strong>Format:</strong> Always JWT</li>
                  <li>✓ <strong>Contents:</strong> User info (name, email, etc.)</li>
                  <li>✓ <strong>Verification:</strong> Signature must be validated</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Security Considerations */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Security Considerations</h2>

            <div className="space-y-6">
              <div className="border-l-4 border-red-500 bg-red-50 p-6">
                <h3 className="text-xl font-bold text-red-900 mb-2">🔒 HTTPS Requirement</h3>
                <p className="text-red-800 text-sm">
                  OAuth MUST use HTTPS in production. Authorization codes and tokens sent over HTTP can be intercepted.
                </p>
              </div>

              <div className="border-l-4 border-orange-500 bg-orange-50 p-6">
                <h3 className="text-xl font-bold text-orange-900 mb-2">🔗 Redirect URI Validation</h3>
                <p className="text-orange-800 text-sm mb-2">
                  Provider must verify redirect_uri exactly matches registered URI. Otherwise, attacker can receive authorization code.
                </p>
                <code className="block text-xs bg-orange-100 p-2 rounded">
                  {`// BAD: Only check domain\nif (redirectUri.includes('yourapp.com')) // ❌\n\n// GOOD: Exact match\nif (redirectUri === 'https://yourapp.com/callback') // ✓`}
                </code>
              </div>

              <div className="border-l-4 border-purple-500 bg-purple-50 p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-2">🛡️ State Parameter (CSRF Protection)</h3>
                <p className="text-purple-800 text-sm mb-2">
                  ALWAYS use state parameter to prevent Cross-Site Request Forgery:
                </p>
                <ol className="text-purple-700 text-sm space-y-1">
                  <li>1. Generate random state value before redirect</li>
                  <li>2. Store in session/cookie</li>
                  <li>3. Send in authorize URL</li>
                  <li>4. Verify state matches on callback</li>
                </ol>
              </div>

              <div className="border-l-4 border-blue-500 bg-blue-50 p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">🔐 Scope Limitation</h3>
                <p className="text-blue-800 text-sm">
                  Request minimum necessary permissions. Users are more likely to approve limited scopes.
                </p>
                <code className="block mt-2 text-xs bg-blue-100 p-2 rounded">
                  {`// Request only what you need\nscope: "email profile" // Good\nscope: "email profile contacts calendar drive" // Too broad`}
                </code>
              </div>

              <div className="border-l-4 border-green-500 bg-green-50 p-6">
                <h3 className="text-xl font-bold text-green-900 mb-2">💾 Token Storage</h3>
                <div className="text-green-800 text-sm space-y-2">
                  <p><strong>Best:</strong> Server-side session (never expose to browser)</p>
                  <p><strong>Good:</strong> HTTP-only cookie (for refresh token)</p>
                  <p><strong>Acceptable:</strong> Memory only (lost on page refresh)</p>
                  <p><strong>Risky:</strong> localStorage (vulnerable to XSS)</p>
                </div>
              </div>

              <div className="border-l-4 border-red-600 bg-red-50 p-6">
                <h3 className="text-xl font-bold text-red-900 mb-2">⚠️ NEVER Expose client_secret</h3>
                <p className="text-red-800 text-sm">
                  client_secret must NEVER be in browser code, mobile apps, or version control. Use PKCE for public clients instead.
                </p>
              </div>
            </div>
          </section>

          {/* Common Mistakes */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Common Mistakes</h2>

            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-red-600 text-2xl">❌</span>
                <div>
                  <strong className="text-gray-900">Storing client_secret in frontend</strong>
                  <p className="text-sm text-gray-600">Anyone can view source code. Use PKCE or backend proxy instead.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-red-600 text-2xl">❌</span>
                <div>
                  <strong className="text-gray-900">Using deprecated implicit flow</strong>
                  <p className="text-sm text-gray-600">Implicit flow returns tokens in URL (visible in browser history). Use authorization code + PKCE.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-red-600 text-2xl">❌</span>
                <div>
                  <strong className="text-gray-900">Skipping state parameter</strong>
                  <p className="text-sm text-gray-600">Vulnerable to CSRF attacks. Always generate and validate state.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-red-600 text-2xl">❌</span>
                <div>
                  <strong className="text-gray-900">Accepting any redirect_uri</strong>
                  <p className="text-sm text-gray-600">Attacker can steal authorization code. Validate exact match.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-red-600 text-2xl">❌</span>
                <div>
                  <strong className="text-gray-900">Storing tokens in localStorage</strong>
                  <p className="text-sm text-gray-600">Vulnerable to XSS. Use HTTP-only cookies or server-side storage.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-red-600 text-2xl">❌</span>
                <div>
                  <strong className="text-gray-900">Not validating token issuer</strong>
                  <p className="text-sm text-gray-600">Verify iss claim matches expected provider to prevent token substitution.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Real-World Providers */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Real-World OAuth Providers</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🔷 Google OAuth</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Credentials: Google Cloud Console
                </p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Scopes:</strong> email, profile, openid</p>
                  <p><strong>Authorize:</strong> accounts.google.com/o/oauth2/v2/auth</p>
                  <p><strong>Token:</strong> oauth2.googleapis.com/token</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🐙 GitHub OAuth</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Credentials: GitHub Settings → Developer settings
                </p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Scopes:</strong> user:email, read:user, repo</p>
                  <p><strong>Authorize:</strong> github.com/login/oauth/authorize</p>
                  <p><strong>Token:</strong> github.com/login/oauth/access_token</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🔐 Auth0</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Managed authentication service (handles OAuth complexity)
                </p>
                <div className="text-xs text-gray-600">
                  <p>Supports: Google, GitHub, Facebook, Microsoft, custom providers</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🏢 Okta</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Enterprise identity provider with OAuth 2.0 support
                </p>
                <div className="text-xs text-gray-600">
                  <p>Features: SSO, MFA, user management, SAML + OAuth</p>
                </div>
              </div>
            </div>
          </section>

          {/* When to Use OAuth */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">When to Use OAuth</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 border-l-4 border-green-500 p-6">
                <h3 className="font-bold text-green-900 mb-3">✓ Good Use Cases</h3>
                <ul className="text-green-800 space-y-2 text-sm">
                  <li>• Login with Google/GitHub/etc</li>
                  <li>• Third-party app accessing user data</li>
                  <li>• API access delegation</li>
                  <li>• Social login (&quot;Sign in with...&quot;)</li>
                  <li>• Federated authentication across organizations</li>
                  <li>• Microservices with shared identity provider</li>
                </ul>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-6">
                <h3 className="font-bold text-red-900 mb-3">✗ Not Ideal For</h3>
                <ul className="text-red-800 space-y-2 text-sm">
                  <li>• Simple username/password login (use session/JWT)</li>
                  <li>• First-party authentication only (no third parties)</li>
                  <li>• Mobile app with backend you control (use JWT)</li>
                  <li>• Server-to-server auth (use API keys or mutual TLS)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Try It Out */}
          <section className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl shadow-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Try It Out</h2>
            <p className="text-lg mb-6 text-purple-100">
              Experience OAuth 2.0 authorization flow with our interactive demo
            </p>
            <button
              onClick={() => router.push('/oauth/demo')}
              className="px-8 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg hover:bg-purple-50 transition-colors shadow-lg"
            >
              Go to OAuth Demo →
            </button>
          </section>

          {/* Resources */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Further Reading</h2>
            <ul className="space-y-3">
              <li>
                <a href="https://datatracker.ietf.org/doc/html/rfc6749" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-semibold">
                  RFC 6749 - OAuth 2.0 Authorization Framework
                </a>
              </li>
              <li>
                <a href="https://datatracker.ietf.org/doc/html/rfc7636" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-semibold">
                  RFC 7636 - PKCE (Proof Key for Code Exchange)
                </a>
              </li>
              <li>
                <a href="https://openid.net/connect/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-semibold">
                  OpenID Connect Specifications
                </a>
              </li>
              <li>
                <a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#oauth-20" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-semibold">
                  OWASP - OAuth 2.0 Security Best Practices
                </a>
              </li>
              <li>
                <a href="https://oauth.net/2/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline font-semibold">
                  OAuth 2.0 - Official Site
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
