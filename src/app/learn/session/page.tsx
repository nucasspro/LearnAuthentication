/**
 * Session-Based Authentication Learning Page
 * Comprehensive guide to session/cookie authentication
 * Reference: SPECIFICATION Section 4.1, RFC 6265
 */

'use client';

import { useRouter } from 'next/navigation';

export default function LearnSessionPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Session-Based Authentication
          </h1>
          <p className="text-xl text-gray-600">
            Learn how server-side sessions and HTTP cookies provide stateful authentication
          </p>
          <div className="mt-4 flex gap-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              RFC 6265
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
              Stateful
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              Server-Side
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* How It Works */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">How It Works</h2>

            <div className="space-y-4 text-gray-700">
              <p className="text-lg leading-relaxed">
                Session-based authentication stores user state on the <strong>server</strong>.
                When a user logs in, the server creates a session object in memory or database,
                assigns a unique session ID, and sends it to the client via a cookie.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6">
                <h3 className="font-bold text-blue-900 mb-3 text-lg">Authentication Flow</h3>
                <ol className="space-y-3 text-blue-800">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                    <div>
                      <strong>Client → Server:</strong> User submits username and password
                      <code className="block mt-1 text-xs bg-blue-100 p-2 rounded">
                        POST /api/auth/login {`{ username: "user", password: "pass" }`}
                      </code>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                    <div>
                      <strong>Server validates:</strong> Verifies credentials against database (bcrypt hash comparison)
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                    <div>
                      <strong>Server creates session:</strong> Generates random session ID (256 bits entropy)
                      <code className="block mt-1 text-xs bg-blue-100 p-2 rounded">
                        sessionId = crypto.randomBytes(32).toString(&apos;hex&apos;)
                      </code>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                    <div>
                      <strong>Server stores session:</strong> Saves {`{ userId, createdAt, expiresAt }`} in database/memory
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">5</span>
                    <div>
                      <strong>Server → Client:</strong> Sends session ID via Set-Cookie header
                      <code className="block mt-1 text-xs bg-blue-100 p-2 rounded">
                        Set-Cookie: SessionID=abc123; HttpOnly; Secure; SameSite=Strict
                      </code>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">6</span>
                    <div>
                      <strong>Browser stores cookie:</strong> Cookie automatically sent with subsequent requests
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">7</span>
                    <div>
                      <strong>Server validates:</strong> Looks up session ID in database on each request
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </section>

          {/* Cookie Security Attributes */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Cookie Security Attributes</h2>

            <div className="space-y-6">
              <div className="border-l-4 border-green-500 bg-green-50 p-6">
                <h3 className="text-xl font-bold text-green-900 mb-2">HttpOnly</h3>
                <p className="text-green-800 mb-2">
                  <strong>Purpose:</strong> Prevents JavaScript access to cookie (XSS protection)
                </p>
                <p className="text-sm text-green-700">
                  JavaScript cannot read cookie via <code>document.cookie</code>. Only the browser
                  and server can access it. Protects against Cross-Site Scripting (XSS) attacks.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 bg-blue-50 p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">Secure</h3>
                <p className="text-blue-800 mb-2">
                  <strong>Purpose:</strong> Cookie only sent over HTTPS connections
                </p>
                <p className="text-sm text-blue-700">
                  Prevents man-in-the-middle (MITM) attacks. Cookie won&apos;t be sent over
                  insecure HTTP. Exception: localhost (development).
                </p>
              </div>

              <div className="border-l-4 border-purple-500 bg-purple-50 p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-2">SameSite</h3>
                <p className="text-purple-800 mb-2">
                  <strong>Purpose:</strong> Prevents Cross-Site Request Forgery (CSRF)
                </p>
                <div className="text-sm text-purple-700 space-y-2">
                  <p><strong>Strict:</strong> Never sent in cross-site requests (most secure)</p>
                  <p><strong>Lax:</strong> Sent in top-level navigation (default in modern browsers)</p>
                  <p><strong>None:</strong> Always sent (requires Secure flag)</p>
                </div>
              </div>
            </div>
          </section>

          {/* Vulnerabilities */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Security Vulnerabilities & Mitigations</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">Vulnerability</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">Attack Vector</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">Mitigation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-semibold text-red-700">Session Fixation</td>
                    <td className="px-4 py-4 text-gray-700">
                      Attacker sets session ID before login, then hijacks after authentication
                    </td>
                    <td className="px-4 py-4 text-green-700">
                      <strong>Regenerate session ID</strong> after successful login
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-semibold text-red-700">CSRF</td>
                    <td className="px-4 py-4 text-gray-700">
                      Malicious site makes authenticated requests on behalf of user
                    </td>
                    <td className="px-4 py-4 text-green-700">
                      <strong>SameSite=Strict</strong> cookie attribute + CSRF tokens
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-semibold text-red-700">XSS Cookie Theft</td>
                    <td className="px-4 py-4 text-gray-700">
                      Injected JavaScript reads cookie and sends to attacker
                    </td>
                    <td className="px-4 py-4 text-green-700">
                      <strong>HttpOnly</strong> flag prevents JavaScript access
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-semibold text-red-700">Session Hijacking</td>
                    <td className="px-4 py-4 text-gray-700">
                      Attacker steals session ID via network sniffing
                    </td>
                    <td className="px-4 py-4 text-green-700">
                      <strong>Secure</strong> flag + HTTPS only + short expiration
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Real-World Usage */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Real-World Usage</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Django (Python)</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Uses session middleware with database-backed sessions
                </p>
                <code className="block bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
                  SESSION_ENGINE = &apos;django.contrib.sessions.backends.db&apos;
                </code>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Express (Node.js)</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Uses express-session with various stores (Redis, Memory, MongoDB)
                </p>
                <code className="block bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
                  app.use(session({`{ store: new RedisStore() }`}))
                </code>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Rails (Ruby)</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Cookie-based sessions encrypted with secret key base
                </p>
                <code className="block bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
                  config.session_store :cookie_store
                </code>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">ASP.NET Core</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Session state with distributed cache support
                </p>
                <code className="block bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
                  services.AddSession(options =&gt; ...)
                </code>
              </div>
            </div>
          </section>

          {/* Try It Out */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Try It Out</h2>
            <p className="text-lg mb-6 text-blue-100">
              Experience session-based authentication with our interactive demo
            </p>
            <button
              onClick={() => router.push('/session-demo')}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              Go to Session Demo →
            </button>
          </section>

          {/* Resources */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Further Reading</h2>
            <ul className="space-y-3">
              <li>
                <a href="https://datatracker.ietf.org/doc/html/rfc6265" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">
                  RFC 6265 - HTTP State Management Mechanism
                </a>
              </li>
              <li>
                <a href="https://owasp.org/www-community/attacks/Session_fixation" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">
                  OWASP - Session Fixation
                </a>
              </li>
              <li>
                <a href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">
                  OWASP - Session Management Cheat Sheet
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
