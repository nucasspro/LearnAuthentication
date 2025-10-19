import { NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/jwt';

/**
 * POST /api/auth/jwt-verify
 *
 * Verifies the validity of a JWT access token.
 *
 * Used for:
 * - Client-side token validation before API calls
 * - Testing token validity
 * - Debugging authentication issues
 *
 * Flow:
 * 1. Extract token from request body
 * 2. Verify signature and expiration
 * 3. Return validation result with decoded payload
 *
 * Security notes:
 * - Verifies cryptographic signature (prevents tampering)
 * - Checks expiration timestamp (prevents replay attacks)
 * - Validates issuer and audience claims
 * - Returns detailed error messages for debugging
 *
 * Reference: SPECIFICATION Section 5.1.5, RFC 7519
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    // Validate input
    if (!token) {
      return NextResponse.json(
        {
          valid: false,
          error: 'Token is required'
        },
        { status: 400 }
      );
    }

    if (typeof token !== 'string') {
      return NextResponse.json(
        {
          valid: false,
          error: 'Invalid token format'
        },
        { status: 400 }
      );
    }

    // Verify the access token
    const result = verifyAccessToken(token);

    if (result.valid) {
      return NextResponse.json({
        valid: true,
        decoded: result.decoded,
      });
    } else {
      return NextResponse.json(
        {
          valid: false,
          error: result.error,
        },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('JWT verify error:', error);
    return NextResponse.json(
      {
        valid: false,
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}
