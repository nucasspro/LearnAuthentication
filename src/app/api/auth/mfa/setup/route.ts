import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';
import { generateTOTPSecret, generateBackupCodes } from '@/lib/mfa';

/**
 * POST /api/auth/mfa/setup
 *
 * MFA Setup Endpoint - Generates TOTP secret and backup codes
 * Step 1 of MFA enrollment process
 *
 * This endpoint initiates the MFA setup process by:
 * 1. Generating a new TOTP secret
 * 2. Creating a QR code for authenticator apps
 * 3. Generating backup codes for account recovery
 * 4. Storing everything (with enabled=false until verified)
 *
 * Request Body:
 * - userId: number (required) - User ID to set up MFA for
 *
 * Response (200 OK):
 * {
 *   secret: "JBSWY3DPEBLW64TMMQ======",   // Base32 secret (for manual entry)
 *   qrCode: "data:image/png;base64,...",   // QR code image (for scanning)
 *   manualEntry: "JBSWY3DPEBLW64TMMQ======", // Same as secret
 *   backupCodes: ["CODE1", "CODE2", ...]  // 10 one-time backup codes
 * }
 *
 * Flow After This Endpoint:
 * 1. User receives QR code
 * 2. User scans QR with Google Authenticator/Authy/etc.
 * 3. App generates 6-digit code
 * 4. User enters code in verify endpoint
 * 5. Verify endpoint checks code & enables MFA
 *
 * Security Notes:
 * - Secret is NOT enabled until verified (enabled=false)
 * - This prevents partial setup leaving account vulnerable
 * - Backup codes shown ONCE (user must save them)
 * - In production: require current password to set up MFA
 * - In production: send email notification about MFA setup
 *
 * Reference: SPECIFICATION Section 4.4.1, Section 5.1.9
 * RFC 6238: TOTP Algorithm
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    // Validate required parameters
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    if (typeof userId !== 'number') {
      return NextResponse.json(
        { error: 'Invalid userId format' },
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

    // Generate TOTP secret and QR code
    const totpData = await generateTOTPSecret(user.email);

    // Generate backup codes (10 codes)
    const backupCodes = generateBackupCodes(10);

    // Store MFA configuration in database
    // NOTE: enabled=false until user verifies they can generate codes
    const now = new Date();

    mockDB.mfaSecrets[userId] = {
      userId: userId,
      secret: totpData.secret, // Base32 encoded secret
      enabled: false, // NOT enabled until verified
      backupCodes: backupCodes, // All 10 codes
      usedCodes: [], // No codes used yet
      createdAt: now,
    };

    // Return setup data to client
    // IMPORTANT: This is the ONLY time backup codes are shown
    // User must save them securely
    return NextResponse.json({
      secret: totpData.secret,
      qrCode: totpData.qrCode,
      manualEntry: totpData.manualEntry,
      backupCodes: backupCodes,
    });

  } catch (error) {
    console.error('MFA setup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
