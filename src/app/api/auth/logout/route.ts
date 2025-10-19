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
export async function POST(request: Request) {
  try {
    // Get sessionId from HTTP-Only cookie
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('SessionID')?.value;

    // Delete session from mockDB if it exists
    if (sessionId && mockDB.sessions[sessionId]) {
      delete mockDB.sessions[sessionId];
    }

    // Clear cookie by setting Max-Age=0
    // This works even if no cookie existed
    cookieStore.delete('SessionID');

    return NextResponse.json({
      success: true,
      message: 'Logged out',
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
