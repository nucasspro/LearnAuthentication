/**
 * MFA Demo Page
 * Interactive demonstration of Multi-Factor Authentication (MFA/2FA)
 *
 * This page provides a comprehensive demonstration of TOTP-based 2FA
 * including setup, verification, and authenticator app simulation.
 *
 * Reference: SPECIFICATION Section 4.4, RFC 6238
 */

'use client';

import { useState } from 'react';
import { TOTPSetup } from '@/components/demo/TOTPSetup';
import { AuthenticatorSimulator } from '@/components/demo/AuthenticatorSimulator';

export default function MFADemoPage() {
  const [selectedUserId] = useState(1); // Default to admin user
  const [mfaSecret, setMfaSecret] = useState<string | null>(null);
  const [setupComplete, setSetupComplete] = useState(false);

  // Fetch setup data to get secret for simulator
  const handleSetupStart = async () => {
    try {
      const response = await fetch('/api/auth/mfa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUserId }),
      });

      const data = await response.json();

      if (response.ok) {
        setMfaSecret(data.secret);
      }
    } catch (error) {
      console.error('Failed to fetch MFA secret:', error);
    }
  };

  const handleSetupSuccess = () => {
    setSetupComplete(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Multi-Factor Authentication (MFA/2FA) Demo
          </h1>
          <p className="text-lg text-gray-600">
            Learn how Time-based One-Time Passwords (TOTP) protect your account
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Education */}
          <div className="lg:col-span-1 space-y-6">
            {/* What is MFA? */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">What is MFA?</h2>
              <div className="text-gray-700 space-y-3 text-sm">
                <p>
                  <strong>Multi-Factor Authentication (MFA)</strong> adds an extra layer of
                  security by requiring two forms of identification:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>
                    <strong>Something you know</strong> - Your password
                  </li>
                  <li>
                    <strong>Something you have</strong> - Your phone/authenticator app
                  </li>
                </ol>
                <p>
                  Even if someone steals your password, they can&apos;t access your account
                  without the second factor.
                </p>
              </div>
            </div>

            {/* How TOTP Works */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">How TOTP Works</h2>
              <div className="text-gray-700 space-y-3 text-sm">
                <p>
                  <strong>TOTP (Time-based One-Time Password)</strong> generates 6-digit codes
                  that change every 30 seconds.
                </p>
                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                  <p className="font-mono text-xs">
                    Code = HMAC-SHA1(SecretKey, CurrentTime/30)
                  </p>
                </div>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Server and app share a secret key</li>
                  <li>Both generate the same code using current time</li>
                  <li>Code expires every 30 seconds</li>
                  <li>Works offline (no internet needed)</li>
                </ul>
                <p className="text-xs text-gray-600">
                  Reference: RFC 6238 - TOTP Algorithm
                </p>
              </div>
            </div>

            {/* Setup Flow */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Setup Flow</h2>
              <div className="text-gray-700 space-y-2 text-sm">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <p>Server generates random secret key</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <p>QR code created with secret encoded</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <p>User scans QR with authenticator app</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                  <p>App generates 6-digit codes</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    5
                  </div>
                  <p>User enters code to verify setup</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    6
                  </div>
                  <p>MFA enabled &amp; backup codes saved</p>
                </div>
              </div>
            </div>

            {/* Recovery Codes */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Backup Codes</h2>
              <div className="text-gray-700 space-y-3 text-sm">
                <p>
                  <strong>Backup codes</strong> are one-time use codes for account recovery:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>10 codes generated during setup</li>
                  <li>Each code can be used only once</li>
                  <li>Use if you lose your phone</li>
                  <li>Store securely (password manager)</li>
                  <li>Can regenerate if all used</li>
                </ul>
                <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                  <p className="text-xs text-yellow-900">
                    ⚠ Important: Save backup codes immediately after setup. They are shown only
                    once!
                  </p>
                </div>
              </div>
            </div>

            {/* Compatible Apps */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Compatible Apps</h2>
              <div className="text-gray-700 space-y-2 text-sm">
                <p className="mb-2">Popular authenticator apps:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <span>📱</span>
                    <span className="font-semibold">Google Authenticator</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <span>🔐</span>
                    <span className="font-semibold">Microsoft Authenticator</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <span>🛡️</span>
                    <span className="font-semibold">Authy</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <span>🔑</span>
                    <span className="font-semibold">1Password</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Setup Component */}
          <div className="lg:col-span-1">
            <TOTPSetup userId={selectedUserId} onSuccess={handleSetupSuccess} />

            {setupComplete && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-semibold mb-2">✓ Setup Complete!</p>
                <p className="text-green-700 text-sm">
                  You can now log in with 2FA enabled. The login endpoint will require both
                  password and TOTP code.
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Authenticator Simulator */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Live Authenticator</h2>
              <p className="text-gray-600 text-sm mb-4">
                This simulates what you&apos;d see in Google Authenticator or similar apps:
              </p>

              {!mfaSecret ? (
                <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600 mb-4">
                    Click &quot;Generate Secret&quot; in the setup panel to see live TOTP codes
                  </p>
                  <button
                    onClick={handleSetupStart}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Setup
                  </button>
                </div>
              ) : (
                <AuthenticatorSimulator secret={mfaSecret} accountName="admin@example.com" />
              )}
            </div>

            {/* Security Notes */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Security Benefits</h2>
              <div className="text-gray-700 space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <p>Protects against password theft</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <p>Prevents phishing attacks</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <p>Works offline (no SMS required)</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <p>Industry standard (RFC 6238)</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <p>Used by major platforms</p>
                </div>
              </div>
            </div>

            {/* Production Notes */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Production Tips</h2>
              <div className="text-gray-700 space-y-2 text-sm">
                <p className="font-semibold mb-2">Best Practices:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Rate limit verification attempts (5 max)</li>
                  <li>Lock account after failed attempts</li>
                  <li>Encrypt TOTP secrets in database</li>
                  <li>Log all MFA events for audit</li>
                  <li>Email user when MFA is enabled/disabled</li>
                  <li>Provide recovery options (email, SMS)</li>
                  <li>Support hardware keys (U2F/WebAuthn)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
