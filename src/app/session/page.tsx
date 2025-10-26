/**
 * Session-Based Authentication - Learn & Demo (Merged)
 * Sticky sidebar with full learning content + interactive demo
 */

'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Clock, Cookie, Lock, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import csharp from 'react-syntax-highlighter/dist/cjs/languages/hljs/csharp';
import js from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript';
import python from 'react-syntax-highlighter/dist/cjs/languages/hljs/python';
import ruby from 'react-syntax-highlighter/dist/cjs/languages/hljs/ruby';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/light';
import { github } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

// Register languages
SyntaxHighlighter.registerLanguage('javascript', js);
SyntaxHighlighter.registerLanguage('csharp', csharp);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('ruby', ruby);

export default function SessionPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const sessionResponse = await fetch('/api/auth/session-check');
        const sessionInfo = await sessionResponse.json();

        if (sessionResponse.ok) {
          setSessionData({
            sessionId: sessionInfo.sessionId,
            username: data.user.username,
            expiresAt: sessionInfo.expiresAt,
            createdAt: sessionInfo.createdAt || new Date().toISOString(),
            status: 'Active',
          });
          setIsLoggedIn(true);
        } else {
          setError('Failed to get session info');
        }
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsLoggedIn(false);
      setSessionData(null);
      setError('');
    } catch (err) {
      console.error('Logout error:', err);
      setIsLoggedIn(false);
      setSessionData(null);
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 py-4">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="mb-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div className="flex items-center gap-3">
            <Cookie className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Session-Based Authentication
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Server-side sessions with HTTP cookies • RFC 6265 • Stateful • Server-Side
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT SIDEBAR - Learning Content (Sticky & Scrollable) */}
          <aside className="lg:w-[600px] xl:w-[680px] lg:sticky lg:top-32 lg:self-start lg:h-[calc(100vh-9rem)] lg:overflow-y-auto space-y-6">

            {/* How It Works */}
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
                <p className="text-base leading-relaxed">
                  Session-based authentication stores user state on the <strong>server</strong>.
                  When a user logs in, the server creates a session object in memory or database,
                  assigns a unique session ID, and sends it to the client via a cookie.
                </p>

                <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 my-4">
                  <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-3 text-base">Authentication Flow</h3>
                  <ol className="space-y-3 text-blue-800 dark:text-blue-300 text-sm">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">1</span>
                      <div>
                        <strong>Client → Server:</strong> User submits username and password
                        <code className="block mt-1 text-xs bg-blue-100 dark:bg-blue-800 p-2 rounded">
                          POST /api/auth/login {`{ username: "user", password: "pass" }`}
                        </code>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">2</span>
                      <div>
                        <strong>Server validates:</strong> Verifies credentials against database (bcrypt hash comparison)
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">3</span>
                      <div>
                        <strong>Server creates session:</strong> Generates random session ID (256 bits entropy)
                        <code className="block mt-1 text-xs bg-blue-100 dark:bg-blue-800 p-2 rounded">
                          sessionId = crypto.randomBytes(32).toString(&apos;hex&apos;)
                        </code>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">4</span>
                      <div>
                        <strong>Server stores session:</strong> Saves {`{ userId, createdAt, expiresAt }`} in database/memory
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">5</span>
                      <div>
                        <strong>Server → Client:</strong> Sends session ID via Set-Cookie header
                        <code className="block mt-1 text-xs bg-blue-100 dark:bg-blue-800 p-2 rounded">
                          Set-Cookie: SessionID=abc123; HttpOnly; Secure; SameSite=Strict
                        </code>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">6</span>
                      <div>
                        <strong>Browser stores cookie:</strong> Cookie automatically sent with subsequent requests
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">7</span>
                      <div>
                        <strong>Server validates:</strong> Looks up session ID in database on each request
                      </div>
                    </li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            {/* Cookie Security Attributes */}
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">Cookie Security Attributes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 p-4">
                  <h3 className="text-lg font-bold text-green-900 dark:text-green-200 mb-2">HttpOnly</h3>
                  <p className="text-green-800 dark:text-green-300 mb-2 text-sm">
                    <strong>Purpose:</strong> Prevents JavaScript access to cookie (XSS protection)
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-400">
                    JavaScript cannot read cookie via <code>document.cookie</code>. Only the browser
                    and server can access it. Protects against Cross-Site Scripting (XSS) attacks.
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4">
                  <h3 className="text-lg font-bold text-blue-900 dark:text-blue-200 mb-2">Secure</h3>
                  <p className="text-blue-800 dark:text-blue-300 mb-2 text-sm">
                    <strong>Purpose:</strong> Cookie only sent over HTTPS connections
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    Prevents man-in-the-middle (MITM) attacks. Cookie won&apos;t be sent over
                    insecure HTTP. Exception: localhost (development).
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 p-4">
                  <h3 className="text-lg font-bold text-purple-900 dark:text-purple-200 mb-2">SameSite</h3>
                  <p className="text-purple-800 dark:text-purple-300 mb-2 text-sm">
                    <strong>Purpose:</strong> Prevents Cross-Site Request Forgery (CSRF)
                  </p>
                  <div className="text-xs text-purple-700 dark:text-purple-400 space-y-1">
                    <p><strong>Strict:</strong> Never sent in cross-site requests (most secure)</p>
                    <p><strong>Lax:</strong> Sent in top-level navigation (default in modern browsers)</p>
                    <p><strong>None:</strong> Always sent (requires Secure flag)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vulnerabilities */}
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">Security Vulnerabilities & Mitigations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-3 py-2 text-left font-bold text-gray-900 dark:text-white">Vulnerability</th>
                      <th className="px-3 py-2 text-left font-bold text-gray-900 dark:text-white">Attack Vector</th>
                      <th className="px-3 py-2 text-left font-bold text-gray-900 dark:text-white">Mitigation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-3 py-3 font-semibold text-red-700 dark:text-red-400">Session Fixation</td>
                      <td className="px-3 py-3 text-gray-700 dark:text-gray-300">
                        Attacker sets session ID before login, then hijacks after authentication
                      </td>
                      <td className="px-3 py-3 text-green-700 dark:text-green-400">
                        <strong>Regenerate session ID</strong> after successful login
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-3 py-3 font-semibold text-red-700 dark:text-red-400">CSRF</td>
                      <td className="px-3 py-3 text-gray-700 dark:text-gray-300">
                        Malicious site makes authenticated requests on behalf of user
                      </td>
                      <td className="px-3 py-3 text-green-700 dark:text-green-400">
                        <strong>SameSite=Strict</strong> cookie attribute + CSRF tokens
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-3 py-3 font-semibold text-red-700 dark:text-red-400">XSS Cookie Theft</td>
                      <td className="px-3 py-3 text-gray-700 dark:text-gray-300">
                        Injected JavaScript reads cookie and sends to attacker
                      </td>
                      <td className="px-3 py-3 text-green-700 dark:text-green-400">
                        <strong>HttpOnly</strong> flag prevents JavaScript access
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-3 py-3 font-semibold text-red-700 dark:text-red-400">Session Hijacking</td>
                      <td className="px-3 py-3 text-gray-700 dark:text-gray-300">
                        Attacker steals session ID via network sniffing
                      </td>
                      <td className="px-3 py-3 text-green-700 dark:text-green-400">
                        <strong>Secure</strong> flag + HTTPS only + short expiration
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              </CardContent>
            </Card>

            {/* Real-World Usage */}
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">Real-World Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">Django (Python)</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mb-2">
                    Uses session middleware with database-backed sessions
                  </p>
                  <SyntaxHighlighter
                    language="python"
                    style={github}
                    customStyle={{
                      fontSize: '0.75rem',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      margin: 0,
                    }}
                  >
{`SESSION_ENGINE = 'django.contrib.sessions.backends.db'`}
                  </SyntaxHighlighter>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">Express (Node.js)</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mb-2">
                    Uses express-session with various stores (Redis, Memory, MongoDB)
                  </p>
                  <SyntaxHighlighter
                    language="javascript"
                    style={github}
                    customStyle={{
                      fontSize: '0.75rem',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      margin: 0,
                    }}
                  >
{`app.use(session({ store: new RedisStore() }))`}
                  </SyntaxHighlighter>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">Rails (Ruby)</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mb-2">
                    Cookie-based sessions encrypted with secret key base
                  </p>
                  <SyntaxHighlighter
                    language="ruby"
                    style={github}
                    customStyle={{
                      fontSize: '0.75rem',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      margin: 0,
                    }}
                  >
{`config.session_store :cookie_store`}
                  </SyntaxHighlighter>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">ASP.NET Core</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-xs mb-2">
                    Session state with distributed cache support
                  </p>
                  <SyntaxHighlighter
                    language="csharp"
                    style={github}
                    customStyle={{
                      fontSize: '0.75rem',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      margin: 0,
                    }}
                  >
{`services.AddSession(options => ...)`}
                  </SyntaxHighlighter>
                </div>
              </div>
              </CardContent>
            </Card>

            {/* Implementation Code */}
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">Implementation Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                {/* React/Next.js Frontend */}
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <span className="text-blue-500">⚛️</span> React/Next.js (Frontend)
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-semibold">Login API call:</p>
                      <SyntaxHighlighter
                        language="javascript"
                        style={github}
                        customStyle={{
                          fontSize: '0.75rem',
                          borderRadius: '0.5rem',
                          padding: '1rem',
                          margin: 0,
                        }}
                      >
{`const res = await fetch('/api/auth/login', {
  method: 'POST',
  credentials: 'include', // Important!
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});`}
                      </SyntaxHighlighter>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-semibold">Protected request:</p>
                      <SyntaxHighlighter
                        language="javascript"
                        style={github}
                        customStyle={{
                          fontSize: '0.75rem',
                          borderRadius: '0.5rem',
                          padding: '1rem',
                          margin: 0,
                        }}
                      >
{`const res = await fetch('/api/protected', {
  credentials: 'include' // Auto-sends cookie
});`}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>

                {/* .NET Core Backend */}
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <span className="text-purple-500">🔷</span> .NET Core (Backend)
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-semibold">Program.cs - Configure session:</p>
                      <SyntaxHighlighter
                        language="csharp"
                        style={github}
                        customStyle={{
                          fontSize: '0.75rem',
                          borderRadius: '0.5rem',
                          padding: '1rem',
                          margin: 0,
                        }}
                      >
{`builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options => {
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy =
        CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.IdleTimeout = TimeSpan.FromHours(24);
});
app.UseSession();`}
                      </SyntaxHighlighter>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-semibold">Login endpoint:</p>
                      <SyntaxHighlighter
                        language="csharp"
                        style={github}
                        customStyle={{
                          fontSize: '0.75rem',
                          borderRadius: '0.5rem',
                          padding: '1rem',
                          margin: 0,
                        }}
                      >
{`[HttpPost("login")]
public IActionResult Login(LoginDto dto) {
    var user = _db.Users
        .FirstOrDefault(u => u.Username == dto.Username);

    if (user == null || !BCrypt.Verify(
        dto.Password, user.PasswordHash))
        return Unauthorized();

    HttpContext.Session.SetInt32("UserId", user.Id);
    HttpContext.Session.SetString("Username", user.Username);

    return Ok(new { user.Username, user.Role });
}`}
                      </SyntaxHighlighter>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-semibold">Protected endpoint:</p>
                      <SyntaxHighlighter
                        language="csharp"
                        style={github}
                        customStyle={{
                          fontSize: '0.75rem',
                          borderRadius: '0.5rem',
                          padding: '1rem',
                          margin: 0,
                        }}
                      >
{`[HttpGet("protected")]
public IActionResult GetProtected() {
    var userId = HttpContext.Session
        .GetInt32("UserId");

    if (userId == null)
        return Unauthorized();

    return Ok(new { Data = "Protected data" });
}`}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </div>
              </div>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">Further Reading</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://datatracker.ietf.org/doc/html/rfc6265" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                    RFC 6265 - HTTP State Management Mechanism
                  </a>
                </li>
                <li>
                  <a href="https://owasp.org/www-community/attacks/Session_fixation" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                    OWASP - Session Fixation
                  </a>
                </li>
                <li>
                  <a href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                    OWASP - Session Management Cheat Sheet
                  </a>
                </li>
              </ul>
              </CardContent>
            </Card>
          </aside>

          {/* RIGHT MAIN - Interactive Demo */}
          <main className="flex-1 space-y-6">
            {/* Security Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-1">HttpOnly</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">JavaScript cannot access cookie</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Protects against XSS attacks</p>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Secure</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Cookie only sent over HTTPS</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Prevents interception</p>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-1">SameSite</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Prevents CSRF attacks</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Blocks cross-site requests</p>
                </CardContent>
              </Card>

              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-1">24h Expiration</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Sessions automatically expire</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Reduces security window</p>
                </CardContent>
              </Card>
            </div>

            {/* Interactive Demo Section */}
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Shield className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  Try It Out - Interactive Demo
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isLoggedIn ? (
                  <div className="space-y-5">
                    {/* Demo Credentials Info - Top */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                      <p className="text-sm text-blue-800 dark:text-blue-300 font-bold mb-2">
                        📋 Demo Credentials:
                      </p>
                      <div className="space-y-1 text-sm text-blue-700 dark:text-blue-200">
                        <p>• Username: <code className="bg-blue-100 dark:bg-blue-800 px-2 py-0.5 rounded">admin</code> / Password: <code className="bg-blue-100 dark:bg-blue-800 px-2 py-0.5 rounded">admin123</code></p>
                        <p>• Username: <code className="bg-blue-100 dark:bg-blue-800 px-2 py-0.5 rounded">user</code> / Password: <code className="bg-blue-100 dark:bg-blue-800 px-2 py-0.5 rounded">user123</code></p>
                      </div>
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="w-5 h-5" />
                        <AlertDescription className="ml-2">{error}</AlertDescription>
                      </Alert>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Username
                      </label>
                      <Input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="admin"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Password
                      </label>
                      <Input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        placeholder="admin123"
                      />
                    </div>

                    <Button
                      onClick={handleLogin}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-6"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Logging in...
                        </>
                      ) : (
                        <>
                          Login with Session
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                        <h3 className="text-2xl font-bold text-green-800 dark:text-green-300">Login Successful!</h3>
                      </div>
                      <p className="text-green-700 dark:text-green-300 text-lg">
                        Logged in as <strong>{username}</strong>
                      </p>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          Session Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">Session ID:</span>
                          <span className="text-gray-800 dark:text-gray-100 font-mono text-xs break-all max-w-[250px]">{sessionData?.sessionId}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">Username:</span>
                          <span className="text-gray-800 dark:text-gray-100 font-semibold">{sessionData?.username}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">Status:</span>
                          <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            {sessionData?.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">Created:</span>
                          <span className="text-gray-800 dark:text-gray-100 text-sm">
                            {new Date(sessionData?.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">Expires:</span>
                          <span className="text-gray-800 dark:text-gray-100 text-sm">
                            {new Date(sessionData?.expiresAt).toLocaleString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Cookie className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          Cookie Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm space-y-2">
                          <div className="text-gray-700 dark:text-gray-300">
                            <span className="text-blue-600 dark:text-blue-400">Set-Cookie:</span> sessionId={sessionData?.sessionId?.substring(0, 20)}...
                          </div>
                          <div className="text-gray-700 dark:text-gray-300 pl-4">
                            <span className="text-cyan-600 dark:text-cyan-400">HttpOnly;</span> <span className="text-gray-500 dark:text-gray-400">{`// JS cannot access`}</span>
                          </div>
                          <div className="text-gray-700 dark:text-gray-300 pl-4">
                            <span className="text-cyan-600 dark:text-cyan-400">Secure;</span> <span className="text-gray-500 dark:text-gray-400">{`// HTTPS only`}</span>
                          </div>
                          <div className="text-gray-700 dark:text-gray-300 pl-4">
                            <span className="text-cyan-600 dark:text-cyan-400">SameSite=Strict;</span> <span className="text-gray-500 dark:text-gray-400">{`// CSRF protection`}</span>
                          </div>
                          <div className="text-gray-700 dark:text-gray-300 pl-4">
                            <span className="text-cyan-600 dark:text-cyan-400">Max-Age=86400;</span> <span className="text-gray-500 dark:text-gray-400">{`// 24 hours`}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Button
                      onClick={handleLogout}
                      variant="secondary"
                      className="w-full py-6"
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
