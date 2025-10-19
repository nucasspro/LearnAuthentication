import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { mockDB, findUserById } from '@/lib/mock-db';
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
export async function GET(request: Request) {
  try {
    // Debug: Log all request headers
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log('[Verify] Request headers:', JSON.stringify(headers, null, 2));
    console.log('[Verify] Request URL:', request.url);

    // Get sessionId from HTTP-Only cookie
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    console.log('[Verify] All cookies:', allCookies.map(c => ({ name: c.name, value: c.value.substring(0, 20) + '...' })));

    const sessionId = cookieStore.get('SessionID')?.value;

    // Debug logging
    console.log('[Verify] SessionID from cookie:', sessionId ? `${sessionId.substring(0, 20)}...` : 'MISSING');
    console.log('[Verify] Active sessions count:', Object.keys(mockDB.sessions).length);
    console.log('[Verify] Active session IDs:', Object.keys(mockDB.sessions).map(s => s.substring(0, 20) + '...'));

    // Check if session exists
    if (!sessionId) {
      console.log('[Verify] ERROR: No session cookie found');
      return NextResponse.json(
        {
          authenticated: false,
          error: 'No session cookie found',
          debug: {
            cookiesReceived: allCookies.map(c => c.name),
            expectedCookie: 'SessionID'
          }
        },
        { status: 401 }
      );
    }

    // Look up session in mockDB
    const session = mockDB.sessions[sessionId];

    if (!session) {
      console.log('[Verify] ERROR: Session not found in database');
      console.log('[Verify] Looking for sessionId:', sessionId.substring(0, 20) + '...');
      console.log('[Verify] Available sessions:', Object.keys(mockDB.sessions).map(s => s.substring(0, 20) + '...'));
      return NextResponse.json(
        {
          authenticated: false,
          error: 'Session not found - please log in again',
          debug: {
            sessionId: sessionId.substring(0, 20) + '...',
            activeSessions: Object.keys(mockDB.sessions).length,
            reason: 'Session ID not in database (likely server restart)'
          }
        },
        { status: 401 }
      );
    }

    // Check if session has expired
    const now = new Date();
    if (session.expiresAt < now) {
      // Clean up expired session
      delete mockDB.sessions[sessionId];
      console.log('[Verify] ERROR: Session expired');
      console.log('[Verify] Expired at:', session.expiresAt);
      console.log('[Verify] Current time:', now);

      return NextResponse.json(
        {
          authenticated: false,
          error: 'Session expired - please log in again',
          debug: {
            expiredAt: session.expiresAt,
            currentTime: now,
            reason: 'Session timeout (24 hours)'
          }
        },
        { status: 401 }
      );
    }

    // Update last activity timestamp
    session.lastActivity = now;

    // Get user from mockDB using helper function (users is an array, not an object)
    const user = findUserById(session.userId);

    if (!user) {
      // User was deleted but session still exists
      delete mockDB.sessions[sessionId];
      console.log('[Verify] ERROR: User not found for session');
      console.log('[Verify] Session userId:', session.userId);

      return NextResponse.json(
        {
          authenticated: false,
          error: 'User not found',
          debug: {
            userId: session.userId,
            reason: 'User deleted but session exists'
          }
        },
        { status: 401 }
      );
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

    console.log('[Verify] SUCCESS: User verified');
    console.log('[Verify] User:', user.username, 'ID:', user.id);

    return NextResponse.json({
      authenticated: true,
      user: userResponse,
      method: 'session',
    });

  } catch (error) {
    console.error('[Verify] EXCEPTION:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        debug: {
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      },
      { status: 500 }
    );
  }
}
