import { cn } from '@/lib/utils';
import { Badge } from './badge';

interface StatusBadgeProps {
  variant: 'completed' | 'current' | 'pending';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const StatusBadge = ({ 
  variant, 
  size = 'md',
  children 
}: StatusBadgeProps) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  return (
    <Badge
      className={cn(
        sizeClasses[size],
        "font-medium",
        variant === 'completed' && "bg-primary text-primary-foreground",
        variant === 'current' && "bg-accent text-accent-foreground border-primary",
        variant === 'pending' && "bg-muted text-muted-foreground"
      )}
    >
      {children}
    </Badge>
  );
};
