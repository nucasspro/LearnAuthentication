/**
 * Authentication Constants & Configuration
 * Based on SPECIFICATION Section 5 & Security Requirements
 *
 * These constants define the security parameters and defaults used throughout
 * the authentication system. These values can be adjusted but follow best practices.
 */

/**
 * Token Expiration Times
 * Section 5.2 & Section 6
 *
 * Access Token: Short-lived (15 minutes)
 *   - If compromised, limited damage
 *   - Forces refresh token usage for longer sessions
 *
 * Refresh Token: Long-lived (7 days)
 *   - Stored securely (HTTP-Only cookie in production)
 *   - Only sent to /refresh-token endpoint
 *   - Can be rotated/revoked
 */
export const JWT_EXPIRATION = 15 * 60; // 15 minutes in seconds
export const REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Session Management
 *
 * SESSION_EXPIRATION: 24 hours
 *   - Session becomes invalid after this time
 *   - Server removes session from mockDB.sessions
 *
 * Follows RFC 6265: HTTP State Management Mechanism
 */
export const SESSION_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * MFA (Multi-Factor Authentication) Settings
 * Section 4.4 & RFC 6238 (TOTP)
 *
 * MFA_WINDOW: 2 time steps (60 seconds)
 *   - Allows ±2 time steps to account for time drift
 *   - TOTP codes change every 30 seconds, so ±60s = 4 possible codes
 *   - Prevents issues with user/server clock differences
 *
 * MFA_ISSUER: Used in QR code for authenticator apps
 */
export const MFA_WINDOW = 2; // ±2 time steps
export const MFA_ISSUER = "Learn Authentication";
export const MFA_BACKUP_CODES_COUNT = 10;

/**
 * Password Requirements
 * Section 6.6 - Input Validation & OWASP Best Practices
 *
 * PASSWORD_MIN_LENGTH: 8 characters
 *   - Common recommendation (OWASP, NIST)
 *   - Protects against brute force while remaining user-friendly
 *
 * Note: For learning, we keep it simple
 * Production should consider:
 *   - Complexity requirements (uppercase, lowercase, numbers, symbols)
 *   - Password breach database checking
 *   - Dictionary attack prevention
 */
export const PASSWORD_MIN_LENGTH = 8;

/**
 * Username & Email Validation Patterns
 * Section 6.6
 */
export const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
// Matches: 3-20 alphanumeric + underscore

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Simple email validation (for learning)
// Production: Use email-validator library

/**
 * Bcrypt Configuration
 * Section 6.2 - Password Hashing
 *
 * BCRYPT_COST: 10 iterations
 *   - 10 = reasonable balance between security and speed
 *   - Each increment (~1x slower): 10->11 ≈ 2x slower
 *   - For 2024+: Consider 12+ for production
 *   - For learning: 10 is fine
 */
export const BCRYPT_COST = 10;

/**
 * Session ID Configuration
 * Section 4.1.2 - Session ID Generation
 *
 * SESSION_ID_LENGTH: 32 bytes (256 bits)
 *   - RFC recommends minimum 128 bits entropy
 *   - 32 bytes = 256 bits = very secure
 *   - Hex encoded = 64 character string
 */
export const SESSION_ID_LENGTH = 32; // bytes

/**
 * Rate Limiting (Future Enhancement)
 * Section 6.8 - OWASP Top 10
 *
 * These are noted for future implementation
 * Current learning version: No rate limiting
 */
// export const LOGIN_ATTEMPT_LIMIT = 5; // attempts
// export const LOGIN_ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes
// export const PASSWORD_RESET_LIMIT = 3; // attempts per hour

/**
 * Error Messages
 * Section 6.7 - Error Handling
 *
 * Generic messages that don't leak information to attackers
 * Always use these instead of revealing which field failed
 */
