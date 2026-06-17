import React from 'react';
import { cn } from '../../lib/utils';

// ─── Panel header ─────────────────────────────────────────────
interface PanelHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}
export function PanelHeader({ title, description, action }: PanelHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-8">
      <div>
        <h2 className="font-display text-2xl text-charcoal">{title}</h2>
        {description && <p className="text-ash text-sm mt-1">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// ─── Field label + input wrapper ─────────────────────────────
interface FieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}
export function Field({ label, htmlFor, required, children, hint }: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-xs font-mono text-rose uppercase tracking-widest mb-1.5">
        {label}{required && <span className="text-roseDeep ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-2xs text-ash mt-1">{hint}</p>}
    </div>
  );
}

// ─── Text input ───────────────────────────────────────────────
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}
export function TextInput({ className, error, ...props }: TextInputProps) {
  return (
    <>
      <input
        {...props}
        className={cn(
          'w-full px-3 py-2.5 rounded-xl border bg-white text-charcoal text-sm placeholder-mist focus:outline-none focus:ring-2 focus:ring-rose focus:border-rose transition-colors',
          error ? 'border-red-400' : 'border-roseMist',
          className
        )}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </>
  );
}

// ─── Textarea ─────────────────────────────────────────────────
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}
export function TextAreaInput({ className, error, ...props }: TextAreaProps) {
  return (
    <>
      <textarea
        {...props}
        className={cn(
          'w-full px-3 py-2.5 rounded-xl border bg-white text-charcoal text-sm placeholder-mist focus:outline-none focus:ring-2 focus:ring-rose focus:border-rose transition-colors resize-none',
          error ? 'border-red-400' : 'border-roseMist',
          className
        )}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </>
  );
}

// ─── Primary button ───────────────────────────────────────────
interface DashButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
}
export function DashButton({ variant = 'primary', size = 'md', className, children, ...props }: DashButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose focus:ring-offset-1 disabled:opacity-50',
        size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-5 py-2.5 text-sm',
        variant === 'primary' && 'bg-roseDeep text-white hover:bg-rose',
        variant === 'ghost' && 'bg-petal text-roseDeep hover:bg-roseMist',
        variant === 'danger' && 'bg-red-50 text-red-600 hover:bg-red-100',
        className
      )}
    >
      {children}
    </button>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────
export function DashCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white rounded-2xl border border-petal p-6', className)}>
      {children}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────
export function EmptyState({ message, cta }: { message: string; cta?: React.ReactNode }) {
  return (
    <div className="text-center py-16 text-ash">
      <p className="text-sm mb-4">{message}</p>
      {cta}
    </div>
  );
}

// ─── Section divider ──────────────────────────────────────────
export function Divider() {
  return <hr className="border-petal my-6" />;
}
