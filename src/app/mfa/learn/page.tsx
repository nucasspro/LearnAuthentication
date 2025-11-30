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
import { codeExamples, securityScenarios, challenges, mfaAuthContent } from '@/lib/content/mfa-auth';
import { Section, ProgressData } from '@/lib/types';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Clock, Lock, Shield, ShieldAlert, Smartphone, Key, Zap, Brain, GitBranch, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

export default function MFALearnPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMfaSetup, setShowMfaSetup] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
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
    const saved = localStorage.getItem('mfa-auth-progress');
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
    localStorage.setItem('mfa-auth-progress', JSON.stringify(progress));
  }, [progress]);

  const sections: Section[] = [
    { id: 'section-1', title: 'The Three Factors: Beyond Passwords', icon: 'Lock', category: 'essential', estimatedTime: 3 },
    { id: 'section-2', title: 'TOTP: Time-Based One-Time Passwords', icon: 'Clock', category: 'essential', estimatedTime: 3 },
    { id: 'section-3', title: 'Backup Codes: The Emergency Exit', icon: 'Shield', category: 'essential', estimatedTime: 4 },
    { id: 'section-4', title: 'FIDO2/WebAuthn: Passwordless Authentication', icon: 'Zap', category: 'important', estimatedTime: 5 },
    { id: 'section-5', title: 'MFA Deployment Strategies', icon: 'GitBranch', category: 'important', estimatedTime: 5 },
    { id: 'section-6', title: 'Recovery & Account Lockout Scenarios', icon: 'AlertTriangle', category: 'important', estimatedTime: 5 },
    { id: 'section-7', title: 'Adaptive MFA & Risk-Based Authentication', icon: 'Brain', category: 'advanced', estimatedTime: 7 },
    { id: 'section-8', title: 'MFA Attack Vectors & Defenses', icon: 'Shield', category: 'advanced', estimatedTime: 7 },
    { id: 'section-9', title: 'MFA Best Practices & Production Checklist', icon: 'CheckCircle2', category: 'advanced', estimatedTime: 6 },
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
        setIsLoggedIn(true);
        setShowMfaSetup(true);

        // Generate QR code for demo
        const secret = 'JBSWY3DPEHPK3PXP'; // Demo secret
        const otpauthUrl = `otpauth://totp/LearnAuth:${username}?secret=${secret}&issuer=LearnAuth`;
        const qrUrl = await QRCode.toDataURL(otpauthUrl);
        setQrCodeUrl(qrUrl);

        // Generate demo backup codes
        const codes = Array.from({ length: 10 }, (_, i) =>
          `${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
        );
        setBackupCodes(codes);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyTotp = () => {
    // Demo verification - accept any 6-digit code
    if (totpCode.length === 6 && /^\d+$/.test(totpCode)) {
      setMfaEnabled(true);
      setShowMfaSetup(false);
      setError('');
    } else {
      setError('Please enter a valid 6-digit code');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setMfaEnabled(false);
    setShowMfaSetup(false);
    setQrCodeUrl('');
    setTotpCode('');
    setError('');
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
            <ShieldAlert className="w-12 h-12 text-neon-400 drop-shadow-[0_0_15px_rgba(74,255,0,0.6)]" />
            <div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider text-white">
                {mfaAuthContent.storyHook.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <Badge className="bg-neon-500/20 text-neon-300 border border-neon-500/50 font-mono">
                  Clearance Level: {mfaAuthContent.storyHook.clearanceLevel}
                </Badge>
                <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-mono">
                  Status: {mfaAuthContent.storyHook.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-gray-950/50 border-l-4 border-neon-500">
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {mfaAuthContent.storyHook.narrative}
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
            {/* Section 1: The Three Factors */}
            <SectionCard
              {...sections[0]}
              isCompleted={progress.completedSections.includes(sections[0].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg">
                Multi-Factor Authentication (MFA) requires proof of identity across <span className="text-neon-400 font-semibold">multiple independent categories</span>. Think of it as a fortress with multiple gates - breaching one doesn&apos;t grant access.
              </p>

              <div className="bg-neon-950/30 border-2 border-neon-500/30 rounded-lg p-5 my-4">
                <h4 className="text-neon-300 font-bold mb-3 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  The Three Authentication Factors
                </h4>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-neon-400 font-bold">1.</span>
                    <div>
                      <strong className="text-neon-300">Knowledge Factor (Something You Know)</strong>
                      <p className="text-sm text-gray-400 mt-1">Password, PIN, security questions</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-neon-400 font-bold">2.</span>
                    <div>
                      <strong className="text-cyan-300">Possession Factor (Something You Have)</strong>
                      <p className="text-sm text-gray-400 mt-1">Physical device, security key, mobile phone, authenticator app</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-neon-400 font-bold">3.</span>
                    <div>
                      <strong className="text-purple-300">Inherence Factor (Something You Are)</strong>
                      <p className="text-sm text-gray-400 mt-1">Fingerprint, facial recognition, iris scan, voice</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-950/50 border border-cyan-500/30 rounded-lg p-4">
                  <h5 className="text-cyan-400 font-bold mb-2">Two-Factor (2FA)</h5>
                  <p className="text-sm text-gray-400">
                    Exactly 2 factors - typically password + TOTP code
                  </p>
                </div>
                <div className="bg-gray-950/50 border border-purple-500/30 rounded-lg p-4">
                  <h5 className="text-purple-400 font-bold mb-2">Multi-Factor (MFA)</h5>
                  <p className="text-sm text-gray-400">
                    2 or more factors - maximum security for high-value systems
                  </p>
                </div>
              </div>

              <Alert className="mt-4 bg-neon-950/20 border-neon-500/50">
                <AlertCircle className="w-5 h-5 text-neon-400" />
                <AlertDescription className="ml-2 text-gray-300">
                  <strong className="text-neon-300">Critical Rule:</strong> Factors must be independent. Password + security question is NOT multi-factor (both are knowledge).
                </AlertDescription>
              </Alert>
            </SectionCard>

            {/* Section 2: TOTP */}
            <SectionCard
              {...sections[1]}
              isCompleted={progress.completedSections.includes(sections[1].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                <span className="text-neon-400 font-bold">TOTP</span> (Time-Based One-Time Password, RFC 6238) is the most popular possession-factor implementation. It generates new codes every 30 seconds using only TIME and a SECRET.
              </p>

              <div className="space-y-3">
                {[
                  { num: 1, label: 'Server generates SECRET', desc: '256-bit random value', code: 'crypto.randomBytes(32)' },
                  { num: 2, label: 'Display QR code', desc: 'User scans with authenticator app', code: 'otpauth://totp/App:user@email.com?secret=...' },
                  { num: 3, label: 'Current time counter', desc: 'Unix timestamp / 30 seconds', code: 'counter = Math.floor(Date.now() / 1000 / 30)' },
                  { num: 4, label: 'Generate code', desc: 'HMAC-SHA1(secret, counter)', code: 'hash = HMAC-SHA1(secret, counter)' },
                  { num: 5, label: 'Extract 6 digits', desc: 'Display on authenticator app', code: 'code = "482917"' },
                  { num: 6, label: 'User enters code', desc: 'Server verifies match', code: 'verify(userCode, serverCode)' },
                  { num: 7, label: 'Allow time skew', desc: 'Accept ±1 time window (60s drift)', code: 'window: 2' },
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

              <CodeBlock examples={codeExamples.totpGeneration?.javascript || []} title="totp-implementation.js" />
            </SectionCard>

            {/* Section 3: Backup Codes */}
            <SectionCard
              {...sections[2]}
              isCompleted={progress.completedSections.includes(sections[2].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                <span className="text-neon-400 font-bold">Backup Codes</span> are single-use recovery codes that bypass MFA when the primary factor is unavailable (lost phone, app crash, battery dead).
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-2 border-neon-500/30 rounded-lg overflow-hidden">
                  <thead className="bg-gray-900 border-b-2 border-neon-500/30">
                    <tr>
                      <th className="px-4 py-3 text-left text-neon-300 font-black">Property</th>
                      <th className="px-4 py-3 text-left text-neon-300 font-black">Requirement</th>
                      <th className="px-4 py-3 text-left text-neon-300 font-black">Why It Matters</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-mono text-neon-400">Single-Use</td>
                      <td className="px-4 py-3 text-gray-300">Each code valid only once</td>
                      <td className="px-4 py-3 text-gray-400">Prevents replay attacks</td>
                    </tr>
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-mono text-cyan-400">Hashed Storage</td>
                      <td className="px-4 py-3 text-gray-300">Never store in plaintext</td>
                      <td className="px-4 py-3 text-gray-400">DB breach doesn&apos;t expose codes</td>
                    </tr>
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-mono text-purple-400">Rate Limited</td>
                      <td className="px-4 py-3 text-gray-300">Max 3 attempts per hour</td>
                      <td className="px-4 py-3 text-gray-400">Prevents brute-force guessing</td>
                    </tr>
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-mono text-green-400">User Downloads</td>
                      <td className="px-4 py-3 text-gray-300">Shown only once during setup</td>
                      <td className="px-4 py-3 text-gray-400">Forces immediate backup</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <Alert className="mt-4 bg-red-950/20 border-red-500/50">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <AlertDescription className="ml-2 text-gray-300">
                  <strong className="text-red-300">Critical:</strong> Backup codes are shown only ONCE during MFA setup. Users must download and save them securely (password manager, printed in safe).
                </AlertDescription>
              </Alert>
            </SectionCard>

            {/* Section 4: FIDO2/WebAuthn */}
            <SectionCard
              {...sections[3]}
              isCompleted={progress.completedSections.includes(sections[3].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                <span className="text-neon-400 font-bold">FIDO2/WebAuthn</span> represents the next evolution - authentication WITHOUT passwords using cryptographic keys stored on physical devices.
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-purple-500/30 rounded-lg p-4">
                  <Key className="w-8 h-8 text-purple-400 mb-3" />
                  <h4 className="text-purple-300 font-black mb-2">Platform Authenticator</h4>
                  <p className="text-xs text-gray-400 mb-3">Built-in fingerprint/face scanner</p>
                  <div className="space-y-1 text-xs">
                    <div className="text-green-400">+ Free (built into device)</div>
                    <div className="text-green-400">+ Convenient UX</div>
                    <div className="text-yellow-400">~ Device-specific</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-cyan-500/30 rounded-lg p-4">
                  <Shield className="w-8 h-8 text-cyan-400 mb-3" />
                  <h4 className="text-cyan-300 font-black mb-2">Cross-Platform</h4>
                  <p className="text-xs text-gray-400 mb-3">USB security key (YubiKey)</p>
                  <div className="space-y-1 text-xs">
                    <div className="text-green-400">+ Most secure</div>
                    <div className="text-green-400">+ Phishing-resistant</div>
                    <div className="text-yellow-400">~ $20-50 cost</div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-neon-500/30 rounded-lg p-4">
                  <Smartphone className="w-8 h-8 text-neon-400 mb-3" />
                  <h4 className="text-neon-300 font-black mb-2">Hybrid Transport</h4>
                  <p className="text-xs text-gray-400 mb-3">Phone as security key</p>
                  <div className="space-y-1 text-xs">
                    <div className="text-green-400">+ Free (app-based)</div>
                    <div className="text-green-400">+ Multi-device</div>
                    <div className="text-yellow-400">~ Requires Bluetooth</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-neon-950/30 border-2 border-neon-500/30 rounded-lg p-5">
                <h4 className="text-neon-300 font-black mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Why FIDO2 is Superior
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-neon-400 flex-shrink-0 mt-0.5" /> Phishing-resistant: Private key only signs for correct domain</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-neon-400 flex-shrink-0 mt-0.5" /> No shared secrets: Public key on server, private key never leaves device</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-neon-400 flex-shrink-0 mt-0.5" /> Instant revocation: Lost key simply removed from server</li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-neon-400 flex-shrink-0 mt-0.5" /> Quantum-resistant: Public key cryptography</li>
                </ul>
              </div>
            </SectionCard>

            {/* Section 5: MFA Deployment Strategies */}
            <SectionCard
              {...sections[4]}
              isCompleted={progress.completedSections.includes(sections[4].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                How you deploy MFA dramatically affects <span className="text-neon-400 font-bold">adoption rates</span> and user experience.
              </p>

              <div className="space-y-4">
                <div className="border-l-4 border-red-500 bg-red-950/30 p-4 rounded-r-lg">
                  <h4 className="text-red-300 font-black mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-red-500 text-black rounded-full flex items-center justify-center text-sm">1</span>
                    Mandatory MFA (Maximum Security)
                  </h4>
                  <p className="text-sm text-gray-300 mb-2">ALL users MUST enable 2FA. No workarounds or exemptions.</p>
                  <div className="text-xs text-gray-400">
                    <strong className="text-red-300">Best for:</strong> Banking, healthcare, government
                  </div>
                </div>

                <div className="border-l-4 border-cyan-500 bg-cyan-950/30 p-4 rounded-r-lg">
                  <h4 className="text-cyan-300 font-black mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-cyan-500 text-black rounded-full flex items-center justify-center text-sm">2</span>
                    Strongly Recommended (User Choice)
                  </h4>
                  <p className="text-sm text-gray-300 mb-2">Encourage users but allow skip. Show prominent prompts.</p>
                  <div className="text-xs text-gray-400">
                    <strong className="text-cyan-300">Best for:</strong> SaaS platforms, general users (~30% adoption)
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 bg-purple-950/30 p-4 rounded-r-lg">
                  <h4 className="text-purple-300 font-black mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-purple-500 text-black rounded-full flex items-center justify-center text-sm">3</span>
                    Risk-Based MFA (Context-Aware)
                  </h4>
                  <p className="text-sm text-gray-300 mb-2">Require MFA only for suspicious logins. Normal logins skip.</p>
                  <div className="text-xs text-gray-400">
                    <strong className="text-purple-300">Best for:</strong> Balancing security and usability
                  </div>
                </div>

                <div className="border-l-4 border-neon-500 bg-neon-950/30 p-4 rounded-r-lg">
                  <h4 className="text-neon-300 font-black mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 bg-neon-500 text-black rounded-full flex items-center justify-center text-sm">4</span>
                    Graduated Rollout (Progressive)
                  </h4>
                  <p className="text-sm text-gray-300 mb-2">Start opt-in → recommended → mandatory over time.</p>
                  <div className="text-xs text-gray-400">
                    <strong className="text-neon-300">Best for:</strong> Large user bases, phased adoption
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Section 6: Recovery & Account Lockout */}
            <SectionCard
              {...sections[5]}
              isCompleted={progress.completedSections.includes(sections[5].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                MFA creates new challenges: What happens when users <span className="text-neon-400 font-bold">lose their authenticator</span>? How do they recover?
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-neon-500/30 rounded-lg p-4">
                  <h4 className="text-neon-300 font-black mb-3">Common Lockout Scenarios</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> Phone lost/stolen/factory-reset</li>
                    <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> Authenticator app crashes</li>
                    <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> Device clock drift (wrong time zone)</li>
                    <li className="flex gap-2"><AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> Lost backup codes</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-cyan-500/30 rounded-lg p-4">
                  <h4 className="text-cyan-300 font-black mb-3">Recovery Methods</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" /> Primary: Backup codes</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" /> Secondary: Email verification</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" /> Tertiary: Security questions</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" /> Final: Support ticket</li>
                  </ul>
                </div>
              </div>

              <Alert className="mt-4 bg-yellow-950/20 border-yellow-500/50">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <AlertDescription className="ml-2 text-gray-300">
                  <strong className="text-yellow-300">Best Practice:</strong> Combine multiple recovery methods. Email alone is insufficient (email = single point of failure). Use email + security questions + support ticket.
                </AlertDescription>
              </Alert>
            </SectionCard>

            {/* Section 7: Adaptive MFA */}
            <SectionCard
              {...sections[6]}
              isCompleted={progress.completedSections.includes(sections[6].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                Modern authentication systems don&apos;t demand MFA for every login - they <span className="text-neon-400 font-bold">intelligently adapt</span> based on risk.
              </p>

              <div className="bg-neon-950/30 border-2 border-neon-500/30 rounded-lg p-5 mb-4">
                <h4 className="text-neon-300 font-black mb-3">Risk Scoring Model</h4>
                <pre className="text-sm text-gray-300 font-mono bg-gray-950 p-3 rounded border border-gray-800">
{`Risk Score = (Device Risk × 0.4) +
             (Location Risk × 0.3) +
             (Time Risk × 0.2) +
             (Behavior Risk × 0.1)

Risk Threshold = 0.5 (MFA required if > 0.5)`}
                </pre>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-2 border-neon-500/30 rounded-lg overflow-hidden">
                  <thead className="bg-gray-900 border-b-2 border-neon-500/30">
                    <tr>
                      <th className="px-4 py-3 text-left text-neon-300 font-black">Risk Score</th>
                      <th className="px-4 py-3 text-left text-neon-300 font-black">Action</th>
                      <th className="px-4 py-3 text-left text-neon-300 font-black">User Experience</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-mono text-green-400">&lt; 0.2</td>
                      <td className="px-4 py-3 text-gray-300">Allow login</td>
                      <td className="px-4 py-3 text-gray-400">No friction</td>
                    </tr>
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-mono text-cyan-400">0.2 - 0.4</td>
                      <td className="px-4 py-3 text-gray-300">Soft prompt</td>
                      <td className="px-4 py-3 text-gray-400">Would you like to enable 2FA?</td>
                    </tr>
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-mono text-yellow-400">0.4 - 0.6</td>
                      <td className="px-4 py-3 text-gray-300">Require MFA</td>
                      <td className="px-4 py-3 text-gray-400">Please verify with 2FA code</td>
                    </tr>
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-mono text-orange-400">0.6 - 0.8</td>
                      <td className="px-4 py-3 text-gray-300">Step-up auth</td>
                      <td className="px-4 py-3 text-gray-400">Multiple MFA factors required</td>
                    </tr>
                    <tr className="hover:bg-neon-500/5">
                      <td className="px-4 py-3 font-mono text-red-400">&gt; 0.8</td>
                      <td className="px-4 py-3 text-gray-300">Block + alert</td>
                      <td className="px-4 py-3 text-gray-400">Login blocked. Check email.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </SectionCard>

            {/* Section 8: Security Scenarios */}
            <SectionCard
              {...sections[7]}
              isCompleted={progress.completedSections.includes(sections[7].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                Even with MFA enabled, attackers have <span className="text-red-400 font-bold">sophisticated techniques</span>. Here are the most common attack vectors and defenses.
              </p>

              <div className="space-y-4">
                {securityScenarios.map(scenario => (
                  <SecurityScenario key={scenario.id} {...scenario} />
                ))}
              </div>
            </SectionCard>

            {/* Section 9: Best Practices */}
            <SectionCard
              {...sections[8]}
              isCompleted={progress.completedSections.includes(sections[8].id)}
              onComplete={handleSectionComplete}
            >
              <p className="text-lg mb-4">
                Production-grade <span className="text-neon-400 font-bold">MFA implementation checklist</span> - essential security practices every production system must follow.
              </p>

              <div className="space-y-3">
                {[
                  {
                    icon: Clock,
                    title: 'Rate Limit Setup & Verification',
                    desc: 'Max 5 setup attempts per hour | Max 5 verification attempts per 15 min',
                    detail: 'Prevents brute-force attacks on TOTP codes and backup codes',
                    color: 'neon',
                  },
                  {
                    icon: Shield,
                    title: 'Hash/Encrypt Secrets',
                    desc: 'Never store TOTP secrets or backup codes in plaintext',
                    detail: 'Use AES-256 GCM encryption with different keys per user',
                    color: 'cyan',
                  },
                  {
                    icon: CheckCircle2,
                    title: 'Single-Use Backup Codes',
                    desc: 'Mark codes as consumed after use',
                    detail: 'Prevents replay attacks if codes are intercepted',
                    color: 'purple',
                  },
                  {
                    icon: AlertTriangle,
                    title: 'Multi-Step Recovery',
                    desc: 'Email + security questions + device verification',
                    detail: 'Prevents account takeover even if email is compromised',
                    color: 'yellow',
                  },
                  {
                    icon: Lock,
                    title: 'Monitor & Alert',
                    desc: 'Log all MFA events and alert on suspicious activity',
                    detail: 'Track setup, verification failures, backup code usage, recovery attempts',
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
                      Rate limiting on setup & verification
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" defaultChecked />
                      Hash/encrypt secrets (never plaintext)
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" defaultChecked />
                      Single-use backup codes enforcement
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" />
                      Time window tolerance (±1-2 steps)
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" />
                      Multi-step account recovery
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" />
                      Log all MFA events
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" />
                      Alert user on suspicious activity
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                      <input type="checkbox" className="w-4 h-4 accent-neon-500" />
                      Support multiple MFA methods
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
                  Live Demo: TOTP MFA Setup & Verification
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
                          Login to Setup MFA
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                ) : showMfaSetup ? (
                  <div className="space-y-5">
                    <div className="bg-gradient-to-br from-neon-950/50 to-emerald-950/50 border-2 border-neon-500 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-neon-200 mb-3">Step 1: Scan QR Code</h3>
                      <p className="text-gray-300 mb-4">
                        Open your authenticator app (Google Authenticator, Authy, etc.) and scan this QR code:
                      </p>
                      {qrCodeUrl && (
                        <div className="flex justify-center p-4 bg-white rounded-lg">
                          <img src={qrCodeUrl} alt="TOTP QR Code" className="w-48 h-48" />
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-3 text-center">
                        Can&apos;t scan? Manual entry: <code className="bg-gray-950 text-neon-300 px-2 py-1 rounded">JBSWY3DPEHPK3PXP</code>
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-cyan-950/50 to-blue-950/50 border-2 border-cyan-500 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-cyan-200 mb-3">Step 2: Save Backup Codes</h3>
                      <p className="text-gray-300 mb-3 text-sm">
                        Download these codes and store them securely. Each code can only be used once.
                      </p>
                      <div className="grid grid-cols-2 gap-2 bg-gray-950 p-4 rounded-lg border-2 border-gray-800">
                        {backupCodes.map((code, idx) => (
                          <div key={idx} className="font-mono text-sm text-neon-300">
                            {code}
                          </div>
                        ))}
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
                        Step 3: Enter 6-Digit Code from App
                      </label>
                      <Input
                        type="text"
                        value={totpCode}
                        onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="123456"
                        className="bg-gray-950 border-2 border-gray-700 text-white placeholder:text-gray-400 text-center text-2xl font-mono tracking-widest"
                        maxLength={6}
                      />
                    </div>

                    <Button
                      onClick={handleVerifyTotp}
                      className="w-full bg-gradient-to-r from-neon-600 to-neon-500 hover:from-neon-700 hover:to-neon-600 text-black font-semibold py-6"
                    >
                      Verify & Enable MFA
                      <CheckCircle2 className="w-5 h-5 ml-2" />
                    </Button>

                    <Button
                      onClick={handleLogout}
                      variant="secondary"
                      className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white border-2 border-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : mfaEnabled ? (
                  <div className="space-y-5">
                    <div className="bg-gradient-to-br from-neon-950/50 to-emerald-950/50 border-2 border-neon-500 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 className="w-8 h-8 text-neon-400" />
                        <h3 className="text-2xl font-bold text-neon-200">MFA Enabled Successfully!</h3>
                      </div>
                      <p className="text-neon-100 text-lg">
                        Your account is now protected with multi-factor authentication
                      </p>
                    </div>

                    <Card className="bg-gray-900/50 border-2 border-gray-700">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                          <ShieldAlert className="w-6 h-6 text-neon-400" />
                          MFA Configuration
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-700">
                          <span className="text-gray-200 font-medium text-sm">Username:</span>
                          <span className="text-white font-semibold">{username}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-700">
                          <span className="text-gray-200 font-medium text-sm">MFA Method:</span>
                          <Badge className="bg-neon-500/20 text-neon-300 border border-neon-500/50">
                            TOTP (Time-Based)
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-700">
                          <span className="text-gray-200 font-medium text-sm">Status:</span>
                          <Badge className="bg-green-500/20 text-green-300 border border-green-500/50">
                            Active
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-200 font-medium text-sm">Backup Codes:</span>
                          <span className="text-white text-sm">10 codes generated</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Alert className="bg-cyan-950/20 border-cyan-500/50">
                      <AlertCircle className="w-5 h-5 text-cyan-400" />
                      <AlertDescription className="ml-2 text-gray-300">
                        <strong className="text-cyan-300">Next Login:</strong> You&apos;ll be asked for your password AND a 6-digit code from your authenticator app. Make sure you saved your backup codes!
                      </AlertDescription>
                    </Alert>

                    <Button
                      onClick={handleLogout}
                      variant="secondary"
                      className="w-full py-6 bg-gray-800 hover:bg-gray-700 text-white border-2 border-gray-700"
                    >
                      Logout
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Challenges Section */}
            <div className="space-y-4">
              <h2 className="text-3xl font-black uppercase tracking-wider text-white flex items-center gap-3">
                <Zap className="w-8 h-8 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                Interactive Challenges
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Test your MFA knowledge with real-world scenarios.
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
