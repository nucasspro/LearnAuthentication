/**
 * JWT (JSON Web Token) Learning Page
 * Comprehensive guide to stateless authentication
 * Reference: SPECIFICATION Section 4.2, RFC 7519
 */

'use client';

import { Button } from '@/components/shared';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LearnJWTPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4">
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
            JWT (JSON Web Token)
          </h1>
          <p className="text-xl text-gray-600">
            Learn how stateless authentication works with cryptographically signed tokens
          </p>
          <div className="mt-4 flex gap-3">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              RFC 7519
            </span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">
              Stateless
            </span>
            <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-semibold">
              Scalable
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* What is JWT */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What is JWT?</h2>

            <div className="space-y-4 text-gray-700">
              <p className="text-lg leading-relaxed">
                A JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties. Unlike sessions, JWTs are <strong>stateless</strong> - all user information is encoded in the token itself.
              </p>

              <div className="bg-green-50 border-l-4 border-green-500 p-6 my-6">
                <h3 className="font-bold text-green-900 mb-3 text-lg">Key Differences from Sessions</h3>
                <ul className="space-y-2 text-green-800">
                  <li className="flex gap-2">
                    <span className="text-green-600">✓</span>
                    <div><strong>Stateless:</strong> Server doesn&apos;t store session data (no database lookups)</div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600">✓</span>
                    <div><strong>Scalable:</strong> Perfect for microservices and distributed systems</div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600">✓</span>
                    <div><strong>Cross-domain:</strong> Works across different domains and APIs</div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600">✓</span>
                    <div><strong>Mobile-friendly:</strong> No cookies needed (use Authorization header)</div>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 my-6">
                <h3 className="font-bold text-amber-900 mb-3 text-lg">When NOT to Use JWT</h3>
                <ul className="space-y-2 text-amber-800">
                  <li className="flex gap-2">
                    <span className="text-amber-600">⚠</span>
                    <div>Sensitive data in payload (JWTs are Base64, not encrypted)</div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-600">⚠</span>
                    <div>Need immediate revocation (tokens valid until expiration)</div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-600">⚠</span>
                    <div>Large amount of user data (increases token size)</div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-600">⚠</span>
                    <div>Traditional server-rendered apps (sessions may be simpler)</div>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* JWT Structure */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">JWT Structure (RFC 7519)</h2>

            <p className="text-gray-700 mb-6">
              A JWT consists of three Base64URL-encoded parts separated by dots:
            </p>

            <div className="bg-gray-900 text-green-400 p-6 rounded-lg mb-6 overflow-x-auto">
              <code className="block bg-gray-900 text-sm">
                <span className="text-red-400">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</span>
                <span className="text-white">.</span>
                <span className="text-blue-400">eyJzdWIiOiIxMjM0IiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIn0</span>
                <span className="text-white">.</span>
                <span className="text-purple-400">SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</span>
              </code>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-red-500 bg-red-50 p-6">
                <h3 className="text-xl font-bold text-red-900 mb-2">1. Header (Algorithm & Type)</h3>
                <p className="text-red-800 mb-3">
                  Specifies the signing algorithm and token type
                </p>
                <code className="block bg-gray-900 text-red-400 p-3 rounded text-sm">
                  {`{\n  "alg": "HS256",\n  "typ": "JWT"\n}`}
                </code>
              </div>

              <div className="border-l-4 border-blue-500 bg-blue-50 p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">2. Payload (Claims)</h3>
                <p className="text-blue-800 mb-3">
                  Contains the user data and metadata (claims)
                </p>
                <code className="block bg-gray-900 text-blue-400 p-3 rounded text-sm">
                  {`{\n  "sub": "1234",\n  "email": "user@example.com",\n  "role": "admin",\n  "iat": 1516239022,\n  "exp": 1516242622\n}`}
                </code>
              </div>

              <div className="border-l-4 border-purple-500 bg-purple-50 p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-2">3. Signature (Verification)</h3>
                <p className="text-purple-800 mb-3">
                  Cryptographic signature to verify token integrity
                </p>
                <code className="block bg-gray-900 text-purple-400 p-3 rounded text-sm">
                  {`HMACSHA256(\n  base64UrlEncode(header) + "." +\n  base64UrlEncode(payload),\n  secret\n)`}
                </code>
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-900 text-sm">
                <strong>Important:</strong> JWTs are <strong>encoded</strong> (Base64URL), not <strong>encrypted</strong>. Anyone can decode and read the payload. Never store passwords or sensitive data in JWTs!
              </p>
            </div>
          </section>

          {/* How JWT Works */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">How JWT Works (Flow)</h2>

            <div className="bg-green-50 border-l-4 border-green-500 p-6">
              <h3 className="font-bold text-green-900 mb-3 text-lg">Authentication Flow</h3>
              <ol className="space-y-3 text-green-800">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                  <div>
                    <strong>Client → Server:</strong> User submits username and password
                    <code className="block mt-1 text-xs bg-green-100 p-2 rounded">
                      POST /api/auth/jwt-sign {`{ username: "user", password: "pass" }`}
                    </code>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                  <div>
                    <strong>Server validates:</strong> Verifies credentials against database
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                  <div>
                    <strong>Server creates JWT:</strong> Builds payload with user claims
                    <code className="block mt-1 text-xs bg-green-100 p-2 rounded">
                      {`payload = { sub: userId, email, role, exp: Date.now() + 15min }`}
                    </code>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                  <div>
                    <strong>Server signs JWT:</strong> Uses secret key to create signature
                    <code className="block mt-1 text-xs bg-green-100 p-2 rounded">
                      jwt.sign(payload, SECRET_KEY, {`{ algorithm: 'HS256' }`})
                    </code>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">5</span>
                  <div>
                    <strong>Server → Client:</strong> Returns JWT in response body
                    <code className="block mt-1 text-xs bg-green-100 p-2 rounded">
                      {`{ accessToken: "eyJhbG...", expiresIn: 900 }`}
                    </code>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">6</span>
                  <div>
                    <strong>Client stores token:</strong> Typically in localStorage or memory
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">7</span>
                  <div>
                    <strong>Client sends token:</strong> In Authorization header on subsequent requests
                    <code className="block mt-1 text-xs bg-green-100 p-2 rounded">
                      Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                    </code>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">8</span>
                  <div>
                    <strong>Server verifies:</strong> Checks signature and expiration (no database lookup!)
                  </div>
                </li>
              </ol>
            </div>
          </section>

          {/* JWT Claims */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">JWT Claims (Payload)</h2>

            <p className="text-gray-700 mb-6">
              Claims are statements about an entity (user) and additional metadata. There are three types:
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Standard Claims (Registered)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left font-bold">Claim</th>
                        <th className="px-4 py-3 text-left font-bold">Name</th>
                        <th className="px-4 py-3 text-left font-bold">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 font-mono text-blue-600">sub</td>
                        <td className="px-4 py-3">Subject</td>
                        <td className="px-4 py-3">User ID (primary identifier)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-mono text-blue-600">iat</td>
                        <td className="px-4 py-3">Issued At</td>
                        <td className="px-4 py-3">Timestamp when token was created</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-mono text-blue-600">exp</td>
                        <td className="px-4 py-3">Expiration</td>
                        <td className="px-4 py-3">When token becomes invalid</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-mono text-blue-600">iss</td>
                        <td className="px-4 py-3">Issuer</td>
                        <td className="px-4 py-3">Who created the token</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-mono text-blue-600">aud</td>
                        <td className="px-4 py-3">Audience</td>
                        <td className="px-4 py-3">Who the token is intended for</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-mono text-blue-600">jti</td>
                        <td className="px-4 py-3">JWT ID</td>
                        <td className="px-4 py-3">Unique identifier (for blacklisting)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Claims (Application-specific)</h3>
                <p className="text-gray-700 mb-3">
                  Add your own claims for application data:
                </p>
                <code className="block bg-gray-900 text-green-400 p-4 rounded text-sm">
                  {`{\n  "sub": "1234",\n  "email": "user@example.com",\n  "role": "admin",\n  "permissions": ["read", "write"],\n  "organization": "acme-corp"\n}`}
                </code>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-bold text-red-900 mb-2">⚠️ What NOT to Put in Payload</h3>
                <ul className="text-red-800 text-sm space-y-1">
                  <li>❌ Passwords or password hashes</li>
                  <li>❌ Social security numbers</li>
                  <li>❌ Credit card information</li>
                  <li>❌ API keys or secrets</li>
                  <li>❌ Large binary data (images, files)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Refresh Token Pattern */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Refresh Token Pattern</h2>

            <p className="text-gray-700 mb-6">
              Best practice: Use TWO tokens for enhanced security and user experience.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="border-l-4 border-blue-500 bg-blue-50 p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">Access Token</h3>
                <ul className="text-blue-800 space-y-2 text-sm">
                  <li>✓ <strong>Short-lived:</strong> 15 minutes</li>
                  <li>✓ <strong>Purpose:</strong> API access</li>
                  <li>✓ <strong>Storage:</strong> Memory or localStorage</li>
                  <li>✓ <strong>Usage:</strong> Every API request</li>
                  <li>✓ <strong>Risk:</strong> Limited damage if stolen</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 bg-purple-50 p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-2">Refresh Token</h3>
                <ul className="text-purple-800 space-y-2 text-sm">
                  <li>✓ <strong>Long-lived:</strong> 7 days</li>
                  <li>✓ <strong>Purpose:</strong> Get new access token</li>
                  <li>✓ <strong>Storage:</strong> HTTP-only cookie</li>
                  <li>✓ <strong>Usage:</strong> Only when access token expires</li>
                  <li>✓ <strong>Security:</strong> Can be revoked in database</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6">
              <h3 className="font-bold text-green-900 mb-3 text-lg">Refresh Flow</h3>
              <ol className="space-y-2 text-green-800">
                <li>1. Access token expires (15 min)</li>
                <li>2. Client sends refresh token to <code className="bg-green-100 px-2 py-1 rounded">/api/auth/refresh-token</code></li>
                <li>3. Server validates refresh token</li>
                <li>4. Server issues NEW access token (and optionally new refresh token)</li>
                <li>5. Client continues with new access token</li>
              </ol>
            </div>

            <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-emerald-900 text-sm">
                <strong>Benefits:</strong> User stays logged in for 7 days, but if access token is stolen, damage is limited to 15 minutes. Refresh tokens can be revoked in database for immediate logout.
              </p>
            </div>
          </section>

          {/* Security Features */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Security Features</h2>

            <div className="space-y-6">
              <div className="border-l-4 border-green-500 bg-green-50 p-6">
                <h3 className="text-xl font-bold text-green-900 mb-2">Signature Verification</h3>
                <p className="text-green-800 mb-2">
                  Every JWT must be verified before trust
                </p>
                <code className="block bg-gray-900 text-green-400 p-3 rounded text-sm">
                  {`// ALWAYS verify signature\nconst decoded = jwt.verify(token, SECRET_KEY);`}
                </code>
              </div>

              <div className="border-l-4 border-blue-500 bg-blue-50 p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">Expiration Checking</h3>
                <p className="text-blue-800 mb-2">
                  Tokens must have an expiration time
                </p>
                <code className="block bg-gray-900 text-blue-400 p-3 rounded text-sm">
                  {`// Set expiration (15 minutes)\njwt.sign(payload, secret, { expiresIn: '15m' })`}
                </code>
              </div>

              <div className="border-l-4 border-purple-500 bg-purple-50 p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-2">HTTPS Requirement</h3>
                <p className="text-purple-800">
                  ALWAYS use HTTPS in production. JWTs in Authorization headers can be intercepted over HTTP.
                </p>
              </div>

              <div className="border-l-4 border-orange-500 bg-orange-50 p-6">
                <h3 className="text-xl font-bold text-orange-900 mb-2">Token Storage</h3>
                <div className="text-orange-800 space-y-2 text-sm">
                  <p><strong>Best:</strong> HTTP-only cookies (prevents XSS)</p>
                  <p><strong>Good:</strong> Memory only (lost on refresh)</p>
                  <p><strong>Acceptable:</strong> localStorage (vulnerable to XSS)</p>
                  <p><strong>Never:</strong> URL parameters, sessionStorage with sensitive data</p>
                </div>
              </div>
            </div>
          </section>

          {/* Vulnerabilities */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Common Vulnerabilities & Mitigations</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">Vulnerability</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">Risk</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">Mitigation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-semibold text-red-700">Token Theft</td>
                    <td className="px-4 py-4 text-gray-700">
                      XSS attack steals token from localStorage
                    </td>
                    <td className="px-4 py-4 text-green-700">
                      Short expiration (15 min) + HTTP-only cookies + HTTPS
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-semibold text-red-700">Algorithm Confusion</td>
                    <td className="px-4 py-4 text-gray-700">
                      Attacker changes alg to &quot;none&quot; to bypass signature
                    </td>
                    <td className="px-4 py-4 text-green-700">
                      Explicitly verify algorithm: <code className="bg-green-100 px-1">alg === &apos;HS256&apos;</code>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-semibold text-red-700">Secret Key Leakage</td>
                    <td className="px-4 py-4 text-gray-700">
                      Attacker gets secret key and forges tokens
                    </td>
                    <td className="px-4 py-4 text-green-700">
                      Strong key (256+ bits) + rotate keys + never commit to git
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-semibold text-red-700">Token Reuse</td>
                    <td className="px-4 py-4 text-gray-700">
                      Stolen token used for replay attacks
                    </td>
                    <td className="px-4 py-4 text-green-700">
                      Add jti claim + blacklist + short expiration
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-semibold text-red-700">Long Expiration</td>
                    <td className="px-4 py-4 text-gray-700">
                      Compromised token valid for days/weeks
                    </td>
                    <td className="px-4 py-4 text-green-700">
                      Access token: 15 min max + refresh token pattern
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Real-World Use Cases */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Real-World Use Cases</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">📱 Mobile Apps</h3>
                <p className="text-gray-700 text-sm">
                  iOS and Android apps can&apos;t use cookies reliably. JWTs in Authorization header work perfectly.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">⚛️ Single Page Apps (SPAs)</h3>
                <p className="text-gray-700 text-sm">
                  React, Vue, Angular apps making API calls. JWT in Authorization header, refresh token in HTTP-only cookie.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🔗 Microservices</h3>
                <p className="text-gray-700 text-sm">
                  Each service can verify JWT independently without database lookup. No shared session storage needed.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🌐 Cross-Domain Auth</h3>
                <p className="text-gray-700 text-sm">
                  API at api.example.com authenticates users from app.example.com and mobile.example.com.
                </p>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6">
              <h3 className="font-bold text-blue-900 mb-3">When to Choose JWT vs Session</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-bold text-blue-900 mb-2">Choose JWT when:</p>
                  <ul className="text-blue-800 space-y-1">
                    <li>✓ Building mobile apps</li>
                    <li>✓ Microservices architecture</li>
                    <li>✓ Need cross-domain auth</li>
                    <li>✓ Stateless scalability required</li>
                  </ul>
                </div>
                <div>
                  <p className="font-bold text-blue-900 mb-2">Choose Sessions when:</p>
                  <ul className="text-blue-800 space-y-1">
                    <li>✓ Traditional web app</li>
                    <li>✓ Need immediate revocation</li>
                    <li>✓ Simpler infrastructure</li>
                    <li>✓ Same-domain only</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Best Practices</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong>Always verify signature</strong>
                    <p className="text-sm text-gray-600">Never trust token without verification</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong>Always check expiration</strong>
                    <p className="text-sm text-gray-600">Reject expired tokens immediately</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong>Use HTTPS only</strong>
                    <p className="text-sm text-gray-600">Prevent man-in-the-middle attacks</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong>Don&apos;t store secrets in token</strong>
                    <p className="text-sm text-gray-600">JWTs are encoded, not encrypted</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong>Implement token rotation</strong>
                    <p className="text-sm text-gray-600">Refresh tokens should rotate on use</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong>Use strong keys (256+ bits)</strong>
                    <p className="text-sm text-gray-600">Minimum 32 random characters</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong>Set short expiration</strong>
                    <p className="text-sm text-gray-600">Access: 15 min, Refresh: 7 days max</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong>Validate algorithm explicitly</strong>
                    <p className="text-sm text-gray-600">Prevent algorithm confusion attacks</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Try It Out */}
          <section className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Try It Out</h2>
            <p className="text-lg mb-6 text-green-100">
              Experience JWT authentication with our interactive demo
            </p>
            <button
              onClick={() => router.push('/jwt/demo')}
              className="px-8 py-4 bg-white text-green-600 rounded-lg font-bold text-lg hover:bg-green-50 transition-colors shadow-lg"
            >
              Go to JWT Demo →
            </button>
          </section>

          {/* Resources */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Further Reading</h2>
            <ul className="space-y-3">
              <li>
                <a href="https://datatracker.ietf.org/doc/html/rfc7519" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline font-semibold">
                  RFC 7519 - JSON Web Token (JWT)
                </a>
              </li>
              <li>
                <a href="https://datatracker.ietf.org/doc/html/rfc7518" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline font-semibold">
                  RFC 7518 - JSON Web Algorithms (JWA)
                </a>
              </li>
              <li>
                <a href="https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline font-semibold">
                  OWASP - JWT Cheat Sheet
                </a>
              </li>
              <li>
                <a href="https://jwt.io" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline font-semibold">
                  JWT.io - Token Debugger
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
