"use client";

import { useState } from "react";
import {
  LayoutGrid,
  SlidersHorizontal,
  Zap,
  Ruler,
  Droplets,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import { Container } from "../ui/Container";

const tabs = [
  { id: "overview", label: "OVERVIEW", icon: LayoutGrid },
  { id: "specifications", label: "SPECIFICATIONS", icon: SlidersHorizontal },
  { id: "key-features", label: "KEY FEATURES", icon: Zap },
  { id: "dimensions", label: "DIMENSIONS", icon: Ruler },
  { id: "material", label: "MATERIAL & CARE", icon: Droplets },
  { id: "faqs", label: "FAQS", icon: HelpCircle },
];

const highlights = [
  { title: "Premium Teak Wood", desc: "Handpicked seasoned teak for strength, stability & longevity." },
  { title: "Oil Collection Channel", desc: "Efficient drainage system for easy cleaning & hygiene." },
  { title: "Brass Oil Pot Stand", desc: "Sturdy brass stand with premium finish for durability." },
];

const overviewBullets = [
  "Traditional Ayurvedic Design",
  "Ergonomic Patient Comfort",
  "Oil Collection System with Drainage",
  "Strong & Durable Structure",
];

export default function ProductInfoSection() {
  const [active, setActive] = useState("overview");

  return (
    <Container>
    <div className="mt-6 flex overflow-hidden rounded-xl border border-[#e8dfd0] bg-[#faf6f0]">
      {/* Sidebar */}
      <nav className="flex w-[200px] shrink-0 flex-col border-r border-[#e8dfd0]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2.5 border-b border-[#e8dfd0] px-4 py-3.5 text-left text-[11px] font-semibold tracking-[0.12em] transition-colors last:border-b-0 ${
                isActive
                  ? "border-r-2 border-r-[#8d6a3a] bg-white text-[#8d6a3a]"
                  : "text-[#6b6b6b] hover:bg-white/60"
              }`}
            >
              <Icon size={14} className={isActive ? "text-[#8d6a3a]" : "text-[#9a9a9a]"} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {active === "overview" && (
          <div className="flex h-full">
            {/* Left: heading + bullets */}
            <div className="flex w-[350px] shrink-0 flex-col justify-center border-r border-[#e8dfd0] p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8d6a3a]">
                Overview
              </p>
              <h2 className="font-semibold text-2xl leading-tight">
                Thoughtfully Designed.
                <br />
                Masterfully Crafted.
              </h2>
              <p className="text-xs">
                Every curve, every detail is crafted to support the therapist and
                ensure unmatched comfort for the patient.
              </p>
              <ul className="mt-4 space-y-2">
                {overviewBullets.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[#8d6a3a]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: 3 highlight cards */}
            <div className="grid min-w-0 flex-1 gap-2 md:grid-cols-3">
              {highlights.map((h) => (
                <div key={h.title} className="flex flex-col">
                  <div className="h-[50%] w-full bg-[#e8dfd0]" />
                  <div className="p-4">
                    <p className="text-xs font-semibold">{h.title}</p>
                    <p className="mt-1 text-xs">
                      {h.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {active !== "overview" && (
          <div className="flex h-full items-center justify-center p-10 text-xs text-[#9a9a9a]">
            {tabs.find((t) => t.id === active)?.label} content goes here.
          </div>
        )}
      </div>
    </div>
    </Container>
  );
}