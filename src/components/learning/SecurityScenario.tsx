'use client';

import { AlertTriangle, ChevronDown, ChevronRight, Shield, Skull } from 'lucide-react';
import { useState } from 'react';
import { SecurityScenario as SecurityScenarioType } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { CodeBlock } from './CodeBlock';

interface SecurityScenarioProps extends SecurityScenarioType {}

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
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500',
    },
    MEDIUM: {
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500',
    },
    LOW: {
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500',
    },
  };

  const config = threatLevelConfig[threatLevel];

  const steps = [
    { id: 'attack', label: 'The Attack', icon: Skull },
    { id: 'exploitation', label: 'The Exploitation', icon: AlertTriangle },
    { id: 'defense', label: 'The Defense', icon: Shield },
  ];

  return (
    <div className="my-4 rounded-lg border-2 border-red-500/30 bg-gray-950/50 overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.2)]">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-red-500/10 transition-all"
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-red-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-red-400" />
          )}
          <AlertTriangle className="w-6 h-6 text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          <div className="text-left">
            <h3 className="text-lg font-black uppercase text-white">
              {title}
            </h3>
            <p className="text-xs text-gray-400">Security Breach Scenario</p>
          </div>
        </div>
        <Badge className={`${config.bgColor} ${config.color} border ${config.borderColor} font-bold`}>
          {threatLevel} RISK
        </Badge>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t-2 border-red-500/30">
          {/* Step Navigation */}
          <div className="bg-gray-900/50 p-4 border-b border-red-500/20">
            <div className="flex gap-2">
              {steps.map(step => {
                const StepIcon = step.icon;
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      currentStep === step.id
                        ? 'bg-red-500/20 text-red-300 border-2 border-red-500/50'
                        : 'text-gray-400 hover:text-red-400 hover:bg-gray-800'
                    }`}
                  >
                    <StepIcon className="w-4 h-4" />
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
                  <Skull className="w-5 h-5 text-red-400" />
                  <h4 className="text-base font-bold text-red-300 uppercase">The Attack Vector</h4>
                </div>
                <p className="text-gray-300 leading-relaxed">{attack}</p>
                {vulnerableCode && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2 font-semibold">Vulnerable Code:</p>
                    <CodeBlock examples={[vulnerableCode]} showLineNumbers={false} />
                  </div>
                )}
              </div>
            )}

            {currentStep === 'exploitation' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <h4 className="text-base font-bold text-yellow-300 uppercase">How It&apos;s Exploited</h4>
                </div>
                <p className="text-gray-300 leading-relaxed">{exploitation}</p>
              </div>
            )}

            {currentStep === 'defense' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-neon-400" />
                  <h4 className="text-base font-bold text-neon-300 uppercase">The Defense</h4>
                </div>
                <p className="text-gray-300 leading-relaxed">{defense}</p>
                {secureCode && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2 font-semibold">Secure Implementation:</p>
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
