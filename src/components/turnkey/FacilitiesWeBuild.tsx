import Image from "next/image";

// Replace these with your actual icon imports
import panchkarmaIcon from "@/assets/trunkey_solutions/panchkarma_centeres.webp";
import ayurvedaIcon from "@/assets/trunkey_solutions/ayurved_clinics.webp";
import wellnessResortIcon from "@/assets/trunkey_solutions/wellness_resorts.webp";
import healthRetreatIcon from "@/assets/trunkey_solutions/health_retreats.webp";
import naturopathyIcon from "@/assets/trunkey_solutions/nutropathy.webp";
import integrativeIcon from "@/assets/trunkey_solutions/integrative.webp";
import spaIcon from "@/assets/trunkey_solutions/spa_and_wellnes.webp";
import yogaIcon from "@/assets/trunkey_solutions/yoga_retreat_centers.webp";
import ayurvedaHospitalIcon from "@/assets/trunkey_solutions/ayurveda_hospitals.webp";
import wellnessFranchiseIcon from "@/assets/trunkey_solutions/wellness_franchise.png";
import { Container } from "../ui/Container";
import decorationLeft from "@/assets/icons/decoration_left.png"
import decorationRight from "@/assets/icons/decoration_right.png"

const FACILITIES = [
  { icon: panchkarmaIcon,        label: "Panchkarma\nCentres" },
  { icon: ayurvedaIcon,          label: "Ayurveda\nClinics" },
  { icon: wellnessResortIcon,    label: "Wellness\nResorts" },
  { icon: healthRetreatIcon,     label: "Health\nRetreats" },
  { icon: naturopathyIcon,       label: "Naturopathy\nCentres" },
  { icon: integrativeIcon,       label: "Integrative\nMedicine Centres" },
  { icon: spaIcon,               label: "Spa & Wellness\nFacilities" },
  { icon: yogaIcon,              label: "Yoga Retreat\nCentres" },
  { icon: ayurvedaHospitalIcon,  label: "Ayurveda\nHospitals" },
  { icon: wellnessFranchiseIcon, label: "Wellness\nFranchise Chains" },
];

export interface FacilitiesWeBuildContent {
  title: string;
  cards: Array<{
    id?: string; // Added id for unique key prop
    title: string; // Used for f.title
    image: { imageUrl: string; alt?: string }; // Added alt for Image component
  }>;
}

export default function FacilitiesWeBuild({sectionContent}: { sectionContent: FacilitiesWeBuildContent }) {
  return (
    <section className="bg-[#f5efe0] w-full">
      <Container>

        {/* ── Section Title ── */}
        <div className="flex items-center gap-4 mb-2">
          <div className="flex-1 h-px bg-[#c9972a] opacity-40" />
          <div className="text-[#c9972a] text-base"> <Image src={decorationLeft} width={30} height={30} alt="decoration" className="h-full object-contain" /></div>
             <h2 className="text-base font-semibold uppercase">
           {sectionContent.title}
          </h2>
          <div className="text-[#c9972a] text-base"> <Image src={decorationRight} width={30} height={30} alt="decoration" className="h-full object-contain" /></div>
          <div className="flex-1 h-px bg-[#c9972a] opacity-40" />
        </div>

        {/* ── Facilities Grid ── */}
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-4">
          {sectionContent.cards.map((f, index) => (
            <div
              key={f.id || f.title} // Use f.id if available, fallback to f.title
              className={`flex flex-col items-center gap-4 text-center px-2 py-4 border border-[#d6c5a0] rounded-sm bg-[#faf6ee] hover:border-[#c9972a] transition-colors duration-200 ${
                index === FACILITIES.length - 1 && FACILITIES.length % 2 !== 0
                  ? "col-span-1 sm:col-span-1"
                  : ""
              }`}
            >
              {/* Icon slot */}
              <div className="w-12 h-12 flex items-center justify-center">
                <Image
                  src={f.image.imageUrl}
                  alt={f.title}
                  width={48}
                  height={48}
                  className="object-contain w-full h-full"
                />
              </div>
              <p className="text-[10px] sm:text-[11px] leading-snug whitespace-pre-line font-medium">
                {f.title}
              </p>
            </div>
          ))}
        </div>

      </Container>
    </section>
  );
}