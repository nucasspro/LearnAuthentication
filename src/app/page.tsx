'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [_hoveredCard, setHoveredCard] = useState<number | null>(null);

  const specialOffers = [
    {
      id: 1,
      title: 'NEURAL CORE',
      subtitle: 'Upgrade your reflex loop. Boost aim assist, dodge speed, and critical hit timing.',
      description: 'Precision. Speed. Total control',
      price: '— for a price.',
      icon: '💾',
      bgColor: 'bg-neon-500/20',
      borderColor: 'border-neon-500',
    },
    {
      id: 2,
      title: 'EX-COIN',
      subtitle: 'Earned in combat. Spent on protocols, upgrades, and premium gear.',
      description: 'Encrypted. Trace-free. Yours forever.',
      icon: '🪙',
      bgColor: 'bg-neon-500/20',
      borderColor: 'border-neon-500',
    },
    {
      id: 3,
      title: 'ZX-G1 PISTOL',
      subtitle: 'Standard-issue sidearm for operatives running solo through neon warzones.',
      description: 'Upgradable. Silent. Deadly.',
      icon: '🔫',
      bgColor: 'bg-neon-500/20',
      borderColor: 'border-neon-500',
    },
  ];

  const learningPaths = [
    {
      id: 1,
      title: 'Session-Based Auth',
      description: 'Learn server-side sessions with HTTP-Only cookies and CSRF protection',
      icon: '🍪',
      color: 'from-blue-500 to-cyan-500',
      difficulty: 'Beginner',
      time: '30 min',
      link: '/session',
      demoLink: '/session',
    },
    {
      id: 2,
      title: 'JWT Tokens',
      description: 'Master stateless authentication with JSON Web Tokens and refresh tokens',
      icon: '🔑',
      color: 'from-neon-500 to-emerald-500',
      difficulty: 'Intermediate',
      time: '45 min',
      link: '/jwt/learn',
      demoLink: '/jwt/demo',
    },
    {
      id: 3,
      title: 'OAuth 2.0',
      description: 'Understand third-party authorization with Google, GitHub, and more',
      icon: '🔐',
      color: 'from-purple-500 to-pink-500',
      difficulty: 'Advanced',
      time: '60 min',
      link: '/oauth/learn',
      demoLink: '/oauth/demo',
    },
    {
      id: 4,
      title: 'Multi-Factor Auth',
      description: 'Implement TOTP-based 2FA with authenticator apps and backup codes',
      icon: '🛡️',
      color: 'from-orange-500 to-red-500',
      difficulty: 'Advanced',
      time: '45 min',
      link: '/mfa/learn',
      demoLink: '/mfa/demo',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-green-950 to-gray-950">
      {/* Hero Section with Gaming Theme */}
      <section className="relative container-custom py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(74, 255, 0, 0.1) 2px,
              rgba(74, 255, 0, 0.1) 4px
            )`
          }} />
        </div>

        <div className="relative z-10">
          {/* Main Title with Neon Effect */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="inline-block mb-6">
              <h1 className="text-7xl md:text-9xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-neon-400 to-neon-600 drop-shadow-[0_0_30px_rgba(74,255,0,0.5)]">
                PROTOCOL
              </h1>
            </div>

            {/* Tagline */}
            <div className="flex flex-col gap-2 mb-8">
              <p className="text-xl md:text-2xl text-neon-400 font-bold tracking-widest uppercase">
                JUST SMART CONTRACTS
              </p>
              <p className="text-lg md:text-xl text-gray-400 italic">
                NO MERCY
              </p>
            </div>

            {/* CTA Button */}
            <Link
              href="/session"
              className="inline-block px-12 py-4 bg-black border-2 border-neon-500 text-neon-400 font-black text-lg uppercase tracking-wider hover:bg-neon-500 hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(74,255,0,0.3)] hover:shadow-[0_0_40px_rgba(74,255,0,0.6)]"
            >
              CONTACT US
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="container-custom py-12">
        <div className="bg-gray-900/50 backdrop-blur-sm border-2 border-neon-500/30 p-8 md:p-12 rounded-none relative overflow-hidden">
          {/* Grid Pattern Background */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `linear-gradient(rgba(74, 255, 0, 0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(74, 255, 0, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />

          <div className="relative z-10 grid md:grid-cols-[2fr_3fr] gap-8 items-start">
            {/* Left Side - Title */}
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-black text-white uppercase leading-tight">
                SPECIAL<br />OFFERS
              </h2>
              <p className="text-gray-400 text-base leading-relaxed max-w-sm">
                A high-speed, neon-drenched shooter where reflexes rule and legends are forged.
              </p>
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300">
                VIEW MORE
              </button>
            </div>

            {/* Right Side - Offer Cards */}
            <div className="grid gap-4">
              {specialOffers.map((offer) => (
                <div
                  key={offer.id}
                  className={`${offer.bgColor} border-2 ${offer.borderColor} p-6 hover:shadow-[0_0_30px_rgba(74,255,0,0.3)] transition-all duration-300 group`}
                  onMouseEnter={() => setHoveredCard(offer.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      {offer.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-neon-400 uppercase tracking-wider mb-2">
                        {offer.title}
                      </h3>
                      <p className="text-sm text-gray-300 mb-3 leading-relaxed">
                        {offer.subtitle}
                      </p>
                      <p className="text-xs text-neon-300 italic mb-1">
                        {offer.description}
                      </p>
                      {offer.price && (
                        <p className="text-xs text-gray-500">
                          {offer.price}
                        </p>
                      )}
                    </div>
                    <button className="px-6 py-2 bg-neon-500 text-black font-bold text-sm uppercase hover:bg-neon-400 transition-colors duration-300">
                      EARN NOW
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="container-custom py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-wide">
            Choose Your <span className="text-neon-400">Protocol</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Start with the basics or jump to advanced topics. Each path includes theory, demos, and security best practices.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {learningPaths.map((path) => (
            <div
              key={path.id}
              className="bg-gray-900/80 backdrop-blur border-2 border-gray-700 hover:border-neon-500 p-6 group relative overflow-hidden transition-all duration-300"
              onMouseEnter={() => setHoveredCard(path.id + 10)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-500/0 to-neon-500/0 group-hover:from-neon-500/10 group-hover:to-neon-500/5 transition-all duration-300" />

              {/* Content */}
              <div className="relative z-10">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {path.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 uppercase">
                  {path.title}
                </h3>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                  {path.description}
                </p>

                {/* Meta Info */}
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-neon-500/20 border border-neon-500 text-neon-400 text-xs font-bold uppercase">
                    {path.difficulty}
                  </span>
                  <span className="px-3 py-1 bg-gray-800 border border-gray-600 text-gray-300 text-xs font-bold">
                    {path.time}
                  </span>
                </div>

                {/* Links */}
                <div className="flex gap-2">
                  <Link
                    href={path.link}
                    className="flex-1 px-4 py-2 bg-neon-500 text-black font-bold text-sm hover:bg-neon-400 transition-colors text-center uppercase"
                  >
                    Learn
                  </Link>
                  <Link
                    href={path.demoLink}
                    className="flex-1 px-4 py-2 bg-transparent border-2 border-gray-700 text-gray-300 font-bold text-sm hover:border-neon-500 hover:text-neon-400 transition-colors text-center uppercase"
                  >
                    Demo
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container-custom py-12 border-t border-gray-800">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h4 className="font-bold text-neon-400 mb-3 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="https://github.com" className="hover:text-neon-400 transition-colors">GitHub</a></li>
              <li><a href="/README.md" className="hover:text-neon-400 transition-colors">Documentation</a></li>
              <li><Link href="/comparison" className="hover:text-neon-400 transition-colors">Compare Auth Methods</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-neon-400 mb-3 uppercase tracking-wider">Standards</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="https://datatracker.ietf.org/doc/html/rfc6265" className="hover:text-neon-400 transition-colors">RFC 6265 - Cookies</a></li>
              <li><a href="https://datatracker.ietf.org/doc/html/rfc7519" className="hover:text-neon-400 transition-colors">RFC 7519 - JWT</a></li>
              <li><a href="https://datatracker.ietf.org/doc/html/rfc6749" className="hover:text-neon-400 transition-colors">RFC 6749 - OAuth 2.0</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-neon-400 mb-3 uppercase tracking-wider">Security</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="https://owasp.org" className="hover:text-neon-400 transition-colors">OWASP</a></li>
              <li><a href="https://cheatsheetseries.owasp.org" className="hover:text-neon-400 transition-colors">OWASP Cheat Sheets</a></li>
              <li><a href="https://owasp.org/www-project-top-ten/" className="hover:text-neon-400 transition-colors">OWASP Top 10</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>Built with precision for learning authentication the right way</p>
          <p className="mt-2">MIT License - Free for educational use</p>
        </div>
      </footer>
    </main>
  );
}
