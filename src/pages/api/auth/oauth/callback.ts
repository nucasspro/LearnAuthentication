import type { NextApiRequest, NextApiResponse } from 'next';
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
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract query parameters
    const { code, state, error, error_description } = req.query;

    // Check if OAuth provider returned an error
    if (error) {
      return res.status(400).json({
        success: false,
        error: error,
        error_description: error_description || 'Authorization failed',
      });
    }

    // Validate required parameters
    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'invalid_request',
        error_description: 'Missing authorization code',
      });
    }

    // In production: Validate state parameter
    // const storedState = req.session?.oauthState;
    // if (!state || state !== storedState) {
    //   return res.status(400).json({
    //     error: 'invalid_state',
    //     error_description: 'State parameter mismatch - possible CSRF attack',
    //   });
    // }

    const codeStr = Array.isArray(code) ? code[0] : code;

    try {
      // Exchange auth code for OAuth provider access token
      // In production: This would call the real OAuth provider's token endpoint
      // For mock: We simulate the exchange locally
      const tokenResponse = mockOAuthProvider.exchangeCode(
        codeStr,
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
        return res.status(404).json({
          success: false,
          error: 'user_not_found',
        });
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
      return res.status(200).json({
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

      return res.status(401).json({
        success: false,
        error: 'invalid_grant',
        error_description: errorMessage,
      });
    }

  } catch (error) {
    console.error('Callback endpoint error:', error);
    return res.status(500).json({
      success: false,
      error: 'server_error',
      error_description: 'Internal server error',
    });
  }
}
