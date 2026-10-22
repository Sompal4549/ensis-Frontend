"use client";

import React from "react";
import type { BreakdownItem } from "@/lib/careerApi";
import {
  GraduationCap,
  Briefcase,
  Wrench,
  Sparkles,
  MessageSquare,
  Image as ImageIcon,
  MapPin,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  education: GraduationCap,
  experience: Briefcase,
  technical_skills: Wrench,
  creative_thinking: Sparkles,
  communication: MessageSquare,
  portfolio: ImageIcon,
  location: MapPin,
};

export function BreakdownBars({
  items,
  thresholds = { eligible: 70, partial: 50 },
}: {
  items: BreakdownItem[];
  thresholds?: { eligible: number; partial: number };
}) {
  return (
    <div className="space-y-4">
      {items.map((item) => {
        const Icon = ICON_MAP[item.key] || Briefcase;
        const score = Math.max(0, Math.min(100, Math.round(item.score)));

        const isGreen = score >= thresholds.eligible;
        const isAmber = score >= thresholds.partial && !isGreen;

        const barColor = isGreen ? "bg-[#163a2b]" : isAmber ? "bg-[#d97706]" : "bg-[#dc2626]";
        const badgeColor = isGreen
          ? "text-[#163a2b] font-semibold"
          : isAmber
          ? "text-[#b45309] font-semibold"
          : "text-[#dc2626] font-semibold";

        return (
          <div key={item.key} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded bg-[#f4ebd9] text-[#8d6a3a]">
                  <Icon size={13} />
                </span>
                <div>
                  <span className="font-semibold text-[#163a2b]">{item.label}</span>
                  {item.sublabel && (
                    <span className="hidden sm:inline text-xs text-[#8d6a3a] ml-2">
                      — {item.sublabel}
                    </span>
                  )}
                </div>
              </div>
              <span className={`text-xs sm:text-sm ${badgeColor}`}>{score}%</span>
            </div>

            {/* Track */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#eadfcd]/60">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
