/**
 * Dashboard Page
 * Protected page showing authenticated user information
 *
 * Based on SPECIFICATION Section 7.1 - Protected Routes
 * Updated to use shadcn/ui components
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Hash,
  Key,
  Lock,
  LogOut,
  Mail,
  Shield,
  User,
  XCircle,
} from 'lucide-react';

// shadcn/ui imports
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  const [apiTestResult, setApiTestResult] = useState<{
    success: boolean;
    message: string;
    data?: any;
  } | null>(null);
  const [apiTestLoading, setApiTestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

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
      setApiTestLoading(true);
      setApiTestResult(null);

      const response = await fetch('/api/auth/protected-test');

      if (response.ok) {
        const data = await response.json();
        setApiTestResult({
          success: true,
          message: 'Protected resource accessed',
          data: {
            user: user?.username,
            timestamp: new Date().toISOString(),
            resource: 'protected_data',
            permissions: ['read', 'write'],
            ...data,
          },
        });
      } else {
        setApiTestResult({
          success: false,
          message: `API Access Denied - ${response.statusText}`,
        });
      }
    } catch (err) {
      setApiTestResult({
        success: false,
        message: err instanceof Error ? err.message : 'Unknown error',
      });
    } finally {
      setApiTestLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setShowLogoutDialog(false);
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const getRoleColor = (role: string) => {
    if (role === 'admin') return 'from-red-500 to-rose-600';
    return 'from-blue-500 to-cyan-600';
  };

  const getRoleBadgeVariant = (role: string): 'destructive' | 'default' => {
    return role === 'admin' ? 'destructive' : 'default';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTimeRemaining = () => {
    if (!sessionData?.expiresAt) return 'N/A';
    const expiresAt = new Date(sessionData.expiresAt);
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getProgressPercentage = () => {
    if (!sessionData?.expiresAt) return 100;
    const expiresAt = new Date(sessionData.expiresAt);
    const now = new Date();
    const total = 24 * 60 * 60 * 1000; // 24 hours in ms
    const remaining = expiresAt.getTime() - now.getTime();
    return Math.max(0, Math.min(100, (remaining / total) * 100));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-slate-950 dark:to-gray-900">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-slate-950 dark:to-gray-900">
        <div className="text-center max-w-md">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => router.push('/')} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-slate-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Card */}
          <Card className="mb-6 md:mb-8 shadow-xl">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-4 md:gap-6">
                  <div
                    className={`w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br ${getRoleColor(user.role)} rounded-full flex items-center justify-center shadow-lg`}
                  >
                    <span className="text-2xl md:text-3xl font-bold text-white">
                      {getInitials(user.username)}
                    </span>
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-4xl font-bold mb-1">
                      {user.username}
                    </h1>
                    <p className="text-muted-foreground text-sm md:text-base mb-2">
                      {user.email}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role}
                      </Badge>
                      <Badge variant="outline" className="bg-green-50 dark:bg-green-950">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Logged in via {authMethod === 'session' ? 'Session' : 'JWT'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setShowLogoutDialog(true)}
                  variant="destructive"
                  className="self-start md:self-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <Hash className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-2" />
                <CardTitle className="text-sm font-semibold text-muted-foreground">
                  User ID
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs font-mono truncate">{user.id}</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <User className="w-10 h-10 text-purple-600 dark:text-purple-400 mb-2" />
                <CardTitle className="text-sm font-semibold text-muted-foreground">
                  Username
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold">{user.username}</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <Shield className="w-10 h-10 text-green-600 dark:text-green-400 mb-2" />
                <CardTitle className="text-sm font-semibold text-muted-foreground">
                  2FA Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {user.mfaEnabled ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                        Enabled
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <span className="text-sm font-semibold text-red-700 dark:text-red-300">
                        Disabled
                      </span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <Activity className="w-10 h-10 text-orange-600 dark:text-orange-400 mb-2" />
                <CardTitle className="text-sm font-semibold text-muted-foreground">
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="bg-green-50 dark:bg-green-950">
                  <span className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-pulse mr-2"></span>
                  Online
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
            {/* User Information Card */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl">
                  <User className="w-7 h-7 md:w-8 md:h-8 text-blue-600 dark:text-blue-400" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-xl">
                  <Hash className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-muted-foreground mb-1">
                      ID
                    </div>
                    <div className="text-sm font-mono truncate">{user.id}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950 rounded-xl">
                  <User className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-muted-foreground mb-1">
                      Username
                    </div>
                    <div className="text-sm font-semibold">{user.username}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl">
                  <Mail className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-muted-foreground mb-1">
                      Email
                    </div>
                    <div className="text-sm">{user.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 rounded-xl">
                  <Key className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-muted-foreground mb-1">
                      Role
                    </div>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Authentication Status Card */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl">
                  <Lock className="w-7 h-7 md:w-8 md:h-8 text-green-600 dark:text-green-400" />
                  Authentication Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Current Auth Method
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Method:</span>
                    <Badge className="bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700">
                      {authMethod?.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {authMethod === 'session' && sessionData && (
                  <div className="space-y-4">
                    <div className="bg-muted rounded-xl p-4">
                      <div className="text-xs font-semibold text-muted-foreground mb-2">
                        Session ID
                      </div>
                      <div className="text-sm font-mono break-all bg-background rounded p-2">
                        {sessionData.sessionId}
                      </div>
                    </div>

                    <div className="bg-muted rounded-xl p-4">
                      <div className="text-xs font-semibold text-muted-foreground mb-2">
                        Created
                      </div>
                      <div className="text-sm">
                        {new Date(user.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="bg-muted rounded-xl p-4">
                      <div className="text-xs font-semibold text-muted-foreground mb-2">
                        Expires
                      </div>
                      <div className="text-sm mb-3">
                        {sessionData.expiresAt
                          ? new Date(sessionData.expiresAt).toLocaleString()
                          : 'N/A'}
                      </div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-muted-foreground">
                          Time remaining:
                        </span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {formatTimeRemaining()}
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-600 h-full transition-all"
                          style={{ width: `${getProgressPercentage()}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Protected API Test Card */}
          <Card className="shadow-xl mb-6 md:mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl">
                <Activity className="w-7 h-7 md:w-8 md:h-8 text-purple-600 dark:text-purple-400" />
                Protected API Test
              </CardTitle>
              <CardDescription>
                Test accessing a protected API endpoint using your current
                authentication credentials. This simulates a real API call that
                requires valid authentication.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleTestAPI}
                disabled={apiTestLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
                size="lg"
              >
                {apiTestLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Calling API...
                  </>
                ) : (
                  <>
                    <Key className="w-5 h-5 mr-2" />
                    Test Protected API
                  </>
                )}
              </Button>

              {apiTestResult && (
                <Alert
                  variant={apiTestResult.success ? 'default' : 'destructive'}
                  className={
                    apiTestResult.success
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800'
                      : ''
                  }
                >
                  {apiTestResult.success ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertTitle className="flex items-center justify-between">
                    <span>
                      {apiTestResult.success ? 'API Success' : 'API Error'}
                    </span>
                    <Badge
                      variant={
                        apiTestResult.success ? 'default' : 'destructive'
                      }
                      className={
                        apiTestResult.success
                          ? 'bg-green-600 hover:bg-green-700'
                          : ''
                      }
                    >
                      {apiTestResult.success ? '200 OK' : '401 Unauthorized'}
                    </Badge>
                  </AlertTitle>
                  <AlertDescription>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto mt-3">
                      <pre className="text-xs sm:text-sm text-green-400 font-mono">
                        {JSON.stringify(
                          {
                            status: apiTestResult.success
                              ? 'success'
                              : 'error',
                            message: apiTestResult.message,
                            ...(apiTestResult.data && {
                              data: apiTestResult.data,
                            }),
                          },
                          null,
                          2
                        )}
                      </pre>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
            <Button
              onClick={() => setShowLogoutDialog(true)}
              variant="destructive"
              className="flex-1"
              size="lg"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-4">
              <LogOut className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <DialogTitle className="text-center text-2xl md:text-3xl">
              Confirm Logout
            </DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to log out? You&apos;ll need to sign in again to
              access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:gap-0">
            <Button
              onClick={() => setShowLogoutDialog(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="flex-1"
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
