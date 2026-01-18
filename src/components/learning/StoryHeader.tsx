'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

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
      const currentScroll = window.scrollY;
      // Add hysteresis to prevent flickering
      if (currentScroll > 100) {
        setShowNarrative(false);
      } else if (currentScroll < 50) {
        setShowNarrative(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-black/95 border-b border-white/10 sticky top-0 z-50 py-6 transition-all backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/')}
          className="mb-3 text-zinc-500 hover:text-white hover:bg-white/5 uppercase text-xs tracking-widest pl-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="flex items-center gap-6">
          <div className="p-3 border border-white/10 bg-zinc-900/50">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-white">
              {title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <Badge variant="outline" className="bg-zinc-900 text-zinc-400 border border-zinc-700 font-mono rounded-none uppercase text-[10px] tracking-widest px-2 py-1">
                Clearance: {clearanceLevel}
              </Badge>
              <div className="w-px h-4 bg-zinc-800"></div>
              <Badge variant="outline" className="bg-zinc-900 text-zinc-400 border border-zinc-700 font-mono rounded-none uppercase text-[10px] tracking-widest px-2 py-1">
                Status: {status}
              </Badge>
            </div>
          </div>
        </div>

        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showNarrative ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'}`}>
          <div className="p-6 rounded-none bg-zinc-900/30 border-l-2 border-white/20">
            <p className="text-zinc-400 leading-relaxed max-w-3xl border-l-[1px] border-zinc-800 pl-4 font-mono text-sm">
              {narrative}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
