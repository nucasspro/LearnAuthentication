# Learn Authentication - Nền Tảng Học Tập Xác Thực Tương Tác
## (Phiên Bản Việt Hóa & Thiết Kế Cyberpunk)

Một nền tảng toàn diện, thực hành giúp bạn hiểu sâu về các cơ chế xác thực web bao gồm Session, JWT, OAuth 2.0 và Multi-Factor Authentication (MFA/2FA).

## 🎯 Tổng Quan Dự Án

Đây là một **nền tảng giáo dục** được thiết kế để dạy lập trình viên về xác thực (Authentication) và ủy quyền (Authorization) thông qua các bản demo tương tác, hình ảnh minh họa 3D sống động và code mẫu thực tế. Dự án bao gồm tất cả các mẫu xác thực chính được sử dụng trong các ứng dụng web hiện đại.

### Bạn Sẽ Học Được Gì?

- ✅ **Xác Thực Dựa Trên Session** - Server-side sessions với HTTP-Only cookies
- ✅ **JWT (JSON Web Tokens)** - Xác thực stateless dựa trên token
- ✅ **OAuth 2.0** - Ủy quyền bên thứ ba (Google, GitHub, Facebook, v.v.)
- ✅ **Xác Thực Đa Yếu Tố (MFA/2FA)** - Bảo mật dựa trên TOTP
- ✅ **Các Thực Hành Bảo Mật Tốt Nhất** - Hướng dẫn OWASP, lỗ hổng và cách phòng chống
- ✅ **Bảo Vệ Route** - Bảo vệ route phía Client và Server


## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Basic understanding of React and TypeScript
- Familiarity with HTTP concepts (cookies, headers)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/LearnAuthentication.git
cd LearnAuthentication

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Edit .env.local and add your JWT secret
# JWT_SECRET=your-secret-key-min-32-characters-long

# Run development server
npm run dev

# Open http://localhost:3000
```

### Building for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
LearnAuthentication/
├── src/
│   ├── app/                   # App Router
│   │   ├── api/auth/          # API Routes (Route Handlers)
│   │   │   └── route.ts       # Auth API logic
│   │   ├── jwt/               # JWT Module
│   │   ├── mfa/               # MFA Module
│   │   ├── oauth/             # OAuth Module
│   │   ├── session/           # Session Module
│   │   ├── layout.tsx         # Root Layout
│   │   ├── page.tsx           # Home Page
│   │   └── globals.css        # Global Styles
│   ├── components/
│   │   ├── ui/                # Reusable UI (Button, Card, etc.)
│   │   ├── learning/          # Lesson-specific components
│   │   └── auth/              # Auth forms
│   └── lib/
│       ├── auth-middleware.ts # Middleware logic
│       ├── jwt.ts             # JWT utilities
│       ├── mfa.ts             # TOTP utilities
│       └── mock-db.ts         # In-memory database
├── public/                    # Static assets
├── package.json
├── tsconfig.json
└── README.md
```

## 🔐 Authentication Methods Covered

### 1. Session-Based Authentication
- **Technology**: HTTP-Only Cookies, Server-side sessions
- **Storage**: In-memory (mockDB) - Redis/Database in production
- **Best For**: Traditional web applications, server-rendered pages
- **Demo**: `/session-demo`
- **Learn More**: `/learn/session`

**Key Features**:
- ✅ Server-side session storage
- ✅ HttpOnly, Secure, SameSite cookie attributes
- ✅ CSRF protection
- ✅ Session fixation prevention
- ✅ Automatic session cleanup

### 2. JWT (JSON Web Tokens)
- **Technology**: Stateless tokens with cryptographic signatures
- **Storage**: Client-side (Authorization header)
- **Best For**: APIs, microservices, mobile apps, SPAs
- **Demo**: `/jwt-demo`
- **Learn More**: `/learn/jwt`

**Key Features**:
- ✅ Stateless authentication
- ✅ Access & Refresh tokens
- ✅ Token rotation for security
- ✅ HS256 algorithm (HMAC-SHA256)
- ✅ 15-minute access token expiry
- ✅ 7-day refresh token expiry