export const ERROR_MESSAGES = {
  // Authentication errors
  INVALID_CREDENTIALS: "Invalid username or password",
  INVALID_TOKEN: "Invalid or expired token",
  TOKEN_EXPIRED: "Token expired. Please refresh.",
  REFRESH_TOKEN_EXPIRED: "Refresh token expired. Please login again.",
  NO_AUTH: "Authentication required",
  INSUFFICIENT_PERMISSIONS: "Insufficient permissions",

  // Validation errors
  INVALID_EMAIL: "Invalid email format",
  INVALID_USERNAME: "Username must be 3-20 characters (alphanumeric + underscore)",
  PASSWORD_TOO_SHORT: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  INVALID_PASSWORD: "Password is invalid",

  // Session errors
  NO_SESSION: "No active session found",
  SESSION_EXPIRED: "Session expired. Please login again.",

  // MFA errors
  MFA_NOT_ENABLED: "MFA is not enabled for this user",
  INVALID_MFA_CODE: "Invalid 2FA code",
  INVALID_BACKUP_CODE: "Invalid backup code",

  // User errors
  USER_NOT_FOUND: "User not found",
  USER_ALREADY_EXISTS: "User already exists",

  // Server errors
  INTERNAL_ERROR: "An internal error occurred. Please try again.",
} as const;

/**
 * Cookie Configuration
 * Section 6.4 - Cookie Security Attributes
 * RFC 6265: HTTP State Management Mechanism
 *
 * These are the recommended security attributes for session cookies
 *
 * HttpOnly: true
 *   - Cannot be accessed via JavaScript (XSS protection)
 *   - Only sent with HTTP requests
 *   - Prevents XSS attack from stealing cookies
 *
 * Secure: true
 *   - Only sent over HTTPS
 *   - Prevents MITM attacks
 *   - Exception: localhost (development)
 *
 * SameSite: "Strict"
 *   - Never sent in cross-site requests
 *   - Prevents CSRF (Cross-Site Request Forgery)
 *   - Options: Strict, Lax, None
 *
 * Path: "/"
 *   - Cookie sent with all requests to this app
 */
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // true in prod, false in dev
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_EXPIRATION / 1000, // in seconds
} as const;

/**
 * JWT Configuration
 * Section 4.2 & RFC 7519: JSON Web Token (JWT)
 *
 * Algorithm: HS256 (HMAC SHA-256)
 *   - Symmetric key algorithm
 *   - Shared secret used for both signing and verification
 *   - Good for monolithic applications
 *
 * For microservices/distributed systems, use RS256 (RSA)
 *
 * Secret: Must be at least 32 characters (256 bits)
 *   - Defined in .env.local
 *   - Never commit to version control
 */
export const JWT_CONFIG = {
  algorithm: "HS256" as const,
  issuer: "auth-learning-platform",
  audience: "auth-learning-platform",
} as const;

/**
 * Audit Log Configuration
 * Section 5.2.5 & OWASP: Insufficient Logging
 *
 * Every authentication event should be logged
 * This helps detect suspicious activity and debug issues
 */
export const AUDIT_ACTIONS = {
  LOGIN_SUCCESS: "login_success",
  LOGIN_FAILURE: "login_failure",
  LOGOUT: "logout",
  JWT_SIGN: "jwt_sign",
  JWT_VERIFY: "jwt_verify",
  TOKEN_REFRESH: "token_refresh",
  SESSION_CHECK: "session_check",
  MFA_SETUP: "mfa_setup",
  MFA_VERIFY: "mfa_verify",
  MFA_VERIFY_FAILED: "mfa_verify_failed",
  PASSWORD_HASH: "password_hash",
  PROTECTED_RESOURCE_ACCESS: "protected_resource_access",
} as const;

/**
 * HTTP Status Codes
 * Standard HTTP status codes used in responses
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
} as const;

/**
 * Development/Testing Configuration
 *
 * For learning purposes, some settings are relaxed
 * In production, all of these should be tightened
 */
export const DEV_CONFIG = {
  // Allow localStorage for JWT (in production: HTTP-Only cookie)
  ALLOW_LOCAL_STORAGE_JWT: true,

  // Show detailed error messages (production: generic)
  DETAILED_ERRORS: process.env.NODE_ENV !== "production",

  // Mock sleep for simulating network delay (learning)
  SIMULATE_NETWORK_DELAY: 0, // ms

  // Enable audit logging (always true, but can be toggled)
  ENABLE_AUDIT_LOG: true,

  // Show all auth events in console (development only)
  LOG_AUTH_EVENTS: process.env.NODE_ENV !== "production",
} as const;

/**
 * Security Headers
 * Section 6.1 & OWASP Top 10
 *
 * These are recommendations for API responses
 * Should be implemented in production
 */
export const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy": "default-src 'self'",
} as const;
