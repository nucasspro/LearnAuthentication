/**
 * JWT Token Generation and Verification
 * Based on SPECIFICATION Section 4.2, Section 5.1.4-5.1.6
 * RFC 7519: JSON Web Token (JWT)
 *
 * This module provides JWT-based authentication using the jsonwebtoken library.
 *
 * Security Notes:
 * - Access tokens are short-lived (15 minutes) to limit damage if compromised
 * - Refresh tokens are longer-lived (7 days) for user convenience
 * - Tokens should be stored securely (HTTP-Only cookies recommended)
 * - Never store tokens in localStorage in production (XSS risk)
 * - Always use HTTPS in production
 * - JWT_SECRET must be strong (minimum 256 bits / 32 characters)
 */

import jwt from 'jsonwebtoken';
import {
  JWT_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
  JWT_CONFIG,
} from './constants';
import type { JWTPayload } from './types';

/**
 * Get JWT secret from environment variable
 * SECURITY: Never hardcode secrets. Always use environment variables.
 */
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-min-32-chars-change-this-in-production';

// Warn if using default secret (development only)
if (JWT_SECRET === 'your-secret-key-min-32-chars-change-this-in-production') {
  console.warn(
    '⚠️  WARNING: Using default JWT_SECRET. Set JWT_SECRET in .env.local for production!'
  );
}

/**
 * Generate Access Token (Short-lived)
 *
 * Access tokens are used for API authentication and expire quickly.
 * Section 4.2.2 - Access Token Structure
 *
 * @param userId - User's unique identifier
 * @param email - User's email
 * @param username - User's username
 * @param role - User's role (admin/user)
 * @returns JWT access token string
 *
 * Claims:
 * - sub: Subject (user ID)
 * - email: User email
 * - username: Username
 * - role: User role
 * - type: "access" (distinguishes from refresh token)
 * - iat: Issued at timestamp (automatic)
 * - exp: Expiration timestamp (automatic)
 */
export function generateAccessToken(
  userId: number,
  email: string,
  username: string,
  role: 'admin' | 'user'
): string {
  const payload: JWTPayload = {
    sub: userId.toString(),
    email,
    username,
    role,
    type: 'access',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + JWT_EXPIRATION,
  };

  return jwt.sign(payload, JWT_SECRET, {
    algorithm: JWT_CONFIG.algorithm,
    issuer: JWT_CONFIG.issuer,
    audience: JWT_CONFIG.audience,
  });
}

/**
 * Generate Refresh Token (Long-lived)
 *
 * Refresh tokens are used to obtain new access tokens without re-authentication.
 * Section 4.2.3 - Refresh Token Structure
 *
 * @param userId - User's unique identifier
 * @returns JWT refresh token string
 *
 * Claims:
 * - sub: Subject (user ID)
 * - type: "refresh" (distinguishes from access token)
 * - iat: Issued at timestamp (automatic)
 * - exp: Expiration timestamp (automatic)
 *
 * Security Note:
 * - Refresh tokens should be stored securely (HTTP-Only cookie)
 * - Should be rotated on each use (refresh token rotation)
 * - Can be revoked if compromised
 */
export function generateRefreshToken(userId: number): string {
  const payload = {
    sub: userId.toString(),
    type: 'refresh',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + REFRESH_TOKEN_EXPIRATION,
  };

  return jwt.sign(payload, JWT_SECRET, {
    algorithm: JWT_CONFIG.algorithm,
    issuer: JWT_CONFIG.issuer,
    audience: JWT_CONFIG.audience,
  });
}

/**
 * Verify Access Token
 *
 * Validates the access token signature and expiration.
 * Section 5.1.5 - JWT Verify Endpoint
 *
 * @param token - JWT access token string
 * @returns Verification result with decoded payload or error
 *
 * Possible errors:
 * - "Token expired" - Token has expired (exp claim)
 * - "Invalid signature" - Token signature doesn't match
 * - "Invalid token" - Malformed token or other issues
 */
export function verifyAccessToken(token: string): {
  valid: boolean;
  decoded?: JWTPayload;
  error?: string;
} {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: [JWT_CONFIG.algorithm],
      issuer: JWT_CONFIG.issuer,
      audience: JWT_CONFIG.audience,
    }) as JWTPayload;

    // Additional check: ensure it's an access token
    if (decoded.type !== 'access') {
      return {
        valid: false,
        error: 'Invalid token type',
      };
    }

    return {
      valid: true,
      decoded,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        valid: false,
        error: 'Token expired',
      };
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return {
        valid: false,
        error: 'Invalid signature',
      };
    }

    return {
      valid: false,
      error: 'Invalid token',
    };
  }
}

/**
 * Verify Refresh Token
 *
 * Validates the refresh token signature and expiration.
 * Section 5.1.6 - Refresh Token Endpoint
 *
 * @param token - JWT refresh token string
 * @returns Verification result with decoded payload or error
 *
 * Possible errors:
 * - "Token expired" - Refresh token has expired
 * - "Invalid signature" - Token signature doesn't match
 * - "Invalid token" - Malformed token or other issues
 */
export function verifyRefreshToken(token: string): {
  valid: boolean;
  decoded?: any;
  error?: string;
} {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: [JWT_CONFIG.algorithm],
      issuer: JWT_CONFIG.issuer,
      audience: JWT_CONFIG.audience,
    }) as any;

    // Additional check: ensure it's a refresh token
    if (decoded.type !== 'refresh') {
      return {
        valid: false,
        error: 'Invalid token type',
      };
    }

    return {
      valid: true,
      decoded,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        valid: false,
        error: 'Token expired',
      };
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return {
        valid: false,
        error: 'Invalid signature',
      };
    }

    return {
      valid: false,
      error: 'Invalid token',
    };
  }
}

/**
 * Decode Token (Without Verification)
 *
 * Decodes a JWT token without verifying its signature.
 * Used for displaying token contents or debugging.
 *
 * WARNING: NEVER use this for authentication!
 * Always use verifyAccessToken() or verifyRefreshToken() for authentication.
 *
 * @param token - JWT token string
 * @returns Decoded token payload or null if invalid
 */
export function decodeToken(token: string): any {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
}
