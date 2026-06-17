import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-petal shadow-sm',
        hover && 'transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-roseMist',
        className
      )}
    >
      {children}
    </div>
  );
}
