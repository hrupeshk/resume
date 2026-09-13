import React from 'react';

export interface StepItem {
  id: string;
  title: string;
  description: string;
}

interface StepNavigatorProps {
  steps: StepItem[];
  currentStepIndex: number;
  onSelectStep: (index: number) => void;
}

export default function StepNavigator({
  steps,
  currentStepIndex,
  onSelectStep,
}: StepNavigatorProps) {
  return (
    <nav aria-label="Resume Builder Steps" className="mb-6">
      <ol className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {steps.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isCompleted = idx < currentStepIndex;

          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => onSelectStep(idx)}
                className={`w-full text-left p-2.5 sm:p-3 rounded-md border transition-all text-xs font-sans ${
                  isActive
                    ? 'border-ink bg-canvas-elevated shadow-xs'
                    : isCompleted
                    ? 'border-hairline bg-canvas hover:border-mute text-body'
                    : 'border-hairline-soft bg-canvas opacity-70 hover:opacity-100 text-mute'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-mono font-medium ${
                      isActive
                        ? 'bg-primary text-on-primary'
                        : isCompleted
                        ? 'bg-neutral-200 text-neutral-800'
                        : 'bg-neutral-100 text-neutral-400'
                    }`}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-mute">
                    Step {idx + 1}
                  </span>
                </div>
                <div className="font-medium text-ink truncate">{step.title}</div>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
