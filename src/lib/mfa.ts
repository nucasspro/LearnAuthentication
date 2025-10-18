/**
 * Multi-Factor Authentication (MFA) Library
 * Based on SPECIFICATION Section 4.4, Section 5.1.9-5.1.10, Section 5.2.4
 * RFC 6238: TOTP - Time-Based One-Time Password Algorithm
 *
 * This module provides TOTP-based 2FA functionality using the speakeasy library.
 *
 * TOTP Overview:
 * - Time-based One-Time Password
 * - Generates 6-digit codes that change every 30 seconds
 * - Works offline (no network required after setup)
 * - Used by Google Authenticator, Authy, Microsoft Authenticator
 * - Shared secret between server and authenticator app
 *
 * Security Notes:
 * - Secrets are base32 encoded for compatibility
 * - Window of ±2 time steps (60 seconds tolerance) for clock drift
 * - Backup codes are one-time use only
 * - Track used backup codes to prevent replay attacks
 * - Store secrets securely (never expose in logs/responses)
 * - Recovery scenario: User loses phone → use backup codes
 */

import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { MFA_WINDOW, MFA_ISSUER, MFA_BACKUP_CODES_COUNT } from './constants';

/**
 * Generate TOTP Secret
 *
 * Creates a new TOTP secret for a user and generates QR code for scanning.
 * The QR code is scanned by authenticator apps (Google Authenticator, Authy, etc.)
 *
 * @param userEmail - User's email address (displayed in authenticator app)
 * @param issuer - Application name (defaults to MFA_ISSUER)
 * @returns Object containing secret, QR code, and manual entry code
 *
 * QR Code Format (otpauth URL):
 * otpauth://totp/Issuer:user@email.com?secret=BASE32SECRET&issuer=Issuer
 *
 * Reference: RFC 6238 Section 3
 */
export async function generateTOTPSecret(
  userEmail: string,
  issuer: string = MFA_ISSUER
): Promise<{
  secret: string;
  qrCode: string;
  manualEntry: string;
}> {
  // Generate TOTP secret
  // speakeasy creates a random base32-encoded secret
  const secret = speakeasy.generateSecret({
    name: `${issuer} (${userEmail})`,
    issuer: issuer,
    length: 32, // 32 bytes = 256 bits of entropy
  });

  // Generate QR code as Data URL
  // This can be directly used in <img src={qrCode} />
  const qrCode = await QRCode.toDataURL(secret.otpauth_url || '');

  return {
    secret: secret.base32, // Base32 encoded secret (for storage)
    qrCode: qrCode, // Data URL (data:image/png;base64,...)
    manualEntry: secret.base32, // ASCII string for manual entry
  };
}

/**
 * Verify TOTP Code
 *
 * Validates a 6-digit TOTP code against the stored secret.
 * Uses a time window to account for clock drift and user delay.
 *
 * Window Explanation:
 * - window: 2 means ±2 time steps
 * - TOTP changes every 30 seconds
 * - So ±2 = ±60 seconds tolerance
 * - Allows for server/client clock differences
 * - Allows time for user to type the code
 *
 * @param secret - Base32 encoded TOTP secret
 * @param code - 6-digit code from authenticator app
 * @returns true if code is valid, false otherwise
 *
 * Reference: RFC 6238 Section 5.2
 */
export function verifyTOTPCode(secret: string, code: string): boolean {
  try {
    // Verify the TOTP token
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: code,
      window: MFA_WINDOW, // ±2 time steps (60 seconds)
    });

    return verified;
  } catch (error) {
    console.error('TOTP verification error:', error);
    return false;
  }
}

/**
 * Generate Backup Codes
 *
 * Creates one-time use backup codes for account recovery.
 * Used when user loses their phone or authenticator app.
 *
 * Format: 8 characters, alphanumeric, uppercase
 * Example: "A1B2C3D4"
 *
 * Best Practices:
 * - Generate 10 codes (SPECIFICATION Section 5.2.4)
 * - Each code is single-use only
 * - Track used codes to prevent replay
 * - Advise user to store in safe place (password manager, printed)
 * - Can generate new set if all are used
 *
 * @param count - Number of backup codes to generate (default: 10)
 * @returns Array of backup codes
 *
 * Reference: SPECIFICATION Section 4.4.3 - Recovery Codes
 */
