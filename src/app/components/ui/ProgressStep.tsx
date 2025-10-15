import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressStepProps {
  title: string;
  description?: string;
  status: 'completed' | 'current' | 'pending';
  icon?: React.ReactNode;
  index?: number;
  isLast?: boolean;
  onClick?: () => void;
}

export const ProgressStep: React.FC<ProgressStepProps> = ({ title, description, status, icon, index, isLast, onClick }) => {
  return (
    <div onClick={onClick} className={cn('flex items-start space-x-4', onClick && 'cursor-pointer')}>
      <div className={cn('flex-shrink-0')}>
        <div className={cn('w-8 h-8 rounded-full flex items-center justify-center',
          status === 'completed' ? 'bg-green-500 text-white' : status === 'current' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground')}
        >
          {icon || <span className="text-sm font-medium">{index}</span>}
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">{title}</h4>
          {!isLast && <div className="w-6 h-px bg-border ml-4" />}
        </div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </div>
    </div>
  );
};

export default ProgressStep;
