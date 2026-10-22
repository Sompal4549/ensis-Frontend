"use client";

import { useEffect } from "react";
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  FileText,
  GraduationCap,
  LockKeyhole,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plane,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import { ScoreRing } from "@/components/career/pipeline/ui";

const preview = {
  candidate: {
    name: "Aman Sharma",
    designation: "Senior Interior Designer",
    phone: "+91 98765 43210",
    email: "aman.sharma@example.com",
    linkedin: "linkedin.com/in/amansharma",
  },
  job: {
    title: "Senior Interior Designer",
    department: "Design & Projects",
    location: "Delhi NCR",
    type: "Full Time",
    experience: "5 – 8 Years",
    company: "Ensis",
  },
  address: {
    current: "Sector 62, Noida, Uttar Pradesh",
    relocate: "Yes, Pan India",
    notice: "30 Days",
    joining: "Within 30 days of offer",
  },
  experience: [
    {
      current: true,
      company: "Studio Arc Pvt. Ltd.",
      role: "Senior Interior Designer",
      date: "Mar 2021 – Present",
      duration: "(4 Years 7 Months)",
      description:
        "Led residential and commercial fit-out projects end-to-end — space planning, detail drawings, and site execution for premium wellness-focused interiors.",
    },
    {
      current: false,
      company: "Design Hive LLP",
      role: "Interior Designer",
      date: "Jul 2018 – Feb 2021",
      duration: "(2 Years 8 Months)",
      description:
        "Produced 3D visualisations, coordinated with vendors and contractors, and managed client presentations for turnkey projects.",
    },
  ],
  education: [
    {
      degree: "B.Design (Interior Space)",
      university: "National Institute of Fashion Technology",
      years: "2014 – 2018",
    },
  ],
  skills: [
    "Space Planning",
    "3D Visualization",
    "AutoCAD",
    "Material Selection",
    "Ergonomic Design",
    "Client Management",
  ],
  salary: {
    current: "₹ 12,00,000",
    expected: "₹ 15,00,000 – 18,00,000",
    benefits: "Project Bonus, Travel Allowance",
  },
  info: {
    languages: "English, Hindi",
    achievements:
      "Delivered 20+ fit-out projects across wellness and hospitality segments. Reduced project rework by 25% through standardised detail libraries.",
  },
  score: 72,
};

const lookGoodItems = [
  "Personal details completed",
  "Work experience and skills added",
  "Education and salary details provided",
  "Availability and location preferences updated",
  "CV uploaded",
];

function PreviewHeader({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-4 py-3">
      <div className="flex min-w-0 items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-emerald-600" />
        <h3 className="truncate text-[14px] font-semibold text-slate-900">{title}</h3>
      </div>
      <span className="flex shrink-0 items-center gap-1 text-[12px] font-semibold text-slate-400">
        <Pencil className="h-3 w-3" />
        Edit
      </span>
    </div>
  );
}

function PreviewCard({
  icon,
  title,
  children,
  className = "",
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`overflow-hidden rounded-2xl border border-slate-200 bg-white ${className}`}>
      <PreviewHeader icon={icon} title={title} />
      <div className="px-4 py-3.5">{children}</div>
    </section>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[18px_minmax(110px,150px)_1fr] items-center gap-2 border-b border-slate-100 py-2 last:border-b-0">
      <Icon className="h-3.5 w-3.5 text-emerald-600" />
      <span className="text-[12.5px] font-medium text-slate-600">{label}</span>
      <span className="text-[12.5px] font-semibold text-slate-900">{value}</span>
    </div>
  );
}

