import { AlertCircle, ArrowRight, CheckCircle2, Link2, Lock, Settings, Shield, XCircle } from 'lucide-react';
import { useState } from 'react';

type Tab = 'overview' | 'flow' | 'pkce' | 'security';

type LogEntry = {
  id: number;
  type: 'request' | 'response' | 'error';
  message: string;
  timestamp: string;
};

export default function OAuthDemo() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [clientId, setClientId] = useState('demo_client_12345');
  const [redirectUri, setRedirectUri] = useState('https://example.com/callback');
  const [scope, setScope] = useState('read write profile');
  const [flowStarted, setFlowStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [flowComplete, setFlowComplete] = useState(false);

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: Link2 },
    { id: 'flow' as Tab, label: 'Authorization Flow', icon: ArrowRight },
    { id: 'pkce' as Tab, label: 'PKCE', icon: Lock },
    { id: 'security' as Tab, label: 'Security', icon: Shield },
  ];

  const flowSteps = [
    { num: 1, title: 'User clicks "Login with Google"', desc: 'Application initiates OAuth flow' },
    { num: 2, title: 'Redirected to Google consent screen', desc: 'User sees permission request' },
    { num: 3, title: 'User grants permission', desc: 'User approves requested scopes' },
    { num: 4, title: 'Google redirects with auth code', desc: 'Temporary authorization code returned' },
    { num: 5, title: 'Backend exchanges code for token', desc: 'Server-side token exchange' },
    { num: 6, title: 'App creates session', desc: 'User authenticated successfully' },
  ];

  const addLog = (type: LogEntry['type'], message: string) => {
    const newLog: LogEntry = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setLogs(prev => [...prev, newLog]);
  };

  const startOAuthFlow = async () => {
    setFlowStarted(true);
    setCurrentStep(0);
    setLogs([]);
    setIsProcessing(true);
    setFlowComplete(false);

    addLog('request', `GET /authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentStep(1);

    addLog('response', 'Redirecting to authorization server...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentStep(2);

    addLog('request', 'User authenticates with credentials');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentStep(3);

    addLog('response', `User grants permissions: ${scope}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentStep(4);

    const authCode = 'auth_code_' + Math.random().toString(36).substring(2, 15);
    addLog('response', `Authorization code generated: ${authCode}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentStep(5);

    addLog('request', `POST /token - Body: { code: "${authCode}", client_id: "${clientId}", grant_type: "authorization_code" }`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentStep(6);

    const accessToken = 'acc_tok_' + Math.random().toString(36).substring(2, 25);
    addLog('response', `✓ Access token received: ${accessToken}`);
    addLog('response', '✓ Refresh token received: ref_tok_xyz123...');
    addLog('response', `✓ Token expires in: 3600 seconds`);

    setIsProcessing(false);
    setFlowComplete(true);
  };

  const resetFlow = () => {
    setFlowStarted(false);
    setCurrentStep(0);
    setLogs([]);
    setIsProcessing(false);
    setFlowComplete(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Link2 className="w-10 h-10 md:w-12 md:h-12 text-purple-600 dark:text-purple-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">OAuth 2.0 Demo</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
            Learn how OAuth 2.0 authorization flow works for secure third-party access
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
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400"></div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="space-y-6">
              {activeTab === 'overview' && (
                <>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">What is OAuth 2.0?</h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base mb-6">
                      OAuth is <strong>authorization</strong>, not authentication. It allows apps to access user data without passwords.
                      Users grant limited permissions that can be revoked at any time.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950 rounded-xl p-5 border-2 border-purple-200 dark:border-purple-800">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Popular Providers</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Google', 'GitHub', 'Facebook', 'Auth0', 'Microsoft'].map((provider) => (
                        <span key={provider} className="px-3 py-1 bg-purple-600 dark:bg-purple-700 text-white rounded-full text-xs font-semibold">
                          {provider}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border-2 border-green-200 dark:border-green-800">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      Key Benefits
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">•</span>
                        <span><strong>No password sharing:</strong> Never share credentials with third parties</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">•</span>
                        <span><strong>Limited permissions:</strong> Grant only necessary access</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">•</span>
                        <span><strong>Revokable:</strong> Users can revoke access anytime</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border-2 border-blue-200 dark:border-blue-800">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Common Use Cases</h3>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400">→</span>
                        <span>"Login with Google/Facebook"</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400">→</span>
                        <span>Third-party app integrations (Zapier, IFTTT)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400">→</span>
                        <span>Mobile app authentication</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400">→</span>
                        <span>API access delegation</span>
                      </li>
                    </ul>
                  </div>
                </>
              )}

              {activeTab === 'flow' && (
                <>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">Authorization Code Flow</h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base mb-6">
                      The most secure OAuth 2.0 flow for web applications with a backend server.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {flowSteps.map((step, index) => (
                      <div key={step.num}>
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                            {step.num}
                          </div>
                          <div className="flex-1 pt-2">
                            <h3 className="font-semibold text-gray-800 dark:text-white text-sm md:text-base">{step.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{step.desc}</p>
                          </div>
                        </div>
                        {index < flowSteps.length - 1 && (
                          <div className="ml-5 h-6 w-0.5 bg-gradient-to-b from-purple-300 to-violet-300 dark:from-purple-700 dark:to-violet-700"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'pkce' && (
                <>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">PKCE</h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base mb-2">
                      <strong>Proof Key for Code Exchange</strong>
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base mb-6">
                      An extension to the authorization code flow that prevents interception attacks.
                    </p>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-5 border-2 border-red-200 dark:border-red-800 mb-4">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      The Problem
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Public clients (mobile apps, SPAs) cannot securely store client secrets. Authorization codes can be intercepted.
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border-2 border-green-200 dark:border-green-800">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      The Solution
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      Generate a random code, hash it, and send the hash with the authorization request:
                    </p>
                    <div className="space-y-3">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                        <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">Step 1: Generate</div>
                        <code className="text-xs text-gray-700 dark:text-gray-300">code_verifier = random(43-128 chars)</code>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                        <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">Step 2: Hash</div>
                        <code className="text-xs text-gray-700 dark:text-gray-300">code_challenge = SHA256(code_verifier)</code>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                        <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">Step 3: Exchange</div>
                        <code className="text-xs text-gray-700 dark:text-gray-300">Send code_verifier with token request</code>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border-2 border-blue-200 dark:border-blue-800 mt-4">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Benefits</h3>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>Prevents authorization code interception attacks</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>No client secret required</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>Recommended for all OAuth clients</span>
                      </li>
                    </ul>
                  </div>
                </>
              )}

              {activeTab === 'security' && (
                <>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">Security Considerations</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border-2 border-blue-200 dark:border-blue-800">
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        HTTPS Required
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        All OAuth flows MUST use HTTPS to prevent token interception. Never use OAuth over HTTP in production.
                      </p>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-5 border-2 border-purple-200 dark:border-purple-800">
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        State Parameter
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Prevents CSRF attacks by including a random state value:
                      </p>
                      <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs overflow-x-auto">
                        <code className="text-purple-400">
                          state = random_string()<br/>
                          /authorize?...&state={'{state}'}
                        </code>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-5 border-2 border-green-200 dark:border-green-800">
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Redirect URI Validation</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Server MUST validate redirect_uri matches registered value to prevent authorization code theft.
                      </p>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-5 border-2 border-red-200 dark:border-red-800">
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        Never Expose Client Secret
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Client secrets must NEVER be included in frontend code. Always exchange authorization codes on the backend.
                      </p>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-5 border-2 border-amber-200 dark:border-amber-800">
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Token Storage</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Best practices for storing OAuth tokens:
                      </p>
                      <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span>httpOnly cookies (web)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span>Secure keychain (mobile)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                          <span>Never in localStorage (XSS risk)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Settings className="w-7 h-7 md:w-8 md:h-8 text-purple-600 dark:text-purple-400" />
                Live Demo
              </h2>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold">
                Demo Mode
              </span>
            </div>

            {!flowStarted ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Client ID
                  </label>
                  <input
                    type="text"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-colors text-sm"
                    placeholder="demo_client_12345"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Unique identifier for your application</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Redirect URI
                  </label>
                  <input
                    type="text"
                    value={redirectUri}
                    onChange={(e) => setRedirectUri(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-colors text-sm"
                    placeholder="https://example.com/callback"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Where to send the authorization code</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Scope
                  </label>
                  <input
                    type="text"
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-colors text-sm"
                    placeholder="read write profile"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Permissions requested (space-separated)</p>
                </div>

                <button
                  onClick={startOAuthFlow}
                  className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  Start OAuth Flow
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {flowSteps.map((step, index) => (
                    <div
                      key={step.num}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        currentStep >= index + 1
                          ? 'bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-300 dark:border-purple-700'
                          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            currentStep >= index + 1
                              ? 'bg-gradient-to-br from-purple-500 to-violet-600 text-white'
                              : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                          }`}
                        >
                          {currentStep > index + 1 ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                        </div>
                        <span className="text-xs font-semibold text-gray-800 dark:text-white">Step {step.num}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{step.title}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-900 rounded-xl p-4 h-[300px] md:h-[400px] overflow-y-auto font-mono text-sm">
                  {logs.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      Starting OAuth flow...
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {logs.map((log) => (
                        <div key={log.id} className="flex items-start gap-3">
                          <span className="text-gray-500 text-xs flex-shrink-0">{log.timestamp}</span>
                          <div className="flex-1 text-xs">
                            {log.type === 'request' && (
                              <div className="text-blue-400">
                                <span className="text-blue-300">→</span> {log.message}
                              </div>
                            )}
                            {log.type === 'response' && (
                              <div className="text-green-400">
                                <span className="text-green-300">←</span> {log.message}
                              </div>
                            )}
                            {log.type === 'error' && (
                              <div className="text-red-400 flex items-start gap-2">
                                <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                {log.message}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {flowComplete && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700 rounded-xl p-5 animate-[fadeIn_0.5s_ease-in]">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                      <h3 className="text-xl font-bold text-green-800 dark:text-green-300">OAuth Flow Complete!</h3>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Access token received successfully. User is now authenticated.
                    </p>
                  </div>
                )}

                <button
                  onClick={resetFlow}
                  disabled={isProcessing}
                  className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-4 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 text-sm md:text-base"
                >
                  {isProcessing ? 'Processing...' : 'Reset Flow'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
