import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rose focus:ring-offset-2 focus:ring-offset-cream disabled:opacity-50 disabled:cursor-not-allowed',
          variant === 'primary' && 'bg-roseDeep text-white hover:bg-rose active:scale-95',
          variant === 'secondary' && 'border border-roseMist text-slate hover:border-rose hover:text-roseDeep bg-transparent active:scale-95',
          variant === 'ghost' && 'text-slate hover:text-roseDeep bg-transparent hover:bg-petal',
          size === 'sm' && 'px-4 py-2 text-xs',
          size === 'md' && 'px-6 py-2.5 text-sm',
          size === 'lg' && 'px-8 py-3.5 text-base',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
