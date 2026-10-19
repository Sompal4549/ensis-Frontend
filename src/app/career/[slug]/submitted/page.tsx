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
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Leaf,
  BarChart3,
  HeartHandshake,
} from "lucide-react";
import { serif, greenButton, goldOutlineButton, Eyebrow, CareerIcon } from "@/components/career-v2/ui";
import { FlowHero } from "@/components/career-v2/flow/FlowHero";
import { Container } from "@/components/ui/Container";
import { Stepper, APPLICATION_FLOW_STEPS } from "@/components/career-v2/flow/Stepper";
import { MatchRing } from "@/components/career-v2/flow/MatchRing";
import { ProfileCard, JobSummaryCard } from "@/components/career-v2/flow/Cards";
import {
  getCareerSettings,
  type PublicJob,
  type Screening,
  type CandidateProfile,
  type ApplicationSubmitResponse,
  type CareerSettingsData,
} from "@/lib/careerApi";
import { loadFlowState } from "@/lib/careerFlowV2";
import podiumCheckImg from "@/assets/career/flow/podium-check.webp";
import { jobLocation, jobType } from "@/lib/careers";

export default function SubmittedPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "";

  const [job, setJob] = useState<PublicJob | null>(null);
  const [screening, setScreening] = useState<Screening | null>(null);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [submission, setSubmission] = useState<ApplicationSubmitResponse | null>(null);
  const [settings, setSettings] = useState<CareerSettingsData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const state = loadFlowState(slug);

    if (state?.job) setJob(state.job);
    if (state?.screening) setScreening(state.screening);
    if (state?.profile) setProfile(state.profile);
    if (state?.submission) setSubmission(state.submission);

    getCareerSettings().then((s) => setSettings(s));
  }, [slug]);

  const applicationId = submission?.applicationId || "ENS-CAR-2026-00187";
  const firstName = profile?.fullName?.split(" ")[0] || "Vijay";
  const email = profile?.email || "candidate@example.com";
  const jobTitle = job?.title || "Product Designer";

  const handleCopyId = () => {
    navigator.clipboard.writeText(applicationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hrContact = settings?.hrContact || {
    email: "hr@ensis.in",
    phone: "+91 98765 43210",
    address: "ENSIS Corporate Office, Delhi NCR",
  };

  return (
    <div className="min-h-screen bg-[#fbf8f2] text-[#3f3a33]">
      <FlowHero
        backHref="/career"
        backLabel="← Explore Openings"
        eyebrow="CAREERS AT ENSIS"
        title="Application"
        highlight="Submitted"
        subtitle="Thank you! Your application has been submitted successfully."
      />

      {/* Stepper with all 4 steps marked completed */}
      <Stepper currentStep={5} steps={APPLICATION_FLOW_STEPS} />

      <Container className="py-5 sm:py-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* Main Left Content */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-5">
            {/* 1. Success Hero Banner Card */}
            <div className="rounded-2xl border border-[#eadfcd] bg-[#fffdf8] p-4 sm:p-5.5 shadow-[0_6px_30px_rgba(154,115,52,0.08)]">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 items-center">
                {/* Left Illustration / Emblem */}
                <div className="sm:col-span-4 flex items-center justify-center">
                  <div className="relative size-28 sm:size-36 overflow-hidden rounded-2xl bg-gradient-to-b from-[#f4ebd9]/40 to-[#fffdf8] p-2 flex items-center justify-center">
                    <Image
                      src={podiumCheckImg}
                      alt="Application Success"
                      width={130}
                      height={130}
                      className="object-contain drop-shadow-md"
                    />
                  </div>
                </div>

                {/* Right Congratulatory Content */}
                <div className="sm:col-span-8 space-y-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e8efe9] text-[#163a2b] border border-[#c2d7c5]">
                    <CheckCircle2 size={13} className="text-[#163a2b]" />
                    Application Submitted Successfully
                  </span>

                  <h2 style={serif} className="text-2xl sm:text-3xl font-bold text-[#163a2b]">
                    Thank You, <span className="text-[#a8792c]">{firstName}!</span>
                  </h2>

                  <p className="text-xs sm:text-sm text-[#5f5647] leading-relaxed">
                    Your application for <strong className="text-[#163a2b]">{jobTitle}</strong> has been submitted successfully. Our talent acquisition team will review your profile and AI analysis report and get back to you soon.
                  </p>

                  {/* Summary Metric Blocks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="rounded-xl border border-[#eadfcd] bg-[#fbf6ec]/60 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-[#8d6a3a] uppercase tracking-wider">
                          Application ID
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyId}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#163a2b] hover:text-[#a8792c]"
                        >
                          {copied ? (
                            <>
                              <Check size={11} className="text-[#163a2b]" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={11} /> Copy
                            </>
                          )}
                        </button>
                      </div>
                      <p className="font-mono font-bold text-sm text-[#163a2b] mt-0.5">{applicationId}</p>
                      <span className="text-[10px] text-[#8d6a3a]">Please keep this ID for reference.</span>
                    </div>

                    <div className="rounded-xl border border-[#eadfcd] bg-[#fbf6ec]/60 p-3">
                      <span className="text-[11px] font-semibold text-[#8d6a3a] uppercase tracking-wider block">
                        Submitted On
                      </span>
                      <p className="font-bold text-xs text-[#163a2b] mt-0.5">
                        {new Date().toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <span className="text-[10px] text-[#8d6a3a] truncate block">
                        Confirmation email sent to {email}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. What Happens Next? Process Timeline */}
            <div className="rounded-2xl border border-[#eadfcd] bg-[#fffdf8] p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h3 style={serif} className="text-xl sm:text-2xl font-bold text-[#163a2b]">
                  What Happens Next?
                </h3>
                <p className="text-xs text-[#6b6255] mt-0.5">
                  Here is what you can expect after submitting your application:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    step: 1,
                    icon: FileText,
                    title: "Application Review",
                    desc: "Our recruitment team will review your application, qualifications and AI screening report.",
                    duration: "1 – 3 Working Days",
                  },
                  {
                    step: 2,
                    icon: Users,
                    title: "Shortlisting",
                    desc: "Candidates whose profiles align with the requirements may be shortlisted for further evaluation.",
                    duration: "3 – 5 Working Days",
                  },
                  {
                    step: 3,
                    icon: Calendar,
                    title: "Interview Process",
                    desc: "If shortlisted, you will be contacted via email or phone for initial interview scheduling.",
                    duration: "5 – 10 Working Days",
                  },
                  {
                    step: 4,
                    icon: Mail,
                    title: "Final Update",
                    desc: "You will receive the final communication and status update of your application by email.",
                    duration: "Within 2 Weeks",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.step}
                      className="rounded-xl border border-[#eadfcd] bg-[#fbf6ec]/30 p-4 space-y-2.5 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <span className="grid size-8 place-items-center rounded-lg bg-[#f4ebd9] text-[#a8792c]">
                          <Icon size={16} />
                        </span>
                        <p className="font-bold text-xs sm:text-sm text-[#163a2b]">{item.title}</p>
                        <p className="text-[11px] text-[#5f5647] leading-relaxed">{item.desc}</p>
                      </div>
                      <span className="inline-block text-[10px] font-bold text-[#8d6a3a] bg-[#f4ebd9] px-2.5 py-1 rounded-full self-start">
                        {item.duration}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Be Part of a Healthier, More Inspired Tomorrow Band */}
            <div className="rounded-2xl border border-[#eadfcd] bg-[#fffdf8] p-6 sm:p-8 shadow-xs space-y-4">
              <div className="max-w-xl">
                <h3 style={serif} className="text-xl sm:text-2xl font-bold text-[#163a2b]">
                  Be Part of a Healthier, More Inspired Tomorrow.
                </h3>
                <p className="text-xs sm:text-sm text-[#5f5647] mt-1 leading-relaxed">
                  Join ENSIS and help us create wellness spaces and restorative furniture for people around the world.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { icon: "leaf" as const, title: "Innovative Design" },
                  { icon: "users" as const, title: "Collaborative Team" },
                  { icon: "growth" as const, title: "Growth Opportunities" },
                  { icon: "heart" as const, title: "Positive Impact" },
                ].map((p, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-[#eadfcd]/60 bg-[#fbf6ec]/40 p-3.5 text-center flex flex-col items-center gap-1.5"
                  >
                    <CareerIcon name={p.icon} size="sm" />
                    <span className="text-xs font-semibold text-[#163a2b]">{p.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {profile && <ProfileCard profile={profile} />}

            {job && <JobSummaryCard job={job} />}

            {/* Profile Match Donut */}
            {screening?.result && (
              <div className="rounded-xl border border-[#eadfcd] bg-[#fffdf8] p-5 shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8d6a3a] block mb-3">
                  Profile Match
                </span>
                <MatchRing
                  score={screening.result.score}
                  level={screening.result.level}
                  size="md"
                  showLabel={true}
                />
              </div>
            )}

            {/* Keep Exploring Opportunities Card */}
            <div className="rounded-xl border border-[#eadfcd] bg-[#fffdf8] p-5 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8d6a3a] block">
                Keep Exploring Opportunities
              </span>
              <p className="text-xs text-[#5f5647] leading-relaxed">
                Would you like to explore other suitable opportunities? We frequently update openings across design, manufacturing, and wellness solutions.
              </p>
              <Link
                href="/career"
                className={`w-full ${goldOutlineButton} justify-center py-2.5 text-xs font-bold`}
              >
                View Other Opportunities <ArrowRight size={14} />
              </Link>
            </div>

            {/* Need Help? Contact HR Card */}
            <div className="rounded-xl border border-[#eadfcd] bg-[#fffdf8] p-5 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#163a2b] block">
                Need Help?
              </span>
              <p className="text-xs text-[#5f5647] leading-relaxed">
                If you have any questions regarding your application or recruitment timeline, feel free to reach out to our team.
              </p>
              <div className="space-y-2 pt-1 text-xs text-[#4b4336]">
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-[#a8792c]" />
                  <a href={`mailto:${hrContact.email}`} className="text-[#163a2b] hover:underline font-medium">
                    {hrContact.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-[#a8792c]" />
                  <span>{hrContact.phone} (Mon – Fri, 10 AM – 6 PM)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-[#a8792c]" />
                  <span>{hrContact.address}</span>
                </div>
              </div>
              <div className="pt-2">
                <a
                  href={`mailto:${hrContact.email}?subject=Application Inquiry: ${applicationId}`}
                  className={`w-full ${greenButton} justify-center py-2.5 text-xs font-bold`}
                >
                  Contact HR Team
                </a>
              </div>
            </div>

            {/* Privacy note */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#8d6a3a]">
              <ShieldCheck size={13} className="text-[#a8792c]" />
              <span>Your data is secure and will only be used for recruitment purposes.</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
