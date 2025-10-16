import * as React from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { ProgressStep } from "./ProgressStep";
import { StatusBadge } from "./StatusBadge";

interface WorkflowStep {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

interface WorkflowProgressBarProps {
  steps: WorkflowStep[];
  currentStep: string;
  completedSteps: string[];
  onStepClick?: (stepId: string) => void;
  className?: string;
  variant?: "horizontal" | "vertical";
  showProgress?: boolean;
}

const WorkflowProgressBar = React.forwardRef<HTMLDivElement, WorkflowProgressBarProps>(
  ({ 
    steps, 
    currentStep, 
    completedSteps, 
    onStepClick, 
    className,
    variant = "horizontal",
    showProgress = true 
  }, ref) => {
    const currentStepIndex = steps.findIndex(step => step.id === currentStep);
    const totalSteps = steps.length;
    const completedCount = completedSteps.length;
    const progressPercentage = ((completedCount + (currentStepIndex >= 0 ? 0.5 : 0)) / totalSteps) * 100;

    const getStepStatus = (stepId: string, index: number): "completed" | "current" | "pending" => {
      if (completedSteps.includes(stepId)) return "completed";
      if (stepId === currentStep) return "current";
      return "pending";
    };

    if (variant === "vertical") {
      return (
        <div ref={ref} className={cn("space-y-6", className)}>
          {/* Global progress header */}
          {showProgress && (
            <div className="bg-gradient-card rounded-lg p-4 border border-border shadow-subtle">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Progression globale</h3>
                  <p className="text-xs text-muted-foreground">
                    {completedCount} sur {totalSteps} étapes terminées
                  </p>
                </div>
                <StatusBadge variant="current" size="sm">
                  {Math.round(progressPercentage)}%
                </StatusBadge>
              </div>
              
              <Progress 
                value={progressPercentage} 
                className="h-2 bg-muted/30"
              />
            </div>
          )}

          {/* Vertical steps */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <ProgressStep
                key={step.id}
                title={step.title}
                description={step.description}
                status={getStepStatus(step.id, index)}
                icon={step.icon}
                index={index + 1}
                isLast={index === steps.length - 1}
                onClick={() => onStepClick?.(step.id)}
              />
            ))}
          </div>
        </div>
      );
    }

    // Horizontal variant
    return (
      <div ref={ref} className={cn("space-y-4", className)}>
        {/* Horizontal progress bar */}
        {showProgress && (
          <div className="bg-gradient-card rounded-lg p-4 border border-border shadow-subtle">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">
                Étape {currentStepIndex + 1} sur {totalSteps}
              </h3>
              <StatusBadge variant="current" size="sm">
                {Math.round(progressPercentage)}%
              </StatusBadge>
            </div>
            
            <Progress 
              value={progressPercentage} 
              className="h-2 bg-muted/30"
            />
            
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Début</span>
              <span>Terminé</span>
            </div>
          </div>
        )}

        {/* Horizontal steps */}
        <div className="flex items-center justify-between space-x-2 overflow-x-auto pb-2">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id, index);
            
            return (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <div
                  className={cn(
                    "flex flex-col items-center space-y-2 p-3 rounded-lg transition-apple min-w-[120px]",
                    onStepClick && "cursor-pointer hover:bg-muted/20",
                    status === "current" && "bg-primary/5 border border-primary/20"
                  )}
                  onClick={() => onStepClick?.(step.id)}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-apple",
                      status === "completed" && "bg-success text-success-foreground border-success",
                      status === "current" && "bg-gradient-whatsapp text-white border-none shadow-glow",
                      status === "pending" && "bg-muted text-muted-foreground border-border"
                    )}
                  >
                    {step.icon || <span className="text-sm font-medium">{index + 1}</span>}
                  </div>
                  
                  <div className="text-center">
                    <p className={cn(
                      "text-xs font-medium",
                      status === "completed" && "text-success",
                      status === "current" && "text-primary font-semibold",
                      status === "pending" && "text-muted-foreground"
                    )}>
                      {step.title}
                    </p>
                    
                    {step.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-8 h-0.5 mx-2 transition-apple",
                      completedSteps.includes(step.id) ? "bg-success/50" : "bg-border"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

WorkflowProgressBar.displayName = "WorkflowProgressBar";

export { WorkflowProgressBar };
export type { WorkflowStep };