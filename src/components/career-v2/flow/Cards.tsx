"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Briefcase,
  Check,
  Edit2,
  UploadCloud,
  Camera,
  type LucideIcon,
} from "lucide-react";

function LinkedinIcon({ size = 12, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
import { serif } from "@/components/career-v2/ui";
import defaultAvatar from "@/assets/career/flow/default-avatar.webp";
import type { CandidateProfile, PublicJob, CvFile } from "@/lib/careerApi";
import { jobLocation, jobType } from "@/lib/careers";

// -----------------------------------------------------------------------------
// 1. SectionCard (Standard Ensis Cream Card with Golden Circular Icon)
// -----------------------------------------------------------------------------

export function SectionCard({
  icon: Icon = Briefcase,
  title,
  actionButton,
  onEdit,
  children,
  className = "",
}: {
  icon?: LucideIcon;
  title: string;
  actionButton?: React.ReactNode;
  onEdit?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-[#eadfcd] bg-[#fffdf8] p-4 sm:p-5 shadow-[0_4px_20px_rgba(154,115,52,0.06)] ${className}`}
    >
      <div className="flex items-center justify-between pb-2.5 mb-3.5 border-b border-[#eadfcd]/70">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-full bg-[#f4ebd9] text-[#a8792c] border border-[#d9bf86]/40">
            <Icon size={15} strokeWidth={2} />
          </span>
          <h2 style={serif} className="text-lg font-semibold tracking-tight text-[#163a2b] sm:text-xl">
            {title}
          </h2>
        </div>
        {actionButton ||
          (onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8d6a3a] hover:text-[#163a2b] px-2.5 py-1 rounded-md hover:bg-[#f4ebd9]/50 transition-colors"
            >
              <Edit2 size={12} />
              <span>Edit</span>
            </button>
          ))}
      </div>
      <div>{children}</div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// 2. ProfileCard (Sidebar / Top Candidate Snapshot)
// -----------------------------------------------------------------------------

export function ProfileCard({
  profile,
  onEdit,
  showFullDetails = false,
  className = "",
}: {
  profile: CandidateProfile;
  onEdit?: () => void;
  showFullDetails?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-[#eadfcd] bg-[#fffdf8] p-4 sm:p-5 shadow-[0_2px_12px_rgba(154,115,52,0.05)] ${className}`}
    >
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#eadfcd]/60">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8d6a3a]">Your Profile</span>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#8d6a3a] hover:text-[#163a2b]"
          >
            <Edit2 size={12} />
            <span>Edit</span>
          </button>
        )}
      </div>

      <div className="flex items-start gap-3.5">
        <div
          onClick={onEdit}
          className={`relative size-14 shrink-0 overflow-hidden rounded-full border-2 border-[#d9bf86]/60 shadow-inner ${
            onEdit ? "cursor-pointer group hover:border-[#163a2b] transition-all" : ""
          }`}
          title={onEdit ? "Click to edit profile / change photo" : undefined}
        >
          <Image
            src={profile.photoUrl || defaultAvatar}
            alt={profile.fullName || "Candidate"}
            fill
            className="object-cover"
          />
          {onEdit && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <Camera size={14} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1 text-xs">
          <p className="font-semibold text-sm text-[#163a2b] truncate">{profile.fullName || "Candidate Profile"}</p>
          {profile.email && (
            <div className="flex items-center gap-1.5 text-[#5f5647] truncate">
              <Mail size={12} className="text-[#a8792c] shrink-0" />
              <span className="truncate">{profile.email}</span>
            </div>
          )}
          {profile.phone && (
            <div className="flex items-center gap-1.5 text-[#5f5647]">
              <Phone size={12} className="text-[#a8792c] shrink-0" />
              <span>{profile.phone}</span>
            </div>
          )}
          {profile.currentLocation && (
            <div className="flex items-center gap-1.5 text-[#5f5647]">
              <MapPin size={12} className="text-[#a8792c] shrink-0" />
              <span>{profile.currentLocation}</span>
            </div>
          )}
          {profile.linkedin && (
            <div className="flex items-center gap-1.5 text-[#5f5647] truncate">
              <LinkedinIcon size={12} className="text-[#a8792c] shrink-0" />
              <span className="truncate">{profile.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>
            </div>
          )}
        </div>
      </div>

      {showFullDetails && (
        <div className="mt-3 pt-3 border-t border-[#eadfcd]/60 grid grid-cols-2 gap-2 text-xs text-[#5f5647]">
          {profile.dateOfBirth && (
            <div className="flex items-center gap-1">
              <Calendar size={12} className="text-[#a8792c]" />
              <span>{profile.dateOfBirth}</span>
            </div>
          )}
          {profile.gender && (
            <div className="flex items-center gap-1">
              <User size={12} className="text-[#a8792c]" />
              <span>{profile.gender}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// 3. CvCard (Uploaded CV Status)
// -----------------------------------------------------------------------------

export function CvCard({
  cv,
  onUploadDifferent,
  className = "",
}: {
  cv: CvFile;
  onUploadDifferent?: () => void;
  className?: string;
}) {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 KB";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div
      className={`rounded-xl border border-[#eadfcd] bg-[#fffdf8] p-4 sm:p-5 shadow-[0_2px_12px_rgba(154,115,52,0.05)] ${className}`}
    >
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#eadfcd]/60">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8d6a3a]">Your CV</span>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#163a2b] bg-[#e8efe9] px-2 py-0.5 rounded-full border border-[#c2d7c5]">
          <Check size={11} strokeWidth={2.5} />
          CV Received
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-lg bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]">
          <FileText size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-xs text-[#163a2b] truncate">{cv.fileName || "Candidate_CV.pdf"}</p>
          <p className="text-[11px] text-[#8d6a3a]">{formatBytes(cv.size)}</p>
        </div>
      </div>

      {onUploadDifferent && (
        <div className="mt-3 pt-3 border-t border-[#eadfcd]/60">
          <button
            type="button"
            onClick={onUploadDifferent}
            className="w-full text-center text-xs font-semibold text-[#8d6a3a] hover:text-[#163a2b] transition-colors flex items-center justify-center gap-1.5 py-1"
          >
            <UploadCloud size={13} />
            <span>Upload Different CV</span>
          </button>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// 4. JobSummaryCard (Position Snapshot)
// -----------------------------------------------------------------------------

export function JobSummaryCard({
  job,
  onEdit,
  className = "",
}: {
  job: PublicJob;
  onEdit?: () => void;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-[#eadfcd] bg-[#fffdf8] p-4 sm:p-5 shadow-[0_2px_12px_rgba(154,115,52,0.05)] ${className}`}
    >
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#eadfcd]/60">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8d6a3a]">Position Applied For</span>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#8d6a3a] hover:text-[#163a2b]"
          >
            <Edit2 size={12} />
            <span>Edit</span>
          </button>
        )}
      </div>

      <div className="space-y-1.5">
        <h3 style={serif} className="text-lg font-semibold text-[#163a2b] leading-tight">
          {job.title}
        </h3>
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#6b6255]">
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} className="text-[#a8792c]" />
            {jobLocation(job)}
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            <Briefcase size={12} className="text-[#a8792c]" />
            {jobType(job)}
          </span>
        </div>
        {job.educationRequirements && (
          <p className="text-[11px] text-[#8d6a3a] pt-1">
            <span className="font-semibold text-[#5f5647]">Education:</span> {job.educationRequirements}
          </p>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 5. CheckList & NumberedList
// -----------------------------------------------------------------------------

export function CheckList({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-2.5 ${className}`}>
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4b4336] leading-relaxed">
          <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-[#163a2b] text-white">
            <Check size={11} strokeWidth={2.5} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function NumberedList({
  items,
  variant = "gold",
  className = "",
}: {
  items: string[];
  variant?: "gold" | "red" | "amber";
  className?: string;
}) {
  const bg =
    variant === "red"
      ? "bg-[#fee2e2] text-[#991b1b]"
      : variant === "amber"
      ? "bg-[#fef3c7] text-[#92400e]"
      : "bg-[#f4ebd9] text-[#8d6a3a]";

  return (
    <ol className={`space-y-2.5 ${className}`}>
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4b4336] leading-relaxed">
          <span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-xs font-semibold ${bg}`}>
            {idx + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}
