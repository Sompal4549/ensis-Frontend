"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { ArrowRight, BadgeCheck, Compass, ShieldCheck } from "lucide-react";
import { CheckboxOption, EnquiryFormData, EnquiryFormErrors, EnquiryPageContent, RadioOption, SelectOption, WhyChooseItem } from "@/types/enquary/enquaryBannerAndForm";
import { fallbackEnquiryContent } from "@/data/enquaryBannerAndForm";
import { Container } from "../ui/Container";
import enquaryBg from "@/assets/enquiry/formimage.webp"
import lotus from "@/assets/about/lotus.webp"
import { API_URL } from "@/lib/api/api";
import HtmlRenderer from "../layout/HtmlRender";
import EnquaryStatsStrip from "./EnquaryStatsStrip";
import BookButton from "../ui/BookButton";

interface EnquiryPageProps {
  content?: EnquiryPageContent;
  onSubmit?: (data: EnquiryFormData) => void | Promise<void>;
  statsStrip?: React.ReactNode;
}

const initialFormData: EnquiryFormData = {
  fullName: "",
  mobileNumber: "",
  email: "",
  companyOrganization: "",
  cityAndState: "",
  projectType: "",
  state: "",
  city: "",
  projectSize: "",
  budgetRange: "",
  servicesRequired: [],
  timeline: "",
  message: "",
  file: null,
  preferredContact: "whatsapp",
  agreeToContact: false,
};

