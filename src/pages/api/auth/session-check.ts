import type { NextApiRequest, NextApiResponse } from 'next';
import { mockDB } from '@/lib/mock-db';

/**
 * GET /api/auth/session-check
 *
 * Debug endpoint to inspect current session state.
 *
 * WARNING: This endpoint is for development/debugging only.
 * DO NOT use in production as it exposes session internals.
 *
 * Returns detailed session information including:
 * - Session ID
 * - User ID
 * - Creation timestamp
 * - Expiration timestamp
 * - Last activity timestamp
 * - Expiration status
 *
 * Reference: SPECIFICATION Section 5.1.7 (Debug endpoints)
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

    // No session cookie
    if (!sessionId) {
      return res.status(401).json({
        error: 'No session cookie found',
        sessionId: null,
        sessionExists: false,
      });
    }

    // Look up session in mockDB
    const session = mockDB.sessions[sessionId];

    // Session cookie exists but not in database
    if (!session) {
      return res.status(401).json({
        error: 'Session cookie exists but session not found in database',
        sessionId: sessionId,
        sessionExists: false,
      });
    }

    // Session exists - check if expired
    const now = new Date();
    const expired = session.expiresAt < now;

    // Calculate time remaining
    const timeRemaining = session.expiresAt.getTime() - now.getTime();
    const minutesRemaining = Math.floor(timeRemaining / 60000);

    return res.status(200).json({
      sessionId: sessionId,
      userId: session.userId,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      lastActivity: session.lastActivity,
      expired: expired,
      timeRemaining: expired ? 0 : timeRemaining,
      minutesRemaining: expired ? 0 : minutesRemaining,
      createdAtISO: new Date(session.createdAt).toISOString(),
      expiresAtISO: new Date(session.expiresAt).toISOString(),
      lastActivityISO: new Date(session.lastActivity).toISOString(),
    });

  } catch (error) {
    console.error('Session check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
