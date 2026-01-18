'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-red-950 to-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-black text-neon-400 mb-2">ERROR</h1>
          <p className="text-gray-400 text-sm font-mono">CRITICAL_SYSTEM_FAULT</p>
        </div>

        <div className="bg-gray-900/80 border-2 border-red-500/30 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">System Malfunction Detected</h2>
          <p className="text-gray-300 text-sm mb-4">
            An unexpected error occurred in the cyberpunk network. Our engineers have been notified.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-red-950/50 rounded p-4 mb-4 border border-red-500/30">
              <p className="text-red-200 text-xs font-mono break-words">{error.message}</p>
              {error.digest && (
                <p className="text-red-300 text-xs font-mono mt-2">Error ID: {error.digest}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="flex-1 border-neon-500/50 text-neon-400 hover:bg-neon-500/10"
          >
            Return to Base
          </Button>
          <Button
            onClick={reset}
            className="flex-1 bg-neon-500 text-black hover:bg-neon-400"
          >
            Retry Access
          </Button>
        </div>
      </div>
    </div>
  );
}
