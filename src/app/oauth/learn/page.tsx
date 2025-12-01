'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeBlock } from '@/components/learning/CodeBlock';
import { ProgressSidebar } from '@/components/learning/ProgressSidebar';
import { SectionCard } from '@/components/learning/SectionCard';
import { SecurityScenario } from '@/components/learning/SecurityScenario';
import { AchievementTracker } from '@/components/learning/AchievementTracker';
import { ChallengeCard } from '@/components/learning/ChallengeCard';
import { StoryHeader } from '@/components/learning/StoryHeader';
import { codeExamples, securityScenarios, challenges, oauthAuthContent } from '@/lib/content/oauth-auth';
import { Section, ProgressData } from '@/lib/types';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Database, GitBranch, Key, Lock, Search, Shield, ShieldCheck, Smartphone, UserPlus, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function OAuthLearnPage() {
  const router = useRouter();
  const [clientId, setClientId] = useState('demo_client_123');
  const [authorizationCode, setAuthorizationCode] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'idle' | 'authorizing' | 'authorized' | 'token-exchanged'>('idle');
  const [progress, setProgress] = useState<ProgressData>({
    completedSections: [],
    percentage: 0,
    level: 'Protocol Initiate',
    achievements: [],
  });

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('oauth-auth-progress');
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
    localStorage.setItem('oauth-auth-progress', JSON.stringify(progress));
  }, [progress]);

  const sections: Section[] = [
    { id: 'section-1', title: 'The Visitor Badge: What is OAuth 2.0?', icon: 'Shield', category: 'essential', estimatedTime: 3 },
    { id: 'section-2', title: 'The Four Grant Types: Choosing Your Strategy', icon: 'GitBranch', category: 'essential', estimatedTime: 4 },
    { id: 'section-3', title: 'Scopes & Permissions: Controlling Access', icon: 'Lock', category: 'essential', estimatedTime: 3 },
    { id: 'section-4', title: 'Access Tokens vs Refresh Tokens', icon: 'Key', category: 'important', estimatedTime: 5 },
    { id: 'section-5', title: 'State Parameter: CSRF Protection', icon: 'Shield', category: 'important', estimatedTime: 5 },
    { id: 'section-6', title: 'PKCE: Securing Mobile & SPA Apps', icon: 'Smartphone', category: 'important', estimatedTime: 5 },
    { id: 'section-7', title: 'Token Introspection & Revocation', icon: 'Search', category: 'advanced', estimatedTime: 7 },
    { id: 'section-8', title: 'Dynamic Client Registration (DCR)', icon: 'UserPlus', category: 'advanced', estimatedTime: 6 },
    { id: 'section-9', title: 'OAuth Security Best Practices', icon: 'ShieldCheck', category: 'advanced', estimatedTime: 7 },
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

  const handleAuthorize = () => {
    setIsAuthorizing(true);
    setCurrentStep('authorizing');

    // Simulate authorization flow
    setTimeout(() => {
      const mockAuthCode = 'auth_' + Math.random().toString(36).substring(2, 15);
      setAuthorizationCode(mockAuthCode);
      setCurrentStep('authorized');
      setIsAuthorizing(false);
    }, 2000);
  };

  const handleExchangeToken = () => {
    if (!authorizationCode) return;

    setIsAuthorizing(true);

    // Simulate token exchange
    setTimeout(() => {
      const mockAccessToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.' + Math.random().toString(36).substring(2);
      const mockRefreshToken = 'refresh_' + Math.random().toString(36).substring(2, 15);

      setAccessToken(mockAccessToken);
      setRefreshToken(mockRefreshToken);
      setCurrentStep('token-exchanged');
      setIsAuthorizing(false);
    }, 1500);
  };

  const handleReset = () => {
    setAuthorizationCode('');
    setAccessToken('');
    setRefreshToken('');
    setCurrentStep('idle');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950">
      <StoryHeader
        title={oauthAuthContent.storyHook.title}
        narrative={
          <>
            <span className="text-neon-400 font-bold">CYBERPUNK 2084:</span> You&apos;re a corporate security consultant in a world where megacorporations guard their data jealously. Enter the
            <span className="text-neon-300 font-semibold"> DELEGATION PROTOCOL</span> - a sophisticated system where one entity can grant LIMITED, TEMPORARY access to another without revealing their master credentials. Think of it as issuing a visitor badge instead of handing over your master keycard. Master the art of secure delegation in a world where trust is scarce and data breaches cost billions.
          </>
        }
        icon={Shield}
        clearanceLevel={oauthAuthContent.storyHook.clearanceLevel}
        status={oauthAuthContent.storyHook.status}
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
            {/* Section 1: What is OAuth 2.0 */}
            <SectionCard
              {...sections[0]}
              isCompleted={progress.completedSections.includes(sections[0].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg">
                OAuth 2.0 is an <span className="text-neon-400 font-semibold">authorization framework</span> that allows third-party applications to obtain LIMITED access to user accounts WITHOUT exposing passwords. It&apos;s like issuing a <span className="text-cyan-400">temporary visitor badge</span> instead of handing over your master keycard.
              </p>

              <div className="bg-neon-950/30 border-2 border-neon-500/30 rounded-lg p-5 my-4">
                <h4 className="text-neon-300 font-bold mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  The Four OAuth Players
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-neon-400 font-bold">1.</span>
                    <div><strong className="text-neon-300">Resource Owner:</strong> You (the user with the data)</div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-neon-400 font-bold">2.</span>
                    <div><strong className="text-cyan-300">Authorization Server:</strong> Issues access tokens (security desk)</div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-neon-400 font-bold">3.</span>
                    <div><strong className="text-purple-300">Resource Server:</strong> Holds protected data (your office)</div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-neon-400 font-bold">4.</span>
                    <div><strong className="text-yellow-300">Client:</strong> Third-party app requesting access (the courier)</div>
                  </li>
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-950/50 border border-neon-500/30 rounded-lg p-4">
                  <h5 className="text-neon-400 font-bold mb-2">Authorization</h5>
                  <p className="text-sm text-gray-400">
                    OAuth is for AUTHORIZATION (granting access), not authentication (proving identity).
                  </p>
                </div>
                <div className="bg-gray-950/50 border border-purple-500/30 rounded-lg p-4">
                  <h5 className="text-purple-400 font-bold mb-2">No Password Sharing</h5>
                  <p className="text-sm text-gray-400">
                    Users never share passwords with third-party apps - only grant limited permissions.
                  </p>
                </div>
              </div>
            </SectionCard>

            {/* Section 2: Grant Types */}
            <SectionCard
              {...sections[1]}
              isCompleted={progress.completedSections.includes(sections[1].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                OAuth 2.0 provides <span className="text-neon-400 font-bold">four grant types</span> (flows) for different scenarios. Think of these as different types of visitor badges for different situations.
              </p>

              <div className="space-y-3">
                {[
                  { num: 1, label: 'Authorization Code', desc: 'Most secure - for server-side web apps', code: 'User approves → Get code → Exchange for token', color: 'neon' },
                  { num: 2, label: 'Implicit Flow', desc: 'DEPRECATED - tokens in URL (insecure)', code: 'Use Auth Code + PKCE instead', color: 'red' },
                  { num: 3, label: 'Client Credentials', desc: 'Machine-to-machine (no user)', code: 'Client auth → Get token → Access API', color: 'cyan' },
                  { num: 4, label: 'Password Grant', desc: 'Legacy - user gives password to client', code: 'Avoid unless you control everything', color: 'yellow' },
                ].map(step => (
                  <div key={step.num} className={`flex gap-4 p-3 rounded-lg bg-gray-950/50 border border-${step.color}-500/20 hover:border-${step.color}-500/40 transition-all`}>
                    <div className={`flex-shrink-0 w-8 h-8 bg-${step.color}-500 text-black rounded-full flex items-center justify-center font-black`}>
                      {step.num}
                    </div>
                    <div className="flex-1">
                      <div className={`text-${step.color}-300 font-bold text-sm`}>{step.label}</div>
                      <div className="text-gray-400 text-xs mt-0.5">{step.desc}</div>
                      <code className="text-xs text-cyan-300 font-mono mt-1 block">{step.code}</code>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 bg-purple-950/30 border-2 border-purple-500/30 rounded-lg p-4">
                <h5 className="text-purple-300 font-bold mb-2">Modern Best Practice: Authorization Code + PKCE</h5>
                <p className="text-sm text-gray-300">
                  PKCE (Proof Key for Code Exchange) adds security even without client_secret. <strong>Required for mobile/SPA apps, recommended for ALL OAuth flows.</strong>
                </p>
              </div>
            </SectionCard>

            {/* Section 3: Scopes & Permissions */}
            <SectionCard
              {...sections[2]}
              isCompleted={progress.completedSections.includes(sections[2].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                <span className="text-neon-400 font-bold">Scopes</span> define WHAT the access token can do. Think of them as specific permissions on your visitor badge.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-2 border-neon-500/30 rounded-lg overflow-hidden">
                  <thead className="bg-gray-900 border-b-2 border-neon-500/30">
                    <tr>
                      <th className="px-4 py-3 text-left text-neon-300 font-black">Scope</th>
                      <th className="px-4 py-3 text-left text-neon-300 font-black">Permission</th>
                      <th className="px-4 py-3 text-left text-neon-300 font-black">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-mono text-neon-400">read:profile</td>
                      <td className="px-4 py-3 text-gray-300">View basic profile info</td>
                      <td className="px-4 py-3"><Badge className="bg-green-500/20 text-green-300 border border-green-500/50">Low</Badge></td>
                    </tr>
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-mono text-cyan-400">read:email</td>
                      <td className="px-4 py-3 text-gray-300">Access email address</td>
                      <td className="px-4 py-3"><Badge className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/50">Medium</Badge></td>
                    </tr>
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-mono text-purple-400">write:posts</td>
                      <td className="px-4 py-3 text-gray-300">Create new posts</td>
                      <td className="px-4 py-3"><Badge className="bg-orange-500/20 text-orange-300 border border-orange-500/50">Medium</Badge></td>
                    </tr>
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-mono text-red-400">delete:account</td>
                      <td className="px-4 py-3 text-gray-300">Delete user account</td>
                      <td className="px-4 py-3"><Badge className="bg-red-500/20 text-red-300 border border-red-500/50">High</Badge></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <CodeBlock examples={codeExamples.scopeValidation?.javascript || []} title="scope-validation.js" />
            </SectionCard>

            {/* Section 4: Access vs Refresh Tokens */}
            <SectionCard
              {...sections[3]}
              isCompleted={progress.completedSections.includes(sections[3].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                OAuth uses <span className="text-neon-400 font-bold">TWO types of tokens</span> for enhanced security:
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-cyan-500/30 rounded-lg p-4">
                  <Key className="w-8 h-8 text-cyan-400 mb-3" />
                  <h4 className="text-cyan-300 font-black mb-2">Access Token</h4>
                  <p className="text-xs text-gray-400 mb-3">Short-lived visitor badge</p>
                  <div className="space-y-1 text-xs">
                    <div className="text-gray-300"><strong>Purpose:</strong> Access protected resources</div>
                    <div className="text-gray-300"><strong>Lifetime:</strong> 15 min - 1 hour</div>
                    <div className="text-gray-300"><strong>Storage:</strong> Memory/sessionStorage</div>
                    <div className="text-green-400">+ Limited damage if stolen</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-purple-500/30 rounded-lg p-4">
                  <Database className="w-8 h-8 text-purple-400 mb-3" />
                  <h4 className="text-purple-300 font-black mb-2">Refresh Token</h4>
                  <p className="text-xs text-gray-400 mb-3">Long-lived master key</p>
                  <div className="space-y-1 text-xs">
                    <div className="text-gray-300"><strong>Purpose:</strong> Get new access tokens</div>
                    <div className="text-gray-300"><strong>Lifetime:</strong> Days, weeks, months</div>
                    <div className="text-gray-300"><strong>Storage:</strong> HTTP-Only cookie</div>
                    <div className="text-yellow-400">~ Can be revoked in database</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-neon-950/30 border-2 border-neon-500/30 rounded-lg p-4">
                <h5 className="text-neon-300 font-bold mb-2">Why Two Tokens?</h5>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>• Access tokens used frequently → short-lived limits damage if stolen</li>
                  <li>• Refresh tokens used rarely → lower theft risk, long-lived for UX</li>
                  <li>• Refresh tokens can be revoked; access tokens cannot (stateless)</li>
                </ul>
              </div>

              <CodeBlock examples={codeExamples.refreshTokenFlow?.javascript || []} title="refresh-token-flow.js" />
            </SectionCard>

            {/* Section 5: State Parameter */}
            <SectionCard
              {...sections[4]}
              isCompleted={progress.completedSections.includes(sections[4].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                The <span className="text-neon-400 font-bold">state parameter</span> is OAuth&apos;s primary defense against <span className="text-red-400">Cross-Site Request Forgery (CSRF)</span> attacks.
              </p>

              <div className="space-y-4">
                <div className="border-l-4 border-neon-500 bg-neon-950/30 p-4 rounded-r-lg">
                  <h4 className="text-neon-300 font-black mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-neon-500 text-black rounded-full flex items-center justify-center text-sm">1</span>
                    Before Redirect
                  </h4>
                  <p className="text-sm text-gray-300">Generate random string, store in session</p>
                  <code className="block mt-1 text-xs bg-neon-900/30 p-2 rounded font-mono text-cyan-300">
                    state = crypto.randomBytes(32).toString(&apos;hex&apos;)
                  </code>
                </div>

                <div className="border-l-4 border-cyan-500 bg-cyan-950/30 p-4 rounded-r-lg">
                  <h4 className="text-cyan-300 font-black mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-cyan-500 text-black rounded-full flex items-center justify-center text-sm">2</span>
                    Authorization URL
                  </h4>
                  <p className="text-sm text-gray-300">Include state as query parameter</p>
                  <code className="block mt-1 text-xs bg-cyan-900/30 p-2 rounded font-mono text-cyan-300">
                    /authorize?...&state=abc123
                  </code>
                </div>

                <div className="border-l-4 border-purple-500 bg-purple-950/30 p-4 rounded-r-lg">
                  <h4 className="text-purple-300 font-black mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-500 text-black rounded-full flex items-center justify-center text-sm">3</span>
                    After Callback
                  </h4>
                  <p className="text-sm text-gray-300">Verify state matches stored value</p>
                  <code className="block mt-1 text-xs bg-purple-900/30 p-2 rounded font-mono text-cyan-300">
                    if (state !== storedState) reject()
                  </code>
                </div>
              </div>

              <CodeBlock examples={codeExamples.stateParameter?.javascript || []} title="state-parameter-csrf.js" />
            </SectionCard>

            {/* Section 6: PKCE */}
            <SectionCard
              {...sections[5]}
              isCompleted={progress.completedSections.includes(sections[5].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                <span className="text-neon-400 font-bold">PKCE</span> (Proof Key for Code Exchange) protects OAuth flows when you CAN&apos;T keep a client secret safe.
              </p>

              <div className="bg-purple-950/30 border-2 border-purple-500/30 rounded-lg p-5 mb-4">
                <h4 className="text-purple-300 font-black mb-3">The Problem</h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> Mobile apps can be decompiled → secrets extracted</li>
                  <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> SPAs run in browser → secrets visible in JavaScript</li>
                  <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> Without client_secret, authorization code can be stolen</li>
                </ul>
              </div>

              <div className="bg-neon-950/30 border-2 border-neon-500/30 rounded-lg p-5">
                <h4 className="text-neon-300 font-black mb-3">The Solution: PKCE</h4>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex gap-3">
                    <span className="text-neon-400 font-bold">1.</span>
                    <div>Generate random <code className="text-cyan-300">code_verifier</code></div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-neon-400 font-bold">2.</span>
                    <div>Compute <code className="text-purple-300">code_challenge = SHA256(code_verifier)</code></div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-neon-400 font-bold">3.</span>
                    <div>Send code_challenge in authorization URL (NOT the verifier!)</div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-neon-400 font-bold">4.</span>
                    <div>On token exchange, send original code_verifier</div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-neon-400 font-bold">5.</span>
                    <div>Server validates: SHA256(received verifier) === stored challenge</div>
                  </div>
                </div>
              </div>

              <CodeBlock examples={codeExamples.pkceImplementation?.javascript || []} title="pkce-implementation.js" />
            </SectionCard>

            {/* Section 7: Token Introspection & Revocation */}
            <SectionCard
              {...sections[6]}
              isCompleted={progress.completedSections.includes(sections[6].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                <span className="text-neon-400 font-bold">Token Introspection</span> (RFC 7662) allows resource servers to validate access tokens and retrieve metadata.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-cyan-500/30 rounded-lg p-4">
                  <Search className="w-8 h-8 text-cyan-400 mb-3" />
                  <h4 className="text-cyan-300 font-black mb-2">Introspection</h4>
                  <p className="text-xs text-gray-400 mb-3">Validate opaque tokens</p>
                  <div className="space-y-1 text-xs">
                    <div className="text-green-400">+ Get token metadata</div>
                    <div className="text-green-400">+ Check if still valid</div>
                    <div className="text-green-400">+ Retrieve scopes & user info</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-red-500/30 rounded-lg p-4">
                  <Lock className="w-8 h-8 text-red-400 mb-3" />
                  <h4 className="text-red-300 font-black mb-2">Revocation</h4>
                  <p className="text-xs text-gray-400 mb-3">Invalidate tokens immediately</p>
                  <div className="space-y-1 text-xs">
                    <div className="text-gray-300">• User logs out</div>
                    <div className="text-gray-300">• Password changed</div>
                    <div className="text-gray-300">• Security breach detected</div>
                  </div>
                </div>
              </div>

              <CodeBlock examples={codeExamples.introspectionRevocation?.javascript || []} title="introspection-revocation.js" />
            </SectionCard>

            {/* Section 8: Dynamic Client Registration */}
            <SectionCard
              {...sections[7]}
              isCompleted={progress.completedSections.includes(sections[7].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                <span className="text-neon-400 font-bold">Dynamic Client Registration</span> (RFC 7591) allows clients to register themselves programmatically without manual admin approval.
              </p>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-neon-950/30 to-cyan-950/30 border-2 border-neon-500/30 rounded-lg p-5">
                  <h4 className="text-neon-300 font-black text-lg mb-3 flex items-center gap-2">
                    <UserPlus className="w-6 h-6" />
                    Use Cases
                  </h4>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-neon-400 flex-shrink-0 mt-0.5" /> Multi-tenant SaaS (each tenant = separate client)</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-neon-400 flex-shrink-0 mt-0.5" /> IoT devices (millions need unique credentials)</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-neon-400 flex-shrink-0 mt-0.5" /> Developer portals (instant API access)</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-red-950/30 to-orange-950/30 border-2 border-red-500/30 rounded-lg p-5">
                  <h4 className="text-red-300 font-black text-lg mb-3">Security Considerations</h4>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li className="flex gap-2"><Shield className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> Strict validation of redirect_uris (prevent open redirect)</li>
                    <li className="flex gap-2"><Shield className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> Rate limiting (prevent abuse/spam)</li>
                    <li className="flex gap-2"><Shield className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> Domain whitelist (only allow certain domains)</li>
                  </ul>
                </div>
              </div>

              <CodeBlock examples={codeExamples.dynamicClientRegistration?.javascript || []} title="dynamic-client-registration.js" />
            </SectionCard>

            {/* Section 9: Best Practices */}
            <SectionCard
              {...sections[8]}
              isCompleted={progress.completedSections.includes(sections[8].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                The <span className="text-neon-400 font-bold">Guardian&apos;s Checklist</span> - essential security
                practices every production OAuth system must follow.
              </p>

              <div className="space-y-3">
                {[
                  {
                    icon: Shield,
                    title: 'Use Authorization Code + PKCE',
                    desc: 'Most secure flow for ALL clients',
                    detail: 'PKCE required for mobile/SPA, recommended for server-side too',
                    color: 'neon',
                  },
                  {
                    icon: Key,
                    title: 'Short-lived Access Tokens',
                    desc: '15-60 minutes maximum',
                    detail: 'Limits damage if stolen; use refresh tokens for long sessions',
                    color: 'cyan',
                  },
                  {
                    icon: Lock,
                    title: 'Validate redirect_uri Exactly',
                    desc: 'No wildcards, exact match only',
                    detail: 'Prevents authorization code theft via open redirect attacks',
                    color: 'purple',
                  },
                  {
                    icon: Database,
                    title: 'Implement Token Revocation',
                    desc: 'Allow users to revoke access',
                    detail: 'Critical for security incidents and user logout',
                    color: 'yellow',
                  },
                  {
                    icon: ShieldCheck,
                    title: 'HTTPS Everywhere',
                    desc: 'TLS 1.2+ for all requests',
                    detail: 'OAuth MUST use HTTPS in production to prevent token theft',
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
                      Authorization Code + PKCE flow
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" defaultChecked />
                      State parameter validation
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" defaultChecked />
                      Exact redirect_uri validation
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" />
                      Token introspection endpoint
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" />
                      Token revocation endpoint
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" />
                      Refresh token rotation
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" />
                      HTTPS enforcement (TLS 1.2+)
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" />
                      Audit logging for OAuth events
                    </label>
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Section 7: Security Scenarios */}
            <div className="space-y-4">
              <h2 className="text-3xl font-black uppercase tracking-wider text-white flex items-center gap-3">
                <AlertCircle className="w-8 h-8 text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                Security Breach Scenarios
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Learn from real-world <span className="text-red-400 font-bold">security breaches</span>.
                Each scenario shows the attack, exploitation, and defense strategies.
              </p>

              <div className="space-y-4">
                {securityScenarios.map(scenario => (
                  <SecurityScenario key={scenario.id} {...scenario} />
                ))}
              </div>
            </div>

            {/* Live Demo Section */}
            <Card className="bg-gray-900/80 backdrop-blur border-2 border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
              <CardHeader>
                <CardTitle className="text-2xl font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <Shield className="w-7 h-7 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                  Live Demo: OAuth Authorization Flow
                </CardTitle>
              </CardHeader>
              <CardContent>
                {currentStep === 'idle' && (
                  <div className="space-y-5">
                    <div className="bg-purple-950/30 border-2 border-purple-500/50 rounded-xl p-4">
                      <p className="text-sm text-purple-200 font-bold mb-2">
                        Demo Client Configuration:
                      </p>
                      <div className="space-y-1 text-sm text-purple-100">
                        <p>Client ID: <code className="bg-gray-950 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">{clientId}</code></p>
                        <p>Redirect URI: <code className="bg-gray-950 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">https://yourapp.com/callback</code></p>
                        <p>Scopes: <code className="bg-gray-950 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">read:profile read:email</code></p>
                      </div>
                    </div>

                    <Button
                      onClick={handleAuthorize}
                      disabled={isAuthorizing}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold py-6"
                    >
                      {isAuthorizing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Redirecting to Authorization Server...
                        </>
                      ) : (
                        <>
                          Start OAuth Authorization
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {currentStep === 'authorized' && (
                  <div className="space-y-5">
                    <div className="bg-gradient-to-br from-neon-950/50 to-emerald-950/50 border-2 border-neon-500 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 className="w-8 h-8 text-neon-400" />
                        <h3 className="text-2xl font-bold text-neon-200">User Authorized!</h3>
                      </div>
                      <p className="text-neon-100 text-lg">
                        Received authorization code from provider
                      </p>
                    </div>

                    <Card className="bg-gray-900/50 border-2 border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Key className="w-6 h-6 text-neon-400" />
                          Authorization Code
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-950 rounded-lg p-4 font-mono text-sm border-2 border-gray-800">
                          <div className="text-gray-200">
                            <span className="text-neon-400">code:</span> {authorizationCode}
                          </div>
                          <div className="text-gray-400 text-xs mt-2">
                            {`// Single-use, expires in 10 minutes`}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Button
                      onClick={handleExchangeToken}
                      disabled={isAuthorizing}
                      className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-black font-semibold py-6"
                    >
                      {isAuthorizing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Exchanging Code for Token...
                        </>
                      ) : (
                        <>
                          Exchange Code for Access Token
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {currentStep === 'token-exchanged' && (
                  <div className="space-y-5">
                    <div className="bg-gradient-to-br from-neon-950/50 to-emerald-950/50 border-2 border-neon-500 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 className="w-8 h-8 text-neon-400" />
                        <h3 className="text-2xl font-bold text-neon-200">Token Exchange Complete!</h3>
                      </div>
                      <p className="text-neon-100 text-lg">
                        OAuth flow successful - access granted
                      </p>
                    </div>

                    <Card className="bg-gray-900/50 border-2 border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Key className="w-6 h-6 text-cyan-400" />
                          Access Token
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="bg-gray-950 rounded-lg p-4 font-mono text-xs border-2 border-gray-800">
                          <div className="text-gray-200 break-all">
                            <span className="text-cyan-400">access_token:</span> {accessToken}
                          </div>
                          <div className="text-gray-400 text-xs mt-2">
                            {`// Expires in 1 hour`}
                          </div>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-700">
                          <span className="text-gray-200 font-medium text-sm">Type:</span>
                          <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/50">Bearer</Badge>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-700">
                          <span className="text-gray-200 font-medium text-sm">Scopes:</span>
                          <span className="text-white text-sm">read:profile read:email</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-200 font-medium text-sm">Expires In:</span>
                          <span className="text-white text-sm">3600 seconds (1 hour)</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-900/50 border-2 border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <Database className="w-6 h-6 text-purple-400" />
                          Refresh Token
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-950 rounded-lg p-4 font-mono text-xs border-2 border-gray-800">
                          <div className="text-gray-200 break-all">
                            <span className="text-purple-400">refresh_token:</span> {refreshToken}
                          </div>
                          <div className="text-gray-400 text-xs mt-2">
                            {`// Use to get new access tokens when expired`}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Button
                      onClick={handleReset}
                      variant="secondary"
                      className="w-full py-6 bg-gray-800 hover:bg-gray-700 text-white border-2 border-gray-700"
                    >
                      Reset Demo
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
                Test your OAuth 2.0 knowledge with real-world scenarios.
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
