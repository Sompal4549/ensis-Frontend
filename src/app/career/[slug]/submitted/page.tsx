"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Copy,
  Check,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  Users,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Leaf,
  BarChart3,
  Heart,
  Home,
  Search,
  Headphones,
  Edit2,
  FileSearch,
} from "lucide-react";
import { serif } from "@/components/career-v2/ui";
import { Container } from "@/components/ui/Container";
import {
  getJob,
  type PublicJob,
  type Screening,
  type CandidateProfile,
  type ApplicationSubmitResponse,
} from "@/lib/careerApi";
import { loadFlowState, findExistingSubmission } from "@/lib/careerFlowV2";
import { jobLocation, jobType, jobExperience } from "@/lib/careers";

// Banner & Assets matching exact user mockup
import applyHeroImg from "@/assets/career/first-step/apply.png";
import sectionLeft from "@/assets/career/section_left.png";
import sectionRight from "@/assets/career/section_right.png";
import thankYouImg from "@/assets/career/first-step/thank_you.png";
import togetherImg from "@/assets/career/first-step/together.png";
import beAPartLeftImg from "@/assets/career/first-step/be_a_part_left.png";
import defaultAvatar from "@/assets/career/flow/default-avatar.webp";

function LinkedinIcon({ size = 12, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.86 0 1.54-.68 1.54-1.54 0-.85-.7-1.54-1.54-1.54a1.55 1.55 0 0 0-1.55 1.54c0 .86.69 1.54 1.55 1.54m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  );
}

