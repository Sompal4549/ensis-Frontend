"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  FileText,
  Users,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Check,
  X,
  Plus,
} from "lucide-react";
import { serif, greenButton, goldOutlineButton, Eyebrow } from "@/components/career-v2/ui";
import { FlowHero } from "@/components/career-v2/flow/FlowHero";
import { Container } from "@/components/ui/Container";
import { Stepper, APPLICATION_FLOW_STEPS } from "@/components/career-v2/flow/Stepper";
import { MatchRing } from "@/components/career-v2/flow/MatchRing";
import { ProfileCard, JobSummaryCard, SectionCard } from "@/components/career-v2/flow/Cards";
import {
  submitApplication,
  type PublicJob,
  type Screening,
  type CandidateProfile,
  type ApplicationInput,
} from "@/lib/careerApi";
import {
  loadFlowState,
  saveFlowState,
  getCvFile,
  recordSubmittedApplication,
  findExistingSubmission,
  type SubmittedAppRecord,
  type FlowDetailsState,
  type FlowAdditionalState,
  type FlowReferenceItem,
  type FlowConsentsState,
} from "@/lib/careerFlowV2";
import { jobLocation, jobType } from "@/lib/careers";

const AVAILABLE_LOCATIONS = [
  "Delhi NCR",
  "Bengaluru",
  "Mumbai",
  "Hyderabad",
  "Pune",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
];

