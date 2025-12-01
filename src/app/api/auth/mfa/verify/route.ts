import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';
import { verifyTOTPCode } from '@/lib/mfa';
import { comparePassword } from '@/lib/crypto';

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
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, code, useBackupCode = false } = body;

    // Validate required parameters
    if (!userId || !code) {
      return NextResponse.json(
        { error: 'userId and code are required' },
        { status: 400 }
      );
    }

    if (typeof userId !== 'number' || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Invalid parameter format' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = mockDB.users[userId];

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has MFA setup
    const mfaSecret = mockDB.mfaSecrets[userId];

    if (!mfaSecret) {
      return NextResponse.json(
        { error: 'MFA not set up for this user' },
        { status: 400 }
      );
    }

    // Handle Backup Code Verification
    if (useBackupCode) {
      // Verify backup code against hashed versions
      // Backup codes are stored as hashes for security
      const normalizedCode = code.trim().toUpperCase();

      // Check if code was already used
      if (mfaSecret.usedCodes.includes(normalizedCode)) {
        return NextResponse.json(
          {
            error: 'Invalid backup code',
            message: 'Backup code has already been used',
          },
          { status: 401 }
        );
      }

      // Compare against all hashed backup codes
      let isValidBackupCode = false;

      for (const hashedCode of mfaSecret.backupCodes) {
        const matches = await comparePassword(normalizedCode, hashedCode);
        if (matches) {
          isValidBackupCode = true;
          break;
        }
      }

      if (!isValidBackupCode) {
        return NextResponse.json(
          {
            error: 'Invalid backup code',
            message: 'Backup code is invalid or has already been used',
          },
          { status: 401 }
        );
      }

      // Mark backup code as used (store the original code, not the hash)
      mfaSecret.usedCodes.push(normalizedCode);

      // Enable MFA if this is initial setup verification
      if (!mfaSecret.enabled) {
        mfaSecret.enabled = true;
        user.mfaEnabled = true;
      }

      return NextResponse.json({
        success: true,
        message: 'Backup code verified successfully',
        remainingBackupCodes: mfaSecret.backupCodes.length - mfaSecret.usedCodes.length,
      });
    }

    // Handle TOTP Code Verification
    const isValidTOTPCode = verifyTOTPCode(mfaSecret.secret, code);

    if (!isValidTOTPCode) {
      return NextResponse.json(
        {
          error: 'Invalid code',
          message: 'The verification code is invalid or has expired',
        },
        { status: 401 }
      );
    }

    // Enable MFA if this is initial setup verification
    if (!mfaSecret.enabled) {
      mfaSecret.enabled = true;
      user.mfaEnabled = true;
    }

    return NextResponse.json({
      success: true,
      message: 'MFA verified successfully',
    });

  } catch (error) {
    console.error('MFA verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
