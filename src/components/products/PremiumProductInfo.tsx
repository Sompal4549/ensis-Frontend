"use client";

import Image from "next/image";
import {
  ArrowRight,
  Check,
  Gem,
  Sparkles,
  Layers,
  Plug,
  Lightbulb,
  BookOpen,
  Home,
  Building2,
  Hotel,
  Crown,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import GreenButton from "@/components/ui/GreenButton";
import { getImageUrl } from "@/lib/api/api";
import { type Product } from "@/constants";
import teak_and_finish from "@/assets/products/teak_and_finish.webp";
import mahogany from "@/assets/products/mahogany.png";

const defaultSpecs = [
  { label: "Salt Type", value: "Natural Himalayan Crystal" },
  { label: "Crystal Finish", value: "Hand Polished" },
  { label: "Base Material", value: "Premium Wooden Base" },
  { label: "Electrical Rating", value: "220–240V" },
  { label: "Bulb Compatibility", value: "E14 / E27 (As Applicable)" },
  { label: "Cord Length", value: "Standard" },
];

const specIcons = [Gem, Sparkles, Layers, Plug, Lightbulb, ArrowRight];

const defaultIncluded = [
  { icon: Gem, label: "Himalayan Salt Lamp" },
  { icon: Layers, label: "Premium Wooden Base" },
  { icon: Plug, label: "Power Cord" },
  { icon: Lightbulb, label: "LED / Bulb Holder" },
  { icon: BookOpen, label: "User Guide" },
];

const defaultWoodFinishes = [
  { id: "teak", label: "Natural Teak", image: teak_and_finish },
  { id: "mahogany", label: "Mahogany", image: mahogany },
];

const defaultSizeOptions = [
  { icon: Home, title: "SMALL", subtitle: "Home Use" },
  { icon: Building2, title: "MEDIUM", subtitle: "Therapy Rooms" },
  { icon: Hotel, title: "LARGE", subtitle: "Spa Reception" },
  { icon: Crown, title: "XL", subtitle: "Hotel Lobby" },
];

const SaltLampIllustration = () => (
  <svg viewBox="0 0 400 470" className="relative z-10 w-full max-w-[300px]" role="img" aria-label="Authentic Himalayan salt lamp">
    <defs>
      <linearGradient id="saltCrystal" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F2C078" />
        <stop offset="45%" stopColor="#E29A4E" />
        <stop offset="100%" stopColor="#C0692F" />
      </linearGradient>
      <linearGradient id="saltCrystalLight" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FBD99A" />
        <stop offset="100%" stopColor="#E9A85B" />
      </linearGradient>
      <linearGradient id="woodBase" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7A5230" />
        <stop offset="100%" stopColor="#4E3118" />
      </linearGradient>
      <radialGradient id="bulbGlow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#FFE9B8" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#FFE9B8" stopOpacity="0" />
      </radialGradient>
      <filter id="crystalShadow" x="-30%" y="-30%" width="160%" height="170%">
        <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#7a4a1e" floodOpacity="0.35" />
      </filter>
    </defs>

    <circle cx="200" cy="235" r="150" fill="url(#bulbGlow)" opacity="0.7" />

    <path
      d="M156 196c-24 6-40 30-38 62 2 26 14 44 34 54 14 7 22 16 28 30 8 20 14 30 24 34 14 6 32 2 44-10 14-14 20-34 16-54-4-20-16-34-30-40 12-10 18-30 12-48-8-24-32-38-52-36-12 1-26 4-38 8Z"
      fill="url(#saltCrystal)"
      stroke="#C57E3C"
      strokeWidth="1.5"
      filter="url(#crystalShadow)"
    />
    <path
      d="M160 210c18-12 42-16 60-8 8 4 6 10 0 12-22 6-44 2-60-4Z"
      fill="url(#saltCrystalLight)"
      opacity="0.8"
    />
    <ellipse cx="210" cy="252" rx="26" ry="20" fill="#FBE0A8" opacity="0.55" />

    <rect x="120" y="392" width="160" height="26" rx="13" fill="url(#woodBase)" />
    <rect x="130" y="418" width="140" height="14" rx="7" fill="#3F2A14" />
    <path d="M128 404h144M124 410h148" stroke="#5C3C1F" strokeWidth="2" strokeLinecap="round" />

    <path
      d="M200 392c-2-14 2-24 8-34"
      fill="none"
      stroke="#4E3118"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <rect x="200" y="418" width="46" height="12" rx="6" fill="#3F2A14" />
    <rect x="244" y="414" width="8" height="20" rx="4" fill="#C9A45C" />
  </svg>
);

const LotusEmblem = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 60 60" className={className} aria-hidden="true">
    <g stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M30 14c-3 4-3 9 0 13 3-4 3-9 0-13Z" />
      <path d="M17 18c5 2 8 6 9 11-5 0-9-3-11-7 1-2 1-3 2-4Z" />
      <path d="M43 18c-5 2-8 6-9 11 5 0 9-3 11-7-1-2-1-3-2-4Z" />
      <path d="M12 26c6 1 10 4 13 8-5 1-10 0-14-3 0-2 1-3 1-5Z" />
      <path d="M48 26c-6 1-10 4-13 8 5 1 10 0 14-3 0-2-1-3-1-5Z" />
      <path d="M18 38c4 3 8 4 12 4 4 0 8-1 12-4-3 4-7 6-12 6s-9-2-12-6Z" />
    </g>
  </svg>
);

