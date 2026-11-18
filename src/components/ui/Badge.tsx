import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'forest' | 'jade' | 'brass' | 'ivory' | 'danger' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'forest',
  children,
  ...props
}) => {
  const variants = {
    forest: 'bg-forest-100 text-forest-900 border-forest-200',
    jade: 'bg-jade-100 text-jade-900 border-jade-200',
    brass: 'bg-brass-100 text-brass-900 border-brass-200',
    ivory: 'bg-ivory-100 text-ivory-800 border-ivory-200',
    danger: 'bg-rose-50 text-rose-800 border-rose-200',
    outline: 'bg-transparent text-forest-800 border-ivory-300',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
