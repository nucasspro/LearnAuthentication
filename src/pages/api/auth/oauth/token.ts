import type { NextApiRequest, NextApiResponse } from 'next';
import { mockOAuthProvider } from '@/lib/mock-oauth';

/**
 * POST /api/auth/oauth/token
 *
 * OAuth 2.0 Token Endpoint
 * Step 2 of OAuth Authorization Code Flow
 *
 * Backend exchanges authorization code for access token
 * This endpoint is called by backend services, not browser
 *
 * Request Body (RFC 6749 Section 4.1.3):
 * - grant_type: "authorization_code" or "refresh_token"
 * - code: Authorization code (if grant_type=authorization_code)
 * - redirect_uri: Must match what was used in authorize step
 * - client_id: Application identifier
 * - client_secret: Application secret (confidential clients only)
 * - refresh_token: Previous refresh token (if grant_type=refresh_token)
 *
 * Response (on success):
 * {
 *   "access_token": "...",
 *   "refresh_token": "...",
 *   "expires_in": 3600,
 *   "token_type": "Bearer"
 * }
 *
 * Response (on error):
 * {
 *   "error": "invalid_grant",
 *   "error_description": "..."
 * }
 *
 * Security Notes:
 * - NEVER expose client_secret in frontend code
 * - This endpoint should be called from backend only
 * - Use HTTPS only in production
 * - Validate client_id and client_secret
 * - Authorization codes are single-use only
 * - Authorization codes expire quickly (5-10 minutes)
 *
 * Reference: SPECIFICATION Section 4.3, Section 8.3
 * RFC 6749 Section 4.1.3 - Access Token Request
 * RFC 6749 Section 6 - Refreshing an Access Token
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'method_not_allowed',
      error_description: 'Only POST requests are allowed',
    });
  }

  try {
    // Extract request body
    const {
      grant_type,
      code,
      redirect_uri,
      client_id,
      client_secret,
      refresh_token,
    } = req.body;

    // Validate grant_type
    if (!grant_type || (grant_type !== 'authorization_code' && grant_type !== 'refresh_token')) {
      return res.status(400).json({
        error: 'invalid_request',
        error_description: 'grant_type must be "authorization_code" or "refresh_token"',
      });
    }

    // Handle Authorization Code Flow (grant_type=authorization_code)
    if (grant_type === 'authorization_code') {
      // Validate required parameters for authorization_code flow
      if (!code || !client_id) {
        return res.status(400).json({
          error: 'invalid_request',
          error_description: 'Missing required parameters: code, client_id',
        });
      }

      try {
        // Exchange authorization code for tokens
        const tokenResponse = mockOAuthProvider.exchangeCode(code, client_id, client_secret);

        // Return token response
        return res.status(200).json({
          access_token: tokenResponse.accessToken,
          refresh_token: tokenResponse.refreshToken,
          expires_in: tokenResponse.expiresIn,
          token_type: tokenResponse.tokenType,
        });

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        // Determine appropriate error code
        let errorCode = 'invalid_grant';

        if (errorMessage.includes('expired')) {
          errorCode = 'invalid_grant'; // Auth code expired
        } else if (errorMessage.includes('already used')) {
          errorCode = 'invalid_grant'; // Attempt to reuse code
        } else if (errorMessage.includes('Invalid')) {
          errorCode = 'invalid_grant'; // Invalid code or client_id
        }

        return res.status(400).json({
          error: errorCode,
          error_description: errorMessage,
        });
      }
    }

    // Handle Refresh Token Flow (grant_type=refresh_token)
    if (grant_type === 'refresh_token') {
      // Validate required parameters for refresh_token flow
      if (!refresh_token || !client_id) {
        return res.status(400).json({
          error: 'invalid_request',
          error_description: 'Missing required parameters: refresh_token, client_id',
        });
      }

      try {
        // Refresh the access token
        const newTokenResponse = mockOAuthProvider.refreshAccessToken(refresh_token);

        return res.status(200).json({
          access_token: newTokenResponse.accessToken,
          refresh_token: refresh_token, // Same refresh token (in some implementations)
          expires_in: newTokenResponse.expiresIn,
          token_type: newTokenResponse.tokenType,
        });

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        return res.status(400).json({
          error: 'invalid_grant',
          error_description: errorMessage,
        });
      }
    }

  } catch (error) {
    console.error('Token endpoint error:', error);
    return res.status(500).json({
      error: 'server_error',
      error_description: 'Internal server error',
    });
  }
}
