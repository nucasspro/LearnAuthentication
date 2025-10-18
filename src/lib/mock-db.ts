/**
 * In-Memory Mock Database
 * Section 3.4 & 5.2
 *
 * This is the central data store for the authentication learning platform.
 * It's in-memory (not persistent) so it resets on server restart.
 *
 * This is appropriate for learning because:
 * ✅ No external dependencies (simplicity)
 * ✅ Easy to inspect/debug
 * ✅ Fast for demos
 * ✅ Automatically "resets" on restart
 * ✅ Focus on auth logic, not database design
 *
 * In production, this would be replaced with:
 * - PostgreSQL/MySQL for relational data
 * - Redis for session/token storage
 * - Document DB for flexible schemas
 */

import bcryptjs from "bcryptjs";
import { MockDatabase, User, Session, AuditLog } from "./types";
import { BCRYPT_COST } from "./constants";

/**
 * Test Users from SPECIFICATION Appendix A
 * Pre-configured with bcrypt-hashed passwords for quick testing
 *
 * Credentials:
 * 1. admin / admin123
 * 2. user / user123
 * 3. demo / demo123
 */

// Hash passwords synchronously for initialization
// In production: Use async hashing in signup flow
const adminPasswordHash = bcryptjs.hashSync("admin123", BCRYPT_COST);
const userPasswordHash = bcryptjs.hashSync("user123", BCRYPT_COST);
const demoPasswordHash = bcryptjs.hashSync("demo123", BCRYPT_COST);

/**
 * Mock Database Instance
 * Singleton pattern - single source of truth for all auth data
 *
 * Structure:
 * - users[]: Array of all users
 * - sessions{}: Map of sessionId -> Session (for session-based auth)
 * - tokens{}: Map of token -> TokenRecord (for JWT tracking)
 * - refreshTokens{}: Map of refreshToken -> TokenRecord
 * - mfaSecrets{}: Map of userId -> MFASecret (for 2FA)
 * - auditLogs[]: Chronological auth event log
 */
export const mockDB: MockDatabase = {
  /**
   * Users Array
   * Section 5.2.1
   *
   * All user accounts in the system
   * Each user has:
   * - id: Unique identifier
   * - username: Login identifier (unique)
   * - email: Contact email (unique in production)
   * - passwordHash: bcrypt hash (never plain text)
   * - role: "admin" or "user" (for permission checking)
   * - mfaEnabled: Whether 2FA is activated
   * - createdAt: Account creation timestamp
   */
  users: [
    {
      id: 1,
      username: "admin",
      email: "admin@example.com",
      passwordHash: adminPasswordHash,
      role: "admin",
      mfaEnabled: false,
      createdAt: new Date("2025-01-01"),
    },
    {
      id: 2,
      username: "user",
      email: "user@example.com",
      passwordHash: userPasswordHash,
      role: "user",
      mfaEnabled: false,
      createdAt: new Date("2025-01-02"),
    },
    {
      id: 3,
      username: "demo",
      email: "demo@example.com",
      passwordHash: demoPasswordHash,
      role: "user",
      mfaEnabled: false,
      createdAt: new Date("2025-01-03"),
    },
  ],

  /**
   * Sessions Map
   * Section 5.2.2 & Section 4.1
   *
   * Server-side session storage for session-based authentication
   * Key: sessionId (random string, 256 bits)
   * Value: Session data {userId, timestamps}
   *
   * When user logs in:
   * 1. Generate random sessionId
   * 2. Create Session record
   * 3. Store in mockDB.sessions[sessionId]
   * 4. Send sessionId via Set-Cookie (HTTP-Only)
   *
   * When user makes request:
   * 1. Browser sends cookie with sessionId
   * 2. Server looks up sessionId in mockDB.sessions
   * 3. Check if not expired, get userId
   * 4. Identify authenticated user
   *
   * When user logs out:
   * 1. Delete from mockDB.sessions
   * 2. Clear cookie
   *
   * RFC 6265: HTTP State Management Mechanism
   */
  sessions: {},

  /**
   * Tokens Map
   * Section 5.2.3 & Section 4.2
   *
   * Tracks JWT access tokens for potential revocation
   * In production: Use a blacklist or token database
   *
   * For this learning project: Used for demonstration
   * Key: JWT token (decoded, stored)
   * Value: TokenRecord {userId, type, timestamps}
   *
   * Note: JWTs are stateless, but tracking them allows:
   * - Token revocation (e.g., after password change)
   * - Audit logging
   * - Analytics
   */
  tokens: {},

  /**
   * Refresh Tokens Map
   * Section 5.2.3 & Section 4.2.7
   *
   * Separate storage for refresh tokens
   * Longer expiration (7 days vs 15 minutes for access tokens)
   *
   * Flow:
   * 1. Login -> Return both accessToken & refreshToken
   * 2. Store refreshToken in mockDB.refreshTokens
   * 3. AccessToken expires after 15 minutes
   * 4. Client calls /refresh-token with refreshToken
   * 5. Server generates new accessToken
   * 6. Optionally rotate refreshToken
   *
   * Refresh Token Rotation (optional best practice):
   * - Return new refreshToken with new accessToken
   * - Invalidate old refreshToken
   * - Makes token theft detection easier
   */
  refreshTokens: {},

  /**
   * MFA Secrets Map
   * Section 5.2.4 & Section 4.4
   *
   * TOTP (Time-based One-Time Password) configuration
   * Key: userId
   * Value: MFASecret {secret, enabled, backupCodes}
   *
   * Setup flow:
   * 1. User requests MFA setup
   * 2. Server generates random TOTP secret
   * 3. Generate QR code (encodes secret)
   * 4. User scans with Authenticator app
   * 5. App derives TOTP codes from secret
   * 6. User enters one code to verify
   * 7. Server confirms MFA is working
   * 8. Enabled = true
   *
   * Backup codes:
   * - 10 one-time codes
   * - For phone loss scenario
   * - User downloads/prints
   * - Each used code moved to usedCodes[]
   *
   * RFC 6238: TOTP (Time-based One-Time Password)
   */
  mfaSecrets: {},

  /**
   * Audit Logs Array
   * Section 5.2.5 & OWASP: Insufficient Logging
   *
   * Chronological record of all authentication events
   * Used for:
   * - Security investigation
   * - Debugging authentication issues
   * - Compliance/audit trails
   * - Anomaly detection
   *
   * Logged events:
   * - login (success/failure)
   * - logout
   * - token refresh
   * - MFA setup/verify
   * - Protected resource access
   * - Password changes
   *
   * Metadata stored:
   * - username (even for failed attempts)
   * - failure reason
   * - IP address (in real implementation)
   * - User-Agent (browser/app info)
   *
   * Benefits:
   * ✅ Detect brute force attacks
   * ✅ Trace security incidents
   * ✅ Understand user behavior
   * ✅ Comply with regulations
   */
  auditLogs: [],
};

