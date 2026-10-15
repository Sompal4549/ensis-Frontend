"use client";

import React from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { MATCH_THEME, PIPELINE_STEPS, matchLevel, type MatchLevel } from "@/lib/careerFlow";

/* ── Shell ────────────────────────────────────────────────────────────────── */

export function PipelineShell({
  current,
  badge,
  children,
  sidebar,
}: {
  current: number;
  badge?: string;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="relative min-h-[calc(100vh-5.5rem)] bg-slate-50">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(900px 320px at 12% -5%, rgba(5,150,105,0.10), transparent 60%), radial-gradient(900px 340px at 88% 0%, rgba(37,99,235,0.10), transparent 60%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 py-6 md:px-8 md:py-10">
        {/* Brand header */}
        <div className="mb-5 flex items-center justify-between gap-4">
          <a href="/career" className="group flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-sm font-semibold tracking-[0.14em] text-white transition group-hover:bg-emerald-600">
              EN
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-semibold tracking-[0.18em] text-slate-900">
                ENSIS
              </span>
              <span className="block text-[11px] uppercase tracking-[0.22em] text-slate-500">
                AI Career Portal
              </span>
            </span>
          </a>

          <div className="flex items-center gap-3">
            {badge ? (
              <span className="hidden rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700 sm:inline-block">
                {badge}
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => router.push("/career")}
              aria-label="Close and go back to careers"
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_-30px_rgba(15,23,42,0.35)]">
          <ProgressSteps current={current} />

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0 px-5 py-6 md:px-8 md:py-8">{children}</div>
            <aside className="border-t border-slate-200 bg-slate-50/80 px-5 py-6 md:px-6 lg:border-l lg:border-t-0">
              <div className="space-y-4 lg:sticky lg:top-6">{sidebar}</div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Progress steps ───────────────────────────────────────────────────────── */

export function ProgressSteps({ current }: { current: number }) {
  return (
    <div className="border-b border-slate-200 bg-white px-5 py-4 md:px-8">
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {PIPELINE_STEPS.map((step, index) => {
          const position = index + 1;
          const done = position < current;
          const active = position === current;
          return (
            <li key={step} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span
                  className={[
                    "grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold transition",
                    done
                      ? "bg-emerald-500 text-white"
                      : active
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "border border-slate-300 bg-white text-slate-400",
                  ].join(" ")}
                >
                  {done ? "✓" : position}
                </span>
                <span
                  className={[
                    "text-[12px] font-semibold uppercase tracking-[0.1em] md:text-[13px]",
                    active
                      ? "text-blue-700"
                      : done
                        ? "text-emerald-700"
                        : "text-slate-400",
                  ].join(" ")}
                >
                  {step}
                </span>
              </div>
              {position < PIPELINE_STEPS.length ? (
                <span
                  aria-hidden
                  className={[
                    "hidden h-px w-6 sm:block",
                    position < current ? "bg-emerald-300" : "bg-slate-200",
                  ].join(" ")}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ── Score ring ───────────────────────────────────────────────────────────── */

export function ScoreRing({
  score,
  size = 148,
  caption,
}: {
  score: number;
  size?: number;
  caption?: string;
}) {
  const safe = Math.max(0, Math.min(100, Math.round(score || 0)));
  const level: MatchLevel = matchLevel(safe);
  const theme = MATCH_THEME[level];
  const degrees = safe * 3.6;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative grid place-items-center rounded-full"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(${theme.hex} ${degrees}deg, ${theme.ringTrack} ${degrees}deg 360deg)`,
        }}
      >
        <div
          className="absolute grid place-items-center rounded-full bg-white"
          style={{ width: size - 22, height: size - 22 }}
        >
          <span
            className="font-semibold leading-none text-slate-900"
            style={{ fontSize: Math.round(size / 3.6) }}
          >
            {safe}
            <span className="text-[0.5em] text-slate-400">%</span>
          </span>
        </div>
      </div>
      <span
        className={`rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${theme.chip}`}
      >
        {theme.label}
      </span>
      {caption ? (
        <span className="text-center text-[12px] text-slate-500">{caption}</span>
      ) : null}
    </div>
  );
}

/* ── Score bar ────────────────────────────────────────────────────────────── */

export function ScoreBar({
  label,
  value,
  level,
}: {
  label: string;
  value: number;
  level?: MatchLevel;
}) {
  const safe = Math.max(0, Math.min(100, Math.round(value || 0)));
  const theme = MATCH_THEME[level ?? matchLevel(safe)];
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[12.5px]">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-semibold tabular-nums text-slate-900">{safe}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full ${theme.bar}`}
          style={{ width: `${safe}%` }}
        />
      </div>
    </div>
  );
}

/* ── Form primitives ──────────────────────────────────────────────────────── */

export function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5">
      {eyebrow ? (
        <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">{title}</h2>
      {description ? (
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-500">{description}</p>
      ) : null}
    </div>
  );
}

const controlClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-[14px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500";

export function Field({
  label,
  hint,
  required,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string | null;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1 text-[12.5px] font-semibold text-slate-700">
        {label}
        {required ? <span className="text-red-500">*</span> : null}
      </span>
      <input {...props} className={[controlClass, props.className].filter(Boolean).join(" ")} />
      {hint && !error ? <span className="mt-1 block text-[11.5px] text-slate-400">{hint}</span> : null}
      {error ? <span className="mt-1 block text-[11.5px] font-medium text-red-600">{error}</span> : null}
    </label>
  );
}

export function SelectField({
  label,
  required,
  error,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string | null;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1 text-[12.5px] font-semibold text-slate-700">
        {label}
        {required ? <span className="text-red-500">*</span> : null}
      </span>
      <select {...props} className={[controlClass, "appearance-none", props.className].filter(Boolean).join(" ")}>
        {children}
      </select>
      {error ? <span className="mt-1 block text-[11.5px] font-medium text-red-600">{error}</span> : null}
    </label>
  );
}

export function RadioRow({
  label,
  name,
  value,
  options,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <span className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value === option;
          return (
            <button
              key={option}
              type="button"
              name={name}
              onClick={() => onChange(option)}
              className={[
                "rounded-full border px-4 py-2 text-[13px] font-medium transition",
                active
                  ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-100"
                  : "border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900",
              ].join(" ")}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Sidebar cards ────────────────────────────────────────────────────────── */

export function SideCard({
  title,
  children,
  accent = "slate",
}: {
  title?: string;
  children: React.ReactNode;
  accent?: "slate" | "emerald" | "blue";
}) {
  const accentClass =
    accent === "emerald"
      ? "border-emerald-200 bg-emerald-50/70"
      : accent === "blue"
        ? "border-blue-200 bg-blue-50/70"
        : "border-slate-200 bg-white";
  return (
    <div className={`rounded-2xl border p-4 ${accentClass}`}>
      {title ? (
        <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
          {title}
        </p>
      ) : null}
      {children}
    </div>
  );
}

export function PrimaryButton({
  children,
  loading,
  disabled,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-[14px] font-semibold text-white transition",
        "hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100",
        "disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none",
        className,
      ].filter(Boolean).join(" ")}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      ) : null}
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-[14px] font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900",
        className,
      ].filter(Boolean).join(" ")}
    >
      {children}
    </button>
  );
}