export function AmanApplicationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (isOpen) lockScroll();
    return () => {
      if (isOpen) unlockScroll();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const steps = ["Upload CV", "AI Analysis", "Application", "Review", "Submit"];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Application preview"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/70 p-3 backdrop-blur-sm md:p-6"
    >
      <div className="relative flex max-h-[92vh] w-full max-w-[1100px] flex-col overflow-hidden rounded-3xl bg-white shadow-[0_30px_90px_-20px_rgba(15,23,42,0.5)]">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-900 text-sm font-semibold tracking-[0.14em] text-white">
              EN
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-semibold tracking-[0.18em] text-slate-900">ENSIS</p>
              <p className="text-[10.5px] uppercase tracking-[0.2em] text-slate-500">
                AI Career Portal · Design Preview
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700 sm:inline-block">
              {preview.job.title}
            </span>
            <button
              type="button"
              aria-label="Close preview"
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="shrink-0 border-b border-slate-200 bg-white px-5 py-3 md:px-8">
          <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {steps.map((step, index) => {
              const position = index + 1;
              const done = position < 5;
              const active = position === 5;
              return (
                <li key={step} className="flex items-center gap-3">
                  <span
                    className={[
                      "grid h-6 w-6 place-items-center rounded-full text-[10.5px] font-semibold",
                      done
                        ? "bg-emerald-500 text-white"
                        : active
                          ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                          : "border border-slate-300 bg-white text-slate-400",
                    ].join(" ")}
                  >
                    {done ? <Check className="h-3 w-3" strokeWidth={3} /> : position}
                  </span>
                  <span
                    className={[
                      "text-[11.5px] font-semibold uppercase tracking-[0.08em]",
                      active ? "text-blue-700" : done ? "text-emerald-700" : "text-slate-400",
                    ].join(" ")}
                  >
                    {step}
                  </span>
                  {position < steps.length ? (
                    <span
                      aria-hidden
                      className={[
                        "hidden h-px w-5 sm:block",
                        position < 5 ? "bg-emerald-300" : "bg-slate-200",
                      ].join(" ")}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>

        {/* Body */}
        <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 px-5 py-5 md:px-8 md:py-6">
            <h2 className="text-[20px] font-semibold text-slate-900">Review your application</h2>
            <p className="mt-1 text-[13px] text-slate-500">
              Preview of a completed Ensis application — this is a static design preview.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <PreviewCard icon={User} title="Candidate Profile">
                <div className="flex items-start gap-3.5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-600 text-[15px] font-semibold text-white">
                    AS
                  </span>
                  <div className="min-w-0 space-y-1.5">
                    <p className="truncate text-[15px] font-semibold text-slate-900">
                      {preview.candidate.name}
                    </p>
                    <p className="text-[12.5px] font-medium text-slate-500">
                      {preview.candidate.designation}
                    </p>
                    <p className="flex items-center gap-2 break-all text-[12.5px] text-slate-600">
                      <Phone className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      {preview.candidate.phone}
                    </p>
                    <p className="flex items-center gap-2 break-all text-[12.5px] text-slate-600">
                      <Mail className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      {preview.candidate.email}
                    </p>
                    <p className="flex items-center gap-2 break-all text-[12.5px] text-slate-600">
                      <span className="grid h-3.5 w-3.5 shrink-0 place-items-center rounded-[3px] bg-blue-600 text-[8px] font-semibold text-white">
                        in
                      </span>
                      {preview.candidate.linkedin}
                    </p>
                  </div>
                </div>
              </PreviewCard>

              <PreviewCard icon={MapPin} title="Address & Availability">
                <InfoRow icon={MapPin} label="Current Address" value={preview.address.current} />
                <InfoRow icon={Plane} label="Willing to Relocate?" value={preview.address.relocate} />
                <InfoRow icon={CalendarDays} label="Notice Period" value={preview.address.notice} />
                <InfoRow icon={CheckCircle2} label="Available to Join" value={preview.address.joining} />
              </PreviewCard>

              <PreviewCard
                icon={BriefcaseBusiness}
                title="Professional Experience"
                className="md:col-span-2"
              >
                <div className="space-y-4 border-l-2 border-emerald-200 pl-4">
                  {preview.experience.map((exp) => (
                    <div key={exp.company} className="relative">
                      <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-emerald-600 bg-white" />
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-[13.5px] font-semibold text-slate-900">{exp.company}</h4>
                        {exp.current ? (
                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-emerald-700">
                            Current Company
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-0.5 text-[12.5px] font-medium text-slate-600">{exp.role}</p>
                      <p className="mt-1 text-[12px] leading-relaxed text-slate-500">
                        {exp.description}
                      </p>
                      <p className="mt-1 text-[11.5px] font-semibold text-slate-400">
                        {exp.date} · {exp.duration}
                      </p>
                    </div>
                  ))}
                </div>
              </PreviewCard>

              <PreviewCard icon={GraduationCap} title="Education">
                {preview.education.map((edu) => (
                  <div key={edu.degree} className="flex items-start justify-between gap-3 border-b border-slate-100 py-2 last:border-b-0">
                    <div>
                      <p className="text-[12.5px] font-semibold text-slate-900">{edu.degree}</p>
                      <p className="text-[11.5px] text-slate-500">{edu.university}</p>
                    </div>
                    <span className="shrink-0 text-[11.5px] font-semibold text-slate-400">
                      {edu.years}
                    </span>
                  </div>
                ))}
              </PreviewCard>

              <PreviewCard icon={Building2} title="Skills">
                <div className="flex flex-wrap gap-2">
                  {preview.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11.5px] font-medium text-slate-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </PreviewCard>

              <PreviewCard icon={TrendingUp} title="Salary Details" className="md:col-span-2">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-[11.5px] font-medium text-slate-500">Current CTC</p>
                    <p className="mt-0.5 text-[13.5px] font-semibold text-slate-900">
                      {preview.salary.current}
                    </p>
                    <p className="text-[11px] text-slate-400">per annum</p>
                  </div>
                  <div className="sm:border-l sm:border-slate-100 sm:pl-4">
                    <p className="text-[11.5px] font-medium text-slate-500">Expected CTC</p>
                    <p className="mt-0.5 text-[13.5px] font-semibold text-slate-900">
                      {preview.salary.expected}
                    </p>
                    <p className="text-[11px] text-slate-400">per annum</p>
                  </div>
                  <div className="sm:border-l sm:border-slate-100 sm:pl-4">
                    <p className="text-[11.5px] font-medium text-slate-500">Other Benefits</p>
                    <p className="mt-0.5 text-[13px] font-semibold text-slate-900">
                      {preview.salary.benefits}
                    </p>
                  </div>
                </div>
              </PreviewCard>

              <PreviewCard
                icon={FileText}
                title="Additional Information"
                className="md:col-span-2"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[140px_1fr]">
                  <div>
                    <p className="text-[11.5px] font-medium text-slate-500">Languages Known</p>
                    <p className="mt-0.5 text-[12.5px] font-semibold text-slate-900">
                      {preview.info.languages}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11.5px] font-medium text-slate-500">Relevant Achievements</p>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-slate-600">
                      {preview.info.achievements}
                    </p>
                  </div>
                </div>
              </PreviewCard>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="border-t border-slate-200 bg-slate-50/80 px-5 py-5 md:border-l md:border-t-0 md:px-6">
            <div className="space-y-4 lg:sticky lg:top-4">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Your AI Match Score
                </p>
                <ScoreRing score={preview.score} size={120} caption="Matches key role requirements" />
                <p className="mt-3 text-center text-[13px] font-semibold text-slate-700">
                  Strong Match — your profile aligns well with this role.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Job Summary
                </p>
                <p className="mb-3 text-[14px] font-semibold text-slate-900">{preview.job.title}</p>
                <ul className="space-y-2">
                  {[
                    { icon: Building2, label: preview.job.company },
                    { icon: MapPin, label: preview.job.location },
                    { icon: BriefcaseBusiness, label: preview.job.type },
                    { icon: TrendingUp, label: preview.job.experience },
                    { icon: GraduationCap, label: preview.job.department },
                  ].map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-center gap-2 text-[12.5px] text-slate-600">
                      <Icon className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      {label}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Looks good!
                </p>
                <ul className="space-y-2">
                  {lookGoodItems.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-[12.5px] font-medium text-slate-700"
                    >
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-[14px] font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                >
                  Close preview
                  <X className="h-4 w-4" />
                </button>
                <p className="mt-2.5 flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-500">
                  <LockKeyhole className="mt-px h-3.5 w-3.5 shrink-0 text-emerald-600" />
                  Preview only — nothing is submitted. Your data is secure and used only for
                  recruitment.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
