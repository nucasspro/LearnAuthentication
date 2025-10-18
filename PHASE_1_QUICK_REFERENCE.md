# Phase 1 Quick Reference Guide

## File Locations
```
src/lib/
├── types.ts        (235 lines) - TypeScript interfaces
├── constants.ts    (278 lines) - Configuration & constants
├── crypto.ts       (284 lines) - Cryptographic utilities
└── mock-db.ts      (362 lines) - In-memory database
```

**Total: 1,159 lines of code (well-documented)**

---

## Quick Import Guide

### Types
```typescript
import {
  User,
  Session,
  TokenRecord,
  JWTPayload,
  MFASecret,
  AuditLog,
  LoginRequest,
  LoginResponse,
  JWTSignRequest,
  JWTSignResponse,
  // ... other types
} from '@/lib/types';
```

### Constants
```typescript
import {
  JWT_EXPIRATION,                // 900 (15 min in seconds)
  REFRESH_TOKEN_EXPIRATION,      // 604800 (7 days)
  SESSION_EXPIRATION,            // 86400000 (24 hours in ms)
  BCRYPT_COST,                   // 10
  MFA_WINDOW,                    // 2
  ERROR_MESSAGES,
  COOKIE_OPTIONS,
  JWT_CONFIG,
  USERNAME_REGEX,
  EMAIL_REGEX,
  PASSWORD_MIN_LENGTH,
} from '@/lib/constants';
```

### Crypto Functions
```typescript
import {
  hashPassword,                   // async (password) => hash
  comparePassword,                // async (password, hash) => bool
  generateSessionId,              // () => string (256 bits)
  generateRefreshToken,           // () => string (256 bits)
  timingSafeCompare,              // (provided, expected) => bool
  generateBackupCode,             // () => "XXXX-XXXX-XXXX-XXXX"
  normalizeBackupCode,            // (code) => normalized
} from '@/lib/crypto';
```

### Database
```typescript
import {
  mockDB,                         // The main database object
  findUserByUsername,             // (username) => User | undefined
  findUserById,                   // (userId) => User | undefined
  findUserByEmail,                // (email) => User | undefined
  getSession,                     // (sessionId) => Session | undefined
  createSession,                  // (sessionId, session) => void
  deleteSession,                  // (sessionId) => void
  isSessionExpired,               // (session) => bool
  createAuditLog,                 // (log) => void
  getAuditLogsForUser,            // (userId) => AuditLog[]
  getRecentAuditLogs,             // (limit?) => AuditLog[]
} from '@/lib/mock-db';
```

---

## Common Patterns

### 1. User Login (Session-Based)
```typescript
import { findUserByUsername, comparePassword, createSession, createAuditLog } from '@/lib/mock-db';
import { generateSessionId } from '@/lib/crypto';
import { SESSION_EXPIRATION, AUDIT_ACTIONS } from '@/lib/constants';

async function handleLogin(username: string, password: string) {
  const user = findUserByUsername(username);
  if (!user) {
    createAuditLog({
      id: 0,
      userId: null,
      action: AUDIT_ACTIONS.LOGIN_FAILURE,
      status: 'failure',
      timestamp: new Date(),
      metadata: { username }
    });
    return { error: 'Invalid credentials' };
  }

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    createAuditLog({
      id: 0,
      userId: null,
      action: AUDIT_ACTIONS.LOGIN_FAILURE,
      status: 'failure',
      timestamp: new Date(),
      metadata: { username }
    });
    return { error: 'Invalid credentials' };
  }

  const sessionId = generateSessionId();
  createSession(sessionId, {
    userId: user.id,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + SESSION_EXPIRATION),
    lastActivity: new Date()
  });

  createAuditLog({
    id: 0,
    userId: user.id,
    action: AUDIT_ACTIONS.LOGIN_SUCCESS,
    status: 'success',
    timestamp: new Date(),
    metadata: { username }
  });

  return { sessionId, user };
}
```

### 2. Session Verification
```typescript
import { getSession, isSessionExpired } from '@/lib/mock-db';

function verifySession(sessionId: string) {
  const session = getSession(sessionId);
  if (!session) return { error: 'No session found' };
  if (isSessionExpired(session)) return { error: 'Session expired' };
  return { userId: session.userId };
}
```

