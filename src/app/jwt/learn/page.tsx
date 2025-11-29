/**
 * JWT (JSON Web Token) Learning Page
 * Comprehensive guide to stateless authentication
 * Reference: SPECIFICATION Section 4.2, RFC 7519
 */

'use client';

import { Button } from '@/components/shared';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LearnJWTPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-green-950 to-gray-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 text-neon-400 hover:text-neon-300 hover:bg-neon-500/10 border border-neon-500/30"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 uppercase tracking-wider drop-shadow-[0_0_20px_rgba(74,255,0,0.3)]">
            JWT <span className="text-neon-400">(JSON Web Token)</span>
          </h1>
          <p className="text-lg text-gray-300 mb-4">
            Learn how stateless authentication works with cryptographically signed tokens
          </p>
          <div className="flex gap-3">
            <span className="px-3 py-1 bg-neon-500/20 border border-neon-500 text-neon-400 text-xs font-bold uppercase">
              RFC 7519
            </span>
            <span className="px-3 py-1 bg-neon-500/20 border border-neon-500 text-neon-400 text-xs font-bold uppercase">
              Stateless
            </span>
            <span className="px-3 py-1 bg-neon-500/20 border border-neon-500 text-neon-400 text-xs font-bold uppercase">
              Scalable
            </span>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 auto-rows-auto">

          {/* What is JWT - Spans 2 columns */}
          <section className="lg:col-span-2 bg-gray-900/80 backdrop-blur border-2 border-neon-500/30 p-6 hover:border-neon-500/50 transition-all duration-300">
            <h2 className="text-2xl font-black text-neon-400 mb-4 uppercase tracking-wide">What is JWT?</h2>
            <p className="text-gray-200 mb-4 leading-relaxed">
              A JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties. Unlike sessions, JWTs are <strong className="text-neon-300">stateless</strong> - all user information is encoded in the token itself.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-neon-500/10 border-l-4 border-neon-500 p-4">
                <h3 className="font-bold text-neon-300 mb-2 text-sm uppercase">Advantages</h3>
                <ul className="space-y-1 text-sm text-gray-100">
                  <li className="flex gap-2">
                    <span className="text-neon-400">✓</span>
                    <div><strong className="text-white">Stateless:</strong> No session storage needed</div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neon-400">✓</span>
                    <div><strong className="text-white">Scalable:</strong> Works across servers</div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-neon-400">✓</span>
                    <div><strong className="text-white">Mobile-friendly:</strong> Perfect for apps</div>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4">
                <h3 className="font-bold text-amber-300 mb-2 text-sm uppercase">When NOT to Use</h3>
                <ul className="space-y-1 text-sm text-gray-100">
                  <li className="flex gap-2">
                    <span className="text-amber-400">⚠</span>
                    <div>Sensitive data in payload</div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-400">⚠</span>
                    <div>Need immediate revocation</div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-400">⚠</span>
                    <div>Large user data (increases size)</div>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* JWT Structure Example */}
          <section className="bg-gray-900/80 backdrop-blur border-2 border-neon-500/30 p-6 hover:border-neon-500/50 transition-all duration-300">
            <h2 className="text-xl font-black text-neon-400 mb-3 uppercase">Token Example</h2>
            <div className="bg-gray-950 border-2 border-neon-500/50 p-4 font-mono text-xs overflow-x-auto mb-3">
              <code className="block">
                <span className="text-red-300">eyJhbGci...</span>
                <span className="text-white">.</span>
                <span className="text-blue-300">eyJzdWIi...</span>
                <span className="text-white">.</span>
                <span className="text-purple-300">SflKxwRJ...</span>
              </code>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-gray-200">Header (Algorithm)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-gray-200">Payload (Claims)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span className="text-gray-200">Signature (Verify)</span>
              </div>
            </div>
          </section>

          {/* JWT Structure Details - 3 parts */}
          <div className="bg-blue-500/10 border-l-4 border-blue-500 p-5 hover:border-blue-500/70 transition-all duration-300">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-blue-500 text-white rounded flex items-center justify-center text-xs font-bold">1</div>
              <h3 className="font-bold text-white uppercase text-sm">Header</h3>
            </div>
            <p className="text-xs text-gray-200 mb-2">Algorithm and token type</p>
            <code className="block bg-gray-950 border-2 border-blue-500/50 text-blue-200 p-2 text-xs font-semibold">
              {`{ "alg": "HS256", "typ": "JWT" }`}
            </code>
          </div>

          <div className="bg-neon-500/10 border-l-4 border-neon-500 p-5 hover:border-neon-500/70 transition-all duration-300">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-neon-500 text-black rounded flex items-center justify-center text-xs font-bold">2</div>
              <h3 className="font-bold text-white uppercase text-sm">Payload</h3>
            </div>
            <p className="text-xs text-gray-200 mb-2">User data, claims, expiration</p>
            <code className="block bg-gray-950 border-2 border-neon-500/50 text-neon-200 p-2 text-xs font-semibold overflow-x-auto">
              {`{ "sub": "1234", "exp": 1735603200 }`}
            </code>
          </div>

          <div className="bg-purple-500/10 border-l-4 border-purple-500 p-5 hover:border-purple-500/70 transition-all duration-300">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-purple-500 text-white rounded flex items-center justify-center text-xs font-bold">3</div>
              <h3 className="font-bold text-white uppercase text-sm">Signature</h3>
            </div>
            <p className="text-xs text-gray-200 mb-2">HMAC-SHA256 verification</p>
            <code className="block bg-gray-950 border-2 border-purple-500/50 text-purple-200 p-2 text-xs font-semibold overflow-x-auto">
              SflKxwRJSMeKK...
            </code>
          </div>

          {/* How JWT Works - Authentication Flow */}
          <section className="lg:col-span-2 bg-gray-900/80 backdrop-blur border-2 border-neon-500/30 p-6 hover:border-neon-500/50 transition-all duration-300">
            <h2 className="text-2xl font-black text-neon-400 mb-4 uppercase tracking-wide">Authentication Flow</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { num: 1, title: 'Client → Server', desc: 'User submits credentials' },
                { num: 2, title: 'Server validates', desc: 'Verifies against database' },
                { num: 3, title: 'Server creates JWT', desc: 'Builds payload with claims' },
                { num: 4, title: 'Server signs JWT', desc: 'Uses secret key' },
                { num: 5, title: 'Server → Client', desc: 'Returns JWT in response' },
                { num: 6, title: 'Client stores token', desc: 'In localStorage or memory' },
                { num: 7, title: 'Client sends token', desc: 'Authorization header' },
                { num: 8, title: 'Server verifies', desc: 'Checks signature & expiration' },
              ].map((step) => (
                <div key={step.num} className="flex gap-3 items-start">
                  <div className="flex-shrink-0 w-7 h-7 bg-neon-500 text-black rounded-full flex items-center justify-center text-xs font-bold">
                    {step.num}
                  </div>
                  <div>
                    <strong className="text-white text-sm">{step.title}</strong>
                    <p className="text-xs text-gray-200">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* JWT Claims Table */}
          <section className="lg:row-span-2 bg-gray-900/80 backdrop-blur border-2 border-neon-500/30 p-6 hover:border-neon-500/50 transition-all duration-300">
            <h2 className="text-xl font-black text-neon-400 mb-4 uppercase">Standard Claims</h2>
            <div className="space-y-2 text-sm">
              {[
                { claim: 'sub', name: 'Subject', purpose: 'User ID' },
                { claim: 'iat', name: 'Issued At', purpose: 'Creation time' },
                { claim: 'exp', name: 'Expiration', purpose: 'When invalid' },
                { claim: 'iss', name: 'Issuer', purpose: 'Token creator' },
                { claim: 'aud', name: 'Audience', purpose: 'Intended for' },
                { claim: 'jti', name: 'JWT ID', purpose: 'Unique ID' },
              ].map((item) => (
                <div key={item.claim} className="border-l-2 border-blue-500/50 pl-3 py-1 hover:bg-blue-500/5">
                  <div className="flex items-center gap-2">
                    <code className="text-blue-300 font-mono font-bold">{item.claim}</code>
                    <span className="text-gray-100">-</span>
                    <span className="text-gray-100 font-semibold">{item.name}</span>
                  </div>
                  <p className="text-xs text-gray-300">{item.purpose}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-red-500/10 border-2 border-red-500/30 p-3">
              <h4 className="font-bold text-red-300 mb-1 text-xs uppercase">⚠️ Never Store</h4>
              <p className="text-xs text-gray-100">Passwords, SSN, credit cards, API keys</p>
            </div>
          </section>

          {/* Refresh Token Pattern */}
          <section className="lg:col-span-2 bg-gray-900/80 backdrop-blur border-2 border-neon-500/30 p-6 hover:border-neon-500/50 transition-all duration-300">
            <h2 className="text-2xl font-black text-neon-400 mb-4 uppercase">Refresh Token Pattern</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border-l-4 border-blue-500 bg-blue-500/10 p-4">
                <h3 className="text-lg font-bold text-blue-300 mb-2 uppercase">Access Token</h3>
                <ul className="text-sm text-gray-100 space-y-1">
                  <li>✓ <strong>Short-lived:</strong> 15 minutes</li>
                  <li>✓ <strong>Purpose:</strong> API access</li>
                  <li>✓ <strong>Storage:</strong> Memory/localStorage</li>
                  <li>✓ <strong>Risk:</strong> Limited if stolen</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 bg-purple-500/10 p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-2 uppercase">Refresh Token</h3>
                <ul className="text-sm text-gray-100 space-y-1">
                  <li>✓ <strong>Long-lived:</strong> 7 days</li>
                  <li>✓ <strong>Purpose:</strong> Get new access token</li>
                  <li>✓ <strong>Storage:</strong> HTTP-only cookie</li>
                  <li>✓ <strong>Security:</strong> Can be revoked</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 bg-emerald-500/10 border-2 border-emerald-500/30 p-3">
              <p className="text-emerald-200 text-sm">
                <strong>Benefits:</strong> User stays logged in for 7 days, but if access token is stolen, damage is limited to 15 minutes.
              </p>
            </div>
          </section>

          {/* Security Features */}
          <section className="lg:col-span-3 bg-gray-900/80 backdrop-blur border-2 border-neon-500/30 p-6 hover:border-neon-500/50 transition-all duration-300">
            <h2 className="text-2xl font-black text-neon-400 mb-4 uppercase">Security Features</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-blue-500/10 border-2 border-blue-500/50 p-4">
                <h3 className="font-bold text-white mb-2 text-sm uppercase">Signature Verification</h3>
                <p className="text-xs text-gray-100">Prevents tampering - any modification invalidates</p>
              </div>

              <div className="bg-orange-500/10 border-2 border-orange-500/50 p-4">
                <h3 className="font-bold text-white mb-2 text-sm uppercase">Expiration</h3>
                <p className="text-xs text-gray-100">Auto-invalidates after time. Typical: 15 min access</p>
              </div>

              <div className="bg-neon-500/10 border-2 border-neon-500/50 p-4">
                <h3 className="font-bold text-white mb-2 text-sm uppercase">Refresh Tokens</h3>
                <p className="text-xs text-gray-100">Long-lived token stored securely. Can be revoked</p>
              </div>

              <div className="bg-red-500/10 border-2 border-red-500/50 p-4">
                <h3 className="font-bold text-white mb-2 text-sm uppercase">Storage Warning</h3>
                <p className="text-xs text-gray-100"><strong>Never localStorage</strong> - Use httpOnly cookies</p>
              </div>
            </div>
          </section>

          {/* Vulnerabilities Table */}
          <section className="lg:col-span-3 bg-gray-900/80 backdrop-blur border-2 border-neon-500/30 p-6 hover:border-neon-500/50 transition-all duration-300">
            <h2 className="text-2xl font-black text-neon-400 mb-4 uppercase">Common Vulnerabilities</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { vuln: 'Token Theft', risk: 'XSS attack steals token', fix: 'Short expiration + HTTP-only cookies' },
                { vuln: 'Algorithm Confusion', risk: 'Bypass signature', fix: 'Explicitly verify algorithm' },
                { vuln: 'Secret Key Leakage', risk: 'Forges tokens', fix: 'Strong key + rotate + never commit' },
                { vuln: 'Token Reuse', risk: 'Replay attacks', fix: 'Add jti claim + blacklist' },
                { vuln: 'Long Expiration', risk: 'Valid for days/weeks', fix: 'Access: 15 min max' },
              ].map((item) => (
                <div key={item.vuln} className="bg-gray-800/50 border border-red-500/30 p-3 hover:border-red-500/50 transition-all">
                  <h4 className="font-bold text-red-300 text-sm mb-1">{item.vuln}</h4>
                  <p className="text-xs text-gray-200 mb-2">⚠️ {item.risk}</p>
                  <p className="text-xs text-neon-400">✓ {item.fix}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Real-World Use Cases */}
          <section className="lg:col-span-2 bg-gray-900/80 backdrop-blur border-2 border-neon-500/30 p-6 hover:border-neon-500/50 transition-all duration-300">
            <h2 className="text-2xl font-black text-neon-400 mb-4 uppercase">Real-World Use Cases</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '📱', title: 'Mobile Apps', desc: 'JWTs in Authorization header' },
                { icon: '⚛️', title: 'SPAs', desc: 'React, Vue, Angular apps' },
                { icon: '🔗', title: 'Microservices', desc: 'Independent verification' },
                { icon: '🌐', title: 'Cross-Domain', desc: 'Multiple domains' },
              ].map((item) => (
                <div key={item.title} className="border-2 border-gray-700 bg-gray-800/30 p-3 hover:border-neon-500/50 transition-all">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-100">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Best Practices */}
          <section className="bg-gray-900/80 backdrop-blur border-2 border-neon-500/30 p-6 hover:border-neon-500/50 transition-all duration-300">
            <h2 className="text-xl font-black text-neon-400 mb-4 uppercase">Best Practices</h2>
            <div className="space-y-2">
              {[
                'Always verify signature',
                'Check expiration',
                'Use HTTPS only',
                'Strong keys (256+ bits)',
                'Short expiration (15 min)',
                'Token rotation',
              ].map((practice) => (
                <div key={practice} className="flex gap-2 items-start">
                  <span className="text-neon-400 font-bold">✓</span>
                  <span className="text-sm text-white">{practice}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Try It Out CTA */}
          <section className="lg:col-span-3 bg-gradient-to-r from-neon-500/20 to-emerald-500/20 border-2 border-neon-500 p-6 hover:shadow-[0_0_30px_rgba(74,255,0,0.3)] transition-all duration-300">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white mb-2 uppercase">Try It Out</h2>
                <p className="text-gray-200">Experience JWT authentication with our interactive demo</p>
              </div>
              <button
                onClick={() => router.push('/jwt/demo')}
                className="px-8 py-3 bg-neon-500 text-black font-black text-base hover:bg-neon-400 transition-all duration-300 shadow-[0_0_20px_rgba(74,255,0,0.3)] hover:shadow-[0_0_40px_rgba(74,255,0,0.5)] uppercase tracking-wider whitespace-nowrap"
              >
                Go to JWT Demo →
              </button>
            </div>
          </section>

          {/* Further Reading */}
          <section className="lg:col-span-3 bg-gray-900/80 backdrop-blur border-2 border-neon-500/30 p-6 hover:border-neon-500/50 transition-all duration-300">
            <h2 className="text-2xl font-black text-neon-400 mb-4 uppercase">Further Reading</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              <a href="https://datatracker.ietf.org/doc/html/rfc7519" target="_blank" rel="noopener noreferrer" className="text-neon-400 hover:text-neon-300 hover:underline font-semibold text-sm transition-colors">
                RFC 7519 - JSON Web Token
              </a>
              <a href="https://datatracker.ietf.org/doc/html/rfc7518" target="_blank" rel="noopener noreferrer" className="text-neon-400 hover:text-neon-300 hover:underline font-semibold text-sm transition-colors">
                RFC 7518 - JWA
              </a>
              <a href="https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html" target="_blank" rel="noopener noreferrer" className="text-neon-400 hover:text-neon-300 hover:underline font-semibold text-sm transition-colors">
                OWASP - JWT Cheat Sheet
              </a>
              <a href="https://jwt.io" target="_blank" rel="noopener noreferrer" className="text-neon-400 hover:text-neon-300 hover:underline font-semibold text-sm transition-colors">
                JWT.io - Token Debugger
              </a>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
