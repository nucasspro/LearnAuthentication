/**
 * Reusable Progress Bar Component
 * Animated progress indicator for timers, loading states, etc.
 */

import React from 'react';

export type ProgressBarVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info';

export interface ProgressBarProps {
  value: number; // 0-100
  variant?: ProgressBarVariant;
  animated?: boolean;
  showLabel?: boolean;
  height?: 'sm' | 'md' | 'lg';
  className?: string;
}

const variantColors: Record<ProgressBarVariant, string> = {
  primary: 'bg-primary-600 dark:bg-primary-500',
  success: 'bg-success-600 dark:bg-success-500',
  warning: 'bg-warning-600 dark:bg-warning-500',
  danger: 'bg-danger-600 dark:bg-danger-500',
  info: 'bg-info-600 dark:bg-info-500',
};

const heightClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-4',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  variant = 'primary',
  animated = false,
  showLabel = false,
  height = 'md',
  className = '',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  const colorClass = variantColors[variant];
  const heightClass = heightClasses[height];
  const animatedClass = animated ? 'transition-all duration-300 ease-out' : '';

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          <span>Progress</span>
          <span>{clampedValue}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${heightClass}`}>
        <div
          className={`${heightClass} ${colorClass} ${animatedClass} rounded-full`}
          style={{ width: `${clampedValue}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};
