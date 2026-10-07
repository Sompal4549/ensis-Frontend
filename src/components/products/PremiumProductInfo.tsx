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
  Package,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import GreenButton from "@/components/ui/GreenButton";
import { getImageUrl } from "@/lib/api/api";
import { type Product } from "@/constants";
const specIcons = [Gem, Sparkles, Layers, Plug, Lightbulb, ArrowRight];

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
  const smartDesignAppearance = overview?.smartDesignAppearance;

  // Find a specification block that was actually filled in from admin
  const validSpecBlock = productOverview?.find(
    (ps) =>
      Boolean(ps?.image?.trim()) ||
      Boolean(ps?.title?.trim()) ||
      Boolean(ps?.highlight?.trim()) ||
      Boolean(ps?.specifications?.some((s) => s.title?.trim() || s.description?.trim()))
  );

  const diagramImage = validSpecBlock?.image?.trim() || "";
  const diagramTitle = validSpecBlock?.title?.trim() || "";

  const validSpecs = (validSpecBlock?.specifications || [])
    .filter((row) => (row.title && row.title.trim()) || (row.description && row.description.trim()))
    .map((row) => ({ label: row.title?.trim() || "", value: row.description?.trim() || "" }));

  const validIncluded = (overview?.whatisInclueded || [])
    .filter((item: string) => typeof item === "string" && item.trim().length > 0)
    .map((label: string) => label.trim());

  // Filter out dummy template texts seeded in database
  const rawAppearanceTitle = smartDesignAppearance?.title?.trim() || "";
  const isDummyTitle =
    rawAppearanceTitle.toLowerCase().includes("warm natural illumination") ||
    rawAppearanceTitle.toLowerCase().includes("naturally elegant") ||
    rawAppearanceTitle.toLowerCase().includes("himalayan salt");
  const appearanceTitle = isDummyTitle ? "" : rawAppearanceTitle;

  const rawAppearanceHighlight = smartDesignAppearance?.highlight?.trim() || "";
  const isDummyHighlight =
    rawAppearanceHighlight.toLowerCase().includes("naturally elegant") ||
    rawAppearanceHighlight.toLowerCase().includes("premium wellness spaces");
  const appearanceHighlight = isDummyHighlight ? "" : rawAppearanceHighlight;

  const eyebrowText = validSpecBlock?.highlight?.trim() || "";

  const hasDiagram = Boolean(diagramImage);
  const hasWhatsIncluded = validIncluded.length > 0;
  const hasSpecs = validSpecs.length > 0;
  const hasAppearanceHeading = Boolean(appearanceTitle || appearanceHighlight);

  const hasLeftCol = hasDiagram || hasWhatsIncluded;
  const hasRightCol = hasSpecs || hasAppearanceHeading || hasLeftCol;
  const hasSection1 = hasLeftCol || hasSpecs || hasAppearanceHeading;

  const woodFinishes = overview?.smartDesignAppearance?.woodFinish?.length
    ? overview.smartDesignAppearance.woodFinish
        .filter((f) => f && f.title && f.title.trim() !== "")
        .map((f) => ({
          id: f.title,
          label: f.title,
          image: typeof f.image === "string" ? getImageUrl(f.image) : f.image,
        }))
    : [];

  const sizeOptionIcons = [Home, Building2, Hotel, Crown];

  const sizeOptions = overview?.smartDesignAppearance?.sizeOptions?.length
    ? overview.smartDesignAppearance.sizeOptions
        .filter((s) => s && s.title && s.title.trim() !== "")
        .map((s, i) => ({
          icon: sizeOptionIcons[i % sizeOptionIcons.length],
          title: s.title,
          subtitle: s.description || "",
        }))
    : [];

  return (
    <section className="overflow-hidden pb-8">
      {/* ── EYEBROW (Only show if added from admin) ── */}
      {eyebrowText && (
        <div className="mb-4 flex items-center gap-4">
          <p className="text-base font-semibold uppercase tracking-[0.18em] text-[#8d6a3a]">
            {eyebrowText}
          </p>
          <div className="h-px flex-1 bg-gradient-to-r from-[#C9A45C] to-transparent" />
          <LotusEmblem className="h-7 w-7 text-[#C9A45C]" />
        </div>
      )}

      {/* ── SECTION 1: Product highlight + technical diagram (Only show if added from admin) ── */}
      {hasSection1 && (
        <div
          className={`grid items-start gap-6 ${
            hasLeftCol && hasRightCol ? "lg:grid-cols-2 lg:gap-6" : "grid-cols-1"
          }`}
        >
          {/* Left: diagram visual + what's included */}
          {hasLeftCol && (
            <div className="flex flex-col gap-4">
              {/* Technical Diagram Image Card */}
              {hasDiagram && (
                <div className="flex flex-col gap-3">
                  {diagramTitle && (
                    <span
                      className="self-start rounded-full border border-[#C9A45C]/50 bg-[#f6f1e8]/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#5a401c] backdrop-blur"
                      dangerouslySetInnerHTML={{ __html: diagramTitle }}
                    />
                  )}
                  <div className="relative overflow-hidden rounded-2xl border border-[#C9A45C]/40 bg-[#f6efe0] p-4 md:p-6">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(233,168,91,0.35),transparent_60%)]" />
                    <div className="relative mx-auto flex aspect-[4/5] max-h-[250px] w-full items-center justify-center overflow-hidden">
                      <Image
                        src={getImageUrl(diagramImage)}
                        alt={diagramTitle || "Product dimension diagram"}
                        width={640}
                        height={800}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* What's Included */}
              {hasWhatsIncluded && (
                <div className="rounded-2xl border border-[#C9A45C]/35 bg-[#fbf8f2] p-4 md:p-5">
                  <h3 className="text-xl font-medium text-[#0F2E22]">What's Included</h3>
                  <div className="mt-1.5 h-px w-14 bg-[#C9A45C]" />
                  <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {validIncluded.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-[#0F2E22]">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#C9A45C]/60 bg-[#f3ecdd] text-[#8d6a3a] mt-0.5">
                          <Check size={12} strokeWidth={2.5} />
                        </span>
                        <span className="font-medium leading-snug" dangerouslySetInnerHTML={{ __html: item }} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Right: heading + technical specs */}
          {hasRightCol && (
            <div className="flex flex-col">
              <h2
                className="text-lg font-medium leading-tight text-[#0F2E22] md:text-2xl"
                dangerouslySetInnerHTML={{ __html: product.title }}
              />
              {appearanceTitle && (
                <p
                  className="mt-1.5 text-sm text-[#8d6a3a] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: appearanceTitle }}
                />
              )}
              {appearanceHighlight && (
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#0F2E22]/70">
                  {appearanceHighlight}
                </p>
              )}

              {/* Technical Diagram Highlight / Specs */}
              {hasSpecs && (
                <div
                  className={`${
                    appearanceTitle || appearanceHighlight ? "mt-4" : ""
                  } overflow-hidden rounded-2xl border border-[#C9A45C]/45 bg-[#fbf8f2]`}
                >
                  <div className="flex items-center justify-between border-b border-[#C9A45C]/30 bg-[#0F2E22] px-5 py-2.5">
                    <h3
                      className="text-sm font-bold uppercase tracking-[0.16em] text-[#E8C776]"
                      dangerouslySetInnerHTML={{ __html: diagramTitle || "Technical Diagram Highlight" }}
                    />
                    <Sparkles className="h-4 w-4 text-[#E8C776]" />
                  </div>
                  <table className="w-full text-sm">
                    <tbody>
                      {validSpecs.map((spec, i) => {
                        const Icon = specIcons[i % specIcons.length];
                        return (
                          <tr
                            key={spec.label + i}
                            className={`border-b border-[#e6dcc8] last:border-b-0 ${
                              i % 2 === 0 ? "bg-[#fbf8f2]" : "bg-[#f5efe4]"
                            }`}
                          >
                            <td className="w-[46%] px-5 py-2.5 align-top">
                              <span className="flex items-center gap-2.5 font-semibold text-[#0F2E22]">
                                <Icon
                                  className="h-4 w-4 shrink-0 text-[#B8913E]"
                                  strokeWidth={1.6}
                                />
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
              )}
            </div>
          )}
        </div>
      )}

      {/* ── SECTION 3: Variations (Only show if added from admin) ── */}
      {(woodFinishes.length > 0 || sizeOptions.length > 0) && (
        <div className={`mt-6 grid gap-6 ${woodFinishes.length > 0 && sizeOptions.length > 0 ? "lg:grid-cols-2 lg:gap-4" : "grid-cols-1"}`}>
          {/* Wood Finish */}
          {woodFinishes.length > 0 && (
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
                      {f.image ? (
                        <Image
                          src={f.image}
                          alt={`${f.label} wood finish`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#f3ecdd] flex items-center justify-center text-[#8d6a3a] text-xs font-semibold">
                          {f.label}
                        </div>
                      )}
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
          )}

          {/* Size Options */}
          {sizeOptions.length > 0 && (
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
          )}
        </div>
      )}

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
                We create bespoke wellness & therapy equipment as per your project requirements.
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