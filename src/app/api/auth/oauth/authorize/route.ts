import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { mockOAuthProvider } from '@/lib/mock-oauth';

/**
 * GET /api/auth/oauth/authorize
 *
 * OAuth 2.0 Authorization Endpoint
 * Step 1 of OAuth Authorization Code Flow
 *
 * User is redirected here by the app: /authorize?client_id=...&redirect_uri=...
 * In real flow: User would see login/permission dialog
 * In mock: We auto-approve and redirect to callback with auth code
 *
 * Query Parameters (RFC 6749 Section 4.1.1):
 * - client_id: Application identifier
 * - redirect_uri: Where to send user back with auth code
 * - response_type: Should be "code" for authorization code flow
 * - scope: Requested permissions (optional)
 * - state: CSRF protection token (optional but recommended)
 *
 * Response:
 * - Redirect to: redirect_uri?code=AUTH_CODE&state=STATE
 *
 * Security Notes:
 * - In production: Verify client_id is registered
 * - In production: Verify redirect_uri matches registered URLs
 * - In production: Show user a permission dialog
 * - Always validate state parameter on callback
 *
 * Reference: SPECIFICATION Section 4.3, Section 8.3
 * RFC 6749 Section 4.1 - Authorization Code Flow
 */
export async function GET(request: NextRequest) {
  try {
    // Extract query parameters
    const searchParams = request.nextUrl.searchParams;
    const client_id = searchParams.get('client_id');
    const redirect_uri = searchParams.get('redirect_uri');
    const response_type = searchParams.get('response_type') || 'code';
    const scope = searchParams.get('scope') || 'openid email profile';
    const state = searchParams.get('state');

    // Validate required parameters
    if (!client_id || !redirect_uri) {
      return NextResponse.json(
        {
          error: 'invalid_request',
          error_description: 'Missing required parameters: client_id, redirect_uri',
        },
        { status: 400 }
      );
    }

    // Validate response_type
    if (response_type !== 'code') {
      return NextResponse.json(
        {
          error: 'unsupported_response_type',
          error_description: 'Only authorization_code flow is supported',
        },
        { status: 400 }
      );
    }

    // In real implementation:
    // 1. Verify client_id is registered
    // 2. Verify redirect_uri matches registered URLs for this client
    // 3. Show user login/permission screen
    // 4. Get user approval

    // Mock implementation: Auto-approve (for demo)
    // In production: Implement proper authorization dialog

    try {
      // Generate authorization code
      const { authCode } = mockOAuthProvider.authorize(
        client_id,
        redirect_uri,
        scope,
        1 // Mock user ID (would be logged-in user in production)
      );

      // Build redirect URL with auth code and state
      const redirectUrl = new URL(redirect_uri);
      redirectUrl.searchParams.append('code', authCode);

      if (state) {
        redirectUrl.searchParams.append('state', state);
      }

      // Redirect user back to app with auth code
      return NextResponse.redirect(redirectUrl.toString());

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      return NextResponse.json(
        {
          error: 'server_error',
          error_description: errorMessage,
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Authorization endpoint error:', error);
    return NextResponse.json(
      {
        error: 'server_error',
        error_description: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
