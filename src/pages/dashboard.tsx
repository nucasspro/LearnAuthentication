/**
 * Dashboard Page
 * Protected page showing authenticated user information
 *
 * Based on SPECIFICATION Section 7.1 - Protected Routes
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  mfaEnabled: boolean;
  createdAt: Date;
}

interface SessionData {
  sessionId?: string;
  userId?: number;
  expiresAt?: string;
  expired?: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authMethod, setAuthMethod] = useState<'session' | 'jwt' | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [apiTestResult, setApiTestResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify');

        if (!response.ok) {
          router.push('/');
          return;
        }

        const data = await response.json();

        if (data.authenticated && data.user) {
          setUser(data.user);
          setAuthMethod(data.method || 'session');

          // Get session info if using session auth
          if (data.method === 'session') {
            const sessionResponse = await fetch('/api/auth/session-check');
            if (sessionResponse.ok) {
              const sessionInfo = await sessionResponse.json();
              setSessionData(sessionInfo);
            }
          }
        } else {
          router.push('/');
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleTestAPI = async () => {
    try {
      setApiTestResult('Testing...');
      const response = await fetch('/api/auth/protected-test');

      if (response.ok) {
        const data = await response.json();
        setApiTestResult('✅ API Access Granted - ' + data.message);
      } else {
        setApiTestResult('❌ API Access Denied - ' + response.statusText);
      }
    } catch (err) {
      setApiTestResult('❌ Error - ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome, <span className="text-blue-600">{user.username}</span>!
          </h1>
          <p className="text-gray-600">You are successfully authenticated</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* User Info */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">User Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 font-semibold">User ID</p>
                <p className="text-lg text-gray-900 font-mono">{user.id}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 font-semibold">Username</p>
                <p className="text-lg text-gray-900">{user.username}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 font-semibold">Email</p>
                <p className="text-lg text-gray-900 break-all">{user.email}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 font-semibold">Role</p>
                <p className="text-lg text-gray-900 font-mono">
                  <span className={`px-2 py-1 rounded ${user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                    {user.role}
                  </span>
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 font-semibold">2FA Enabled</p>
                <p className="text-lg text-gray-900">
                  {user.mfaEnabled ? '✅ Yes' : '❌ No'}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 font-semibold">Created</p>
                <p className="text-lg text-gray-900 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </section>

          {/* Auth Status */}
          <section className="border-t pt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Status</h2>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-600 font-semibold mb-2">Method</p>
              <p className="text-lg text-gray-900 font-mono">
                Logged in via <span className="font-bold">{authMethod?.toUpperCase()}</span>
              </p>
            </div>

            {authMethod === 'session' && sessionData && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-gray-600 font-semibold mb-2">Session Info</p>
                <div className="space-y-2 font-mono text-sm">
                  <p>
                    <span className="text-gray-600">Session ID:</span> {sessionData.sessionId?.substring(0, 20)}...
                  </p>
                  <p>
                    <span className="text-gray-600">Expires:</span> {sessionData.expiresAt}
                  </p>
                  <p>
                    <span className="text-gray-600">Status:</span>{' '}
                    {sessionData.expired ? '⚠️ Expired' : '✅ Active'}
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Protected API Test */}
          <section className="border-t pt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Protected API Test</h2>
            <p className="text-gray-600 mb-4">
              Click the button below to test access to a protected API endpoint
            </p>
            <button
              onClick={handleTestAPI}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Test Protected API
            </button>
            {apiTestResult && (
              <div className={`mt-4 p-4 rounded-lg ${apiTestResult.includes('✅') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className={apiTestResult.includes('✅') ? 'text-green-800' : 'text-red-800'}>
                  {apiTestResult}
                </p>
              </div>
            )}
          </section>

          {/* Actions */}
          <section className="border-t pt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/')}
                className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
              >
                Back to Home
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Logout
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
