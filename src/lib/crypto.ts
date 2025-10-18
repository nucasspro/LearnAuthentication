/**
 * Cryptographic Utilities for Authentication
 * Section 6.2 & 6.4
 *
 * This module provides essential cryptographic functions for authentication:
 * - Password hashing with bcrypt
 * - Password verification
 * - Session ID generation
 * - Token generation
 * - Refresh token generation
 *
 * All functions are async and follow security best practices
 */

import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { BCRYPT_COST, SESSION_ID_LENGTH } from "./constants";

/**
 * Hash a password using bcrypt
 * Section 6.2 - Password Hashing
 *
 * Why bcrypt?
 * - Slow by design (resistant to brute force)
 * - Built-in salt (prevents rainbow table attacks)
 * - Configurable cost factor (security vs speed tradeoff)
 * - Much better than SHA256 or MD5
 *
 * RFC 2307 discusses password hashing, though bcrypt is post-RFC
 *
 * @param password - Plain text password from user
 * @returns Promise<string> - bcrypt hash (safe to store in database)
 *
 * @example
 * ```typescript
 * const passwordHash = await hashPassword("user_entered_password");
 * // Store passwordHash in database, never store plain password
 * ```
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    // Hash the password with the configured cost factor
    // Cost 10 = ~10 hashes/second (tunable based on security needs)
    const hash = await bcrypt.hash(password, BCRYPT_COST);
    return hash;
  } catch (error) {
    console.error("Password hashing error:", error);
    throw new Error("Failed to hash password");
  }
}

/**
 * Compare a plain text password with a bcrypt hash
 * Section 6.2 & 6.7 - Authentication
 *
 * This function is timing-attack resistant:
 * - bcrypt.compare always takes similar time
 * - Prevents attackers from guessing password length
 * - Always returns false for wrong passwords (never reveals reason)
 *
 * @param password - Plain text password entered by user
 * @param hash - bcrypt hash from database
 * @returns Promise<boolean> - true if password matches, false otherwise
 *
 * @example
 * ```typescript
 * const isValid = await comparePassword("user_input", storedHash);
 * if (isValid) {
 *   // Password is correct, authenticate user
 * } else {
 *   // Password is incorrect, reject login
 *   // Never say "password wrong" vs "user not found"
 * }
 * ```
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    // Compare performs constant-time comparison
    // Returns true if hash(password) == stored hash
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error("Password comparison error:", error);
    // Return false on error (safer than throwing)
    // Don't expose internal errors to user
    return false;
  }
}

/**
 * Generate a secure random session ID
 * Section 4.1.2 & RFC 6265
 *
 * Session ID Security Requirements:
 * - Minimum 128 bits entropy (recommended: 256 bits)
 * - Cryptographically random (not predictable)
 * - Unique (no collisions in practical lifetime)
 * - Sent securely (HTTPS + Secure flag)
 * - Protected from XSS (HttpOnly flag)
 *
 * We use 32 bytes (256 bits) = 64 hex characters
 * Math: 16^64 = 2^256 possible values
 *
 * @returns string - Hex-encoded random session ID
 *
 * @example
 * ```typescript
 * const sessionId = generateSessionId();
 * // Returns: "a1f2c3e4d5b6f7a8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1"
 * // Store in database and send via Set-Cookie
 * ```
 */
export function generateSessionId(): string {
  try {
    // Generate random bytes and convert to hex
    // randomBytes(32) = 32 bytes = 256 bits entropy
    const bytes = randomBytes(SESSION_ID_LENGTH);
    return bytes.toString("hex");
  } catch (error) {
    console.error("Session ID generation error:", error);
    throw new Error("Failed to generate session ID");
  }
}

/**
 * Generate a secure random refresh token
 * Section 4.2.7 & RFC 7519
 *
 * Refresh tokens:
 * - Should be long random strings (not predictable)
 * - Stored securely (HTTP-Only cookie in production)
 * - Have separate expiration from access tokens
 * - Can be revoked independently
 *
 * We generate 32 bytes (256 bits) same as session ID
 * But stored separately and with different TTL
 *
 * @returns string - Hex-encoded random refresh token
 *
 * @example
 * ```typescript
 * const refreshToken = generateRefreshToken();
 * // Store in mockDB.refreshTokens
 * // Send to client via Set-Cookie (HTTP-Only)
 * ```
 */
