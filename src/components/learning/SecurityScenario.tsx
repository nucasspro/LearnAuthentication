'use client';

import { Badge } from '@/components/ui/badge';
import { SecurityScenario as SecurityScenarioType } from '@/lib/types';
import { AlertTriangle, ChevronDown, ChevronRight, Shield, Skull } from 'lucide-react';
import { useState } from 'react';
import { CodeBlock } from './CodeBlock';

interface SecurityScenarioProps extends SecurityScenarioType { }

export function SecurityScenario({
  title,
  threatLevel,
  attack,
  exploitation,
  defense,
  vulnerableCode,
  secureCode,
}: SecurityScenarioProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState<'attack' | 'exploitation' | 'defense'>('attack');

  const threatLevelConfig = {
    HIGH: {
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-900',
    },
    MEDIUM: {
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-900',
    },
    LOW: {
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-900',
    },
  };

  const config = threatLevelConfig[threatLevel];

  const steps = [
    { id: 'attack', label: 'The Attack', icon: Skull },
    { id: 'exploitation', label: 'The Exploitation', icon: AlertTriangle },
    { id: 'defense', label: 'The Defense', icon: Shield },
  ];

  return (
    <div className="my-4 rounded-none border border-white/10 bg-zinc-900/30 overflow-hidden shadow-none hover:border-white/30 transition-all group">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all"
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-zinc-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-zinc-400" />
          )}
          <AlertTriangle className={`w-6 h-6 ${config.color}`} />
          <div className="text-left">
            <h3 className="text-lg font-bold uppercase text-white group-hover:text-zinc-300 transition-colors">
              {title}
            </h3>
            <p className="text-xs text-zinc-500">Security Breach Scenario</p>
          </div>
        </div>
        <Badge variant="outline" className={`${config.bgColor} ${config.color} border ${config.borderColor} font-bold rounded-none`}>
          {threatLevel} RISK
        </Badge>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-white/10">
          {/* Step Navigation */}
          <div className="bg-zinc-950/30 p-2 border-b border-white/5">
            <div className="flex gap-1">
              {steps.map(step => {
                const StepIcon = step.icon;
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-none text-sm font-bold transition-all border ${currentStep === step.id
                      ? 'bg-zinc-800 text-white border-white/10'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                      }`}
                  >
                    <StepIcon className={`w-4 h-4 ${currentStep === step.id ? 'text-white' : ''}`} />
                    {step.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="p-4 space-y-4">
            {currentStep === 'attack' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Skull className="w-5 h-5 text-zinc-400" />
                  <h4 className="text-base font-bold text-zinc-300 uppercase">The Attack Vector</h4>
                </div>
                <p className="text-zinc-400 leading-relaxed text-sm">{attack}</p>
                {vulnerableCode && (
                  <div>
                    <p className="text-sm text-zinc-500 mb-2 font-semibold">Vulnerable Code:</p>
                    <CodeBlock examples={[vulnerableCode]} showLineNumbers={false} />
                  </div>
                )}
              </div>
            )}

            {currentStep === 'exploitation' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-zinc-400" />
                  <h4 className="text-base font-bold text-zinc-300 uppercase">How It&apos;s Exploited</h4>
                </div>
                <p className="text-zinc-400 leading-relaxed text-sm">{exploitation}</p>
              </div>
            )}

            {currentStep === 'defense' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-zinc-400" />
                  <h4 className="text-base font-bold text-zinc-300 uppercase">The Defense</h4>
                </div>
                <p className="text-zinc-400 leading-relaxed text-sm">{defense}</p>
                {secureCode && (
                  <div>
                    <p className="text-sm text-zinc-500 mb-2 font-semibold">Secure Implementation:</p>
                    <CodeBlock examples={[secureCode]} showLineNumbers={false} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
