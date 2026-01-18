'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Challenge } from '@/lib/types';
import { Code, Lock, Zap } from 'lucide-react';
import { useState } from 'react';

interface ChallengeCardProps extends Challenge { }

export function ChallengeCard({ title, description, difficulty, points }: ChallengeCardProps) {
  const [showModal, setShowModal] = useState(false);

  const difficultyConfig = {
    Easy: {
      color: 'text-zinc-300',
      bgColor: 'bg-zinc-800',
      borderColor: 'border-zinc-700',
      icon: Code,
    },
    Medium: {
      color: 'text-zinc-200',
      bgColor: 'bg-zinc-800',
      borderColor: 'border-zinc-600',
      icon: Lock,
    },
    Hard: {
      color: 'text-white',
      bgColor: 'bg-zinc-800',
      borderColor: 'border-zinc-500',
      icon: Zap,
    },
  };

  const config = difficultyConfig[difficulty];
  const DifficultyIcon = config.icon;

  return (
    <>
      <Card className="bg-zinc-900 border border-white/10 shadow-none hover:border-white/30 transition-all rounded-none group">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <DifficultyIcon className={`w-7 h-7 ${config.color} flex-shrink-0`} />
              <div className="flex-1">
                <CardTitle className="text-xl font-bold uppercase tracking-wider text-white mb-2 group-hover:text-zinc-300 transition-colors">
                  {title}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className={`${config.bgColor} ${config.color} border ${config.borderColor} text-xs font-bold rounded-none`}>
                    {difficulty}
                  </Badge>
                  <Badge variant="outline" className="bg-transparent text-zinc-400 border border-zinc-700 text-xs font-bold rounded-none">
                    {points} XP
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-zinc-400 leading-relaxed text-sm">{description}</p>

          <Button
            onClick={() => setShowModal(true)}
            className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-3 uppercase tracking-wider rounded-none"
          >
            Start Challenge
          </Button>
        </CardContent>
      </Card>

      {/* Modal Placeholder */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/10 rounded-none p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">Coming Soon</h3>
            <p className="text-zinc-400 mb-6">
              Challenge starting soon... This feature is being developed!
            </p>
            <p className="text-sm text-zinc-500 mb-6 font-semibold">
              Interactive coding challenges will let you test your session authentication knowledge in real scenarios.
            </p>
            <Button
              onClick={() => setShowModal(false)}
              className="w-full bg-white hover:bg-zinc-200 text-black font-bold uppercase tracking-wider rounded-none"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
