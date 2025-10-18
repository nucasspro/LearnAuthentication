'use client';

/**
 * Authenticator Simulator Component
 * Simulates Google Authenticator / Authy / Microsoft Authenticator
 *
 * This component shows a live TOTP code that updates every 30 seconds,
 * just like a real authenticator app would display.
 *
 * Features:
 * - Live 6-digit TOTP code
 * - 30-second countdown timer
 * - Copy code to clipboard
 * - Visual progress indicator
 * - Auto-refresh when code expires
 *
 * Reference: RFC 6238 - TOTP Algorithm
 */

import { useState, useEffect } from 'react';
import { generateCurrentTOTPCode, getTimeUntilNextCode } from '@/lib/mfa';

interface AuthenticatorSimulatorProps {
  secret: string;
  issuer?: string;
  accountName?: string;
}

export function AuthenticatorSimulator({
  secret,
  issuer = 'Learn Authentication',
  accountName = 'user@example.com',
}: AuthenticatorSimulatorProps) {
  const [currentCode, setCurrentCode] = useState('000000');
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [copied, setCopied] = useState(false);

  // Update TOTP code and timer
  useEffect(() => {
    if (!secret) return;

    // Function to update both code and timer
    const updateCodeAndTimer = () => {
      const code = generateCurrentTOTPCode(secret);
      const time = getTimeUntilNextCode();
      setCurrentCode(code);
      setTimeRemaining(time);
    };

    // Initial update
    updateCodeAndTimer();

    // Update every second
    const interval = setInterval(() => {
      updateCodeAndTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [secret]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate progress percentage for circular timer
  const progressPercentage = (timeRemaining / 30) * 100;

  return (
    <div className="w-full max-w-md bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-2xl p-6 text-white">
      {/* App Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
          <span className="text-2xl">🔐</span>
        </div>
        <div>
          <h3 className="font-bold text-lg">Authenticator</h3>
          <p className="text-xs text-blue-100">Simulator</p>
        </div>
      </div>

      {/* Account Card */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/20">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xs text-blue-100 mb-1">{issuer}</p>
            <p className="text-sm font-semibold">{accountName}</p>
          </div>
          <div className="relative w-12 h-12">
            {/* Circular Progress */}
            <svg className="transform -rotate-90 w-12 h-12">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-white/20"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - progressPercentage / 100)}`}
                className={`transition-all duration-1000 ${
                  timeRemaining <= 5 ? 'text-red-300' : 'text-green-300'
                }`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={`text-xs font-bold ${
                  timeRemaining <= 5 ? 'text-red-300' : 'text-green-300'
                }`}
              >
                {timeRemaining}
              </span>
            </div>
          </div>
        </div>

        {/* TOTP Code Display */}
        <div className="flex items-center justify-center mb-3">
          <div className="font-mono text-4xl font-bold tracking-wider">
            {currentCode.slice(0, 3)}{' '}
            <span className="text-blue-200">{currentCode.slice(3)}</span>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopyCode}
          className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-semibold backdrop-blur-sm border border-white/20"
        >
          {copied ? '✓ Copied!' : 'Copy Code'}
        </button>
      </div>

      {/* Info Text */}
      <div className="text-xs text-blue-100 space-y-1">
        <p>• Code changes every 30 seconds</p>
        <p>• Enter this code when logging in</p>
        <p>• Works offline once set up</p>
      </div>

      {/* Warning for Low Time */}
      {timeRemaining <= 5 && (
        <div className="mt-3 p-2 bg-red-500/20 border border-red-300/30 rounded-lg text-xs text-red-100">
          ⚠ Code expiring soon! New code in {timeRemaining}s
        </div>
      )}
    </div>
  );
}
