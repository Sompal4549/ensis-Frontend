"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import dimensions from "@/assets/products/product.webp";
import ayurveda_clinics from "@/assets/products/durable_and_highzenic.webp";
import spa_and_wellness from "@/assets/products/spa_and_wellness.webp";
import teak_and_finish from "@/assets/products/teak_and_finish.webp";
import need_customization from "@/assets/products/need_customization.webp";
import therapy_centers from "@/assets/products/therapy_centers.webp";
import wallnut_finish from "@/assets/products/wallnut_finish.webp";
import honey_oak from "@/assets/products/honey_oak.png";
import mahogany from "@/assets/products/mahogany.png";

const specs = [
  { label: "Material", value: "Premium Teak Wood" },
  { label: "Wood Finish", value: "Natural Teak Polish" },
  { label: "Dimensions (L x W x H)", value: "78 x 30 x 30 inches (Customizable)" },
  { label: "Weight Capacity", value: "Upto 300 Kg" },
  { label: "Oil Collecting Channel", value: "Yes, with Drain Pipe" },
  { label: "Headrest", value: "Adjustable" },
  { label: "Accessories", value: "Oil Channel, Drain Pipe, Headrest" },
  { label: "Brass Fittings", value: "Yes" },
  { label: "Assembly", value: "Pre-Assembled" },
  { label: "Usage", value: "Abhyanga, Shirodhara, Pichichil & more" },
  { label: "Warranty", value: "1 Year Manufacturing Warranty" },
];

const whatsIncluded = [
  "1x Pancharkarma Therapy Table",
  "1x Adjustable Headrest",
  "1x Oil Collecting Channel with Drain Pipe",
  "1x Shirodhara Stand (Optional)",
  "1x User Manual & Care Instructions",
];

const finishes = [
  { id: "teak", label: "Natural Teak", image: teak_and_finish },
  { id: "walnut", label: "Walnut", image: wallnut_finish },
  { id: "honey", label: "Honey Oak", image: honey_oak },
  { id: "mahogany", label: "Mahogany", image: mahogany },
];

const sizeOptions = [
  { label: "Standard", desc: "78 x 30 x 30 in", active: true },
  { label: "Resort Edition", desc: "84 x 30 x 30 in", active: false },
  { label: "Luxury XL", desc: "84 x 36 x 30 in", active: false },
  { label: "Custom Size", desc: "Any Size", active: false },
];

const calloutLabels = [
  { text: "Adjustable\nHeadrest", top: "12%", left: "13%" },
  { text: "Oil Collecting\nChannel Stand", top: "38%", left: "6%" },
  { text: "Teak Wood\nFrame", top: "62%", left: "10%" },
  { text: "Sturdy Storage\nBeds", top: "78%", left: "28%" },
];

