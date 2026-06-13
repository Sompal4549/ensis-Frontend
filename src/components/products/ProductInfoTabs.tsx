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
import img1 from '@/assets/home/img-1.webp';
import Image from "next/image";

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
    <div className="mt-2 flex overflow-hidden rounded-xl border border-[#e2d8c8]">
      {/* Sidebar */}
      <nav className="flex w-[200px] shrink-0 flex-col border-r-2 border-r-[#8d6a3a]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2.5 border-b border-[#e8dfd0] px-4 py-3.5 text-left text-[11px] font-semibold tracking-[0.12em] transition-colors last:border-b-0 ${
                isActive
                  ? " bg-white text-[#8d6a3a] font-bold"
                  : "text-[#6b6b6b] hover:bg-white/60 font-normal"
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
            <div className="flex w-[350px] shrink-0 flex-col px-6 py-2">
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#8d6a3a]">
                Overview
              </p>
              <h2 className="font-semibold text-2xl leading-tight">
                Thoughtfully Designed.
                <br />
                Masterfully Crafted.
              </h2>
              <p className="text-xs font-semibold">
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
            <div className="grid min-w-0 flex-1 gap-2 md:grid-cols-3 py-2">
              {highlights.map((h) => (
                <div key={h.title} className="flex flex-col">
                  <div className="h-[50%] w-full bg-[#e8dfd0] rounded-tr-md rounded-tl-md overflow-hidden relative">
                    <Image src={img1} alt={h.title} fill className="object-cover" />
                  </div>
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

      <>
  {active === "specifications" && (
    <div className="p-6">
      <h3 className="mb-6 text-2xl font-semibold">
        Technical Specifications
      </h3>

      <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-sm">
        <div>
          <p className="font-medium text-[#8d6a3a]">Wood Type</p>
          <p>Premium Seasoned Teak Wood</p>
        </div>

        <div>
          <p className="font-medium text-[#8d6a3a]">Finish</p>
          <p>Natural Protective Polish</p>
        </div>

        <div>
          <p className="font-medium text-[#8d6a3a]">Weight Capacity</p>
          <p>Up to 250 kg</p>
        </div>

        <div>
          <p className="font-medium text-[#8d6a3a]">Drainage System</p>
          <p>Integrated Oil Collection Channel</p>
        </div>

        <div>
          <p className="font-medium text-[#8d6a3a]">Assembly</p>
          <p>Pre-Assembled</p>
        </div>

        <div>
          <p className="font-medium text-[#8d6a3a]">Warranty</p>
          <p>5 Years Manufacturing Warranty</p>
        </div>
      </div>
    </div>
  )}

  {active === "key-features" && (
    <div className="p-6">
      <h3 className="mb-6 text-2xl font-semibold">
        Key Features
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {[
          "Traditional Ayurvedic Design",
          "Premium Brass Accessories",
          "Integrated Oil Drainage",
          "Ergonomic Patient Support",
          "Handcrafted by Artisans",
          "Moisture Resistant Finish",
        ].map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-lg border border-[#e8dfd0] p-4"
          >
            <CheckCircle2
              size={16}
              className="text-[#8d6a3a]"
            />
            <span className="text-sm">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )}

  {active === "dimensions" && (
    <div className="p-2">
      <h3 className="mb-2 text-2xl font-semibold">
        Dimensions
      </h3>

      <div className="overflow-hidden rounded-lg border border-[#e8dfd0]">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-[#e8dfd0]">
              <td className="p-2 font-medium">Length</td>
              <td className="p-2">84 Inches</td>
            </tr>

            <tr className="border-b border-[#e8dfd0]">
              <td className="p-2 font-medium">Width</td>
              <td className="p-2">30 Inches</td>
            </tr>

            <tr className="border-b border-[#e8dfd0]">
              <td className="p-2 font-medium">Height</td>
              <td className="p-2">32 Inches</td>
            </tr>

            <tr>
              <td className="p-2 font-medium">
                Custom Sizes
              </td>
              <td className="p-2">
                Available On Request
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )}

  {active === "material" && (
    <div className="p-2">
      <h3 className="mb-2 text-2xl font-semibold">
        Material & Care
      </h3>

      <div className="space-y-2 text-sm">
        <div>
          <h4 className="mb-2 font-semibold">
            Materials Used
          </h4>
          <p>
            Crafted from premium-grade teak wood with
            corrosion-resistant brass fittings and a
            natural protective finish.
          </p>
        </div>

        <div>
          <h4 className="mb-2 font-semibold">
            Care Instructions
          </h4>

          <ul className="space-y-2">
            <li>• Wipe clean after each therapy session.</li>
            <li>• Avoid harsh chemical cleaners.</li>
            <li>• Keep away from prolonged moisture.</li>
            <li>• Re-polish periodically for longevity.</li>
          </ul>
        </div>
      </div>
    </div>
  )}

  {active === "faqs" && (
    <div className="p-6">
      <h3 className="mb-6 text-2xl font-semibold">
        Frequently Asked Questions
      </h3>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="font-semibold">
            Is customization available?
          </p>
          <p className="mt-2 text-sm text-[#666]">
            Yes. Dimensions, finish, upholstery and
            accessories can be customized.
          </p>
        </div>

        <div>
          <p className="font-semibold">
            What is the delivery time?
          </p>
          <p className="mt-2 text-sm text-[#666]">
            Standard delivery takes 7–14 working days.
          </p>
        </div>

        <div>
          <p className="font-semibold">
            Do you provide installation?
          </p>
          <p className="mt-2 text-sm text-[#666]">
            Installation assistance is available in
            major cities.
          </p>
        </div>

        <div>
          <p className="font-semibold">
            Is EMI available?
          </p>
          <p className="mt-2 text-sm text-[#666]">
            Yes, EMI options are available through
            supported payment partners.
          </p>
        </div>
      </div>
    </div>
  )}
</>
      </div>
    </div>
    </Container>
  );
}