'use client';

import { Award, Shield, Star, Trophy } from 'lucide-react';
import { ProgressData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
      color: 'text-gray-400',
      gradient: 'from-gray-500 to-gray-600',
    },
    {
      name: 'Security Operative',
      minPercentage: 31,
      maxPercentage: 60,
      icon: Award,
      color: 'text-cyan-400',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      name: 'Elite Guardian',
      minPercentage: 61,
      maxPercentage: 90,
      icon: Star,
      color: 'text-purple-400',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Master Architect',
      minPercentage: 91,
      maxPercentage: 100,
      icon: Trophy,
      color: 'text-neon-400',
      gradient: 'from-neon-500 to-yellow-500',
    },
  ];

  const currentLevel = levels.find(
    level => progress.percentage >= level.minPercentage && progress.percentage <= level.maxPercentage
  ) || levels[0];

  const nextLevel = levels.find(level => level.minPercentage > progress.percentage);

  const CurrentLevelIcon = currentLevel.icon;

  return (
    <Card className="bg-gray-900/80 backdrop-blur border-2 border-neon-500/30 shadow-[0_0_30px_rgba(74,255,0,0.2)]">
      <CardHeader>
        <CardTitle className="text-2xl font-black uppercase tracking-wider text-white flex items-center gap-2">
          <Trophy className="w-7 h-7 text-neon-400 drop-shadow-[0_0_10px_rgba(74,255,0,0.5)]" />
          Achievement Tracker
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Level Display */}
        <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-gray-900 to-gray-800 border-2 border-neon-500/30">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${currentLevel.gradient} flex items-center justify-center shadow-lg`}>
            <CurrentLevelIcon className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-400 uppercase tracking-wide">Current Level</p>
            <h3 className={`text-xl font-black ${currentLevel.color}`}>
              {currentLevel.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {currentLevel.minPercentage}% - {currentLevel.maxPercentage}% Complete
            </p>
          </div>
          <Badge className="bg-neon-500/20 text-neon-300 border-2 border-neon-500/50 text-lg font-black px-4 py-2">
            {progress.percentage}%
          </Badge>
        </div>

        {/* Progress to Next Level */}
        {nextLevel && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Next Level:</span>
              <span className={`text-sm font-bold ${nextLevel.color}`}>
                {nextLevel.name}
              </span>
            </div>
            <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden border-2 border-gray-700">
              <div
                className={`h-full bg-gradient-to-r ${currentLevel.gradient} transition-all duration-500 shadow-lg`}
                style={{
                  width: `${((progress.percentage - currentLevel.minPercentage) / (nextLevel.minPercentage - currentLevel.minPercentage)) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-gray-500 text-center">
              {nextLevel.minPercentage - progress.percentage}% until next level
            </p>
          </div>
        )}

        {progress.percentage === 100 && (
          <div className="p-4 rounded-lg bg-gradient-to-r from-neon-500/20 to-yellow-500/20 border-2 border-neon-500">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-neon-400 animate-bounce" />
              <div>
                <p className="text-neon-300 font-black text-lg">MISSION COMPLETE!</p>
                <p className="text-gray-300 text-sm">You&apos;ve mastered session authentication!</p>
              </div>
            </div>
          </div>
        )}

        {/* Level Milestones */}
        <div className="space-y-2">
          <p className="text-sm text-gray-400 font-semibold">All Levels:</p>
          <div className="grid grid-cols-2 gap-2">
            {levels.map(level => {
              const LevelIcon = level.icon;
              const isUnlocked = progress.percentage >= level.minPercentage;

              return (
                <div
                  key={level.name}
                  className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-all ${
                    isUnlocked
                      ? `bg-gradient-to-br ${level.gradient} bg-opacity-10 border-${level.color} border-opacity-50`
                      : 'bg-gray-900 border-gray-700 opacity-50'
                  }`}
                >
                  <LevelIcon className={`w-5 h-5 ${isUnlocked ? level.color : 'text-gray-600'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold truncate ${isUnlocked ? 'text-white' : 'text-gray-600'}`}>
                      {level.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {level.maxPercentage}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Objective */}
        {progress.percentage < 100 && (
          <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <p className="text-xs text-cyan-300 font-semibold mb-1">NEXT OBJECTIVE:</p>
            <p className="text-sm text-gray-300">
              {progress.percentage < 30
                ? 'Complete all Essential sections to reach Security Operative level'
                : progress.percentage < 60
                ? 'Complete Important sections to become an Elite Guardian'
                : progress.percentage < 90
                ? 'Master Advanced sections to achieve Master Architect status'
                : 'Complete all remaining sections to finish the mission!'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
