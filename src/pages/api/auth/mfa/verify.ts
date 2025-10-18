import type { NextApiRequest, NextApiResponse } from 'next';
import { mockDB } from '@/lib/mock-db';
import { verifyTOTPCode, verifyBackupCode } from '@/lib/mfa';

/**
 * POST /api/auth/mfa/verify
 *
 * MFA Verification Endpoint - Verifies TOTP codes or backup codes
 * Used in two scenarios:
 * 1. Initial Setup: User verifies they can generate codes (enables MFA)
 * 2. Login Flow: User enters code to complete 2FA login
 *
 * Request Body:
 * - userId: number (required) - User ID to verify MFA for
 * - code: string (required) - 6-digit TOTP code or backup code
 * - useBackupCode: boolean (optional) - true if using backup code
 *
 * Response (200 OK):
 * {
 *   success: true,
 *   message: "MFA verified successfully"
 * }
 *
 * Response (401 Unauthorized):
 * {
 *   error: "Invalid code" | "Invalid backup code"
 * }
 *
 * Flow 1 - Initial Setup Verification:
 * 1. User sets up MFA via /mfa/setup
 * 2. User scans QR code in authenticator app
 * 3. User enters generated code here
 * 4. If valid: enabled=true (MFA activated)
 * 5. If invalid: retry (MFA not activated)
 *
 * Flow 2 - Login with MFA:
 * 1. User enters username/password
 * 2. Login endpoint returns mfaRequired=true
 * 3. User enters TOTP code or backup code
 * 4. This endpoint verifies code
 * 5. If valid: complete login (create session/JWT)
 * 6. If invalid: deny access
 *
 * Backup Code Usage:
 * - User lost phone / authenticator app
 * - User enters one of the 10 backup codes
 * - Code is validated and marked as used
 * - Each backup code is single-use only
 * - After all codes used, user must set up MFA again
 *
 * Security Notes:
 * - TOTP codes expire every 30 seconds
 * - Window of ±60 seconds tolerance for clock drift
 * - Backup codes are one-time use only
 * - Track used backup codes to prevent replay attacks
 * - In production: Rate limit this endpoint (5 attempts max)
 * - In production: Lock account after failed attempts
 * - In production: Log all MFA verification attempts
 *
 * Reference: SPECIFICATION Section 4.4.2, Section 5.1.10
 * RFC 6238: TOTP Verification
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, code, useBackupCode = false } = req.body;

    // Validate required parameters
    if (!userId || !code) {
      return res.status(400).json({ error: 'userId and code are required' });
    }

    if (typeof userId !== 'number' || typeof code !== 'string') {
      return res.status(400).json({ error: 'Invalid parameter format' });
    }

    // Check if user exists
    const user = mockDB.users[userId];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has MFA setup
    const mfaSecret = mockDB.mfaSecrets[userId];

    if (!mfaSecret) {
      return res.status(400).json({ error: 'MFA not set up for this user' });
    }

    // Handle Backup Code Verification
    if (useBackupCode) {
      // Verify backup code
      const isValidBackupCode = verifyBackupCode(
        mfaSecret.backupCodes,
        mfaSecret.usedCodes,
        code
      );

      if (!isValidBackupCode) {
        return res.status(401).json({
          error: 'Invalid backup code',
          message: 'Backup code is invalid or has already been used',
        });
      }

      // Mark backup code as used
      mfaSecret.usedCodes.push(code.trim().toUpperCase());

      // Enable MFA if this is initial setup verification
      if (!mfaSecret.enabled) {
        mfaSecret.enabled = true;
        user.mfaEnabled = true;
      }

      return res.status(200).json({
        success: true,
        message: 'Backup code verified successfully',
        remainingBackupCodes: mfaSecret.backupCodes.length - mfaSecret.usedCodes.length,
      });
    }

    // Handle TOTP Code Verification
    const isValidTOTPCode = verifyTOTPCode(mfaSecret.secret, code);

    if (!isValidTOTPCode) {
      return res.status(401).json({
        error: 'Invalid code',
        message: 'The verification code is invalid or has expired',
      });
    }

    // Enable MFA if this is initial setup verification
    if (!mfaSecret.enabled) {
      mfaSecret.enabled = true;
      user.mfaEnabled = true;
    }

    return res.status(200).json({
      success: true,
      message: 'MFA verified successfully',
    });

  } catch (error) {
    console.error('MFA verification error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