### 3. OAuth 2.0
- **Technology**: Authorization framework for third-party access
- **Flow**: Authorization Code Flow
- **Best For**: Social login, API authorization
- **Demo**: `/oauth-demo`
- **Learn More**: `/learn/oauth`

**Key Features**:
- ✅ Authorization code flow (mock implementation)
- ✅ QR code scanning simulation
- ✅ State parameter for CSRF protection
- ✅ PKCE explanation (production best practice)
- ✅ Interactive flow visualization

### 4. Multi-Factor Authentication (MFA/2FA)
- **Technology**: TOTP (Time-based One-Time Password)
- **Standard**: RFC 6238
- **Best For**: Enhanced security, sensitive operations
- **Demo**: `/mfa-demo`
- **Learn More**: `/learn/mfa`

**Key Features**:
- ✅ TOTP code generation (6 digits, 30-second window)
- ✅ QR code generation for authenticator apps
- ✅ Backup codes (10 one-time use codes)
- ✅ Live authenticator simulator
- ✅ Compatible with Google Authenticator, Authy, etc.

## 🛡️ Security Features

### Password Security
- **Hashing**: bcrypt with cost factor 10
- **Storage**: Never store plain-text passwords
- **Validation**: Minimum 8 characters (configurable)

### Session Security
- **Session ID**: 256-bit random (crypto.randomBytes)
- **Expiration**: 24 hours (configurable)
- **Cookie Flags**: HttpOnly, Secure, SameSite=Strict
- **Regeneration**: New session ID after login

### JWT Security
- **Algorithm**: HS256 (HMAC-SHA256)
- **Secret**: Minimum 256 bits
- **Claims**: Issuer, audience, expiration validation
- **Refresh Tokens**: Rotation on use

### CSRF Protection
- **SameSite Cookies**: Strict mode
- **State Parameter**: OAuth flows
- **Generic Error Messages**: Prevent user enumeration

### XSS Protection
- **HttpOnly Cookies**: No JavaScript access
- **Content Security Policy**: Recommended in production
- **Input Sanitization**: Best practices documented

## 📚 Learning Path

### Beginner Track
1. **Start Here**: `/` (Home page overview)
2. **Session Auth**: `/learn/session` → `/session-demo`
3. **Try Protected Routes**: `/dashboard`
4. **Compare Methods**: `/comparison`

### Intermediate Track
5. **JWT Authentication**: `/learn/jwt` → `/jwt-demo`
6. **OAuth 2.0**: `/learn/oauth` → `/oauth-demo`
7. **Best Practices**: `/best-practices`

### Advanced Track
8. **Multi-Factor Auth**: `/learn/mfa` → `/mfa-demo`
9. **Security Deep Dive**: SPECIFICATION.md Section 6
10. **Production Deployment**: Environment configuration

## 🧪 Test Credentials

### Users (all passwords use bcrypt cost 10)

| Username | Password | Role | MFA Enabled |
|----------|----------|------|-------------|
| admin | admin123 | admin | No |
| user | user123 | user | No |
| demo | demo123 | user | No |

**Note**: These are for learning purposes only. In production, enforce strong password policies.

## 🔧 Configuration

### Environment Variables

```bash
# .env.local
JWT_SECRET=your-secret-key-min-32-characters-long
NODE_ENV=development
```

### Constants (src/lib/constants.ts)

```typescript
// Session
SESSION_EXPIRATION = 24 * 60 * 60 * 1000  // 24 hours

// JWT
JWT_EXPIRATION = 15 * 60                   // 15 minutes
REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60 // 7 days

// MFA
MFA_WINDOW = 2                             // ±60 seconds
MFA_BACKUP_CODES_COUNT = 10

// Password
PASSWORD_MIN_LENGTH = 8
BCRYPT_COST = 10
```

## 📖 API Documentation

### Session Authentication

```bash
# Login (creates session)
POST /api/auth/login
Body: { username: string, password: string }
Response: { success: true, user: {...} }
Cookie: SessionID (HttpOnly, Secure, SameSite=Strict)

# Logout (destroys session)
POST /api/auth/logout
Response: { success: true, message: "Logged out" }

# Verify session
GET /api/auth/verify
Response: { authenticated: true, user: {...}, method: "session" }

# Session details (debug)
GET /api/auth/session-check
Response: { sessionId, userId, expiresAt, expired: false }
```

