/**
 * Mock OAuth 2.0 Provider
 * Based on SPECIFICATION Section 4.3, Section 8.3
 * RFC 6749: The OAuth 2.0 Authorization Framework
 *
 * This is a MOCK implementation for educational purposes only.
 * It simulates an OAuth provider (like Google or GitHub) without actual network calls.
 *
 * Real Implementation Notes:
 * - In production: Use real OAuth providers (Google, GitHub, Microsoft, etc.)
 * - PKCE (Proof Key for Code Exchange): Required for public clients (SPA)
 *   - public clients: web browsers, mobile apps (cannot securely store secrets)
 *   - confidential clients: backend servers (can securely store secrets)
 *   - For learning: We skip PKCE, but it's essential in production
 * - Security: Always validate state parameter to prevent CSRF attacks
 * - Tokens: Use short expiry for access tokens, longer for refresh tokens
 */

import { mockDB } from './mock-db';
import type { User } from './types';

/**
 * Mock OAuth Authorization Codes
 * Simulates temporary storage of auth codes
 * In real implementation: Redis or database
 */
interface AuthCode {
  code: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  userId: number;
  expiresAt: Date;
  used: boolean;
}

interface AccessTokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  userId: number;
}

/**
 * Mock storage for OAuth flows
 * In production: Use Redis, database, or OAuth provider service
 */
const authCodeStorage: Map<string, AuthCode> = new Map();
const accessTokenStorage: Map<string, AccessTokenData> = new Map();

/**
 * Mock OAuth Provider
 * Simulates Google/GitHub/Microsoft OAuth provider
 */
