import type { NextApiRequest, NextApiResponse } from 'next';
import { mockDB } from '@/lib/mock-db';
import type { User } from '@/lib/types';

/**
 * GET /api/auth/verify
 *
 * Verifies if a valid session exists for the current request.
 *
 * Used for:
 * - Client-side authentication state checks
 * - Protected route validation
 * - Session expiration checking
 *
 * Security measures:
 * - Checks session expiration
 * - Validates session exists in server storage
 * - Returns user info without sensitive data
 *
 * Reference: SPECIFICATION Section 5.1.3
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
    // Get sessionId from HTTP-Only cookie
    const sessionId = req.cookies.SessionID;

    // Check if session exists
    if (!sessionId) {
      return res.status(401).json({
        authenticated: false,
        error: 'No valid session',
      });
    }

    // Look up session in mockDB
    const session = mockDB.sessions[sessionId];

    if (!session) {
      return res.status(401).json({
        authenticated: false,
        error: 'No valid session',
      });
    }

    // Check if session has expired
    const now = new Date();
    if (session.expiresAt < now) {
      // Clean up expired session
      delete mockDB.sessions[sessionId];

      return res.status(401).json({
        authenticated: false,
        error: 'No valid session',
      });
    }

    // Update last activity timestamp
    session.lastActivity = now;

    // Get user from mockDB
    const user = mockDB.users[session.userId];

    if (!user) {
      // User was deleted but session still exists
      delete mockDB.sessions[sessionId];

      return res.status(401).json({
        authenticated: false,
        error: 'No valid session',
      });
    }

    // Return user info (excluding passwordHash)
    const userResponse: Omit<User, 'passwordHash'> = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      mfaEnabled: user.mfaEnabled,
      createdAt: user.createdAt,
    };

    return res.status(200).json({
      authenticated: true,
      user: userResponse,
      method: 'session',
    });

  } catch (error) {
    console.error('Verify error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
