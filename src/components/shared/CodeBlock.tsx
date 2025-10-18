/**
 * CodeBlock Component
 * Section 7.2 - Syntax-highlighted code display
 *
 * Displays code with:
 * - Syntax highlighting
 * - Line numbers
 * - Copy to clipboard
 * - Language detection
 *
 * This component is used throughout the learning platform
 * to show code examples and API responses
 */

'use client';

import React, { useState } from 'react';

interface CodeBlockProps {
  /**
   * The code to display
   */
  code: string;

  /**
   * Programming language for syntax highlighting
   */
  language: 'typescript' | 'javascript' | 'bash' | 'json' | 'html' | 'css' | 'python';

  /**
   * Optional: Lines to highlight (1-indexed)
   * @example [5, 6, 7] - highlight lines 5-7
   */
  highlight?: number[];

  /**
   * Optional: Show line numbers
   * @default true
   */
  showLineNumbers?: boolean;

  /**
   * Optional: Maximum height before scrolling
   * @default "500px"
   */
  maxHeight?: string;

  /**
   * Optional: Custom title/label
   */
  label?: string;

  /**
   * Optional: Show copy button
   * @default true
   */
  showCopy?: boolean;
}

/**
 * CodeBlock Component
 *
 * Renders a syntax-highlighted code block
 * Note: For a production app, use highlight.js or prism.js
 * This simplified version provides basic formatting
 */
