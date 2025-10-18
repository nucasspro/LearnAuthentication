import type { NextApiRequest, NextApiResponse } from 'next';
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
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract query parameters
    const {
      client_id,
      redirect_uri,
      response_type = 'code',
      scope = 'openid email profile',
      state,
    } = req.query;

    // Validate required parameters
    if (!client_id || !redirect_uri) {
      return res.status(400).json({
        error: 'invalid_request',
        error_description: 'Missing required parameters: client_id, redirect_uri',
      });
    }

    // Validate response_type
    if (response_type !== 'code') {
      return res.status(400).json({
        error: 'unsupported_response_type',
        error_description: 'Only authorization_code flow is supported',
      });
    }

    // Ensure parameters are strings
    const clientIdStr = Array.isArray(client_id) ? client_id[0] : client_id;
    const redirectUriStr = Array.isArray(redirect_uri) ? redirect_uri[0] : redirect_uri;
    const scopeStr = Array.isArray(scope) ? scope[0] : scope;
    const stateStr = Array.isArray(state) ? state[0] : state;

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
        clientIdStr,
        redirectUriStr,
        scopeStr,
        1 // Mock user ID (would be logged-in user in production)
      );

      // Build redirect URL with auth code and state
      const redirectUrl = new URL(redirectUriStr);
      redirectUrl.searchParams.append('code', authCode);

      if (stateStr) {
        redirectUrl.searchParams.append('state', stateStr);
      }

      // Redirect user back to app with auth code
      return res.redirect(302, redirectUrl.toString());

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      return res.status(400).json({
        error: 'server_error',
        error_description: errorMessage,
      });
    }

  } catch (error) {
    console.error('Authorization endpoint error:', error);
    return res.status(500).json({
      error: 'server_error',
      error_description: 'Internal server error',
    });
  }
}
