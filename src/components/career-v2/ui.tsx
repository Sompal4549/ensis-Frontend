import Image, { type StaticImageData } from "next/image";
import { BarChart3, Briefcase, Heart, Leaf, Lightbulb, Users, type LucideIcon } from "lucide-react";
import iconLeaf from "@/assets/career/first-step/icon-leaf.webp";
import iconTeam from "@/assets/career/first-step/icon-team.webp";
import iconGrowth from "@/assets/career/first-step/icon-growth.webp";
import iconHeart from "@/assets/career/first-step/icon-heart.webp";
import type { CareerIconName } from "@/lib/careers";

/** Shared visual pieces of the career redesign (Ensis green / gold on cream) */

import { DM_Serif_Display, Playfair_Display } from "next/font/google";

export const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

/** Site sans-serif font matching the rest of the Ensis website */
export const serif: React.CSSProperties = {
  fontFamily: "var(--font-montserrat), Arial, Helvetica, sans-serif",
};
export const serifFontClass = "";

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
  heart: Heart,
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
export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-2.5 text-[18px] font-bold uppercase tracking-[0.16em] text-[#b47422] ${className}`}>
      {children}
      <span className="h-[2px] w-8 sm:w-10 bg-[#b47422]" aria-hidden />
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
  const isH1 = Tag === "h1";
  return (
    <Tag
      style={{ ...serif, ...(isH1 ? { fontWeight: 800 } : {}) }}
      className={`${serifFontClass} ${isH1 ? "font-extrabold" : "font-bold"} leading-[1.1] tracking-[-0.01em] text-[#06372c] ${className}`}
    >
      {text}
      {highlight && (
        <>
          {" "}
          <span className="text-[#cb851e]">{highlight}</span>
        </>
      )}
    </Tag>
  );
}


export const goldOutlineButton =
  "inline-flex items-center justify-center gap-2 rounded-xl border-[1.5px] border-[#cbb38b] bg-[#fffdf9] px-5 py-2.5 text-[14px] font-semibold text-[#163a2b] shadow-[0_1px_3px_rgba(70,50,20,0.06)] transition-all duration-200 hover:bg-[#fbf5eb] hover:border-[#b89b6c] hover:-translate-y-0.5 active:translate-y-0";

export const greenButton =
  "inline-flex items-center justify-center gap-2 rounded-xl border-[1.5px] border-[#b88c42] bg-gradient-to-b from-[#1b3d2b] via-[#143423] to-[#0c2216] px-6 py-2.5 text-[14px] font-semibold text-white shadow-[0_2px_6px_rgba(10,25,18,0.28),inset_0_1px_0_rgba(255,255,255,0.18)] transition-all duration-200 hover:from-[#214a34] hover:to-[#102d1e] hover:border-[#cf9e4d] hover:-translate-y-0.5 hover:shadow-[0_4px_10px_rgba(10,25,18,0.35),inset_0_1px_0_rgba(255,255,255,0.22)] active:translate-y-0";

export const goldButton =
  "inline-flex items-center justify-center gap-2 rounded-md bg-[linear-gradient(180deg,#f4d58a_0%,#e5b95a_100%)] px-7 py-3 text-[15px] font-semibold text-[#2c2414] shadow-[0_6px_16px_rgba(197,150,60,0.28)] transition hover:brightness-105";

export const premiumGreenButton = greenButton;
export const premiumSecondaryButton = goldOutlineButton;
