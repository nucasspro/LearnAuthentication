import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-7xl font-black text-neon-400 mb-2">404</h1>
          <p className="text-gray-400 text-sm font-mono">PROTOCOL_NOT_FOUND</p>
        </div>

        <div className="bg-gray-900/80 border-2 border-neon-500/30 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-300 mb-4">
            The security protocol you&apos;re searching for doesn&apos;t exist in our network.
          </p>
          <p className="text-gray-400 text-sm">
            Check your clearance level and try accessing one of our active protocols instead.
          </p>
        </div>

        <Link href="/">
          <Button className="w-full bg-neon-500 text-black hover:bg-neon-400">
            Return to Base Station
          </Button>
        </Link>
      </div>
    </div>
  );
}
