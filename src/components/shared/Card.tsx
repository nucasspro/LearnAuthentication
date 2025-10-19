/**
 * Reusable Card Component
 * Container with consistent styling, shadow, and hover effects
 */

import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  noPadding?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  noPadding = false,
  onClick,
}) => {
  const baseClasses = 'card';
  const hoverClass = hover ? 'card-hover cursor-pointer' : '';
  const paddingClass = noPadding ? '!p-0' : '';
  const clickableClass = onClick ? 'cursor-pointer' : '';

  const allClasses = `${baseClasses} ${hoverClass} ${paddingClass} ${clickableClass} ${className}`.trim();

  return (
    <div className={allClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 ${className}`.trim()}>
      {children}
    </div>
  );
};

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => {
  return (
    <h3 className={`text-2xl font-bold text-gray-900 dark:text-gray-100 ${className}`.trim()}>
      {children}
    </h3>
  );
};

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return (
    <div className={`border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 ${className}`.trim()}>
      {children}
    </div>
  );
};
