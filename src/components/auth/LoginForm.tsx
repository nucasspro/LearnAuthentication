/**
 * LoginForm Component
 * Section 7.2 - User login form
 *
 * Interactive form for username/password authentication
 * Handles validation, error display, and loading states
 *
 * This component demonstrates:
 * - Form handling with React hooks (useState)
 * - Client-side validation
 * - Error display & user feedback
 * - Loading states (UX best practice)
 * - Password field security (masking)
 */

'use client';

import React, { useState } from 'react';

interface LoginFormProps {
  /**
   * Callback when form is submitted
   * Should make API call to /api/auth/login
   */
  onSubmit: (username: string, password: string) => Promise<void>;

  /**
   * Optional: Show loading state from parent
   */
  isLoading?: boolean;

  /**
   * Optional: Error message from parent
   */
  error?: string;
}

interface FormState {
  username: string;
  password: string;
  error: string;
  isLoading: boolean;
}

/**
 * LoginForm Component
 *
 * Renders a login form with:
 * - Username input (text)
 * - Password input (masked)
 * - Submit button
 * - Loading indicator
 * - Error message display
 *
 * Validation:
 * - Username: required, minimum 3 characters
 * - Password: required, minimum 3 characters (for demo)
 */
export default function LoginForm({ onSubmit, isLoading: parentLoading = false, error: parentError = '' }: LoginFormProps) {
  const [state, setState] = useState<FormState>({
    username: '',
    password: '',
    error: '',
    isLoading: false,
  });

  /**
   * Handle form submission
   * - Validate inputs
   * - Show loading state
   * - Call parent's onSubmit callback
   * - Handle errors
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous errors
    setState((prev) => ({ ...prev, error: '' }));

    // Validate username
    if (!state.username.trim()) {
      setState((prev) => ({ ...prev, error: 'Username is required' }));
      return;
    }

    if (state.username.length < 3) {
      setState((prev) => ({ ...prev, error: 'Username must be at least 3 characters' }));
      return;
    }

    // Validate password
    if (!state.password) {
      setState((prev) => ({ ...prev, error: 'Password is required' }));
      return;
    }

    if (state.password.length < 3) {
      setState((prev) => ({ ...prev, error: 'Password must be at least 3 characters' }));
      return;
    }

    // Show loading state
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      // Call parent's submit handler
      await onSubmit(state.username, state.password);

      // Clear form on success
      setState((prev) => ({
        ...prev,
        username: '',
        password: '',
        isLoading: false,
      }));
    } catch (err) {
      // Handle error from parent
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
    }
  };

  /**
   * Handle input changes
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'username' | 'password'
  ) => {
    setState((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const isLoading = state.isLoading || parentLoading;
  const errorMessage = state.error || parentError;

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8">
        {/* Form Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Login</h2>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-red-600 font-bold">⚠️</span>
              <div>
                <h3 className="font-semibold text-red-900">Login Failed</h3>
                <p className="text-sm text-red-800">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Username Input */}
        <div className="mb-5">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="e.g., admin, user, or demo"
            value={state.username}
            onChange={(e) => handleInputChange(e, 'username')}
            disabled={isLoading}
            className="
              w-full px-4 py-2 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              disabled:bg-gray-100 disabled:cursor-not-allowed
              transition-colors
            "
            autoComplete="username"
          />
          <p className="mt-1 text-xs text-gray-500">Test user: admin</p>
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={state.password}
            onChange={(e) => handleInputChange(e, 'password')}
            disabled={isLoading}
            className="
              w-full px-4 py-2 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              disabled:bg-gray-100 disabled:cursor-not-allowed
              transition-colors
            "
            autoComplete="current-password"
          />
          <p className="mt-1 text-xs text-gray-500">Test password: admin123</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="
            w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold
            rounded-lg transition-colors duration-200
            disabled:bg-gray-400 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          "
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Logging in...</span>
            </>
          ) : (
            <>
              <span>🔓</span>
              <span>Login</span>
            </>
          )}
        </button>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>Demo Mode:</strong> Use one of the test users (admin, user, demo) with password
            matching username + &quot;123&quot;
          </p>
        </div>

        {/* Security Info */}
        <div className="mt-4 text-xs text-gray-500 space-y-1">
          <p>✅ Passwords are hashed with bcrypt</p>
          <p>✅ This is a learning platform (not production)</p>
          <p>✅ Never share real credentials</p>
        </div>
      </form>
    </div>
  );
}
