import type { NextApiRequest, NextApiResponse } from 'next';
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
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { refreshToken } = req.body;

    // Validate input
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    if (typeof refreshToken !== 'string') {
      return res.status(400).json({ error: 'Invalid token format' });
    }

    // Verify the refresh token signature and expiration
    const verifyResult = verifyRefreshToken(refreshToken);

    if (!verifyResult.valid) {
      return res.status(401).json({
        error: 'Invalid or expired refresh token'
      });
    }

    // Extract userId from decoded token
    const userId = parseInt(verifyResult.decoded.sub);

    // Check if refresh token exists in database and is not revoked
    const tokenRecord = mockDB.refreshTokens[refreshToken];

    if (!tokenRecord) {
      return res.status(401).json({
        error: 'Invalid or expired refresh token'
      });
    }

    if (tokenRecord.revokedAt !== null) {
      return res.status(401).json({
        error: 'Refresh token has been revoked'
      });
    }

    // Verify token hasn't expired in database
    const now = new Date();
    if (tokenRecord.expiresAt < now) {
      return res.status(401).json({
        error: 'Invalid or expired refresh token'
      });
    }

    // Get user from database
    const user = mockDB.users[userId];

    if (!user) {
      return res.status(401).json({
        error: 'User not found'
      });
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
      return res.status(200).json({
        success: true,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: JWT_EXPIRATION,
      });
    }

    // Without rotation: return only new access token
    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      expiresIn: JWT_EXPIRATION,
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
