/**
 * OAuth 2.0 Demo Page
 * Based on SPECIFICATION Section 4.3, Section 8.3
 *
 * This page provides an interactive demonstration of OAuth 2.0 flow
 * showing how users can authenticate using an OAuth provider.
 *
 * Features:
 * - Visual OAuth flow diagram
 * - Step-by-step flow walkthrough
 * - Manual flow simulation
 * - Request/response inspection
 * - Educational explanations
 */

'use client';

import { useState } from 'react';
import { OAuthFlowDiagram } from '@/components/visualization/OAuthFlowDiagram';

interface FlowLog {
  timestamp: string;
  step: string;
  status: 'request' | 'response' | 'info' | 'error';
  message: string;
}

export default function OAuthDemoPage() {
  const [clientId, setClientId] = useState('mock-client-id');
  const [redirectUri, setRedirectUri] = useState('http://localhost:3000/api/auth/oauth/callback');
  const [scope, setScope] = useState('openid email profile');
  const [flowLogs, setFlowLogs] = useState<FlowLog[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [flowComplete, setFlowComplete] = useState(false);

  const addLog = (step: string, status: FlowLog['status'], message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setFlowLogs((prev) => [...prev, { timestamp, step, status, message }]);
  };

  const clearLogs = () => {
    setFlowLogs([]);
    setFlowComplete(false);
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
    clearLogs();
    addLog('Initialization', 'info', 'Starting OAuth 2.0 Authorization Code Flow...');

    try {
      // Step 1: Build authorize URL
      await new Promise((resolve) => setTimeout(resolve, 500));

      const authorizeUrl = new URL('/api/auth/oauth/authorize', window.location.origin);
      authorizeUrl.searchParams.append('client_id', clientId);
      authorizeUrl.searchParams.append('redirect_uri', redirectUri);
      authorizeUrl.searchParams.append('response_type', 'code');
      authorizeUrl.searchParams.append('scope', scope);
      authorizeUrl.searchParams.append('state', `state_${Math.random().toString(36).substring(7)}`);

      addLog('Step 1: Authorize', 'request', `GET ${authorizeUrl.pathname}?${authorizeUrl.searchParams.toString().substring(0, 80)}...`);

      // Step 2: Call authorize endpoint
      await new Promise((resolve) => setTimeout(resolve, 800));

      const authResponse = await fetch(authorizeUrl.toString());

      if (authResponse.redirected) {
        const redirectUrl = authResponse.url;
        const urlParams = new URL(redirectUrl).searchParams;
        const authCode = urlParams.get('code');

        addLog('Step 2: Authorize Response', 'response', `Redirected with code: ${authCode?.substring(0, 20)}...`);

        // Step 3: Exchange code for token
        await new Promise((resolve) => setTimeout(resolve, 800));

        addLog('Step 3: Token Exchange', 'request', `POST /api/auth/oauth/token with code, client_id, client_secret`);

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
          addLog('Step 3: Token Exchange Response', 'response', `Received access_token: ${tokenData.access_token?.substring(0, 20)}...`);

          // Step 4: Get callback
          await new Promise((resolve) => setTimeout(resolve, 800));

          addLog('Step 4: Get User Info', 'request', `GET /api/auth/oauth/callback?code=${authCode?.substring(0, 20)}...`);

          const callbackResponse = await fetch(`/api/auth/oauth/callback?code=${authCode}`);
          const callbackData = await callbackResponse.json();

          if (callbackResponse.ok) {
            addLog('Step 4: Callback Response', 'response', `User: ${callbackData.user.username}, Token: ${callbackData.token?.substring(0, 20)}...`);

            // Final success
            await new Promise((resolve) => setTimeout(resolve, 800));

            addLog('Success', 'info', `OAuth flow complete! User ${callbackData.user.username} authenticated.`);
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

  const getLogColor = (status: FlowLog['status']) => {
    switch (status) {
      case 'request':
        return 'bg-blue-50 border-l-4 border-l-blue-500';
      case 'response':
        return 'bg-green-50 border-l-4 border-l-green-500';
      case 'info':
        return 'bg-yellow-50 border-l-4 border-l-yellow-500';
      case 'error':
        return 'bg-red-50 border-l-4 border-l-red-500';
      default:
        return 'bg-gray-50 border-l-4 border-l-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">OAuth 2.0 Demo</h1>
          <p className="text-lg text-gray-600">
            Interactive demonstration of the OAuth 2.0 Authorization Code Flow
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - OAuth Flow Diagram */}
          <div className="lg:col-span-2">
            <OAuthFlowDiagram onFlowComplete={() => setFlowComplete(true)} />
          </div>

          {/* Right Column - Demo Form and Logs */}
          <div className="space-y-6">
            {/* Configuration Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Configuration</h2>

              <div className="space-y-4">
                {/* Client ID */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Client ID
                  </label>
                  <input
                    type="text"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    disabled={isSimulating}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="mock-client-id"
                  />
                </div>

                {/* Redirect URI */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Redirect URI
                  </label>
                  <input
                    type="text"
                    value={redirectUri}
                    onChange={(e) => setRedirectUri(e.target.value)}
                    disabled={isSimulating}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-sm"
                    placeholder="http://localhost:3000/callback"
                  />
                </div>

                {/* Scope */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Scope
                  </label>
                  <input
                    type="text"
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    disabled={isSimulating}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="openid email profile"
                  />
                </div>

                {/* Start Flow Button */}
                <button
                  onClick={startOAuthFlow}
                  disabled={isSimulating}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  {isSimulating ? 'Running Flow...' : 'Start OAuth Flow'}
                </button>

                {/* Status */}
                {flowComplete && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm font-semibold">✓ OAuth flow completed successfully!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Flow Logs */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Flow Logs</h2>
                <button
                  onClick={clearLogs}
                  className="text-sm px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                  Clear
                </button>
              </div>

              {flowLogs.length === 0 ? (
                <p className="text-gray-500 text-sm">Logs will appear here as the OAuth flow progresses...</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {flowLogs.map((log, idx) => (
                    <div key={idx} className={`p-3 rounded text-sm font-mono ${getLogColor(log.status)}`}>
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <div className="font-bold text-xs text-gray-600">{log.step}</div>
                          <div className="text-xs text-gray-700 mt-1 break-words">{log.message}</div>
                        </div>
                        <div className="text-xs text-gray-500 whitespace-nowrap">{log.timestamp}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* OAuth Flow Explanation */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">About OAuth 2.0</h2>
            <div className="text-gray-700 space-y-3 text-sm">
              <p>
                <strong>OAuth 2.0</strong> is an authorization protocol that allows users to grant applications access to their data at another service (like Google or GitHub) without sharing passwords.
              </p>
              <p>
                <strong>Key Benefits:</strong>
                <ul className="list-disc list-inside mt-2 ml-2">
                  <li>Users don&apos;t share passwords with your app</li>
                  <li>Permissions can be limited and revoked</li>
                  <li>Works across different platforms</li>
                  <li>Industry standard used by major providers</li>
                </ul>
              </p>
            </div>
          </div>

          {/* Security Recommendations */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Security Notes</h2>
            <div className="text-gray-700 space-y-3 text-sm">
              <p>
                <strong>This is a mock implementation.</strong> Production recommendations:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Always use HTTPS (never HTTP)</li>
                <li>Implement PKCE for public clients</li>
                <li>Validate state parameter to prevent CSRF</li>
                <li>Store tokens in HTTP-Only cookies</li>
                <li>Use real OAuth providers (Google, GitHub, etc.)</li>
                <li>Never expose client_secret in frontend code</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
