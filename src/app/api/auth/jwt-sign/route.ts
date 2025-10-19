import { NextResponse } from 'next/server';
import { mockDB } from '@/lib/mock-db';
import { comparePassword } from '@/lib/crypto';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { JWT_EXPIRATION } from '@/lib/constants';

/**
 * POST /api/auth/jwt-sign
 *
 * JWT-based authentication sign-in endpoint.
 * Issues access and refresh tokens upon successful authentication.
 *
 * Flow:
 * 1. Validate credentials (username/email + password)
 * 2. Generate access token (15 min expiry)
 * 3. Generate refresh token (7 day expiry)
 * 4. Store tokens in mockDB for tracking/revocation
 * 5. Return tokens to client
 *
 * Security measures:
 * - Password comparison using bcryptjs
 * - Generic error messages (prevent user enumeration)
 * - Token storage for revocation capability
 * - Short access token expiry (limits damage if compromised)
 * - Separate refresh token for session persistence
 *
 * Client storage recommendations:
 * - DEVELOPMENT: localStorage (for learning/testing)
 * - PRODUCTION: HTTP-Only cookies (prevents XSS attacks)
 *
 * Reference: SPECIFICATION Section 4.2, Section 5.1.4, Section 8.2
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validate input - required fields
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input format' },
        { status: 400 }
      );
    }

    // Find user in mockDB - search by username or email
    const user = Object.values(mockDB.users).find(
      (u) => u.username === username || u.email === username
    );

    // Generic error message - don't reveal if user exists
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Compare password using bcryptjs
    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT access token (15 minutes)
    const accessToken = generateAccessToken(
      user.id,
      user.email,
      user.username,
      user.role
    );

    // Generate JWT refresh token (7 days)
    const refreshToken = generateRefreshToken(user.id);

    // Store access token in mockDB for tracking/revocation
    const now = new Date();
    const accessTokenExpiresAt = new Date(Date.now() + JWT_EXPIRATION * 1000);

    mockDB.tokens[accessToken] = {
      userId: user.id,
      type: 'access',
      issuedAt: now,
      expiresAt: accessTokenExpiresAt,
      revokedAt: null,
    };

    // Store refresh token in mockDB for tracking/revocation
    const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    mockDB.refreshTokens[refreshToken] = {
      userId: user.id,
      type: 'refresh',
      issuedAt: now,
      expiresAt: refreshTokenExpiresAt,
      revokedAt: null,
    };

    // Return success with tokens and user info
    return NextResponse.json({
      success: true,
      accessToken,
      refreshToken,
      expiresIn: JWT_EXPIRATION, // seconds
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('JWT sign error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
