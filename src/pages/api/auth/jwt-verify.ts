import type { NextApiRequest, NextApiResponse } from 'next';
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
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token } = req.body;

    // Validate input
    if (!token) {
      return res.status(400).json({
        valid: false,
        error: 'Token is required'
      });
    }

    if (typeof token !== 'string') {
      return res.status(400).json({
        valid: false,
        error: 'Invalid token format'
      });
    }

    // Verify the access token
    const result = verifyAccessToken(token);

    if (result.valid) {
      return res.status(200).json({
        valid: true,
        decoded: result.decoded,
      });
    } else {
      return res.status(401).json({
        valid: false,
        error: result.error,
      });
    }

  } catch (error) {
    console.error('JWT verify error:', error);
    return res.status(500).json({
      valid: false,
      error: 'Internal server error'
    });
  }
}
