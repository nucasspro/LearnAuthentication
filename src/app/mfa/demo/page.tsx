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

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Copy,
  Key,
  QrCode,
  RefreshCw,
  Shield,
  Smartphone
} from 'lucide-react';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function MFADemoPage() {
  const [step, setStep] = useState<'setup' | 'verified'>('setup');
  const [totpCode, setTotpCode] = useState('');
  const [userCode, setUserCode] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [secret] = useState('JBSWY3DPEHPK3PXP');
  const [secretGenerated, setSecretGenerated] = useState(false);
  const [recoveryCodes] = useState([
    'A1B2-C3D4-E5F6',
    'G7H8-I9J0-K1L2',
    'M3N4-O5P6-Q7R8',
    'S9T0-U1V2-W3X4',
    'Y5Z6-A7B8-C9D0',
    'E1F2-G3H4-I5J6',
    'K7L8-M9N0-O1P2',
    'Q3R4-S5T6-U7V8',
    'W9X0-Y1Z2-A3B4',
    'C5D6-E7F8-G9H0',
  ]);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = 30 - (now % 30);
      setTimeRemaining(remaining);

      if (remaining === 30) {
        generateTOTP();
      }
    }, 1000);

    generateTOTP();

    return () => clearInterval(interval);
  }, []);

  const generateTOTP = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setTotpCode(code);
  };

  const generateSecret = () => {
    setSecretGenerated(true);
    toast.success('Secret key generated! 🔑');
  };

  const handleVerify = () => {
    if (userCode === totpCode) {
      setIsVerified(true);
      setError('');
      toast.success('MFA setup complete! 🎉');
      setTimeout(() => setStep('verified'), 1000);
    } else {
      setError('Invalid code. Please try again with the current code from the simulator.');
      toast.error('Invalid code. Try again!');
    }
  };

  const copyToClipboard = (text: string, item: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(item);
    setTimeout(() => setCopiedItem(null), 2000);

    // Show toast notification
    if (item === 'totp') {
      toast.success('TOTP code copied!');
    } else if (item === 'secret' || item === 'manual') {
      toast.success('Secret key copied!');
    } else if (item.startsWith('recovery-')) {
      toast.success('Recovery code copied!');
    }
  };

  const progressPercentage = (timeRemaining / 30) * 100;
  const progressVariant = timeRemaining > 20 ? 'success' : timeRemaining > 10 ? 'warning' : 'danger';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-green-950 to-gray-950">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10 md:w-12 md:h-12 text-neon-400 drop-shadow-[0_0_10px_rgba(74,255,0,0.5)]" />
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-wider drop-shadow-[0_0_20px_rgba(74,255,0,0.3)]">
              MFA/2FA <span className="text-neon-400">Demo</span>
            </h1>
          </div>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
            Learn how Multi-Factor Authentication adds an extra layer of security
          </p>
        </div>

        {/* Main 3-Column Grid */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {/* Left Column - Education */}
          <div className="space-y-6">
            <Card className="bg-gray-900/80 backdrop-blur border-2 border-neon-500/30 shadow-[0_0_30px_rgba(74,255,0,0.2)]">
              <CardContent>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wide">
                  <Shield className="w-7 h-7 md:w-8 md:h-8 text-neon-400" />
                  Education
                </h2>

                <div className="space-y-6">
                  {/* What is MFA */}
                  <div className="bg-gradient-to-br from-neon-950/50 to-green-950/50 rounded-xl p-5 border-2 border-neon-500/50">
                    <h3 className="font-semibold text-white mb-3 text-sm md:text-base">
                      What is MFA?
                    </h3>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      Multi-Factor Authentication (MFA) requires two or more verification factors to gain access.
                      Even if your password is compromised, attackers cannot access your account without the second factor.
                    </p>
                  </div>

                  {/* TOTP Explanation */}
                  <div className="bg-cyan-950/50 rounded-xl p-5 border-2 border-cyan-400/50">
                    <h3 className="font-semibold text-white mb-3 text-sm md:text-base">
                      TOTP Explanation
                    </h3>
                    <p className="text-sm text-gray-200 leading-relaxed mb-3">
                      <strong>Time-Based One-Time Password</strong> (TOTP) generates a 6-digit code that changes every 30 seconds.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-200">
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-400">•</span>
                        <span>Based on current time + shared secret</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-400">•</span>
                        <span>Works offline (no internet needed)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-400">•</span>
                        <span>Synced via initial QR code scan</span>
                      </li>
                    </ul>
                  </div>

                  {/* How Setup Works */}
                  <div className="bg-green-950/50 rounded-xl p-5 border-2 border-green-400/50">
                    <h3 className="font-semibold text-white mb-3 text-sm md:text-base">
                      How Setup Works
                    </h3>
                    <div className="space-y-3">
                      {[
                        'Generate secret key',
                        'Display QR code',
                        'Scan with authenticator app',
                        'App generates 6-digit codes',
                        'Verify code to confirm setup',
                        'Save recovery codes',
                      ].map((stepText, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-neon-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-sm text-gray-200">{stepText}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recovery Codes */}
                  <div className="bg-amber-950/50 rounded-xl p-5 border-2 border-amber-400/50">
                    <h3 className="font-semibold text-white mb-3 text-sm md:text-base flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      Recovery Codes
                    </h3>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      Always save recovery codes in a secure location. They allow access if you lose your device.
                      Each code can typically be used only once.
                    </p>
                  </div>

                  {/* Compatible Apps */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-5 border-2 border-purple-200 dark:border-purple-800">
                    <h3 className="font-semibold text-white mb-3 text-sm md:text-base">
                      Compatible Apps
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {['Google Authenticator', 'Authy', '1Password', 'Microsoft Authenticator'].map((app) => (
                        <Badge key={app} variant="default">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Setup */}
          <div>
            <Card className="bg-gray-900/80 backdrop-blur border-2 border-neon-500/30 shadow-[0_0_30px_rgba(74,255,0,0.2)]">
              <CardContent>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wide">
                  <Key className="w-7 h-7 md:w-8 md:h-8 text-neon-400" />
                  Setup
                </h2>

                {step === 'setup' && (
                  <div className="space-y-6">
                    {/* Step 1: Generate Secret */}
                    <div className="bg-gradient-to-br from-neon-950/50 to-green-950/50 rounded-xl p-5 border-2 border-neon-500/50">
                      <h3 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm md:text-base">
                        <span className="w-6 h-6 bg-orange-600 dark:bg-orange-700 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          1
                        </span>
                        Generate Secret
                      </h3>
                      {!secretGenerated ? (
                        <Button
                          variant="default"
                          onClick={generateSecret}
                          className="!bg-orange-600 hover:!bg-orange-700 w-full"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Generate Secret Key
                        </Button>
                      ) : (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                            <span className="text-sm font-semibold text-neon-200">
                              Secret Generated
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="flex-1 text-xs font-mono text-gray-200 bg-white dark:bg-gray-800 rounded px-2 py-1">
                              {secret}
                            </code>
                            <button
                              onClick={() => copyToClipboard(secret, 'secret')}
                              className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs flex items-center gap-1 transition-colors"
                            >
                              {copiedItem === 'secret' ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {secretGenerated && (
                      <>
                        {/* Step 2: Scan QR Code */}
                        <div className="bg-cyan-950/50 rounded-xl p-5 border-2 border-cyan-400/50">
                          <h3 className="font-semibold text-white mb-4 flex items-center gap-2 text-sm md:text-base">
                            <span className="w-6 h-6 bg-blue-600 dark:bg-blue-700 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              2
                            </span>
                            Scan QR Code
                          </h3>
                          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 flex items-center justify-center mb-3">
                            <div className="w-40 h-40 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900 dark:to-amber-900 rounded-lg flex items-center justify-center">
                              <QrCode className="w-32 h-32 text-neon-400" />
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 text-center">
                            Scan with your authenticator app
                          </p>
                        </div>

                        {/* Step 3: Manual Entry */}
                        <div className="bg-amber-950/50 rounded-xl p-5 border-2 border-amber-400/50">
                          <h3 className="font-semibold text-white mb-3 flex items-center gap-2 text-sm md:text-base">
                            <span className="w-6 h-6 bg-amber-600 dark:bg-amber-700 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              3
                            </span>
                            Manual Entry (Optional)
                          </h3>
                          <p className="text-xs text-gray-400 mb-2">
                            If you can&apos;t scan, enter this secret manually:
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg p-2 font-mono text-xs break-all text-gray-200">
                              {secret}
                            </div>
                            <button
                              onClick={() => copyToClipboard(secret, 'manual')}
                              className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors flex items-center gap-1 text-xs"
                            >
                              {copiedItem === 'manual' ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Step 4: Verify Code */}
                        <div className="bg-green-950/50 rounded-xl p-5 border-2 border-green-400/50">
                          <h3 className="font-semibold text-white mb-3 text-sm md:text-base">
                            <span className="w-6 h-6 bg-neon-500 text-white rounded-full inline-flex items-center justify-center text-xs font-bold mr-2">
                              4
                            </span>
                            Verify Code
                          </h3>
                          <p className="text-xs text-gray-400 mb-4">
                            Enter the 6-digit code from your authenticator app:
                          </p>

                          {error && (
                            <Alert variant="destructive" className="mb-4">
                              <AlertDescription>{error}</AlertDescription>
                            </Alert>
                          )}

                          {isVerified && (
                            <Alert className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-300 dark:border-green-700 mb-4">
                              <AlertDescription>Code verified! MFA setup complete.</AlertDescription>
                            </Alert>
                          )}

                          <div className="flex gap-3">
                            <input
                              type="text"
                              value={userCode}
                              onChange={(e) => setUserCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              onKeyDown={(e) => e.key === 'Enter' && userCode.length === 6 && handleVerify()}
                              className="flex-1 px-4 py-3 border-2 border-gray-700 bg-gray-950 text-white rounded-xl focus:border-neon-500 focus:outline-none transition-colors text-center text-2xl font-mono tracking-wider"
                              placeholder="000000"
                              maxLength={6}
                            />
                            <Button
                              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-6 py-3"
                              onClick={handleVerify}
                              disabled={userCode.length !== 6}
                            >
                              Verify
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {step === 'verified' && (
                  <div className="space-y-6">
                    {/* Success Message */}
                    <div className="bg-gradient-to-br from-neon-950/50 to-green-950/50 border-2 border-neon-500 rounded-xl p-6 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-neon-500 rounded-full mb-4">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-neon-200 mb-2">
                        MFA Enabled!
                      </h3>
                      <p className="text-sm text-neon-100">
                        Your account is now protected with two-factor authentication
                      </p>
                    </div>

                    {/* Recovery Codes */}
                    <div className="bg-amber-950/50 rounded-xl p-5 border-2 border-amber-400/50">
                      <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <Key className="w-5 h-5 text-amber-400" />
                        Recovery Codes
                      </h3>
                      <p className="text-xs text-gray-400 mb-3">
                        Save these codes securely. Each can be used once if you lose access to your authenticator:
                      </p>
                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                        {recoveryCodes.map((code, index) => (
                          <div
                            key={index}
                            className="bg-gray-900/50 border border-gray-700 rounded-lg p-2 flex items-center justify-between gap-2"
                          >
                            <code className="text-xs font-mono text-gray-200">
                              {code}
                            </code>
                            <button
                              onClick={() => copyToClipboard(code, `recovery-${index}`)}
                              className="p-1 hover:bg-gray-800 rounded transition-colors"
                            >
                              {copiedItem === `recovery-${index}` ? (
                                <CheckCircle2 className="w-3 h-3 text-green-400" />
                              ) : (
                                <Copy className="w-3 h-3 text-gray-400" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      onClick={() => {
                        setStep('setup');
                        setIsVerified(false);
                        setUserCode('');
                        setError('');
                        setSecretGenerated(false);
                      }}
                      className="!bg-gray-200 dark:!bg-gray-700 !text-gray-700 dark:!text-gray-200 w-full"
                    >
                      Start Over
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Live Authenticator */}
          <div>
            <Card className="bg-gray-900/80 backdrop-blur border-2 border-neon-500/30 shadow-[0_0_30px_rgba(74,255,0,0.2)]">
              <CardContent>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wide">
                  <Smartphone className="w-7 h-7 md:w-8 md:h-8 text-neon-400" />
                  Live Authenticator
                </h2>

                <div className="space-y-6">
                  {/* TOTP Display */}
                  <div className="bg-gradient-to-br from-neon-950/50 to-green-950/50 rounded-xl p-6 border-2 border-neon-500/50">
                    <div className="text-center mb-6">
                      <div className="text-xs text-gray-300 mb-1">Account</div>
                      <div className="text-sm font-semibold text-gray-200">
                        admin@example.com
                      </div>
                    </div>

                    <div className="text-center mb-6">
                      <div className="text-xs text-gray-300 mb-2">Current Code</div>
                      <div className="text-5xl font-bold text-neon-400 font-mono tracking-wider mb-4">
                        {totpCode}
                      </div>
                      <Button
                        variant="default"
                        onClick={() => copyToClipboard(totpCode, 'totp')}
                        className="!bg-neon-600 hover:!bg-neon-700 mx-auto"
                      >
                        {copiedItem === 'totp' ? (
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                        ) : (
                          <Copy className="w-4 h-4 mr-2" />
                        )}
                        {copiedItem === 'totp' ? 'Copied!' : 'Copy Code'}
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-200 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Time remaining:
                        </span>
                        <span className="font-semibold text-neon-400">
                          {timeRemaining}s
                        </span>
                      </div>
                      <Progress
                        value={progressPercentage}
                        className="h-2"
                      />
                    </div>
                  </div>

                  {/* How It Works */}
                  <div className="bg-cyan-950/50 rounded-xl p-5 border-2 border-cyan-400/50">
                    <h3 className="font-semibold text-white mb-3 text-sm">
                      How It Works
                    </h3>
                    <ul className="space-y-2 text-xs text-gray-200">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span>Code changes every 30 seconds</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span>Generated using TOTP algorithm</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span>Synced with server time</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span>Works offline</span>
                      </li>
                    </ul>
                  </div>

                  {/* Security Tips */}
                  <div className="bg-green-950/50 rounded-xl p-5 border-2 border-green-400/50">
                    <h3 className="font-semibold text-white mb-3 text-sm flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-400" />
                      Security Tips
                    </h3>
                    <ul className="space-y-2 text-xs text-gray-200">
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">•</span>
                        <span>Never share your secret key</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">•</span>
                        <span>Store recovery codes securely</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">•</span>
                        <span>Use different authenticators for different accounts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">•</span>
                        <span>Backup your authenticator app data</span>
                      </li>
                    </ul>
                  </div>

                  {/* Demo Mode Notice */}
                  <div className="bg-neon-950/50 rounded-xl p-4 border-2 border-neon-500/50">
                    <p className="text-xs text-neon-200 italic">
                      <strong>Demo Mode:</strong> This simulates a real authenticator app. In production, only your phone generates these codes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
