/**
 * ProtectedRoute Component
 * Section 7.2 - Route protection wrapper
 *
 * Higher-order component (HOC) that protects routes
 * requiring authentication.
 *
 * Demonstrates:
 * - Client-side route protection
 * - Authentication state management
 * - Loading states
 * - Redirect on auth failure
 */

'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  /**
   * Component to render if authenticated
   */
  children: ReactNode;

  /**
   * Function to check if user is authenticated
   * Should call API to verify auth status
   */
  checkAuth: () => Promise<{
    authenticated: boolean;
    user?: { id: number; username: string; email: string };
  }>;

  /**
   * Redirect path if not authenticated
   * @default "/login"
   */
  redirectTo?: string;

  /**
   * Loading component shown while checking auth
   */
  loadingComponent?: ReactNode;

  /**
   * Optional: Minimum required role
   * @default undefined (any authenticated user)
   */
  requiredRole?: 'admin' | 'user';

  /**
   * Callback when auth check completes
   */
  onAuthCheck?: (result: { authenticated: boolean; user?: any }) => void;
}

interface ProtectedRouteState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: any;
  hasAccess: boolean;
}

/**
 * ProtectedRoute Component
 *
 * Wraps a component and protects it with authentication check
 * On mount: Checks if user is authenticated
 * If not: Redirects to login page
 * If yes: Renders the protected component
 */
export default function ProtectedRoute({
  children,
  checkAuth,
  redirectTo = '/login',
  loadingComponent,
  requiredRole,
  onAuthCheck,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [state, setState] = useState<ProtectedRouteState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    hasAccess: false,
  });

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const result = await checkAuth();

        let hasAccess = result.authenticated;

        // Check role if specified
        if (hasAccess && requiredRole && result.user) {
          // For this learning platform, we can add role checking here
          // For now, just verify authenticated
          hasAccess = result.authenticated;
        }

        setState({
          isLoading: false,
          isAuthenticated: result.authenticated,
          user: result.user || null,
          hasAccess,
        });

        onAuthCheck?.({
          authenticated: result.authenticated,
          user: result.user,
        });

        // Redirect if not authenticated
        if (!hasAccess) {
          router.push(redirectTo);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          hasAccess: false,
        });
        router.push(redirectTo);
      }
    };

    verifyAuth();
  }, [checkAuth, redirectTo, requiredRole, router, onAuthCheck]);

  // Show loading state while checking auth
  if (state.isLoading) {
    return (
      loadingComponent || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      )
    );
  }

  // Show denied state if not authenticated
  if (!state.hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🔒 Access Denied</h1>
          <p className="text-lg text-gray-600 mb-8">
            You need to be authenticated to access this page
          </p>
          <a
            href={redirectTo}
            className="
              inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white
              font-semibold rounded-lg transition-colors
            "
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Render protected component
  return <>{children}</>;
}

/**
 * withProtectedRoute HOC
 * Alternative: Use as a higher-order component instead of wrapper
 *
 * @example
 * ```typescript
 * export default withProtectedRoute(MyComponent, {
 *   checkAuth: async () => { ... },
 *   redirectTo: '/login'
 * });
 * ```
 */
export function withProtectedRoute(
  Component: React.ComponentType<any>,
  options: Omit<ProtectedRouteProps, 'children'>
) {
  return function ProtectedComponent(props: any) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
