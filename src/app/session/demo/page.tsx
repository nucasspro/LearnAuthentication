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

    await new Promise(resolve => setTimeout(resolve, 800));

    if (username === 'admin' && password === 'admin123') {
      const sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      setSessionData({
        sessionId,
        username,
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
        status: 'Active',
      });
      setIsLoggedIn(true);
    } else {
      setError('Invalid credentials. Try "admin" / "admin123"');
    }

    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSessionData(null);
    setError('');
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

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-xl p-5 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white mb-5 md:mb-6">Authentication Flow</h3>
              <div className="space-y-3 md:space-y-4">
                {flowSteps.map((step, index) => (
                  <div key={step.num}>
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-blue-600 dark:to-cyan-700 text-white rounded-full flex items-center justify-center font-bold text-sm md:text-base shadow-lg">
                        {step.num}
                      </div>
                      <div className="flex-1 pt-1 md:pt-2">
                        <p className="text-gray-700 dark:text-gray-200 font-medium text-sm md:text-base">{step.text}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mt-1">{step.detail}</p>
                      </div>
                    </div>
                    {index < flowSteps.length - 1 && (
                      <div className="ml-4 md:ml-5 h-6 md:h-8 w-0.5 bg-gradient-to-b from-blue-300 to-cyan-300 dark:from-blue-700 dark:to-cyan-700"></div>
                    )}
                  </div>
                ))}
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
