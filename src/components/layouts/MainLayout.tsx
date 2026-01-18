/**
 * MainLayout Component
 * Section 7.1 - Main application layout wrapper
 *
 * Provides the overall structure for all pages:
 * - Header with logo and auth status
 * - Sidebar with navigation
 * - Main content area
 * - Footer with info
 *
 * This layout wraps all page content and provides consistent navigation
 */

'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * Navigation Items
 * Links shown in sidebar for learning sections
 */
const NAV_ITEMS = [
  {
    label: '🏠 Home',
    href: '/',
    description: 'Learning hub - Choose your topic',
  },
  {
    label: '🍪 Session Auth',
    href: '/session-demo',
    description: 'Session & Cookie authentication',
  },
  {
    label: '🔐 JWT Auth',
    href: '/jwt-demo',
    description: 'JSON Web Token authentication',
  },
  {
    label: '🌐 OAuth 2.0',
    href: '/oauth-demo',
    description: 'OAuth 2.0 authorization flow',
  },
  {
    label: '🔑 MFA/2FA',
    href: '/mfa-demo',
    description: 'Multi-factor authentication',
  },
  {
    label: '📊 Dashboard',
    href: '/dashboard',
    description: 'Protected resource (auth required)',
  },
];

/**
 * MainLayout Component
 *
 * Renders the complete page layout with:
 * - Fixed header (top)
 * - Collapsible sidebar (left)
 * - Main content area (center)
 * - Footer (bottom)
 *
 * Uses Tailwind CSS for responsive design
 * Mobile-friendly: Sidebar collapses on small screens
 */
export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-white/20 rounded"
                aria-label="Toggle sidebar"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <Link href="/" className="flex items-center gap-2 hover:opacity-90">
                <span className="text-2xl">🔐</span>
                <div>
                  <h1 className="text-xl font-bold">Auth Learning Platform</h1>
                  <p className="text-sm text-blue-100">Master authentication mechanisms</p>
                </div>
              </Link>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-sm">
                <p className="text-blue-100">Learning Mode</p>
                <p className="font-semibold">Interactive Platform</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
            bg-white border-r border-gray-200 shadow-md
            w-64 overflow-y-auto transition-all duration-300
            fixed lg:relative h-full lg:h-auto z-40
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Learning Path</h2>

            {/* Navigation Links */}
            <nav className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="
                    block p-3 rounded-lg transition-colors
                    hover:bg-blue-50 text-gray-700 hover:text-blue-600
                    border-l-4 border-transparent hover:border-blue-600
                  "
                  title={item.description}
                >
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </Link>
              ))}
            </nav>

            {/* Info Section */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Tip</h3>
              <p className="text-sm text-blue-800">
                Start with Session Auth to understand the basics, then explore JWT, OAuth, and
                MFA for more advanced concepts.
              </p>
            </div>

            {/* Test Users Info */}
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">👤 Test Users</h3>
              <div className="text-xs space-y-1 text-gray-700">
                <div>
                  <strong>admin</strong> / admin123
                </div>
                <div>
                  <strong>user</strong> / user123
                </div>
                <div>
                  <strong>demo</strong> / demo123
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Overlay (Mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 lg:hidden z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: About */}
            <div>
              <h3 className="text-white font-semibold mb-4">About This Platform</h3>
              <p className="text-sm">
                An interactive learning platform to master authentication mechanisms including
                Sessions, JWT, OAuth 2.0, and MFA.
              </p>
            </div>

            {/* Column 2: Resources */}
            <div>
              <h3 className="text-white font-semibold mb-4">Standards & References</h3>
              <ul className="text-sm space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition">
                    RFC 6265 - HTTP Cookies
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    RFC 7519 - JWT
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    RFC 6749 - OAuth 2.0
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Info */}
            <div>
              <h3 className="text-white font-semibold mb-4">Info</h3>
              <p className="text-sm">
                <strong>Status:</strong> Learning/Development
              </p>
              <p className="text-sm mt-2">
                <strong>Version:</strong> Phase 2 (Core Components)
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>
              Built with Next.js, React, TypeScript, and Tailwind CSS for educational purposes.
            </p>
            <p className="mt-2">
              🔐 Master authentication • 🚀 Learn security best practices • 💡 Understand RFCs
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
