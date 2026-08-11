// app/careers/page.tsx
"use client"
import Image from "next/image";
import { ArrowRight, ChevronDown, Upload } from "lucide-react";
import { Container } from "../ui/Container";
import life1 from "@/assets/career/life1.webp"
import life2 from "@/assets/career/life2.webp"
import life3 from "@/assets/career/life3.webp"
import life4 from "@/assets/career/life4.png"
import life5 from "@/assets/career/life5.webp"
import GreenButton from "../ui/GreenButton";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { applicationApi, careerApi, Career } from "@/lib/api/api";
import HtmlRenderer from "../layout/HtmlRender";
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
] as Career[];

const steps = [
  "Apply Online",
  "HR Screening",
  "Technical Round",
  "Interview",
  "Offer & Onboarding",
];

export default function CareersSection({sectionContent}:CareerSectionComponentProps) {
const [form, setForm] = useState({
  fullName: "",
  email: "",
  phone: "",
  currentLocation: "",
  experience: "",
  department: "",
  coverLetter: "",
});

const [resume, setResume] = useState<File | null>(null);
const [agreed, setAgreed] = useState(false);
const [loading, setLoading] = useState(false);
const [openings, setOpenings] = useState<Career[]>(jobs);
const [appliedJob, setAppliedJob] = useState<Career | null>(null);
const formRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  let isMounted = true;
  careerApi
    .list()
    .then((data) => {
      if (!isMounted) return;
      if (Array.isArray(data)) {
        setOpenings(data.filter((job) => job.status !== "closed"));
      }
    })
    .catch((err) => {
      console.error("Failed to fetch career openings:", err);
      if (isMounted) setOpenings(jobs);
    });
  return () => {
    isMounted = false;
  };
}, []);

const handleApply = (job: Career) => {
  setAppliedJob(job);
  setForm((prev) => ({
    ...prev,
    department: job.department,
    experience: job.experience,
  }));
  formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  toast.info("We have filled the form, please upload your resume.");
};

const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();

  if (
    !form.fullName ||
    !form.email ||
    !form.phone ||
    !form.currentLocation ||
    !form.department||
    !form.experience
  ) {
    toast.error("Please fill all required fields.");
    return;
  }

  if (!resume) {
    toast.error("Please upload your resume.");
    return;
  }

  if (!agreed) {
    toast.error("Please accept the terms.");
    return;
  }

try {
  setLoading(true);

  const formData = new FormData();

  formData.append("fullName", form.fullName);
  formData.append("email", form.email);
  formData.append("phone", form.phone);
  formData.append(
    "currentLocation",
    form.currentLocation
  );
  formData.append(
    "experience",
    form.experience
  );
  formData.append(
    "department",
    form.department
  );
  formData.append(
    "coverLetter",
    form.coverLetter
  );

  if (resume) {
    formData.append("resume", resume);
  }

  await applicationApi.create(formData);

  toast.success(
    "Application submitted successfully!"
  );

  setForm({
    fullName: "",
    email: "",
    phone: "",
    currentLocation: "",
    experience: "",
    department: "",
    coverLetter: "",
  });

  setResume(null);
  setAgreed(false);
  setAppliedJob(null);
} catch (error: any) {
  toast.error(
    error.message ||
      "Something went wrong"
  );
} finally {
  setLoading(false);
}
};

const departmentOptions = Array.from(
  new Set([
    "Design",
    "Engineering",
    "Manufacturing",
    "Sales & Marketing",
    "Project Management",
    ...openings.map((job) => job.department).filter(Boolean),
  ])
);

