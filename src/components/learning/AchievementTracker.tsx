'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressData } from '@/lib/types';
import { Award, Shield, Star, Trophy } from 'lucide-react';

interface AchievementTrackerProps {
  progress: ProgressData;
}

export function AchievementTracker({ progress }: AchievementTrackerProps) {
  const levels = [
    {
      name: 'Protocol Initiate',
      minPercentage: 0,
      maxPercentage: 30,
      icon: Shield,
      color: 'text-zinc-500',
    },
    {
      name: 'Security Operative',
      minPercentage: 31,
      maxPercentage: 60,
      icon: Award,
      color: 'text-white',
    },
    {
      name: 'Elite Guardian',
      minPercentage: 61,
      maxPercentage: 90,
      icon: Star,
      color: 'text-white',
    },
    {
      name: 'Master Architect',
      minPercentage: 91,
      maxPercentage: 100,
      icon: Trophy,
      color: 'text-white',
    },
  ];

  const currentLevel = levels.find(
    level => progress.percentage >= level.minPercentage && progress.percentage <= level.maxPercentage
  ) || levels[0];

  const nextLevel = levels.find(level => level.minPercentage > progress.percentage);

  const CurrentLevelIcon = currentLevel.icon;

  return (
    <Card className="bg-black border border-white/10 shadow-none rounded-none">
      <CardHeader className="border-b border-white/10 pb-4">
        <CardTitle className="text-xl font-bold uppercase tracking-widest text-white flex items-center gap-3">
          <Trophy className="w-5 h-5 text-zinc-500" />
          Achievement Log
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Current Level Display */}
        <div className="flex items-center gap-6 p-6 rounded-none bg-zinc-900/30 border border-white/10">
          <div className="w-16 h-16 border border-zinc-700 bg-black flex items-center justify-center">
            <CurrentLevelIcon className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Current Rank</p>
            <h3 className="text-2xl font-black uppercase text-white tracking-wide">
              {currentLevel.name}
            </h3>
            <p className="text-xs text-zinc-500 mt-1 font-mono">
              RANGE: {currentLevel.minPercentage}% - {currentLevel.maxPercentage}%
            </p>
          </div>
          <Badge className="bg-black text-white border border-white/20 text-xl font-bold px-4 py-2 rounded-none font-mono tracking-widest">
            {progress.percentage}%
          </Badge>
        </div>

        {/* Progress to Next Level */}
        {nextLevel && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider">
              <span className="text-zinc-500">Next Promotion:</span>
              <span className="text-white font-bold decoration-zinc-500 underline decoration-dotted underline-offset-4">
                {nextLevel.name}
              </span>
            </div>
            <div className="relative h-1 bg-zinc-900 rounded-none overflow-hidden w-full">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{
                  width: `${((progress.percentage - currentLevel.minPercentage) / (nextLevel.minPercentage - currentLevel.minPercentage)) * 100}%`,
                }}
              />
            </div>
            <p className="text-[10px] text-zinc-600 text-center uppercase tracking-widest font-mono">
              {nextLevel.minPercentage - progress.percentage}% EXP REQUIRED FOR PROMOTION
            </p>
          </div>
        )}

        {progress.percentage === 100 && (
          <div className="p-6 rounded-none bg-white text-black border border-white">
            <div className="flex items-center gap-4">
              <Trophy className="w-8 h-8 text-black" />
              <div>
                <p className="font-black text-lg uppercase tracking-wider">MISSION COMPLETE</p>
                <p className="text-sm font-medium">Session authentication mastery achieved.</p>
              </div>
            </div>
          </div>
        )}

        {/* Level Milestones */}
        <div className="space-y-3 pt-4 border-t border-zinc-900">
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Rank Hierarchy:</p>
          <div className="grid grid-cols-2 gap-3">
            {levels.map(level => {
              const LevelIcon = level.icon;
              const isUnlocked = progress.percentage >= level.minPercentage;

              return (
                <div
                  key={level.name}
                  className={`flex items-center gap-3 p-3 rounded-none border transition-all ${isUnlocked
                    ? 'bg-zinc-900 border-zinc-700'
                    : 'bg-black border-zinc-900 opacity-40'
                    }`}
                >
                  <LevelIcon className={`w-4 h-4 ${isUnlocked ? 'text-white' : 'text-zinc-700'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-[10px] font-bold uppercase tracking-wide truncate ${isUnlocked ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      {level.name}
                    </p>
                    <p className="text-[10px] text-zinc-600 font-mono">
                      MAX {level.maxPercentage}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Objective */}
        {progress.percentage < 100 && (
          <div className="p-4 rounded-none bg-zinc-950 border border-zinc-800">
            <p className="text-[10px] text-zinc-500 font-bold uppercase mb-2 tracking-widest">CURRENT OBJECTIVE:</p>
            <p className="text-xs text-zinc-300 font-mono leading-relaxed">
              &gt; {progress.percentage < 30
                ? 'Initialize protocol: Complete Essential sections.'
                : progress.percentage < 60
                  ? 'Escalate privileges: Complete Important sections.'
                  : progress.percentage < 90
                    ? 'System hardening: Master Advanced sections.'
                    : 'Finalize deployment: Complete all remaining tasks.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