type PremiumProductInfoProps = {
  product: Product;
  finish?: string;
  size?: string;
  onFinishChange?: (finish: string) => void;
  onSizeChange?: (size: string) => void;
};

export default function PremiumProductInfo({
  product,
  finish,
  size,
  onFinishChange,
  onSizeChange,
}: PremiumProductInfoProps) {
  const overview = product.overview;
  const productOverview = overview?.productSpecifications;

  const diagramImage = productOverview?.[0]?.image || "";

  const specs = productOverview?.[0]?.specifications?.length
    ? productOverview[0].specifications.map((row) => ({ label: row.title, value: row.description }))
    : defaultSpecs;

  const woodFinishes = overview?.smartDesignAppearance?.woodFinish?.length
    ? overview.smartDesignAppearance.woodFinish.map((f) => ({
        id: f.title,
        label: f.title,
        image: typeof f.image === "string" ? getImageUrl(f.image) : f.image,
      }))
    : defaultWoodFinishes;

  const sizeOptionIcons = [Home, Building2, Hotel, Crown];

  const sizeOptions = overview?.smartDesignAppearance?.sizeOptions?.length
    ? overview.smartDesignAppearance.sizeOptions.map((s, i) => ({
        icon: sizeOptionIcons[i % sizeOptionIcons.length],
        title: s.title,
        subtitle: s.description,
      }))
    : defaultSizeOptions;

  return (
    <section className="overflow-hidden pb-8">
      {/* ── EYEBROW ── */}
      <div className="mb-4 flex items-center gap-4">
        <p className="text-base font-semibold uppercase tracking-[0.18em] text-[#8d6a3a]">
          {productOverview?.[0]?.highlight || "The Signature Piece"}
        </p>
        <div className="h-px flex-1 bg-gradient-to-r from-[#C9A45C] to-transparent" />
        <LotusEmblem className="h-7 w-7 text-[#C9A45C]" />
      </div>

      {/* ── SECTION 1: Product highlight + technical diagram ── */}
      <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-4">
        {/* Left: diagram / lamp visual + what's included */}
        <div className="flex flex-col gap-4">
                 <span className="left-4 top-4 rounded-full border border-[#C9A45C]/50 bg-[#f6f1e8]/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#5a401c] backdrop-blur">
              {productOverview?.[0]?.title || "Himalayan Salt Lamp"}
            </span>
          <div className="relative overflow-hidden rounded-2xl border border-[#C9A45C]/40 bg-[#f6efe0] p-4 md:p-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(233,168,91,0.35),transparent_60%)]" />
            <div className="relative mx-auto flex aspect-[4/5] max-h-[250px] w-full items-center justify-center overflow-hidden">
            
              {diagramImage ? (
                <Image
                  src={diagramImage}
                  alt="Product dimension diagram"
                  width={640}
                  height={800}
                  className="h-full w-full object-contain"
                />
              ) : (
                <SaltLampIllustration />
              )}
            </div>
     
          </div>

          {/* What's Included */}
          <div className="rounded-2xl border border-[#C9A45C]/35 bg-[#fbf8f2] p-4 md:p-5">
            <h3 className=" text-xl font-medium text-[#0F2E22]">What's Included</h3>
            <div className="mt-1.5 h-px w-14 bg-[#C9A45C]" />
            <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-5">
              {defaultIncluded.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C9A45C]/60 bg-[#f3ecdd] text-[#8d6a3a]">
                      <Icon className="h-5 w-5" strokeWidth={1.4} />
                    </div>
                    <span className="text-xs font-medium leading-tight text-[#0F2E22]">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: heading + technical specs */}
        <div className="flex flex-col">
          <h2 className=" text-lg font-medium leading-tight text-[#0F2E22] md:text-2xl">
            Crafted from Authentic
            <br />
            <span className="text-[#8d6a3a] italic">Himalayan Salt</span>
          </h2>
          <p className="mt-2.5 text-base font-semibold uppercase tracking-[0.16em] text-[#0F2E22]/70">
            for Premium Wellness Spaces
          </p>

          <div className="mt-4 overflow-hidden rounded-2xl border border-[#C9A45C]/45 bg-[#fbf8f2]">
            <div className="flex items-center justify-between border-b border-[#C9A45C]/30 bg-[#0F2E22] px-5 py-2.5">
              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-[#E8C776]">
                Technical Diagram Highlight
              </h3>
              <Sparkles className="h-4 w-4 text-[#E8C776]" />
            </div>
            <table className="w-full text-sm">
              <tbody>
                {specs.map((spec, i) => {
                  const Icon = specIcons[i % specIcons.length];
                  return (
                    <tr
                      key={spec.label + i}
                      className={`border-b border-[#e6dcc8] last:border-b-0 ${i % 2 === 0 ? "bg-[#fbf8f2]" : "bg-[#f5efe4]"}`}
                    >
                      <td className="w-[46%] px-5 py-2.5 align-top">
                        <span className="flex items-center gap-2.5 font-semibold text-[#0F2E22]">
                          <Icon className="h-4 w-4 shrink-0 text-[#B8913E]" strokeWidth={1.6} />
                          {spec.label}
                        </span>
                      </td>
                      <td
                        className="px-5 py-2.5 align-top text-[#5a5f57]"
                        dangerouslySetInnerHTML={{ __html: spec.value }}
                      />
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── SECTION 3: Variations ── */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:gap-4">
        {/* Wood Finish */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h3 className=" text-xl font-medium text-[#0F2E22]">Wood Finish</h3>
            <div className="h-px flex-1 bg-[#C9A45C]/40" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {woodFinishes.map((f) => (
              <button
                key={f.id}
                onClick={() => onFinishChange?.(f.id)}
                className={`group relative overflow-hidden rounded-2xl border transition-all ${
                  finish === f.id
                    ? "border-[#8d6a3a] ring-2 ring-[#C9A45C]/60"
                    : "border-[#C9A45C]/45 hover:border-[#8d6a3a]/60"
                }`}
              >
                <div className="relative h-24 overflow-hidden md:h-28">
                  <Image
                    src={f.image}
                    alt={`${f.label} wood finish`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center justify-between px-4 py-1.5">
                  <span className="text-sm font-semibold text-[#0F2E22]">{f.label}</span>
                  {finish === f.id ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#8d6a3a] text-white">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                  ) : (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#C9A45C]/60 text-[#8d6a3a]">
                      <ArrowRight className="h-3 w-3" strokeWidth={2} />
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Size Options */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h3 className=" text-xl font-medium text-[#0F2E22]">Size Options</h3>
            <div className="h-px flex-1 bg-[#C9A45C]/40" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {sizeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = size === option.title;
              return (
                <button
                  key={option.title}
                  onClick={() => onSizeChange?.(option.title)}
                  className={`relative rounded-xl border p-3 text-center transition-all ${
                    isSelected
                      ? "border-[#8d6a3a] bg-[#f5efe4] ring-1 ring-[#C9A45C]/60"
                      : "border-[#C9A45C]/45 bg-[#fbf8f2] hover:border-[#8d6a3a]/60"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#8d6a3a] text-white">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                  )}
                  <div
                    className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${
                      isSelected
                        ? "border-[#8d6a3a] bg-[#0F2E22] text-[#E8C776]"
                        : "border-[#C9A45C]/60 text-[#8d6a3a]"
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.4} />
                  </div>
                  <p className="mt-2.5 text-sm font-bold uppercase tracking-[0.12em] text-[#0F2E22]">
                    {option.title}
                  </p>
                  <p className="mt-0.5 text-xs text-[#6b6b5e]">
                    {option.subtitle.includes("<") ? (
                      <span dangerouslySetInnerHTML={{ __html: option.subtitle }} />
                    ) : (
                      option.subtitle
                    )}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── SECTION 3: customization + projects ── */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Need Customization */}
        <div className="relative overflow-hidden rounded-2xl border border-[#C9A45C]/40 bg-[#0F2E22] p-4 text-white md:p-5">
          <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle,rgba(200,164,92,0.5)_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full border border-[#C9A45C]/25" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E8C776]">
                Bespoke & Custom
              </p>
              <h3 className="mt-1.5  text-xl font-medium leading-tight md:text-2xl">
                Need Customization?
              </h3>
              <p className="mt-1.5 max-w-md text-sm leading-relaxed text-white/80">
                We create custom Panchkarma tables as per your therapy requirements.
              </p>
            </div>
            <div className="shrink-0">
              <GreenButton
                variant="green"
                fontSize="text-sm"
                text="Contact Our Experts"
                path="/contact"
                rightIcon={<ArrowRight />}
              />
            </div>
          </div>
        </div>

        {/* Bulk Order / Project */}
        <div className="relative overflow-hidden rounded-2xl border border-[#C9A45C]/40 bg-[#062017] p-4 text-white md:p-5">
          <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle,rgba(200,164,92,0.45)_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full border border-[#C9A45C]/25" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E8C776]">
                For Projects & Partners
              </p>
              <h3 className="mt-1.5  text-xl font-medium leading-tight md:text-2xl">
                Bulk Order / Project?
              </h3>
              <p className="mt-1.5 max-w-md text-sm leading-relaxed text-white/80">
                We offer special pricing for bulk orders and turnkey wellness projects.
              </p>
            </div>
            <div className="shrink-0">
              <GreenButton
                fontSize="text-sm"
                text="Get Bulk Quote"
                path="/contact"
                rightIcon={<ArrowRight className="text-[#050A1A]" />}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}