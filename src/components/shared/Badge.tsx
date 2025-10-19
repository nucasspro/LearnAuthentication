/**
 * Reusable Badge Component
 * Small status indicators and labels
 */

import React from 'react';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'gray';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'badge-primary',
  secondary: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300',
  success: 'badge-success',
  danger: 'badge-danger',
  warning: 'badge-warning',
  info: 'bg-info-100 text-info-800 dark:bg-info-900/30 dark:text-info-300',
  gray: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'gray',
  size = 'md',
  dot = false,
  children,
  className = '',
}) => {
  const baseClasses = 'badge';
  const variantClass = variantClasses[variant];
  const sizeClass = sizeClasses[size];

  const allClasses = `${baseClasses} ${variantClass} ${sizeClass} ${className}`.trim();

  return (
    <span className={allClasses}>
      {dot && (
        <span className="inline-block w-2 h-2 rounded-full bg-current mr-1.5" aria-hidden="true" />
      )}
      {children}
    </span>
  );
};
