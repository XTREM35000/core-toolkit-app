import * as React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  children?: React.ReactNode;
  variant?: 'current' | 'default' | 'success';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ children, variant = 'default', size = 'md' }) => {
  const base = 'inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-semibold';
  const variantClass = variant === 'current' ? 'bg-primary text-white' : variant === 'success' ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground';
  return <div className={cn(base, variantClass)}>{children}</div>;
};

export default StatusBadge;
