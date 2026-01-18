/**
 * AuthStatus Component
 * Section 7.2 - Display current authentication status
 *
 * Shows the current user's authentication status
 * Displays user info when authenticated
 * Shows login prompt when not authenticated
 *
 * Demonstrates:
 * - State management for auth
 * - Conditional rendering
 * - User profile display
 * - Session/Token information
 */

'use client';

import { useEffect, useState } from 'react';
import { JWTPayload } from '@/lib/types';

interface AuthUser {
  id: number;
  username: string;
  email: string;
  role?: string;
}

interface AuthStatusProps {
  /**
   * Whether user is authenticated
   */
  isAuthenticated: boolean;

  /**
   * Current authenticated user
   */
  user?: AuthUser;

  /**
   * Current auth method
   */
  method?: 'session' | 'jwt';

  /**
   * Decoded JWT payload (if using JWT)
   */
  decodedToken?: JWTPayload;

  /**
   * Session ID (if using sessions)
   */
  sessionId?: string;

  /**
   * Time until session/token expires
   */
  expiresIn?: number;

  /**
   * Callback to logout
   */
  onLogout?: () => void;

  /**
   * Show detailed tech info
   * @default false
   */
  showDetails?: boolean;
}

/**
 * AuthStatus Component
 *
 * Renders authentication status indicator:
 * - Not authenticated: Shows "Not logged in" + login link
 * - Authenticated: Shows user info, method, expiration
 */
export default function AuthStatus({
  isAuthenticated,
  user,
  method = 'session',
  decodedToken,
  sessionId,
  expiresIn,
  onLogout,
  showDetails = false,
}: AuthStatusProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Update time remaining every second
  useEffect(() => {
    if (!expiresIn || expiresIn <= 0) return;

    const updateTimer = () => {
      const remaining = expiresIn * 1000 - (Date.now() % (expiresIn * 1000));
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setTimeRemaining(`${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresIn]);

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔓</span>
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-900">Not Authenticated</h3>
            <p className="text-sm text-yellow-800">You are not currently logged in</p>
          </div>
          <a
            href="/login"
            className="
              px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white
              font-semibold rounded transition-colors text-sm
            "
          >
            Login
          </a>
        </div>
      </div>
    );
  }

  // Authenticated state
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      {/* Main Status */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">🔐</span>
        <div className="flex-1">
          <h3 className="font-semibold text-green-900">Authenticated</h3>
          <p className="text-sm text-green-800">
            {user?.username && `Logged in as ${user.username}`}
          </p>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            className="
              px-4 py-2 bg-red-600 hover:bg-red-700 text-white
              font-semibold rounded transition-colors text-sm
            "
          >
            Logout
          </button>
        )}
      </div>

      {/* User Info */}
      {user && (
        <div className="grid grid-cols-2 gap-2 mb-3 text-sm border-t border-green-200 pt-3">
          <div>
            <span className="text-green-700 font-semibold">Username:</span>
            <p className="text-green-800 font-mono">{user.username}</p>
          </div>
          <div>
            <span className="text-green-700 font-semibold">User ID:</span>
            <p className="text-green-800 font-mono">{user.id}</p>
          </div>
          <div>
            <span className="text-green-700 font-semibold">Email:</span>
            <p className="text-green-800 font-mono text-xs">{user.email}</p>
          </div>
          {user.role && (
            <div>
              <span className="text-green-700 font-semibold">Role:</span>
              <p className="text-green-800 font-mono">{user.role}</p>
            </div>
          )}
        </div>
      )}

      {/* Auth Method Info */}
      <div className="text-sm border-t border-green-200 pt-3 mb-3">
        <span className="text-green-700 font-semibold">Auth Method:</span>
        <div className="flex items-center gap-2 mt-1">
          <span className="px-3 py-1 bg-green-200 text-green-900 rounded font-mono text-xs font-bold">
            {method.toUpperCase()}
          </span>
          {method === 'session' && <span className="text-sm text-green-700">Session-based authentication</span>}
          {method === 'jwt' && <span className="text-sm text-green-700">JWT token-based authentication</span>}
        </div>
      </div>

      {/* Expiration Info */}
      {expiresIn && (
        <div className="text-sm border-t border-green-200 pt-3 mb-3">
          <span className="text-green-700 font-semibold">Expires In:</span>
          <p className="text-green-800 font-mono mt-1">
            {timeRemaining || `${Math.floor(expiresIn / 60)} minutes`}
          </p>
        </div>
      )}

      {/* Technical Details */}
      {showDetails && (
        <div className="mt-3 p-3 bg-green-100 rounded border border-green-300">
          <h4 className="font-semibold text-green-900 mb-2">Technical Details</h4>

          {sessionId && (
            <div className="mb-2">
              <span className="text-green-700 font-semibold text-sm">Session ID:</span>
              <p className="text-green-800 font-mono text-xs break-all">{sessionId}</p>
            </div>
          )}

          {decodedToken && (
            <div>
              <span className="text-green-700 font-semibold text-sm">JWT Claims:</span>
              <pre className="text-green-800 font-mono text-xs bg-white rounded p-2 overflow-x-auto mt-1">
                {JSON.stringify(decodedToken, null, 2)}
              </pre>
            </div>
          )}

          {method === 'jwt' && !decodedToken && (
            <p className="text-sm text-green-700">
              JWT token available but not decoded. Use network inspector to see full token.
            </p>
          )}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-3 p-2 bg-green-100 rounded text-sm text-green-800">
        <p>
          ✅ <strong>Secure</strong> - Your session is protected with HttpOnly, Secure, and SameSite flags
        </p>
      </div>
    </div>
  );
}

/**
 * StatusBadge Component
 * Compact version for showing auth status in headers/navbars
 */
interface StatusBadgeProps {
  isAuthenticated: boolean;
  username?: string;
}

export function StatusBadge({ isAuthenticated, username }: StatusBadgeProps) {
  if (!isAuthenticated) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
        <span>🔓</span> Not logged in
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
      <span>✅</span> {username || 'Authenticated'}
    </span>
  );
}
