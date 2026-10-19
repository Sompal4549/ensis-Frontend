"use client";

import React from "react";
import { Check } from "lucide-react";

export type FlowStep = {
  id: number;
  label: string;
  sublabel?: string;
};

export const APPLICATION_FLOW_STEPS: FlowStep[] = [
  { id: 1, label: "Upload CV", sublabel: "Completed" },
  { id: 2, label: "AI Analysis", sublabel: "Completed" },
  { id: 3, label: "Review Details", sublabel: "Current Step" },
  { id: 4, label: "Submit Application", sublabel: "Next" },
];

export function Stepper({
  currentStep,
  steps = APPLICATION_FLOW_STEPS,
}: {
  currentStep: number;
  steps?: FlowStep[];
}) {
  return (
    <div className="w-full bg-[#fbf6ec]/40 py-4 sm:py-6 border-b border-[#eadfcd]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Desktop View */}
        <div className="hidden sm:flex items-center justify-between relative">
          {/* Connector line behind circles */}
          <div className="absolute top-4 left-6 right-6 h-[2px] bg-[#eadfcd] z-0" />
          <div
            className="absolute top-4 left-6 h-[2px] bg-[#163a2b] transition-all duration-500 z-0"
            style={{
              width: `${Math.max(0, Math.min(100, ((currentStep - 1) / (steps.length - 1)) * 100))}%`,
            }}
          />

          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center text-center">
                <div
                  className={`size-8 sm:size-9 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm transition-all shadow-sm ${
                    isCompleted
                      ? "bg-[#163a2b] text-white ring-4 ring-[#fbf6ec]"
                      : isCurrent
                      ? "bg-[#a8792c] text-white ring-4 ring-[#f4d58a]/50"
                      : "bg-[#fffdf8] text-[#8d6a3a] border-2 border-[#eadfcd] ring-4 ring-[#fbf6ec]"
                  }`}
                >
                  {isCompleted ? <Check size={16} strokeWidth={2.5} /> : step.id}
                </div>
                <p
                  className={`mt-2 text-xs sm:text-sm font-semibold ${
                    isCurrent ? "text-[#163a2b]" : isCompleted ? "text-[#163a2b]/80" : "text-[#8d6a3a]/70"
                  }`}
                >
                  {step.label}
                </p>
                <span className="text-[11px] text-[#8d6a3a]">
                  {isCompleted ? "Completed" : isCurrent ? "In Progress" : "Pending"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Mobile View (Compact) */}
        <div className="sm:hidden flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="size-7 rounded-full bg-[#163a2b] text-white text-xs font-semibold flex items-center justify-center">
              {currentStep}
            </span>
            <div>
              <p className="text-xs font-semibold text-[#163a2b]">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.label}
              </p>
              <p className="text-[10px] text-[#8d6a3a]">
                Next: {steps[currentStep]?.label || "Finish"}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`h-1.5 w-6 rounded-full transition-colors ${
                  step.id <= currentStep ? "bg-[#163a2b]" : "bg-[#eadfcd]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
