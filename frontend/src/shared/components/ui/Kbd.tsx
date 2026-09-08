import * as React from 'react';
import { cn } from '../../../core/utils/cn';

export interface KbdProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const Kbd = React.forwardRef<HTMLSpanElement, KbdProps>(
  ({ className, ...props }, ref) => {
    return (
      <kbd
        ref={ref}
        className={cn(
          'inline-flex items-center rounded border border-surface-border bg-surface-subtle px-2 py-0.5 font-mono text-xs font-medium text-text-secondary',
          className
        )}
        {...props}
      />
    );
  }
);
Kbd.displayName = 'Kbd';