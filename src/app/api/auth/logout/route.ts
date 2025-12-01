import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
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
export async function POST(_request: Request) {
  try {
    // Get sessionId from HTTP-Only cookie
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('SessionID')?.value;

    // Delete session from mockDB if it exists
    if (sessionId && mockDB.sessions[sessionId]) {
      delete mockDB.sessions[sessionId];
    }

    // Create response and clear cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out',
    });

    // Clear cookie by setting Max-Age=0
    response.cookies.delete('SessionID');

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
