"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { CheckboxOption, EnquiryFormData, EnquiryFormErrors, EnquiryPageContent, RadioOption, SelectOption, WhyChooseItem } from "@/types/enquary/enquaryBannerAndForm";
import { fallbackEnquiryContent } from "@/data/enquaryBannerAndForm";
import { Container } from "../ui/Container";
import enquaryBg from "@/assets/enquiry/formimage.webp"
import { API_URL } from "@/app/lib/api";

interface EnquiryPageProps {
  content?: EnquiryPageContent;
  onSubmit?: (data: EnquiryFormData) => void | Promise<void>;
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
}: EnquiryPageProps) {
  const [formData, setFormData] = useState<EnquiryFormData>(initialFormData);
  const [errors, setErrors] = useState<EnquiryFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
const handleFormSubmit = async (data: any) => {
    try {
      const response = await fetch(`${API_URL}/enquiry/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit enquiry');
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
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
  "mb-2 font-serif text-xs font-semibold text-[#1f2c25]";

const labelBaseClass =
  "mb-1 block text-xs font-medium text-[#5a5248]";

const inputBaseClass =
  "w-full rounded-md border border-[#d8cdb8] bg-white px-3 py-1 text-sm text-[#3a3a3a] outline-none transition focus:border-[#b1793d] focus:ring-1 focus:ring-[#b1793d]/20";

const errorClass =
  "mt-1 text-[11px] text-red-600";
  return (
    <div className="w-full bg-[#f7f1e3]">
      {/* Hero Section */}
<section className="relative overflow-hidden">
  {/* Background Image */}
  <div className="absolute inset-0">
    <Image
      src={content.hero.imageSrc}
      alt={content.hero.imageAlt}
      fill
      className="object-cover"
      sizes="100vw"
      priority
    />
    {/* Optional overlay */}
    <div className="absolute inset-0 bg-black/20" />
  </div>

  {/* Content */}
  <Container className="relative z-10 grid min-h-[650px] md:min-h-[calc(90vh-96px)]grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-10">
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl sm:text-6xl">
        {content.hero.heading}
      </h1>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px w-16 bg-[#b1793d]/80" />
        <span className="h-2 w-2 rotate-45 bg-[#b1793d]/80" />
        <span className="h-px w-16 bg-[#b1793d]/80" />
      </div>

      <h2 className="font-serif text-xl sm:text-2xl text-[#b1793d] font-semibold">
        {content.hero.subheading}
      </h2>

      <p className="mt-3 max-w-md text-sm leading-relaxed sm:text-base font-semibold">
        {content.hero.description}
      </p>
    </div>
  </Container>
</section>

      {/* Form + Sidebar Section */}
      <Container>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]"
        >
          {/* Form Card */}
          <div className="rounded-xl border border-[#e3d2b0] bg-[#fdfaf3] p-5 sm:p-8">
            <div className="mb-8 flex items-center justify-center gap-3">
              <span aria-hidden="true" className="h-px w-12 bg-[#b1793d]/50" />
              <h3 className="text-center font-serif text-xl text-[#1f2c25] sm:text-2xl">
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
                  <input
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
                  <input
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
                  <input
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
                  <input
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
                  <input
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
                  <select
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
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs text-[#5a5248]" htmlFor="state">
                        State
                      </label>
                      <select
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
                      <label className="mb-1 block text-xs text-[#5a5248]" htmlFor="city">
                        City
                      </label>
                      <select
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
                  <select
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
                  <select
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
                      className={`${labelBaseClass} gap-2 flex`}
                    >
                      <input
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
                <select
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
                <textarea
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
                <p className="mb-1 text-sm text-[#3a3a3a]">{content.upload.label}</p>
                <p className="mb-1 text-xs text-[#a39d8e]">
                  {content.upload.helperText}
                </p>
                <div className="flex items-center gap-3">
                  <label
                    htmlFor="fileUpload"
                    className="cursor-pointer rounded-md border border-[#d8cdb8] bg-[#fdfaf3] px-4 py-2 text-sm text-[#3a3a3a] hover:bg-[#f3ead4]"
                  >
                    Choose File
                  </label>
                  <input
                    id="fileUpload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="hidden"
                    onChange={(e) =>
                      setField("file", e.target.files?.[0] ?? null)
                    }
                  />
                  <span className="truncate text-xs text-[#a39d8e]">
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
                     className={`${labelBaseClass} gap-2 flex`}
                    >
                      <input
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
                className="flex items-start gap-2 text-sm text-[#3a3a3a]"
              >
                <input
                  id="agreeToContact"
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-[#d8cdb8] text-[#b1793d] focus:ring-[#b1793d]/40"
                  checked={formData.agreeToContact}
                  onChange={(e) => setField("agreeToContact", e.target.checked)}
                />
                {content.consentText}
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-md bg-[#0f2e22] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-[#e8c766] transition hover:bg-[#143b2c] disabled:opacity-70 disabled:cursor-not-allowed"
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
          <aside className="overflow-hidden rounded-xl ">
            {/* <div className="p-6">
              <h4 className="mb-6 text-center text-sm font-semibold uppercase tracking-wide text-[#e8c766]">
                {content.whyChoose.heading}
              </h4>

              <div className="divide-y divide-[#e8c766]/15">
                {content.whyChoose.items.map((item: WhyChooseItem) => (
                  <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="relative h-9 w-9 shrink-0">
                      <Image
                        src={item.iconSrc}
                        alt={item.iconAlt}
                        fill
                        className="object-contain"
                        sizes="36px"
                      />
                    </div>
                    <div>
                      <p className="font-serif text-base text-[#e8c766]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-[#cbd5c8]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-40 w-full sm:h-48">
              <Image
                src={content.whyChoose.bottomImageSrc}
                alt={content.whyChoose.bottomImageAlt}
                fill
                className="object-cover"
                sizes="320px"
              />
            </div> */}
            <Image alt="enquary bg" src={enquaryBg} />
          </aside>
        </form>
      </Container>
    </div>
  );
}