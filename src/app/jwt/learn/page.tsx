/**
 * JWT (JSON Web Token) Learning Page
 * Comprehensive guide to stateless authentication
 * Reference: SPECIFICATION Section 4.2, RFC 7519
 */

'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ProgressSidebar } from '@/components/learning/ProgressSidebar';
import { SectionCard } from '@/components/learning/SectionCard';
import { SecurityScenario } from '@/components/learning/SecurityScenario';
import { AchievementTracker } from '@/components/learning/AchievementTracker';
import { ChallengeCard } from '@/components/learning/ChallengeCard';
import { StoryHeader } from '@/components/learning/StoryHeader';
import { jwtAuthContent } from '@/lib/content/jwt-auth';
import { Section, ProgressData } from '@/lib/types';
import { AlertCircle, ArrowRight, CheckCircle2, Clock, Database, FileText, Key, Lock, RefreshCw, Shield, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function JWTLearnPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tokenData, setTokenData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<ProgressData>({
    completedSections: [],
    percentage: 0,
    level: 'Protocol Initiate',
    achievements: [],
  });

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('jwt-auth-progress');
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load progress:', e);
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('jwt-auth-progress', JSON.stringify(progress));
  }, [progress]);

  const sections: Section[] = [
    { id: 'section-1', title: 'The Digital Passport: What is JWT?', icon: 'FileText', category: 'essential', estimatedTime: 3 },
    { id: 'section-2', title: 'Token Anatomy: The Three-Part Structure', icon: 'Package', category: 'essential', estimatedTime: 4 },
    { id: 'section-3', title: 'The Authentication Flow', icon: 'Workflow', category: 'essential', estimatedTime: 3 },
    { id: 'section-4', title: 'Refresh Token Pattern: Staying Logged In', icon: 'RotateCw', category: 'important', estimatedTime: 5 },
    { id: 'section-5', title: 'Signing Algorithms: HS256 vs RS256', icon: 'Lock', category: 'important', estimatedTime: 5 },
    { id: 'section-6', title: 'JWT vs Session: The Ultimate Showdown', icon: 'Swords', category: 'important', estimatedTime: 5 },
    { id: 'section-7', title: 'Security Vulnerabilities & Attacks', icon: 'ShieldAlert', category: 'advanced', estimatedTime: 8 },
    { id: 'section-8', title: 'Claims Management & Best Practices', icon: 'FileText', category: 'advanced', estimatedTime: 6 },
    { id: 'section-9', title: 'Production Deployment Checklist', icon: 'Rocket', category: 'advanced', estimatedTime: 6 },
  ];

  const handleSectionComplete = (sectionId: string) => {
    setProgress(prev => {
      const isCompleted = prev.completedSections.includes(sectionId);
      const newCompleted = isCompleted
        ? prev.completedSections.filter(id => id !== sectionId)
        : [...prev.completedSections, sectionId];

      const percentage = Math.floor((newCompleted.length / sections.length) * 100);

      let level: ProgressData['level'] = 'Protocol Initiate';
      if (percentage >= 91) level = 'Master Architect';
      else if (percentage >= 61) level = 'Elite Guardian';
      else if (percentage >= 31) level = 'Security Operative';

      return {
        ...prev,
        completedSections: newCompleted,
        percentage,
        level,
      };
    });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/jwt-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Decode JWT to show structure (Base64 decode - not secure validation!)
        const [header, payload, signature] = data.token.split('.');
        const decodedHeader = JSON.parse(atob(header));
        const decodedPayload = JSON.parse(atob(payload));

        setTokenData({
          token: data.token,
          header: decodedHeader,
          payload: decodedPayload,
          signature: signature,
          username: decodedPayload.sub || username,
          expiresAt: decodedPayload.exp ? new Date(decodedPayload.exp * 1000).toISOString() : null,
          issuedAt: decodedPayload.iat ? new Date(decodedPayload.iat * 1000).toISOString() : new Date().toISOString(),
          status: 'Active',
        });
        setIsLoggedIn(true);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setTokenData(null);
    setError('');
  };

  // Get content sections
  const securityScenarios = jwtAuthContent.securityScenarios;
  const challenges = jwtAuthContent.challenges;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-green-950 to-gray-950">
      <StoryHeader
        title="DIGITAL SIGNATURE PROTOCOL"
        narrative={
          <>
            <span className="text-neon-400 font-bold">CYBERPUNK 2084:</span> {jwtAuthContent.storyHook.narrative}
          </>
        }
        icon={FileText}
        clearanceLevel="Advanced Access"
        status="ACTIVE"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[320px_1fr] gap-8">
          {/* Sticky Sidebar */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <ProgressSidebar
              sections={sections}
              progress={progress}
              onSectionClick={scrollToSection}
            />
          </aside>

          {/* Main Content */}
          <main className="space-y-8">
            {/* Section 1: What is JWT */}
            <SectionCard
              {...sections[0]}
              isCompleted={progress.completedSections.includes(sections[0].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg">
                JSON Web Token (JWT) is a <span className="text-neon-400 font-semibold">compact, URL-safe</span> means of
                representing claims to be transferred between two parties. Unlike sessions, JWTs are <span className="text-cyan-400">stateless</span> -
                all user information is encoded in the token itself.
              </p>

              <div className="bg-neon-950/30 border-2 border-neon-500/30 rounded-lg p-5 my-4">
                <h4 className="text-neon-300 font-bold mb-3 flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  The Digital Passport
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-neon-400 font-bold">1.</span>
                    Server signs token with secret key (or private key)
                  </li>
                  <li className="flex gap-3">
                    <span className="text-neon-400 font-bold">2.</span>
                    Token contains <span className="text-cyan-300 font-mono">user data + expiration</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-neon-400 font-bold">3.</span>
                    Client stores token (memory, localStorage, or httpOnly cookie)
                  </li>
                  <li className="flex gap-3">
                    <span className="text-neon-400 font-bold">4.</span>
                    Client sends token in <span className="text-yellow-300">Authorization header</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-neon-400 font-bold">5.</span>
                    Server validates signature - no database lookup needed
                  </li>
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-950/50 border border-cyan-500/30 rounded-lg p-4">
                  <h5 className="text-cyan-400 font-bold mb-2">Stateless</h5>
                  <p className="text-sm text-gray-400">
                    Token contains all data. Server just verifies signature.
                  </p>
                </div>
                <div className="bg-gray-950/50 border border-purple-500/30 rounded-lg p-4">
                  <h5 className="text-purple-400 font-bold mb-2">Portable</h5>
                  <p className="text-sm text-gray-400">
                    Any server with the secret key can validate the token.
                  </p>
                </div>
              </div>
            </SectionCard>

            {/* Section 2: Token Anatomy */}
            <SectionCard
              {...sections[1]}
              isCompleted={progress.completedSections.includes(sections[1].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                Every JWT has exactly <span className="text-neon-400 font-bold">three parts</span> separated by dots (.).
                Each part serves a specific purpose in the authentication dance.
              </p>

              <div className="space-y-3">
                {[
                  { num: 1, label: 'Header', desc: 'Algorithm and token type', code: '{ "alg": "HS256", "typ": "JWT" }', color: 'red' },
                  { num: 2, label: 'Payload', desc: 'User data, claims, expiration', code: '{ "sub": "12345", "exp": 1735603200 }', color: 'blue' },
                  { num: 3, label: 'Signature', desc: 'HMAC(header.payload, secret)', code: 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', color: 'purple' },
                ].map(step => (
                  <div key={step.num} className={`flex gap-4 p-3 rounded-lg bg-gray-950/50 border border-${step.color}-500/20 hover:border-${step.color}-500/40 transition-all`}>
                    <div className={`flex-shrink-0 w-8 h-8 bg-${step.color}-500 text-white rounded-full flex items-center justify-center font-black`}>
                      {step.num}
                    </div>
                    <div className="flex-1">
                      <div className={`text-${step.color}-300 font-bold text-sm`}>{step.label}</div>
                      <div className="text-gray-400 text-xs mt-0.5">{step.desc}</div>
                      <code className="text-xs text-cyan-300 font-mono mt-1 block break-all">{step.code}</code>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 bg-red-950/30 border-2 border-red-500/50 rounded-lg p-4">
                <h5 className="text-red-300 font-bold mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Critical Security Note
                </h5>
                <p className="text-sm text-gray-300">
                  Base64 is <span className="text-red-400 font-bold">encoding, NOT encryption</span>. Anyone can decode
                  the payload and read claims. The signature prevents <span className="text-neon-400">tampering</span>, not reading.
                  Never put passwords or secrets in JWT payload!
                </p>
              </div>
            </SectionCard>

            {/* Section 3: Authentication Flow */}
            <SectionCard
              {...sections[2]}
              isCompleted={progress.completedSections.includes(sections[2].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                JWT authentication follows a different pattern than sessions. Instead of creating server-side state,
                the server issues a <span className="text-neon-400 font-bold">signed token</span> and the client stores it.
              </p>

              <div className="space-y-3">
                {[
                  { num: 1, label: 'Client → Server', desc: 'User submits credentials', code: '{ username, password }' },
                  { num: 2, label: 'Server validates', desc: 'Compares bcrypt hash against database', code: 'bcrypt.compare(password, hash)' },
                  { num: 3, label: 'Generate JWT', desc: 'Create token with user claims', code: 'jwt.sign({ sub: userId }, secret)' },
                  { num: 4, label: 'Sign token', desc: 'HMAC signature with secret key', code: 'HMACSHA256(header.payload, secret)' },
                  { num: 5, label: 'Server → Client', desc: 'Return JWT in response body', code: '{ token: "eyJhbGci..." }' },
                  { num: 6, label: 'Client stores', desc: 'Memory, sessionStorage, httpOnly cookie', code: 'Authorization: Bearer <token>' },
                  { num: 7, label: 'Client sends token', desc: 'Include in Authorization header', code: 'Authorization: Bearer eyJhbGci...' },
                  { num: 8, label: 'Server verifies', desc: 'Check signature & expiration', code: 'jwt.verify(token, secret)' },
                ].map(step => (
                  <div key={step.num} className="flex gap-4 p-3 rounded-lg bg-gray-950/50 border border-neon-500/20 hover:border-neon-500/40 transition-all">
                    <div className="flex-shrink-0 w-8 h-8 bg-neon-500 text-black rounded-full flex items-center justify-center font-black">
                      {step.num}
                    </div>
                    <div className="flex-1">
                      <div className="text-neon-300 font-bold text-sm">{step.label}</div>
                      <div className="text-gray-400 text-xs mt-0.5">{step.desc}</div>
                      <code className="text-xs text-cyan-300 font-mono mt-1 block">{step.code}</code>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 bg-cyan-950/30 border-2 border-cyan-500/50 rounded-lg p-4">
                <h5 className="text-cyan-300 font-bold mb-2">Key Insight</h5>
                <p className="text-sm text-gray-300">
                  Notice there&apos;s <span className="text-neon-400 font-bold">no database lookup</span> in steps 6-8.
                  The server just verifies the signature. This is why JWT is &quot;stateless&quot; - all authentication
                  data lives in the token itself.
                </p>
              </div>
            </SectionCard>

            {/* Section 4: Refresh Token Pattern */}
            <SectionCard
              {...sections[3]}
              isCompleted={progress.completedSections.includes(sections[3].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                Short-lived access tokens (15 minutes) are secure but annoying. <span className="text-neon-400 font-bold">Refresh tokens</span> solve
                this: long-lived tokens (7 days) that can request new access tokens without re-authentication.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-6 h-6 text-blue-400" />
                    <h4 className="text-blue-300 font-black">Access Token</h4>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lifespan:</span>
                      <span className="text-blue-300 font-bold">15 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Purpose:</span>
                      <span className="text-white">API requests</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Storage:</span>
                      <span className="text-white">Memory</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Risk if stolen:</span>
                      <span className="text-green-400">Limited window</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <RefreshCw className="w-6 h-6 text-purple-400" />
                    <h4 className="text-purple-300 font-black">Refresh Token</h4>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lifespan:</span>
                      <span className="text-purple-300 font-bold">7 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Purpose:</span>
                      <span className="text-white">Get new access</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Storage:</span>
                      <span className="text-white">httpOnly cookie</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Security:</span>
                      <span className="text-green-400">Can be revoked</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-neon-950/30 border-2 border-neon-500/30 rounded-lg p-4">
                <h5 className="text-neon-300 font-bold mb-2">The Flow</h5>
                <ol className="space-y-2 text-sm text-gray-300">
                  <li>1. Login → Receive both access token + refresh token</li>
                  <li>2. Use access token for API requests</li>
                  <li>3. Access token expires after 15 minutes</li>
                  <li>4. Send refresh token to <code className="text-cyan-300 font-mono">/refresh</code> endpoint</li>
                  <li>5. Receive new access token (and optionally new refresh token)</li>
                  <li>6. Continue using new access token</li>
                </ol>
              </div>
            </SectionCard>

            {/* Section 5: Signing Algorithms */}
            <SectionCard
              {...sections[4]}
              isCompleted={progress.completedSections.includes(sections[4].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                JWT supports multiple signing algorithms. The two most common are <span className="text-neon-400 font-bold">HS256</span> (symmetric)
                and <span className="text-cyan-400 font-bold">RS256</span> (asymmetric).
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-neon-950/30 to-green-950/30 border-2 border-neon-500/30 rounded-lg p-5">
                  <h4 className="text-neon-300 font-black text-lg mb-3">HS256 (Symmetric)</h4>
                  <p className="text-gray-300 mb-3 text-sm">
                    Same secret key used for <span className="text-neon-400">signing AND verification</span>
                  </p>
                  <div className="space-y-1 text-xs">
                    <div className="text-green-400">+ Simpler, faster, less overhead</div>
                    <div className="text-green-400">+ Perfect for single application</div>
                    <div className="text-red-400">- Anyone who can verify can create tokens</div>
                    <div className="text-red-400">- Secret must be shared across services</div>
                  </div>
                  <Badge className="mt-3 bg-neon-500/20 text-neon-300 border border-neon-500/50 text-xs">
                    Use case: Monolithic apps
                  </Badge>
                </div>

                <div className="bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border-2 border-cyan-500/30 rounded-lg p-5">
                  <h4 className="text-cyan-300 font-black text-lg mb-3">RS256 (Asymmetric)</h4>
                  <p className="text-gray-300 mb-3 text-sm">
                    Private key for signing, <span className="text-cyan-400">public key for verification</span>
                  </p>
                  <div className="space-y-1 text-xs">
                    <div className="text-green-400">+ Only auth server needs private key</div>
                    <div className="text-green-400">+ API servers use public key (safe to share)</div>
                    <div className="text-yellow-400">~ Slower signature verification</div>
                    <div className="text-yellow-400">~ More complex key management</div>
                  </div>
                  <Badge className="mt-3 bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 text-xs">
                    Use case: Microservices, OAuth
                  </Badge>
                </div>
              </div>
            </SectionCard>

            {/* Section 6: JWT vs Session */}
            <SectionCard
              {...sections[5]}
              isCompleted={progress.completedSections.includes(sections[5].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                Choosing between JWT and sessions is one of the most debated topics. Understanding the
                <span className="text-neon-400 font-bold"> trade-offs</span> is critical for making the right choice.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-2 border-neon-500/30 rounded-lg overflow-hidden">
                  <thead className="bg-gray-900 border-b-2 border-neon-500/30">
                    <tr>
                      <th className="px-4 py-3 text-left text-neon-300 font-black">Factor</th>
                      <th className="px-4 py-3 text-left text-cyan-400 font-black">JWT</th>
                      <th className="px-4 py-3 text-left text-purple-400 font-black">Session</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-bold text-gray-300">State</td>
                      <td className="px-4 py-3 text-cyan-300">Stateless (token has all data)</td>
                      <td className="px-4 py-3 text-purple-300">Stateful (server stores data)</td>
                    </tr>
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-bold text-gray-300">Scalability</td>
                      <td className="px-4 py-3 text-green-400">Easy horizontal scaling</td>
                      <td className="px-4 py-3 text-yellow-400">Requires shared session store</td>
                    </tr>
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-bold text-gray-300">Revocation</td>
                      <td className="px-4 py-3 text-red-400">Hard (need blacklist)</td>
                      <td className="px-4 py-3 text-green-400">Instant (delete from DB)</td>
                    </tr>
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-bold text-gray-300">Mobile Apps</td>
                      <td className="px-4 py-3 text-green-400">Simple Authorization header</td>
                      <td className="px-4 py-3 text-yellow-400">Cookie handling tricky</td>
                    </tr>
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-bold text-gray-300">Security</td>
                      <td className="px-4 py-3 text-yellow-400">Token lives in client storage</td>
                      <td className="px-4 py-3 text-green-400">Server controls everything</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="bg-cyan-950/30 border-2 border-cyan-500/30 rounded-lg p-4">
                  <h4 className="text-cyan-300 font-black mb-3">Use JWT When:</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" /> Building mobile/SPA apps</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" /> Microservices architecture</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" /> Cross-domain authentication</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" /> Scalability matters more</li>
                  </ul>
                </div>

                <div className="bg-purple-950/30 border-2 border-purple-500/30 rounded-lg p-4">
                  <h4 className="text-purple-300 font-black mb-3">Use Session When:</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" /> Traditional web apps with SSR</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" /> Need instant logout/revocation</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" /> Security is top priority</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" /> Single domain application</li>
                  </ul>
                </div>
              </div>
            </SectionCard>

            {/* Section 7: Security Scenarios */}
            <SectionCard
              {...sections[6]}
              isCompleted={progress.completedSections.includes(sections[6].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                JWT is powerful but not bulletproof. Several <span className="text-red-400 font-bold">critical vulnerabilities</span> have
                plagued real-world implementations. Understanding these attacks is essential for secure JWT usage.
              </p>

              <div className="space-y-4">
                {securityScenarios.map(scenario => (
                  <SecurityScenario key={scenario.id} {...scenario} />
                ))}
              </div>
            </SectionCard>

            {/* Section 8: Claims Management */}
            <SectionCard
              {...sections[7]}
              isCompleted={progress.completedSections.includes(sections[7].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                JWT claims are the payload data. Choosing what to include - and what to <span className="text-red-400 font-bold">EXCLUDE</span> -
                is critical for both security and performance.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gradient-to-br from-blue-950/30 to-cyan-950/30 border-2 border-blue-500/30 rounded-lg p-4">
                  <h4 className="text-blue-300 font-black mb-3 text-sm">Standard Claims</h4>
                  <div className="space-y-2 text-xs">
                    <div className="border-l-2 border-blue-500/50 pl-2">
                      <code className="text-blue-300 font-mono font-bold">iss</code>
                      <p className="text-gray-400">Issuer (auth server URL)</p>
                    </div>
                    <div className="border-l-2 border-blue-500/50 pl-2">
                      <code className="text-blue-300 font-mono font-bold">sub</code>
                      <p className="text-gray-400">Subject (user ID)</p>
                    </div>
                    <div className="border-l-2 border-blue-500/50 pl-2">
                      <code className="text-blue-300 font-mono font-bold">exp</code>
                      <p className="text-gray-400">Expiration timestamp</p>
                    </div>
                    <div className="border-l-2 border-blue-500/50 pl-2">
                      <code className="text-blue-300 font-mono font-bold">iat</code>
                      <p className="text-gray-400">Issued at timestamp</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-neon-950/30 to-green-950/30 border-2 border-neon-500/30 rounded-lg p-4">
                  <h4 className="text-neon-300 font-black mb-3 text-sm">Custom Claims</h4>
                  <div className="space-y-2 text-xs">
                    <div className="border-l-2 border-neon-500/50 pl-2">
                      <code className="text-neon-300 font-mono font-bold">email</code>
                      <p className="text-gray-400">User&apos;s email address</p>
                    </div>
                    <div className="border-l-2 border-neon-500/50 pl-2">
                      <code className="text-neon-300 font-mono font-bold">role</code>
                      <p className="text-gray-400">User&apos;s role (admin, user)</p>
                    </div>
                    <div className="border-l-2 border-neon-500/50 pl-2">
                      <code className="text-neon-300 font-mono font-bold">permissions</code>
                      <p className="text-gray-400">Array of permissions</p>
                    </div>
                    <div className="border-l-2 border-neon-500/50 pl-2">
                      <code className="text-neon-300 font-mono font-bold">tenant_id</code>
                      <p className="text-gray-400">Multi-tenant identifier</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-950/30 to-orange-950/30 border-2 border-red-500/30 rounded-lg p-4">
                  <h4 className="text-red-300 font-black mb-3 text-sm">NEVER Include</h4>
                  <div className="space-y-2 text-xs">
                    <div className="border-l-2 border-red-500/50 pl-2">
                      <span className="text-red-400">✗</span>
                      <p className="text-gray-400">Passwords or hashes</p>
                    </div>
                    <div className="border-l-2 border-red-500/50 pl-2">
                      <span className="text-red-400">✗</span>
                      <p className="text-gray-400">SSN, PII, sensitive data</p>
                    </div>
                    <div className="border-l-2 border-red-500/50 pl-2">
                      <span className="text-red-400">✗</span>
                      <p className="text-gray-400">Credit card information</p>
                    </div>
                    <div className="border-l-2 border-red-500/50 pl-2">
                      <span className="text-red-400">✗</span>
                      <p className="text-gray-400">Large data sets (&gt;8KB)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-950/30 border-2 border-yellow-500/50 rounded-lg p-4">
                <h5 className="text-yellow-300 font-bold mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Size Matters
                </h5>
                <p className="text-sm text-gray-300">
                  Every request includes the JWT. A 50KB token kills performance. Keep it under <span className="text-neon-400 font-bold">1-2KB</span>.
                </p>
              </div>
            </SectionCard>

            {/* Section 9: Best Practices */}
            <SectionCard
              {...sections[8]}
              isCompleted={progress.completedSections.includes(sections[8].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                Deploying JWT to production? This checklist covers the <span className="text-neon-400 font-bold">critical security</span> and
                operational concerns that separate hobbyist implementations from enterprise-grade systems.
              </p>

              <div className="space-y-3">
                {[
                  {
                    icon: Key,
                    title: 'Strong Secret Key Management',
                    desc: 'Min 32 bytes random, store in env vars',
                    detail: 'Use crypto.randomBytes(64).toString(\'hex\') - never hardcode secrets',
                    color: 'neon',
                  },
                  {
                    icon: Clock,
                    title: 'Short Token Expiration',
                    desc: 'Access: 15 min | Refresh: 7 days',
                    detail: 'Minimizes damage window if token is stolen',
                    color: 'cyan',
                  },
                  {
                    icon: Shield,
                    title: 'Comprehensive Validation',
                    desc: 'Verify signature, exp, iss, aud',
                    detail: 'Always reject "alg: none" tokens - enforce expected algorithm',
                    color: 'purple',
                  },
                  {
                    icon: Database,
                    title: 'Secure Token Storage',
                    desc: 'Access in memory, refresh in httpOnly cookie',
                    detail: 'Never localStorage for web apps - vulnerable to XSS attacks',
                    color: 'yellow',
                  },
                  {
                    icon: Lock,
                    title: 'HTTPS Only',
                    desc: 'Never send tokens over HTTP',
                    detail: 'Set Secure and SameSite flags on cookies',
                    color: 'pink',
                  },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className={`border-l-4 border-${item.color}-500 bg-${item.color}-950/20 p-4 rounded-r-lg`}>
                      <div className="flex items-start gap-3">
                        <Icon className={`w-6 h-6 text-${item.color}-400 flex-shrink-0 mt-0.5`} />
                        <div className="flex-1">
                          <h4 className={`text-${item.color}-300 font-black mb-1`}>{item.title}</h4>
                          <p className="text-sm text-gray-300 mb-1">{item.desc}</p>
                          <p className="text-xs text-gray-500">{item.detail}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 bg-gradient-to-r from-neon-950/50 to-cyan-950/50 border-2 border-neon-500 rounded-lg p-5">
                <h4 className="text-neon-300 font-black text-lg mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6" />
                  Production Checklist
                </h4>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" defaultChecked />
                      Strong secret (min 32 chars)
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" defaultChecked />
                      Short expiration (15 min access)
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" defaultChecked />
                      Algorithm enforcement (reject &quot;none&quot;)
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" />
                      Refresh token rotation
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" />
                      Token monitoring/logging
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" />
                      HTTPS enforcement
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" />
                      Security penetration testing
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" />
                      Key rotation strategy
                    </label>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Live Demo Section */}
            <Card className="bg-gray-900/80 backdrop-blur border-2 border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.3)]">
              <CardHeader>
                <CardTitle className="text-2xl font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <Shield className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                  Live Demo: Try JWT Authentication
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isLoggedIn ? (
                  <div className="space-y-5">
                    <div className="bg-cyan-950/30 border-2 border-cyan-500/50 rounded-xl p-4">
                      <p className="text-sm text-cyan-200 font-bold mb-2">
                        Demo Credentials:
                      </p>
                      <div className="space-y-1 text-sm text-cyan-100">
                        <p>Username: <code className="bg-gray-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">admin</code> / Password: <code className="bg-gray-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">admin123</code></p>
                        <p>Username: <code className="bg-gray-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">user</code> / Password: <code className="bg-gray-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30">user123</code></p>
                      </div>
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="w-5 h-5" />
                        <AlertDescription className="ml-2">{error}</AlertDescription>
                      </Alert>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-2">
                        Username
                      </label>
                      <Input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="admin"
                        className="bg-gray-950 border-2 border-gray-700 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-2">
                        Password
                      </label>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        placeholder="admin123"
                        className="bg-gray-950 border-2 border-gray-700 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <Button
                      onClick={handleLogin}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-black font-semibold py-6"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Authenticating...
                        </>
                      ) : (
                        <>
                          Login with JWT
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="bg-gradient-to-br from-neon-950/50 to-emerald-950/50 border-2 border-neon-500 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 className="w-8 h-8 text-neon-400" />
                        <h3 className="text-2xl font-bold text-neon-200">Token Generated!</h3>
                      </div>
                      <p className="text-neon-100 text-lg">
                        Logged in as <strong className="text-neon-300">{username}</strong>
                      </p>
                    </div>

                    <Card className="bg-gray-900/50 border-2 border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <FileText className="w-6 h-6 text-neon-400" />
                          JWT Token Structure
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="bg-gray-950 rounded-lg p-3 border-2 border-gray-800">
                          <div className="text-xs text-gray-400 mb-1">Full Token:</div>
                          <div className="font-mono text-xs text-white break-all">{tokenData?.token}</div>
                        </div>

                        <div className="border-l-4 border-red-500 bg-red-950/20 p-3 rounded-r-lg">
                          <div className="text-xs text-red-300 font-bold mb-1">Header:</div>
                          <pre className="font-mono text-xs text-red-200">{JSON.stringify(tokenData?.header, null, 2)}</pre>
                        </div>

                        <div className="border-l-4 border-blue-500 bg-blue-950/20 p-3 rounded-r-lg">
                          <div className="text-xs text-blue-300 font-bold mb-1">Payload (Claims):</div>
                          <pre className="font-mono text-xs text-blue-200">{JSON.stringify(tokenData?.payload, null, 2)}</pre>
                        </div>

                        <div className="border-l-4 border-purple-500 bg-purple-950/20 p-3 rounded-r-lg">
                          <div className="text-xs text-purple-300 font-bold mb-1">Signature:</div>
                          <div className="font-mono text-xs text-purple-200 break-all">{tokenData?.signature}</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-900/50 border-2 border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Lock className="w-6 h-6 text-neon-400" />
                          Token Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-700">
                          <span className="text-gray-200 font-medium text-sm">Username:</span>
                          <span className="text-white font-semibold">{tokenData?.username}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-700">
                          <span className="text-gray-200 font-medium text-sm">Status:</span>
                          <Badge className="bg-neon-500/20 text-neon-300 border border-neon-500/50">
                            {tokenData?.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-700">
                          <span className="text-gray-200 font-medium text-sm">Issued:</span>
                          <span className="text-white text-sm">
                            {tokenData?.issuedAt && new Date(tokenData.issuedAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-200 font-medium text-sm">Expires:</span>
                          <span className="text-white text-sm">
                            {tokenData?.expiresAt && new Date(tokenData.expiresAt).toLocaleString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Button
                      onClick={handleLogout}
                      variant="secondary"
                      className="w-full py-6 bg-gray-800 hover:bg-gray-700 text-white border-2 border-gray-700"
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Challenges Section */}
            <div className="space-y-4">
              <h2 className="text-3xl font-black uppercase tracking-wider text-white flex items-center gap-3">
                <Zap className="w-8 h-8 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                Interactive Challenges
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Test your JWT authentication knowledge with real-world scenarios.
                Complete challenges to earn XP and level up your security skills.
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                {challenges.map(challenge => (
                  <ChallengeCard key={challenge.id} {...challenge} />
                ))}
              </div>
            </div>

            {/* Achievement Tracker */}
            <AchievementTracker progress={progress} />
          </main>
        </div>
      </div>
    </div>
  );
}
