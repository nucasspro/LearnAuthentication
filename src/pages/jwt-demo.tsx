/**
 * JWT Authentication Demo Page
 * Based on SPECIFICATION Section 4.2 - JWT Authentication
 */

'use client';

import { useState } from 'react';

interface FormState {
  username: string;
  password: string;
  error: string;
  isLoading: boolean;
}

interface JWTData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: any;
}

export default function JWTDemoPage() {
  const [formState, setFormState] = useState<FormState>({
    username: 'admin',
    password: 'admin123',
    error: '',
    isLoading: false,
  });
  const [jwtData, setJwtData] = useState<JWTData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState((prev) => ({ ...prev, isLoading: true, error: '' }));

    try {
      const response = await fetch('/api/auth/jwt-sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formState.username,
          password: formState.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setJwtData(data);
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

  const decodeJWT = (token: string) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const decoded = JSON.parse(atob(parts[1]));
      return decoded;
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">JWT Authentication Demo</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Explanation */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">How JWT Works</h2>
              <div className="text-gray-700 space-y-4 text-sm">
                <p>
                  <strong>JWT (JSON Web Token)</strong> is stateless - the server doesn&apos;t
                  store anything.
                </p>

                <div className="space-y-2">
                  <p className="font-semibold">JWT Structure:</p>
                  <code className="text-xs bg-gray-100 p-2 rounded block overflow-x-auto">
                    header.payload.signature
                  </code>
                </div>

                <div className="bg-green-50 p-3 rounded border border-green-200">
                  <p className="font-semibold text-green-900 mb-2">Flow:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2 text-xs">
                    <li>User sends username/password</li>
                    <li>Server validates & creates JWT</li>
                    <li>Server signs with secret key</li>
                    <li>Client receives token (no cookie needed)</li>
                    <li>Client sends token in Authorization header</li>
                    <li>Server verifies signature</li>
                  </ol>
                </div>

                <div>
                  <p className="font-semibold mb-2">Common Uses:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                    <li>Mobile apps (no cookies)</li>
                    <li>APIs (microservices)</li>
                    <li>Single Page Applications</li>
                    <li>Cross-domain requests</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Login Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Generate JWT</h2>

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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="admin"
                  />
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="password"
                  />
                </div>

                {formState.error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {formState.error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formState.isLoading}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-semibold"
                >
                  {formState.isLoading ? 'Generating...' : 'Generate JWT'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Token Display */}
        {jwtData && (
          <div className="mt-8 space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Generated Tokens</h2>

              <div className="space-y-4">
                {/* Access Token */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Access Token</h3>
                  <div className="bg-gray-900 p-4 rounded-lg text-white font-mono text-xs overflow-x-auto break-all">
                    {jwtData.accessToken}
                  </div>
                  <p className="mt-2 text-xs text-gray-600">Expires in: {jwtData.expiresIn}s</p>
                </div>

                {/* Refresh Token */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Refresh Token</h3>
                  <div className="bg-gray-900 p-4 rounded-lg text-white font-mono text-xs overflow-x-auto break-all">
                    {jwtData.refreshToken}
                  </div>
                </div>

                {/* Decoded Payload */}
                {decodeJWT(jwtData.accessToken) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Decoded Payload</h3>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <pre className="text-xs overflow-x-auto text-blue-900">
                        {JSON.stringify(decodeJWT(jwtData.accessToken), null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
