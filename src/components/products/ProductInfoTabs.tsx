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
import { Product } from "@/constants";

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

export default function ProductInfoSection({ product }: { product: Product }) {
  const [active, setActive] = useState("overview");
  const overview = product.overview;
  return (
    <Container>
      <div className="mt-2 flex overflow-hidden rounded-xl border border-[#e2d8c8]">
        {/* Sidebar */}
        <nav className="flex w-50 shrink-0 flex-col border-r-2 border-r-[#8d6a3a]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`flex items-center gap-4.5 border-b border-[#e8dfd0] px-4 py-3.5 text-left text-[10px] font-semibold tracking-[0.12em] transition-colors last:border-b-0 ${isActive
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
              <div className="flex w-87.5 shrink-0 flex-col px-6 py-2">
                <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#8d6a3a]">
                  Overview
                </p>
                <h2 className="font-semibold text-2xl leading-tight">
                  {overview?.title}
                </h2>
                <p className="text-xs font-semibold" 
                  dangerouslySetInnerHTML={{__html:overview?.description || `Every curve, every detail is crafted to support the therapist and
                  ensure unmatched comfort for the patient.`}}>
                </p>
                <ul className="mt-4 space-y-2">
                  {overview?.overviewList?.map((item: any) => (
                    <li key={item} className="flex items-start gap-4 text-xs">
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[#8d6a3a]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: 3 highlight cards */}
              <div className="grid min-w-0 flex-1 gap-4 md:grid-cols-3 py-2">
                {overview?.items?.map((h) => (
                  <div key={h.title} className="flex flex-col">
                    <div className="h-[50%] w-full bg-[#e8dfd0] rounded-tr-md rounded-tl-md overflow-hidden relative">
                      <Image src={h.image} alt={h.title} fill className="object-cover" />
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-semibold">{h.title}</p>
                      <p className="mt-1 text-xs" dangerouslySetInnerHTML={{__html:h.description}}>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <>
            {active === "specifications" && (
              <div className="p-4">
                <h3 className="mb-3 text-base font-semibold">
                  {overview?.specifications?.title}
                </h3>

                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-xs">
                {(overview?.specifications?.specificationsList ?? []).map(
  (item: any, key: number) => (
    <div key={key}>
      <p className="font-medium text-[#8d6a3a]">
        {item.title}
      </p>
      <p dangerouslySetInnerHTML={{__html:item.description}}></p>
    </div>
  )
)}
                </div>
              </div>
            )}

            {active === "key-features" && (
              <div className="p-4">
                <h3 className="mb-3 text-base font-semibold">
                  {overview?.keyFeatures?.title}
                </h3>

                         <div className="grid grid-cols-2 gap-3">
                  {overview?.keyFeatures?.keyFeaturesList?.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-lg border border-[#e8dfd0] p-2.5"
                    >
                      <CheckCircle2
                        size={13}
                        className="text-[#8d6a3a]"
                      />
                      <span className="text-xs">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {active === "dimensions" && (
              <div className="p-4">
                <h3 className="mb-3 text-base font-semibold">
                  {overview?.dimensions?.title || "Dimensions"}
                </h3>

                <div className="overflow-hidden rounded-lg border border-[#e8dfd0]">
                  <table className="w-full text-xs">
                    <tbody>
                      {overview?.dimensions?.dimensionsList?.map((item: any, index: number) => (
                        <tr className="border-b border-[#e8dfd0]" key={index}>
                          <td className="px-3 py-1.5 font-medium">{item.title}</td>
                          <td className="px-3 py-1.5" dangerouslySetInnerHTML={{__html:item.description}}></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {active === "material" && (
              <div className="p-4">
                <h3 className="mb-3 text-base font-semibold">
                  {overview?.materialAndCare?.title}
                </h3>

                <div className="text-xs" dangerouslySetInnerHTML={{ __html: overview?.materialAndCare?.description||"" }} />
              </div>
            )}

            {active === "faqs" && (
              <div className="p-4">
                <h3 className="mb-3 text-base font-semibold">
                  Frequently Asked Questions
                </h3>

                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {overview?.faqs?.length ? (
                    overview.faqs.map((item, index) => (
                      <div key={index}>
                        <p className="text-xs font-semibold">
                          {item.question}
                        </p>
                        <p className="mt-1 text-xs text-[#666]" dangerouslySetInnerHTML={{__html:item.description}}>
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">No FAQs available.</p>
                  )}
                </div>
              </div>
            )}
          </>
        </div>
      </div>
    </Container >
  );
}