export default function ProductInfoSection() {
  const [finish, setFinish] = useState("teak");

  return (
    <div className="bg-[#f5f0e8] rounded-xl overflow-hidden border border-[#e2d8c8]">

      {/* ── TOP LABEL ── */}
      <div className="px-6 pt-5 pb-1">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8d6a3a]">
          Smart Design. Superior Functionality.
        </p>
      </div>

      {/* ── SECTION 1: Product image + specs + what's included ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr_0.75fr] gap-0 border-b border-[#e2d8c8]">

        {/* Left: product image with callout labels */}
        <div className="border-r border-[#e2d8c8] px-5">
          <h2 className="font-serif text-2xl leading-tight mb-4">Product Specifications</h2>
          <div className="relative w-full">
            <Image
              src={dimensions}
              alt="Product dimensions diagram"
              width={400}
              height={300}
              className="w-full object-contain"
            />
          
          </div>
        </div>

        {/* Middle: specs table */}
        <div className="border-r border-[#e2d8c8] p-5">
          <table className="w-full text-[11px] border-collapse">
            <tbody>
              {specs.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white/70" : ""}>
                  <td className="py-2 px-3 border border-[#d4c4a8] font-semibold align-top w-[44%] leading-snug">
                    {row.label}
                  </td>
                  <td className="py-2 px-3 border border-[#d4c4a8] align-top leading-snug">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: what's included + need customization */}
        <div className="flex flex-col gap-4 p-5">
          {/* What's Included */}
          <div className="bg-white rounded-lg border border-[#e2d8c8] p-4">
            <h3 className="font-semibold text-sm mb-3">What's Included</h3>
            <ul className="space-y-2">
              {whatsIncluded.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] leading-snug">
                  <Check size={13} className="shrink-0 mt-0.5 text-[#8d6a3a]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Need Customization */}
          <div className="bg-white rounded-lg border border-[#e2d8c8] p-4">
            <div className="flex items-start gap-3">
              <div className="w-25 h-15 flex items-center justify-center">
                <Image src={need_customization} alt="customization" width={48} height={48} className="object-fill" />
              </div>
              <div>
                <h3 className="font-semibold text-sm leading-tight">Need Customization?</h3>
                <p className="text-[10px] mt-1 leading-snug">
                  We create custom Panchkarma tables as per your therapy requirements.
                </p>
            <button className="w-full flex items-center justify-center gap-1.5 border border-[#8d6a3a] rounded-md py-1 text-[11px] font-bold uppercase tracking-wider text-[#8d6a3a] hover:bg-[#8d6a3a] hover:text-white transition-colors mt-2">
              Contact Our Experts <ArrowRight size={12} />
            </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: Wood finish + size options + bulk order ── */}
      <div className="px-1">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8d6a3a] px-4 pt-4">
          Smart Design Appearance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr_0.75fr] gap-0">
        {/* Wood Finish */}
        <div className="border-r border-[#e2d8c8] px-5">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-4">Wood Finish</h3>
          <div className="flex flex-wrap gap-4">
            {finishes.map((f) => (
              <button
                key={f.id}
                onClick={() => setFinish(f.id)}
                className="flex flex-col items-center gap-1.5"
              >
                <div className={`rounded-full overflow-hidden border-2 transition-all ${finish === f.id ? "border-[#8d6a3a]" : "border-transparent opacity-60 hover:opacity-90"}`}>
                  <Image
                    src={f.image}
                    alt={f.label}
                    width={56}
                    height={56}
                    className="w-14 h-14 object-cover rounded-full"
                  />
                </div>
                <span className="text-[10px] font-medium">{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Size Options */}
        <div className="border-r border-[#e2d8c8] px-5">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-4">Size Options</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {sizeOptions.map((s) => (
              <div
                key={s.label}
                className={`rounded-lg border px-3 py-2.5 text-center cursor-pointer transition-colors ${
                  s.active
                    ? "border-[#8d6a3a] bg-white"
                    : "border-[#d4c4a8] hover:border-[#8d6a3a]/50"
                }`}
              >
                <p className="text-[11px] font-semibold leading-tight">{s.label}</p>
                <p className="text-[10px] mt-0.5">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Ideal For row */}
          {/* <div className="mt-5">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-3">Ideal For</h3>
            <div className="flex flex-wrap gap-5">
              {[
                { label: "Panchkarma\nRoom", icon: panchkarma_rooms },
                { label: "Ayurveda\nClinics", icon: ayurveda_clinics },
                { label: "Spa &\nWellness", icon: spa_and_wellness },
                { label: "Therapy\nCenters", icon: therapy_centers },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1 text-center">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <Image src={item.icon} alt={item.label} width={36} height={36} className="object-contain" />
                  </div>
                  <span className="text-[10px] leading-tight whitespace-pre-line">{item.label}</span>
                </div>
              ))}
            </div>
          </div> */}
        </div>

        {/* Bulk Order */}
        <div className="px-5 flex flex-col justify-center">
          <div className="bg-white rounded-lg border border-[#e2d8c8] p-4">
            <h3 className="font-semibold text-sm leading-tight mb-1">Bulk Order / Project?</h3>
            <p className="text-[11px] leading-snug mb-4">
              We offer special pricing for bulk orders and turnkey wellness projects.
            </p>
            <button className="w-full flex items-center justify-center gap-1.5 border border-[#8d6a3a] rounded-md py-1 text-[11px] font-bold uppercase tracking-wider text-[#8d6a3a] hover:bg-[#8d6a3a] hover:text-white transition-colors">
              Get Bulk Quote <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      {/* <div className="bg-[#d8d0bc] border-t border-[#c4b89a]">
        <div className="px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border border-[#6a7c4a] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 20 20" className="w-3 h-3" fill="none">
                <circle cx="10" cy="10" r="8" stroke="#6a7c4a" strokeWidth="1.5" />
                <path d="M6 10l3 3 5-5" stroke="#6a7c4a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Made in India</span>
          </div>
          <p className="text-[11px] italic">Custom sizes and finishes available on request.</p>
          <div className="flex items-center gap-1">
            <span className="text-2xl font-black leading-none">F</span>
            <sup className="text-[8px] font-bold -ml-0.5 mt-0.5">i</sup>
            <span className="text-[11px] font-bold uppercase tracking-widest ml-0.5">Ensis Solutions</span>
          </div>
        </div>
      </div> */}
    </div>
  );
}