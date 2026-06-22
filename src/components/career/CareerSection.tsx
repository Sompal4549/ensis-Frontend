// app/careers/page.tsx
import Image from "next/image";
import { ArrowRight, ChevronDown, Upload } from "lucide-react";
import { Container } from "../ui/Container";
import life1 from "@/assets/career/life1.webp"
import life2 from "@/assets/career/life2.webp"
import life3 from "@/assets/career/life3.webp"
import life4 from "@/assets/career/life4.png"
import life5 from "@/assets/career/life5.webp"
import GreenButton from "../ui/GreenButton";
export interface CareerSectionProps{
    heading: string;
    titlePart1: string;
    titlePart2: string;
    description: string;
    buttonPath: string;
    buttonLabel: string;
    RightImageGrid: { imageUrl: string; alt: string }[];
    leftSide: {
      heading: string;
      description: string;
      filter: { value: string; label: string }[];
      buttonPath: string;
      buttonLabel: string;
    };
    ourHiringJourney: {
      title: string;
      description: string;
      steps: { label: string; description: string }[];
    };
    careerForm: {
      title: string;
      description: string;
      termsText: string;
      buttonText: string;
    };
  
}
export interface CareerSectionComponentProps{
  sectionContent: CareerSectionProps;
}
const jobs = [
  {
    title: "Interior Designer",
    department: "Design",
    location: "Bangalore",
    experience: "3-5 Yrs",
  },
  {
    title: "Project Manager",
    department: "Project Management",
    location: "Mumbai",
    experience: "5-8 Yrs",
  },
  {
    title: "Mechanical Engineer",
    department: "Engineering",
    location: "Bangalore",
    experience: "3-5 Yrs",
  },
  {
    title: "Production Supervisor",
    department: "Manufacturing",
    location: "Bangalore",
    experience: "3-5 Yrs",
  },
  {
    title: "Business Development Executive",
    department: "Sales & Marketing",
    location: "Delhi",
    experience: "2-4 Yrs",
  },
];

const steps = [
  "Apply Online",
  "HR Screening",
  "Technical Round",
  "Interview",
  "Offer & Onboarding",
];

