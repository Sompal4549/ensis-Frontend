import { Container } from "../ui/Container";
import Image from "next/image";
import banner_image from "@/assets/trunkey_solutions/newbanner.webp"
import single_point from "@/assets/trunkey_solutions/single_point_banner.webp"
import on_time from "@/assets/trunkey_solutions/on_time.webp"
import premium from "@/assets/trunkey_solutions/premium.webp"
import transparent from "@/assets/trunkey_solutions/transparent_banner.webp"
import after_sales from "@/assets/trunkey_solutions/after_sales_banner.webp"
import lotus from "@/assets/about/lotus.png";
import BookButton from "../ui/BookButton";
import GreenButton from "../ui/GreenButton";

const FEATURES = [
  { icon: single_point, label: "Single Point\nResponsibility" },
  { icon: on_time, label: "On-Time\nDelivery" },
  { icon: premium, label: "Premium\nQuality" },
  { icon: transparent, label: "Transparent\nProcess" },
  { icon: after_sales, label: "After Sales\nSupport" },
];

export default function TurnkeyHero() {
  return (
    <div className="min-h-[80vh] relative">
        <Image src={banner_image} alt="banner_image" fill className="object-cover z-0! absolute object-right" preload  />
      {/* ── HERO ── */}
      <Container className="relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-center min-h-[80vh]">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-4 h-full justify-center">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="text-[#d6a85f] text-xs sm:text-sm tracking-[0.25em] font-semibold uppercase">
                Turnkey Solutions
              </span>
              <div className="h-px w-8 bg-[#d6a85f]" />
              <Image alt="lotus" src={lotus} width={30} height={30} className="h-full object-contain" />
              <div className="h-px w-8 bg-[#d6a85f]" />
            </div>

            {/* Headline */}
            <div>
              <h1 className="text-[#1a2e1a] text-3xl lg:text-4xl  font-semibold leading-tight">
                We Design, Build &amp; Launch
              </h1>
              <h1 className="text-[#b8922a] text-3xl sm:text-4xl lg:text-[42px] font-semibold leading-tight mt-1">
                Complete Wellness Spaces
              </h1>
            </div>

            {/* Ornament divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 max-w-[120px] bg-[#d6a85f] opacity-50" />
             <Image alt="lotus" src={lotus} width={30} height={30} className="h-full object-contain" />
              <div className="h-px flex-1 max-w-[120px] bg-[#d6a85f] opacity-50" />
            </div>

            {/* Body copy */}
            <p className="text-sm  max-w-md leading-6 mb-4">
              From concept to commissioning, we deliver end-to-end{" "}
              <strong className="text-[#1a2e1a]">Panchakarma Centres</strong>,{" "}
              <strong className="text-[#1a2e1a]">Ayurveda Clinics</strong>,{" "}
              <strong className="text-[#1a2e1a]">Wellness Resorts</strong> &amp;{" "}
              <strong className="text-[#1a2e1a]">Health Retreats</strong> that
              are beautiful, functional and future-ready.
            </p>

            {/* Feature icons */}
            <div className="flex flex-wrap gap-4 sm:gap-6">
          {FEATURES.map((f, index) => (
  <div
    key={f.label}
    className={`flex flex-col items-center gap-2 text-center min-w-[64px] pr-6 ${
      index !== FEATURES.length - 1 ? "border-r border-[#7c5c18]" : ""
    }`}
  >
    <div className="w-12 h-12 text-[#d6a85f] flex items-center justify-center text-xl">
      <Image src={f.icon} alt={f.label} width={40} height={40} className="object-fill" />
    </div>
    <p className="text-[10px] sm:text-xs leading-snug whitespace-pre-line font-medium">
      {f.label}
    </p>
  </div>
))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-3">
              <BookButton text="REQUEST PROJECT PROPOSAL" />
               <GreenButton text="SCHEDULE SITE VISIT" />
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}