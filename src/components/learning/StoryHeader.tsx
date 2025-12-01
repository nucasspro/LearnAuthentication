'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, ReactNode } from 'react';

interface StoryHeaderProps {
  title: string;
  narrative: ReactNode;
  icon: LucideIcon;
  clearanceLevel: string;
  status: string;
}

export function StoryHeader({ title, narrative, icon: Icon, clearanceLevel, status }: StoryHeaderProps) {
  const router = useRouter();
  const [showNarrative, setShowNarrative] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowNarrative(window.scrollY < 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border-b-2 border-neon-500/30 sticky top-0 z-50 py-6">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/')}
          className="mb-3 text-gray-200 hover:text-neon-400 hover:bg-gray-800/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="flex items-center gap-4">
          <Icon className="w-12 h-12 text-neon-400 drop-shadow-[0_0_15px_rgba(74,255,0,0.6)]" />
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider text-white">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <Badge className="bg-neon-500/20 text-neon-300 border border-neon-500/50 font-mono">
                Clearance Level: {clearanceLevel}
              </Badge>
              <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-mono">
                Status: {status}
              </Badge>
            </div>
          </div>
        </div>

        {showNarrative && (
          <div className="mt-4 p-4 rounded-lg bg-gray-950/50 border-l-4 border-neon-500 transition-all duration-300 ease-in-out">
            <p className="text-gray-300 leading-relaxed">
              {narrative}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