export default function CareersSection({sectionContent}:CareerSectionComponentProps) {
  return (
    <section className="bg-[#f8f5f0]">
      <Container>
        <div className="grid lg:grid-cols-[0.5fr_1fr] lg:min-h-[320px]">
          {/* Left Content */}
          <div className="relative h-full overflow-hidden bg-[#062017] p-8 lg:p-10">
            <div className="relative z-10">
              <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#c89a4b] font-semibold">
                {sectionContent.heading||"Life at ENSIS"}
              </p>

              <h2 className="font-serif text-2xl leading-tight text-white font-medium">
                {sectionContent.titlePart1||"Where Passion"}
                <br />
                {sectionContent.titlePart2||'Meets Purpose'}
              </h2>

              <p className="mt-2 text-sm leading-7 text-white/75">
                {sectionContent.description||`From design studios to production units, every corner of ENSIS is
                inspired by creativity, craftsmanship and care.`}
              </p>
              <div className="mt-2 max-w-50">
                <GreenButton text="VIEW LIFE AT ENSIS" path="/contact" />
              </div>
            </div>
          </div>

          {/* Right Image Grid */}
          <div className="grid h-full grid-cols-2 md:grid-cols-4 auto-rows-fr">
            <div className="relative col-span-2 row-span-2">
              <Image
                src={sectionContent.RightImageGrid[0].imageUrl}
                alt={sectionContent.RightImageGrid[0].alt}
                fill
                className="object-cover"
              />
            </div>

            <div className="relative">
              <Image
          src={sectionContent.RightImageGrid[1].imageUrl}
                alt={sectionContent.RightImageGrid[1].alt}
                fill
                className="object-cover"
              />
            </div>
            <div className="relative">
              <Image
               src={sectionContent.RightImageGrid[2].imageUrl}
                alt={sectionContent.RightImageGrid[2].alt}
                fill
                className="object-cover"
              />
            </div>
            <div className="relative">
              <Image
               src={sectionContent.RightImageGrid[3].imageUrl}
                alt={sectionContent.RightImageGrid[3].alt}
                fill
                className="object-cover"
              />
            </div>
            <div className="relative">
              <Image
            src={sectionContent.RightImageGrid[4].imageUrl}
                alt={sectionContent.RightImageGrid[4].alt}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            {/* LEFT SIDE */}
            <div>
              {/* Heading */}
              <h3 className="font-serif text-2xl text-[#1d1d1d] font-semibold mt-2">
                {sectionContent.leftSide.heading}
              </h3>

              <p className="mt-2 text-sm">
              {sectionContent.leftSide.description}
              </p>

              {/* Filters */}
              <div className="mt-4 flex flex-wrap gap-4">
                {["All Departments", "All Locations", "Experience"].map(
                  (item) => (
                    <button
                      key={item}
                      className="flex min-w-[150px] items-center justify-between rounded-md border border-[#ddd] bg-white px-4 py-3 text-xs"
                    >
                      {item}
                      <ChevronDown size={16} />
                    </button>
                  )
                )}

                <button className="ml-auto rounded-md border border-[#c89a4b] px-4 py-2 text-xs text-[#c89a4b]">
                  {sectionContent.leftSide.buttonLabel}
                </button>
              </div>

              {/* Job Table */}
              <div className="mt-3 border border-[#e5dfd7] bg-white">
                {jobs.map((job) => (
                  <div
                    key={job.title}
                    className="grid gap-4 border-b border-[#f0ebe5] p-2 md:grid-cols-[2fr_1.5fr_1fr_1fr_auto]"
                  >
                    <div className="font-medium text-xs">{job.title}</div>
                    <div className="text-xs">{job.department}</div>
                    <div className="text-xs">{job.location}</div>
                    <div className="text-xs">{job.experience}</div>

                    <button className="flex items-center gap-2 text-[#c89a4b] text-xs">
                      APPLY NOW
                      <ArrowRight size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Journey */}
              <div className="mt-2">
                <h3 className="text-lg font-semibold">
                  {sectionContent.ourHiringJourney.title||"Our Hiring Journey"}
                </h3>

                <p className="mt-2 text-sm text-[#666]">
                  {sectionContent.description||`Our simple and transparent process to welcome you to ENSIS.`}
                </p>

                <div className="mt-4 grid gap-6 md:grid-cols-5">
                  {sectionContent.ourHiringJourney.steps.map((step, index) => (
                    <div
                      key={step.label}
                      className="rounded-2xl border border-[#e5dfd7] bg-white p-5 text-center"
                    >
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#062017] text-white">
                        {index + 1}
                      </div>

                      <h4 className="mt-4 font-medium">{step.label}</h4>

                      <p className="mt-2 text-xs text-[#777]">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT FORM */}
            <aside className="relative z-10 lg:-mt-18 lg:sticky lg:top-10 lg:h-fit">
              <div className=" bg-[#062017] p-8 text-white shadow-2xl">
                <h3 className="font-serif text-lg uppercase">
                  {sectionContent.careerForm.title}
                </h3>

                <p className="mt-3 text-sm text-white">
                  {sectionContent.description||`Send us your details and become part of the ENSIS family.`}
                </p>

                <form className="mt-4 space-y-5">
                  <input
                    placeholder="Full Name *"
                    className="w-full border-b border-[#b98b43]/40 bg-transparent pb-1 outline-none text-xs"
                  />

                  <input
                    placeholder="Email Address *"
                    className="w-full border-b border-[#b98b43]/40 bg-transparent pb-1 outline-none text-xs"
                  />

                  <input
                    placeholder="Phone Number *"
                    className="w-full border-b border-[#b98b43]/40 bg-transparent pb-1 outline-none text-xs"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <select className="border-b border-[#b98b43]/40 bg-transparent pb-1 outline-none text-xs">
                      <option>Current Location</option>
                    </select>

                    <select className="border-b border-[#b98b43]/40 bg-transparent pb-1 outline-none text-xs">
                      <option>Experience</option>
                    </select>
                  </div>

                  <select className="w-full border-b border-[#b98b43]/40 bg-transparent pb-2 outline-none text-xs">
                    <option>Department Interested In</option>
                  </select>

                  <div className="rounded-xl border border-dashed border-[#b98b43] p-2 text-center text-xs">
                    <Upload className="mx-auto mb-4" />
                    <p className="text-sm text-white/70">
                      Drag & drop your file here
                    </p>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Cover Letter / Message"
                    className="w-full rounded-xl border border-[#b98b43]/30 bg-transparent p-4 outline-none text-xs"
                  />

                  <label className="flex items-start gap-3 text-xs text-white">
                    <input type="checkbox" />
                   {sectionContent.careerForm.termsText}
                  </label>

                  <button className="flex w-full items-center justify-center gap-2 rounded-md bg-[#c89a4b] px-4 py-2 font-medium text-black text-xs">
                    {sectionContent.careerForm.buttonText||`SUBMIT APPLICATION`}
                    <ArrowRight size={16} />
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </Container>
    </section>
  );
}