export default function EnquiryPage({
  content = fallbackEnquiryContent,
  statsStrip,
}: EnquiryPageProps) {
  const [formData, setFormData] = useState<EnquiryFormData>(initialFormData);
  const [errors, setErrors] = useState<EnquiryFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (data: EnquiryFormData) => {
    try {
      const payload = new FormData();

      payload.append("fullName", data.fullName ?? "");
      payload.append("mobileNumber", data.mobileNumber ?? "");
      payload.append("email", data.email ?? "");
      payload.append("companyOrganization", data.companyOrganization ?? "");
      payload.append("cityAndState", data.cityAndState ?? "");
      payload.append("projectType", data.projectType ?? "");
      payload.append("state", data.state ?? "");
      payload.append("city", data.city ?? "");
      payload.append("projectSize", data.projectSize ?? "");
      payload.append("budgetRange", data.budgetRange ?? "");
      payload.append("servicesRequired", JSON.stringify(data.servicesRequired ?? []));
      payload.append("timeline", data.timeline ?? "");
      payload.append("message", data.message ?? "");
      payload.append("preferredContact", data.preferredContact ?? "whatsapp");
      payload.append("agreeToContact", String(Boolean(data.agreeToContact)));

      if (data.file) {
        payload.append("file", data.file);
      }

      const response = await fetch(`${API_URL}/enquiry/submit`, {
        method: "POST",
        body: payload,
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        throw new Error(errorPayload?.message || "Failed to submit enquiry");
      }
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      throw error;
    }
  };
  const setField = <K extends keyof EnquiryFormData>(
    field: K,
    value: EnquiryFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const toggleService = (serviceId: string) => {
    setFormData((prev) => {
      const exists = prev.servicesRequired.includes(serviceId);
      return {
        ...prev,
        servicesRequired: exists
          ? prev.servicesRequired.filter((id) => id !== serviceId)
          : [...prev.servicesRequired, serviceId],
      };
    });
  };

  const validate = (): EnquiryFormErrors => {
    const newErrors: EnquiryFormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required.";
    } else if (!/^\+?[0-9\s-]{7,15}$/.test(formData.mobileNumber.trim())) {
      newErrors.mobileNumber = "Enter a valid mobile number.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!formData.companyOrganization.trim()) {
      newErrors.companyOrganization = "Company is required.";
    }
    if (!formData.cityAndState.trim()) {
      newErrors.cityAndState = "City & State is required.";
    }
    if (!formData.projectType) {
      newErrors.projectType = "Please select a project type.";
    }
    if (!formData.state) {
      newErrors.state = "State is required.";
    }
    if (!formData.city) {
      newErrors.city = "City is required.";
    }
    if (!formData.projectSize) {
      newErrors.projectSize = "Project size is required.";
    }
    if (!formData.budgetRange) {
      newErrors.budgetRange = "Budget range is required.";
    }
    if (formData.servicesRequired.length === 0) {
      (newErrors as any).servicesRequired = "Select at least one service.";
    }
    if (!formData.timeline) {
      newErrors.timeline = "Timeline is required.";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    }

    if (!formData.agreeToContact) {
      newErrors.agreeToContact = "Please agree to be contacted to proceed.";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("All fields are important");
      return;
    }

    setIsSubmitting(true);
    try {
      await handleFormSubmit?.(formData);
      setFormData(initialFormData);
      toast.success("Your enquiry has been submitted.");
    } catch (error) {
      toast.error("Failed to submit enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sectionHeadingClass =
    "mb-2  text-base font-semibold text-[#1f2c25]";

  const labelBaseClass =
    "mb-1 block text-base font-medium text-[#5a5248]";

  const inputBaseClass =
    "w-full rounded-md border border-[#d8cdb8] bg-white px-3 py-1 text-sm text-[#3a3a3a] placeholder:text-black outline-none transition focus:border-[#b1793d] focus:ring-1 focus:ring-[#b1793d]/20";

  const errorClass =
    "mt-1 text-base text-red-600";
  return (
    <div className="w-full bg-[#f7f1e3]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#F8F5EF]">
        <div className="relative min-h-[550px] md:h-[calc(100vh-146px)] max-h-[650px] xl:max-h-none">
          {/* Background Image — right-side spa image unchanged */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={content.hero.imageSrc}
              alt={content.hero.imageAlt}
              fill
              className="object-left xl:object-center object-cover"
              sizes="100vw"
              priority
            />
          </div>

          {/* Ivory → transparent gradient (fade into the image) */}
          {/* <div className="absolute inset-0 bg-linear-to-r from-[#F8F5EF] via-[#F8F5EF]/85 to-transparent md:via-[#F8F5EF]/45" /> */}

          {/* Soft radial glow behind heading */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-1/2 h-[420px] w-[540px] -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(184,138,68,0.10),transparent_70%)]"
          />

          {/* Content */}
          <Container className="relative z-10 flex h-full items-center">
            <div className="relative w-full max-w-[550px] py-16 md:py-0">
              {/* Thin vertical gold accent line beside content */}
              {/* <div className="absolute left-0 top-8 hidden h-[calc(100%-4rem)] w-px bg-linear-to-b from-transparent via-[#B88A44]/60 to-transparent md:block" /> */}

              {/* Large lotus behind heading (no blur) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-8 opacity-[0.05] select-none"
              >
                <Image src={lotus} alt="" width={300} height={300} className="object-contain" />
              </div>

              {/* Subtle botanical pattern — corner only */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-10 -left-6 opacity-[0.04] select-none"
              >
                <Image src={lotus} alt="" width={140} height={140} className="object-contain" />
              </div>

              {/* Small gold lotus icon above section label */}
              <div className="flex items-center gap-4.5">
                <Image src={lotus} alt="" width={20} height={20} className="h-5 w-5 object-contain" />
                <span className="text-base font-semibold uppercase tracking-[0.15em] text-[#B88A44]">
                  {content.hero.heading}
                </span>
              </div>

              {/* Main heading */}
              <h1 className="mt-2 text-[#173A2B] max-w-100">
                {content.hero.subheading}
              </h1>

              {/* Thin gold divider — expands on load */}
              <div className="mt-3 h-px w-24 bg-[#B88A44]" />

              {/* Description */}
              <HtmlRenderer
                className="mt-3 max-w-100 text-sm leading-6 text-[#4D4D4D] md:text-base"
                content={content.hero.description}
              />

              {/* CTA */}
              <div className="mt-4 flex flex-wrap items-center gap-5">
                <BookButton text={content.hero.ctaPrimary?.label || "Start Your Project"} path={content.hero.ctaPrimary?.href || "/consultancy"}>

                </BookButton>
                {/* <Link
                  href={content.hero.ctaPrimary?.href || "#enquiry-form"}
                  className="group inline-flex items-center gap-4 rounded-full bg-[#0f2e22] px-7 py-2 text-sm font-semibold uppercase tracking-wide text-[#e8c766] shadow-lg shadow-[#0f2e22]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#143b2c] hover:shadow-[0_8px_30px_rgba(184,138,68,0.35)]"
                >
                  <div className="flex items-center gap-4 text-white">
                    {content.hero.ctaPrimary?.label || "Start Your Project"}
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link> */}
                <Link
                  href={content.hero.ctaSecondary?.href || "/consultancy"}
                  className="text-base font-semibold text-[#173A2B] underline-offset-4 hover:underline"
                >
                  {content.hero.ctaSecondary?.label || "Book Free Consultation"}
                </Link>
              </div>

{/* Trust indicators */}
              <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3">
                {(content.hero.trustIndicators?.length
                  ? content.hero.trustIndicators
                  : [
                      { id: "confidential", label: "100% Confidential" },
                      { id: "guidance", label: "Expert Guidance" },
                      { id: "obligation", label: "No Obligation" },
                    ]
                ).map((item, index) => {
                  const Icon = [ShieldCheck, Compass, BadgeCheck][index % 3];
                  return (
                    <div
                      key={item.id || item.label}
                      className="flex items-center gap-2 text-[#8a6a3a]"
                    >
                      <Icon size={16} strokeWidth={1.5} className="text-[#B88A44]" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Container>
        </div>

        <div className="relative z-10 mt-6 md:mt-0 md:-mt-28 xl:-mt-10">
          <EnquaryStatsStrip />
        </div>
      </section>

      {/* Form + Sidebar Section */}
      <Container className="relative z-20 mt-8 sm:mt-10 rounded-xl">
        <form
          id="enquiry-form"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-[1fr_380px] border-[#e3d2b0] bg-white rounded-xl border shadow-md overflow-hidden"
        >
          {/* Form Card */}
          <div className="rounded-xl  bg-[#fdfaf3] p-5 sm:p-8">
            <div className="mb-4 flex items-center justify-center gap-4">
              <span aria-hidden="true" className="h-px w-12 bg-[#b1793d]/50" />
              <h3 className="text-center  text-xl text-[#1f2c25] sm:text-2xl font-semibold">
                {content.formTitle}
              </h3>
              <span aria-hidden="true" className="h-px w-12 bg-[#b1793d]/50" />
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-8">
              {/* Personal Details */}
              <div>
                <h4 className={sectionHeadingClass}>Personal Details</h4>

                <div className="mb-2">
                  <label className={labelBaseClass} htmlFor="fullName">
                    Full Name *
                  </label>
                  <input suppressHydrationWarning
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className={inputBaseClass}
                    value={formData.fullName}
                    onChange={(e) => setField("fullName", e.target.value)}
                  />
                  {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
                </div>

                <div className="mb-2">
                  <label className={labelBaseClass} htmlFor="mobileNumber">
                    Mobile Number *
                  </label>
                  <input suppressHydrationWarning
                    id="mobileNumber"
                    type="tel"
                    placeholder="Enter your mobile number"
                    className={inputBaseClass}
                    value={formData.mobileNumber}
                    onChange={(e) => setField("mobileNumber", e.target.value)}
                  />
                  {errors.mobileNumber && (
                    <p className={errorClass}>{errors.mobileNumber}</p>
                  )}
                </div>

                <div className="mb-2">
                  <label className={labelBaseClass} htmlFor="email">
                    Email Address *
                  </label>
                  <input suppressHydrationWarning
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className={inputBaseClass}
                    value={formData.email}
                    onChange={(e) => setField("email", e.target.value)}
                  />
                  {errors.email && <p className={errorClass}>{errors.email}</p>}
                </div>

                <div className="mb-2">
                  <label className={labelBaseClass} htmlFor="companyOrganization">
                    Company / Organization
                  </label>
                  <input suppressHydrationWarning
                    id="companyOrganization"
                    type="text"
                    placeholder="Enter company / organization name"
                    className={inputBaseClass}
                    value={formData.companyOrganization}
                    onChange={(e) =>
                      setField("companyOrganization", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className={labelBaseClass} htmlFor="cityAndState">
                    City & State
                  </label>
                  <input suppressHydrationWarning
                    id="cityAndState"
                    type="text"
                    placeholder="Enter your city & state"
                    className={inputBaseClass}
                    value={formData.cityAndState}
                    onChange={(e) => setField("cityAndState", e.target.value)}
                  />
                </div>
              </div>

              {/* Project Details */}
              <div>
                <h4 className={sectionHeadingClass}>Project Details</h4>

                <div className="mb-2">
                  <label className={labelBaseClass} htmlFor="projectType">
                    Project Type *
                  </label>
                  <select suppressHydrationWarning
                    id="projectType"
                    className={inputBaseClass}
                    value={formData.projectType}
                    onChange={(e) => setField("projectType", e.target.value)}
                  >
                    <option value="">Select project type</option>
                    {content.projectTypeOptions.map((opt: SelectOption) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.projectType && (
                    <p className={errorClass}>{errors.projectType}</p>
                  )}
                </div>

                <div className="mb-2">
                  <span className={labelBaseClass}>Project Location</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-base" htmlFor="state">
                        State
                      </label>
                      <select suppressHydrationWarning
                        id="state"
                        className={inputBaseClass}
                        value={formData.state}
                        onChange={(e) => setField("state", e.target.value)}
                      >
                        <option value="">Select state</option>
                        {content.stateOptions.map((opt: SelectOption) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-base" htmlFor="city">
                        City
                      </label>
                      <select suppressHydrationWarning
                        id="city"
                        className={inputBaseClass}
                        value={formData.city}
                        onChange={(e) => setField("city", e.target.value)}
                      >
                        <option value="">Select city</option>
                        {content.cityOptions.map((opt: SelectOption) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mb-2">
                  <label className={labelBaseClass} htmlFor="projectSize">
                    Project Size
                  </label>
                  <select suppressHydrationWarning
                    id="projectSize"
                    className={inputBaseClass}
                    value={formData.projectSize}
                    onChange={(e) => setField("projectSize", e.target.value)}
                  >
                    <option value="">Select project size</option>
                    {content.projectSizeOptions.map((opt: SelectOption) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelBaseClass} htmlFor="budgetRange">
                    Budget Range
                  </label>
                  <select suppressHydrationWarning
                    id="budgetRange"
                    className={inputBaseClass}
                    value={formData.budgetRange}
                    onChange={(e) => setField("budgetRange", e.target.value)}
                  >
                    <option value="">Select budget range</option>
                    {content.budgetRangeOptions.map((opt: SelectOption) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Services Required */}
              <div>
                <h4 className={sectionHeadingClass}>Services Required</h4>
                <div className="grid grid-cols-2 gap-y-2">
                  {content.servicesOptions.map((service: CheckboxOption) => (
                    <label
                      key={service.id}
                      htmlFor={`service-${service.id}`}
                      className={`${labelBaseClass} gap-4 flex`}
                    >
                      <input suppressHydrationWarning
                        id={`service-${service.id}`}
                        type="checkbox"
                        className="h-4 w-4 rounded border-[#d8cdb8] text-[#b1793d] focus:ring-[#b1793d]/40"
                        checked={formData.servicesRequired.includes(service.id)}
                        onChange={() => toggleService(service.id)}
                      />
                      {service.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className={sectionHeadingClass}>Timeline</h4>
                <label className={labelBaseClass} htmlFor="timeline">
                  Timeline
                </label>
                <select suppressHydrationWarning
                  id="timeline"
                  className={inputBaseClass}
                  value={formData.timeline}
                  onChange={(e) => setField("timeline", e.target.value)}
                >
                  <option value="">Select timeline</option>
                  {content.timelineOptions.map((opt: SelectOption) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="md:col-span-2">
                <h4 className={sectionHeadingClass}>Message</h4>
                <textarea suppressHydrationWarning
                  id="message"
                  rows={4}
                  placeholder="Tell us about your vision, requirements, and expectations..."
                  className={`${inputBaseClass} resize-none`}
                  value={formData.message}
                  onChange={(e) => setField("message", e.target.value)}
                />
              </div>

              {/* Upload */}
              <div>
                <h4 className={sectionHeadingClass}>Upload</h4>
                <p className="mb-1 text-sm ">{content.upload.label}</p>
                <p className="mb-1 text-base">
                  {content.upload.helperText}
                </p>
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="fileUpload"
                    className="cursor-pointer rounded-md border border-[#d8cdb8] bg-[#fdfaf3] px-4 py-2 text-sm text-[#3a3a3a] hover:bg-[#f3ead4]"
                  >
                    Choose File
                  </label>
                  <input suppressHydrationWarning
                    id="fileUpload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="hidden"
                    onChange={(e) =>
                      setField("file", e.target.files?.[0] ?? null)
                    }
                  />
                  <span className="truncate text-base">
                    {formData.file ? formData.file.name : "No file chosen"}
                  </span>
                </div>
              </div>

              {/* Preferred Contact */}
              <div>
                <h4 className={sectionHeadingClass}>Preferred Contact</h4>
                <div className="grid grid-cols-2 gap-y-2">
                  {content.preferredContactOptions.map((opt: RadioOption) => (
                    <label
                      key={opt.id}
                      htmlFor={`contact-${opt.id}`}
                      className={`${labelBaseClass} gap-4 flex`}
                    >
                      <input suppressHydrationWarning
                        id={`contact-${opt.id}`}
                        type="radio"
                        name="preferredContact"
                        className="h-4 w-4 border-[#d8cdb8] text-[#b1793d] focus:ring-[#b1793d]/40"
                        checked={formData.preferredContact === opt.id}
                        onChange={() => setField("preferredContact", opt.id)}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Consent + Submit */}
            <div className="mt-2 flex flex-col items-start gap-4 border-t border-[#e3d2b0] pt-2 sm:flex-row sm:items-center sm:justify-between">
              <label
                htmlFor="agreeToContact"
                className="flex items-start gap-4 text-sm text-[#3a3a3a]"
              >
                <input suppressHydrationWarning
                  id="agreeToContact"
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-[#d8cdb8] text-[#b1793d] focus:ring-[#b1793d]/40 font-bold"
                  checked={formData.agreeToContact}
                  onChange={(e) => setField("agreeToContact", e.target.checked)}
                />
                {content.consentText}
              </label>

              <button suppressHydrationWarning
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-4 whitespace-nowrap rounded-md bg-[#0f2e22] px-6 py-2 text-sm font-semibold uppercase tracking-wide text-[#e8c766] transition hover:bg-[#143b2c] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : content.submitButtonText}
                {!isSubmitting && <span aria-hidden="true">→</span>}
              </button>
            </div>
            {errors.agreeToContact && (
              <p className={errorClass}>{errors.agreeToContact}</p>
            )}
          </div>

          {/* Sidebar */}
          <aside className="relative hidden lg:block h-full min-h-full overflow-hidden rounded-xl">
            <Image
              src={content?.hero?.formImageSrc}
              alt="Enquiry"
              fill
              className="object-cover"
              sizes="380px"
            />
          </aside>
        </form>
      </Container>
    </div>
  );
}