### 3. Password Validation
```typescript
import { PASSWORD_MIN_LENGTH, USERNAME_REGEX, EMAIL_REGEX, ERROR_MESSAGES } from '@/lib/constants';

function validateInput(username: string, email: string, password: string) {
  if (!USERNAME_REGEX.test(username)) {
    return ERROR_MESSAGES.INVALID_USERNAME;
  }
  if (!EMAIL_REGEX.test(email)) {
    return ERROR_MESSAGES.INVALID_EMAIL;
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return ERROR_MESSAGES.PASSWORD_TOO_SHORT;
  }
  return null; // Valid
}
```

### 4. Audit Logging
```typescript
import { createAuditLog, getAuditLogsForUser, getRecentAuditLogs } from '@/lib/mock-db';
import { AUDIT_ACTIONS } from '@/lib/constants';

// Log an event
createAuditLog({
  id: 0,
  userId: 1,
  action: AUDIT_ACTIONS.PROTECTED_RESOURCE_ACCESS,
  status: 'success',
  timestamp: new Date(),
  metadata: {
    reason: 'Accessed dashboard'
  }
});

// View user's auth history
const userHistory = getAuditLogsForUser(1);

// View recent events
const recentEvents = getRecentAuditLogs(20);
```

---

## Test Users

Pre-configured for quick testing:

| Username | Password | Email | Role |
|----------|----------|-------|------|
| admin | admin123 | admin@example.com | admin |
| user | user123 | user@example.com | user |
| demo | demo123 | demo@example.com | user |

All passwords are already hashed with bcrypt (BCRYPT_COST=10).

---

## Security Reminders

### ✅ DO
- Use `hashPassword()` for new passwords
- Use `comparePassword()` for verification (constant-time)
- Use `generateSessionId()` for session IDs (cryptographically secure)
- Use `timingSafeCompare()` for sensitive strings
- Log all auth events with `createAuditLog()`
- Use HTTPS in production (set `Secure: true` in cookies)

### ❌ DON'T
- Store plain text passwords
- Use `===` to compare tokens (use `timingSafeCompare()`)
- Use `Math.random()` for tokens
- Log passwords or tokens
- Leak user existence (use generic error messages)
- Forget to validate input

---

## Flow Diagrams

### Session-Based Authentication
```
1. User submits login form
2. findUserByUsername() - Look up user
3. comparePassword() - Verify password (constant-time)
4. generateSessionId() - Create session ID
5. createSession() - Store in mockDB.sessions
6. Set-Cookie with sessionId (HttpOnly, Secure, SameSite=Strict)
7. createAuditLog() - Log successful login
8. Return user info to frontend
```

### Session Verification (Middleware)
```
1. Request comes in with cookie
2. Extract sessionId from cookie
3. getSession(sessionId) - Look up in mockDB
4. isSessionExpired() - Check validity
5. If valid, continue with request
6. If invalid, return 401 Unauthorized
```

### Logout
```
1. User clicks logout
2. Extract sessionId from cookie
3. deleteSession(sessionId) - Remove from mockDB
4. Clear cookie (Set-Cookie with Max-Age=0)
5. createAuditLog() - Log logout
6. Redirect to login
```

---

## Next Steps (Phase 2)

Phase 2 will build on these utilities by creating:

1. **API Routes** using these functions:
   - `/api/auth/login` - Session login
   - `/api/auth/logout` - Session logout
   - `/api/auth/verify` - Check auth status

2. **React Components** that interact with the API:
   - `LoginForm` - UI for login
   - `ProtectedRoute` - Route wrapper
   - `AuthStatus` - Show current user

See SPECIFICATION Section 9 for complete Phase 2 tasks.

---

## Troubleshooting

### "User not found" error
- Check `findUserByUsername()` is called with correct username
- Verify username case sensitivity
- Test users are: admin, user, demo

### "Invalid credentials"
- Ensure `comparePassword()` returns false (use `await`)
- Check password is correct (test users in table above)
- Verify `passwordHash` is valid bcrypt format

### Session expires unexpectedly
- Check `SESSION_EXPIRATION` value (24 hours default)
- Verify `isSessionExpired()` is checking timestamps correctly
- Ensure session created with proper `expiresAt` value

### TypeScript errors
- All types are in `@/lib/types`
- Import `import type { User }` for types
- Use regular import for runtime values

---

## Documentation Files

- **SPECIFICATION.md** - Full project specification (RFC references, security details)
- **PHASE_1_SUMMARY.md** - What was created in Phase 1
- **PHASE_1_QUICK_REFERENCE.md** - This file (quick lookup guide)

---

**Status:** Phase 1 Complete ✅
**Ready for:** Phase 2 - API Routes & React Components
**Questions?** See SPECIFICATION.md sections referenced in comments
