import type { NextApiRequest, NextApiResponse } from 'next';
import { mockDB } from '@/lib/mock-db';

/**
 * POST /api/auth/logout
 *
 * Session-based authentication logout endpoint.
 *
 * Security measures:
 * - Deletes session from server-side storage
 * - Clears HTTP-Only cookie
 * - Safe to call even if no session exists
 *
 * Reference: SPECIFICATION Section 5.1.2
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
    // Get sessionId from HTTP-Only cookie
    const sessionId = req.cookies.SessionID;

    // Delete session from mockDB if it exists
    if (sessionId && mockDB.sessions[sessionId]) {
      delete mockDB.sessions[sessionId];
    }

    // Clear cookie by setting Max-Age=0
    // This works even if no cookie existed
    const cookieValue = 'SessionID=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/';
    res.setHeader('Set-Cookie', cookieValue);

    return res.status(200).json({
      success: true,
      message: 'Logged out',
    });

  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
