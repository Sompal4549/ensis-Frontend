"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  Loader2,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import PhoneVerifyModal from "@/components/career/PhoneVerifyModal";
import {
  Field,
  GhostButton,
  PipelineShell,
  PrimaryButton,
  RadioRow,
  ScoreRing,
  SectionTitle,
  SelectField,
  SideCard,
} from "@/components/career/pipeline/ui";
import {
  EMPLOYMENT_OPTIONS,
  EXPECTED_CTC_OPTIONS,
  GENERAL_JOB,
  LOCATION_OPTIONS,
  MATCH_THEME,
  NOTICE_PERIOD_OPTIONS,
  RELOCATE_OPTIONS,
  clearCareerFlow,
  defaultFormFromAnalysis,
  formatFileSize,
  isValidEmail,
  isValidPhone,
  matchLevel,
  otpPhone,
  updateCareerForm,
  setCareerFlow,
  useCareerFlow,
  type CareerForm,
} from "@/lib/careerFlow";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

const EXPERIENCE_OPTIONS = [
  "Fresher",
  "0 - 1 Years",
  "1 - 3 Years",
  "3 - 5 Years",
  "5 - 8 Years",
  "8 - 12 Years",
  "12+ Years",
];

const WHY_MAX = 500;

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-[14px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

type FieldKey = "fullName" | "email" | "phone" | "currentLocation" | "confirmed";
type FieldErrors = Partial<Record<FieldKey, string>>;

function FormCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center gap-2.5 border-b border-slate-200 bg-slate-50/80 px-4 py-3 md:px-5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white">
          <Icon className="h-[16px] w-[16px]" />
        </span>
        <h3 className="text-[14.5px] font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="px-4 py-4 md:px-5">{children}</div>
    </section>
  );
}

