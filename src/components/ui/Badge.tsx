import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'rose';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide',
        variant === 'default' && 'bg-petal text-roseDeep',
        variant === 'outline' && 'border border-roseMist text-rose bg-transparent',
        variant === 'rose' && 'bg-rose text-white',
        className
      )}
    >
      {children}
    </span>
  );
}
