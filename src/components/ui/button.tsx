import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:opacity-40 select-none',
          {
            // variants
            default:
              'bg-emerald-600 text-white hover:bg-emerald-500 active:scale-[0.98]',
            ghost:
              'bg-transparent text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]',
            outline:
              'border border-[var(--border-strong)] bg-transparent text-[var(--text-primary)] hover:bg-white/5',
            destructive:
              'bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30',
            link: 'underline underline-offset-2 text-emerald-400 hover:text-emerald-300 p-0 h-auto',
          }[variant],
          {
            sm:   'h-7 px-3 text-xs',
            md:   'h-9 px-4 text-sm',
            lg:   'h-11 px-6 text-base',
            icon: 'h-9 w-9 p-0',
          }[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
