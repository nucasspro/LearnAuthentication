/**
 * OAuth 2.0 Demo Page
 * Based on SPECIFICATION Section 4.3, Section 8.3
 *
 * This page provides an interactive demonstration of OAuth 2.0 flow
 * showing how users can authenticate using an OAuth provider.
 *
 * Features:
 * - Visual OAuth flow diagram with step tracking
 * - Educational content (overview, flow, PKCE, security)
 * - Manual flow simulation
 * - Request/response inspection
 * - Purple/violet themed UI
 * - Dark mode support
 */

'use client';

import { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Link2,
  Lock,
  Settings,
  Shield,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { Card, CardContent } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';

type Tab = 'overview' | 'flow' | 'pkce' | 'security';

interface FlowLog {
  timestamp: string;
  step: string;
  status: 'request' | 'response' | 'info' | 'error';
  message: string;
}

export default function OAuthDemoPage() {
  // Configuration state
  const [clientId, setClientId] = useState('mock-client-id');
  const [redirectUri, setRedirectUri] = useState('http://localhost:3000/api/auth/oauth/callback');
  const [scope, setScope] = useState('openid email profile');

  // Flow state
  const [flowLogs, setFlowLogs] = useState<FlowLog[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [flowComplete, setFlowComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [flowStarted, setFlowStarted] = useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: Link2 },
    { id: 'flow' as Tab, label: 'Authorization Flow', icon: ArrowRight },
    { id: 'pkce' as Tab, label: 'PKCE', icon: Lock },
    { id: 'security' as Tab, label: 'Security', icon: Shield },
  ];

  const flowSteps = [
    { num: 1, title: 'User initiates login', desc: 'Application starts OAuth flow' },
    { num: 2, title: 'Redirect to auth server', desc: 'User sees consent screen' },
    { num: 3, title: 'User grants permission', desc: 'User approves requested scopes' },
    { num: 4, title: 'Authorization code returned', desc: 'Temporary code in redirect' },
    { num: 5, title: 'Exchange code for token', desc: 'Server-side token exchange' },
    { num: 6, title: 'Session created', desc: 'User authenticated successfully' },
  ];

  const addLog = (step: string, status: FlowLog['status'], message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setFlowLogs((prev) => [...prev, { timestamp, step, status, message }]);
  };

  const clearLogs = () => {
    setFlowLogs([]);
    setFlowComplete(false);
    setCurrentStep(0);
    setFlowStarted(false);
  };

  const startOAuthFlow = async () => {
    // Validation
    if (!clientId.trim() || !redirectUri.trim()) {
      addLog('Validation', 'error', 'Please fill in all required fields');
      return;
    }

    if (!redirectUri.includes('callback')) {
      addLog('Validation', 'error', 'Redirect URI must point to /callback endpoint');
      return;
    }

    setIsSimulating(true);
    setFlowStarted(true);
    clearLogs();
    setCurrentStep(0);
    addLog('Initialization', 'info', 'Starting OAuth 2.0 Authorization Code Flow...');

    try {
      // Step 1: Build authorize URL
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCurrentStep(1);

      const authorizeUrl = new URL('/api/auth/oauth/authorize', window.location.origin);
      authorizeUrl.searchParams.append('client_id', clientId);
      authorizeUrl.searchParams.append('redirect_uri', redirectUri);
      authorizeUrl.searchParams.append('response_type', 'code');
      authorizeUrl.searchParams.append('scope', scope);
      authorizeUrl.searchParams.append('state', `state_${Math.random().toString(36).substring(7)}`);

      addLog('Step 1: Authorize', 'request', `GET ${authorizeUrl.pathname}?${authorizeUrl.searchParams.toString().substring(0, 80)}...`);

      // Step 2: Call authorize endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCurrentStep(2);

      const authResponse = await fetch(authorizeUrl.toString());

      if (authResponse.redirected) {
        const redirectUrl = authResponse.url;
        const urlParams = new URL(redirectUrl).searchParams;
        const authCode = urlParams.get('code');

        addLog('Step 2: Authorize Response', 'response', `Redirected with code: ${authCode?.substring(0, 20)}...`);

        // Step 3: User authentication simulation
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCurrentStep(3);
        addLog('Step 3: User Authentication', 'info', 'User authenticates with credentials');

        // Step 4: User grants permissions
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCurrentStep(4);
        addLog('Step 4: User Grants Permissions', 'response', `User grants permissions: ${scope}`);

        // Step 5: Exchange code for token
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCurrentStep(5);

        addLog('Step 5: Token Exchange', 'request', `POST /api/auth/oauth/token with code, client_id, client_secret`);

        const tokenResponse = await fetch('/api/auth/oauth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            grant_type: 'authorization_code',
            code: authCode,
            client_id: clientId,
            client_secret: 'mock-client-secret',
            redirect_uri: redirectUri,
          }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenResponse.ok) {
          addLog('Step 5: Token Exchange Response', 'response', `Received access_token: ${tokenData.access_token?.substring(0, 20)}...`);
          addLog('Step 5: Token Exchange Response', 'response', 'Received refresh_token: ref_tok_xyz123...');
          addLog('Step 5: Token Exchange Response', 'response', 'Token expires in: 3600 seconds');

          // Step 6: Get callback
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setCurrentStep(6);

          addLog('Step 6: Get User Info', 'request', `GET /api/auth/oauth/callback?code=${authCode?.substring(0, 20)}...`);

          const callbackResponse = await fetch(`/api/auth/oauth/callback?code=${authCode}`);
          const callbackData = await callbackResponse.json();

          if (callbackResponse.ok) {
            addLog('Step 6: Callback Response', 'response', `User: ${callbackData.user.username}, Token: ${callbackData.token?.substring(0, 20)}...`);

            // Final success
            await new Promise((resolve) => setTimeout(resolve, 500));

            addLog('Success', 'info', `✓ OAuth flow complete! User ${callbackData.user.username} authenticated.`);
            setFlowComplete(true);
          } else {
            addLog('Error', 'error', `Callback failed: ${callbackData.error}`);
          }
        } else {
          addLog('Error', 'error', `Token exchange failed: ${tokenData.error}`);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog('Error', 'error', `Flow error: ${errorMessage}`);
    } finally {
      setIsSimulating(false);
    }
  };

  const resetFlow = () => {
    clearLogs();
    setIsSimulating(false);
    setFlowComplete(false);
    setCurrentStep(0);
    setFlowStarted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Link2 className="w-10 h-10 md:w-12 md:h-12 text-purple-600 dark:text-purple-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">OAuth 2.0 Demo</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
            Learn how OAuth 2.0 authorization flow works for secure third-party access
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
          {/* Left Panel - Educational Tabs */}
          <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
            <CardContent className="p-0">
              <div className="p-6 md:p-8">
                {/* Tabs */}
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

                {/* Tab Content */}
                <div className="space-y-6">
                  {/* Overview Tab */}
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
                            <span>&quot;Login with Google/Facebook&quot;</span>
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

                  {/* Flow Tab */}
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

                  {/* PKCE Tab */}
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

                  {/* Security Tab */}
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
            </CardContent>
          </Card>

          {/* Right Panel - Live Demo */}
          <Card className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
            <CardContent className="p-0">
              <div className="p-6 md:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <Settings className="w-7 h-7 md:w-8 md:h-8 text-purple-600 dark:text-purple-400" />
                    Live Demo
                  </h2>
                  <Badge variant="success" size="sm">
                    Demo Mode
                  </Badge>
                </div>

                {/* Configuration Form or Flow Visualization */}
                {!flowStarted ? (
                  <div className="space-y-5">
                    <Input
                      label="Client ID"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      placeholder="mock-client-id"
                      helperText="Unique identifier for your application"
                      disabled={isSimulating}
                    />

                    <Input
                      label="Redirect URI"
                      value={redirectUri}
                      onChange={(e) => setRedirectUri(e.target.value)}
                      placeholder="http://localhost:3000/callback"
                      helperText="Where to send the authorization code"
                      disabled={isSimulating}
                    />

                    <Input
                      label="Scope"
                      value={scope}
                      onChange={(e) => setScope(e.target.value)}
                      placeholder="openid email profile"
                      helperText="Permissions requested (space-separated)"
                      disabled={isSimulating}
                    />

                    <button
                      onClick={startOAuthFlow}
                      disabled={isSimulating}
                      className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSimulating ? 'Starting Flow...' : 'Start OAuth Flow'}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Flow Steps Progress */}
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

                    {/* Flow Logs */}
                    <div className="bg-gray-900 rounded-xl p-4 h-[300px] md:h-[400px] overflow-y-auto font-mono text-sm">
                      {flowLogs.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          Starting OAuth flow...
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {flowLogs.map((log, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <span className="text-gray-500 text-xs flex-shrink-0">{log.timestamp}</span>
                              <div className="flex-1 text-xs">
                                {log.status === 'request' && (
                                  <div className="text-blue-400">
                                    <span className="text-blue-300">→</span> {log.message}
                                  </div>
                                )}
                                {log.status === 'response' && (
                                  <div className="text-green-400">
                                    <span className="text-green-300">←</span> {log.message}
                                  </div>
                                )}
                                {log.status === 'info' && (
                                  <div className="text-yellow-400">
                                    <span className="text-yellow-300">ℹ</span> {log.message}
                                  </div>
                                )}
                                {log.status === 'error' && (
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

                    {/* Success Message */}
                    {flowComplete && (
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700 rounded-xl p-5 animate-fade-in">
                        <div className="flex items-center gap-3 mb-2">
                          <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                          <h3 className="text-xl font-bold text-green-800 dark:text-green-300">OAuth Flow Complete!</h3>
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Access token received successfully. User is now authenticated.
                        </p>
                      </div>
                    )}

                    {/* Reset Button */}
                    <button
                      onClick={resetFlow}
                      disabled={isSimulating}
                      className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold py-4 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                    >
                      {isSimulating ? 'Processing...' : 'Reset Flow'}
                    </button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
