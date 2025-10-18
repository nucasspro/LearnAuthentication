import type { NextApiRequest, NextApiResponse } from 'next';
import { mockDB } from '@/lib/mock-db';
import { comparePassword, generateSessionId } from '@/lib/crypto';
import { SESSION_EXPIRATION } from '@/lib/constants';
import type { User } from '@/lib/types';

/**
 * POST /api/auth/login
 *
 * Session-based authentication login endpoint.
 *
 * Security measures:
 * - Password comparison using bcryptjs
 * - HTTP-Only cookie to prevent XSS attacks
 * - Secure flag (requires HTTPS in production)
 * - SameSite=Strict to prevent CSRF
 * - Generic error messages to prevent user enumeration
 *
 * Reference: SPECIFICATION Section 5.1.1, Section 6 (Security)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    // Validate input - required fields
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Invalid input format' });
    }

    // Find user in mockDB - search by username or email
    const user = Object.values(mockDB.users).find(
      (u) => u.username === username || u.email === username
    );

    // Generic error message - don't reveal if user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password using bcryptjs
    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user has MFA enabled
    // If MFA is enabled, require 2FA verification before creating session
    if (user.mfaEnabled) {
      const mfaSecret = mockDB.mfaSecrets[user.id];

      // Verify MFA is properly configured
      if (mfaSecret && mfaSecret.enabled) {
        // Return success but indicate MFA is required
        // Frontend should redirect to MFA verification page
        return res.status(200).json({
          success: true,
          mfaRequired: true,
          userId: user.id,
          message: 'Please enter your 2FA code to complete login',
        });
      }
    }

    // Generate secure session ID
    const sessionId = generateSessionId();
    const now = new Date();
    const expiresAt = new Date(Date.now() + SESSION_EXPIRATION);

    // Store session in mockDB
    mockDB.sessions[sessionId] = {
      userId: user.id,
      createdAt: now,
      expiresAt: expiresAt,
      lastActivity: now,
    };

    // Set HTTP-Only secure cookie
    // Note: In production, ensure HTTPS is enabled for Secure flag to work
    const cookieValue = `SessionID=${sessionId}; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_EXPIRATION / 1000}; Path=/`;
    res.setHeader('Set-Cookie', cookieValue);

    // Return success with user info (excluding passwordHash)
    const userResponse: Omit<User, 'passwordHash'> = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      mfaEnabled: user.mfaEnabled,
      createdAt: user.createdAt,
    };

    return res.status(200).json({
      success: true,
      user: userResponse,
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