export const mockOAuthProvider = {
  /**
   * Step 1: Authorization Request
   *
   * User clicks "Login with OAuth Provider"
   * App redirects to: /authorize?client_id=...&redirect_uri=...&scope=...
   *
   * In real flow: User would see a login screen and permission dialog
   * In mock: We auto-approve and generate auth code
   *
   * RFC 6749 Section 4.1.1 - Authorization Request
   */
  authorize(clientId: string, redirectUri: string, scope: string, userId: number = 1) {
    // Validate parameters
    if (!clientId || !redirectUri || !scope) {
      throw new Error('Missing required parameters: clientId, redirectUri, scope');
    }

    // Generate random auth code (in production: cryptographically secure random)
    const authCode = `code_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;

    // Generate expiry time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Store auth code with metadata
    authCodeStorage.set(authCode, {
      code: authCode,
      clientId,
      redirectUri,
      scope,
      userId,
      expiresAt,
      used: false,
    });

    return {
      authCode,
      expiresAt,
    };
  },

  /**
   * Step 2: Authorization Code Exchange
   *
   * Backend exchanges auth code for access token
   * POST /token with: code, client_id, client_secret, grant_type
   *
   * Security checks:
   * - Auth code exists
   * - Auth code not expired
   * - Auth code not already used
   * - client_id matches
   * - client_secret valid (in production)
   *
   * RFC 6749 Section 4.1.3 - Access Token Request
   */
  exchangeCode(authCode: string, clientId: string, clientSecret?: string) {
    // Validate parameters
    if (!authCode || !clientId) {
      throw new Error('Invalid auth code or client_id');
    }

    // Look up auth code
    const codeData = authCodeStorage.get(authCode);

    if (!codeData) {
      throw new Error('Invalid auth code');
    }

    // Check if already used (prevents replay attacks)
    if (codeData.used) {
      throw new Error('Auth code already used');
    }

    // Check if expired
    if (codeData.expiresAt < new Date()) {
      authCodeStorage.delete(authCode);
      throw new Error('Auth code expired');
    }

    // Verify client_id matches
    if (codeData.clientId !== clientId) {
      throw new Error('Invalid client_id');
    }

    // Mark code as used
    codeData.used = true;

    // Generate access token (JWT-like format, but simpler for mock)
    const accessToken = `access_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
    const refreshToken = `refresh_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;

    // Store token metadata
    const tokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    accessTokenStorage.set(accessToken, {
      accessToken,
      refreshToken,
      expiresAt: tokenExpiresAt,
      userId: codeData.userId,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600, // seconds (1 hour)
      tokenType: 'Bearer',
    };
  },

  /**
   * Step 3: Get User Info
   *
   * Backend calls endpoint to get authenticated user's profile
   * GET /userinfo with Authorization: Bearer <accessToken>
   *
   * Returns public user information
   * Password hash and sensitive data excluded
   *
   * RFC 6749 Section 6.3 - Using the Access Token
   */
  getUserInfo(accessToken: string) {
    // Validate access token
    if (!accessToken) {
      throw new Error('Missing access token');
    }

    // Look up token
    const tokenData = accessTokenStorage.get(accessToken);

    if (!tokenData) {
      throw new Error('Invalid access token');
    }

    // Check if expired
    if (tokenData.expiresAt < new Date()) {
      accessTokenStorage.delete(accessToken);
      throw new Error('Access token expired');
    }

    // Get user from database
    const user = mockDB.users[tokenData.userId];

    if (!user) {
      throw new Error('User not found');
    }

    // Return public user information (no passwordHash)
    return {
      id: user.id.toString(),
      email: user.email,
      name: user.username,
      picture: `https://i.pravatar.cc/150?u=${user.email}`, // Placeholder avatar
      roles: [user.role],
    };
  },

  /**
   * Refresh Access Token
   *
   * Used to get new access token without re-authentication
   * POST /token with: grant_type=refresh_token, refresh_token
   */
  refreshAccessToken(refreshToken: string) {
    if (!refreshToken) {
      throw new Error('Missing refresh token');
    }

    // Find token by refresh token
    let tokenData: AccessTokenData | undefined;

    for (const token of accessTokenStorage.values()) {
      if (token.refreshToken === refreshToken) {
        tokenData = token;
        break;
      }
    }

    if (!tokenData) {
      throw new Error('Invalid refresh token');
    }

    // Generate new access token
    const newAccessToken = `access_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
    const newExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

    accessTokenStorage.set(newAccessToken, {
      accessToken: newAccessToken,
      refreshToken,
      expiresAt: newExpiresAt,
      userId: tokenData.userId,
    });

    return {
      accessToken: newAccessToken,
      expiresIn: 3600,
      tokenType: 'Bearer',
    };
  },

  /**
   * Cleanup expired tokens
   * Periodic maintenance to remove expired data
   */
  cleanup() {
    const now = new Date();

    // Clean up expired auth codes
    for (const [code, data] of authCodeStorage.entries()) {
      if (data.expiresAt < now) {
        authCodeStorage.delete(code);
      }
    }

    // Clean up expired access tokens
    for (const [token, data] of accessTokenStorage.entries()) {
      if (data.expiresAt < now) {
        accessTokenStorage.delete(token);
      }
    }
  },
};

/**
 * Production Recommendations
 *
 * 1. PKCE (Proof Key for Code Exchange)
 *    - Required for public clients (SPAs, mobile apps)
 *    - Prevents authorization code interception attacks
 *    - How it works:
 *      - Client generates random code_verifier (43-128 chars)
 *      - Client sends code_challenge = SHA256(code_verifier) to authorize endpoint
 *      - Authorization endpoint stores code_challenge
 *      - Token endpoint: Client sends code_verifier
 *      - Server verifies: SHA256(code_verifier) == stored code_challenge
 *    - Implemented in RFC 7636
 *
 * 2. State Parameter
 *    - Prevents CSRF attacks
 *    - Client generates random state value
 *    - Server returns same state in callback
 *    - Client verifies state matches
 *
 * 3. Use Real OAuth Providers
 *    - Google OAuth
 *    - GitHub OAuth
 *    - Microsoft OAuth
 *    - These handle security, token storage, and best practices
 *
 * 4. Token Storage
 *    - Access tokens: Secure HTTP-Only cookies (expiry in minutes)
 *    - Refresh tokens: Secure HTTP-Only cookies (expiry in days)
 *    - Never store in localStorage (XSS risk)
 *
 * 5. HTTPS Only
 *    - OAuth requires secure channel
 *    - Always use HTTPS in production
 */