const experienceOptions = Array.from(
  new Set([
    "Fresher",
    "0-1 Years",
    "1-3 Years",
    "3-5 Years",
    "5-8 Years",
    "8+ Years",
    ...openings.map((job) => job.experience).filter(Boolean),
  ])
);

  return (
    <section className="bg-[#f8f5f0]">
      <Container>
        <div className="grid lg:grid-cols-[0.5fr_1fr] lg:min-h-[320px]">
          {/* Left Content */}
          <div className="relative h-full overflow-hidden bg-[#062017] p-8 lg:p-10">
            <div className="relative z-10">
              <p className="mb-4 text-base uppercase tracking-[0.25em] text-[#c89a4b] font-semibold">
                {sectionContent.heading||"Life at ENSIS"}
              </p>

              <h2 className="font-serif text-2xl leading-tight text-white font-medium">
                {sectionContent.titlePart1||"Where Passion"}
                <br />
                {sectionContent.titlePart2||'Meets Purpose'}
              </h2>

              <p className="mt-2 text-base leading-7 text-white/75"
                dangerouslySetInnerHTML={{__html:sectionContent.description||`From design studios to production units, every corner of ENSIS is
                inspired by creativity, craftsmanship and care.`}}>
              </p>
              <div className="mt-2 max-w-[250px]">
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
          <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
            {/* LEFT SIDE */}
            <div>
              {/* Heading */}
              <h3 className="font-serif text-2xl text-[#1d1d1d] font-semibold mt-2">
                {sectionContent.leftSide.heading}
              </h3>

              <p className="mt-2 text-base" dangerouslySetInnerHTML={{__html:sectionContent.leftSide.description}}>

              </p>

              {/* Filters */}
              <div className="mt-4 flex flex-wrap gap-4">
                {["All Departments", "All Locations", "Experience"].map(
                  (item) => (
                    <button
                      key={item}
                      className="flex min-w-[150px] items-center justify-between rounded-md border border-[#ddd] bg-white px-4 py-3 text-base"
                    >
                      {item}
                      <ChevronDown size={16} />
                    </button>
                  )
                )}

                <button className="ml-auto rounded-md border border-[#c89a4b] px-4 py-2 text-base text-[#c89a4b]">
                  {sectionContent.leftSide.buttonLabel}
                </button>
              </div>

              {/* Job Table */}
              <div className="mt-3 border border-[#e5dfd7] bg-white">
                {openings.length === 0 ? (
                  <div className="p-6 text-center text-base text-[#777]">
                    No open positions right now. Please check back later.
                  </div>
                ) : (
                  openings.map((job) => (
                    <div
                      key={job._id || job.title}
                      className="grid gap-4 border-b border-[#f0ebe5] p-2 md:grid-cols-[2fr_1.5fr_1fr_1fr_auto]"
                    >
                      <div className="font-medium text-base">{job.title}</div>
                      <div className="text-base">{job.department}</div>
                      <div className="text-base">{job.location}</div>
                      <div className="text-base">{job.experience}</div>

                      <button
                        type="button"
                        onClick={() => handleApply(job)}
                        className="flex items-center gap-4 text-[#c89a4b] text-base"
                      >
                        APPLY NOW
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Journey */}
              <div className="mt-2">
                <h3 className="text-lg font-semibold">
                  {sectionContent.ourHiringJourney.title||"Our Hiring Journey"}
                </h3>

                <p className="mt-2 text-base text-[#666]" dangerouslySetInnerHTML={{__html:sectionContent.description||`Our simple and transparent process to welcome you to ENSIS.`}}>
                </p>

                <div className="mt-4 grid gap-4 md:grid-cols-5">
                  {sectionContent.ourHiringJourney.steps.map((step, index) => (
                    <div
                      key={step.label}
                      className="rounded-2xl border border-[#e5dfd7] bg-white p-4 text-center"
                    >
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#062017] text-white">
                        {index + 1}
                      </div>

                      <h4 className="mt-4 font-medium">{step.label}</h4>

                      <HtmlRenderer className="mt-2 text-base text-[#777]" content={step.description}/>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT FORM */}
            <aside ref={formRef} className="relative z-10 lg:-mt-18 lg:sticky lg:top-10 lg:h-fit scroll-mt-24">
              <div className=" bg-[#062017] p-4 text-white shadow-2xl">
                <h3 className="font-serif text-lg uppercase">
                  {sectionContent.careerForm.title}
                </h3>

                <HtmlRenderer className="mt-3 text-base text-white" content={sectionContent.description||`Send us your details and become part of the ENSIS family.`}
                >
                </HtmlRenderer>

                {appliedJob && (
                  <div className="mt-4 flex items-center justify-between gap-4 rounded-md border border-[#c89a4b] bg-[#c89a4b]/10 px-3 py-2">
                    <span className="text-base font-semibold text-[#e8c766]">
                      Applying for: {appliedJob.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAppliedJob(null)}
                      className="text-base text-white/60 underline hover:text-white"
                    >
                      Clear
                    </button>
                  </div>
                )}

                <form
  className="mt-4 space-y-5"
  onSubmit={handleSubmit}
>
                <input
  aria-label="Full name"
  value={form.fullName}
  onChange={(e) =>
    setForm({
      ...form,
      fullName: e.target.value,
    })
  }
  placeholder="Full Name *"
  className="w-full border-b border-[#b98b43]/40 bg-transparent pb-1 outline-none text-base"
/>

          <input
  type="email"
  aria-label="Email address"
  value={form.email}
  onChange={(e) =>
    setForm({
      ...form,
      email: e.target.value,
    })
  }
  placeholder="Email Address *"
  className="w-full border-b border-[#b98b43]/40 bg-transparent pb-1 outline-none text-base"
/>

        <input
  aria-label="Phone number"
  value={form.phone}
  onChange={(e) =>
    setForm({
      ...form,
      phone: e.target.value,
    })
  }
  placeholder="Phone Number *"
  className="w-full border-b border-[#b98b43]/40 bg-transparent pb-1 outline-none text-base"
/>

                  <div className="grid grid-cols-2 gap-4">
                <input
  aria-label="Current location"
  value={form.currentLocation}
  onChange={(e) =>
    setForm({
      ...form,
      currentLocation: e.target.value,
    })
  }
  placeholder="Current Location *"
  className="w-full border-b border-[#b98b43]/40 bg-transparent pb-1 outline-none text-base"
/>
<select
  aria-label="Years of experience"
  value={form.experience}
  onChange={(e) =>
    setForm({
      ...form,
      experience: e.target.value,
    })
  }
  className="border-b border-[#b98b43]/40 bg-[#062017] text-white pb-1 outline-none text-base"
>
  <option value="" className="text-black">Experience</option>
  {experienceOptions.map((opt) => (
    <option key={opt} value={opt}>{opt}</option>
  ))}
</select>
                  </div>

           <select
  aria-label="Department interested in"
  value={form.department}
  onChange={(e) =>
    setForm({
      ...form,
      department: e.target.value,
    })
  }
  className="w-full border-b border-[#b98b43]/40 bg-[#062017] text-white pb-2 outline-none text-base"
>
  <option value="">
    Department Interested In
  </option>
  {departmentOptions.map((opt) => (
    <option key={opt} value={opt}>{opt}</option>
  ))}
</select>
              <div className="rounded-xl border border-dashed border-[#b98b43] p-4 text-center text-base">
  <input
    type="file"
    accept=".pdf,.jpg,.jpeg,.png,.webp"
    className="hidden"
    id="resume"
    onChange={(e) =>
      setResume(
        e.target.files?.[0] || null
      )
    }
  />

  <label
    htmlFor="resume"
    className="cursor-pointer"
  >
    <Upload className="mx-auto mb-4" />

    <p className="text-base text-white/70">
      {resume
        ? resume.name
        : "Upload Resume (PDF/Image)"}
    </p>
  </label>
</div>

             <textarea
  rows={2}
  aria-label="Cover letter or message"
  value={form.coverLetter}
  onChange={(e) =>
    setForm({
      ...form,
      coverLetter: e.target.value,
    })
  }
  placeholder="Cover Letter / Message"
  className="w-full rounded-xl border border-[#b98b43]/30 bg-transparent p-4 outline-none text-base"
/>
                  <label className="flex items-start gap-4 text-base text-white">
                   <input
  type="checkbox"
  aria-label="I agree to the terms"
  checked={agreed}
  onChange={(e) =>
    setAgreed(e.target.checked)
  }
/>
                   {sectionContent.careerForm.termsText}
                  </label>
<button
  type="submit"
  disabled={loading}
  className="flex w-full items-center justify-center gap-4 rounded-md bg-[#c89a4b] px-4 py-2 font-medium text-black text-base disabled:opacity-60"
>
  {loading
    ? "SUBMITTING..."
    : sectionContent.careerForm.buttonText}
  {!loading && (
    <ArrowRight size={16} />
  )}
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