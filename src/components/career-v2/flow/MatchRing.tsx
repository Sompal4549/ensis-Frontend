"use client";

import React from "react";
import { Star, AlertCircle, CheckCircle2 } from "lucide-react";

export type MatchRingProps = {
  score?: number;
  level?: "eligible" | "partial" | "not_eligible";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
};

export function MatchRing({
  score = 85,
  level = "eligible",
  size = "md",
  showLabel = true,
  className = "",
}: MatchRingProps) {
  const isEligible = level === "eligible";
  const isPartial = level === "partial";

  const strokeColor = isEligible ? "#163a2b" : isPartial ? "#d97706" : "#dc2626";
  const bgColor = isEligible ? "#e8efe9" : isPartial ? "#fef3c7" : "#fee2e2";

  const dimension = size === "lg" ? 100 : size === "sm" ? 56 : 76;
  const strokeWidth = size === "lg" ? 9 : size === "sm" ? 6 : 7;
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const badgeText = isEligible ? "Strong Match" : isPartial ? "Moderate Match" : "Not Eligible";
  const badgeClasses = isEligible
    ? "bg-[#e8efe9] text-[#163a2b] border-[#c2d7c5]"
    : isPartial
    ? "bg-[#fffbeb] text-[#92400e] border-[#fde68a]"
    : "bg-[#fef2f2] text-[#991b1b] border-[#fecaca]";

  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {/* Donut SVG */}
      <div className="relative shrink-0 flex items-center justify-center" style={{ width: dimension, height: dimension }}>
        <svg width={dimension} height={dimension} className="-rotate-90">
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            fill="transparent"
            stroke={bgColor}
            strokeWidth={strokeWidth}
          />
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span
            className={`font-semibold tracking-tight text-[#163a2b] ${
              size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-lg"
            }`}
          >
            {score}%
          </span>
        </div>
      </div>

      {/* Level Label Badge */}
      {showLabel && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClasses}`}
            >
              {isEligible ? (
                <Star size={12} className="fill-[#163a2b] text-[#163a2b]" />
              ) : isPartial ? (
                <CheckCircle2 size={12} />
              ) : (
                <AlertCircle size={12} />
              )}
              {badgeText}
            </span>
          </div>
          <p className="text-[11px] text-[#6b6255] max-w-[170px] leading-tight">
            {isEligible
              ? "Your profile matches well with the job requirements."
              : isPartial
              ? "Good foundation with a few gaps to address."
              : "Profile does not meet critical qualifications."}
          </p>
        </div>
      )}
    </div>
  );
}
