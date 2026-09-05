"use client";

import React from "react";
import { Check, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { FieldErrors } from "../hooks/useRegisterForm";

interface Step {
    number: number;
    title: string;
    icon: LucideIcon;
}

interface FormStepperProps {
    steps: Step[];
    currentStep: number;
    fieldErrors: FieldErrors;
    stepErrorCount: (step: number, fieldErrors: FieldErrors) => number;
    onStepClick?: (stepNumber: number) => void;
}

export const FormStepper: React.FC<FormStepperProps> = ({
    steps,
    currentStep,
    fieldErrors,
    stepErrorCount,
    onStepClick,
}) => {
    return (
        <div className="w-full mb-3 sm:mb-4">
            {/* Step Nodes Connected by Inline Progress Lines */}
            <div className="flex items-start justify-between relative">
                {steps.map((step, idx) => {
                    const isActive = step.number === currentStep;
                    const isCompleted = step.number < currentStep;
                    const errorCount = stepErrorCount(step.number, fieldErrors);
                    const StepIcon = step.icon;
                    const isLast = idx === steps.length - 1;

                    return (
                        <React.Fragment key={step.number}>
                            {/* Step Node */}
                            <div
                                onClick={() => {
                                    if (isCompleted && onStepClick) {
                                        onStepClick(step.number);
                                    }
                                }}
                                className={`flex flex-col items-center group select-none shrink-0 relative z-10 ${
                                    isCompleted ? "cursor-pointer" : "cursor-default"
                                }`}
                            >
                                <div
                                    className={`
                                        w-7 h-7 rounded-md flex items-center justify-center transition-all duration-200
                                        ${
                                            isActive
                                                ? "bg-brand-primary text-white font-medium shadow-xs ring-2 ring-brand-primary/20"
                                                : isCompleted
                                                ? "bg-brand-primary/10 text-brand-primary"
                                                : errorCount > 0
                                                ? "bg-rose-50 border border-rose-300 text-rose-500"
                                                : "bg-gray-100 text-gray-400 group-hover:bg-gray-200/70"
                                        }
                                    `}
                                >
                                    {isCompleted ? (
                                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                    ) : (
                                        <StepIcon className="w-3.5 h-3.5" />
                                    )}
                                </div>

                                <span
                                    className={`mt-1 text-[11px] font-medium tracking-tight transition-colors hidden sm:block ${
                                        isActive
                                            ? "text-brand-primary font-medium"
                                            : isCompleted
                                            ? "text-gray-700"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {step.title}
                                </span>
                            </div>

                            {/* Connecting Progress Line Between Step Icons */}
                            {!isLast && (
                                <div className="flex-1 mx-1.5 sm:mx-2.5 h-7 flex items-center">
                                    <div className="w-full bg-gray-100 h-[2px] rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ${
                                                step.number < currentStep
                                                    ? "bg-brand-primary w-full"
                                                    : "w-0"
                                            }`}
                                        />
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};
