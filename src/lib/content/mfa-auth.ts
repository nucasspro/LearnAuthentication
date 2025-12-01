/**
 * Multi-Factor Authentication (MFA) - Learning Content
 *
 * Story Theme: THE VERIFICATION GAUNTLET
 * Metaphor: Multiple security checkpoints in a high-security facility
 * Tone: Layered defense, redundancy, threat mitigation
 */


export const mfaAuthContent = {
  storyHook: {
    title: "THE VERIFICATION GAUNTLET",
    subtitle: "Multi-Factor Authentication",
    clearanceLevel: "Maximum Security",
    status: "ACTIVE",
    narrative: `The year is 2084. A single password is no longer enough - not in a world where credential breaches happen daily and attackers have access to rainbow tables, dictionary databases, and GPU-powered cracking rigs.

Welcome to THE VERIFICATION GAUNTLET - a multi-layered security system where authentication requires proof across multiple dimensions. Not just WHAT you know, but WHAT you have and WHO you are.

Your mission: Master the art of defense-in-depth authentication, where compromising one factor leaves the attacker facing impossible odds.`,
  },

  sections: [
    // ============================================
    // ESSENTIAL KNOWLEDGE (10 minutes)
    // ============================================
    {
      id: 'section-1',
      category: 'essential' as const,
      title: 'The Three Factors: Beyond Passwords',
      icon: 'Lock',
      estimatedTime: '3 min',
      content: `Multi-Factor Authentication (MFA) requires proof of identity across MULTIPLE independent categories. Think of it as fortress with multiple gates - breaching one doesn't grant access.

**The Three Authentication Factors:**

**1. Knowledge Factor (Something You Know)**
- Password, PIN, security questions
- Examples: "myP@ssw0rd", "4-digit PIN", "What was your first pet?"
- Weakness: Can be forgotten, guessed, phished, or breached
- Alone: Insufficient for high-security systems

**2. Possession Factor (Something You Have)**
- Physical device, security key, mobile phone
- Examples: Hardware token, authenticator app, SIM card, USB key
- Weakness: Can be lost, stolen, or replaced by attacker
- Strength: Requires physical access to compromise

**3. Inherence Factor (Something You Are)**
- Biometric characteristics unique to you
- Examples: Fingerprint, facial recognition, iris scan, voice
- Weakness: Cannot be changed if compromised
- Strength: Nearly impossible to spoof without advanced technology

**MFA Combinations:**

| Type | Factors | Security | Examples |
|------|---------|----------|----------|
| **Single-Factor** | Knowledge only | Weak | Password only |
| **Two-Factor (2FA)** | Knowledge + Possession | Strong | Password + TOTP app |
| **Two-Factor (2FA)** | Knowledge + Inherence | Strong | Password + Fingerprint |
| **Multi-Factor (MFA)** | All three factors | Maximum | Password + TOTP + Biometric |

**Critical Rule: Factors Must Be Independent**
❌ Bad: Password + security question (both knowledge)
❌ Bad: Password + email code (both "knowledge" + compromised if email hacked)
✅ Good: Password (knowledge) + TOTP app (possession) + Fingerprint (inherence)

**Why MFA Matters:**

Even if attackers have your password from a breach:
- 99.9% chance they DON'T have your phone
- 99.99% chance they DON'T have your fingerprint
- Attack becomes exponentially harder with each factor`,

      keyPoints: [
        'MFA requires proof across multiple independent categories',
        'Three authentication factors: Knowledge, Possession, Inherence',
        'Each factor has strengths and weaknesses - combine for defense-in-depth',
        'Factors must be truly independent (not both knowledge)',
        'Password breaches alone cannot compromise MFA-protected accounts',
      ],

      visual: `
┌─────────────────────────────────────────────────┐
│       MULTI-FACTOR AUTHENTICATION FLOW          │
├─────────────────────────────────────────────────┤
│                                                  │
│  Step 1: Knowledge Factor                       │
│  ┌──────────────────┐                           │
│  │ Username/Password │                          │
│  └────────┬─────────┘                           │
│           │                                     │
│           ↓                                     │
│  Step 2: Possession Factor                      │
│  ┌──────────────────┐                           │
│  │  6-Digit Code    │ (from authenticator app) │
│  │   (TOTP token)   │                          │
│  └────────┬─────────┘                           │
│           │                                     │
│           ↓                                     │
│  Step 3: Inherence Factor (Optional)            │
│  ┌──────────────────┐                           │
│  │ Biometric Scan   │ (fingerprint/face)       │
│  │  (WebAuthn/FIDO2)│                          │
│  └────────┬─────────┘                           │
│           │                                     │
│           ↓                                     │
│  Access GRANTED ✓                              │
│                                                  │
└─────────────────────────────────────────────────┘`,
    },

    {
      id: 'section-2',
      category: 'essential' as const,
      title: 'TOTP: Time-Based One-Time Passwords',
      icon: 'Clock',
      estimatedTime: '3 min',
      content: `**TOTP** (Time-Based One-Time Password, RFC 6238) is the most popular possession-factor implementation. It generates new codes every 30 seconds using only TIME and a SECRET.

**How TOTP Works:**

1. **Setup Phase**:
   - Server generates SECRET (random 256-bit value)
   - Server displays QR code containing: secret + issuer name
   - User scans QR with authenticator app (Google Authenticator, Authy, etc.)
   - App stores secret locally

2. **Authentication Phase**:
   - Current time: 14:35:22 (UNIX timestamp: 1735868122)
   - Time step: 30 seconds (counter = 1735868122 / 30 = 57862373)
   - HMAC-SHA1(secret, counter) = [random bytes]
   - Take last 6 digits: **482917**
   - User enters 482917 to prove they have the device

3. **Verification Phase**:
   - Server calculates same HMAC-SHA1(secret, current_counter)
   - Server compares: user_input === server_calculated
   - Match = authenticated ✓

**Why TOTP is Secure:**

- **Time-bound**: Code expires after 30 seconds (brute-force window is tiny)
- **No transmission**: Code generated locally, never sent through network
- **Stateless**: Server doesn't store codes, only the secret
- **Possession-based**: Requires physical device with the secret
- **Multi-device resistant**: Attacker needs BOTH password AND phone

**TOTP Variants:**

| Type | Purpose | Window |
|------|---------|--------|
| **TOTP** | Primary auth | ±1 time step (30 sec) |
| **TOTP (Grace Period)** | Smoother UX | ±2 time steps (60 sec) |
| **HOTP** | Counter-based | ±4 counters |
| **Backup Codes** | Account recovery | No expiration |

**Critical Implementation Detail - Time Skew:**

Problem: User's phone clock is 45 seconds fast
- User's phone generates code for counter = current + 45 sec
- Server calculates for counter = current
- Codes don't match → authentication fails!

Solution: Accept TOTP from ±1 time step window
- Server checks: current - 30, current, current + 30
- Allows for up to 60 seconds of clock drift`,

      keyPoints: [
        'TOTP generates 6-digit codes every 30 seconds using HMAC-SHA1',
        'Requires only TIME and SECRET - no server state',
        'Codes are stateless, time-bound, and locally generated',
        'Possession factor: Attacker needs phone to get codes',
        'Handle time skew by accepting ±1 time step window',
      ],

      codeExamples: {
        javascript: [{
          language: 'javascript' as const,
          label: 'JavaScript (Node.js)',
          code: `// TOTP Generation and Verification
const crypto = require('crypto');
const QRCode = require('qrcode');
const speakeasy = require('speakeasy');

// Step 1: Generate secret during 2FA setup
async function setupTOTP(userId, userEmail) {
  // Generate random secret (base32 encoded, ~32 characters)
  const secret = speakeasy.generateSecret({
    name: \`NeoTech Corp (\${userEmail})\`,
    issuer: 'NeoTech Corp',
    length: 32,
  });

  // Generate QR code for scanning
  const qrCode = await QRCode.toDataURL(secret.otpauth_url);

  // Store secret (hashed!) in database
  await db.mfaSecrets.create({
    userId,
    secretHash: hashSecret(secret.base32),  // ✅ Hash for storage
    enabled: false,  // Not active until user confirms
    backupCodes: generateBackupCodes(10),   // For account recovery
    createdAt: new Date(),
  });

  // Return QR code and backup codes to user
  return {
    qrCode,
    backupCodes: secret.backupCodes,
    manualEntry: secret.base32,  // Fallback if QR doesn't work
  };
}

// Step 2: Verify TOTP code during login
function verifyTOTP(userInput, storedSecret) {
  // User input: "482917" (6-digit code from authenticator app)
  const isValid = speakeasy.totp.verify({
    secret: storedSecret,
    encoding: 'base32',
    token: userInput,
    window: 2,  // ±2 time steps (handles 60 sec clock skew)
  });

  return isValid;
}

// Step 3: Full 2FA login flow
app.post('/api/auth/2fa-verify', async (req, res) => {
  const { userId, totpCode, backupCode } = req.body;

  // Get user's MFA secret
  const mfaConfig = await db.mfaSecrets.findOne({ userId });

  if (!mfaConfig.enabled) {
    return res.status(400).json({ error: '2FA not enabled' });
  }

  let isValid = false;
  let usedBackup = false;

  // Try primary TOTP code
  if (totpCode) {
    isValid = verifyTOTP(totpCode, mfaConfig.secret);
  }

  // Try backup code as fallback
  if (!isValid && backupCode) {
    // Check if backup code matches and hasn't been used
    const normalizedCode = backupCode.toUpperCase().replace(/\\s/g, '');
    const codeIndex = mfaConfig.backupCodes.indexOf(normalizedCode);

    if (codeIndex >= 0 && !mfaConfig.usedBackupCodes.includes(codeIndex)) {
      isValid = true;
      usedBackup = true;

      // Mark backup code as used (prevent reuse)
      await db.mfaSecrets.update(userId, {
        usedBackupCodes: [...mfaConfig.usedBackupCodes, codeIndex],
      });
    }
  }

  if (!isValid) {
    console.warn(\`2FA failed for user \${userId}\`);
    return res.status(401).json({ error: 'Invalid 2FA code' });
  }

  // 2FA verified - create session
  const sessionId = generateSessionId();
  await db.sessions.create({
    sessionId,
    userId,
    mfaVerified: true,
    createdAt: new Date(),
  });

  console.log(\`2FA success for user \${userId}\${usedBackup ? ' (backup code)' : ''}\`);

  res.json({
    success: true,
    message: '2FA verification successful',
    sessionId,
  });
});

// Helper: Generate backup codes (for account recovery)
function generateBackupCodes(count = 10) {
  return Array.from({ length: count }, () => {
    // Format: XXXX-XXXX (8 alphanumeric characters)
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    return \`\${code.slice(0, 4)}-\${code.slice(4, 8)}\`;
  });
}

// Helper: Hash secret before storage
function hashSecret(secret) {
  return crypto.createHash('sha256').update(secret).digest('hex');
}`,
        }],
      },
    },

    {
      id: 'section-3',
      category: 'essential' as const,
      title: 'Backup Codes: The Emergency Exit',
      icon: 'Shield',
      estimatedTime: '4 min',
      content: `**Backup Codes** are single-use recovery codes that bypass MFA when the primary factor is unavailable.

**Scenarios Where Backup Codes Save Lives:**

- 📱 Phone is lost/stolen
- 🔄 Phone is replaced with new device
- 🚫 Authenticator app crashes or gets uninstalled
- 🔌 Device runs out of battery
- 🌐 Cloud backup of authenticator was restored (synced secret)

**Backup Code Requirements:**

1. **Generated During MFA Setup**
   - Typically 8-16 codes (format: XXXX-XXXX or similar)
   - Long enough to prevent brute-force (minimum 8 characters)
   - User MUST save codes in secure location

2. **Single-Use Only**
   - Each code can only be used ONCE
   - After use, code is marked as consumed
   - Prevents replay attacks if codes are intercepted

3. **Securely Stored**
   - ✅ Hashed (bcrypt) - never store in plaintext!
   - ✅ Encrypted database column
   - ❌ NOT stored in plaintext (massive security breach)

4. **User Downloads & Backs Up**
   - User downloads codes as PDF/text file
   - User stores in secure location (1Password, Bitwarden, etc.)
   - NOT stored in email (email = compromised = all backups exposed)

**Implementation Considerations:**

**Rate Limiting on Backup Code Attempts:**
- Allow 3 failed attempts per hour
- Lock account after 3 hours of failed backup attempts
- Require manual admin intervention to unlock

**Usage Logging:**
- Log every successful backup code use
- Alert user: "Account accessed with backup code"
- If user didn't do it = possible account takeover

**Regeneration:**
- User can regenerate backup codes anytime
- Old codes become invalid
- New codes generated and downloaded
- Useful after account recovery or suspicious activity

**Never Regenerate Without User Action:**
- Don't auto-regenerate after login
- Don't rotate codes periodically
- Only on explicit user request
- Prevents locked-out users from gaining access`,

      keyPoints: [
        'Backup codes are single-use recovery codes for emergencies',
        'Essential for account recovery when MFA device is lost',
        'Must be hashed/encrypted in database (never plaintext)',
        'Single-use only - marked as consumed after use',
        'User responsibility to download and securely store codes',
      ],
    },

    // ============================================
    // IMPORTANT KNOWLEDGE (15 minutes)
    // ============================================
    {
      id: 'section-4',
      category: 'important' as const,
      title: 'FIDO2/WebAuthn: Passwordless Authentication',
      icon: 'Zap',
      estimatedTime: '5 min',
      content: `**FIDO2** (Fast IDentity Online 2) and **WebAuthn** represent the next evolution - authentication WITHOUT passwords using cryptographic keys stored on physical devices.

**The Problem with Passwords:**
- Humans create weak passwords
- Reuse passwords across sites
- Fall victim to phishing
- Cannot be revoked retroactively if breached
- Require complex UX for password recovery

**FIDO2/WebAuthn Solution:**
- No passwords to phish or breach
- Cryptographic challenge-response (attacker can't forge)
- Phishing-resistant (key only unlocks if domain matches)
- Public key infrastructure (impossible to compromise without device)

**How WebAuthn Works:**

**1. Registration (Setup):**
1. Browser requests: "Create a new authenticator"
2. Browser prompts: Insert USB key / use fingerprint / use face
3. Authenticator generates: Private key (never leaves device!)
4. Authenticator returns: Public key + credential ID
5. Server stores: Public key (not secret!)
6. Result: Device is now registered for this account

**2. Authentication (Login):**
1. Browser requests: "Sign this challenge"
2. Browser prompts: Insert USB key / use fingerprint
3. Authenticator signs challenge with private key (still on device!)
4. Browser returns: Signed challenge to server
5. Server verifies: signature matches stored public key
6. Result: User is authenticated

**Key Insight:** Attacker CANNOT forge signature without private key, and private key NEVER leaves the device.

**FIDO2 Authenticator Types:**

| Type | Device | Cost | Security |
|------|--------|------|----------|
| **Platform Authenticator** | Built-in (fingerprint/face) | Free | High |
| **Cross-Platform Authenticator** | USB security key | $20-50 | Maximum |
| **Hybrid Transport** | Phone as USB key | Free (app-based) | High |

**Security Properties:**

✅ **Phishing-Resistant**: Private key only signs for correct domain
✅ **Revocation-Proof**: Lost key is simply removed from server
✅ **Stateless**: No shared secrets, only public key verification
✅ **Backup-Safe**: Multiple authenticators can be registered
✅ **Future-Proof**: Public key cryptography is quantum-resistant`,

      keyPoints: [
        'FIDO2/WebAuthn: Passwordless authentication using public key cryptography',
        'Private key stays on device, only public key stored on server',
        'Phishing-resistant: Private key only signs for correct domain',
        'Supports multiple authenticators: USB keys, biometrics, hybrid',
        'Most secure form of authentication available today',
      ],
    },

    {
      id: 'section-5',
      category: 'important' as const,
      title: 'MFA Deployment Strategies',
      icon: 'GitBranch',
      estimatedTime: '5 min',
      content: `How you deploy MFA dramatically affects adoption rates and user experience.

**Strategy 1: Mandatory MFA (Maximum Security)**
- ALL users MUST enable 2FA
- No workarounds or exemptions
- Best for: Highly sensitive systems (banking, healthcare)
- Downside: Lower adoption rates, more support tickets

Implementation:
\`\`\`
- Prompt during signup: "Enable 2FA now or you can't continue"
- Prompt during login: "Setup 2FA to access your account"
- After grace period (7 days): Force setup or account locked
\`\`\`

**Strategy 2: Strongly Recommended (User Choice)**
- Encourage users to enable MFA
- Show prominent prompts but allow skip
- Best for: SaaS platforms, general users
- Downside: ~30% adoption without incentives

Implementation:
\`\`\`
- Dashboard banner: "Secure your account - enable 2FA"
- After login: "Tip: Enable 2FA for better security"
- Show adoption percentage: "95% of users enabled 2FA"
\`\`\`

**Strategy 3: Risk-Based MFA (Context-Aware)**
- Require MFA only for suspicious logins
- Normal logins skip MFA (faster UX)
- Best for: Balancing security and usability
- Risk factors: New device, new location, IP change

Implementation:
\`\`\`
- Track user's normal login patterns
- If suspicious: Require MFA code
- If normal: Skip MFA (user already logged in)
- Allow user to "trust this device" for 30 days
\`\`\`

**Strategy 4: Graduated Rollout (Progressive)**
- Start with opt-in (users enable voluntarily)
- Monitor adoption rate
- If low adoption: Move to recommended
- If still low: Make mandatory with grace period

Implementation Timeline:
\`\`\`
- Week 1-4: Opt-in (feature available)
- Week 5-8: Recommended (prominent prompts)
- Week 9-12: Most accounts have MFA (show percentages)
- Week 13+: Mandatory for new signups
\`\`\`

**UX Best Practices:**

1. **Clear Value Proposition**
   - "Protect your account from hackers"
   - "Your security is our priority"
   - NOT: "We need you to do this"

2. **Friction Minimization**
   - One-click setup with QR code
   - Support multiple authenticators
   - Remember device for 30 days (reduce re-prompts)

3. **Error Handling**
   - Helpful error messages ("Code expired, try again")
   - Suggest backup codes if TOTP fails
   - Quick recovery with account recovery process

4. **Communication**
   - Email: "2FA enabled on your account"
   - Alert suspicious activity: "Login from New York at 3 AM"
   - Celebrate: "Your account is now 99.9% more secure"`,

      keyPoints: [
        'Mandatory MFA: Maximum security but lower adoption',
        'Recommended MFA: Good balance of security and UX',
        'Risk-based MFA: Require MFA only for suspicious logins',
        'Graduated rollout: Start optional, increase requirements over time',
        'Clear value prop and minimal friction drive adoption',
      ],
    },

    {
      id: 'section-6',
      category: 'important' as const,
      title: 'Recovery & Account Lockout Scenarios',
      icon: 'AlertTriangle',
      estimatedTime: '5 min',
      content: `MFA creates new challenges: What happens when users lose their authenticator? How do they recover?

**Common MFA Lockout Scenarios:**

1. **Lost Phone**
   - User factory-resets old phone
   - Installs authenticator on new phone
   - Problem: Secret not synced (not backed up to cloud)
   - Solution: Backup codes

2. **Authenticator App Crashes**
   - App was uninstalled by accident
   - Cloud backup didn't restore authenticator data
   - Problem: User can't generate codes
   - Solution: Backup codes

3. **Wrong Time Zone**
   - User travels internationally
   - Device clock drifts significantly (> 1 minute)
   - Problem: TOTP codes don't match
   - Solution: Sync device time, use backup codes

4. **Lost Backup Codes**
   - User lost the PDF/text file with codes
   - Phone is broken AND backup codes are gone
   - Problem: User is completely locked out
   - Solution: Account recovery process

**Account Recovery Process (Without MFA):**

**Option 1: Email Recovery**
1. User clicks: "Can't access your account?"
2. User enters: Email address
3. Server sends: "Click here to verify you own this email"
4. User clicks link (proves email access)
5. User resets password OR re-enables 2FA
6. Problem: Email = single point of failure
7. Problem: Attacker with email access can take over

**Option 2: Multi-Factor Recovery**
1. User clicks: "Can't access your account?"
2. System asks: Email address
3. System asks: Last 4 digits of phone number (partial verification)
4. System asks: Security questions (what was your first pet?)
5. After all checks: User can reset password
6. Benefit: Requires multiple proofs, not just email
7. Problem: Security questions can be guessed

**Option 3: Support Ticket Recovery**
1. User calls support: "I lost my 2FA device"
2. Support verifies: Account ownership via security questions + email
3. Support disables: Old MFA setup
4. Support sends: Account recovery link
5. User re-enables: New MFA setup
6. Benefit: Human verification catches social engineering
7. Problem: Slow (support hours), requires staff training

**Option 4: Hardware Backup Key**
1. During 2FA setup: Register backup hardware key (USB stick)
2. If phone is lost: Plug in backup key to website
3. Key proves: User still has something you registered
4. User can: Re-enable 2FA on new device
5. Benefit: Cryptographic proof, very secure
6. Problem: Users lose backup keys too

**Best Practice Approach:**

Combine multiple recovery methods:
- Primary: Backup codes
- Secondary: Email verification (assumes email is secure)
- Tertiary: Security questions (for extra verification)
- Final: Support ticket (human verification)

**Implementation:**

\`\`\`javascript
// Recovery flow
async function accountRecovery(email) {
  // Step 1: Verify email ownership
  const verificationToken = generateToken();
  await sendEmail(email, verificationToken);
  // User clicks email link

  // Step 2: Ask security questions
  const answers = await askSecurityQuestions(email);
  if (!verifyAnswers(answers)) {
    // Mismatch = possible attacker
    return showError('Incorrect security answers');
  }

  // Step 3: Allow recovery
  const recoveryToken = generateToken();
  return {
    recoveryLink: \`/recovery/reset-2fa?token=\${recoveryToken}\`,
    message: 'Click the link below to reset 2FA',
  };
}
\`\`\``,

      keyPoints: [
        'Common lockouts: Lost phone, app crash, time drift, lost backup codes',
        'Email recovery alone is insufficient (email = single point of failure)',
        'Multi-factor recovery: Email + security questions + support',
        'Backup codes are critical for account recovery',
        'Support ticket recovery: Most secure but slowest option',
      ],
    },

    // ============================================
    // ADVANCED KNOWLEDGE (20 minutes)
    // ============================================
    {
      id: 'section-7',
      category: 'advanced' as const,
      title: 'Adaptive MFA & Risk-Based Authentication',
      icon: 'Brain',
      estimatedTime: '7 min',
      content: `Modern authentication systems don't demand MFA for every login - they intelligently adapt based on risk.

**Risk Scoring Model:**

Each login is scored on multiple factors:
\`\`\`
Risk Score = (Device Risk × 0.4) +
             (Location Risk × 0.3) +
             (Time Risk × 0.2) +
             (Behavior Risk × 0.1)

Risk Threshold = 0.5 (MFA required if > 0.5)
\`\`\`

**1. Device Risk (40% weight)**
\`\`\`
Low Risk (0.0):
- Device has logged in > 50 times from this IP
- Device has consistent login pattern
- Device has valid SSL certificate verification

Medium Risk (0.5):
- First time logging in from this device
- Device is mobile (more likely to be shared/stolen)
- Device age > 5 years (outdated security patches)

High Risk (1.0):
- Device flagged for malware
- Device certificate chain broken
- Device location impossible (teleportation)
\`\`\`

**2. Location Risk (30% weight)**
\`\`\`
Low Risk (0.0):
- Login from home IP (registered with account)
- Within expected geographic region
- Consistent location history

Medium Risk (0.5):
- First time from this country
- Location > 500 miles from last login

High Risk (1.0):
- Impossible travel (New York to Tokyo in 2 hours)
- Blacklisted IP (VPN, proxy, TOR)
- Login from high-risk country
\`\`\`

**3. Time Risk (20% weight)**
\`\`\`
Low Risk (0.0):
- Login during normal hours (9 AM - 5 PM)
- Weekday login for office worker
- Expected recurring time pattern

Medium Risk (0.5):
- Off-hours login (3 AM)
- Unusual day (weekend for office worker)

High Risk (1.0):
- Multiple login attempts in 5 minutes
- Suspicious succession (3 countries in 10 minutes)
\`\`\`

**4. Behavioral Risk (10% weight)**
\`\`\`
Low Risk (0.0):
- Matches user's ML model (normal behavior)
- Normal page navigation
- Expected resource access

Medium Risk (0.5):
- Accessing different resources than usual
- Unusual navigation pattern

High Risk (1.0):
- Accessing admin panels (if not admin)
- Bulk data download
- Accessing sensitive customer data
\`\`\`

**Adaptive MFA Decisions:**

| Risk Score | Action | User Experience |
|------------|--------|-----------------|
| < 0.2 | Allow login | No friction |
| 0.2 - 0.4 | Soft prompt | "Would you like to enable 2FA?" |
| 0.4 - 0.6 | Require MFA | "Please verify with 2FA code" |
| 0.6 - 0.8 | Step-up auth | Multiple MFA factors |
| > 0.8 | Block + alert | "Login blocked. Click email to unblock" |

**Implementation Example:**

\`\`\`javascript
async function evaluateLoginRisk(user, loginAttempt) {
  // Calculate risk scores for each dimension
  const deviceRisk = await calculateDeviceRisk(loginAttempt.deviceId);
  const locationRisk = await calculateLocationRisk(loginAttempt.ipAddress);
  const timeRisk = await calculateTimeRisk(user, loginAttempt.timestamp);
  const behaviorRisk = await calculateBehaviorRisk(user, loginAttempt);

  // Weighted sum
  const totalRisk =
    (deviceRisk * 0.4) +
    (locationRisk * 0.3) +
    (timeRisk * 0.2) +
    (behaviorRisk * 0.1);

  // Decision logic
  if (totalRisk < 0.4) {
    // Low risk - allow immediate access
    return { allowed: true, requireMfa: false };
  } else if (totalRisk < 0.6) {
    // Medium risk - require MFA
    return { allowed: false, requireMfa: true, reason: 'unusual_login' };
  } else {
    // High risk - block and require verification
    return {
      allowed: false,
      requireMfa: true,
      requireEmail: true,
      reason: 'suspicious_activity_detected'
    };
  }
}
\`\`\`

**Advantages:**
- ✅ Balances security and UX
- ✅ Catches actual attacks while allowing legitimate users
- ✅ ML can improve over time (learn user patterns)

**Disadvantages:**
- ❌ Complex to implement correctly
- ❌ Can be fooled by sophisticated attacks
- ❌ Privacy concerns (behavioral tracking)`,

      keyPoints: [
        'Risk scoring evaluates: device, location, time, behavior',
        'High-risk logins require MFA; low-risk logins bypass it',
        'Weighing factors: Device 40%, Location 30%, Time 20%, Behavior 10%',
        'ML models learn user patterns for better accuracy',
        'Balances security (catch attackers) with UX (minimize friction)',
      ],
    },

    {
      id: 'section-8',
      category: 'advanced' as const,
      title: 'MFA Attack Vectors & Defenses',
      icon: 'Shield',
      estimatedTime: '7 min',
      content: `Even with MFA enabled, attackers have sophisticated techniques. Here are the most common attack vectors and defenses.

**Attack Vector 1: SIM Swapping (Targeted SMS-Based 2FA)**

How it works:
\`\`\`
1. Attacker calls phone carrier: "I lost my SIM card"
2. Attacker socially engineers: "My new phone is X123" (correct last 4 SSN)
3. Carrier transfers phone number to attacker's SIM
4. Attacker receives SMS 2FA codes
5. Attacker logs into account and changes password
6. Real user is locked out
\`\`\`

Defense (Don't Use SMS for MFA!):
- Never use SMS for sensitive accounts
- SMS 2FA is vulnerable to SIM swapping
- Carrier employees can be socially engineered
- Use authenticator apps (TOTP) instead
- Use hardware keys (FIDO2) instead
- SMS only for low-risk accounts (e-commerce)

**Attack Vector 2: TOTP Camera Phishing**

How it works:
\`\`\`
1. User receives phishing email: "Login to confirm account"
2. Fake website looks identical to real site
3. User enters username + password
4. Fake site prompts: "Enter your 6-digit code"
5. Attacker requests: Share screen or take photo
6. User shares screen showing 6-digit code
7. Attacker uses code immediately (codes expire in 30 sec)
8. Real website: Attacker is logged in
\`\`\`

Defense (FIDO2 is Phishing-Resistant):
- Phishing emails can fake TOTP prompts
- User might share screen with code
- 30 second window = quick exploitation
- Use hardware keys (FIDO2)
- Hardware key verifies domain (can't phish)
- Key won't sign for fake domain
- Code must be entered into CORRECT website

**Attack Vector 3: TOTP App Compromise**

How it works:
\`\`\`
1. Attacker creates fake "Google Authenticator" app
2. User downloads from less-trusted app store
3. App steals authenticator secrets
4. Attacker generates valid TOTP codes
5. Attacker logs in with password + codes
\`\`\`

Defense (Use Trusted Apps & Backup Methods):
- Recommend official apps only (Google, Microsoft, Authy)
- Use backup codes as recovery method
- Monitor for unauthorized logins
- Require device verification for new logins

**Attack Vector 4: Man-in-the-Middle (Intercepting TOTP)**

How it works:
\`\`\`
1. User on public WiFi at airport
2. Attacker running packet sniffer (aircrack-ng)
3. User logs in: Attacker captures password
4. User enters TOTP code: Attacker captures code
5. Attacker has both password + TOTP code
6. Attacker logs in successfully
\`\`\`

Defense (Always Use HTTPS + Backup Codes):
- Enforce HTTPS everywhere (encryption)
- Use HSTS headers (prevent downgrade attacks)
- Require device verification alongside TOTP
- Alert user: "New login from [location]"
- Rate limit: Max 5 failed TOTP attempts

**Attack Vector 5: Recovery Code Phishing**

How it works:
\`\`\`
1. User receives support email: "Verify your backup codes"
2. Email links to fake form
3. User pastes backup codes (security question: "What did you store them in?")
4. Attacker extracts codes and TOTP secret
5. Complete account takeover
\`\`\`

Defense (Never Ask for Codes):
- Never ask user to share backup codes
- Never ask via email or chat
- Never verify codes through forms
- Backup codes stored only locally (user's device)
- Server never requests codes
- Codes only used by user directly`,

      keyPoints: [
        'SIM swapping: Never use SMS 2FA (use TOTP/FIDO2 instead)',
        'Phishing: FIDO2 is resistant (verifies domain)',
        'App compromise: Recommend official authenticator apps',
        'MITM: Enforce HTTPS + device verification',
        'Recovery code phishing: Never ask users to share codes',
      ],
    },

    {
      id: 'section-9',
      category: 'advanced' as const,
      title: 'MFA Best Practices & Production Checklist',
      icon: 'CheckCircle2',
      estimatedTime: '6 min',
      content: `Production-grade MFA implementation checklist.

**During MFA Setup:**
- ✅ Rate limit setup attempts (max 5 per hour)
- ✅ Require email verification before activation
- ✅ Display QR code + manual entry fallback
- ✅ Force user to save backup codes before confirmation
- ✅ Test TOTP code immediately to catch setup issues
- ✅ Log MFA setup events (audit trail)

**During MFA Verification:**
- ✅ Enforce HTTPS (encrypt code transmission)
- ✅ Rate limit verification attempts (max 5 per 15 min)
- ✅ Set reasonable code window (±1-2 time steps)
- ✅ Reject expired codes with helpful message
- ✅ Accept backup codes as secondary factor
- ✅ Log every successful and failed verification

**Secret Storage:**
- ✅ Hash/encrypt secrets in database (never plaintext)
- ✅ Use strong encryption (AES-256 GCM)
- ✅ Key derivation: PBKDF2 or Argon2
- ✅ Different encryption key per user (split keys)
- ✅ Never log secrets in application logs
- ✅ Implement secure key rotation

**Backup Code Security:**
- ✅ Hash backup codes before storage (bcrypt)
- ✅ Single-use enforcement (mark used after consumption)
- ✅ Track usage attempts (detect brute-force)
- ✅ Limit per-session: 1 backup code per recovery attempt
- ✅ User must verify email before using backup codes
- ✅ Notify user when backup codes are used

**Account Recovery:**
- ✅ Multi-step verification (email + security questions)
- ✅ Rate limit recovery attempts (max 3 per day)
- ✅ Time-limited recovery tokens (15 minutes)
- ✅ Require device verification for account changes
- ✅ Alert user of recovery attempt (prevent takeover)
- ✅ Require password reset after recovery

**Monitoring & Alerts:**
- ✅ Alert on multiple failed TOTP attempts
- ✅ Alert on backup code usage (unexpected)
- ✅ Alert on MFA setup from new device
- ✅ Alert on MFA deactivation
- ✅ Alert on account recovery attempts
- ✅ Monitor for brute-force patterns

**User Communication:**
- ✅ Clear setup instructions with screenshots
- ✅ Security warnings: Don't share codes
- ✅ Recovery guides: Backup codes are essential
- ✅ Proactive notifications: "2FA enabled on your account"
- ✅ Support resources: FAQ + video tutorials
- ✅ Emergency contact: How to reach support if locked out

**Advanced Security:**
- ✅ Implement risk-based MFA (not every login)
- ✅ Support multiple MFA methods (TOTP, FIDO2, SMS)
- ✅ Trusted device feature (skip MFA for 30 days)
- ✅ Session binding (MFA to specific session only)
- ✅ Geolocation verification (impossible travel)
- ✅ ML-based anomaly detection

**Compliance & Standards:**
- ✅ Follow NIST guidelines (NIST SP 800-63B)
- ✅ FIDO2 certification for hardware keys
- ✅ RFC 6238 compliance (TOTP)
- ✅ GDPR compliance (user consent for tracking)
- ✅ PCI-DSS compliance (if handling payments)
- ✅ SOC 2 audit (security controls)`,

      keyPoints: [
        'Setup: Rate limit, require email verify, test immediately',
        'Verification: Rate limit, HTTPS, ±1-2 time steps tolerance',
        'Storage: Hash/encrypt secrets, never plaintext',
        'Backup codes: Hash before storage, single-use, track usage',
        'Recovery: Multi-step verification, time-limited tokens, alerts',
      ],
    },
  ],

  securityScenarios: [
    {
      id: 'scenario-1',
      title: 'TOTP Code Brute Force Attack',
      threatLevel: 'MEDIUM' as const,
      attack: 'Attacker has password but not the authenticator. Attempts to brute-force 6-digit TOTP code to bypass 2FA.',
      exploitation: 'Without rate limiting, attacker can try 1 million codes in seconds. Even with 30-second window, 1000 attempts might yield success.',
      defense: 'Implement aggressive rate limiting: Max 5 failed attempts per 15 minutes. Lock account after 3 failed sessions. Require manual intervention for recovery.',
      vulnerableCode: {
        language: 'javascript' as const,
        label: 'Vulnerable Code',
        code: `// ❌ VULNERABLE: No rate limiting on TOTP verification
app.post('/api/auth/verify-totp', async (req, res) => {
  const { userId, totpCode } = req.body;

  const user = await db.users.findById(userId);
  const mfaSecret = await db.mfaSecrets.findOne({ userId });

  // ❌ NO RATE LIMITING - Attacker can brute force!
  const isValid = speakeasy.totp.verify({
    secret: mfaSecret.secret,
    token: totpCode,
    window: 2,
  });

  if (!isValid) {
    // ❌ NO TRACKING - Unlimited attempts
    return res.status(401).json({ error: 'Invalid TOTP code' });
  }

  // Grant access immediately
  res.json({ success: true, sessionId: generateSessionId() });
});`,
      },
      secureCode: {
        language: 'javascript' as const,
        label: 'Secure Code',
        code: `// ✅ SECURE: Rate limiting with exponential backoff
app.post('/api/auth/verify-totp', async (req, res) => {
  const { userId, totpCode } = req.body;

  const user = await db.users.findById(userId);
  const mfaSecret = await db.mfaSecrets.findOne({ userId });

  // ✅ CRITICAL: Check rate limit before verification
  const attempts = await db.totpAttempts.find({
    userId,
    timestamp: { $gte: new Date(Date.now() - 15 * 60 * 1000) }, // Last 15 minutes
  });

  const failedAttempts = attempts.filter(a => !a.success).length;

  // ✅ Rate limit: Max 5 failed attempts per 15 minutes
  if (failedAttempts >= 5) {
    console.warn(\`TOTP rate limit exceeded for user \${userId}\`);
    return res.status(429).json({
      error: 'Too many failed attempts',
      message: 'Try again in 15 minutes or use backup code',
      retryAfter: 900, // 15 minutes in seconds
    });
  }

  // Verify TOTP
  const isValid = speakeasy.totp.verify({
    secret: mfaSecret.secret,
    token: totpCode,
    window: 2,
  });

  // ✅ Log attempt for rate limiting
  await db.totpAttempts.create({
    userId,
    success: isValid,
    timestamp: new Date(),
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  });

  if (!isValid) {
    // ✅ Alert user of failed attempt
    await sendEmail(user.email, {
      subject: 'Failed login attempt on your account',
      body: 'Someone tried to login but provided wrong 2FA code. If this wasnt you, change your password.',
    });

    return res.status(401).json({
      error: 'Invalid TOTP code',
      attemptsRemaining: 5 - failedAttempts - 1,
    });
  }

  // ✅ Clear rate limit counter on success
  await db.totpAttempts.deleteMany({ userId, success: false });

  res.json({ success: true, sessionId: generateSessionId() });
});

// ✅ Cleanup job: Remove old attempt logs (after 24 hours)
async function cleanupOldAttempts() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  await db.totpAttempts.deleteMany({ timestamp: { $lt: oneDayAgo } });
}
setInterval(cleanupOldAttempts, 60 * 60 * 1000); // Run hourly`,
      },
    },
    {
      id: 'scenario-2',
      title: 'Backup Code Reuse Attack',
      threatLevel: 'HIGH' as const,
      attack: 'Attacker intercepts backup code and reuses it multiple times to bypass 2FA on subsequent login attempts.',
      exploitation: 'If backup codes aren\'t marked as consumed, attacker can use same code infinite times. Enables brute-force attacks on backup codes.',
      defense: 'Enforce single-use: Mark code as consumed immediately after successful use. Track all backup code usage attempts. Alert user of unexpected usage.',
      vulnerableCode: {
        language: 'javascript' as const,
        label: 'Vulnerable Code',
        code: `// ❌ VULNERABLE: Backup codes reusable multiple times
app.post('/api/auth/verify-backup-code', async (req, res) => {
  const { userId, backupCode } = req.body;

  const mfaSecret = await db.mfaSecrets.findOne({ userId });
  const normalizedCode = backupCode.toUpperCase().replace(/\\s/g, '');

  // ❌ NO SINGLE-USE ENFORCEMENT
  // Check if code matches ANY stored backup code
  const isValid = mfaSecret.backupCodes.includes(normalizedCode);

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid backup code' });
  }

  // ❌ VULNERABILITY: Code is NOT deleted or marked as used
  // Attacker can use same code again and again!

  // Grant access
  res.json({ success: true, sessionId: generateSessionId() });
});

// Attacker logs in 10 times with same backup code - all succeed!`,
      },
      secureCode: {
        language: 'javascript' as const,
        label: 'Secure Code',
        code: `// ✅ SECURE: Single-use backup codes with tracking
app.post('/api/auth/verify-backup-code', async (req, res) => {
  const { userId, backupCode } = req.body;

  const mfaSecret = await db.mfaSecrets.findOne({ userId });
  const normalizedCode = backupCode.toUpperCase().replace(/\\s/g, '');

  // ✅ Find code index
  const codeIndex = mfaSecret.backupCodes.findIndex(c => c === normalizedCode);

  if (codeIndex === -1) {
    return res.status(401).json({ error: 'Invalid backup code' });
  }

  // ✅ CRITICAL: Check if code was already used
  if (mfaSecret.usedBackupCodes.includes(codeIndex)) {
    console.error(\`REPLAY ATTACK: User \${userId} tried to reuse backup code\`);

    // Alert user of suspicious activity
    await sendEmail(await db.users.findById(userId).email, {
      subject: 'SECURITY ALERT: Suspicious activity detected',
      body: 'Someone tried to login with an old backup code. Your account may be compromised. Change your password immediately.',
      urgency: 'high',
    });

    return res.status(401).json({
      error: 'Invalid backup code',
      alert: 'This code has already been used. Check your email.',
    });
  }

  // ✅ Mark code as used IMMEDIATELY
  mfaSecret.usedBackupCodes.push(codeIndex);
  await db.mfaSecrets.update(userId, {
    usedBackupCodes: mfaSecret.usedBackupCodes,
  });

  // ✅ Log backup code usage
  await db.backupCodeUsage.create({
    userId,
    codeIndex,
    timestamp: new Date(),
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  });

  // ✅ Warn user
  await sendEmail(await db.users.findById(userId).email, {
    subject: 'Backup code used to login',
    body: 'A backup code was used to login to your account. If this wasnt you, change your password and contact support.',
  });

  res.json({ success: true, sessionId: generateSessionId() });
});`,
      },
    },
    {
      id: 'scenario-3',
      title: 'MFA Bypass via Recovery Account Takeover',
      threatLevel: 'HIGH' as const,
      attack: 'Attacker compromises email account, then uses email recovery to reset 2FA and take over main account.',
      exploitation: 'If recovery process only requires email access, attacker with compromised email can: 1) Reset password, 2) Disable MFA, 3) Take over account completely.',
      defense: 'Multi-factor recovery: Email + security questions + device verification. Require password reset after recovery. Alert user of recovery attempt.',
      vulnerableCode: {
        language: 'javascript' as const,
        label: 'Vulnerable Code',
        code: `// ❌ VULNERABLE: Recovery only requires email access
app.post('/api/auth/recovery', async (req, res) => {
  const { email } = req.body;

  const user = await db.users.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  // ❌ VULNERABILITY: Only requiring email verification
  // Send recovery link to email
  const recoveryToken = generateToken();
  await db.recoveryTokens.create({ email, token: recoveryToken });

  const recoveryLink = \`https://app.com/recovery?token=\${recoveryToken}\`;
  await sendEmail(email, {
    body: \`Click here to reset your 2FA: <a href="\${recoveryLink}">Reset 2FA</a>\`,
  });

  res.json({ success: true, message: 'Recovery link sent to email' });
});

// User clicks recovery link in email
app.post('/api/auth/reset-2fa', async (req, res) => {
  const { token } = req.body;

  const recovery = await db.recoveryTokens.findOne({ token });
  const user = await db.users.findOne({ email: recovery.email });

  // ❌ NO ADDITIONAL VERIFICATION
  // Just clicking email link = complete 2FA reset!

  // Disable MFA
  await db.mfaSecrets.update(user.id, { enabled: false });

  // Attacker is now logged in without 2FA!
  res.json({ success: true, sessionId: generateSessionId() });
});

// Attack scenario:
// 1. Attacker compromises email via phishing
// 2. Attacker clicks recovery link
// 3. Email verification = PASSED (attacker has email)
// 4. MFA disabled = COMPLETE TAKEOVER`,
      },
      secureCode: {
        language: 'javascript' as const,
        label: 'Secure Code',
        code: `// ✅ SECURE: Multi-factor recovery with multiple verifications
app.post('/api/auth/recovery', async (req, res) => {
  const { email } = req.body;

  const user = await db.users.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }

  // ✅ Step 1: Send verification email
  const emailToken = generateToken();
  await db.recoveryTokens.create({
    userId: user.id,
    type: 'email_verification',
    token: emailToken,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 min
  });

  const verifyLink = \`https://app.com/recovery/verify?token=\${emailToken}\`;
  await sendEmail(email, {
    subject: 'Verify account recovery request',
    body: \`Click here to verify: <a href="\${verifyLink}">Verify Email</a>\`,
  });

  res.json({
    success: true,
    message: 'Verification link sent to email',
    nextStep: 'Check your email',
  });
});

// Step 2: Verify email ownership
app.post('/api/auth/recovery/verify', async (req, res) => {
  const { token } = req.body;

  const recovery = await db.recoveryTokens.findOne({ token, type: 'email_verification' });
  const user = await db.users.findById(recovery.userId);

  // ✅ Step 2: Ask security questions
  const questions = [
    'What was the name of your first pet?',
    'What city were you born in?',
    'What is your mother\\'s maiden name?',
  ];

  res.json({
    success: true,
    message: 'Email verified. Answer security questions next.',
    questions: questions,
    recoverySessionId: generateToken(), // Temporary session for recovery
  });
});

// Step 3: Verify security answers
app.post('/api/auth/recovery/verify-questions', async (req, res) => {
  const { recoverySessionId, answers } = req.body;

  const recovery = await db.recoverySession.findOne({ sessionId: recoverySessionId });
  const user = await db.users.findById(recovery.userId);

  // ✅ Verify answers
  const storedAnswers = await db.userSecurityAnswers.findOne({ userId: user.id });
  const correctAnswers = answers.filter((ans, idx) =>
    hashAnswer(ans) === storedAnswers.answersHashed[idx]
  );

  // ✅ Require at least 2 of 3 correct
  if (correctAnswers.length < 2) {
    console.warn(\`Recovery failed for user \${user.id}: Wrong security answers\`);
    return res.status(401).json({ error: 'Incorrect answers' });
  }

  // ✅ Step 3: Require device verification
  const deviceToken = generateToken();
  await sendEmail(user.email, {
    subject: 'Final verification: Approve device',
    body: \`Click here to approve recovery: <a href="https://app.com/recovery/approve?token=\${deviceToken}">Approve</a>\`,
  });

  res.json({
    success: true,
    message: 'Security answers verified. Check email for final approval.',
  });
});

// Step 4: Final approval
app.post('/api/auth/recovery/approve', async (req, res) => {
  const { token } = req.body;

  const recovery = await db.recoveryTokens.findOne({ token, type: 'device_approval' });
  const user = await db.users.findById(recovery.userId);

  // ✅ After ALL verifications pass: Reset 2FA
  await db.mfaSecrets.update(user.id, { enabled: false });

  // ✅ Force password reset
  const passwordResetToken = generateToken();
  await db.passwordReset.create({ userId: user.id, token: passwordResetToken });

  // ✅ Alert user
  await sendEmail(user.email, {
    subject: 'Account recovered - Password reset required',
    body: \`Your 2FA has been reset. Please set a new password: <a href="https://app.com/reset-password?token=\${passwordResetToken}">Reset Password</a>\`,
    urgency: 'high',
  });

  res.json({
    success: true,
    message: 'Account recovered. Please check email to reset password.'
  });
});`,
      },
    },
  ],

  challenges: [
    {
      id: 'challenge-1',
      title: 'Implement TOTP 2FA System',
      difficulty: 'Easy' as const,
      points: 100,
      description: 'Build complete TOTP 2FA with QR code generation, verification with time window, and backup codes for account recovery.',
    },
    {
      id: 'challenge-2',
      title: 'Build Adaptive MFA System',
      difficulty: 'Medium' as const,
      points: 200,
      description: 'Implement risk-based authentication that calculates device, location, time, and behavior risk scores. Require MFA only for suspicious logins.',
    },
    {
      id: 'challenge-3',
      title: 'Secure Account Recovery Flow',
      difficulty: 'Hard' as const,
      points: 300,
      description: 'Design complete account recovery process: Email + security questions + device approval. Prevent takeover even if email is compromised.',
    },
  ],

  achievements: {
    protocolInitiate: {
      title: 'Protocol Initiate',
      description: 'Complete all Essential sections',
      icon: 'Lock',
      color: 'text-green-400',
    },
    securityOperative: {
      title: 'Security Operative',
      description: 'Complete all Essential + Important sections',
      icon: 'Shield',
      color: 'text-blue-400',
    },
    eliteGuardian: {
      title: 'Elite Guardian',
      description: 'Complete all sections + 2 challenges',
      icon: 'ShieldAlert',
      color: 'text-purple-400',
    },
    masterArchitect: {
      title: 'Master Architect',
      description: 'Complete everything + all challenges',
      icon: 'Crown',
      color: 'text-yellow-400',
    },
  },

  crossReferences: {
    session: {
      title: 'Session-Based Authentication',
      comparison: 'Session auth can be combined with MFA - user authenticates with session + TOTP.',
    },
    jwt: {
      title: 'JWT Authentication',
      comparison: 'JWT tokens can require MFA verification - tokens marked as "mfaVerified" in claims.',
    },
    oauth: {
      title: 'OAuth 2.0',
      comparison: 'OAuth providers can require MFA - users authenticate to provider with 2FA before delegating access.',
    },
  },
};

// Export code examples for components
export const codeExamples = {
  totpGeneration: mfaAuthContent.sections[1].codeExamples,
};

export const securityScenarios = mfaAuthContent.securityScenarios;
export const challenges = mfaAuthContent.challenges;