export default function CodeBlock({
  code,
  language,
  highlight = [],
  showLineNumbers = true,
  maxHeight = '500px',
  label,
  showCopy = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  /**
   * Copy code to clipboard
   */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  /**
   * Get language-specific color class
   */
  const getLanguageColor = (lang: string) => {
    const colors: Record<string, string> = {
      typescript: 'bg-blue-50 border-blue-200',
      javascript: 'bg-yellow-50 border-yellow-200',
      bash: 'bg-gray-50 border-gray-200',
      json: 'bg-purple-50 border-purple-200',
      html: 'bg-red-50 border-red-200',
      css: 'bg-green-50 border-green-200',
      python: 'bg-yellow-50 border-yellow-200',
    };
    return colors[lang] || 'bg-gray-50 border-gray-200';
  };

  /**
   * Get language badge
   */
  const getLanguageBadge = () => {
    const badges: Record<string, string> = {
      typescript: '📘 TypeScript',
      javascript: '🟨 JavaScript',
      bash: '💻 Bash',
      json: '{ } JSON',
      html: '🌐 HTML',
      css: '🎨 CSS',
      python: '🐍 Python',
    };
    return badges[language] || language.toUpperCase();
  };

  const lines = code.split('\n');

  return (
    <div className={`border rounded-lg overflow-hidden ${getLanguageColor(language)}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono font-bold text-gray-700">{getLanguageBadge()}</span>
          {label && <span className="text-xs text-gray-600 ml-2">{label}</span>}
        </div>

        {showCopy && (
          <button
            onClick={handleCopy}
            className={`
              px-3 py-1 rounded text-sm font-medium transition-all
              ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }
            `}
            title="Copy to clipboard"
          >
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
        )}
      </div>

      {/* Code Block */}
      <div className={`overflow-x-auto`} style={{ maxHeight }}>
        <pre className="p-4 text-sm font-mono bg-white">
          <code>
            {lines.map((line, idx) => {
              const lineNumber = idx + 1;
              const isHighlighted = highlight.includes(lineNumber);

              return (
                <div
                  key={idx}
                  className={`
                    flex gap-4 ${isHighlighted ? 'bg-yellow-100 border-l-4 border-yellow-400 px-3' : 'px-0'}
                  `}
                >
                  {showLineNumbers && (
                    <span className="text-gray-500 select-none w-8 text-right">
                      {String(lineNumber).padStart(2, ' ')}
                    </span>
                  )}
                  <span className="text-gray-800">{line}</span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}

/**
 * Example CodeBlocks for common authentication patterns
 */

interface InlineCodeProps {
  code: string;
  language?: string;
}

/**
 * Inline code snippet (for use within text)
 */
export function InlineCode({ code, language = 'typescript' }: InlineCodeProps) {
  return (
    <code className="px-2 py-1 bg-gray-100 text-gray-900 rounded text-sm font-mono">
      {code}
    </code>
  );
}

/**
 * Common Code Examples
 */

export const CODE_EXAMPLES = {
  // Password Hashing
  HASH_PASSWORD: `import bcryptjs from 'bcryptjs';
import { BCRYPT_COST } from '@/lib/constants';

async function hashPassword(password: string) {
  const hash = await bcryptjs.hash(password, BCRYPT_COST);
  return hash;
}`,

  // Password Comparison
  COMPARE_PASSWORD: `import bcryptjs from 'bcryptjs';

async function comparePassword(password: string, hash: string) {
  const isValid = await bcryptjs.compare(password, hash);
  return isValid;
}`,

  // Session Creation
  CREATE_SESSION: `import { generateSessionId } from '@/lib/crypto';
import { createSession } from '@/lib/mock-db';
import { SESSION_EXPIRATION } from '@/lib/constants';

const sessionId = generateSessionId();
createSession(sessionId, {
  userId: user.id,
  createdAt: new Date(),
  expiresAt: new Date(Date.now() + SESSION_EXPIRATION),
  lastActivity: new Date(),
});`,

  // API Login Handler
  API_LOGIN: `export async function POST(req: Request) {
  const { username, password } = await req.json();

  // Find user
  const user = findUserByUsername(username);
  if (!user) {
    return Response.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }

  // Verify password
  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    return Response.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }

  // Create session
  const sessionId = generateSessionId();
  createSession(sessionId, {...});

  // Set cookie
  const response = Response.json({ user });
  response.headers.set(
    'Set-Cookie',
    \`SessionID=\${sessionId}; HttpOnly; Secure; SameSite=Strict\`
  );

  return response;
}`,

  // JWT Sign
  JWT_SIGN: `import jwt from 'jsonwebtoken';
import { JWT_EXPIRATION, JWT_CONFIG } from '@/lib/constants';

function signJWT(userId: number, email: string) {
  const token = jwt.sign(
    {
      sub: String(userId),
      email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + JWT_EXPIRATION,
    },
    process.env.JWT_SECRET!,
    { algorithm: 'HS256' }
  );
  return token;
}`,

  // JWT Verify
  JWT_VERIFY: `import jwt from 'jsonwebtoken';

function verifyJWT(token: string) {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // Handle refresh
    }
    return null;
  }
}`,

  // TOTP Setup
  TOTP_SETUP: `import speakeasy from 'speakeasy';

const secret = speakeasy.generateSecret({
  name: 'Auth Learning Platform (user@example.com)',
  issuer: 'Auth Learning Platform'
});

// secret.base32 -> show in QR code
// secret.ascii -> for manual entry`,

  // TOTP Verify
  TOTP_VERIFY: `import speakeasy from 'speakeasy';
import { MFA_WINDOW } from '@/lib/constants';

const verified = speakeasy.totp.verify({
  secret: userSecret,
  encoding: 'base32',
  token: userEnteredCode,
  window: MFA_WINDOW
});`,
} as const;

/**
 * Code Display Variants
 */

interface CodeBlockVariantProps {
  title?: string;
  code: string;
}

export function SecurityCodeBlock({ title, code }: CodeBlockVariantProps) {
  return (
    <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
      <h4 className="font-bold text-red-900 mb-2">⚠️ Security Consideration</h4>
      <CodeBlock code={code} language="typescript" label={title} showCopy />
    </div>
  );
}

export function BestPracticeCodeBlock({ title, code }: CodeBlockVariantProps) {
  return (
    <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
      <h4 className="font-bold text-green-900 mb-2">✅ Best Practice</h4>
      <CodeBlock code={code} language="typescript" label={title} showCopy />
    </div>
  );
}
