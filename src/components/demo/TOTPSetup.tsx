'use client';

/**
 * TOTP Setup Component
 * Interactive component for setting up 2FA/MFA using TOTP
 *
 * This component guides users through the MFA setup process:
 * 1. Generate Secret: Create TOTP secret and QR code
 * 2. Scan QR Code: User scans with authenticator app
 * 3. Verify Code: User enters generated code to confirm setup
 * 4. Save Backup Codes: Display one-time backup codes
 *
 * Reference: SPECIFICATION Section 4.4, Section 5.1.9-5.1.10
 */

import { useState } from 'react';

interface TOTPSetupProps {
  userId: number;
  onSuccess?: () => void;
}

interface SetupData {
  secret: string;
  qrCode: string;
  manualEntry: string;
  backupCodes: string[];
}

type SetupStep = 'generate' | 'scan' | 'verify' | 'complete';

export function TOTPSetup({ userId, onSuccess }: TOTPSetupProps) {
  const [currentStep, setCurrentStep] = useState<SetupStep>('generate');
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);

  const handleGenerateSecret = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/mfa/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        setSetupData(data);
        setCurrentStep('scan');
      } else {
        setError(data.error || 'Failed to generate secret');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          code: verificationCode,
          useBackupCode: false,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentStep('complete');
        onSuccess?.();
      } else {
        setError(data.message || data.error || 'Invalid code. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep('generate');
    setSetupData(null);
    setVerificationCode('');
    setError(null);
    setShowManualEntry(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Set Up Two-Factor Authentication (2FA)
      </h2>

      {/* Progress Steps */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {['Generate', 'Scan', 'Verify', 'Complete'].map((step, idx) => (
            <div key={step} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    idx <= ['generate', 'scan', 'verify', 'complete'].indexOf(currentStep)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {idx + 1}
                </div>
                <div className="text-xs mt-1 text-gray-600">{step}</div>
              </div>
              {idx < 3 && (
                <div
                  className={`h-1 flex-1 ${
                    idx < ['generate', 'scan', 'verify', 'complete'].indexOf(currentStep)
                      ? 'bg-blue-600'
                      : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Generate */}
      {currentStep === 'generate' && (
        <div className="space-y-4">
          <p className="text-gray-700">
            Enable two-factor authentication to add an extra layer of security to your account.
            You&apos;ll need an authenticator app like Google Authenticator, Authy, or Microsoft
            Authenticator.
          </p>

          <button
            onClick={handleGenerateSecret}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {isLoading ? 'Generating...' : 'Generate Secret'}
          </button>
        </div>
      )}

      {/* Step 2: Scan QR Code */}
      {currentStep === 'scan' && setupData && (
        <div className="space-y-4">
          <p className="text-gray-700">
            Scan this QR code with your authenticator app:
          </p>

          {/* QR Code */}
          <div className="flex justify-center p-6 bg-gray-50 rounded-lg border border-gray-200">
            <img
              src={setupData.qrCode}
              alt="TOTP QR Code"
              className="w-64 h-64"
            />
          </div>

          {/* Manual Entry Option */}
          <div className="text-center">
            <button
              onClick={() => setShowManualEntry(!showManualEntry)}
              className="text-sm text-blue-600 hover:underline"
            >
              {showManualEntry ? 'Hide manual entry code' : 'Can\'t scan? Enter code manually'}
            </button>
          </div>

          {showManualEntry && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Manual Entry Code:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-white border border-gray-300 rounded font-mono text-sm break-all">
                  {setupData.manualEntry}
                </code>
                <button
                  onClick={() => copyToClipboard(setupData.manualEntry)}
                  className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm whitespace-nowrap"
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setCurrentStep('verify')}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Next: Verify Code
          </button>
        </div>
      )}

      {/* Step 3: Verify Code */}
      {currentStep === 'verify' && (
        <div className="space-y-4">
          <p className="text-gray-700">
            Enter the 6-digit code from your authenticator app to confirm setup:
          </p>

          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            maxLength={6}
            className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleVerifyCode}
            disabled={isLoading || verificationCode.length !== 6}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {isLoading ? 'Verifying...' : 'Verify & Enable 2FA'}
          </button>

          <button
            onClick={() => setCurrentStep('scan')}
            className="w-full px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Back to QR Code
          </button>
        </div>
      )}

      {/* Step 4: Complete */}
      {currentStep === 'complete' && setupData && (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-semibold mb-2">✓ 2FA Enabled Successfully!</p>
            <p className="text-green-700 text-sm">
              Your account is now protected with two-factor authentication.
            </p>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-900 font-semibold mb-2">⚠ Save Your Backup Codes</p>
            <p className="text-yellow-800 text-sm mb-3">
              Save these backup codes in a safe place. Each code can be used once if you lose
              access to your authenticator app.
            </p>

            <div className="grid grid-cols-2 gap-2 mb-3">
              {setupData.backupCodes.map((code, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-white border border-yellow-300 rounded font-mono text-sm text-center"
                >
                  {code}
                </div>
              ))}
            </div>

            <button
              onClick={() => copyToClipboard(setupData.backupCodes.join('\n'))}
              className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-sm"
            >
              Copy All Backup Codes
            </button>
          </div>

          <button
            onClick={handleReset}
            className="w-full px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Set Up Another Account
          </button>
        </div>
      )}
    </div>
  );
}
