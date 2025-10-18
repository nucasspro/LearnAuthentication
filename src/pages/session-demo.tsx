/**
 * Session-Based Authentication Demo Page
 * Based on SPECIFICATION Section 4.1 - Session Authentication
 */

'use client';

import { useState } from 'react';

interface FormState {
  username: string;
  password: string;
  error: string;
  isLoading: boolean;
}

export default function SessionDemoPage() {
  const [formState, setFormState] = useState<FormState>({
    username: 'admin',
    password: 'admin123',
    error: '',
    isLoading: false,
  });
  const [loginResult, setLoginResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState((prev) => ({ ...prev, isLoading: true, error: '' }));

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formState.username,
          password: formState.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setLoginResult({ success: true, user: data.user });
        setFormState((prev) => ({ ...prev, error: '' }));
      } else {
        setFormState((prev) => ({ ...prev, error: data.error || 'Login failed' }));
      }
    } catch (err) {
      setFormState((prev) => ({ ...prev, error: 'Network error' }));
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Session Authentication Demo</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Explanation */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">How Session Auth Works</h2>
              <div className="text-gray-700 space-y-4 text-sm">
                <p>
                  <strong>Session-based authentication</strong> stores user information on the
                  server.
                </p>

                <div className="space-y-2">
                  <p className="font-semibold">Flow:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>User sends username/password</li>
                    <li>Server validates credentials</li>
                    <li>Server creates session with random ID</li>
                    <li>Server stores session in memory/database</li>
                    <li>Server sends sessionID via Set-Cookie header</li>
                    <li>Browser automatically sends cookie with requests</li>
                    <li>Server looks up session from cookie</li>
                  </ol>
                </div>

                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                  <p className="font-semibold text-blue-900 mb-2">Cookie Format:</p>
                  <code className="text-xs text-blue-800 break-all">
                    SessionID=abc123; HttpOnly; Secure; SameSite=Strict
                  </code>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Security Features</h2>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>HttpOnly - prevents XSS access</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Secure - HTTPS only</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>SameSite - prevents CSRF</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Server-side storage - can revoke anytime</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: Login Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Try It Out</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={formState.username}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, username: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="admin"
                  />
                  <p className="mt-1 text-xs text-gray-600">Hint: Try &quot;admin&quot; or &quot;user&quot;</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formState.password}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, password: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="password"
                  />
                  <p className="mt-1 text-xs text-gray-600">Hint: Try &quot;admin123&quot; or &quot;user123&quot;</p>
                </div>

                {formState.error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {formState.error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formState.isLoading}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-semibold"
                >
                  {formState.isLoading ? 'Logging in...' : 'Login with Session'}
                </button>
              </form>

              {loginResult?.success && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-semibold mb-2">✅ Login Successful!</p>
                  <p className="text-sm text-green-700">
                    Logged in as <span className="font-mono">{loginResult.user.username}</span>
                  </p>
                  <p className="text-xs text-green-600 mt-2">
                    Check your browser cookies to see the SessionID (HttpOnly flag prevents
                    JavaScript access)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
