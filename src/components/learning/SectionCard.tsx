'use client';

import { CheckCircle2, Clock } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SectionCardProps {
  id: string;
  title: string;
  icon: string;
  category: 'essential' | 'important' | 'advanced';
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
  // Dynamically get icon component
  const IconComponent = (LucideIcons as any)[icon] || LucideIcons.Shield;

  const categoryConfig = {
    essential: {
      badge: 'ESSENTIAL',
      color: 'text-neon-400',
      bgColor: 'bg-neon-500/10',
      borderColor: 'border-neon-500/50',
    },
    important: {
      badge: 'IMPORTANT',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/50',
    },
    advanced: {
      badge: 'ADVANCED',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/50',
    },
  };

  const config = categoryConfig[category];

  return (
    <Card
      id={id}
      className="bg-gray-900/80 backdrop-blur border-2 border-neon-500/30 shadow-[0_0_30px_rgba(74,255,0,0.2)] scroll-mt-32 transition-all hover:border-neon-500/50 hover:shadow-[0_0_40px_rgba(74,255,0,0.3)]"
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <IconComponent className={`w-8 h-8 ${config.color} flex-shrink-0 drop-shadow-[0_0_10px_rgba(74,255,0,0.5)]`} />
            <div className="flex-1">
              <CardTitle className="text-2xl font-black uppercase tracking-wider text-white mb-2">
                {title}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={`${config.bgColor} ${config.color} border ${config.borderColor} text-xs font-bold`}>
                  {config.badge}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  {estimatedTime} min
                </div>
              </div>
            </div>
          </div>

          {/* Completion Checkbox */}
          <button
            onClick={() => onComplete(id)}
            className={`flex-shrink-0 w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
              isCompleted
                ? 'bg-neon-500/20 border-neon-500 text-neon-400'
                : 'border-gray-600 hover:border-neon-500/50 text-gray-600 hover:text-neon-400'
            }`}
            aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {isCompleted && <CheckCircle2 className="w-5 h-5" />}
          </button>
        </div>
      </CardHeader>

      <CardContent className="text-gray-300 leading-relaxed space-y-4">
        {children}
      </CardContent>
    </Card>
  );
}
