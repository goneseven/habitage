import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-forest-800"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-xl border border-ivory-300 bg-white px-3.5 py-2 text-sm text-forest-950 placeholder:text-forest-400 transition-colors focus:border-forest-700 focus:outline-none focus:ring-1 focus:ring-forest-700 disabled:cursor-not-allowed disabled:bg-ivory-100 disabled:opacity-60 shadow-xs',
            error && 'border-rose-400 focus:border-rose-600 focus:ring-rose-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-forest-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