function formatSlugToTitle(slugStr: string): string {
  if (!slugStr) return "Software Engineer – Full Stack (React / Next.js)";
  const clean = slugStr.toLowerCase();
  if (clean.includes("software-engineer") || clean.includes("full-stack")) {
    return "Software Engineer – Full Stack (React / Next.js)";
  }
  if (clean.includes("product-designer")) {
    return "Product Designer";
  }
  if (clean.includes("furniture-production")) {
    return "Furniture Production Specialist";
  }
  if (clean.includes("sales") && clean.includes("partnership")) {
    return "Sales & Partnerships Executive";
  }
  if (clean.includes("wellness-space")) {
    return "Wellness Space Consultant";
  }
  return slugStr
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function SubmittedPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "";

  const [job, setJob] = useState<PublicJob | null>(null);
  const [screening, setScreening] = useState<Screening | null>(null);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [submission, setSubmission] = useState<ApplicationSubmitResponse | null>(null);
  const [existingSub, setExistingSub] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const state = loadFlowState(slug);

    if (state?.job) setJob(state.job);
    if (state?.screening) setScreening(state.screening);
    if (state?.profile) setProfile(state.profile);
    if (state?.submission) setSubmission(state.submission);

    const existing = findExistingSubmission(slug);
    if (existing) setExistingSub(existing);

    // Dynamic fetch if accessed directly or refreshed
    if (!state?.job) {
      getJob(slug).then((j) => {
        if (j) setJob(j);
      });
    }
  }, [slug]);

  // Dynamic values with clean fallbacks
  const jobTitle = job?.title || existingSub?.jobTitle || formatSlugToTitle(slug);
  const applicationId = submission?.applicationId || existingSub?.applicationId || "ENS-CAR-2026-00187";
  const candidateName = profile?.fullName || existingSub?.candidateName || "Vijay Sharma";
  const firstName = candidateName.split(" ")[0] || "Vijay";
  const email = profile?.email || existingSub?.email || "vijay.sharma@gmail.com";
  const phone = profile?.phone || existingSub?.phone || "+91 98765 43210";
  const currentLocation = profile?.currentLocation || "Delhi NCR";
  const linkedin = profile?.linkedin || `linkedin.com/in/${firstName.toLowerCase()}-${(candidateName.split(" ")[1] || "").toLowerCase()}`;
  const displayLocation = job ? jobLocation(job) : "Delhi NCR";
  const displayJobType = job ? jobType(job) : "Full Time";
  const displayEdu = job?.educationRequirements || "B.Tech / B.E / MCA / M.Tech";
  const score = screening?.result?.score || 85;

  const submittedDateText = (submission?.submittedAt || existingSub?.submittedAt)
    ? new Date(submission?.submittedAt || existingSub?.submittedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "17 Oct 2026, 10:24 AM";

  const handleCopyId = () => {
    navigator.clipboard.writeText(applicationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#3f3a33] relative">
      {/* ════════ 1. Hero Banner Using apply.png matching user mockup ════════ */}
      <section className="relative overflow-hidden border-b border-[#ebdcc7] bg-[#fbf4e2]">
        {/* Panoramic Banner Image from apply.png */}
        <Image
          src={applyHeroImg}
          alt="Careers at Ensis - Application Submitted"
          fill
          priority
          sizes="100vw"
          className="object-cover object-right"
        />

        {/* Botanical leaves on left and right borders */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-[5.5%] sm:w-[6.5%] max-w-[90px] select-none z-10 overflow-hidden opacity-40">
          <Image src={sectionLeft} alt="" aria-hidden fill sizes="7vw" className="object-cover object-right" />
        </div>
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-[5.5%] sm:w-[6.5%] max-w-[90px] select-none z-10 overflow-hidden opacity-40">
          <Image src={sectionRight} alt="" aria-hidden fill sizes="7vw" className="object-cover object-left" />
        </div>

        {/* Soft gradient overlay on left for sharp text readability */}
        <div className="absolute inset-0 bg-[#fbf4e2]/90 lg:hidden" />
        <div className="absolute inset-0 hidden w-[68%] bg-gradient-to-r from-[#fbf4e2]/98 via-[#fbf4e2]/85 to-transparent lg:block" />

        <Container className="relative py-0! z-10 w-full">
          <div className="max-w-[650px] pt-7 sm:pt-9 lg:pt-11 pb-4 sm:pb-5 space-y-1 sm:space-y-1.5">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#6b6255] font-medium tracking-tight">
              <Link href="/" className="hover:text-[#163a2b] transition-colors flex items-center gap-1">
                <Home size={12} className="text-[#a8792c]" />
              </Link>
              <span className="text-[#a8792c]">&gt;</span>
              <Link href="/career" className="hover:text-[#163a2b] transition-colors">
                Careers
              </Link>
              <span className="text-[#a8792c]">&gt;</span>
              <Link href={`/career/${encodeURIComponent(slug)}`} className="hover:text-[#163a2b] transition-colors">
                Apply for Position
              </Link>
              <span className="text-[#a8792c]">&gt;</span>
              <span className="text-[#163a2b] font-semibold">Application Submitted</span>
            </div>

            {/* Eyebrow */}
            <p className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-[#e05638]">
              CAREERS AT ENSIS
            </p>

            {/* Heading: Application Submitted (Application in Navy, Submitted in Coral) */}
            <h1
              style={{ ...serif, fontWeight: 800 }}
              className="text-[1.6rem] sm:text-[1.9rem] lg:text-[2.2rem] font-extrabold tracking-tight leading-[1.1]"
            >
              <span className="text-[#0c3363]">Application </span>
              <span className="text-[#e05638]">Submitted</span>
            </h1>

            {/* Subtitle */}
            <p className="text-[11px] sm:text-xs text-[#4a4237] leading-snug max-w-[560px]">
              Thank you! Your application has been submitted successfully.
            </p>

            {/* 4-Step Stepper inside Banner with ALL 4 Steps Completed */}
            <div className="pt-1 sm:pt-1.5">
              <div className="flex items-center w-full max-w-[560px]">
                {[
                  { id: 1, label: "Upload CV", sublabel: "Completed" },
                  { id: 2, label: "AI Analysis", sublabel: "Completed" },
                  { id: 3, label: "Review Details", sublabel: "Completed" },
                  { id: 4, label: "Submit Application", sublabel: "Completed" },
                ].map((step, idx) => (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center text-center shrink-0">
                      <div className="grid size-6 sm:size-7 place-items-center rounded-full bg-[#163a2b] text-white shadow-2xs">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="mt-0.5 text-[10px] sm:text-[10.5px] font-bold text-[#163a2b] whitespace-nowrap">
                        {step.label}
                      </span>
                      <span className="text-[9px] font-medium text-[#198754]">
                        {step.sublabel}
                      </span>
                    </div>

                    {/* Connecting line between steps */}
                    {idx < 3 && (
                      <div className="h-[2px] flex-1 bg-[#163a2b] mx-1 sm:mx-2 -mt-6" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ════════ 2. Main Content Grid ════════ */}
      <Container className="py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-start">
          {/* ──────── Left Column (col-span-8) ──────── */}
          <div className="lg:col-span-8 space-y-3 sm:space-y-3.5">
            {/* Card 1: Top Congratulatory Success Card - Exact match to user mockup */}
            <div className="rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] shadow-xs relative overflow-hidden flex flex-col sm:flex-row items-stretch">
              {/* Together for a Healthier Tomorrow cursive image on top-right */}
              <div className="absolute right-3 sm:right-6 top-3 sm:top-4 w-36 sm:w-44 md:w-48 h-16 sm:h-20 select-none pointer-events-none hidden sm:block z-10">
                <Image
                  src={togetherImg}
                  alt="Together for a Healthier Tomorrow"
                  fill
                  className="object-contain object-right-top"
                  priority
                />
              </div>

              {/* Left Illustration: thank_you.png matching user mockup - FULL HEIGHT with soft right blend */}
              <div className="relative w-full sm:w-[220px] md:w-[245px] lg:w-[265px] xl:w-[280px] shrink-0 min-h-[220px] sm:min-h-full overflow-hidden self-stretch">
                <Image
                  src={thankYouImg}
                  alt="Application Verified"
                  fill
                  sizes="(max-width: 640px) 100vw, 280px"
                  className="object-cover object-center scale-[1.03]"
                  priority
                />
                {/* Soft right edge fade into card white background */}
                <div className="absolute inset-y-0 right-0 hidden sm:block w-14 bg-gradient-to-r from-transparent via-[#fffdf9]/60 to-[#fffdf9] pointer-events-none" />
                {/* Soft bottom edge fade on mobile */}
                <div className="absolute inset-x-0 bottom-0 sm:hidden h-10 bg-gradient-to-t from-[#fffdf9] to-transparent pointer-events-none" />
              </div>

              {/* Right Content */}
              <div className="flex-1 min-w-0 p-4 sm:p-5 lg:p-6 sm:pl-2 md:pl-3 space-y-2.5 relative z-10">
                {/* Top Badge: Application Submitted Successfully */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-[#e8f5ec] text-[#0c5931] border border-[#d2ead9]">
                  <span className="grid size-4 place-items-center rounded-full bg-[#0c5931] text-white">
                    <Check size={10} strokeWidth={3.5} />
                  </span>
                  <span>Application Submitted Successfully</span>
                </div>

                {/* Heading: Thank You, Vijay! in Playfair Display serif */}
                <h2
                  style={{ fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif" }}
                  className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#0c3363] leading-tight tracking-tight"
                >
                  Thank You, <span className="text-[#e05638]">{firstName}!</span>
                </h2>

                {/* Subtitle Paragraph */}
                <div className="text-xs sm:text-[13px] text-[#475569] leading-relaxed">
                  <p>
                    Your application for <strong className="text-[#0c3363] font-bold">{jobTitle}</strong> has been submitted successfully.
                  </p>
                  <p className="mt-0.5">
                    Our team will review your profile and get back to you soon.
                  </p>
                </div>

                {/* Summary Metric Blocks (2 Columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Application ID Block - Clean White Card with rounded-full icon */}
                  <div className="rounded-xl border border-[#e2e8f0] bg-white p-3 sm:p-3.5 flex items-start gap-3 shadow-2xs">
                    <div className="grid size-9 place-items-center rounded-full bg-[#fff7ed] border border-[#ffedd5] text-[#ea580c] shrink-0 mt-0.5">
                      <Mail size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] sm:text-xs font-medium text-[#64748b]">
                          Application ID
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyId}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#ea580c] hover:underline cursor-pointer"
                        >
                          <Copy size={10} />
                          <span>{copied ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                      <p className="font-bold text-sm sm:text-base text-[#0c3363] tracking-wide mt-0.5">
                        {applicationId}
                      </p>
                      <span className="text-[10px] sm:text-[10.5px] text-[#64748b] block mt-0.5">
                        Please keep this ID for future reference.
                      </span>
                    </div>
                  </div>

                  {/* Submitted On Block - Clean White Card with rounded-full icon */}
                  <div className="rounded-xl border border-[#e2e8f0] bg-white p-3 sm:p-3.5 flex items-start gap-3 shadow-2xs">
                    <div className="grid size-9 place-items-center rounded-full bg-[#fff7ed] border border-[#ffedd5] text-[#ea580c] shrink-0 mt-0.5">
                      <Calendar size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] sm:text-xs font-medium text-[#64748b] block">
                        Submitted On
                      </span>
                      <p className="font-bold text-sm sm:text-base text-[#0c3363] tracking-wide mt-0.5">
                        {submittedDateText}
                      </p>
                      <span className="text-[10px] sm:text-[10.5px] text-[#64748b] block mt-0.5 truncate" title={`A confirmation email has been sent to ${email}.`}>
                        A confirmation email has been sent to {email}.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: What Happens Next? Process Timeline matching exact user screenshot */}
            <div className="rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] p-4 sm:p-5 lg:p-6 shadow-xs space-y-3">
              <div>
                <h3 style={serif} className="text-xl sm:text-2xl font-bold text-[#0c3363]">
                  What Happens <span className="text-[#ea580c]">Next?</span>
                </h3>
                <p className="text-xs sm:text-[13px] text-[#475569] mt-0.5">
                  Here is what you can expect after submitting your application.
                </p>
              </div>

              {/* Horizontal Connected Timeline matching mockup (NO card boxes, clean connected circles) */}
              <div className="pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-2 relative">
                  {[
                    {
                      step: 1,
                      icon: FileSearch,
                      title: "Application Review",
                      desc: "Our HR team will review your application and AI analysis report.",
                      duration: "1 – 3 Working Days",
                    },
                    {
                      step: 2,
                      icon: Users,
                      title: "Shortlisting",
                      desc: "If your profile matches the requirements, you will be shortlisted.",
                      duration: "3 – 5 Working Days",
                    },
                    {
                      step: 3,
                      icon: Phone,
                      title: "Interview Process",
                      desc: "You will be contacted via email/phone for the next steps.",
                      duration: "5 – 10 Working Days",
                    },
                    {
                      step: 4,
                      icon: Mail,
                      title: "Final Update",
                      desc: "You will receive the final status of your application by email.",
                      duration: "Within 2 Weeks",
                    },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.step} className="flex flex-col items-center text-center relative">
                        {/* Circle Icon Container */}
                        <div className="relative flex items-center justify-center">
                          <div className="size-13 sm:size-14 rounded-full border border-[#f97316] bg-[#fff7ed] flex items-center justify-center text-[#ea580c] shadow-2xs">
                            <Icon size={20} strokeWidth={2} />
                          </div>
                        </div>

                        {/* Connecting Dotted Arrow between steps (between circles on desktop/tablet) */}
                        {idx < 3 && (
                          <div className="hidden sm:block absolute top-[28px] -right-[calc(50%-28px)] w-[calc(100%-56px)] z-0 pointer-events-none">
                            <svg className="w-full h-3 text-[#ea580c]" fill="none" viewBox="0 0 100 12" preserveAspectRatio="none">
                              <line x1="2" y1="6" x2="88" y2="6" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3 3" />
                              <polyline points="84,2 92,6 84,10" fill="none" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        )}

                        {/* Step Title in Dark Blue */}
                        <h4 className="font-bold text-xs sm:text-[13px] md:text-sm text-[#0c3363] mt-2.5 leading-snug">
                          {item.title}
                        </h4>

                        {/* Step Description in Slate/Navy */}
                        <p className="text-[10.5px] sm:text-[11px] text-[#475569] leading-snug max-w-[170px] mt-1">
                          {item.desc}
                        </p>

                        {/* Pill Duration Badge in Peach/Orange */}
                        <div className="mt-2.5">
                          <span className="inline-block text-[10px] sm:text-[10.5px] font-semibold text-[#c2410c] bg-[#ffedd5]/80 border border-[#fed7aa] px-3 py-1 rounded-md">
                            {item.duration}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Card 3: Be Part of a Healthier, More Inspired Tomorrow Band matching exact user mockup */}
            <div className="rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] shadow-xs overflow-hidden flex flex-col md:flex-row items-center relative">
              {/* Armchair Photo on left edge-to-edge starting at very start */}
              <div className="relative w-full md:w-[220px] lg:w-[245px] xl:w-[260px] h-44 sm:h-48 md:h-[142px] shrink-0 overflow-hidden">
                <Image
                  src={beAPartLeftImg}
                  alt="ENSIS Wellness Furniture"
                  fill
                  sizes="(max-width: 768px) 100vw, 260px"
                  className="object-cover object-left"
                />
                {/* Soft gradient fade on right for seamless blend into card background */}
                <div className="absolute inset-y-0 right-0 hidden md:block w-16 bg-gradient-to-r from-transparent via-[#fffdf9]/60 to-[#fffdf9]" />
                <div className="absolute inset-x-0 bottom-0 md:hidden h-12 bg-gradient-to-t from-[#fffdf9] to-transparent" />
              </div>

              {/* Center & Right Content in row */}
              <div className="flex-1 min-w-0 p-3.5 sm:p-4 md:py-3 md:pl-2 md:pr-4 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3 sm:gap-4 w-full">
                {/* Center Content: Heading + Description */}
                <div className="max-w-[340px]">
                  <h3 style={serif} className="text-base sm:text-[17px] lg:text-[18px] font-bold text-[#0c3363] leading-[1.2]">
                    Be Part of a Healthier,<br className="hidden sm:inline" /> More Inspired Tomorrow.
                  </h3>
                  <p className="text-[11px] sm:text-[12px] text-[#475569] mt-1 leading-snug">
                    Join ENSIS and help us create wellness spaces for people around the world.
                  </p>
                </div>

                {/* 4 Feature Items in horizontal row with MORE SPACING matching mockup */}
                <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 xl:gap-5.5 shrink-0 self-center xl:self-auto">
                  {[
                    { icon: Leaf, label: "Innovative\nDesign" },
                    { icon: Users, label: "Collaborative\nTeam" },
                    { icon: BarChart3, label: "Growth\nOpportunities" },
                    { icon: Heart, label: "Positive\nImpact" },
                  ].map((feat, idx) => {
                    const Icon = feat.icon;
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1.5 text-center min-w-[56px] sm:min-w-[62px]">
                        <div className="size-11 sm:size-12 rounded-full bg-white border border-[#ebdcc7] shadow-xs flex items-center justify-center text-[#166534] transition hover:scale-105">
                          <Icon size={19} strokeWidth={2.2} />
                        </div>
                        <span className="text-[9.5px] sm:text-[10px] font-semibold text-[#0c3363] leading-tight text-center whitespace-pre-line">
                          {feat.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ──────── Right Sidebar (col-span-4) ──────── */}
          <div className="lg:col-span-4 space-y-2.5 sm:space-y-3">
            {/* 1. Your Profile Card */}
            <div className="rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] p-3 sm:p-3.5 shadow-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#ebdcc7]/70">
                <h4 style={serif} className="text-sm font-bold text-[#0c3363]">
                  Your Profile
                </h4>
                <Link
                  href={`/career/${encodeURIComponent(slug)}/apply`}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0c3363] hover:text-[#ea580c]"
                >
                  <Edit2 size={11} />
                  <span>Edit Details</span>
                </Link>
              </div>

              <div className="mt-2.5 flex items-stretch gap-3">
                {/* Candidate Photo */}
                <div className="relative size-18 sm:size-20 shrink-0 rounded-xl overflow-hidden border border-[#ebdcc7] bg-[#f4ebd9] shadow-2xs">
                  <Image
                    src={defaultAvatar}
                    alt={candidateName}
                    fill
                    className="object-cover object-top"
                  />
                </div>

                <div className="min-w-0 flex-1 flex flex-col gap-1 py-0.5 text-[10.5px] text-[#554e42]">
                  <p className="font-bold text-xs sm:text-[13px] text-[#0c3363] truncate">
                    {candidateName}
                  </p>
                  <p className="flex items-center gap-1.5 text-[10.5px] min-w-0">
                    <Mail size={11} className="text-[#0c3363] shrink-0" />
                    <span className="truncate block" title={email}>
                      {email}
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5 text-[10.5px] min-w-0">
                    <Phone size={11} className="text-[#0c3363] shrink-0" />
                    <span className="truncate block">{phone}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-[10.5px] min-w-0">
                    <MapPin size={11} className="text-[#0c3363] shrink-0" />
                    <span className="truncate block">{currentLocation}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-[10.5px] min-w-0">
                    <Calendar size={11} className="text-[#0c3363] shrink-0" />
                    <span className="truncate block">14 Nov 1995 &nbsp;|&nbsp; Male</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-[10.5px] text-[#0a66c2] min-w-0">
                    <LinkedinIcon size={11} className="shrink-0 text-[#0a66c2]" />
                    <span className="truncate block cursor-pointer hover:underline" title={linkedin}>
                      {linkedin}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Position Applied For Card */}
            <div className="rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] p-3 sm:p-3.5 shadow-xs flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-[#ea580c] text-white shrink-0 shadow-2xs">
                <Briefcase size={18} strokeWidth={2.2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-[#64748b] font-medium leading-tight">
                  Position Applied For
                </p>
                <h4 className="font-bold text-xs sm:text-[13px] text-[#0c3363] truncate leading-tight mt-0.5">
                  {jobTitle}
                </h4>
                <div className="mt-1 flex items-center gap-3 text-[10px] text-[#64748b] flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin size={10} className="text-[#ea580c]" />
                    <span>{displayLocation}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={10} className="text-[#ea580c]" />
                    <span>{displayJobType}</span>
                  </span>
                  <span className="flex items-center gap-1 truncate max-w-[150px]" title={displayEdu}>
                    <BarChart3 size={10} className="text-[#ea580c]" />
                    <span>{displayEdu.split(";")[0]}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Profile Match Card */}
            <div className="rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] p-3 sm:p-3.5 shadow-xs flex items-center gap-3 sm:gap-4">
              {/* Donut gauge */}
              <div className="relative size-16 sm:size-18 shrink-0 flex items-center justify-center">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#e8ded0]"
                    strokeWidth="3.6"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    style={{ color: "#0e6037" }}
                    strokeDasharray={`${score}, 100`}
                    strokeWidth="3.6"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-base sm:text-lg font-black text-[#0c3363] leading-none">
                    {score}%
                  </span>
                </div>
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h5 style={serif} className="text-xs sm:text-[13px] font-bold text-[#0c3363]">
                    Profile Match
                  </h5>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]">
                    ⭐ Strong Match
                  </span>
                </div>
                <p className="text-[10px] text-[#554e42] leading-tight mt-0.5">
                  Your profile matches well with the job requirements.
                </p>
                <p className="text-[9.5px] text-[#64748b] leading-tight mt-0.5">
                  Based on skills, experience and qualifications derived from your CV.
                </p>
              </div>
            </div>

            {/* 4. Keep Exploring Opportunities Card */}
            <div className="rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] p-3 sm:p-3.5 shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="grid size-6 place-items-center rounded-full bg-[#fff7ed] text-[#ea580c]">
                  <Search size={13} />
                </span>
                <h5 className="font-bold text-xs text-[#0c3363]">
                  Keep Exploring Opportunities
                </h5>
              </div>
              <p className="text-[10.5px] text-[#64748b] leading-relaxed">
                Would you like to explore other suitable opportunities? We will notify you about relevant openings.
              </p>
              <Link
                href="/career"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#ea580c] bg-white hover:bg-[#fff7ed] px-3 py-2 text-xs font-semibold text-[#ea580c] shadow-2xs transition-all"
              >
                <span>View Other Opportunities</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* 5. Need Help? Card matching exact user screenshot */}
            <div className="rounded-2xl border border-[#ebdcc7] bg-[#fffdf9] p-4 sm:p-4.5 shadow-xs flex items-start gap-3.5">
              {/* Solid dark blue circular container on left with white headset icon */}
              <div className="size-11 sm:size-12 rounded-full bg-[#0c3363] text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                <Headphones size={20} strokeWidth={2.2} />
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <h5 style={serif} className="font-bold text-sm sm:text-base text-[#0c3363] leading-tight">
                  Need Help?
                </h5>
                <p className="text-[11px] sm:text-xs text-[#334155] leading-snug">
                  If you have any questions regarding your application, feel free to reach out to our HR team.
                </p>

                <div className="pt-2 flex items-center gap-3 sm:gap-4 flex-wrap">
                  <a
                    href="mailto:hr@ensis.in"
                    className="inline-flex items-center justify-center rounded-lg border-[1.5px] border-[#0c3363] bg-white hover:bg-[#0c3363] hover:text-white px-3 sm:px-3.5 py-1.5 text-xs font-bold text-[#0c3363] transition-colors shadow-2xs"
                  >
                    Contact HR Team
                  </a>
                  <div className="space-y-0.5 text-xs">
                    <a
                      href="mailto:hr@ensis.in"
                      className="flex items-center gap-1.5 font-semibold text-[#0c3363] hover:underline"
                    >
                      <Mail size={12} className="text-[#0c3363] shrink-0" />
                      <span>hr@ensis.in</span>
                    </a>
                    <a
                      href="tel:+919876543210"
                      className="flex items-center gap-1.5 font-semibold text-[#0c3363] hover:underline"
                    >
                      <Phone size={12} className="text-[#0c3363] shrink-0" />
                      <span>+91 98765 43210</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
