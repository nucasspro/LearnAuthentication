/**
 * Session-Based Authentication Demo Page
 * Integrated with Bolt Design + shadcn/ui components
 */

'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertCircle, ArrowRight, CheckCircle2, Clock, Cookie, Lock, Shield } from 'lucide-react';
import { useState } from 'react';

export default function SessionDemo() {
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
      // Call the real login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Get session info from the server
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
      // Call the real logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      setIsLoggedIn(false);
      setSessionData(null);
      setError('');
    } catch (err) {
      console.error('Logout error:', err);
      // Clear local state even if API call fails
      setIsLoggedIn(false);
      setSessionData(null);
      setError('');
    }
  };

  const flowSteps = [
    { num: 1, text: 'Client sends username & password', detail: 'User submits credentials via POST request' },
    { num: 2, text: 'Server validates credentials with bcrypt', detail: 'Password hash comparison' },
    { num: 3, text: 'Server generates random session ID (256 bits)', detail: 'Cryptographically secure random string' },
    { num: 4, text: 'Session stored in memory/database', detail: 'Server-side session storage' },
    { num: 5, text: 'SessionID sent via Set-Cookie header', detail: 'HTTP response includes cookie' },
    { num: 6, text: 'Browser auto-sends cookie on requests', detail: 'Automatic authentication on subsequent calls' },
  ];

  const securityFeatures = [
    {
      icon: Lock,
      label: 'HttpOnly',
      desc: 'JavaScript cannot access cookie',
      detail: 'Protects against XSS attacks'
    },
    {
      icon: Shield,
      label: 'Secure',
      desc: 'Cookie only sent over HTTPS',
      detail: 'Prevents interception'
    },
    {
      icon: CheckCircle2,
      label: 'SameSite',
      desc: 'Prevents CSRF attacks',
      detail: 'Blocks cross-site requests'
    },
    {
      icon: Clock,
      label: '24h Expiration',
      desc: 'Sessions automatically expire',
      detail: 'Reduces security window'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Cookie className="w-10 h-10 md:w-12 md:h-12 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">Session Demo</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
            Learn how session-based authentication works with cookies and server-side storage
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 space-y-6 md:space-y-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Cookie className="w-7 h-7 md:w-8 md:h-8 text-blue-600 dark:text-blue-400" />
                How Session Works
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                Session-based authentication creates a secure session on the server after successful login.
                The server stores session data and sends a session ID to the client via a secure cookie.
                This approach keeps sensitive data server-side while maintaining user state across requests.
              </p>
            </div>

            {/* Visual Diagram */}
            <div className="bg-gray-900 rounded-xl p-6 md:p-8 overflow-x-auto">
              <h3 className="text-xl md:text-2xl font-bold text-yellow-400 mb-6">Authentication Flow Diagram</h3>

              {/* Diagram */}
              <div className="min-w-[600px]">
                {/* Row 1: User -> Server */}
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-24 text-center">
                    <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center mb-2">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-white text-sm font-bold">User</span>
                  </div>

                  <div className="flex-1 px-4">
                    <div className="relative">
                      <div className="border-t-2 border-dashed border-red-500"></div>
                      <div className="absolute top-0 right-0 -mt-1 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-red-500"></div>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6">
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold whitespace-nowrap">① Login</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 w-24 text-center">
                    <div className="w-16 h-16 mx-auto bg-red-500 rounded-lg flex items-center justify-center mb-2">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                        <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                      </svg>
                    </div>
                    <span className="text-white text-sm font-bold">Server</span>
                  </div>
                </div>

                {/* Row 2: Server -> Session Store */}
                <div className="flex items-center mb-4 ml-24">
                  <div className="flex-shrink-0 w-24"></div>

                  <div className="flex-1 px-4">
                    <div className="relative">
                      <div className="border-t-2 border-dashed border-purple-500"></div>
                      <div className="absolute top-0 right-0 -mt-1 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-purple-500"></div>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6">
                        <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded font-bold whitespace-nowrap">③ Store Session</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 w-24 text-center">
                    <div className="w-16 h-16 mx-auto bg-cyan-500 rounded-lg flex items-center justify-center mb-2">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                        <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                      </svg>
                    </div>
                    <span className="text-white text-sm font-bold">Session DB</span>
                  </div>
                </div>

                {/* Row 3: Server -> User (Cookie) */}
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-24"></div>

                  <div className="flex-1 px-4">
                    <div className="relative">
                      <div className="border-t-2 border-dashed border-blue-500"></div>
                      <div className="absolute top-0 left-0 -mt-1 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[10px] border-r-blue-500"></div>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6">
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded font-bold whitespace-nowrap">④ Set-Cookie</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 w-24"></div>
                </div>

                {/* Row 4: User -> Server (with Cookie) */}
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-24"></div>

                  <div className="flex-1 px-4">
                    <div className="relative">
                      <div className="border-t-2 border-dashed border-green-500"></div>
                      <div className="absolute top-0 right-0 -mt-1 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-green-500"></div>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6">
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold whitespace-nowrap">⑥ Request + Cookie</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 w-24"></div>
                </div>

                {/* Row 5: Server -> Session Store (Verify) */}
                <div className="flex items-center mb-4 ml-24">
                  <div className="flex-shrink-0 w-24"></div>

                  <div className="flex-1 px-4">
                    <div className="relative">
                      <div className="border-t-2 border-dashed border-cyan-500"></div>
                      <div className="absolute top-0 right-0 -mt-1 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[10px] border-l-cyan-500"></div>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6">
                        <span className="bg-cyan-500 text-white text-xs px-2 py-1 rounded font-bold whitespace-nowrap">⑦ Verify Session</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 w-24"></div>
                </div>

                {/* Row 6: Server -> User (Response) */}
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-24"></div>

                  <div className="flex-1 px-4">
                    <div className="relative">
                      <div className="border-t-2 border-dashed border-emerald-500"></div>
                      <div className="absolute top-0 left-0 -mt-1 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[10px] border-r-emerald-500"></div>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6">
                        <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded font-bold whitespace-nowrap">⑧ Response</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 w-24"></div>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <h4 className="text-gray-400 text-sm font-bold mb-3">FLOW STEPS:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {flowSteps.map((step) => (
                    <div key={step.num} className="flex items-start gap-2">
                      <span className="text-yellow-400 font-bold flex-shrink-0">{step.num}.</span>
                      <span className="text-gray-300">{step.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white mb-4">Security Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {securityFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.label}
                      className="bg-white dark:bg-gray-700 border-2 border-blue-100 dark:border-blue-800 rounded-xl p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-all hover:shadow-md"
                    >
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400 mb-2" />
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-1 text-sm md:text-base">{feature.label}</h4>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">{feature.desc}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{feature.detail}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <Shield className="w-7 h-7 md:w-8 md:h-8 text-blue-600 dark:text-blue-400" />
              Try It Out
            </h2>

            {!isLoggedIn ? (
              <div className="space-y-5 md:space-y-6">
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
                    className="text-sm md:text-base"
                    placeholder="admin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    className="text-sm md:text-base"
                    placeholder="password"
                  />
                </div>

                <Button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-6 text-sm md:text-base"
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

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <p className="text-xs md:text-sm text-blue-800 dark:text-blue-300">
                    <strong>Demo credentials:</strong> Try &quot;admin&quot; / &quot;admin123&quot; or &quot;user&quot; / &quot;password&quot;
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5 md:space-y-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700 rounded-xl p-5 md:p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="w-7 h-7 md:w-8 md:h-8 text-green-600 dark:text-green-400" />
                    <h3 className="text-xl md:text-2xl font-bold text-green-800 dark:text-green-300">Login Successful!</h3>
                  </div>
                  <p className="text-green-700 dark:text-green-300 text-base md:text-lg">
                    Logged in as <strong>{username}</strong>
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                      <Lock className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                      Session Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-200 dark:border-gray-700 gap-1">
                      <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">Session ID:</span>
                      <span className="text-gray-800 dark:text-gray-100 font-mono text-xs sm:text-sm break-all">{sessionData?.sessionId}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-200 dark:border-gray-700 gap-1">
                      <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">Username:</span>
                      <span className="text-gray-800 dark:text-gray-100 font-semibold text-sm">{sessionData?.username}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-200 dark:border-gray-700 gap-1">
                      <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">Status:</span>
                      <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50">
                        {sessionData?.status}
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-200 dark:border-gray-700 gap-1">
                      <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">Created:</span>
                      <span className="text-gray-800 dark:text-gray-100 text-xs sm:text-sm">
                        {new Date(sessionData?.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 gap-1">
                      <span className="text-gray-600 dark:text-gray-300 font-medium text-sm">Expires:</span>
                      <span className="text-gray-800 dark:text-gray-100 text-xs sm:text-sm">
                        {new Date(sessionData?.expiresAt).toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                      <Cookie className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                      Cookie Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-xs sm:text-sm space-y-2 overflow-x-auto">
                      <div className="text-gray-700 dark:text-gray-300">
                        <span className="text-blue-600 dark:text-blue-400">Set-Cookie:</span> sessionId={sessionData?.sessionId}
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
                  className="w-full text-sm md:text-base py-6"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
