import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
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
export async function GET(_request: Request) {
  try {
    // Get sessionId from HTTP-Only cookie
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('SessionID')?.value;

    // No session cookie
    if (!sessionId) {
      return NextResponse.json(
        {
          error: 'No session cookie found',
          sessionId: null,
          sessionExists: false,
        },
        { status: 401 }
      );
    }

    // Look up session in mockDB
    const session = mockDB.sessions[sessionId];

    // Session cookie exists but not in database
    if (!session) {
      return NextResponse.json(
        {
          error: 'Session cookie exists but session not found in database',
          sessionId: sessionId,
          sessionExists: false,
        },
        { status: 401 }
      );
    }

    // Session exists - check if expired
    const now = new Date();
    const expired = session.expiresAt < now;

    // Calculate time remaining
    const timeRemaining = session.expiresAt.getTime() - now.getTime();
    const minutesRemaining = Math.floor(timeRemaining / 60000);

    return NextResponse.json({
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
