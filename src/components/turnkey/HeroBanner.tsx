import { Container } from "../ui/Container";
import Image from "next/image";
import banner_image from "@/assets/trunkey_solutions/turnkey.webp"
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

export interface TurnkeyHeroContent {
  backgroundImage: { imageUrl: string; alt?: string };
  subheading: string;
  title: string;
  highlight: string;
  description: string;
  features: Array<{
    id?: string; // Added id for unique key prop
    title: string;
    label:string;
    image: { imageUrl: string; alt?: string };
  }>;
  primaryButton: { label: string; url: string }; // Changed url to path
  secondaryButton: { label: string; url: string }; // Changed url to path
}

export default function TurnkeyHero({sectionContent}: { sectionContent: TurnkeyHeroContent }) {
  return (
    <div className="min-h-[80vh] relative">
        <Image src={sectionContent.backgroundImage.imageUrl} alt={sectionContent.backgroundImage.alt||sectionContent.title} fill className="object-fill z-0! absolute object-right" priority  />
      {/* ── HERO ── */}
      <Container className="relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 items-center min-h-[80vh]">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-4 h-full justify-center">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="text-[#c38727] text-xs sm:text-sm font-semibold uppercase">
                {sectionContent.subheading}
              </span>
              <div className="h-px w-8 bg-[#c38727]" />
              <Image alt="lotus" src={lotus} width={30} height={30} className="h-full object-contain" />
              <div className="h-px w-8 bg-[#c38727]" />
            </div>

            {/* Headline */}
            <div>
              <h1 className="text-[#1a2e1a] text-3xl lg:text-4xl  font-semibold leading-tight">
               {sectionContent.title}
              </h1>
              <h1 className="text-[#c38727] text-3xl sm:text-4xl lg:text-[42px] font-semibold leading-tight mt-1">
                {sectionContent.highlight}
              </h1>
            </div>

            {/* Ornament divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 max-w-[120px] bg-[#d6a85f] opacity-50" />
             <Image alt="lotus" src={lotus} width={30} height={30} className="h-full object-contain" />
              <div className="h-px flex-1 max-w-[120px] bg-[#d6a85f] opacity-50" />
            </div>

            {/* Body copy */}
            <p className="text-sm  max-w-md leading-6 mb-4" dangerouslySetInnerHTML={{__html:sectionContent.description}}>
          
            </p>

            {/* Feature icons */}
            <div className="flex flex-wrap gap-4 sm:gap-6">
          {sectionContent.features.map((f, index) => (
  <div
    key={f.id || index}
    className={`flex flex-col items-center gap-2 text-center min-w-[64px] pr-3 ${
      index !== sectionContent.features.length - 1 ? "border-r border-[#7c5c18]" : ""
    }`}
  >
    <div className="w-12 h-12 text-[#d6a85f] flex items-center justify-center text-xl">
      <Image src={f.image.imageUrl} alt={f.image.alt||f.title} width={40} height={40} className="object-fill" />
    </div>
    <p className="text-[10px] sm:text-xs leading-snug whitespace-pre-line font-medium max-w-[90px]">
      {f.title}
    </p>
  </div>
))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-3">
              <BookButton text={sectionContent.primaryButton.label} path={sectionContent.primaryButton.url}/>
               <GreenButton text={sectionContent.secondaryButton.label} path={sectionContent.secondaryButton.url} />
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}