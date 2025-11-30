'use client';

import { Code, Lock, Zap } from 'lucide-react';
import { useState } from 'react';
import { Challenge } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ChallengeCardProps extends Challenge {}

export function ChallengeCard({ title, description, difficulty, points }: ChallengeCardProps) {
  const [showModal, setShowModal] = useState(false);

  const difficultyConfig = {
    Easy: {
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500',
      icon: Code,
    },
    Medium: {
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500',
      icon: Lock,
    },
    Hard: {
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500',
      icon: Zap,
    },
  };

  const config = difficultyConfig[difficulty];
  const DifficultyIcon = config.icon;

  return (
    <>
      <Card className="bg-gray-900/80 backdrop-blur border-2 border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.2)] hover:border-purple-500/50 transition-all">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <DifficultyIcon className={`w-7 h-7 ${config.color} flex-shrink-0 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]`} />
              <div className="flex-1">
                <CardTitle className="text-xl font-black uppercase tracking-wider text-white mb-2">
                  {title}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={`${config.bgColor} ${config.color} border ${config.borderColor} text-xs font-bold`}>
                    {difficulty}
                  </Badge>
                  <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/50 text-xs font-bold">
                    {points} XP
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-gray-300 leading-relaxed">{description}</p>

          <Button
            onClick={() => setShowModal(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3"
          >
            Start Challenge
          </Button>
        </CardContent>
      </Card>

      {/* Modal Placeholder */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border-2 border-purple-500 rounded-lg p-6 max-w-md w-full shadow-[0_0_50px_rgba(168,85,247,0.5)]">
            <h3 className="text-2xl font-black text-white mb-4 uppercase">Coming Soon</h3>
            <p className="text-gray-300 mb-6">
              Challenge starting soon... This feature is being developed!
            </p>
            <p className="text-sm text-purple-300 mb-6">
              Interactive coding challenges will let you test your session authentication knowledge in real scenarios.
            </p>
            <Button
              onClick={() => setShowModal(false)}
              className="w-full bg-gradient-to-r from-neon-600 to-neon-500 hover:from-neon-700 hover:to-neon-600 text-black font-bold"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
