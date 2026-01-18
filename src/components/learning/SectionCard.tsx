'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Code,
  FileKey,
  Globe,
  Key,
  Lock,
  Server,
  Shield,
  Smartphone,
  Terminal,
  User
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Shield,
  Lock,
  Key,
  FileKey,
  User,
  Server,
  Globe,
  Smartphone,
  AlertTriangle,
  Terminal,
  Code
};

interface SectionCardProps {
  id: string;
  title: string;
  icon: string;
  category: 'concepts' | 'success' | 'security' | 'advanced' | 'best_practices' | 'system';
  estimatedTime: number;
  isCompleted: boolean;
  onComplete: (sectionId: string) => void;
  children: React.ReactNode;
}

export function SectionCard({
  id,
  title,
  icon,
  category,
  estimatedTime,
  isCompleted,
  onComplete,
  children,
}: SectionCardProps) {
  // Dynamically get icon component from static map
  const IconComponent = ICON_MAP[icon] || Shield;

  const categoryConfig = {
    concepts: {
      badge: 'CORE CONCEPT',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-950/30',
      borderColor: 'border-cyan-500/50',
    },
    success: {
      badge: 'COMPLETED',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-950/30',
      borderColor: 'border-emerald-500/50',
    },
    security: {
      badge: 'SECURITY CRITICAL',
      color: 'text-rose-500',
      bgColor: 'bg-rose-950/30',
      borderColor: 'border-rose-500/50',
    },
    advanced: {
      badge: 'ADVANCED TOPIC',
      color: 'text-violet-500',
      bgColor: 'bg-violet-950/30',
      borderColor: 'border-violet-500/50',
    },
    best_practices: {
      badge: 'BEST PRACTICE',
      color: 'text-amber-500',
      bgColor: 'bg-amber-950/30',
      borderColor: 'border-amber-500/50',
    },
    system: {
      badge: 'SYSTEM',
      color: 'text-zinc-500',
      bgColor: 'bg-zinc-950/30',
      borderColor: 'border-zinc-500/50',
    },
  };

  const config = categoryConfig[category];

  return (
    <Card
      id={id}
      className={`bg-black border transition-all rounded-none scroll-mt-32 group ${isCompleted ? 'border-zinc-700 opacity-75' : 'border-white/10 hover:border-white/30'}`}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className={`p-2 border border-zinc-800 bg-zinc-900/50 ${isCompleted ? 'grayscale' : ''}`}>
              <IconComponent className={`w-6 h-6 ${config.color}`} />
            </div>
            <div className="flex-1">
              <CardTitle className={`text-xl font-bold uppercase tracking-wider mb-3 ${isCompleted ? 'text-zinc-500 line-through' : 'text-white group-hover:text-zinc-200'} transition-colors`}>
                {title}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className={`${config.bgColor} ${config.color} border ${config.borderColor} text-[10px] font-bold rounded-none uppercase tracking-widest px-2 py-0.5`}>
                  {config.badge}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                  <Clock className="w-3 h-3" />
                  {estimatedTime} MIN
                </div>
              </div>
            </div>
          </div>

          {/* Completion Checkbox */}
          <button
            onClick={() => onComplete(id)}
            className={`flex-shrink-0 w-6 h-6 rounded-none border transition-all flex items-center justify-center ${isCompleted
              ? 'bg-zinc-200 border-zinc-200 text-black'
              : 'border-zinc-700 hover:border-white text-transparent hover:text-white/20 bg-black'
              }`}
            aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          >
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      </CardHeader>

      <CardContent className={`text-zinc-400 leading-relaxed text-sm space-y-4 ${isCompleted ? 'opacity-50' : ''}`}>
        {children}
      </CardContent>
    </Card>
  );
}
