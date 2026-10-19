import Image, { type StaticImageData } from "next/image";
import { BarChart3, Briefcase, HeartHandshake, Leaf, Lightbulb, Users, type LucideIcon } from "lucide-react";
import iconLeaf from "@/assets/career/first-step/icon-leaf.webp";
import iconTeam from "@/assets/career/first-step/icon-team.webp";
import iconGrowth from "@/assets/career/first-step/icon-growth.webp";
import iconHeart from "@/assets/career/first-step/icon-heart.webp";
import type { CareerIconName } from "@/lib/careers";

/** Shared visual pieces of the career redesign (Ensis green / gold on cream) */

/** Playfair (loaded as --font-cormorant); set inline because the global h1–h6 rules force the sans font */
export const serif: React.CSSProperties = { fontFamily: "var(--font-cormorant), Georgia, 'Times New Roman', serif" };

export const careerColors = {
  green: "#163a2b",
  greenDark: "#0f2a1f",
  gold: "#9a7334",
  goldLine: "#c9a86a",
  cream: "#fbf6ec",
  card: "#fffdf8",
  border: "#eadfcd",
  text: "#3f3a33",
};

const ICONS: Record<CareerIconName, LucideIcon> = {
  leaf: Leaf,
  users: Users,
  growth: BarChart3,
  heart: HeartHandshake,
  bulb: Lightbulb,
  briefcase: Briefcase,
};

// Golden emblem artwork from the design; other names fall back to a gold-outlined line icon
const ICON_IMAGES: Partial<Record<CareerIconName, StaticImageData>> = {
  leaf: iconLeaf,
  bulb: iconLeaf,
  users: iconTeam,
  growth: iconGrowth,
  heart: iconHeart,
};

export function CareerIcon({ name, size = "md" }: { name: CareerIconName; size?: "sm" | "md" | "lg" }) {
  const box = size === "lg" ? "size-16" : size === "sm" ? "size-10" : "size-14";
  const art = ICON_IMAGES[name];
  if (art) {
    return <Image src={art} alt="" aria-hidden className={`${box} shrink-0 object-contain drop-shadow-[0_3px_6px_rgba(154,115,52,0.18)]`} />;
  }
  const Icon = ICONS[name] || Leaf;
  const icon = size === "lg" ? 26 : size === "sm" ? 18 : 22;
  return (
    <span className={`grid ${box} shrink-0 place-items-center rounded-full border-2 border-[#e0a92b] bg-[#fffaf0] text-[#d4961c]`}>
      <Icon size={icon} strokeWidth={1.8} />
    </span>
  );
}

/** "CAREERS AT ENSIS ——" */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#9a7334]">
      {children}
      <span className="h-px w-10 bg-[#c9a86a]" aria-hidden />
    </p>
  );
}

/** Serif heading where `highlight` is rendered in gold, as in the mockups */
export function SerifHeading({
  text,
  highlight,
  as: Tag = "h2",
  className = "",
}: {
  text: string;
  highlight?: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <Tag style={serif} className={`font-semibold leading-[1.1] tracking-[-0.01em] text-[#163a2b] ${className}`}>
      {text}
      {highlight && (
        <>
          {" "}
          <span className="text-[#a8792c]">{highlight}</span>
        </>
      )}
    </Tag>
  );
}


export const goldOutlineButton =
  "inline-flex items-center justify-center gap-2 rounded-md border border-[#d9bf86] bg-[#fffaf0] px-4 py-2 text-[15px] font-semibold text-[#8d6a3a] transition-colors hover:bg-[#f6ecd7]";

export const greenButton =
  "inline-flex items-center justify-center gap-2 rounded-md bg-[#163a2b] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_6px_16px_rgba(22,58,43,0.22)] transition-colors hover:bg-[#0f2a1f]";

export const goldButton =
  "inline-flex items-center justify-center gap-2 rounded-md bg-[linear-gradient(180deg,#f4d58a_0%,#e5b95a_100%)] px-7 py-3 text-[15px] font-semibold text-[#2c2414] shadow-[0_6px_16px_rgba(197,150,60,0.28)] transition hover:brightness-105";
