import Image from "next/image";
import withEnsis from "@/assets/trunkey_solutions/with_ensis.webp"
// Replace these imports with your actual icon paths
import architectIcon from "@/assets/trunkey_solutions/architect.webp";
import interiorIcon from "@/assets/trunkey_solutions/interior.webp";
import furnitureIcon from "@/assets/trunkey_solutions/furniture_vendor.webp";
import equipmentIcon from "@/assets/trunkey_solutions/equipment_supplier.webp";
import civilIcon from "@/assets/trunkey_solutions/civil.webp";
import mepIcon from "@/assets/trunkey_solutions/mep.webp";
import brandingIcon from "@/assets/trunkey_solutions/branding_agency.webp";
import trainingIcon from "@/assets/trunkey_solutions/training_consultant.webp";
import ensisPlaque from "@/assets/trunkey_solutions/everything_under.webp";
import { Container } from "../ui/Container";

const VENDORS = [
  { icon: architectIcon,  label: "Architect" },
  { icon: interiorIcon,   label: "Interior\nDesigner" },
  { icon: furnitureIcon,  label: "Furniture\nVendor" },
  { icon: equipmentIcon,  label: "Equipment\nSupplier" },
  { icon: civilIcon,      label: "Civil\nContractor" },
  { icon: mepIcon,        label: "MEP\nContractor" },
  { icon: brandingIcon,   label: "Branding\nAgency" },
  { icon: trainingIcon,   label: "Training\nConsultant" },
];

const BENEFITS = [
  "One Team",
  "One Timeline",
  "One Budget",
  "One Responsibility",
];

export default function TurnkeyMeaning() {
  return (
    <section className="bg-[#f5efe0] w-full py-4 border-t border-[#d78c2f] border-b">
      <Container className="">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr] gap-8 lg:gap-0 items-stretch">

          {/* ── COLUMN 1: What does Turnkey mean ── */}
          <div className="flex flex-col justify-center gap-4 lg:pr-10">
            <p className="text-[#d6a85f] text-xs sm:text-xs tracking-[0.25em] font-bold uppercase">
              What does "Turnkey" mean?
            </p>
            <h2 className="text-2xl font-semibold leading-tight">
              One Partner.<br />Complete Responsibility.
            </h2>
            <p className="text-sm">
              Most wellness projects require coordination with multiple vendors.
              With Ensis, you get everything under one roof.
            </p>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px bg-[#d6c5a0] mx-8 self-stretch" />

          {/* ── COLUMN 2: Most Projects Need Multiple Vendors ── */}
          <div className="flex flex-col gap-5 lg:px-4">
            <p className="text-sm font-semibold text-center lg:text-left">
              Most Projects Need Multiple Vendors
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6 gap-x-2 gap-y-5">
              {VENDORS.map((v) => (
                <div
                  key={v.label}
                  className="flex flex-col items-center gap-1.5 text-center"
                >
                  {/* Icon slot — replace div with your Image when ready */}
                  <div className="w-10 h-10 flex items-center justify-center">
                    <Image
                      src={v.icon}
                      alt={v.label}
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                  <p className="text-[9px] sm:text-[10px] leading-snug whitespace-pre-line font-medium text-[#333]">
                    {v.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px bg-[#d6c5a0] mx-8 self-stretch" />

          {/* ── COLUMN 3: With ENSIS You Get + Plaque ── */}
          <div className="flex flex-row items-center justify-between gap-6 lg:pl-4">
            <div className="flex flex-col gap-3">
              <p className="text-sm sm:text-base font-semibold">
                With ENSIS You Get
              </p>
              <ul className="flex flex-col gap-2">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm">
                    <Image alt="dot" src={withEnsis} height={20} width={20} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* ENSIS Plaque image */}
            <div className="shrink-0 w-28 sm:w-32 lg:w-36">
              <Image
                src={ensisPlaque}
                alt="ENSIS — Everything Under One Roof"
                width={144}
                height={160}
                className="object-contain w-full h-auto"
              />
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}