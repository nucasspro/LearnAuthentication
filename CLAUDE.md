# CLAUDE.md - AI Assistant Guide for LearnAuthentication

> **Purpose**: This file provides comprehensive context about the LearnAuthentication project for AI assistants (Claude, Antigravity, etc.) to understand the codebase, architecture, and development guidelines.

---

## 🎯 Project Overview

**LearnAuthentication** is an **interactive educational platform** for teaching web authentication and authorization concepts through hands-on demos and real implementations.

### Core Mission
- Teach developers authentication patterns through **interactive learning**
- Provide **working code examples** with detailed explanations
- Cover **Session-based**, **JWT**, **OAuth 2.0**, and **MFA/2FA** authentication
- Follow **OWASP security best practices** while remaining educational

### Target Audience
- Developers learning authentication for the first time
- Intermediate developers wanting to understand security patterns
- Anyone building authentication systems who needs reference implementations

---

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router + Pages Router hybrid)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Authentication**: Custom implementation (educational, not production library)

### Key Libraries
```json
{
  "bcryptjs": "Password hashing (cost factor 10)",
  "jsonwebtoken": "JWT generation/verification (HS256)",
  "speakeasy": "TOTP generation (RFC 6238)",
  "qrcode": "QR code generation for MFA",
  "react-hot-toast": "Toast notifications",
  "react-syntax-highlighter": "Code highlighting in learning pages"
}
```

---

## 📁 Project Structure

```
LearnAuthentication/
├── .agent/                      # Antigravity skills & workflows
│   ├── skills/
│   │   ├── auth-learning-guide/ # Authentication educator
│   │   ├── ui-ux-consistency/   # UI/UX analyzer
│   │   ├── frontend-developer/  # React specialist
│   │   ├── nextjs-code-reviewer/# Code reviewer
│   │   └── frontend-design/     # Design specialist
│   └── workflows/
│       └── generate-tests.md    # Test generation workflow
│
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── api/auth/           # Authentication API routes
│   │   ├── session/            # Session demo page
│   │   ├── jwt/                # JWT demo page
│   │   ├── oauth/              # OAuth demo page
│   │   ├── mfa/                # MFA demo page
│   │   ├── comparison/         # Auth methods comparison
│   │   ├── dashboard/          # Protected dashboard
│   │   └── page.tsx            # Home page
│   │
│   ├── components/
│   │   ├── auth/               # Auth components (LoginForm, ProtectedRoute)
│   │   ├── demo/               # Interactive demos (TOTPSetup, AuthSimulator)
│   │   ├── learning/           # Educational components (CodeBlock, StepByStep)
│   │   ├── visualization/      # Flow diagrams (OAuthFlow, JWTFlow)
│   │   ├── shared/             # Shared components (Header, Footer)
│   │   └── ui/                 # shadcn/ui components
│   │
│   ├── lib/
│   │   ├── types.ts            # TypeScript interfaces (User, Session, JWT)
│   │   ├── constants.ts        # Configuration & constants
│   │   ├── crypto.ts           # Cryptographic utilities (hashing, tokens)
│   │   ├── mock-db.ts          # In-memory database (sessions, users)
│   │   ├── jwt.ts              # JWT generation & verification
│   │   ├── mfa.ts              # TOTP & backup codes
│   │   ├── mock-oauth.ts       # OAuth flow simulation
│   │   ├── auth-middleware.ts  # Session & JWT verification
│   │   └── content/            # Learning content (markdown)
│   │
│   └── styles/
│       └── globals.css         # Global styles & Tailwind config
│
├── docs/
│   └── SPECIFICATION.md        # Full project specification
│
├── PHASE_1_QUICK_REFERENCE.md  # Quick reference for Phase 1
├── PHASE_1_SUMMARY.md          # Phase 1 summary
├── UI-UX-ANALYSIS.md           # UI/UX analysis & recommendations
└── README.md                   # User-facing documentation
```

---

## 🔐 Authentication Methods Implemented

### 1. Session-Based Authentication
**Files**: `src/lib/crypto.ts`, `src/lib/mock-db.ts`, `src/app/api/auth/login/route.ts`

