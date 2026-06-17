import React from 'react';
import { cn } from '../../lib/utils';

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  label?: string;
}

export function SectionWrapper({ id, children, className, label }: SectionWrapperProps) {
  return (
    <section
      id={id}
      aria-label={label}
      className={cn('scroll-mt-20 py-24 px-6', className)}
    >
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
}

export function SectionHeading({ eyebrow, title, description, centered = false }: SectionHeadingProps) {
  return (
    <div className={cn('mb-16', centered && 'text-center')}>
      {eyebrow && (
        <p className="text-xs font-mono text-rose uppercase tracking-[0.2em] mb-3">{eyebrow}</p>
      )}
      <h2 className="font-display text-4xl md:text-5xl text-charcoal leading-tight mb-4">{title}</h2>
      {description && (
        <p className="text-slate max-w-xl leading-relaxed">{description}</p>
      )}
    </div>
  );
}