const SKILL_CHECKBOXES = [
  "Furniture Design",
  "3D Modeling",
  "Space Planning",
  "Product Visualization",
  "Research & Publication",
  "Retail / Hospitality Design",
  "Sustainable Design",
];

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "";

  const [job, setJob] = useState<PublicJob | null>(null);
  const [screening, setScreening] = useState<Screening | null>(null);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);

  // Form State
  const [details, setDetails] = useState<FlowDetailsState>({
    preferredLocations: ["Delhi NCR", "Bengaluru"],
    noticePeriod: "30 Days",
    expectedCtc: "As per company norms",
    joiningPreference: "Within 1 Month",
    howDidYouHear: "Careers Portal",
    willingToRelocate: true,
    employmentType: "Full Time",
  });

  const [additional, setAdditional] = useState<FlowAdditionalState>({
    whyJoin:
      "I am passionate about designing wellness furniture and creating healthier spaces for people. I want to be a part of ENSIS's mission of enhancing well-being through innovative designs.",
    extraSkills: "Product design, 3D modeling, visualization, material exploration, user research.",
    workedWith: ["Furniture Design", "3D Modeling", "Space Planning"],
  });

  const [references, setReferences] = useState<FlowReferenceItem[]>([
    {
      name: "Dr. Ramesh Gupta",
      designation: "Design Director",
      organization: "Wellness Design Studio",
      phone: "+91 98100 12345",
      email: "ramesh.gupta@mail.com",
    },
    {
      name: "Ms. Neha Singh",
      designation: "Senior Product Designer",
      organization: "Infinity Furniture",
      phone: "+91 98765 43210",
      email: "neha.singh@mail.com",
    },
  ]);

  const [consents, setConsents] = useState<FlowConsentsState>({
    accurate: true,
    verify: true,
    futureContact: true,
    privacy: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [existingSubmission, setExistingSubmission] = useState<SubmittedAppRecord | null>(null);

  useEffect(() => {
    if (!slug) return;
    const state = loadFlowState(slug);
    if (!state || !state.screening?.result) {
      router.replace(`/career/${encodeURIComponent(slug)}`);
      return;
    }

    setJob(state.job);
    setScreening(state.screening);
    const prof = state.profile || state.screening.result.profile;
    setProfile(prof);

    if (state.details) setDetails((prev) => ({ ...prev, ...state.details }));
    if (state.additional) setAdditional((prev) => ({ ...prev, ...state.additional }));
    if (state.references && state.references.length > 0) setReferences(state.references);
    if (state.consents) setConsents((prev) => ({ ...prev, ...state.consents }));

    // Check if candidate already submitted for this job
    const existing = findExistingSubmission(slug, prof?.email, prof?.phone);
    if (existing) {
      setExistingSubmission(existing);
      setErrorMessage(
        `You have already submitted an application for this position on ${new Date(existing.submittedAt).toLocaleDateString()} (Application ID: ${existing.applicationId}). Multiple applications within 30 days are not permitted.`
      );
    }
  }, [slug, router]);

  if (!job || !screening?.result || !profile) {
    return (
      <div className="min-h-[60vh] grid place-items-center bg-[#fbf8f2]">
        <div className="size-10 rounded-full border-3 border-[#a8792c] border-t-transparent animate-spin" />
      </div>
    );
  }

  // Guard: not_eligible candidates cannot submit application
  if (screening.result.level === "not_eligible") {
    return (
      <div className="min-h-screen bg-[#fbf8f2] flex items-center justify-center p-6">
        <div className="max-w-md bg-[#fffdf8] border border-[#eadfcd] rounded-2xl p-6 text-center space-y-4">
          <span className="grid size-12 place-items-center rounded-full bg-[#fee2e2] text-[#dc2626] mx-auto">
            <AlertCircle size={24} />
          </span>
          <h2 style={serif} className="text-xl font-bold text-[#163a2b]">Application Restricted</h2>
          <p className="text-xs text-[#5f5647]">
            Candidate profiles evaluated as not eligible cannot submit this specific role application.
          </p>
          <Link href="/career" className={`${greenButton} w-full py-2.5 text-xs`}>
            Explore Other Roles
          </Link>
        </div>
      </div>
    );
  }

  const handleToggleLocation = (loc: string) => {
    if (details.preferredLocations.includes(loc)) {
      if (details.preferredLocations.length === 1) return; // keep at least one
      setDetails({
        ...details,
        preferredLocations: details.preferredLocations.filter((l) => l !== loc),
      });
    } else {
      setDetails({
        ...details,
        preferredLocations: [...details.preferredLocations, loc],
      });
    }
  };

  const handleToggleWorkedWith = (skill: string) => {
    if (additional.workedWith.includes(skill)) {
      setAdditional({
        ...additional,
        workedWith: additional.workedWith.filter((s) => s !== skill),
      });
    } else {
      setAdditional({
        ...additional,
        workedWith: [...additional.workedWith, skill],
      });
    }
  };

  const handleSubmit = async () => {
    setErrorMessage(null);

    // Consents check
    if (!consents.accurate || !consents.verify || !consents.privacy) {
      setErrorMessage("Please accept the mandatory declarations and privacy policy.");
      return;
    }

    if (existingSubmission) {
      setErrorMessage(
        `You have already submitted an application for this role (Application ID: ${existingSubmission.applicationId}). Multiple submissions are not accepted within 30 days.`
      );
      return;
    }

    if (!additional.whyJoin.trim()) {
      setErrorMessage("Please briefly tell us why you want to join ENSIS.");
      return;
    }

    setIsSubmitting(true);

    try {
      const state = loadFlowState(slug);
      const docs = state?.documents || [];

      const applicationInput: ApplicationInput = {
        screeningId: screening.screeningId,
        jobId: job._id || slug,
        profile,
        details,
        additional,
        references,
        documents: docs.map((d) => ({ fileId: d.fileId, label: d.label })),
        consents,
        screeningResult: screening.result,
        screeningCvName: screening.cv?.fileName,
      };

      const cvFile = getCvFile();
      const response = await submitApplication(applicationInput, cvFile);

      // Record in local persistent storage to prevent future duplicates
      recordSubmittedApplication({
        applicationId: response.applicationId,
        jobId: slug || job._id,
        jobTitle: job.title,
        email: profile.email,
        phone: profile.phone,
        submittedAt: response.submittedAt,
      });

      // Save submission result into flow state
      saveFlowState({
        job,
        profile,
        details,
        additional,
        references,
        consents,
        submission: response,
        updatedAt: new Date().toISOString(),
      });

      router.push(`/career/${encodeURIComponent(slug)}/submitted`);
    } catch (err: any) {
      console.error("Application submission error:", err);
      const msg = err.message || "Unable to submit application at this time. Please verify your details and try again.";
      setErrorMessage(msg);
      setIsSubmitting(false);

      if (msg.toLowerCase().includes("already submitted") || msg.toLowerCase().includes("duplicate")) {
        const idMatch = msg.match(/ENS-CAR-[0-9]{4}-[0-9]+/i);
        setExistingSubmission({
          applicationId: idMatch ? idMatch[0] : "ENS-CAR",
          jobId: slug,
          jobTitle: job.title,
          email: profile.email,
          phone: profile.phone,
          submittedAt: new Date().toISOString(),
        });
      }
    }
  };

  const result = screening.result;

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#3f3a33]">
      <FlowHero
        breadcrumbs={[
          { label: "Careers", href: "/career" },
          { label: job.title, href: `/career/${encodeURIComponent(slug)}` },
          { label: "Complete Application" },
        ]}
        backHref={`/career/${encodeURIComponent(slug)}/review`}
        backLabel="← Back to Review Details"
        eyebrow="CAREERS AT ENSIS"
        title="Complete Your"
        highlight="Application"
        subtitle="You're almost there! Please review and confirm your details to submit your application."
      />

      <Stepper currentStep={4} steps={APPLICATION_FLOW_STEPS} />

      <Container className="py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Main Left Content: 3 Form Sections */}
          <div className="lg:col-span-8 space-y-7">
            {errorMessage && (
              <div className="flex items-start gap-2.5 rounded-xl border border-[#fecaca] bg-[#fef2f2] p-4 text-xs sm:text-sm text-[#991b1b]">
                <AlertCircle size={18} className="shrink-0 mt-0.5 text-[#dc2626]" />
                <span className="font-semibold">{errorMessage}</span>
              </div>
            )}

            {/* 1. Application Details */}
            <SectionCard icon={Briefcase} title="Application Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-[#163a2b] block mb-1">Position Applied For *</label>
                  <input
                    type="text"
                    disabled
                    value={job.title}
                    className="w-full rounded-md border border-[#eadfcd] bg-stone-100 p-2.5 text-xs text-[#163a2b] font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#163a2b] block mb-1">Preferred Location(s) *</label>
                  <div className="flex flex-wrap gap-1.5 p-2 rounded-md border border-[#eadfcd] bg-white min-h-[42px] items-center">
                    {details.preferredLocations.map((loc) => (
                      <span
                        key={loc}
                        className="inline-flex items-center gap-1 rounded bg-[#e8efe9] px-2 py-0.5 text-[11px] font-semibold text-[#163a2b]"
                      >
                        {loc}
                        <button
                          type="button"
                          onClick={() => handleToggleLocation(loc)}
                          className="hover:text-[#dc2626]"
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                    {AVAILABLE_LOCATIONS.filter((l) => !details.preferredLocations.includes(l)).length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) handleToggleLocation(e.target.value);
                          e.target.value = "";
                        }}
                        className="text-[11px] text-[#8d6a3a] border-none bg-transparent focus:outline-none cursor-pointer"
                      >
                        <option value="">+ Add location</option>
                        {AVAILABLE_LOCATIONS.filter((l) => !details.preferredLocations.includes(l)).map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-[#163a2b] block mb-1">Notice Period *</label>
                  <select
                    value={details.noticePeriod}
                    onChange={(e) => setDetails({ ...details, noticePeriod: e.target.value })}
                    className="w-full rounded-md border border-[#eadfcd] bg-white p-2.5 text-xs text-[#163a2b] focus:border-[#163a2b] focus:outline-none"
                  >
                    <option value="Immediate">Immediate</option>
                    <option value="15 Days">15 Days</option>
                    <option value="30 Days">30 Days</option>
                    <option value="60 Days">60 Days</option>
                    <option value="90 Days">90 Days</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#163a2b] block mb-1">Expected Salary (CTC) *</label>
                  <input
                    type="text"
                    value={details.expectedCtc}
                    onChange={(e) => setDetails({ ...details, expectedCtc: e.target.value })}
                    placeholder="e.g. As per company norms / 12 LPA"
                    className="w-full rounded-md border border-[#eadfcd] bg-white p-2.5 text-xs text-[#163a2b] focus:border-[#163a2b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#163a2b] block mb-1">Joining Preference *</label>
                  <select
                    value={details.joiningPreference}
                    onChange={(e) => setDetails({ ...details, joiningPreference: e.target.value })}
                    className="w-full rounded-md border border-[#eadfcd] bg-white p-2.5 text-xs text-[#163a2b] focus:border-[#163a2b] focus:outline-none"
                  >
                    <option value="Immediately">Immediately</option>
                    <option value="Within 15 Days">Within 15 Days</option>
                    <option value="Within 1 Month">Within 1 Month</option>
                    <option value="More than 1 Month">More than 1 Month</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#163a2b] block mb-1">Employment Type</label>
                  <input
                    type="text"
                    disabled
                    value={jobType(job)}
                    className="w-full rounded-md border border-[#eadfcd] bg-stone-100 p-2.5 text-xs text-[#163a2b]"
                  />
                </div>
              </div>
            </SectionCard>

            {/* 2. Additional Information */}
            <SectionCard icon={FileText} title="Additional Information">
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-[#163a2b]">Why do you want to join ENSIS? *</label>
                    <span className="text-[10px] text-[#8d6a3a]">
                      {500 - additional.whyJoin.length} characters left
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={500}
                    value={additional.whyJoin}
                    onChange={(e) => setAdditional({ ...additional, whyJoin: e.target.value })}
                    className="w-full rounded-md border border-[#eadfcd] bg-white p-2.5 text-xs text-[#163a2b] leading-relaxed focus:border-[#163a2b] focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-[#163a2b]">Any additional skills or expertise?</label>
                    <span className="text-[10px] text-[#8d6a3a]">
                      {300 - (additional.extraSkills?.length || 0)} characters left
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    maxLength={300}
                    value={additional.extraSkills || ""}
                    onChange={(e) => setAdditional({ ...additional, extraSkills: e.target.value })}
                    className="w-full rounded-md border border-[#eadfcd] bg-white p-2.5 text-xs text-[#163a2b] leading-relaxed focus:border-[#163a2b] focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <label className="font-semibold text-[#163a2b] block mb-2">
                    Have you worked with any of these? (Optional)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {SKILL_CHECKBOXES.map((skill) => {
                      const checked = additional.workedWith.includes(skill);
                      return (
                        <label
                          key={skill}
                          className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                            checked
                              ? "border-[#163a2b] bg-[#e8efe9]/60 font-semibold text-[#163a2b]"
                              : "border-[#eadfcd] bg-[#fffdf8] text-[#5f5647] hover:bg-[#fbf6ec]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggleWorkedWith(skill)}
                            className="size-3.5 accent-[#163a2b] rounded"
                          />
                          <span className="truncate">{skill}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* 3. References (Optional) */}
            <SectionCard icon={Users} title="References (Optional)">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {references.map((ref, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#eadfcd]/80 bg-[#fbf6ec]/30 p-4 space-y-2.5"
                  >
                    <span className="text-xs font-bold text-[#8d6a3a] block uppercase tracking-wider">
                      Reference {idx + 1}
                    </span>
                    <div>
                      <label className="text-[11px] text-[#6b6255] block">Full Name</label>
                      <input
                        type="text"
                        value={ref.name}
                        onChange={(e) => {
                          const copy = [...references];
                          copy[idx].name = e.target.value;
                          setReferences(copy);
                        }}
                        className="w-full rounded border border-[#eadfcd] p-1.5 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#6b6255] block">Designation</label>
                      <input
                        type="text"
                        value={ref.designation}
                        onChange={(e) => {
                          const copy = [...references];
                          copy[idx].designation = e.target.value;
                          setReferences(copy);
                        }}
                        className="w-full rounded border border-[#eadfcd] p-1.5 text-xs bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#6b6255] block">Organization</label>
                      <input
                        type="text"
                        value={ref.organization}
                        onChange={(e) => {
                          const copy = [...references];
                          copy[idx].organization = e.target.value;
                          setReferences(copy);
                        }}
                        className="w-full rounded border border-[#eadfcd] p-1.5 text-xs bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-[#6b6255] block">Contact Number</label>
                        <input
                          type="tel"
                          value={ref.phone}
                          onChange={(e) => {
                            const copy = [...references];
                            copy[idx].phone = e.target.value;
                            setReferences(copy);
                          }}
                          className="w-full rounded border border-[#eadfcd] p-1.5 text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#6b6255] block">Email Address</label>
                        <input
                          type="email"
                          value={ref.email}
                          onChange={(e) => {
                            const copy = [...references];
                            copy[idx].email = e.target.value;
                            setReferences(copy);
                          }}
                          className="w-full rounded border border-[#eadfcd] p-1.5 text-xs bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Right Sidebar: Profile Snapshot, Position, Match, Consents, Submit */}
          <div className="lg:col-span-4 space-y-6">
            <ProfileCard
              profile={profile}
              onEdit={() => router.push(`/career/${encodeURIComponent(slug)}/review`)}
            />

            <JobSummaryCard
              job={job}
              onEdit={() => router.push(`/career/${encodeURIComponent(slug)}/review`)}
            />

            {/* Profile Match Donut */}
            <div className="rounded-xl border border-[#eadfcd] bg-[#fffdf8] p-5 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8d6a3a] block mb-3">
                Profile Match
              </span>
              <MatchRing
                score={result.score}
                level={result.level}
                size="md"
                showLabel={true}
              />
            </div>

            {/* Before You Submit: Consents Card */}
            <div className="rounded-xl border border-[#eadfcd] bg-[#fffdf8] p-5 shadow-xs space-y-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#163a2b] block">
                Before You Submit
              </span>

              <div className="space-y-3 text-xs text-[#4b4336]">
                <label className="flex items-start gap-2.5 cursor-pointer leading-tight">
                  <input
                    type="checkbox"
                    checked={consents.accurate}
                    onChange={(e) => setConsents({ ...consents, accurate: e.target.checked })}
                    className="size-4 mt-0.5 accent-[#163a2b] shrink-0 rounded"
                  />
                  <span>I confirm that all the information provided is correct and complete. *</span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer leading-tight">
                  <input
                    type="checkbox"
                    checked={consents.verify}
                    onChange={(e) => setConsents({ ...consents, verify: e.target.checked })}
                    className="size-4 mt-0.5 accent-[#163a2b] shrink-0 rounded"
                  />
                  <span>I authorize ENSIS to verify my information if required. *</span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer leading-tight">
                  <input
                    type="checkbox"
                    checked={consents.futureContact}
                    onChange={(e) => setConsents({ ...consents, futureContact: e.target.checked })}
                    className="size-4 mt-0.5 accent-[#163a2b] shrink-0 rounded"
                  />
                  <span>I agree to be contacted for future opportunities.</span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer leading-tight">
                  <input
                    type="checkbox"
                    checked={consents.privacy}
                    onChange={(e) => setConsents({ ...consents, privacy: e.target.checked })}
                    className="size-4 mt-0.5 accent-[#163a2b] shrink-0 rounded"
                  />
                  <span>
                    I have read and agree to the{" "}
                    <Link href="/privacy-policy" target="_blank" className="text-[#a8792c] underline">
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link href="/terms-and-conditions" target="_blank" className="text-[#a8792c] underline">
                      Terms & Conditions
                    </Link>
                    . *
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-2.5">
                <button
                  type="button"
                  disabled={isSubmitting || Boolean(existingSubmission)}
                  onClick={handleSubmit}
                  className={`w-full ${greenButton} justify-center py-3 text-sm font-bold shadow-md ${
                    isSubmitting || Boolean(existingSubmission) ? "opacity-75 cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  {existingSubmission ? (
                    "Already Applied"
                  ) : isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Submitting Application...
                    </span>
                  ) : (
                    <>
                      Submit Application <ArrowRight size={16} />
                    </>
                  )}
                </button>

                {existingSubmission ? (
                  <Link
                    href={`/career/${encodeURIComponent(slug)}/submitted`}
                    className={`w-full ${goldOutlineButton} justify-center py-2.5 text-xs font-semibold`}
                  >
                    View Existing Submission ({existingSubmission.applicationId})
                  </Link>
                ) : (
                  <Link
                    href={`/career/${encodeURIComponent(slug)}/review`}
                    className={`w-full ${goldOutlineButton} justify-center py-2.5 text-xs font-semibold`}
                  >
                    <ArrowLeft size={14} /> Back to Review Details
                  </Link>
                )}
              </div>

              {/* Security note */}
              <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-[#8d6a3a]">
                <ShieldCheck size={13} className="text-[#a8792c]" />
                <span>Your data is secure and will only be used for recruitment purposes.</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