**Flow**:
1. User submits credentials
2. Server verifies password (bcrypt)
3. Server creates session (256-bit random ID)
4. Session stored in mockDB (in-memory)
5. HttpOnly cookie sent to client
6. Subsequent requests include cookie
7. Middleware verifies session

**Security Features**:
- HttpOnly cookies (no JavaScript access)
- Secure flag (HTTPS only)
- SameSite=Strict (CSRF protection)
- 24-hour expiration
- Session regeneration after login

### 2. JWT (JSON Web Tokens)
**Files**: `src/lib/jwt.ts`, `src/app/api/auth/jwt-sign/route.ts`

**Flow**:
1. User submits credentials
2. Server verifies password
3. Server generates access token (15 min) + refresh token (7 days)
4. Client stores tokens (localStorage/memory)
5. Client sends token in Authorization header
6. Server verifies token signature & expiration
7. Refresh token used to get new access token

**Security Features**:
- HS256 algorithm (HMAC-SHA256)
- Short-lived access tokens (15 min)
- Refresh token rotation
- Issuer & audience validation
- Expiration enforcement

### 3. OAuth 2.0
**Files**: `src/lib/mock-oauth.ts`, `src/app/api/auth/oauth/*/route.ts`

**Flow** (Authorization Code Flow):
1. User clicks "Login with Provider"
2. Redirect to authorization endpoint
3. User authorizes (mock QR code scan)
4. Redirect back with authorization code
5. Exchange code for access token
6. Use token to access protected resources

**Security Features**:
- State parameter (CSRF protection)
- Authorization code (single use)
- PKCE explanation (production best practice)
- Mock implementation for learning

### 4. Multi-Factor Authentication (MFA/2FA)
**Files**: `src/lib/mfa.ts`, `src/app/api/auth/mfa/*/route.ts`

**Flow**:
1. User enables MFA
2. Server generates TOTP secret
3. QR code displayed for authenticator app
4. User scans QR code
5. User enters 6-digit code to verify
6. Backup codes generated (10 codes)
7. Subsequent logins require TOTP code

**Security Features**:
- TOTP (RFC 6238) - 30-second window
- 6-digit codes
- ±60 second tolerance (2 windows)
- Backup codes (one-time use)
- Compatible with Google Authenticator, Authy

---

## 🗄️ Data Layer

### Mock Database (`src/lib/mock-db.ts`)
**Purpose**: In-memory storage for learning (resets on restart)

**Collections**:
```typescript
mockDB = {
  users: Map<number, User>,           // User accounts
  sessions: Map<string, Session>,     // Active sessions
  refreshTokens: Map<string, TokenRecord>, // Refresh tokens
  mfaSecrets: Map<number, MFASecret>, // MFA configurations
  auditLogs: AuditLog[]               // Authentication events
}
```

**Test Users**:
| Username | Password | Role | Email |
|----------|----------|------|-------|
| admin | admin123 | admin | admin@example.com |
| user | user123 | user | user@example.com |
| demo | demo123 | user | demo@example.com |

**Important Functions**:
- `findUserByUsername()` - Lookup user
- `createSession()` - Store session
- `getSession()` - Retrieve session
- `isSessionExpired()` - Check expiration
- `createAuditLog()` - Log auth events

---

## 🔒 Security Implementation

### Password Security
```typescript
// src/lib/crypto.ts
hashPassword(password: string): Promise<string>
  - Uses bcrypt with cost factor 10
  - Never store plain-text passwords

comparePassword(password: string, hash: string): Promise<boolean>
  - Constant-time comparison
  - Prevents timing attacks
```

### Session Security
```typescript
// src/lib/crypto.ts
generateSessionId(): string
  - 256-bit random (crypto.randomBytes)
  - Cryptographically secure

// Cookie configuration
{
  httpOnly: true,      // No JavaScript access
  secure: true,        // HTTPS only (localhost exception)
  sameSite: 'strict',  // CSRF protection
  maxAge: 86400000     // 24 hours
}
```

### JWT Security
```typescript
// src/lib/jwt.ts
signJWT(payload: JWTPayload): string
  - Algorithm: HS256 (HMAC-SHA256)
  - Secret: 256-bit minimum
  - Claims: iss, aud, exp, iat, sub

verifyJWT(token: string): JWTPayload | null
  - Signature verification
  - Expiration check
  - Issuer/audience validation
```

