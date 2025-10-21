import React from 'react';
import { cn } from '@/lib/utils';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
};

export const AppButton: React.FC<Props> = ({ variant = 'primary', className = '', children, ...rest }) => {
  if (variant === 'primary') {
    return (
      <button
        {...rest}
        className={cn(
          'inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold text-white',
          'disabled:opacity-60 disabled:cursor-not-allowed',
          className
        )}
        style={{ background: 'linear-gradient(90deg, var(--primary-start), var(--primary-end))', color: 'var(--primary-text)' }}
      >
        {children}
      </button>
    );
  }

  return (
    <button {...rest} className={cn('px-3 py-2 rounded-md', className)}>
      {children}
    </button>
  );
};

export default AppButton;
