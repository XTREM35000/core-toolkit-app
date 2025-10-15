// src/components/ui/workflow-progress-bar.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface WorkflowStep {
  id: string;
  title: string;
  description?: string;
  icon?: string;
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

    // Horizontal variant pour l'onboarding
    return (
      <div ref={ref} className={cn("space-y-4", className)}>
        {/* Horizontal progress bar */}
        {showProgress && (
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">
                Étape {currentStepIndex + 1} sur {totalSteps}
              </h3>
              <span className="text-xs bg-[#128C7E] text-white px-2 py-1 rounded-full">
                {Math.round(progressPercentage)}%
              </span>
            </div>

            <Progress
              value={progressPercentage}
              className="h-2 bg-gray-200"
            />

            <div className="flex justify-between mt-2 text-xs text-gray-500">
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
                    "flex flex-col items-center space-y-2 p-3 rounded-lg transition-all min-w-[120px]",
                    onStepClick && "cursor-pointer hover:bg-gray-50",
                    status === "current" && "bg-[#128C7E]/5 border border-[#128C7E]/20"
                  )}
                  onClick={() => onStepClick?.(step.id)}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all",
                      status === "completed" && "bg-green-500 text-white border-green-500",
                      status === "current" && "bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white border-none shadow-lg",
                      status === "pending" && "bg-gray-200 text-gray-500 border-gray-300"
                    )}
                  >
                    {step.icon ? (
                      <span className="text-lg">{step.icon}</span>
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>

                  <div className="text-center">
                    <p className={cn(
                      "text-xs font-medium",
                      status === "completed" && "text-green-600",
                      status === "current" && "text-[#128C7E] font-semibold",
                      status === "pending" && "text-gray-500"
                    )}>
                      {step.title}
                    </p>

                    {step.description && (
                      <p className="text-xs text-gray-400 mt-1">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-8 h-0.5 mx-2 transition-all",
                      completedSteps.includes(step.id) ? "bg-green-500/50" : "bg-gray-300"
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