### CSRF Protection
- SameSite=Strict cookies
- State parameter in OAuth flows
- Generic error messages (prevent user enumeration)

---

## 🎨 UI/UX Design System

### Color Palette
```css
/* Primary Colors */
--primary: 262.1 83.3% 57.8%        /* Purple */
--primary-foreground: 210 20% 98%

/* Background */
--background: 0 0% 100%             /* White */
--foreground: 222.2 84% 4.9%        /* Dark text */

/* Accent */
--accent: 210 40% 96.1%
--accent-foreground: 222.2 47.4% 11.2%

/* Destructive */
--destructive: 0 84.2% 60.2%        /* Red */
```

### Typography
- **Headings**: Font weight 700, tracking tight
- **Body**: Font weight 400, line height 1.6
- **Code**: Monospace, syntax highlighting

### Components (shadcn/ui)
- Button, Card, Input, Tabs
- Alert, Badge, Dialog, Progress
- All components in `src/components/ui/`

---

## 📚 Learning Content Structure

### Educational Pages
Each auth method has:
1. **Concept Page** (`/learn/[method]`) - Theory & explanation
2. **Demo Page** (`/[method]`) - Interactive implementation
3. **Comparison** (`/comparison`) - Side-by-side comparison

### Content Components
```typescript
// src/components/learning/
CodeBlock.tsx           // Syntax-highlighted code examples
StepByStep.tsx          // Sequential flow explanations
ConceptCard.tsx         // Concept summaries
SecurityNote.tsx        // Security warnings/tips
InteractiveDemo.tsx     // Hands-on demonstrations
```

### Writing Style (for AI assistants)
When explaining authentication concepts:
1. **Start with analogy** - Real-world comparison
2. **Show the flow** - Step-by-step numbered list
3. **Explain the why** - Security reasoning
4. **Provide code** - Minimal, focused examples
5. **Highlight pitfalls** - Common mistakes
6. **Summarize** - Key takeaways

---

## 🧪 Testing Guidelines

### Manual Testing Flow
1. **Session Auth**: Login → Dashboard → Logout
2. **JWT Auth**: Generate tokens → Protected endpoint → Refresh
3. **OAuth**: Start flow → Authorize → Callback
4. **MFA**: Setup → Scan QR → Verify code

### Security Testing Checklist
- [ ] HttpOnly cookie prevents JavaScript access
- [ ] Secure flag enforced (HTTPS)
- [ ] SameSite=Strict prevents CSRF
- [ ] Token expiration enforced
- [ ] Session expiration enforced
- [ ] Passwords hashed (never plain-text)
- [ ] Generic error messages (no user enumeration)

---

## 🚀 Development Workflow

### Adding New Features
1. **Update types** (`src/lib/types.ts`)
2. **Add constants** (`src/lib/constants.ts`)
3. **Implement logic** (`src/lib/[feature].ts`)
4. **Create API route** (`src/app/api/auth/[endpoint]/route.ts`)
5. **Build UI component** (`src/components/[category]/`)
6. **Create demo page** (`src/app/[feature]/page.tsx`)
7. **Add learning content** (`src/components/learning/`)
8. **Update documentation** (README.md, SPECIFICATION.md)

### Code Style
- **TypeScript**: Strict mode, explicit types
- **Naming**: camelCase for variables, PascalCase for components
- **Comments**: JSDoc for public functions
- **Imports**: Use `@/` alias for src directory
- **Formatting**: Prettier (via ESLint)

### Git Workflow
```bash
# Feature branch
git checkout -b feature/oauth-pkce

# Commit with descriptive messages
git commit -m "feat(oauth): Add PKCE support for enhanced security"

# Push and create PR
git push origin feature/oauth-pkce
```

---

## ⚠️ Important Constraints

### This is for LEARNING ONLY
- **Mock Database**: In-memory storage (resets on restart)
- **No Persistence**: Sessions/tokens lost on server restart
- **Simplified Security**: Production needs more layers
- **No Rate Limiting**: Implement in production
- **No Email Verification**: Add for production
- **No Password Reset**: Add for production

