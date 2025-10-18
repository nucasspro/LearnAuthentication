/**
 * Authentication Middleware
 * Based on SPECIFICATION Section 7.1 - Protected Routes
 *
 * This module provides middleware functions for protecting API routes
 * and verifying authentication using both session and JWT methods.
 *
 * Used to:
 * - Verify session-based authentication
 * - Verify JWT-based authentication
 * - Protect API endpoints requiring authentication
 * - Extract authenticated user info from requests
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { mockDB } from './mock-db';
import { verifyAccessToken } from './jwt';

/**
 * Verify Session Authentication
 *
 * Checks if request has valid session cookie and verifies it exists in database.
 * Sessions are stored server-side in mockDB.sessions with timestamps.
 *
 * @param req - Next.js API request
 * @returns Object with validation result and user info
 *
 * Checks:
 * - SessionID cookie exists
 * - Session exists in mockDB.sessions
 * - Session hasn't expired
 * - User still exists in database
 *
 * Reference: SPECIFICATION Section 4.1 - Session Authentication
 * RFC 6265: HTTP State Management Mechanism
 */
export function verifySession(req: NextApiRequest): {
  valid: boolean;
  userId?: number;
  error?: string;
} {
  try {
    // Get sessionId from cookie
    const sessionId = req.cookies.SessionID;

    if (!sessionId) {
      return {
        valid: false,
        error: 'No session cookie found',
      };
    }

    // Look up session in database
    const session = mockDB.sessions[sessionId];

    if (!session) {
      return {
        valid: false,
        error: 'Session not found in database',
      };
    }

    // Check if session has expired
    const now = new Date();
    if (session.expiresAt < now) {
      // Clean up expired session
      delete mockDB.sessions[sessionId];

      return {
        valid: false,
        error: 'Session has expired',
      };
    }

    // Verify user still exists
    const user = mockDB.users[session.userId];

    if (!user) {
      // User was deleted but session still exists
      delete mockDB.sessions[sessionId];

      return {
        valid: false,
        error: 'User not found',
      };
    }

    // Update last activity
    session.lastActivity = now;

    return {
      valid: true,
      userId: session.userId,
    };
  } catch (error) {
    console.error('Session verification error:', error);
    return {
      valid: false,
      error: 'Session verification failed',
    };
  }
}

/**
 * Verify JWT Authentication
 *
 * Checks if request has valid JWT token in Authorization header.
 * JWTs are stateless but we verify the signature and expiration.
 *
 * @param req - Next.js API request
 * @returns Object with validation result and decoded token
 *
 * Expected header format:
 * Authorization: Bearer <JWT_TOKEN>
 *
 * Checks:
 * - Authorization header exists
 * - Header format is "Bearer <token>"
 * - Token signature is valid
 * - Token hasn't expired
 * - Token claims are valid (iss, aud)
 *
 * Reference: SPECIFICATION Section 4.2 - JWT Authentication
 * RFC 7519: JSON Web Token (JWT)
 */
export function verifyJWT(req: NextApiRequest): {
  valid: boolean;
  userId?: number;
  decoded?: any;
  error?: string;
} {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return {
        valid: false,
        error: 'No Authorization header found',
      };
    }

    // Parse "Bearer <token>" format
    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return {
        valid: false,
        error: 'Invalid Authorization header format',
      };
    }

    const token = parts[1];

    // Verify JWT signature and claims
    const result = verifyAccessToken(token);

    if (!result.valid) {
      return {
        valid: false,
        error: result.error || 'Token verification failed',
      };
    }

    // Extract userId from token subject claim
    const userId = parseInt(result.decoded!.sub);

    // Verify user still exists
    const user = mockDB.users[userId];

    if (!user) {
      return {
        valid: false,
        error: 'User not found',
      };
    }

    return {
      valid: true,
      userId: userId,
      decoded: result.decoded,
    };
  } catch (error) {
    console.error('JWT verification error:', error);
    return {
      valid: false,
      error: 'JWT verification failed',
    };
  }
}

/**
 * Require Authentication Middleware
 *
 * Verifies authentication using either session or JWT.
 * Tries session first, then JWT.
 *
 * If authenticated: Returns user info and auth method
 * If not authenticated: Returns 401 Unauthorized response
 *
 * Usage in API routes:
 * ```
 * export default function handler(req, res) {
 *   const auth = requireAuth(req, res);
 *   if (!auth.valid) return;  // Response already sent
 *
 *   // Now we know user is authenticated
 *   const userId = auth.userId;
 * }
 * ```
 *
 * @param req - Next.js API request
 * @param res - Next.js API response
 * @returns Auth result with userId and method, or null if 401 sent
 *
 * Reference: SPECIFICATION Section 7.1 - Protected Routes
 */
export function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse
): { valid: boolean; userId: number; method: 'session' | 'jwt' } | null {
  // Try session authentication first
  const sessionResult = verifySession(req);

  if (sessionResult.valid && sessionResult.userId) {
    return {
      valid: true,
      userId: sessionResult.userId,
      method: 'session',
    };
  }

  // Try JWT authentication
  const jwtResult = verifyJWT(req);

  if (jwtResult.valid && jwtResult.userId) {
    return {
      valid: true,
      userId: jwtResult.userId,
      method: 'jwt',
    };
  }

  // Neither authentication method worked
  res.status(401).json({
    error: 'Authentication required',
    message: 'Please provide either a valid session or JWT token',
  });

  return null;
}

/**
 * Get Authenticated User
 *
 * Convenience function to get full user object from authenticated request.
 *
 * @param req - Next.js API request
 * @returns User object or null if not authenticated
 */
export function getAuthenticatedUser(req: NextApiRequest) {
  // Try session first
  const sessionResult = verifySession(req);
  if (sessionResult.valid && sessionResult.userId) {
    return mockDB.users[sessionResult.userId];
  }

  // Try JWT
  const jwtResult = verifyJWT(req);
  if (jwtResult.valid && jwtResult.userId) {
    return mockDB.users[jwtResult.userId];
  }

  return null;
}
