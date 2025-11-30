'use client';

import { CheckCircle2, ChevronDown, ChevronRight, Award } from 'lucide-react';
import { useState } from 'react';
import { Section, ProgressData } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProgressSidebarProps {
  sections: Section[];
  progress: ProgressData;
  onSectionClick: (sectionId: string) => void;
}

export function ProgressSidebar({ sections, progress, onSectionClick }: ProgressSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    essential: true,
    important: true,
    advanced: true,
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const categorySections = (category: Section['category']) =>
    sections.filter(s => s.category === category);

  const categoryProgress = (category: Section['category']) => {
    const total = categorySections(category).length;
    const completed = categorySections(category).filter(s =>
      progress.completedSections.includes(s.id)
    ).length;
    return { total, completed, percentage: Math.round((completed / total) * 100) };
  };

  const categoryConfig = {
    essential: {
      label: 'ESSENTIAL',
      subtitle: 'Beginner • 10 min',
      color: 'text-neon-400',
      bgColor: 'bg-neon-500/10',
      borderColor: 'border-neon-500/50',
    },
    important: {
      label: 'IMPORTANT',
      subtitle: 'Intermediate • 15 min',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/50',
    },
    advanced: {
      label: 'ADVANCED',
      subtitle: 'Expert • 20 min',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/50',
    },
  };

  return (
    <Card className="bg-gray-900/80 backdrop-blur border-2 border-neon-500/30 sticky top-32 h-[calc(100vh-9rem)] overflow-hidden flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-xl font-black uppercase tracking-wider text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-neon-400" />
          Progress Tracker
        </CardTitle>

        {/* Overall Progress */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300 font-semibold">Current Level:</span>
            <Badge className={`${categoryConfig.essential.bgColor} ${categoryConfig.essential.color} border ${categoryConfig.essential.borderColor}`}>
              {progress.level}
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Overall Progress</span>
              <span className="text-neon-400 font-bold">{progress.percentage}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden border border-neon-500/30">
              <div
                className="h-full bg-gradient-to-r from-neon-500 to-cyan-400 transition-all duration-500 shadow-[0_0_10px_rgba(74,255,0,0.5)]"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {progress.completedSections.length} of {sections.length} sections complete
          </p>
        </div>
      </CardHeader>

      {/* Scrollable Section List */}
      <CardContent className="flex-1 overflow-y-auto space-y-4 pt-4">
        {(['essential', 'important', 'advanced'] as const).map(category => {
          const config = categoryConfig[category];
          const catProgress = categoryProgress(category);
          const isExpanded = expandedCategories[category];

          return (
            <div key={category} className="space-y-2">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 ${config.borderColor} ${config.bgColor} hover:bg-opacity-80 transition-all`}
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className={`w-4 h-4 ${config.color}`} />
                  ) : (
                    <ChevronRight className={`w-4 h-4 ${config.color}`} />
                  )}
                  <div className="text-left">
                    <div className={`text-sm font-black ${config.color}`}>
                      {config.label}
                    </div>
                    <div className="text-xs text-gray-400">
                      {config.subtitle}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-bold text-gray-300">
                  {catProgress.completed}/{catProgress.total}
                </div>
              </button>

              {/* Section List */}
              {isExpanded && (
                <div className="space-y-1 pl-2">
                  {categorySections(category).map(section => {
                    const isCompleted = progress.completedSections.includes(section.id);

                    return (
                      <button
                        key={section.id}
                        onClick={() => onSectionClick(section.id)}
                        className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-all ${
                          isCompleted
                            ? 'bg-neon-500/10 hover:bg-neon-500/20'
                            : 'hover:bg-gray-800'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-neon-400 flex-shrink-0" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-gray-600 rounded-full flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-semibold ${isCompleted ? 'text-neon-300' : 'text-gray-300'}`}>
                            {section.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {section.estimatedTime} min
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
