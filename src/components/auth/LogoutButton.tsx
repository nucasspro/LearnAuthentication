/**
 * LogoutButton Component
 * Section 7.2 - Logout action button
 *
 * Simple button that triggers logout
 * Calls API to invalidate session/token
 * Used in protected pages (dashboard, etc.)
 *
 * Demonstrates:
 * - Async button action
 * - Loading state during API call
 * - Error handling
 * - Confirmation dialog (optional)
 */

'use client';

import { useState } from 'react';

interface LogoutButtonProps {
  /**
   * Callback when logout is clicked
   * Should call API to invalidate session/token
   */
  onLogout: () => Promise<void>;

  /**
   * Optional: Show confirmation dialog before logout
   * @default true
   */
  showConfirm?: boolean;

  /**
   * Optional: Variant for button styling
   * @default "default"
   */
  variant?: 'default' | 'danger' | 'icon';

  /**
   * Optional: Button label
   * @default "Logout"
   */
  label?: string;

  /**
   * Optional: Callback after successful logout
   */
  onSuccess?: () => void;

  /**
   * Optional: Callback on error
   */
  onError?: (error: Error) => void;
}

interface LogoutButtonState {
  isLoading: boolean;
  error: string | null;
  showConfirm: boolean;
}

/**
 * LogoutButton Component
 *
 * Renders a logout button with optional confirmation
 * Displays loading state during logout process
 * Shows error message if logout fails
 */
export default function LogoutButton({
  onLogout,
  showConfirm: shouldShowConfirm = true,
  variant = 'default',
  label = 'Logout',
  onSuccess,
  onError,
}: LogoutButtonProps) {
  const [state, setState] = useState<LogoutButtonState>({
    isLoading: false,
    error: null,
    showConfirm: false,
  });

  /**
   * Handle logout click
   * Shows confirmation dialog if enabled
   */
  const handleLogoutClick = () => {
    if (shouldShowConfirm) {
      setState((prev) => ({ ...prev, showConfirm: true }));
    } else {
      performLogout();
    }
  };

  /**
   * Perform the actual logout
   */
  const performLogout = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null, showConfirm: false }));

    try {
      await onLogout();
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
      onSuccess?.();
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Logout failed');
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorObj.message,
      }));
      onError?.(errorObj);
    }
  };

  /**
   * Cancel confirmation dialog
   */
  const handleCancel = () => {
    setState((prev) => ({ ...prev, showConfirm: false }));
  };

  const { isLoading, error, showConfirm } = state;

  // Render based on variant
  if (variant === 'icon') {
    return (
      <>
        <button
          onClick={handleLogoutClick}
          disabled={isLoading}
          title="Logout"
          className="
            p-2 rounded-lg transition-colors
            hover:bg-red-100 text-red-600 hover:text-red-700
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <span>🚪</span>
          )}
        </button>

        {/* Confirmation Dialog for Icon Variant */}
        {showConfirm && (
          <ConfirmationDialog onConfirm={performLogout} onCancel={handleCancel} />
        )}
      </>
    );
  }

  // Danger variant
  if (variant === 'danger') {
    return (
      <>
        <button
          onClick={handleLogoutClick}
          disabled={isLoading}
          className="
            px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold
            rounded-lg transition-colors duration-200
            disabled:bg-gray-400 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          "
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Logging out...</span>
            </>
          ) : (
            <>
              <span>🚪</span>
              <span>{label}</span>
            </>
          )}
        </button>

        {/* Error Alert */}
        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Confirmation Dialog */}
        {showConfirm && (
          <ConfirmationDialog onConfirm={performLogout} onCancel={handleCancel} />
        )}
      </>
    );
  }

  // Default variant
  return (
    <>
      <button
        onClick={handleLogoutClick}
        disabled={isLoading}
        className="
          px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold
          rounded-lg transition-colors duration-200
          disabled:bg-gray-400 disabled:cursor-not-allowed
          flex items-center justify-center gap-2
        "
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Logging out...</span>
          </>
        ) : (
          <>
            <span>🚪</span>
            <span>{label}</span>
          </>
        )}
      </button>

      {/* Error Alert */}
      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirm && (
        <ConfirmationDialog onConfirm={performLogout} onCancel={handleCancel} />
      )}
    </>
  );
}

/**
 * Confirmation Dialog Component
 * Shown before logout to prevent accidental logouts
 */
interface ConfirmationDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmationDialog({ onConfirm, onCancel }: ConfirmationDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Logout</h3>
        <p className="text-gray-600 mb-6">Are you sure you want to logout? Your session will be ended.</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="
              flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900
              font-semibold rounded-lg transition-colors
            "
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="
              flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white
              font-semibold rounded-lg transition-colors
            "
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
