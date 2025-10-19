import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { JWT_EXPIRATION } from '@/lib/constants';

/**
 * POST /api/auth/refresh-token
 *
 * Refreshes an expired access token using a valid refresh token.
 *
 * This endpoint implements refresh token rotation for enhanced security:
 * 1. Validates the provided refresh token
 * 2. Checks if token is not revoked
 * 3. Issues a new access token
 * 4. Optionally rotates the refresh token (new refresh token issued)
 *
 * Security benefits:
 * - Users don't need to re-enter credentials frequently
 * - Access tokens can be short-lived (15 min)
 * - Refresh tokens can be revoked if compromised
 * - Refresh token rotation limits damage from token theft
 *
 * Security measures:
 * - Verifies refresh token signature and expiration
 * - Checks token is not revoked in database
 * - Validates user still exists
 * - Implements token rotation (optional but recommended)
 *
 * Reference: SPECIFICATION Section 4.2.3, Section 5.1.6, Section 8.2
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    // Validate input
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      );
    }

    if (typeof refreshToken !== 'string') {
      return NextResponse.json(
        { error: 'Invalid token format' },
        { status: 400 }
      );
    }

    // Verify the refresh token signature and expiration
    const verifyResult = verifyRefreshToken(refreshToken);

    if (!verifyResult.valid) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    // Extract userId from decoded token
    const userId = parseInt(verifyResult.decoded.sub);

    // Check if refresh token exists in database and is not revoked
    const tokenRecord = mockDB.refreshTokens[refreshToken];

    if (!tokenRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    if (tokenRecord.revokedAt !== null) {
      return NextResponse.json(
        { error: 'Refresh token has been revoked' },
        { status: 401 }
      );
    }

    // Verify token hasn't expired in database
    const now = new Date();
    if (tokenRecord.expiresAt < now) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = mockDB.users[userId];

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(
      user.id,
      user.email,
      user.username,
      user.role
    );

    // Store new access token in mockDB
    const accessTokenExpiresAt = new Date(Date.now() + JWT_EXPIRATION * 1000);

    mockDB.tokens[newAccessToken] = {
      userId: user.id,
      type: 'access',
      issuedAt: now,
      expiresAt: accessTokenExpiresAt,
      revokedAt: null,
    };

    // Optional: Implement refresh token rotation for enhanced security
    // This revokes the old refresh token and issues a new one
    const ENABLE_REFRESH_TOKEN_ROTATION = true;

    if (ENABLE_REFRESH_TOKEN_ROTATION) {
      // Revoke old refresh token
      tokenRecord.revokedAt = now;

      // Generate new refresh token
      const newRefreshToken = generateRefreshToken(user.id);
      const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      // Store new refresh token
      mockDB.refreshTokens[newRefreshToken] = {
        userId: user.id,
        type: 'refresh',
        issuedAt: now,
        expiresAt: refreshTokenExpiresAt,
        revokedAt: null,
      };

      // Return new tokens (both access and refresh)
      return NextResponse.json({
        success: true,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: JWT_EXPIRATION,
      });
    }

    // Without rotation: return only new access token
    return NextResponse.json({
      success: true,
      accessToken: newAccessToken,
      expiresIn: JWT_EXPIRATION,
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
