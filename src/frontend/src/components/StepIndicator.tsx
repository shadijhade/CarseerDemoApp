interface StepIndicatorProps {
    currentStep: number;
}

const steps = [
    { number: 1, label: "Make" },
    { number: 2, label: "Year & Type" },
    { number: 3, label: "Results" },
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
    return (
        <div className="flex items-center gap-1 mb-6">
            {steps.map((step, i) => {
                const isCompleted = currentStep > step.number;
                const isActive = currentStep === step.number;

                return (
                    <div key={step.number} className="flex items-center gap-1 flex-1 last:flex-none">
                        <div className="flex items-center gap-2">
                            <div
                                className={`
                                    w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold transition-all duration-300
                                    ${isCompleted
                                        ? "bg-primary text-primary-foreground"
                                        : isActive
                                            ? "bg-foreground text-background"
                                            : "bg-muted text-muted-foreground"
                                    }
                                `}
                            >
                                {isCompleted ? (
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    step.number
                                )}
                            </div>
                            <span
                                className={`text-xs font-medium transition-colors duration-200 ${
                                    isActive ? "text-foreground" : isCompleted ? "text-primary" : "text-muted-foreground"
                                }`}
                            >
                                {step.label}
                            </span>
                        </div>

                        {i < steps.length - 1 && (
                            <div className="flex-1 mx-2">
                                <div
                                    className="h-px bg-border stepper-line"
                                    style={{ "--progress": isCompleted ? 1 : 0 } as React.CSSProperties}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
