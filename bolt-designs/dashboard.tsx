import { Activity, ArrowLeft, CheckCircle2, Hash, Key, Lock, LogOut, Mail, Shield, User, XCircle } from 'lucide-react';
import { useState } from 'react';

type AuthMethod = 'session' | 'jwt';

export default function Dashboard() {
  const [authMethod] = useState<AuthMethod>('session');
  const [user] = useState({
    id: 'usr_1234567890',
    username: 'admin',
    email: 'admin@example.com',
    role: 'Administrator',
    mfaEnabled: true,
    sessionId: 'sess_abc123xyz789def456',
    createdAt: '2024-01-15T10:30:00Z',
    lastLogin: new Date().toISOString(),
  });

  const [apiResponse, setApiResponse] = useState<string>('');
  const [apiError, setApiError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const sessionExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const timeRemaining = 24 * 60 * 60;
  const progressPercentage = (timeRemaining / (24 * 60 * 60)) * 100;

  const handleProtectedAPI = async () => {
    setIsLoading(true);
    setApiResponse('');
    setApiError(false);

    await new Promise(resolve => setTimeout(resolve, 1500));

    setApiResponse(JSON.stringify({
      status: 'success',
      message: 'Protected resource accessed',
      data: {
        user: user.username,
        timestamp: new Date().toISOString(),
        resource: 'protected_data',
        permissions: ['read', 'write'],
      }
    }, null, 2));

    setIsLoading(false);
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    console.log('User logged out');
  };

  const getRoleColor = (role: string) => {
    if (role === 'Administrator') return 'from-red-500 to-rose-600';
    return 'from-blue-500 to-cyan-600';
  };

  const getRoleBadgeColor = (role: string) => {
    if (role === 'Administrator') return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
    return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatTimeRemaining = () => {
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 dark:from-gray-900 dark:via-slate-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4 md:gap-6">
                <div className={`w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br ${getRoleColor(user.role)} rounded-full flex items-center justify-center shadow-lg`}>
                  <span className="text-2xl md:text-3xl font-bold text-white">{getInitials(user.username)}</span>
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white mb-1">{user.username}</h1>
                  <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base mb-2">{user.email}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 ${getRoleBadgeColor(user.role)} rounded-full text-xs font-semibold`}>
                      {user.role}
                    </span>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Logged in via {authMethod === 'session' ? 'Session' : 'JWT'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowLogoutModal(true)}
                className="self-start md:self-center px-6 py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-xl transition-colors flex items-center gap-2 font-semibold shadow-md hover:shadow-lg"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <Hash className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">User ID</h3>
              <p className="text-xs font-mono text-gray-800 dark:text-white truncate">{user.id}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <User className="w-10 h-10 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Username</h3>
              <p className="text-lg font-bold text-gray-800 dark:text-white">{user.username}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <Shield className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">2FA Status</h3>
              <div className="flex items-center gap-2">
                {user.mfaEnabled ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-semibold text-green-700 dark:text-green-300">Enabled</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <span className="text-sm font-semibold text-red-700 dark:text-red-300">Disabled</span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <Activity className="w-10 h-10 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Status</h3>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold">
                <span className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full animate-pulse"></span>
                Online
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <User className="w-7 h-7 md:w-8 md:h-8 text-blue-600 dark:text-blue-400" />
                User Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-xl">
                  <Hash className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">ID</div>
                    <div className="text-sm text-gray-800 dark:text-gray-100 font-mono truncate">{user.id}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950 rounded-xl">
                  <User className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Username</div>
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">{user.username}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl">
                  <Mail className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Email</div>
                    <div className="text-sm text-gray-800 dark:text-gray-100">{user.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 rounded-xl">
                  <Key className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Role</div>
                    <span className={`inline-block px-3 py-1 ${getRoleBadgeColor(user.role)} rounded-full text-xs font-semibold`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                <Lock className="w-7 h-7 md:w-8 md:h-8 text-green-600 dark:text-green-400" />
                Authentication Status
              </h2>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-xl p-6 mb-6 border-2 border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Current Auth Method
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Method:</span>
                  <span className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg text-sm font-semibold uppercase shadow-md">
                    {authMethod}
                  </span>
                </div>
              </div>

              {authMethod === 'session' && (
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Session ID</div>
                    <div className="text-sm text-gray-800 dark:text-gray-100 font-mono break-all bg-white dark:bg-gray-800 rounded p-2">
                      {user.sessionId}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Created</div>
                    <div className="text-sm text-gray-800 dark:text-gray-100">
                      {new Date(user.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Expires</div>
                    <div className="text-sm text-gray-800 dark:text-gray-100 mb-3">
                      {sessionExpires.toLocaleString()}
                    </div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Time remaining:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">{formatTimeRemaining()}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-full transition-all"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <Activity className="w-7 h-7 md:w-8 md:h-8 text-purple-600 dark:text-purple-400" />
              Protected API Test
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Test accessing a protected API endpoint using your current authentication credentials.
              This simulates a real API call that requires valid authentication.
            </p>

            <button
              onClick={handleProtectedAPI}
              disabled={isLoading}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm mb-6"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Calling API...
                </>
              ) : (
                <>
                  <Key className="w-5 h-5" />
                  Test Protected API
                </>
              )}
            </button>

            {apiResponse && (
              <div className={`rounded-xl p-6 border-2 ${apiError ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {apiError ? (
                      <>
                        <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        <span className="font-semibold text-red-800 dark:text-red-300">API Error</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                        <span className="font-semibold text-green-800 dark:text-green-300">API Success</span>
                      </>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${apiError ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                    {apiError ? '401 Unauthorized' : '200 OK'}
                  </span>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs sm:text-sm text-green-400 font-mono">
                    {apiResponse}
                  </pre>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 px-6 py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-[fadeIn_0.2s_ease-in]">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 animate-[scaleIn_0.2s_ease-out]">
            <div className="flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-6">
              <LogOut className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white text-center mb-3">Confirm Logout</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
              Are you sure you want to log out? You'll need to sign in again to access your account.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
