'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const learningPaths = [
    {
      id: 1,
      title: 'Session-Based Auth',
      description: 'Learn server-side sessions with HTTP-Only cookies and CSRF protection',
      icon: '🍪',
      color: 'from-blue-500 to-cyan-500',
      difficulty: 'Beginner',
      time: '30 min',
      link: '/learn/session',
      demoLink: '/session',
    },
    {
      id: 2,
      title: 'JWT Tokens',
      description: 'Master stateless authentication with JSON Web Tokens and refresh tokens',
      icon: '🔑',
      color: 'from-green-500 to-emerald-500',
      difficulty: 'Intermediate',
      time: '45 min',
      link: '/learn/jwt',
      demoLink: '/jwt',
    },
    {
      id: 3,
      title: 'OAuth 2.0',
      description: 'Understand third-party authorization with Google, GitHub, and more',
      icon: '🔐',
      color: 'from-purple-500 to-pink-500',
      difficulty: 'Advanced',
      time: '60 min',
      link: '/learn/oauth',
      demoLink: '/oauth',
    },
    {
      id: 4,
      title: 'Multi-Factor Auth',
      description: 'Implement TOTP-based 2FA with authenticator apps and backup codes',
      icon: '🛡️',
      color: 'from-orange-500 to-red-500',
      difficulty: 'Advanced',
      time: '45 min',
      link: '/learn/mfa',
      demoLink: '/mfa',
    },
  ];

  const features = [
    {
      icon: '📚',
      title: 'Interactive Learning',
      description: 'Hands-on demos with real code examples and live simulations',
    },
    {
      icon: '🔒',
      title: 'Security Focused',
      description: 'OWASP guidelines, vulnerability explanations, and best practices',
    },
    {
      icon: '💻',
      title: 'Production Ready',
      description: 'Real-world patterns used by Django, Express, Rails, and ASP.NET',
    },
    {
      icon: '🎯',
      title: 'Comprehensive',
      description: 'Everything from basics to advanced topics like MFA and OAuth',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="container-custom py-20 md:py-32">
        <div className="text-center animate-fade-in-up">
          <div className="inline-block mb-4">
            <span className="text-6xl md:text-8xl">🔐</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 gradient-text">
            Learn Authentication
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Master web authentication through interactive demos, visualizations, and real implementations.
            From sessions to OAuth, learn it all.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/learn/session"
              className="btn btn-primary text-lg px-8 py-4 shadow-primary animate-fade-in-up animate-delay-100"
            >
              Start Learning →
            </Link>
            <Link
              href="/comparison"
              className="btn bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-lg px-8 py-4 border-2 border-gray-300 dark:border-gray-700 hover:border-primary-500 animate-fade-in-up animate-delay-200"
            >
              Compare Methods
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="animate-fade-in-up animate-delay-300">
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">4</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Auth Methods</div>
            </div>
            <div className="animate-fade-in-up animate-delay-500">
              <div className="text-4xl font-bold text-secondary-600 dark:text-secondary-400">10+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Live Demos</div>
            </div>
            <div className="animate-fade-in-up animate-delay-700">
              <div className="text-4xl font-bold text-success-600 dark:text-success-400">100%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Free & Open</div>
            </div>
            <div className="animate-fade-in-up animate-delay-1000">
              <div className="text-4xl font-bold text-warning-600 dark:text-warning-400">3hr</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Content</div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="container-custom py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Choose Your Path
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Start with the basics or jump to advanced topics. Each path includes theory, demos, and security best practices.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-fade-in">
          {learningPaths.map((path) => (
            <div
              key={path.id}
              className="card card-hover group relative overflow-hidden"
              onMouseEnter={() => setHoveredCard(path.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Gradient Background on Hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${path.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />

              {/* Content */}
              <div className="relative z-10">
                <div className="text-5xl mb-4">{path.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {path.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                  {path.description}
                </p>

                {/* Meta Info */}
                <div className="flex gap-2 mb-4">
                  <span className="badge badge-primary text-xs">{path.difficulty}</span>
                  <span className="badge bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs">
                    {path.time}
                  </span>
                </div>

                {/* Links */}
                <div className="flex gap-2">
                  <Link
                    href={path.link}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors text-center"
                  >
                    Learn
                  </Link>
                  <Link
                    href={path.demoLink}
                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-center"
                  >
                    Demo
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container-custom py-20 bg-white/50 dark:bg-gray-800/50 rounded-3xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Why Learn Here?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Built by developers, for developers. Everything you need to master auth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl hover:bg-white dark:hover:bg-gray-700 transition-colors animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-custom py-20">
        <div className="card gradient-primary text-white text-center p-12 md:p-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of developers learning authentication the right way.
            No sign-up required, completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/learn/session"
              className="px-8 py-4 bg-white text-primary-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Begin with Sessions
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-lg font-bold text-lg hover:bg-white/20 transition-colors"
            >
              Try Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container-custom py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="https://github.com" className="hover:text-primary-600 transition-colors">GitHub</a></li>
              <li><a href="/README.md" className="hover:text-primary-600 transition-colors">Documentation</a></li>
              <li><Link href="/comparison" className="hover:text-primary-600 transition-colors">Compare Auth Methods</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3">Standards</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="https://datatracker.ietf.org/doc/html/rfc6265" className="hover:text-primary-600 transition-colors">RFC 6265 - Cookies</a></li>
              <li><a href="https://datatracker.ietf.org/doc/html/rfc7519" className="hover:text-primary-600 transition-colors">RFC 7519 - JWT</a></li>
              <li><a href="https://datatracker.ietf.org/doc/html/rfc6749" className="hover:text-primary-600 transition-colors">RFC 6749 - OAuth 2.0</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3">Security</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="https://owasp.org" className="hover:text-primary-600 transition-colors">OWASP</a></li>
              <li><a href="https://cheatsheetseries.owasp.org" className="hover:text-primary-600 transition-colors">OWASP Cheat Sheets</a></li>
              <li><a href="https://owasp.org/www-project-top-ten/" className="hover:text-primary-600 transition-colors">OWASP Top 10</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Built with ❤️ for learning authentication the right way</p>
          <p className="mt-2">MIT License - Free for educational use</p>
        </div>
      </footer>
    </main>
  );
}
