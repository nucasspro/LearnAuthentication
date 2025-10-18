/**
 * TypeScript Types for Authentication Learning Platform
 * Based on SPECIFICATION Section 5.2
 *
 * These types define the data structures used throughout the authentication system:
 * - User data
 * - Session management
 * - JWT tokens
 * - MFA secrets
 * - Audit logging
 */

/**
 * User Interface
 * Represents a user in the system with authentication credentials
 * Section 5.2.1
 */
export interface User {
  id: number;
  username: string;
  email: string;
  passwordHash: string; // bcrypt hash (never store plain text)
  role: "admin" | "user";
  mfaEnabled: boolean;
  createdAt: Date;
}

/**
 * Session Interface
 * Server-side session storage for session-based authentication
 * Section 5.2.2
 */
export interface Session {
  userId: number;
  createdAt: Date;
  expiresAt: Date;
  lastActivity: Date;
}

/**
 * Token Record Interface
 * Tracks JWT tokens in the system for potential revocation/tracking
 * Section 5.2.3
 */
export interface TokenRecord {
  userId: number;
  type: "access" | "refresh";
  issuedAt: Date;
  expiresAt: Date;
  revokedAt: Date | null;
}

/**
 * JWT Payload Interface
 * Decoded JWT token structure with standard claims (RFC 7519)
 */
export interface JWTPayload {
  sub: string; // Subject (user ID)
  email: string;
  username: string;
  role: "admin" | "user";
  iat: number; // Issued at (Unix timestamp)
  exp: number; // Expiration time (Unix timestamp)
  type: "access" | "refresh";
}

/**
 * MFA Secret Interface
 * TOTP-based multi-factor authentication secret storage
 * Section 5.2.4
 */
export interface MFASecret {
  userId: number;
  secret: string; // base32 encoded TOTP secret
  enabled: boolean;
  backupCodes: string[]; // Unused backup codes
  usedCodes: string[]; // Used backup codes (for replay prevention)
  createdAt: Date;
}

/**
 * Audit Log Interface
 * Security audit trail for all authentication events
 * Section 5.2.5
 */
export interface AuditLog {
  id: number;
  userId: number | null; // null for failed login attempts
  action: string; // "login", "logout", "jwt_sign", "mfa_verify", etc.
  status: "success" | "failure";
  timestamp: Date;
  metadata?: {
    username?: string;
    reason?: string;
    ip?: string;
    userAgent?: string;
  };
}

/**
 * Mock Database Structure
 * In-memory storage for all authentication data
 */
export interface MockDatabase {
  users: User[];
  sessions: Record<string, Session>; // sessionId -> Session
  tokens: Record<string, TokenRecord>; // token -> TokenRecord
  refreshTokens: Record<string, TokenRecord>; // refreshToken -> TokenRecord
  mfaSecrets: Record<number, MFASecret>; // userId -> MFASecret
  auditLogs: AuditLog[];
}

/**
 * API Response Types
 * Standardized responses for authentication endpoints
 */

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
  error?: string;
}

export interface JWTSignRequest {
  username: string;
  password: string;
}

export interface JWTSignResponse {
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  user?: {
    id: number;
    username: string;
  };
  error?: string;
}

export interface JWTVerifyRequest {
  token: string;
}

export interface JWTVerifyResponse {
  valid: boolean;
  decoded?: JWTPayload;
  error?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  accessToken?: string;
  expiresIn?: number;
  error?: string;
}

export interface VerifyAuthRequest {
  // No body needed - uses cookie or Authorization header
}

export interface VerifyAuthResponse {
  authenticated: boolean;
  user?: {
    id: number;
    username: string;
    email: string;
  };
  method?: "session" | "jwt";
  error?: string;
}

export interface MFASetupRequest {
  userId: number;
}

export interface MFASetupResponse {
  secret: string;
  qrCode: string;
  manualEntry: string;
  backupCodes: string[];
}

export interface MFAVerifyRequest {
  userId: number;
  code: string;
  useBackupCode?: boolean;
}

export interface MFAVerifyResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ProtectedResourceResponse {
  message: string;
  data?: {
    secretInfo: string;
  };
  error?: string;
}

export interface SessionCheckResponse {
  sessionId?: string;
  userId?: number;
  createdAt?: Date;
  expiresAt?: Date;
  lastActivity?: Date;
  expired?: boolean;
  error?: string;
}

/**
 * Error Types
 */
export interface AuthError {
  code: string;
  message: string;
  status: number;
}
