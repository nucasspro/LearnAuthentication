import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
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
export async function GET(request: Request) {
  try {
    // Get sessionId from HTTP-Only cookie
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('SessionID')?.value;

    // Debug logging
    console.log('[Verify] SessionID from cookie:', sessionId ? 'exists' : 'missing');
    console.log('[Verify] Active sessions:', Object.keys(mockDB.sessions).length);

    // Check if session exists
    if (!sessionId) {
      return NextResponse.json(
        {
          authenticated: false,
          error: 'No session cookie found',
        },
        { status: 401 }
      );
    }

    // Look up session in mockDB
    const session = mockDB.sessions[sessionId];

    if (!session) {
      console.log('[Verify] Session not found in database');
      return NextResponse.json(
        {
          authenticated: false,
          error: 'Session not found - please log in again',
        },
        { status: 401 }
      );
    }

    // Check if session has expired
    const now = new Date();
    if (session.expiresAt < now) {
      // Clean up expired session
      delete mockDB.sessions[sessionId];
      console.log('[Verify] Session expired');

      return NextResponse.json(
        {
          authenticated: false,
          error: 'Session expired - please log in again',
        },
        { status: 401 }
      );
    }

    // Update last activity timestamp
    session.lastActivity = now;

    // Get user from mockDB
    const user = mockDB.users[session.userId];

    if (!user) {
      // User was deleted but session still exists
      delete mockDB.sessions[sessionId];

      return NextResponse.json(
        {
          authenticated: false,
          error: 'No valid session',
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

    return NextResponse.json({
      authenticated: true,
      user: userResponse,
      method: 'session',
    });

  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
