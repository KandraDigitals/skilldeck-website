"use client";

import React from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface FormNavigationProps {
    currentStep: number;
    totalSteps: number;
    isSubmitting: boolean;
    onNext: () => void;
    onPrev: () => void;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
    currentStep,
    totalSteps,
    isSubmitting,
    onNext,
    onPrev,
}) => {
    return (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            {/* Back Button / Spacer to preserve exact layout */}
            {currentStep > 1 ? (
                <button
                    type="button"
                    onClick={onPrev}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 hover:border-gray-300 text-[13px] font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                >
                    <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
                    <span>Back</span>
                </button>
            ) : (
                <div className="invisible pointer-events-none select-none" aria-hidden="true">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium">
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                    </span>
                </div>
            )}

            {/* Forward / Submit Button */}
            {currentStep < totalSteps ? (
                <button
                    key={`next-btn-${currentStep}`}
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onNext();
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-brand-primary hover:bg-brand-primary/90 text-white text-[13px] font-medium transition-colors cursor-pointer shadow-xs"
                >
                    <span>Continue</span>
                    <ChevronRight className="w-3.5 h-3.5 text-white/70" />
                </button>
            ) : (
                <button
                    key="submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-brand-primary hover:bg-brand-primary/90 text-white text-[13px] font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                            <span>Creating Institute...</span>
                        </>
                    ) : (
                        <>
                            <span>Complete Registration</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-white/80" />
                        </>
                    )}
                </button>
            )}
        </div>
    );
};