export default function ApplicationFormPage() {
  const router = useRouter();
  const flow = useCareerFlow();
  const analysis = flow.analysis;
  const job = flow.job ?? GENERAL_JOB;
  const form = flow.form;

  const [confirmed, setConfirmed] = useState(true);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!analysis) {
      router.replace("/career/uploade_cv");
      return;
    }
    if (!flow.form) {
      updateCareerForm(defaultFormFromAnalysis(analysis));
    }
  }, [analysis, flow.form, router]);

  useEffect(() => {
    if (!modalOpen) return;
    lockScroll();
    return () => unlockScroll();
  }, [modalOpen]);

  const phoneVerified = useMemo(() => {
    if (!flow.verifiedPhone) return false;
    const entered = otpPhone(form?.phone ?? "");
    return entered.length === 10 && entered === otpPhone(flow.verifiedPhone);
  }, [flow.verifiedPhone, form?.phone]);

  const phoneOptions = useMemo(() => {
    const seen = new Set<string>();
    const options: string[] = [];
    for (const raw of [analysis?.phones ?? [], [analysis?.phone ?? ""], [form?.phone ?? ""]]) {
      for (const candidate of raw) {
        const digits = otpPhone(candidate);
        if (digits.length === 10 && !seen.has(digits)) {
          seen.add(digits);
          options.push(digits);
        }
      }
    }
    return options;
  }, [analysis?.phones, analysis?.phone, form?.phone]);

  if (!analysis || !form) {
    return (
      <div className="grid min-h-[60vh] place-items-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const change = (patch: Partial<CareerForm>, clearKey?: FieldKey) => {
    updateCareerForm(patch);
    if (clearKey) setErrors((prev) => ({ ...prev, [clearKey]: undefined }));
  };

  const handleContinue = () => {
    const next: FieldErrors = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!isValidEmail(form.email)) next.email = "Enter a valid email address.";
    if (!isValidPhone(form.phone)) next.phone = "Enter a valid 10-digit mobile number.";
    if (!form.currentLocation) next.currentLocation = "Select your current location.";
    if (!confirmed) next.confirmed = "Please confirm the information is accurate.";
    if (!phoneVerified) next.phone = next.phone ?? "Verify your mobile number to continue.";
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;

    updateCareerForm({
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone,
      currentLocation: form.currentLocation,
      totalExperience: form.totalExperience || "Fresher",
      department: form.department || job.department || "General",
      relocate: form.relocate,
      employmentStatus: form.employmentStatus,
      noticePeriod: form.noticePeriod,
      expectedCTC: form.expectedCTC,
      whyInterested: form.whyInterested,
    });
    router.push("/career/review-submit");
  };

  const cvSizeLabel = (() => {
    const numeric = Number(analysis.cvSize);
    return Number.isFinite(numeric) && numeric > 0 ? formatFileSize(numeric) : analysis.cvSize;
  })();

  const summaryRows = [
    { icon: BriefcaseBusiness, label: "Role", value: job.title },
    { icon: Building2, label: "Department", value: job.department || "General" },
    { icon: MapPin, label: "Location", value: job.location || "India" },
    { icon: GraduationCap, label: "Experience", value: job.experience || "Any" },
    { icon: Clock3, label: "Type", value: job.type || "Full Time" },
  ];

  return (
    <PipelineShell current={4} badge={job.title} sidebar={
      <>
        <SideCard title="Your CV" accent="emerald">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-9 shrink-0 place-items-center rounded-lg border-2 border-emerald-600 text-emerald-600">
              <FileText className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-slate-900">{analysis.cvName}</p>
              <p className="text-[11.5px] text-slate-500">{cvSizeLabel}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              clearCareerFlow();
              router.push("/career/uploade_cv");
            }}
            className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-blue-600 transition hover:text-blue-700"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Replace CV
          </button>
        </SideCard>

        <SideCard title="AI Match" accent="blue">
          <ScoreRing
            score={analysis.score}
            size={110}
            caption={MATCH_THEME[matchLevel(analysis.score)].hint}
          />
        </SideCard>

        <SideCard title="Job Summary">
          <ul className="space-y-2.5">
            {summaryRows.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-start gap-2.5">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-slate-100 text-slate-500">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    {label}
                  </p>
                  <p className="text-[12.5px] font-medium leading-snug text-slate-800">{value}</p>
                </div>
              </li>
            ))}
          </ul>
        </SideCard>
      </>
    }>
      <SectionTitle
        eyebrow="Step 4 · Application"
        title="Tell us about yourself"
        description="Review the details pulled from your CV, add the missing pieces, and verify your mobile number before continuing."
      />

      <div className="space-y-4">
        <FormCard icon={User} title="Personal Information">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field
              label="Full Name"
              required
              value={form.fullName}
              onChange={(e) => change({ fullName: e.target.value }, "fullName")}
              placeholder="Your full name"
              autoComplete="name"
              error={errors.fullName}
            />
            <Field
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => change({ email: e.target.value }, "email")}
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email}
            />

            <div className="block">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="text-[12.5px] font-semibold text-slate-700">
                  Mobile <span className="text-red-500">*</span>
                </span>
                {phoneVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
                  >
                    <ShieldCheck className="h-3 w-3" />
                    Verify
                  </button>
                )}
              </div>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                value={form.phone}
                onChange={(e) => change({ phone: e.target.value }, "phone")}
                placeholder="98765 43210"
                aria-invalid={Boolean(errors.phone)}
                className={inputClass}
              />
              {errors.phone ? (
                <span className="mt-1 block text-[11.5px] font-medium text-red-600">
                  {errors.phone}
                </span>
              ) : null}
            </div>

            <SelectField
              label="Current Location"
              required
              value={form.currentLocation}
              onChange={(e) => change({ currentLocation: e.target.value }, "currentLocation")}
              error={errors.currentLocation}
            >
              <option value="" disabled>
                Select location
              </option>
              {LOCATION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectField>

            <div className="md:col-span-2">
              <RadioRow
                label="Willing to relocate?"
                name="relocate"
                value={form.relocate}
                options={RELOCATE_OPTIONS}
                onChange={(value) => change({ relocate: value })}
              />
            </div>
          </div>
        </FormCard>

        <FormCard icon={BriefcaseBusiness} title="Professional Details">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SelectField
              label="Total Experience"
              value={form.totalExperience}
              onChange={(e) => change({ totalExperience: e.target.value })}
            >
              <option value="" disabled>
                Select experience
              </option>
              {EXPERIENCE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectField>

            <Field
              label="Department"
              value={form.department || job.department || "General"}
              onChange={(e) => change({ department: e.target.value })}
              placeholder="Department"
            />

            <div className="md:col-span-2">
              <RadioRow
                label="Employment status"
                name="employmentStatus"
                value={form.employmentStatus}
                options={EMPLOYMENT_OPTIONS}
                onChange={(value) => change({ employmentStatus: value })}
              />
            </div>

            <SelectField
              label="Notice Period"
              value={form.noticePeriod}
              onChange={(e) => change({ noticePeriod: e.target.value })}
            >
              {NOTICE_PERIOD_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectField>

            <SelectField
              label="Expected CTC"
              value={form.expectedCTC}
              onChange={(e) => change({ expectedCTC: e.target.value })}
            >
              {EXPECTED_CTC_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </SelectField>
          </div>
        </FormCard>

        <FormCard icon={Sparkles} title="Tell Us More">
          <label className="block">
            <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">
              Why are you interested in this role?
            </span>
            <div className="relative">
              <textarea
                value={form.whyInterested}
                onChange={(e) => change({ whyInterested: e.target.value.slice(0, WHY_MAX) })}
                maxLength={WHY_MAX}
                rows={4}
                placeholder="Share what excites you about this opportunity…"
                className={`${inputClass} min-h-[110px] resize-none pr-16`}
              />
              <span className="pointer-events-none absolute bottom-2.5 right-3 text-[11.5px] tabular-nums text-slate-400">
                {form.whyInterested.length}/{WHY_MAX}
              </span>
            </div>
          </label>

          <label className="mt-4 flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => {
                setConfirmed(e.target.checked);
                if (e.target.checked) setErrors((prev) => ({ ...prev, confirmed: undefined }));
              }}
              className="mt-0.5 h-[17px] w-[17px] shrink-0 accent-emerald-600"
            />
            <span className="text-[13px] font-medium leading-snug text-slate-700">
              I confirm the information provided is accurate.
            </span>
          </label>
          {errors.confirmed ? (
            <p className="mt-1.5 flex items-center gap-1 text-[12px] font-medium text-red-600">
              <AlertCircle className="h-3.5 w-3.5" />
              {errors.confirmed}
            </p>
          ) : null}
        </FormCard>

        <div className="flex flex-col-reverse items-stretch gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <GhostButton type="button" onClick={() => router.push("/career/uploade_cv")}>
            Back
          </GhostButton>

          <div className="flex flex-col items-stretch gap-1.5 sm:items-end">
            <PrimaryButton type="button" onClick={handleContinue}>
              Review &amp; Continue
              <ArrowRight className="h-4 w-4" />
            </PrimaryButton>
            {!phoneVerified ? (
              <span className="flex items-center gap-1 text-[11.5px] font-medium text-slate-500 sm:justify-end">
                <Phone className="h-3.5 w-3.5" />
                Verify your mobile number to continue
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <PhoneVerifyModal
        isOpen={modalOpen}
        phoneOptions={phoneOptions}
        candidateName={analysis.candidateName}
        onVerified={(verifiedPhone) => {
          setCareerFlow({ verifiedPhone });
          updateCareerForm({ phone: verifiedPhone });
          setErrors((prev) => ({ ...prev, phone: undefined }));
          setModalOpen(false);
        }}
        onDismiss={() => setModalOpen(false)}
        onCloseAll={() => {
          clearCareerFlow();
          router.push("/career");
        }}
      />
    </PipelineShell>
  );
}
