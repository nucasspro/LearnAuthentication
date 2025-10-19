import { AlertCircle, ArrowRight, CheckCircle2, Clock, Code, Copy, Key, Lock, RefreshCw, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';

type Tab = 'overview' | 'structure' | 'refresh' | 'security';

export default function JWTDemo() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tokenData, setTokenData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(900);
  const [copiedToken, setCopiedToken] = useState<'access' | 'refresh' | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !tokenData) return;

    const interval = setInterval(() => {
      const expiresAt = new Date(tokenData.expiresAt).getTime();
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
      setTimeRemaining(remaining);

      if (remaining === 0) {
        setError('Access token expired. Use refresh token to get a new one.');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoggedIn, tokenData]);

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 800));

    if (username === 'admin' && password === 'admin123') {
      const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + btoa(JSON.stringify({
        sub: '1234567890',
        username: username,
        role: 'admin',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 900
      })) + '.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

      const refreshToken = 'rt_' + Math.random().toString(36).substring(2, 25) + Math.random().toString(36).substring(2, 25);

      setTokenData({
        accessToken,
        refreshToken,
        username,
        role: 'admin',
        expiresAt: new Date(Date.now() + 900 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      });
      setIsLoggedIn(true);
      setTimeRemaining(900);
    } else {
      setError('Invalid credentials. Try "admin" / "admin123"');
    }

    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    setError('');
    await new Promise(resolve => setTimeout(resolve, 800));

    const newAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + btoa(JSON.stringify({
      sub: '1234567890',
      username: tokenData.username,
      role: tokenData.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 900
    })) + '.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    setTokenData({
      ...tokenData,
      accessToken: newAccessToken,
      expiresAt: new Date(Date.now() + 900 * 1000).toISOString(),
    });
    setTimeRemaining(900);
    setIsLoading(false);
  };

  const copyToken = (type: 'access' | 'refresh') => {
    const token = type === 'access' ? tokenData.accessToken : tokenData.refreshToken;
    navigator.clipboard.writeText(token);
    setCopiedToken(type);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const decodePayload = () => {
    try {
      const payload = tokenData.accessToken.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (timeRemaining / 900) * 100;

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: Key },
    { id: 'structure' as Tab, label: 'Token Structure', icon: Code },
    { id: 'refresh' as Tab, label: 'Refresh Flow', icon: RefreshCw },
    { id: 'security' as Tab, label: 'Security', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-gray-900 dark:via-green-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Key className="w-10 h-10 md:w-12 md:h-12 text-green-600 dark:text-green-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">JWT Authentication Demo</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
            Learn how JSON Web Tokens work for stateless authentication
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 font-medium transition-all relative ${
                      activeTab === tab.id
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-green-400"></div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="space-y-6">
              {activeTab === 'overview' && (
                <>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">What is JWT?</h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base mb-6">
                      JWT (JSON Web Token) is a stateless authentication method. The token contains user data and is signed by the server,
                      eliminating the need for server-side session storage.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl p-5 border-2 border-green-200 dark:border-green-800">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      Advantages
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">•</span>
                        <span><strong>Server-less:</strong> No session storage needed</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">•</span>
                        <span><strong>Scales horizontally:</strong> Works across multiple servers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">•</span>
                        <span><strong>Mobile-friendly:</strong> Perfect for mobile apps</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-5 border-2 border-amber-200 dark:border-amber-800">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      Considerations
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 dark:text-amber-400">•</span>
                        <span><strong>Cannot revoke instantly:</strong> Valid until expiration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 dark:text-amber-400">•</span>
                        <span><strong>Larger token size:</strong> More data in headers</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border-2 border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Use Cases</h3>
                    <div className="flex flex-wrap gap-2">
                      {['APIs', 'Microservices', 'SPAs', 'Mobile Apps'].map((useCase) => (
                        <span key={useCase} className="px-3 py-1 bg-blue-600 dark:bg-blue-700 text-white rounded-full text-xs font-semibold">
                          {useCase}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'structure' && (
                <>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">JWT Structure</h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base mb-6">
                      JWT has 3 parts separated by dots (.)
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border-l-4 border-blue-500">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded flex items-center justify-center text-xs font-bold">1</div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">Header</h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Algorithm and token type</p>
                      <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs overflow-x-auto">
                        <code className="text-blue-400">{'{ "alg": "HS256", "typ": "JWT" }'}</code>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border-l-4 border-green-500">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-green-500 text-white rounded flex items-center justify-center text-xs font-bold">2</div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">Payload</h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">User data, claims, expiration</p>
                      <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs overflow-x-auto">
                        <code className="text-green-400">
                          {'{\n  "sub": "1234567890",\n  "username": "admin",\n  "exp": 1735603200\n}'}
                        </code>
                      </div>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-5 border-l-4 border-orange-500">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-orange-500 text-white rounded flex items-center justify-center text-xs font-bold">3</div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">Signature</h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">HMAC-SHA256(header.payload, secret)</p>
                      <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs overflow-x-auto">
                        <code className="text-orange-400">
                          SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
                        </code>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'refresh' && (
                <>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">Token Refresh Pattern</h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base mb-6">
                      Use refresh tokens to get new access tokens without re-authentication
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { step: 1, title: 'Access token sent with request', desc: 'Client includes JWT in Authorization header' },
                      { step: 2, title: 'Token expires (15 min)', desc: 'Short-lived for security' },
                      { step: 3, title: 'Use refresh token to get new access token', desc: 'Long-lived, securely stored' },
                      { step: 4, title: 'Continue with new token', desc: 'Seamless user experience' },
                    ].map((item, index) => (
                      <div key={item.step}>
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                            {item.step}
                          </div>
                          <div className="flex-1 pt-2">
                            <h3 className="font-semibold text-gray-800 dark:text-white text-sm md:text-base">{item.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.desc}</p>
                          </div>
                        </div>
                        {index < 3 && (
                          <div className="ml-5 h-6 w-0.5 bg-gradient-to-b from-green-300 to-emerald-300 dark:from-green-700 dark:to-emerald-700"></div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border-2 border-green-200 dark:border-green-800 mt-6">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Benefits</h3>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span>User stays logged in without re-entering password</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Short-lived access tokens minimize risk</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Refresh tokens can be revoked server-side</span>
                      </li>
                    </ul>
                  </div>
                </>
              )}

              {activeTab === 'security' && (
                <>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">Security Features</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border-2 border-blue-200 dark:border-blue-800">
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        Signature Verification
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        Prevents tampering - any modification invalidates the signature
                      </p>
                      <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs overflow-x-auto">
                        <code className="text-blue-400">
                          HMACSHA256(<br/>
                          &nbsp;&nbsp;base64UrlEncode(header) + "." +<br/>
                          &nbsp;&nbsp;base64UrlEncode(payload),<br/>
                          &nbsp;&nbsp;secret<br/>
                          )
                        </code>
                      </div>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-5 border-2 border-orange-200 dark:border-orange-800">
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        Expiration
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Auto-invalidates after time. Typical: 15 min access, 7 days refresh
                      </p>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border-2 border-green-200 dark:border-green-800">
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 text-green-600 dark:text-green-400" />
                        Refresh Tokens
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Separate long-lived token stored securely. Can be revoked server-side.
                      </p>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-5 border-2 border-red-200 dark:border-red-800">
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        Storage Warning
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        <strong>Never store in localStorage</strong> - vulnerable to XSS attacks
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        ✓ Use: httpOnly cookies, memory, secure storage (mobile)
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <Shield className="w-7 h-7 md:w-8 md:h-8 text-green-600 dark:text-green-400" />
              Try It Out
            </h2>

            {!isLoggedIn ? (
              <div className="space-y-5 md:space-y-6">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:border-green-500 dark:focus:border-green-400 focus:outline-none transition-colors text-sm md:text-base"
                    placeholder="admin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:border-green-500 dark:focus:border-green-400 focus:outline-none transition-colors text-sm md:text-base"
                    placeholder="password"
                  />
                </div>

                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating JWT...
                    </>
                  ) : (
                    <>
                      Login with JWT
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                  <p className="text-xs md:text-sm text-green-800 dark:text-green-300">
                    <strong>Demo credentials:</strong> admin / admin123
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5 md:space-y-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700 rounded-xl p-5 md:p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="w-7 h-7 md:w-8 md:h-8 text-green-600 dark:text-green-400" />
                    <h3 className="text-xl md:text-2xl font-bold text-green-800 dark:text-green-300">JWT Generated!</h3>
                  </div>
                  <p className="text-green-700 dark:text-green-300 text-base md:text-lg">
                    Logged in as <strong>{tokenData?.username}</strong>
                  </p>
                  <div className="mt-3 px-3 py-1 bg-green-600 text-white rounded-full text-xs font-semibold inline-block">
                    Demo Mode
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-xl p-5 md:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                      <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                      Token Expiration
                    </h3>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ease-linear ${
                        progressPercentage > 50 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                        progressPercentage > 25 ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
                        'bg-gradient-to-r from-red-500 to-red-600'
                      }`}
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Access token expires in {Math.floor(timeRemaining / 60)} minutes
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-700 border-2 border-green-200 dark:border-green-700 rounded-xl p-5 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                      <Key className="w-5 h-5 text-green-600 dark:text-green-400" />
                      Access Token
                    </h3>
                    <button
                      onClick={() => copyToken('access')}
                      className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-xs"
                    >
                      {copiedToken === 'access' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedToken === 'access' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 font-mono text-xs break-all max-h-32 overflow-y-auto">
                    {tokenData?.accessToken}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-700 border-2 border-emerald-200 dark:border-emerald-700 rounded-xl p-5 md:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Refresh Token</h3>
                    <button
                      onClick={() => copyToken('refresh')}
                      className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors text-xs"
                    >
                      {copiedToken === 'refresh' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedToken === 'refresh' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 font-mono text-xs break-all">
                    {tokenData?.refreshToken}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-700 border-2 border-green-200 dark:border-green-700 rounded-xl p-5 md:p-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Decoded Payload</h3>
                  <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                    <pre className="text-green-400">
                      {JSON.stringify(decodePayload(), null, 2)}
                    </pre>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh Token
                  </button>
                  <button
                    onClick={() => {
                      setIsLoggedIn(false);
                      setTokenData(null);
                      setError('');
                    }}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