/**
 * Database Operations
 * Helper functions for common database queries
 *
 * In production: Use ORM (Prisma, Sequelize) or query builder
 */

/**
 * Find user by username
 * @param username - Username to search for
 * @returns User or undefined
 */
export function findUserByUsername(username: string): User | undefined {
  return mockDB.users.find((u) => u.username === username);
}

/**
 * Find user by ID
 * @param userId - User ID to search for
 * @returns User or undefined
 */
export function findUserById(userId: number): User | undefined {
  return mockDB.users.find((u) => u.id === userId);
}

/**
 * Find user by email
 * @param email - Email to search for
 * @returns User or undefined
 */
export function findUserByEmail(email: string): User | undefined {
  return mockDB.users.find((u) => u.email === email);
}

/**
 * Get session data
 * @param sessionId - Session ID from cookie
 * @returns Session or undefined
 */
export function getSession(sessionId: string): Session | undefined {
  return mockDB.sessions[sessionId];
}

/**
 * Store a session
 * @param sessionId - Generated session ID
 * @param session - Session object to store
 */
export function createSession(sessionId: string, session: Session): void {
  mockDB.sessions[sessionId] = session;
}

/**
 * Delete a session (logout)
 * @param sessionId - Session ID to invalidate
 */
export function deleteSession(sessionId: string): void {
  delete mockDB.sessions[sessionId];
}

/**
 * Check if session has expired
 * @param session - Session object to check
 * @returns true if expired, false if still valid
 */
export function isSessionExpired(session: Session): boolean {
  return new Date() > session.expiresAt;
}

/**
 * Add audit log entry
 * @param log - Audit log to record
 */
export function createAuditLog(log: AuditLog): void {
  // Auto-generate ID
  log.id = mockDB.auditLogs.length + 1;
  mockDB.auditLogs.push(log);
}

/**
 * Get audit logs for a specific user
 * @param userId - User ID to filter by
 * @returns Array of audit logs
 */
export function getAuditLogsForUser(userId: number): AuditLog[] {
  return mockDB.auditLogs.filter((log) => log.userId === userId);
}

/**
 * Get recent audit logs
 * @param limit - Number of recent entries to return
 * @returns Array of audit logs (most recent first)
 */
export function getRecentAuditLogs(limit: number = 20): AuditLog[] {
  return mockDB.auditLogs.slice(-limit).reverse();
}

/**
 * Mock Database State Summary
 *
 * Initial state:
 * - 3 test users (admin, user, demo)
 * - 0 active sessions
 * - 0 JWT tokens
 * - 0 MFA secrets
 * - 0 audit logs
 *
 * This grows as users interact with the system.
 * Resets on server restart (no persistence).
 *
 * To add persistence in the future:
 * 1. Replace this with PostgreSQL
 * 2. Create database schema
 * 3. Use migrations (Prisma, Knex)
 * 4. Add connection pooling
 * 5. Implement data backups
 */

/**
 * Database Export Summary
 *
 * Exported:
 * ✅ mockDB: The main database object
 * ✅ Query functions: findUserByUsername, etc.
 * ✅ Mutation functions: createSession, deleteSession, etc.
 * ✅ Helper functions: isSessionExpired, etc.
 *
 * This is used by:
 * - API routes (/api/auth/*)
 * - Utility functions (lib/auth.ts, lib/jwt.ts)
 * - Components (for frontend testing)
 *
 * See SPECIFICATION Section 3.4 for architecture overview
 * See Section 5.2 for database structure details
 */