### Production Recommendations
1. **Database**: Replace mockDB with PostgreSQL/MongoDB
2. **Sessions**: Use Redis for session storage
3. **Secrets**: Environment variables, rotate regularly
4. **HTTPS**: Always use HTTPS (never HTTP)
5. **Rate Limiting**: Implement on auth endpoints
6. **Logging**: Comprehensive audit logging
7. **Monitoring**: Alerts for suspicious activity
8. **Security Headers**: CSP, HSTS, X-Frame-Options

---

## 🤖 AI Assistant Guidelines

### When to Use Skills

**auth-learning-guide** - Use when:
- User asks about authentication concepts
- Explaining JWT, OAuth, sessions, MFA
- Teaching security best practices
- Providing step-by-step auth implementations

**ui-ux-consistency** - Use when:
- Analyzing page readability
- Checking WCAG compliance
- Ensuring design consistency
- Optimizing learning experience

**frontend-developer** - Use when:
- Building React components
- Implementing responsive designs
- Optimizing performance
- Adding accessibility features

**nextjs-code-reviewer** - Use when:
- Reviewing new/modified code
- Looking for optimization opportunities
- Checking for code duplication
- Ensuring TypeScript best practices

**frontend-design** - Use when:
- Creating new UI components
- Designing landing pages
- Building distinctive interfaces
- Avoiding generic AI aesthetics

### Code Generation Best Practices

1. **Follow existing patterns** - Match the codebase style
2. **Use TypeScript strictly** - Explicit types, no `any`
3. **Security first** - Follow OWASP guidelines
4. **Educational focus** - Add comments explaining concepts
5. **Test with mock users** - admin/user/demo credentials
6. **Document changes** - Update README/SPECIFICATION

### Common Tasks

**Adding a new auth method**:
1. Create types in `src/lib/types.ts`
2. Implement logic in `src/lib/[method].ts`
3. Add API routes in `src/app/api/auth/[method]/`
4. Create demo page in `src/app/[method]/`
5. Add learning content in `src/components/learning/`

**Fixing security issues**:
1. Check OWASP guidelines
2. Review `src/lib/crypto.ts` for proper utilities
3. Ensure constant-time comparisons
4. Verify cookie security flags
5. Add audit logging

**Improving UI/UX**:
1. Follow shadcn/ui component patterns
2. Ensure WCAG AA compliance
3. Add loading states & error handling
4. Implement responsive design
5. Test with keyboard navigation

---

## 📖 Reference Documentation

### Internal Docs
- **SPECIFICATION.md** - Full project specification with RFC references
- **PHASE_1_QUICK_REFERENCE.md** - Quick lookup guide for utilities
- **PHASE_1_SUMMARY.md** - Phase 1 implementation summary
- **UI-UX-ANALYSIS.md** - UI/UX analysis & recommendations
- **README.md** - User-facing documentation

### External References
- [RFC 6265](https://datatracker.ietf.org/doc/html/rfc6265) - HTTP Cookies
- [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519) - JWT
- [RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749) - OAuth 2.0
- [RFC 6238](https://datatracker.ietf.org/doc/html/rfc6238) - TOTP
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

---

## 🎯 Project Goals & Philosophy

### Educational Mission
- **Hands-on learning** over theoretical explanations
- **Real implementations** not just diagrams
- **Security best practices** built-in from the start
- **Progressive disclosure** - simple first, complex later
- **Story-driven** - relatable analogies and scenarios

### Code Quality
- **Readable** - Clear variable names, comments
- **Maintainable** - DRY principles, modular design
- **Secure** - OWASP guidelines, constant-time operations
- **Type-safe** - TypeScript strict mode
- **Documented** - JSDoc, inline comments, README

### User Experience
- **Intuitive** - Clear navigation, consistent UI
- **Accessible** - WCAG AA compliance
- **Responsive** - Mobile-first design
- **Interactive** - Live demos, visualizations
- **Informative** - Helpful error messages, tooltips

---

**Last Updated**: 2026-01-18
**Version**: 1.0.0
**Maintained for**: Claude, Antigravity, and other AI assistants

---

**Built with ❤️ for learning authentication the right way**
