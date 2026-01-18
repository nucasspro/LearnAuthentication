'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressData, Section } from '@/lib/types';
import { ChevronDown, ChevronRight, Hash } from 'lucide-react';
import { useState } from 'react';

interface ProgressSidebarProps {
  sections: Section[];
  progress: ProgressData;
  onSectionClick: (sectionId: string) => void;
}

export function ProgressSidebar({ sections, progress, onSectionClick }: ProgressSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    concepts: true,
    success: true,
    security: true,
    advanced: true,
    best_practices: true,
    system: true,
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
    concepts: {
      label: 'CONCEPTS',
      subtitle: 'CORE',
      color: 'text-cyan-400',
      bgColor: 'bg-zinc-900',
      borderColor: 'border-cyan-500/30',
      hoverColor: 'hover:text-cyan-300',
    },
    success: {
      label: 'SUCCESS',
      subtitle: 'ACHIEVED',
      color: 'text-emerald-400',
      bgColor: 'bg-zinc-900',
      borderColor: 'border-emerald-500/30',
      hoverColor: 'hover:text-emerald-300',
    },
    security: {
      label: 'SECURITY',
      subtitle: 'CRITICAL',
      color: 'text-rose-400',
      bgColor: 'bg-zinc-900',
      borderColor: 'border-rose-500/30',
      hoverColor: 'hover:text-rose-300',
    },
    advanced: {
      label: 'ADVANCED',
      subtitle: 'EXPERT',
      color: 'text-violet-400',
      bgColor: 'bg-zinc-900',
      borderColor: 'border-violet-500/30',
      hoverColor: 'hover:text-violet-300',
    },
    best_practices: {
      label: 'BEST PRACTICES',
      subtitle: 'GUIDE',
      color: 'text-amber-400',
      bgColor: 'bg-zinc-900',
      borderColor: 'border-amber-500/30',
      hoverColor: 'hover:text-amber-300',
    },
    system: {
      label: 'SYSTEM',
      subtitle: 'MECHANISM',
      color: 'text-zinc-400',
      bgColor: 'bg-zinc-900',
      borderColor: 'border-zinc-500/30',
      hoverColor: 'hover:text-zinc-300',
    },
  };

  return (
    <Card className="bg-black border border-white/10 sticky top-32 h-[calc(100vh-9rem)] overflow-hidden flex flex-col rounded-none shadow-none">
      <CardHeader className="flex-shrink-0 border-b border-white/10 bg-zinc-950 px-6 py-6">
        <CardTitle className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-3">
          <Hash className="w-4 h-4 text-zinc-500" />
          Progress Log
        </CardTitle>

        {/* Overall Progress */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider">
            <span className="text-zinc-500 font-bold">Rank</span>
            <span className="text-white font-mono">{progress.level}</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
              <span className="text-zinc-500">Completion</span>
              <span className="text-white font-mono">{progress.percentage}%</span>
            </div>
            <div className="h-1 bg-zinc-900 w-full">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider font-mono">
            {progress.completedSections.length}/{sections.length} MODULES COMPLETED
          </p>
        </div>
      </CardHeader>

      {/* Scrollable Section List */}
      <CardContent className="flex-1 overflow-y-auto space-y-px p-0 bg-black">
        {(['concepts', 'success', 'security', 'advanced', 'best_practices', 'system'] as const).map(category => {
          const config = categoryConfig[category];
          const catProgress = categoryProgress(category);
          const isExpanded = expandedCategories[category];

          return (
            <div key={category} className="border-b border-zinc-900 last:border-0">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className={`w-full flex items-center justify-between p-4 hover:bg-zinc-900/50 transition-all group`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 flex items-center justify-center border border-zinc-800 bg-zinc-950 ${isExpanded ? 'bg-zinc-900 border-zinc-700' : ''}`}>
                    {isExpanded ? (
                      <ChevronDown className="w-3 h-3 text-zinc-400" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-zinc-600" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className={`text-xs font-bold uppercase tracking-wider ${config.color} ${config.hoverColor} transition-colors`}>
                      {config.label}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-zinc-600 group-hover:text-zinc-400 transition-colors">
                  {catProgress.completed}/{catProgress.total}
                </div>
              </button>

              {/* Section List */}
              {isExpanded && (
                <div className="bg-zinc-950/30 border-t border-zinc-900/50">
                  {categorySections(category).map(section => {
                    const isCompleted = progress.completedSections.includes(section.id);

                    return (
                      <button
                        key={section.id}
                        onClick={() => onSectionClick(section.id)}
                        className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-all border-l-2 ${isCompleted
                          ? 'bg-zinc-900/40 border-white/50'
                          : 'border-transparent hover:bg-zinc-900/40 hover:border-zinc-700'
                          }`}
                      >
                        <div className={`mt-0.5 w-3 h-3 rounded-none border flex items-center justify-center ${isCompleted ? 'border-zinc-400 bg-zinc-400' : 'border-zinc-800'}`}>
                          {isCompleted && <div className="w-1.5 h-1.5 bg-black" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-bold uppercase tracking-wide leading-tight mb-1 ${isCompleted ? 'text-zinc-400 line-through decoration-zinc-600' : 'text-zinc-300'}`}>
                            {section.title}
                          </div>
                          <div className="text-[10px] text-zinc-600 font-mono">
                            {section.estimatedTime} MIN
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
