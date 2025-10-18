import type { NextApiRequest, NextApiResponse } from 'next';
import { mockDB } from '@/lib/mock-db';
import { verifyAccessToken } from '@/lib/jwt';

/**
 * GET /api/auth/protected-test
 *
 * Protected endpoint that requires JWT authentication.
 *
 * This endpoint demonstrates how to protect API routes using JWT tokens.
 * It's a testing endpoint to verify that JWT authentication works correctly.
 *
 * Authentication flow:
 * 1. Extract token from Authorization header: "Bearer <token>"
 * 2. Verify token signature and expiration
 * 3. Extract user ID from token claims
 * 4. Verify user exists in database
 * 5. Return protected resource
 *
 * Security measures:
 * - Validates Authorization header format
 * - Verifies JWT signature (prevents tampering)
 * - Checks token expiration (prevents replay attacks)
 * - Validates user still exists (handles deleted users)
 * - Returns 401 for any authentication failure
 *
 * Usage in client:
 * ```
 * fetch('/api/auth/protected-test', {
 *   headers: {
 *     'Authorization': `Bearer ${accessToken}`
 *   }
 * })
 * ```
 *
 * Reference: SPECIFICATION Section 4.2.4, Section 8.2
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'No Authorization header provided'
      });
    }

    // Validate Authorization header format: "Bearer <token>"
    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Invalid Authorization header format. Expected: Bearer <token>'
      });
    }

    const token = parts[1];

    // Verify the access token
    const verifyResult = verifyAccessToken(token);

    if (!verifyResult.valid) {
      return res.status(401).json({
        error: 'Authentication required',
        message: verifyResult.error || 'Invalid token'
      });
    }

    // Extract userId from decoded token
    const userId = parseInt(verifyResult.decoded!.sub);

    // Find user in database
    const user = mockDB.users[userId];

    if (!user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'User not found'
      });
    }

    // Check if token exists in database and is not revoked (optional check)
    const tokenRecord = mockDB.tokens[token];

    if (tokenRecord && tokenRecord.revokedAt !== null) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Token has been revoked'
      });
    }

    // Successfully authenticated - return protected resource
    return res.status(200).json({
      message: 'You have access to protected resource',
      data: {
        secretInfo: 'This is confidential data only accessible with valid JWT',
        userId: user.id,
        username: user.username,
        role: user.role,
        timestamp: new Date().toISOString(),
      },
      // Include token metadata for debugging
      tokenInfo: {
        issuedAt: new Date(verifyResult.decoded!.iat * 1000).toISOString(),
        expiresAt: new Date(verifyResult.decoded!.exp * 1000).toISOString(),
      }
    });

  } catch (error) {
    console.error('Protected endpoint error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
