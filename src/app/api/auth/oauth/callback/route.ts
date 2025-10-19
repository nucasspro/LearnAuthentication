import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { mockOAuthProvider } from '@/lib/mock-oauth';
import { mockDB } from '@/lib/mock-db';
import { generateAccessToken } from '@/lib/jwt';

/**
 * GET /api/auth/oauth/callback
 *
 * OAuth 2.0 Callback Endpoint
 * Step 3 of OAuth Authorization Code Flow
 *
 * User is redirected here by OAuth provider with auth code
 * Callback URL: /callback?code=AUTH_CODE&state=STATE
 *
 * Flow:
 * 1. Validate state parameter (prevent CSRF)
 * 2. Exchange auth code for access token (via token endpoint)
 * 3. Get user profile using access token
 * 4. Find or create user in our database
 * 5. Generate our own JWT/session
 * 6. Return user data
 *
 * Query Parameters (RFC 6749 Section 4.1.2):
 * - code: Authorization code from authorize endpoint
 * - state: CSRF protection token (should match what we sent)
 * - error: Error code if authorization failed
 * - error_description: Error details
 *
 * Response:
 * - Success: JSON with user data and our JWT token
 * - Error: JSON with error message
 *
 * Security Notes:
 * - Always validate state parameter
 * - Store state in session/database during authorization
 * - Verify state matches on callback
 * - This prevents CSRF attacks
 * - Use HTTPS only in production
 *
 * Reference: SPECIFICATION Section 4.3, Section 8.3
 * RFC 6749 Section 4.1.2 - Authorization Response
 */
export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const error_description = searchParams.get('error_description');

    // Check if OAuth provider returned an error
    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error,
          error_description: error_description || 'Authorization failed',
        },
        { status: 400 }
      );
    }

    // Validate required parameters
    if (!code) {
      return NextResponse.json(
        {
          success: false,
          error: 'invalid_request',
          error_description: 'Missing authorization code',
        },
        { status: 400 }
      );
    }

    // In production: Validate state parameter
    // const storedState = req.session?.oauthState;
    // if (!state || state !== storedState) {
    //   return NextResponse.json({
    //     error: 'invalid_state',
    //     error_description: 'State parameter mismatch - possible CSRF attack',
    //   }, { status: 400 });
    // }

    try {
      // Exchange auth code for OAuth provider access token
      // In production: This would call the real OAuth provider's token endpoint
      // For mock: We simulate the exchange locally
      const tokenResponse = mockOAuthProvider.exchangeCode(
        code,
        'mock-client-id', // Should match client_id from authorize step
        'mock-client-secret'
      );

      // Get user profile from OAuth provider
      const oauthUserProfile = mockOAuthProvider.getUserInfo(tokenResponse.accessToken);

      // In production: Check if user exists, create if necessary
      // For now: Use mock user with ID 1
      const userId = 1;
      const user = mockDB.users[userId];

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            error: 'user_not_found',
          },
          { status: 404 }
        );
      }

      // Generate our own JWT token for this user
      const appAccessToken = generateAccessToken(
        user.id,
        user.email,
        user.username,
        user.role
      );

      // Store token in our database
      const now = new Date();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      mockDB.tokens[appAccessToken] = {
        userId: user.id,
        type: 'access',
        issuedAt: now,
        expiresAt: expiresAt,
        revokedAt: null,
      };

      // Return success with user data and our JWT
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          oauth: {
            id: oauthUserProfile.id,
            name: oauthUserProfile.name,
            picture: oauthUserProfile.picture,
          },
        },
        token: appAccessToken,
        expiresIn: 15 * 60, // 15 minutes in seconds
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      return NextResponse.json(
        {
          success: false,
          error: 'invalid_grant',
          error_description: errorMessage,
        },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Callback endpoint error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'server_error',
        error_description: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
