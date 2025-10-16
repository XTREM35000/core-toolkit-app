import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressStepProps {
  title: string;
  description?: string;
  status: 'completed' | 'current' | 'pending';
  icon?: React.ReactNode;
  index: number;
  isLast?: boolean;
  onClick?: () => void;
}

export const ProgressStep = ({
  title,
  description,
  status,
  icon,
  index,
  isLast = false,
  onClick
}: ProgressStepProps) => {
  return (
    <div 
      className={cn(
        "relative flex items-start gap-4 pb-8",
        onClick && "cursor-pointer hover:opacity-80 transition-opacity",
        isLast && "pb-0"
      )}
      onClick={onClick}
    >
      {/* Connector line */}
      {!isLast && (
        <div 
          className={cn(
            "absolute left-5 top-12 w-0.5 h-full -ml-px",
            status === 'completed' ? 'bg-primary' : 'bg-border'
          )}
        />
      )}

      {/* Step indicator */}
      <div className="relative z-10 flex-shrink-0">
        <div
          className={cn(
            "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all",
            status === 'completed' && "bg-primary border-primary text-primary-foreground",
            status === 'current' && "bg-background border-primary text-primary shadow-glow",
            status === 'pending' && "bg-muted border-border text-muted-foreground"
          )}
        >
          {status === 'completed' ? (
            <Check className="w-5 h-5" />
          ) : icon ? (
            icon
          ) : (
            <span className="text-sm font-medium">{index}</span>
          )}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 pt-1">
        <h4 className={cn(
          "font-semibold mb-1",
          status === 'completed' && "text-foreground",
          status === 'current' && "text-primary",
          status === 'pending' && "text-muted-foreground"
        )}>
          {title}
        </h4>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
