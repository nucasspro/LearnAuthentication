/**
 * MFA/2FA Learning Page
 * Comprehensive guide to Multi-Factor Authentication
 * Reference: SPECIFICATION Section 4.4, RFC 6238
 */

'use client';

import { Button } from '@/components/shared';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LearnMFAPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Multi-Factor Authentication (MFA/2FA)
          </h1>
          <p className="text-xl text-gray-600">
            Learn how TOTP-based two-factor authentication adds an extra layer of security
          </p>
          <div className="mt-4 flex gap-3">
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
              RFC 6238
            </span>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
              TOTP
            </span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
              Security
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* What is MFA */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What is MFA/2FA?</h2>

            <div className="space-y-4 text-gray-700">
              <p className="text-lg leading-relaxed">
                Multi-Factor Authentication (MFA) requires users to provide <strong>two or more verification factors</strong> to gain access. Two-Factor Authentication (2FA) is a subset of MFA that specifically uses two factors.
              </p>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-6 my-6">
                <h3 className="font-bold text-orange-900 mb-3 text-lg">The Three Factor Categories</h3>
                <div className="space-y-3 text-orange-800">
                  <div className="flex gap-3">
                    <span className="text-2xl">🧠</span>
                    <div>
                      <strong>Something You Know</strong>
                      <p className="text-sm text-orange-700">Password, PIN, security question answer</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-2xl">📱</span>
                    <div>
                      <strong>Something You Have</strong>
                      <p className="text-sm text-orange-700">Phone, hardware key (YubiKey), authenticator app</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-2xl">👤</span>
                    <div>
                      <strong>Something You Are</strong>
                      <p className="text-sm text-orange-700">Fingerprint, face recognition, iris scan</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-6">
                <h3 className="font-bold text-blue-900 mb-3 text-lg">Why MFA Matters</h3>
                <p className="text-blue-800 mb-2">
                  Even if an attacker steals your password (phishing, data breach, keylogger), they still can&apos;t access your account without the second factor.
                </p>
                <div className="text-sm text-blue-700 mt-3">
                  <p><strong>Statistics:</strong> MFA blocks 99.9% of automated attacks (Microsoft, 2019)</p>
                </div>
              </div>
            </div>
          </section>

          {/* MFA vs 2FA */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">MFA vs 2FA</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-purple-500 bg-purple-50 p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-2">Multi-Factor Authentication (MFA)</h3>
                <ul className="text-purple-800 space-y-2 text-sm">
                  <li>✓ <strong>Factors:</strong> 2 or more</li>
                  <li>✓ <strong>Examples:</strong> Password + phone + fingerprint</li>
                  <li>✓ <strong>Use:</strong> High-security environments</li>
                  <li>✓ <strong>Flexibility:</strong> Can add more factors as needed</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue-500 bg-blue-50 p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">Two-Factor Authentication (2FA)</h3>
                <ul className="text-blue-800 space-y-2 text-sm">
                  <li>✓ <strong>Factors:</strong> Exactly 2</li>
                  <li>✓ <strong>Examples:</strong> Password + TOTP code</li>
                  <li>✓ <strong>Use:</strong> Standard web applications</li>
                  <li>✓ <strong>Balance:</strong> Security + convenience</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-900 text-sm">
                <strong>Note:</strong> The terms MFA and 2FA are often used interchangeably in common usage. Most web applications implement 2FA (password + TOTP), which is a form of MFA.
              </p>
            </div>
          </section>

          {/* TOTP */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">TOTP (Time-based One-Time Password)</h2>

            <p className="text-gray-700 mb-6">
              TOTP (RFC 6238) is the industry-standard algorithm for generating time-based codes. It&apos;s what powers Google Authenticator, Authy, and most authenticator apps.
            </p>

            <div className="bg-orange-50 border-l-4 border-orange-500 p-6 mb-6">
              <h3 className="font-bold text-orange-900 mb-3 text-lg">How TOTP Works</h3>
              <ol className="space-y-3 text-orange-800">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                  <div>
                    <strong>Shared Secret:</strong> Server and app share a random secret during setup
                    <code className="block mt-1 text-xs bg-orange-100 p-2 rounded">
                      secret = &quot;JBSWY3DPEHPK3PXP&quot; (Base32 encoded)
                    </code>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                  <div>
                    <strong>Time-Based Counter:</strong> Current Unix time divided by 30 seconds
                    <code className="block mt-1 text-xs bg-orange-100 p-2 rounded">
                      counter = Math.floor(Date.now() / 1000 / 30)
                    </code>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                  <div>
                    <strong>Generate Code:</strong> HMAC-SHA1 hash of secret + counter
                    <code className="block mt-1 text-xs bg-orange-100 p-2 rounded">
                      hash = HMAC-SHA1(secret, counter)
                    </code>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                  <div>
                    <strong>Extract 6 Digits:</strong> Take last 4 bits to select offset, extract 6-digit code
                    <code className="block mt-1 text-xs bg-orange-100 p-2 rounded">
                      code = extractDigits(hash) → &quot;123456&quot;
                    </code>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">5</span>
                  <div>
                    <strong>Code Changes:</strong> New code generated every 30 seconds
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-6">
              <h3 className="font-bold text-green-900 mb-3">Why TOTP?</h3>
              <ul className="text-green-800 space-y-2 text-sm">
                <li>✓ <strong>Works Offline:</strong> No internet or SMS required</li>
                <li>✓ <strong>More Secure than SMS:</strong> Not vulnerable to SIM swap attacks</li>
                <li>✓ <strong>Industry Standard:</strong> Supported by all major services</li>
                <li>✓ <strong>Free:</strong> Many free authenticator apps available</li>
                <li>✓ <strong>Fast:</strong> No network latency</li>
              </ul>
            </div>
          </section>

          {/* MFA Setup Flow */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">MFA Setup Flow</h2>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-6">
              <h3 className="font-bold text-amber-900 mb-3 text-lg">Step-by-Step Enrollment</h3>
              <ol className="space-y-4 text-amber-800">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                  <div>
                    <strong>User Enables MFA:</strong> Clicks &quot;Enable 2FA&quot; in account settings
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                  <div>
                    <strong>Server Generates Secret:</strong> Creates random 160-bit (20-byte) secret
                    <code className="block mt-1 text-xs bg-amber-100 p-2 rounded">
                      secret = crypto.randomBytes(20).toString(&apos;base32&apos;)
                    </code>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                  <div>
                    <strong>Secret Encoded as QR Code:</strong> User scans with authenticator app
                    <p className="text-sm mt-1">QR contains: <code className="bg-amber-100 px-1">otpauth://totp/YourApp:user@email.com?secret=SECRET&issuer=YourApp</code></p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                  <div>
                    <strong>User Scans QR:</strong> App stores secret locally on phone
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">5</span>
                  <div>
                    <strong>App Shows 6-Digit Code:</strong> Updates every 30 seconds
                    <div className="mt-2 text-center">
                      <span className="text-3xl font-mono font-bold text-amber-900 bg-amber-100 px-4 py-2 rounded">123 456</span>
                      <p className="text-xs mt-1">Updates in 25s</p>
                    </div>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">6</span>
                  <div>
                    <strong>User Enters Code to Verify:</strong> Confirms app works correctly
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">7</span>
                  <div>
                    <strong>Server Validates Code:</strong> Compares with server-generated code
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">8</span>
                  <div>
                    <strong>MFA Enabled:</strong> Server marks user.mfaEnabled = true
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">9</span>
                  <div>
                    <strong>Backup Codes Generated:</strong> 10 one-time recovery codes shown
                    <div className="mt-2 grid grid-cols-2 gap-1 text-xs font-mono bg-amber-100 p-2 rounded">
                      <div>ABCD-1234</div>
                      <div>EFGH-5678</div>
                      <div>IJKL-9012</div>
                      <div>MNOP-3456</div>
                      <div>...</div>
                    </div>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">10</span>
                  <div>
                    <strong>User Saves Backup Codes:</strong> Downloads/copies to safe location
                  </div>
                </li>
              </ol>
            </div>
          </section>

          {/* Backup Codes */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Backup Codes</h2>

            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 bg-blue-50 p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">What Are Backup Codes?</h3>
                <p className="text-blue-800 text-sm mb-3">
                  Backup codes are one-time use recovery codes (typically 10) generated during MFA setup. They allow account access if:
                </p>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Phone is lost or broken</li>
                  <li>• Authenticator app uninstalled or data lost</li>
                  <li>• New phone without backup</li>
                  <li>• Device factory reset</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 bg-orange-50 p-6">
                <h3 className="text-xl font-bold text-orange-900 mb-2">Security Properties</h3>
                <ul className="text-orange-800 space-y-2 text-sm">
                  <li>✓ <strong>Single-use:</strong> Each code valid only once</li>
                  <li>✓ <strong>Format:</strong> Typically 8-10 characters (XXXX-XXXX)</li>
                  <li>✓ <strong>Quantity:</strong> Usually 10 codes provided</li>
                  <li>✓ <strong>Tracking:</strong> Server tracks which codes have been used</li>
                  <li>✓ <strong>Regeneration:</strong> User can generate new set (invalidates old)</li>
                </ul>
              </div>

              <div className="border-l-4 border-red-500 bg-red-50 p-6">
                <h3 className="text-xl font-bold text-red-900 mb-2">⚠️ Storage Best Practices</h3>
                <div className="text-red-800 space-y-2 text-sm">
                  <p><strong>✓ Good:</strong> Password manager, printed in safe, encrypted file</p>
                  <p><strong>✗ Bad:</strong> Email, cloud notes, unencrypted text file</p>
                  <p><strong>Critical:</strong> Codes shown only ONCE during setup. Save immediately!</p>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-6">
                <h3 className="font-bold text-green-900 mb-3">Recovery Flow with Backup Code</h3>
                <ol className="text-green-800 space-y-2 text-sm">
                  <li>1. User tries to login but lost phone/app</li>
                  <li>2. Clicks &quot;Use backup code&quot; option</li>
                  <li>3. Enters one of the 10 backup codes</li>
                  <li>4. Server validates code and marks it as used</li>
                  <li>5. User logged in successfully</li>
                  <li>6. User should regenerate MFA secret (new QR code + new backup codes)</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Compatible Apps */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Compatible Authenticator Apps</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">📱 Google Authenticator</h3>
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Platform:</strong> iOS, Android
                </p>
                <p className="text-gray-600 text-sm">
                  Free, simple, no cloud sync. Best for single device users.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🔵 Microsoft Authenticator</h3>
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Platform:</strong> iOS, Android, Windows
                </p>
                <p className="text-gray-600 text-sm">
                  Free, cloud backup, push notifications. Feature-rich.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🔴 Authy</h3>
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Platform:</strong> iOS, Android, Desktop
                </p>
                <p className="text-gray-600 text-sm">
                  Free, multi-device sync, encrypted backups. Popular choice.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🔑 1Password</h3>
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Platform:</strong> All platforms
                </p>
                <p className="text-gray-600 text-sm">
                  Paid, integrated with password manager. Convenient.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🔓 LastPass Authenticator</h3>
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Platform:</strong> iOS, Android
                </p>
                <p className="text-gray-600 text-sm">
                  Free, cloud backup, one-tap verification.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🆓 FreeOTP</h3>
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Platform:</strong> iOS, Android
                </p>
                <p className="text-gray-600 text-sm">
                  Open source, no cloud, privacy-focused.
                </p>
              </div>
            </div>
          </section>

          {/* MFA Flows */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">MFA Login Flows</h2>

            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6">
                <h3 className="font-bold text-blue-900 mb-3 text-lg">Flow 1: Login with TOTP Code</h3>
                <ol className="space-y-2 text-blue-800">
                  <li>1. User enters username and password</li>
                  <li>2. Server validates credentials</li>
                  <li>3. If valid AND user.mfaEnabled, ask for TOTP code</li>
                  <li>4. User opens authenticator app, gets 6-digit code</li>
                  <li>5. User enters code in login form</li>
                  <li>6. Server verifies code matches (±1 time window for clock drift)</li>
                  <li>7. If valid, user is fully authenticated</li>
                  <li>8. Create session/JWT and log user in</li>
                </ol>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-6">
                <h3 className="font-bold text-purple-900 mb-3 text-lg">Flow 2: Recovery with Backup Code</h3>
                <ol className="space-y-2 text-purple-800">
                  <li>1. User enters username and password</li>
                  <li>2. Server validates credentials</li>
                  <li>3. Server asks for TOTP code</li>
                  <li>4. User clicks &quot;I don&apos;t have my phone / Use backup code&quot;</li>
                  <li>5. User enters one of their saved backup codes</li>
                  <li>6. Server validates backup code hasn&apos;t been used</li>
                  <li>7. Server marks code as used in database</li>
                  <li>8. User is fully authenticated</li>
                  <li>9. Server shows warning: &quot;X backup codes remaining. Consider re-enabling MFA.&quot;</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Security Features */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Security Features</h2>

            <div className="space-y-6">
              <div className="border-l-4 border-green-500 bg-green-50 p-6">
                <h3 className="text-xl font-bold text-green-900 mb-2">Time Window Tolerance</h3>
                <p className="text-green-800 text-sm mb-2">
                  Allow ±1 time window (30s before/after) to account for clock drift
                </p>
                <code className="block bg-gray-900 text-green-400 p-3 rounded text-sm">
                  {`// Check current, previous, and next time windows\nconst isValid = \n  verifyCode(code, currentTime) ||\n  verifyCode(code, currentTime - 30) ||\n  verifyCode(code, currentTime + 30);`}
                </code>
              </div>

              <div className="border-l-4 border-blue-500 bg-blue-50 p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">Code Reuse Prevention</h3>
                <p className="text-blue-800 text-sm">
                  Track recently used codes (within time window) to prevent replay attacks. Store last used code timestamp per user.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 bg-purple-50 p-6">
                <h3 className="text-xl font-bold text-purple-900 mb-2">Rate Limiting</h3>
                <p className="text-purple-800 text-sm mb-2">
                  Prevent brute force attacks on 6-digit codes:
                </p>
                <ul className="text-purple-700 text-sm space-y-1">
                  <li>• Limit to 5 attempts per 10 minutes</li>
                  <li>• Lock account after 10 failed attempts</li>
                  <li>• Add exponential backoff delays</li>
                </ul>
              </div>

              <div className="border-l-4 border-orange-500 bg-orange-50 p-6">
                <h3 className="text-xl font-bold text-orange-900 mb-2">Recovery Options</h3>
                <p className="text-orange-800 text-sm">
                  Always provide multiple recovery methods: backup codes, email verification, support ticket, SMS (less secure but better than locked out).
                </p>
              </div>
            </div>
          </section>

          {/* Vulnerabilities */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Common Vulnerabilities & Solutions</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">Vulnerability</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">Issue</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">Solution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-semibold text-red-700">Time Drift</td>
                    <td className="px-4 py-4 text-gray-700">
                      Server and phone clocks not synchronized
                    </td>
                    <td className="px-4 py-4 text-green-700">
                      Allow ±2 time windows (60s tolerance)
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-semibold text-red-700">Code Reuse</td>
                    <td className="px-4 py-4 text-gray-700">
                      Same code used multiple times in 30s window
                    </td>
                    <td className="px-4 py-4 text-green-700">
                      Track used codes per user, reject duplicates
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-semibold text-red-700">Phone Loss</td>
                    <td className="px-4 py-4 text-gray-700">
                      User loses phone/app with MFA
                    </td>
                    <td className="px-4 py-4 text-green-700">
                      Provide backup codes during setup
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-semibold text-red-700">TOTP Phishing</td>
                    <td className="px-4 py-4 text-gray-700">
                      User enters code on fake login page
                    </td>
                    <td className="px-4 py-4 text-green-700">
                      Hardware keys (FIDO2), user education, short validity
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-4 font-semibold text-red-700">Social Engineering</td>
                    <td className="px-4 py-4 text-gray-700">
                      Attacker convinces user to share code
                    </td>
                    <td className="px-4 py-4 text-green-700">
                      User education, warnings in app
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Advanced MFA Methods */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Advanced MFA Methods</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">🔑 Hardware Security Keys (FIDO2/WebAuthn)</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Physical USB/NFC keys (YubiKey, Titan, etc.)
                </p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Security:</strong> Most secure, phishing-resistant</p>
                  <p><strong>Cost:</strong> $20-50 per key</p>
                  <p><strong>UX:</strong> Tap/insert key to authenticate</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">👆 Biometrics</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Fingerprint, Face ID, iris scan
                </p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Security:</strong> High (can&apos;t be stolen easily)</p>
                  <p><strong>Cost:</strong> Built into device</p>
                  <p><strong>UX:</strong> Very convenient</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">📲 Push Notifications</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Approve/deny on phone (Duo, Okta)
                </p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Security:</strong> Medium (vulnerable to push fatigue)</p>
                  <p><strong>Cost:</strong> Free (with service)</p>
                  <p><strong>UX:</strong> Very convenient</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-3">📧 SMS-based 2FA</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Code sent via text message
                </p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Security:</strong> Low (SIM swap attacks)</p>
                  <p><strong>Cost:</strong> SMS fees</p>
                  <p><strong>UX:</strong> Requires cell signal</p>
                  <p className="text-red-600"><strong>⚠️ Not recommended as primary MFA</strong></p>
                </div>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Best Practices</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong>Require MFA for sensitive operations</strong>
                    <p className="text-sm text-gray-600">Password changes, financial transactions</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong>Enforce MFA for admin accounts</strong>
                    <p className="text-sm text-gray-600">Higher privileges = higher security</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong>Provide multiple MFA methods</strong>
                    <p className="text-sm text-gray-600">TOTP + backup codes minimum</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong>Support hardware keys for power users</strong>
                    <p className="text-sm text-gray-600">Most secure option available</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong>Implement recovery options</strong>
                    <p className="text-sm text-gray-600">Backup codes, email, support</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong>Log all MFA events</strong>
                    <p className="text-sm text-gray-600">Setup, verification, failures</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong>Let users test before enabling</strong>
                    <p className="text-sm text-gray-600">Verify code works before activation</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <div>
                    <strong>Show backup codes only once</strong>
                    <p className="text-sm text-gray-600">Force user to save immediately</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Try It Out */}
          <section className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl shadow-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Try It Out</h2>
            <p className="text-lg mb-6 text-orange-100">
              Experience TOTP-based MFA with our interactive demo
            </p>
            <button
              onClick={() => router.push('/mfa/demo')}
              className="px-8 py-4 bg-white text-orange-600 rounded-lg font-bold text-lg hover:bg-orange-50 transition-colors shadow-lg"
            >
              Go to MFA Demo →
            </button>
          </section>

          {/* Resources */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Further Reading</h2>
            <ul className="space-y-3">
              <li>
                <a href="https://datatracker.ietf.org/doc/html/rfc6238" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline font-semibold">
                  RFC 6238 - TOTP: Time-Based One-Time Password Algorithm
                </a>
              </li>
              <li>
                <a href="https://datatracker.ietf.org/doc/html/rfc4226" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline font-semibold">
                  RFC 4226 - HOTP: HMAC-Based One-Time Password
                </a>
              </li>
              <li>
                <a href="https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline font-semibold">
                  OWASP - Multi-Factor Authentication Cheat Sheet
                </a>
              </li>
              <li>
                <a href="https://fidoalliance.org/specifications/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline font-semibold">
                  FIDO Alliance - WebAuthn Specifications
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