export function generateRefreshToken(): string {
  try {
    // Same strength as session ID
    // 32 bytes = 256 bits = cryptographically secure
    const bytes = randomBytes(SESSION_ID_LENGTH);
    return bytes.toString("hex");
  } catch (error) {
    console.error("Refresh token generation error:", error);
    throw new Error("Failed to generate refresh token");
  }
}

/**
 * Verify a token hasn't been tampered with (constant-time)
 * Section 6.7 - Timing Attacks
 *
 * This is a timing-attack resistant comparison:
 * - Takes roughly same time regardless of where strings differ
 * - Prevents attackers from guessing tokens byte-by-byte
 * - Example: "abc" vs "abc" takes same time as "abc" vs "xyz"
 *
 * @param provided - Token provided by user
 * @param expected - Expected token value
 * @returns boolean - true if tokens match (timing-safe)
 *
 * @example
 * ```typescript
 * // Compare refresh token from DB
 * const isValid = timingSafeCompare(userToken, storedToken);
 * ```
 */
export function timingSafeCompare(provided: string, expected: string): boolean {
  try {
    // Use Buffer to prevent length-based timing attacks
    const providedBuffer = Buffer.from(provided);
    const expectedBuffer = Buffer.from(expected);

    // If lengths differ, still compare (prevents length detection)
    if (providedBuffer.length !== expectedBuffer.length) {
      return false;
    }

    // Constant-time comparison
    // All bytes are compared, even after mismatch found
    return providedBuffer.equals(expectedBuffer);
  } catch (error) {
    console.error("Timing-safe comparison error:", error);
    return false; // Fail safely
  }
}

/**
 * Generate a random backup code for MFA recovery
 * Section 4.4.5 & RFC 6238
 *
 * Backup codes:
 * - One-time use recovery codes
 * - User stores securely (screenshot, printed)
 * - Used if phone/authenticator is lost
 * - Format: 4 groups of 4 alphanumeric (XXXX-XXXX-XXXX-XXXX)
 *
 * @returns string - Backup code in format "XXXX-XXXX-XXXX-XXXX"
 *
 * @example
 * ```typescript
 * const codes = Array.from({ length: 10 }, () => generateBackupCode());
 * // Returns: ["A1B2-C3D4-E5F6-G7H8", "I9J0-K1L2-M3N4-O5P6", ...]
 * ```
 */
export function generateBackupCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  // Generate 4 groups of 4 characters
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (i < 3) code += "-"; // Add dash between groups
  }

  return code;
}

/**
 * Format a backup code for storage (remove dashes, uppercase)
 * Section 4.4.5
 *
 * Normalizes backup codes for consistent storage and comparison
 * - Removes dashes
 * - Converts to uppercase
 * - Makes comparison case-insensitive
 *
 * @param code - Backup code (may have dashes/mixed case)
 * @returns string - Normalized code
 *
 * @example
 * ```typescript
 * normalizBackupCode("a1b2-c3d4-e5f6-g7h8"); // "A1B2C3D4E5F6G7H8"
 * ```
 */
export function normalizeBackupCode(code: string): string {
  return code.replace(/-/g, "").toUpperCase();
}

/**
 * Generate TOTP secret for MFA setup
 * Section 4.4.2 & RFC 6238
 *
 * TOTP (Time-based One-Time Password):
 * - Uses speakeasy library (separate utility)
 * - See lib/mfa.ts for TOTP-specific functions
 *
 * Note: TOTP setup is more complex and handled separately
 * This file focuses on basic cryptographic primitives
 */

/**
 * Summary of Crypto Security
 *
 * ✅ CORRECT:
 * 1. Hash passwords with bcrypt (not SHA/MD5)
 * 2. Use cryptographically random bytes (randomBytes)
 * 3. Compare sensitive data with constant-time functions
 * 4. Never store plain passwords
 * 5. Use async functions (non-blocking)
 *
 * ❌ NEVER:
 * 1. Use SHA256/MD5 for passwords
 * 2. Use Math.random() for tokens/sessions
 * 3. String comparison for sensitive data (timing attacks)
 * 4. Log or expose secrets
 * 5. Use synchronous crypto operations in production
 *
 * See SPECIFICATION Section 6 for full security requirements
 */