### JWT Authentication

```bash
# Generate JWT tokens
POST /api/auth/jwt-sign
Body: { username: string, password: string }
Response: {
  success: true,
  accessToken: "eyJ...",
  refreshToken: "eyJ...",
  expiresIn: 900,
  user: {...}
}

# Verify JWT
POST /api/auth/jwt-verify
Body: { token: string }
Response: { valid: true, decoded: {...} }

# Refresh token
POST /api/auth/refresh-token
Body: { refreshToken: string }
Response: { accessToken: "eyJ...", expiresIn: 900 }

# Protected resource
GET /api/auth/protected-test
Header: Authorization: Bearer <token>
Response: { message: "...", data: {...} }
```

### MFA (2FA)

```bash
# Setup MFA
POST /api/auth/mfa/setup
Body: { userId: number }
Response: {
  secret: "JBSWY3DP...",
  qrCode: "data:image/png;base64,...",
  backupCodes: ["CODE1", "CODE2", ...]
}

# Verify MFA code
POST /api/auth/mfa/verify
Body: { userId: number, code: string, useBackupCode?: boolean }
Response: { success: true, message: "MFA verified" }
```

## 🎨 Tech Stack

- **Framework**: Next.js 15 (App Router + Pages Router hybrid)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Authentication**: Custom implementation (educational)
- **Libraries**:
  - `bcryptjs` - Password hashing
  - `jsonwebtoken` - JWT generation/verification
  - `speakeasy` - TOTP generation
  - `qrcode` - QR code generation
  - `cookie` - Cookie parsing

## 🔍 Testing

### Manual Testing

1. **Session Auth**: Login → Check cookies → Access dashboard → Logout
2. **JWT Auth**: Generate tokens → Test protected endpoint → Refresh token
3. **OAuth**: Start flow → Authorize → Callback → Token exchange
4. **MFA**: Setup → Scan QR → Verify code → Use backup code

### Security Testing

- ✅ HttpOnly cookie flag prevents JavaScript access
- ✅ Secure flag requires HTTPS (localhost exception)
- ✅ SameSite=Strict prevents CSRF
- ✅ Token expiration enforced
- ✅ Session expiration enforced
- ✅ Password hashing (never plain-text)

## 📚 References & Resources

### RFCs
- [RFC 6265](https://datatracker.ietf.org/doc/html/rfc6265) - HTTP State Management (Cookies)
- [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519) - JSON Web Token (JWT)
- [RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749) - OAuth 2.0
- [RFC 6238](https://datatracker.ietf.org/doc/html/rfc6238) - TOTP (Time-Based OTP)

### OWASP
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

### Documentation
- Full specification: `docs/SPECIFICATION.md`
- Phase summaries: `PHASE_*_SUMMARY.md`

## ⚠️ Important Notes

### This is for LEARNING ONLY

- **Mock Database**: Uses in-memory storage (resets on restart)
- **No Persistence**: Sessions/tokens lost on server restart
- **Simplified Security**: Production needs more layers
- **No Rate Limiting**: Implement in production
- **No Email Verification**: Add for production
- **No Password Reset**: Add for production

### Production Recommendations

1. **Database**: Replace mockDB with PostgreSQL/MongoDB
2. **Sessions**: Use Redis for session storage
3. **Secrets**: Use environment variables, rotate regularly
4. **HTTPS**: Always use HTTPS (never HTTP)
5. **Rate Limiting**: Implement on login/signup endpoints
6. **Logging**: Add comprehensive audit logging
7. **Monitoring**: Set up alerts for suspicious activity
8. **Backups**: Regular database backups
9. **Security Headers**: Add CSP, HSTS, X-Frame-Options
10. **Testing**: Automated security testing

## 🤝 Contributing

This is an educational project. Feel free to:
- Report bugs or unclear explanations
- Suggest additional authentication methods
- Improve documentation
- Add more interactive visualizations

## 📄 License

MIT License - Free for educational use

## 🙏 Acknowledgments

- OWASP for security guidelines
- IETF for RFC specifications
- Next.js team for the framework
- All contributors to open-source security libraries

---

**Built with ❤️ for learning authentication the right way**
