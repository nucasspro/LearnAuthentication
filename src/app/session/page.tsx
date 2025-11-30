'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CodeBlock } from '@/components/learning/CodeBlock';
import { ProgressSidebar } from '@/components/learning/ProgressSidebar';
import { SectionCard } from '@/components/learning/SectionCard';
import { SecurityScenario } from '@/components/learning/SecurityScenario';
import { AchievementTracker } from '@/components/learning/AchievementTracker';
import { ChallengeCard } from '@/components/learning/ChallengeCard';
import { codeExamples, securityScenarios, challenges } from '@/lib/content/session-auth';
import { Section, ProgressData } from '@/lib/types';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Clock, Cookie, Database, Key, Lock, RefreshCw, Shield, Users, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SessionPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);
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
    const saved = localStorage.getItem('session-auth-progress');
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
    localStorage.setItem('session-auth-progress', JSON.stringify(progress));
  }, [progress]);

  const sections: Section[] = [
    { id: 'section-1', title: 'Access Granted: What is Session Auth?', icon: 'Key', category: 'essential', estimatedTime: 3 },
    { id: 'section-2', title: 'The Authentication Sequence', icon: 'Zap', category: 'essential', estimatedTime: 4 },
    { id: 'section-3', title: 'Cookie Security Protocols', icon: 'Shield', category: 'essential', estimatedTime: 3 },
    { id: 'section-4', title: 'Session Storage: Where to Keep State', icon: 'Database', category: 'important', estimatedTime: 5 },
    { id: 'section-5', title: 'Session Lifecycle: Birth to Termination', icon: 'RefreshCw', category: 'important', estimatedTime: 5 },
    { id: 'section-6', title: 'Session vs JWT: Choosing Your Protocol', icon: 'Users', category: 'important', estimatedTime: 5 },
    { id: 'section-7', title: 'Security Breach Scenarios', icon: 'AlertCircle', category: 'advanced', estimatedTime: 8 },
    { id: 'section-8', title: 'Scaling to Millions: Enterprise Patterns', icon: 'Zap', category: 'advanced', estimatedTime: 6 },
    { id: 'section-9', title: 'The Guardian\'s Checklist: Best Practices', icon: 'CheckCircle2', category: 'advanced', estimatedTime: 6 },
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const sessionResponse = await fetch('/api/auth/session-check');
        const sessionInfo = await sessionResponse.json();

        if (sessionResponse.ok) {
          setSessionData({
            sessionId: sessionInfo.sessionId,
            username: data.user.username,
            expiresAt: sessionInfo.expiresAt,
            createdAt: sessionInfo.createdAt || new Date().toISOString(),
            status: 'Active',
          });
          setIsLoggedIn(true);
        } else {
          setError('Failed to get session info');
        }
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsLoggedIn(false);
      setSessionData(null);
      setError('');
    } catch (err) {
      console.error('Logout error:', err);
      setIsLoggedIn(false);
      setSessionData(null);
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-green-950 to-gray-950">
      {/* Story Header */}
      <div className="bg-gray-900/80 backdrop-blur-sm border-b-2 border-neon-500/30 sticky top-0 z-50 py-6">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="mb-3 text-gray-200 hover:text-neon-400 hover:bg-gray-800/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="flex items-center gap-4">
            <Cookie className="w-12 h-12 text-neon-400 drop-shadow-[0_0_15px_rgba(74,255,0,0.6)]" />
            <div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider text-white">
                KEYCARD PROTOCOL
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <Badge className="bg-neon-500/20 text-neon-300 border border-neon-500/50 font-mono">
                  Clearance Level: Basic Access
                </Badge>
                <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-mono">
                  Status: ACTIVE
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-gray-950/50 border-l-4 border-neon-500">
            <p className="text-gray-300 leading-relaxed">
              <span className="text-neon-400 font-bold">CYBERPUNK 2084:</span> You&apos;re entering NeoTech Tower,
              the most secure facility in Neo-Tokyo. Your physical keycard grants access to restricted floors -
              but how does it work in the digital realm? Learn how servers remember you through
              <span className="text-neon-300 font-semibold"> session-based authentication</span>,
              the stateful protocol that powers millions of secure applications.
            </p>
          </div>
        </div>
      </div>

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
            {/* Section 1: What is Session Auth */}
            <SectionCard
              {...sections[0]}
              isCompleted={progress.completedSections.includes(sections[0].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg">
                Session-based authentication works like a <span className="text-neon-400 font-semibold">physical keycard</span> at
                NeoTech Tower. When you swipe your card, the building&apos;s central computer <span className="text-cyan-400">remembers</span> you&apos;re
                inside and grants access to authorized floors.
              </p>

              <div className="bg-neon-950/30 border-2 border-neon-500/30 rounded-lg p-5 my-4">
                <h4 className="text-neon-300 font-bold mb-3 flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  The Digital Keycard
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-neon-400 font-bold">1.</span>
                    You prove your identity (username + password)
                  </li>
                  <li className="flex gap-3">
                    <span className="text-neon-400 font-bold">2.</span>
                    Server generates a unique <span className="text-cyan-300 font-mono">session ID</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-neon-400 font-bold">3.</span>
                    Server stores your data in its <span className="text-purple-300">memory/database</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-neon-400 font-bold">4.</span>
                    Browser receives session ID via <span className="text-yellow-300">HTTP cookie</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-neon-400 font-bold">5.</span>
                    Every request auto-sends cookie - server recognizes you
                  </li>
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-950/50 border border-cyan-500/30 rounded-lg p-4">
                  <h5 className="text-cyan-400 font-bold mb-2">Stateful</h5>
                  <p className="text-sm text-gray-400">
                    Server stores session data. Cookie is just an ID reference.
                  </p>
                </div>
                <div className="bg-gray-950/50 border border-purple-500/30 rounded-lg p-4">
                  <h5 className="text-purple-400 font-bold mb-2">Server-Side</h5>
                  <p className="text-sm text-gray-400">
                    All authentication logic lives on the server, not in the cookie.
                  </p>
                </div>
              </div>
            </SectionCard>

            {/* Section 2: Authentication Sequence */}
            <SectionCard
              {...sections[1]}
              isCompleted={progress.completedSections.includes(sections[1].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                The authentication sequence is a <span className="text-neon-400 font-bold">7-step handshake</span> between
                client and server, establishing a secure communication channel.
              </p>

              <div className="space-y-3">
                {[
                  { num: 1, label: 'Client → Server', desc: 'POST /login with credentials', code: '{ username, password }' },
                  { num: 2, label: 'Server validates', desc: 'Compares bcrypt hash against database', code: 'bcrypt.compare(password, hash)' },
                  { num: 3, label: 'Generate session ID', desc: '256 bits of cryptographic entropy', code: 'crypto.randomBytes(32)' },
                  { num: 4, label: 'Store in database', desc: 'Session object with expiration', code: '{ userId, expiresAt }' },
                  { num: 5, label: 'Set cookie header', desc: 'HttpOnly, Secure, SameSite flags', code: 'Set-Cookie: sessionId=...' },
                  { num: 6, label: 'Browser stores', desc: 'Cookie auto-sent on future requests', code: 'Cookie: sessionId=...' },
                  { num: 7, label: 'Validate each request', desc: 'Look up session ID in database', code: 'SELECT * FROM sessions WHERE id=?' },
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
            </SectionCard>

            {/* Section 3: Cookie Security */}
            <SectionCard
              {...sections[2]}
              isCompleted={progress.completedSections.includes(sections[2].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                Cookie security attributes are your <span className="text-neon-400 font-bold">first line of defense</span> against
                common web attacks. Each attribute protects against specific threats.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-2 border-neon-500/30 rounded-lg overflow-hidden">
                  <thead className="bg-gray-900 border-b-2 border-neon-500/30">
                    <tr>
                      <th className="px-4 py-3 text-left text-neon-300 font-black">Attribute</th>
                      <th className="px-4 py-3 text-left text-neon-300 font-black">Protection</th>
                      <th className="px-4 py-3 text-left text-neon-300 font-black">Attack Prevented</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-mono text-neon-400">HttpOnly</td>
                      <td className="px-4 py-3 text-gray-300">JavaScript cannot read cookie</td>
                      <td className="px-4 py-3"><Badge className="bg-red-500/20 text-red-300 border border-red-500/50">XSS Theft</Badge></td>
                    </tr>
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-mono text-cyan-400">Secure</td>
                      <td className="px-4 py-3 text-gray-300">Only sent over HTTPS</td>
                      <td className="px-4 py-3"><Badge className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/50">MITM Sniffing</Badge></td>
                    </tr>
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-mono text-purple-400">SameSite=Strict</td>
                      <td className="px-4 py-3 text-gray-300">Blocks cross-site requests</td>
                      <td className="px-4 py-3"><Badge className="bg-orange-500/20 text-orange-300 border border-orange-500/50">CSRF</Badge></td>
                    </tr>
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-mono text-green-400">Max-Age</td>
                      <td className="px-4 py-3 text-gray-300">Auto-expiration timer</td>
                      <td className="px-4 py-3"><Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/50">Session Hijacking</Badge></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <CodeBlock examples={codeExamples.settingCookie} title="secure-cookie.js" />
            </SectionCard>

            {/* Section 4: Session Storage */}
            <SectionCard
              {...sections[3]}
              isCompleted={progress.completedSections.includes(sections[3].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                Where you <span className="text-neon-400 font-bold">store sessions</span> affects performance, scalability,
                and security. Choose based on your application&apos;s needs.
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-purple-500/30 rounded-lg p-4">
                  <Database className="w-8 h-8 text-purple-400 mb-3" />
                  <h4 className="text-purple-300 font-black mb-2">In-Memory</h4>
                  <p className="text-xs text-gray-400 mb-3">Node.js process memory (express-session default)</p>
                  <div className="space-y-1 text-xs">
                    <div className="text-green-400">+ Ultra-fast access</div>
                    <div className="text-green-400">+ Simple setup</div>
                    <div className="text-red-400">- Lost on restart</div>
                    <div className="text-red-400">- Single server only</div>
                  </div>
                  <Badge className="mt-3 bg-purple-500/20 text-purple-300 border border-purple-500/50 text-xs">
                    Best for: Development
                  </Badge>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-cyan-500/30 rounded-lg p-4">
                  <Database className="w-8 h-8 text-cyan-400 mb-3" />
                  <h4 className="text-cyan-300 font-black mb-2">Database</h4>
                  <p className="text-xs text-gray-400 mb-3">PostgreSQL, MySQL, MongoDB</p>
                  <div className="space-y-1 text-xs">
                    <div className="text-green-400">+ Persistent storage</div>
                    <div className="text-green-400">+ Works with load balancers</div>
                    <div className="text-yellow-400">~ Slower than memory</div>
                    <div className="text-yellow-400">~ Query optimization needed</div>
                  </div>
                  <Badge className="mt-3 bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 text-xs">
                    Best for: Small-Medium apps
                  </Badge>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-neon-500/30 rounded-lg p-4">
                  <Zap className="w-8 h-8 text-neon-400 mb-3" />
                  <h4 className="text-neon-300 font-black mb-2">Redis</h4>
                  <p className="text-xs text-gray-400 mb-3">In-memory data store with persistence</p>
                  <div className="space-y-1 text-xs">
                    <div className="text-green-400">+ Blazing fast (sub-ms)</div>
                    <div className="text-green-400">+ Built-in expiration</div>
                    <div className="text-green-400">+ Scales horizontally</div>
                    <div className="text-yellow-400">~ Requires Redis server</div>
                  </div>
                  <Badge className="mt-3 bg-neon-500/20 text-neon-300 border border-neon-500/50 text-xs">
                    Best for: Production/Enterprise
                  </Badge>
                </div>
              </div>
            </SectionCard>

            {/* Section 5: Session Lifecycle */}
            <SectionCard
              {...sections[4]}
              isCompleted={progress.completedSections.includes(sections[4].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                Sessions have a <span className="text-neon-400 font-bold">complete lifecycle</span> from
                creation to destruction. Understanding each phase is critical for security.
              </p>

              <div className="space-y-4">
                <div className="border-l-4 border-neon-500 bg-neon-950/30 p-4 rounded-r-lg">
                  <h4 className="text-neon-300 font-black mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-neon-500 text-black rounded-full flex items-center justify-center text-sm">1</span>
                    Creation (Login)
                  </h4>
                  <p className="text-sm text-gray-300 mb-2">Generate cryptographically secure session ID, store user data, set cookie</p>
                  <CodeBlock examples={codeExamples.settingCookie.slice(0, 1)} showLineNumbers={false} />
                </div>

                <div className="border-l-4 border-cyan-500 bg-cyan-950/30 p-4 rounded-r-lg">
                  <h4 className="text-cyan-300 font-black mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-cyan-500 text-black rounded-full flex items-center justify-center text-sm">2</span>
                    Validation (Each Request)
                  </h4>
                  <p className="text-sm text-gray-300 mb-2">Look up session in store, check expiration, update last activity</p>
                  <CodeBlock examples={codeExamples.validatingSession.slice(0, 1)} showLineNumbers={false} />
                </div>

                <div className="border-l-4 border-purple-500 bg-purple-950/30 p-4 rounded-r-lg">
                  <h4 className="text-purple-300 font-black mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-500 text-black rounded-full flex items-center justify-center text-sm">3</span>
                    Regeneration (Security Event)
                  </h4>
                  <p className="text-sm text-gray-300 mb-2">Generate new session ID after privilege escalation to prevent session fixation</p>
                  <CodeBlock examples={codeExamples.sessionRegeneration} showLineNumbers={false} />
                </div>

                <div className="border-l-4 border-red-500 bg-red-950/30 p-4 rounded-r-lg">
                  <h4 className="text-red-300 font-black mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-red-500 text-black rounded-full flex items-center justify-center text-sm">4</span>
                    Destruction (Logout)
                  </h4>
                  <p className="text-sm text-gray-300 mb-2">Delete session from store, clear cookie, invalidate all references</p>
                  <CodeBlock examples={codeExamples.logout} showLineNumbers={false} />
                </div>
              </div>
            </SectionCard>

            {/* Section 6: Session vs JWT */}
            <SectionCard
              {...sections[5]}
              isCompleted={progress.completedSections.includes(sections[5].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                Choosing between Session and JWT is like choosing between a <span className="text-neon-400 font-bold">keycard</span> (Session)
                and a <span className="text-cyan-400 font-bold">self-contained badge</span> (JWT). Each has trade-offs.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-2 border-neon-500/30 rounded-lg overflow-hidden">
                  <thead className="bg-gray-900 border-b-2 border-neon-500/30">
                    <tr>
                      <th className="px-4 py-3 text-left text-neon-300 font-black">Factor</th>
                      <th className="px-4 py-3 text-left text-neon-400 font-black">Session (Keycard)</th>
                      <th className="px-4 py-3 text-left text-cyan-400 font-black">JWT (Badge)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-bold text-gray-300">State</td>
                      <td className="px-4 py-3 text-neon-300">Stateful (server stores data)</td>
                      <td className="px-4 py-3 text-cyan-300">Stateless (token has all data)</td>
                    </tr>
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-bold text-gray-300">Server Load</td>
                      <td className="px-4 py-3 text-neon-300">Database lookup per request</td>
                      <td className="px-4 py-3 text-cyan-300">No database needed</td>
                    </tr>
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-bold text-gray-300">Scalability</td>
                      <td className="px-4 py-3 text-neon-300">Requires shared session store (Redis)</td>
                      <td className="px-4 py-3 text-cyan-300">Easy horizontal scaling</td>
                    </tr>
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-bold text-gray-300">Revocation</td>
                      <td className="px-4 py-3 text-green-400">Instant (delete from DB)</td>
                      <td className="px-4 py-3 text-red-400">Hard (need blacklist)</td>
                    </tr>
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-bold text-gray-300">Mobile Apps</td>
                      <td className="px-4 py-3 text-yellow-400">Cookie handling tricky</td>
                      <td className="px-4 py-3 text-green-400">Simple Authorization header</td>
                    </tr>
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-bold text-gray-300">Security</td>
                      <td className="px-4 py-3 text-green-400">Server controls everything</td>
                      <td className="px-4 py-3 text-yellow-400">Token lives in client storage</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="bg-neon-950/30 border-2 border-neon-500/30 rounded-lg p-4">
                  <h4 className="text-neon-300 font-black mb-3">Use Session When:</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-neon-400 flex-shrink-0 mt-0.5" /> Traditional web apps with server-side rendering</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-neon-400 flex-shrink-0 mt-0.5" /> Need instant logout/revocation</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-neon-400 flex-shrink-0 mt-0.5" /> Security is top priority</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-neon-400 flex-shrink-0 mt-0.5" /> Single domain application</li>
                  </ul>
                </div>

                <div className="bg-cyan-950/30 border-2 border-cyan-500/30 rounded-lg p-4">
                  <h4 className="text-cyan-300 font-black mb-3">Use JWT When:</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" /> Building mobile/SPA apps</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" /> Microservices architecture</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" /> Cross-domain authentication</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" /> Scalability matters more than instant revocation</li>
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
                Learn from real-world <span className="text-red-400 font-bold">security breaches</span>.
                Each scenario shows the attack, exploitation, and defense strategies.
              </p>

              <div className="space-y-4">
                {securityScenarios.map(scenario => (
                  <SecurityScenario key={scenario.id} {...scenario} />
                ))}
              </div>
            </SectionCard>

            {/* Section 8: Scaling Patterns */}
            <SectionCard
              {...sections[7]}
              isCompleted={progress.completedSections.includes(sections[7].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                Scaling session authentication to <span className="text-neon-400 font-bold">millions of users</span> requires
                specialized patterns and infrastructure.
              </p>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-950/30 to-pink-950/30 border-2 border-purple-500/30 rounded-lg p-5">
                  <h4 className="text-purple-300 font-black text-lg mb-3 flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    Pattern 1: Sticky Sessions (Session Affinity)
                  </h4>
                  <p className="text-gray-300 mb-3">
                    Load balancer routes user to the <span className="text-purple-400">same server</span> for all requests.
                    Session lives in server memory - no shared storage needed.
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-green-400 font-semibold">Pros:</span>
                      <ul className="text-gray-400 ml-4 mt-1 space-y-1">
                        <li>- Simple implementation</li>
                        <li>- Ultra-fast (in-memory)</li>
                        <li>- No shared storage cost</li>
                      </ul>
                    </div>
                    <div>
                      <span className="text-red-400 font-semibold">Cons:</span>
                      <ul className="text-gray-400 ml-4 mt-1 space-y-1">
                        <li>- Lost if server crashes</li>
                        <li>- Uneven load distribution</li>
                        <li>- Rolling deploys tricky</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-cyan-950/30 to-blue-950/30 border-2 border-cyan-500/30 rounded-lg p-5">
                  <h4 className="text-cyan-300 font-black text-lg mb-3 flex items-center gap-2">
                    <Database className="w-6 h-6" />
                    Pattern 2: Centralized Session Store (Redis/Memcached)
                  </h4>
                  <p className="text-gray-300 mb-3">
                    All servers connect to a <span className="text-cyan-400">shared Redis cluster</span>.
                    Session lookups happen in distributed memory - requests can hit any server.
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-green-400 font-semibold">Pros:</span>
                      <ul className="text-gray-400 ml-4 mt-1 space-y-1">
                        <li>- True load balancing</li>
                        <li>- Survives server crashes</li>
                        <li>- Sub-millisecond lookups</li>
                      </ul>
                    </div>
                    <div>
                      <span className="text-yellow-400 font-semibold">Considerations:</span>
                      <ul className="text-gray-400 ml-4 mt-1 space-y-1">
                        <li>- Redis infrastructure needed</li>
                        <li>- Network latency (minor)</li>
                        <li>- Redis cluster management</li>
                      </ul>
                    </div>
                  </div>
                  <Badge className="mt-3 bg-cyan-500/20 text-cyan-300 border border-cyan-500/50">
                    Industry Standard for Production
                  </Badge>
                </div>

                <div className="bg-gradient-to-r from-neon-950/30 to-green-950/30 border-2 border-neon-500/30 rounded-lg p-5">
                  <h4 className="text-neon-300 font-black text-lg mb-3 flex items-center gap-2">
                    <Zap className="w-6 h-6" />
                    Pattern 3: Session Replication
                  </h4>
                  <p className="text-gray-300 mb-3">
                    Each server stores sessions locally but <span className="text-neon-400">replicates</span> changes
                    to other servers in real-time. Hybrid of sticky sessions + shared state.
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-green-400 font-semibold">Pros:</span>
                      <ul className="text-gray-400 ml-4 mt-1 space-y-1">
                        <li>- Fast local reads</li>
                        <li>- Failover support</li>
                        <li>- No single point of failure</li>
                      </ul>
                    </div>
                    <div>
                      <span className="text-red-400 font-semibold">Cons:</span>
                      <ul className="text-gray-400 ml-4 mt-1 space-y-1">
                        <li>- Complex implementation</li>
                        <li>- Replication lag</li>
                        <li>- High memory usage</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Section 9: Best Practices */}
            <SectionCard
              {...sections[8]}
              isCompleted={progress.completedSections.includes(sections[8].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                The <span className="text-neon-400 font-bold">Guardian&apos;s Checklist</span> - essential security
                practices every production session system must follow.
              </p>

              <div className="space-y-3">
                {[
                  {
                    icon: Clock,
                    title: 'Short Session Timeouts',
                    desc: 'Idle: 15-30 min | Absolute: 8 hours max',
                    detail: 'Reduces window of opportunity for session hijacking on shared computers',
                    color: 'neon',
                  },
                  {
                    icon: RefreshCw,
                    title: 'Regenerate Session ID on Login',
                    desc: 'Create new ID after authentication',
                    detail: 'Prevents session fixation attacks where attacker pre-sets session ID',
                    color: 'cyan',
                  },
                  {
                    icon: Shield,
                    title: 'All Security Flags',
                    desc: 'HttpOnly + Secure + SameSite=Strict',
                    detail: 'Protects against XSS, MITM, and CSRF attacks simultaneously',
                    color: 'purple',
                  },
                  {
                    icon: Database,
                    title: 'Monitor Active Sessions',
                    desc: 'Show users list of active sessions',
                    detail: 'Let users revoke sessions from unfamiliar locations/devices',
                    color: 'yellow',
                  },
                  {
                    icon: Lock,
                    title: 'Remember Me (Optional)',
                    desc: 'Separate long-lived token for convenience',
                    detail: 'Use separate "remember me" token with lower privileges than active session',
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
                      Cookie flags: HttpOnly, Secure, SameSite
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" defaultChecked />
                      Session regeneration on login
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" defaultChecked />
                      Timeout configuration (idle + absolute)
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" />
                      Redis/centralized session store
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" />
                      Session monitoring/analytics
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" />
                      Logout all devices feature
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" />
                      HTTPS enforcement
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" />
                      Audit logging for auth events
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
                  Live Demo: Try Session Authentication
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
                          Login with Session
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
                        <h3 className="text-2xl font-bold text-neon-200">Access Granted!</h3>
                      </div>
                      <p className="text-neon-100 text-lg">
                        Logged in as <strong className="text-neon-300">{username}</strong>
                      </p>
                    </div>

                    <Card className="bg-gray-900/50 border-2 border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Lock className="w-6 h-6 text-neon-400" />
                          Session Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-700">
                          <span className="text-gray-200 font-medium text-sm">Session ID:</span>
                          <span className="text-neon-300 font-mono text-xs break-all max-w-[250px]">{sessionData?.sessionId}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-700">
                          <span className="text-gray-200 font-medium text-sm">Username:</span>
                          <span className="text-white font-semibold">{sessionData?.username}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-700">
                          <span className="text-gray-200 font-medium text-sm">Status:</span>
                          <Badge className="bg-neon-500/20 text-neon-300 border border-neon-500/50">
                            {sessionData?.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-700">
                          <span className="text-gray-200 font-medium text-sm">Created:</span>
                          <span className="text-white text-sm">
                            {new Date(sessionData?.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-200 font-medium text-sm">Expires:</span>
                          <span className="text-white text-sm">
                            {new Date(sessionData?.expiresAt).toLocaleString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-900/50 border-2 border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Cookie className="w-6 h-6 text-neon-400" />
                          Cookie Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-950 rounded-lg p-4 font-mono text-sm space-y-2 border-2 border-gray-800">
                          <div className="text-gray-200">
                            <span className="text-neon-400">Set-Cookie:</span> sessionId={sessionData?.sessionId?.substring(0, 20)}...
                          </div>
                          <div className="text-gray-200 pl-4">
                            <span className="text-cyan-400">HttpOnly;</span> <span className="text-gray-400">{`// JS cannot access`}</span>
                          </div>
                          <div className="text-gray-200 pl-4">
                            <span className="text-cyan-400">Secure;</span> <span className="text-gray-400">{`// HTTPS only`}</span>
                          </div>
                          <div className="text-gray-200 pl-4">
                            <span className="text-cyan-400">SameSite=Strict;</span> <span className="text-gray-400">{`// CSRF protection`}</span>
                          </div>
                          <div className="text-gray-200 pl-4">
                            <span className="text-cyan-400">Max-Age=86400;</span> <span className="text-gray-400">{`// 24 hours`}</span>
                          </div>
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
                Test your session authentication knowledge with real-world scenarios.
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