export function generateBackupCodes(count: number = MFA_BACKUP_CODES_COUNT): string[] {
  const codes: string[] = [];
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  for (let i = 0; i < count; i++) {
    let code = '';
    for (let j = 0; j < 8; j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    codes.push(code);
  }

  return codes;
}

/**
 * Verify Backup Code
 *
 * Checks if a backup code is valid and hasn't been used before.
 * Backup codes are one-time use for security.
 *
 * Usage Flow:
 * 1. User enters backup code
 * 2. Check if code exists in backupCodes array
 * 3. Check if code NOT in usedCodes array
 * 4. If valid: mark as used (add to usedCodes)
 * 5. Return success
 *
 * @param backupCodes - Array of all valid backup codes
 * @param usedCodes - Array of already used backup codes
 * @param code - Code entered by user
 * @returns true if code is valid and unused, false otherwise
 *
 * Security Note:
 * - After use, code must be added to usedCodes array
 * - Prevents replay attacks (using same code twice)
 */
export function verifyBackupCode(
  backupCodes: string[],
  usedCodes: string[],
  code: string
): boolean {
  // Normalize code (uppercase, trim whitespace)
  const normalizedCode = code.trim().toUpperCase();

  // Check if code exists in backup codes
  const isValidCode = backupCodes.includes(normalizedCode);

  // Check if code has already been used
  const isUsed = usedCodes.includes(normalizedCode);

  // Valid if: code exists AND not yet used
  return isValidCode && !isUsed;
}

/**
 * Generate Current TOTP Code (for testing/simulation)
 *
 * Generates the current TOTP code for a given secret.
 * Used for authenticator app simulation in UI.
 *
 * WARNING: This should ONLY be used for testing/demo purposes.
 * In production, users generate codes on their own devices.
 *
 * @param secret - Base32 encoded TOTP secret
 * @returns Current 6-digit TOTP code
 */
export function generateCurrentTOTPCode(secret: string): string {
  try {
    const token = speakeasy.totp({
      secret: secret,
      encoding: 'base32',
    });

    return token;
  } catch (error) {
    console.error('TOTP generation error:', error);
    return '000000';
  }
}

/**
 * Get Time Until Next Code
 *
 * Calculates seconds remaining until TOTP code changes.
 * TOTP codes change every 30 seconds (at 0s and 30s of each minute).
 *
 * @returns Seconds until next code (0-30)
 */
export function getTimeUntilNextCode(): number {
  const now = Math.floor(Date.now() / 1000);
  const timeStep = 30; // TOTP time step (30 seconds)
  const secondsRemaining = timeStep - (now % timeStep);
  return secondsRemaining;
}

/**
 * Production Recommendations
 *
 * 1. Secret Storage:
 *    - Encrypt TOTP secrets in database (AES-256)
 *    - Never log or expose secrets
 *    - Use environment variable for encryption key
 *
 * 2. Backup Codes:
 *    - Hash backup codes before storing (bcrypt)
 *    - Only show codes once during generation
 *    - Allow user to regenerate if all used
 *    - Recommend storing in password manager
 *
 * 3. Account Recovery:
 *    - Require email verification to disable MFA
 *    - Support tickets for account recovery
 *    - SMS backup option (if phone number verified)
 *    - Consider hardware keys (U2F/WebAuthn)
 *
 * 4. User Experience:
 *    - Provide clear setup instructions
 *    - Test setup before enabling MFA
 *    - Show which apps are compatible
 *    - Warn about phone loss scenario
 *    - Provide printable backup codes
 *
 * 5. Security Best Practices:
 *    - Rate limit MFA verification attempts
 *    - Lock account after 5 failed attempts
 *    - Log all MFA events (setup, verification, failures)
 *    - Monitor for suspicious activity
 *    - Optional: IP-based trusted devices
 */
