"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import {
  Briefcase,
  MapPin,
  MessageCircle,
  Paperclip,
  Send,
  Settings,
  Upload,
  User,
} from "lucide-react";
import {
  CheckboxOption,
  EnquiryFormData,
  EnquiryFormErrors,
  EnquiryPageContent,
  SelectOption,
} from "@/types/enquary/enquaryBannerAndForm";
import { fallbackEnquiryContent } from "@/data/enquaryBannerAndForm";
import { Container } from "../ui/Container";
import why1Img from "@/assets/enquiry/why_1.png";
import why2Img from "@/assets/enquiry/why_2.png";
import why3Img from "@/assets/enquiry/why_3.png";
import why4Img from "@/assets/enquiry/why_4.png";
import mapPinBadge from "@/assets/enquiry/map_pin_badge.png";
import enquiryNewImg from "@/assets/enquiry_new.png";
import heroBg from "@/assets/privacy_and_enquiry.png";
import designHouseLogo from "@/assets/icons/design_house.webp";
import footerMap from "@/assets/footer/map.webp";
import { API_URL, getImageUrl } from "@/lib/api/api";
import { ALL_INDIAN_STATES } from "@/lib/pincode";

interface EnquiryPageProps {
  content?: EnquiryPageContent;
  onSubmit?: (data: EnquiryFormData) => void | Promise<void>;
  statsStrip?: React.ReactNode;
}

const labelOf = (options: { value?: string; id?: string; label: string }[] | undefined, value: string) =>
  options?.find((o) => (o.value ?? o.id) === value)?.label || value;

const initialFormData: EnquiryFormData = {
  fullName: "",
  mobileNumber: "",
  email: "",
  companyOrganization: "",
  cityAndState: "",
  projectType: "",
  projectLocation: "",
  state: "",
  city: "",
  zipcode: "",
  projectSize: "",
  budgetRange: "",
  servicesRequired: [],
  timeline: "Immediate",
  message: "",
  file: null,
  preferredContact: "whatsapp",
  agreeToContact: false,
};

const DEFAULT_PROJECT_TYPES: SelectOption[] = [
  { value: "ayurveda-resort", label: "Ayurveda Resort" },
  { value: "spa-wellness-center", label: "Spa & Wellness Center" },
  { value: "panchakarma-clinic", label: "Panchakarma Clinic" },
  { value: "wellness-hospital", label: "Wellness Hospital" },
  { value: "custom-solutions", label: "Custom Solutions / Other" },
];

const DEFAULT_PROJECT_SIZES: SelectOption[] = [
  { value: "small", label: "Small (under 2,000 sq.ft.)" },
  { value: "medium", label: "Medium (2,000 - 10,000 sq.ft.)" },
  { value: "large", label: "Large (10,000+ sq.ft.)" },
];

const DEFAULT_BUDGET_RANGES: SelectOption[] = [
  { value: "under-10l", label: "Under ₹10 Lakhs" },
  { value: "10l-50l", label: "₹10 Lakhs - ₹50 Lakhs" },
  { value: "50l-1cr", label: "₹50 Lakhs - ₹1 Crore" },
  { value: "above-1cr", label: "Above ₹1 Crore" },
];

const DEFAULT_SERVICES: CheckboxOption[] = [
  { id: "consultation", label: "Consultation" },
  { id: "turnkey-execution", label: "Turnkey Execution" },
  { id: "planning", label: "Planning" },
  { id: "project-management", label: "Project Management" },
  { id: "product-supply", label: "Product Supply" },
  { id: "amc-service-support", label: "AMC & Service Support" },
];

const POPULAR_CITIES = [
  "New Delhi",
  "Mumbai",
  "Ghaziabad",
  "Bengaluru",
  "Kolkata",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Kochi",
  "Lucknow",
  "Chandigarh",
  "Dehradun",
  "Bhopal",
  "Indore",
  "Goa",
  "Other",
];

const whyChooseItems = [
  {
    icon: why1Img,
    title: "20+ Years of Trust",
    description: "Two decades of excellence in wellness industry",
  },
  {
    icon: why2Img,
    title: "1000+ Projects Delivered",
    description: "Successfully executed wellness projects",
  },
  {
    icon: why3Img,
    title: "Customised Solutions",
    description: "Tailored to your unique needs",
  },
  {
    icon: why4Img,
    title: "Pan India Service",
    description: "Serving clients across India",
  },
];

export default function EnquiryPage({
  content = fallbackEnquiryContent,
}: EnquiryPageProps) {
  const [formData, setFormData] = useState<EnquiryFormData>(initialFormData);
  const [errors, setErrors] = useState<EnquiryFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stateOptions: SelectOption[] = useMemo(() => {
    const adminOpts = content.stateOptions || [];
    const remaining = ALL_INDIAN_STATES.filter(
      (name) =>
        !adminOpts.some(
          (o: SelectOption) =>
            (o.label || "").toLowerCase() === name.toLowerCase() ||
            (o.value || "").toLowerCase() === name.toLowerCase()
        )
    ).map((name) => ({ value: name, label: name }));

    return [...adminOpts, ...remaining];
  }, [content.stateOptions]);

  const setField = <K extends keyof EnquiryFormData>(
    field: K,
    value: EnquiryFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const toggleService = (serviceId: string) => {
    setFormData((prev) => {
      const exists = prev.servicesRequired.includes(serviceId);
      const updated = exists
        ? prev.servicesRequired.filter((s) => s !== serviceId)
        : [...prev.servicesRequired, serviceId];
      return { ...prev, servicesRequired: updated };
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

    if (!formData.agreeToContact) {
      newErrors.agreeToContact = "Please agree to be contacted to proceed.";
    }

    return newErrors;
  };

  const handleFormSubmit = async (data: EnquiryFormData) => {
    try {
      const payload = new FormData();

      payload.append("fullName", data.fullName ?? "");
      payload.append("mobileNumber", data.mobileNumber ?? "");
      payload.append("email", data.email ?? "");
      payload.append("companyOrganization", data.companyOrganization ?? "");
      payload.append("cityAndState", data.cityAndState ?? "");
      payload.append("projectType", labelOf(content.projectTypeOptions, data.projectType ?? ""));
      payload.append("projectLocation", data.projectLocation ?? "");
      payload.append("state", labelOf(stateOptions, data.state ?? ""));
      payload.append("city", (data.city ?? "").trim());
      payload.append("zipcode", data.zipcode ?? "");
      payload.append("pincode", data.zipcode ?? "");
      payload.append("projectSize", labelOf(content.projectSizeOptions, data.projectSize ?? ""));
      payload.append("budgetRange", labelOf(content.budgetRangeOptions, data.budgetRange ?? ""));
      payload.append(
        "servicesRequired",
        JSON.stringify((data.servicesRequired ?? []).map((id) => labelOf(content.servicesOptions, id)))
      );
      payload.append("timeline", labelOf(content.timelineOptions, data.timeline || "Immediate"));
      payload.append("message", data.message ?? "");
      payload.append("preferredContact", labelOf(content.preferredContactOptions, data.preferredContact || "whatsapp"));
      payload.append("agreeToContact", String(Boolean(data.agreeToContact)));
      payload.append("source", "enquiry");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fill in the required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await handleFormSubmit(formData);
      setFormData(initialFormData);
      toast.success("Your enquiry has been submitted successfully.");
    } catch {
      toast.error("Failed to submit enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelBaseClass = "mb-0.5 block text-[10.5px] sm:text-[11px] font-semibold text-[#475569] leading-tight";
  const inputBaseClass =
    "w-full h-[28px] sm:h-[30px] rounded border border-[#cbd5e1] bg-white px-2 py-0 text-[11px] sm:text-[11.5px] text-[#1e293b] placeholder:text-[#94a3b8] outline-none transition focus:border-[#d4a046] focus:ring-1 focus:ring-[#d4a046]/20";
  const errorClass = "mt-0.5 text-[10px] sm:text-[10.5px] text-red-600";
  const servicesToDisplay = DEFAULT_SERVICES;

  const rawHeroBg = (content as any)?.heroImage || (content as any)?.heroBg || (content as any)?.backgroundImage || (content as any)?.image;
  const resolvedHeroBg = rawHeroBg
    ? (typeof rawHeroBg === "string" ? getImageUrl(rawHeroBg) : (typeof rawHeroBg === "object" && rawHeroBg.imageUrl ? getImageUrl(rawHeroBg.imageUrl) : rawHeroBg))
    : heroBg;

  const eyebrow = (content as any)?.eyebrow || "ENQUIRY";
  const title = (content as any)?.title || "Let's Build Your";
  const subtitle = (content as any)?.subtitle || (content as any)?.highlight || (content as any)?.highlightedText || "Wellness Vision";
  const description =
    (content as any)?.description ||
    (content as any)?.heroDescription ||
    "Share your requirements with us and our experts will connect with you to create a customised solution for your Ayurvedic, Panchakarma or wellness space.";

  return (
    <div className="w-full bg-[#faf7f2]">
      {/* ── 1. Hero Section ── */}
      <section className="relative z-10 min-h-[260px] sm:min-h-[290px] md:min-h-[320px] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={resolvedHeroBg}
            alt="ENSIS Enquiry"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
            fetchPriority="high"
            loading="eager"
          />
        </div>

        <div className="relative mx-auto flex min-h-[260px] sm:min-h-[290px] md:min-h-[320px] max-w-[1400px] items-center px-4 py-6 sm:py-8 lg:px-10">
          <div className="max-w-[540px]">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-[2px] w-5 bg-[#a9742a]" />
              <p className="text-xs sm:text-[12.5px] font-bold uppercase tracking-[0.2em] text-[#a9742a]">
                {eyebrow}
              </p>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-[42px] font-bold leading-[1.12] text-[#111827]">
              {title}
              {subtitle && (
                <>
                  <br />
                  <span className="text-[#a9742a]">{subtitle}</span>
                </>
              )}
            </h1>

            <p className="mt-3 max-w-[400px] text-sm font-medium text-[#4b5563]">
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. Form + Sidebar Section ── */}
      <Container className="relative z-20 py-4 sm:py-5">
        <form
          id="enquiry-form"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[1fr_425px] xl:grid-cols-[1fr_450px] items-stretch"
        >
          {/* Left: Enquiry Form Card */}
          <div className="rounded-2xl border border-[#e6d6b9]/70 bg-white p-3.5 sm:p-4 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <h2 className="text-lg sm:text-[20px] font-bold text-[#111827] tracking-tight">
                Enquiry Form
              </h2>
              <div className="mt-0.5 mb-2.5 flex items-center gap-2">
                <span aria-hidden="true" className="h-[2px] w-4 bg-[#d4a046]" />
                <p className="text-[11px] sm:text-[11.5px] font-medium text-[#2563eb]">
                  Please fill in your details and our team will get back to you shortly.
                </p>
              </div>

              {/* 2-Column: Personal & Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 sm:gap-x-6 gap-y-2">
                {/* Column 1: Personal Details */}
                <div>
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <User size={13} className="text-[#d97706]" strokeWidth={2.2} />
                    <h3 className="text-[11.5px] sm:text-xs font-bold text-[#111827]">Personal Details</h3>
                  </div>

                  <div className="mb-1.5">
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

                  <div className="mb-1.5">
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
                    {errors.mobileNumber && <p className={errorClass}>{errors.mobileNumber}</p>}
                  </div>

                  <div className="mb-1.5">
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

                  <div className="mb-1.5">
                    <label className={labelBaseClass} htmlFor="companyOrganization">
                      Company / Organization
                    </label>
                    <input
                      id="companyOrganization"
                      type="text"
                      placeholder="Enter company / organization name"
                      className={inputBaseClass}
                      value={formData.companyOrganization}
                      onChange={(e) => setField("companyOrganization", e.target.value)}
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

                {/* Column 2: Project Details */}
                <div>
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <Briefcase size={13} className="text-[#d97706]" strokeWidth={2.2} />
                    <h3 className="text-[11.5px] sm:text-xs font-bold text-[#111827]">Project Details</h3>
                  </div>

                  <div className="mb-1.5">
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
                      {(content.projectTypeOptions?.length ? content.projectTypeOptions : DEFAULT_PROJECT_TYPES).map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-1.5">
                    <label className={labelBaseClass} htmlFor="projectLocation">
                      Project Location
                    </label>
                    <input
                      id="projectLocation"
                      type="text"
                      placeholder="Enter project location"
                      className={inputBaseClass}
                      value={formData.projectLocation || ""}
                      onChange={(e) => setField("projectLocation", e.target.value)}
                    />
                  </div>

                  <div className="mb-1.5 grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelBaseClass} htmlFor="state">
                        State
                      </label>
                      <select
                        id="state"
                        className={inputBaseClass}
                        value={formData.state}
                        onChange={(e) => setField("state", e.target.value)}
                      >
                        <option value="">Select state</option>
                        {stateOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelBaseClass} htmlFor="city">
                        City
                      </label>
                      <select
                        id="city"
                        className={inputBaseClass}
                        value={formData.city}
                        onChange={(e) => setField("city", e.target.value)}
                      >
                        <option value="">Select city</option>
                        {POPULAR_CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-1.5">
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
                      {(content.projectSizeOptions?.length ? content.projectSizeOptions : DEFAULT_PROJECT_SIZES).map((opt) => (
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
                      {(content.budgetRangeOptions?.length ? content.budgetRangeOptions : DEFAULT_BUDGET_RANGES).map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 2: Services Required & Upload (Optional) */}
              <div className="mt-2.5 grid grid-cols-1 md:grid-cols-2 gap-x-5 sm:gap-x-6 gap-y-2">
                {/* Services Required */}
                <div>
                  <div className="mb-1 flex items-center gap-1.5">
                    <Settings size={13} className="text-[#d97706]" strokeWidth={2.2} />
                    <h3 className="text-[11.5px] sm:text-xs font-bold text-[#111827]">Services Required</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                    {servicesToDisplay.map((service) => (
                      <label
                        key={service.id}
                        htmlFor={`service-${service.id}`}
                        className="flex items-center gap-1.5 text-[10.5px] sm:text-[11px] font-medium text-[#334155] cursor-pointer select-none"
                      >
                        <input
                          id={`service-${service.id}`}
                          type="checkbox"
                          className="h-3 w-3 rounded border-[#cbd5e1] text-[#063120] focus:ring-[#063120]"
                          checked={formData.servicesRequired.includes(service.id)}
                          onChange={() => toggleService(service.id)}
                        />
                        <span className="truncate">{service.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Upload */}
                <div>
                  <div className="mb-0.5 flex items-center gap-1.5">
                    <Paperclip size={13} className="text-[#d97706]" strokeWidth={2.2} />
                    <h3 className="text-[11.5px] sm:text-xs font-bold text-[#111827]">
                      Upload <span className="text-[10px] sm:text-[10.5px] font-normal text-[#94a3b8]">(Optional)</span>
                    </h3>
                  </div>
                  <p className="mb-1 text-[10px] sm:text-[10.5px] text-[#64748b]">
                    Share layout, drawings or reference images (PDF, JPG, PNG)
                  </p>

                  <div className="flex items-center gap-2 rounded border border-[#cbd5e1] bg-white px-2 h-[28px] sm:h-[30px]">
                    <label
                      htmlFor="fileUpload"
                      className="cursor-pointer rounded border border-[#cbd5e1] bg-[#f8fafc] hover:bg-gray-100 px-1.5 py-0.5 text-[10px] sm:text-[10.5px] font-semibold text-[#1e293b] flex items-center gap-1 shadow-2xs transition shrink-0"
                    >
                      <Upload size={11} className="text-[#475569]" />
                      <span>Choose File</span>
                    </label>
                    <input
                      id="fileUpload"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      className="hidden"
                      onChange={(e) => setField("file", e.target.files?.[0] ?? null)}
                    />
                    <span className="truncate text-[10.5px] sm:text-[11px] text-[#64748b]">
                      {formData.file ? formData.file.name : "No file chosen"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 3: Message */}
              <div className="mt-2.5">
                <div className="mb-1 flex items-center gap-1.5">
                  <MessageCircle size={13} className="text-[#d97706]" strokeWidth={2.2} />
                  <h3 className="text-[11.5px] sm:text-xs font-bold text-[#111827]">Message</h3>
                </div>
                <textarea
                  id="message"
                  rows={2}
                  placeholder="Tell us about your vision, requirements, and expectations..."
                  className="w-full h-[50px] sm:h-[54px] rounded border border-[#cbd5e1] bg-white px-2 py-1.5 text-[11px] sm:text-[11.5px] text-[#1e293b] placeholder:text-[#94a3b8] outline-none transition focus:border-[#d4a046] focus:ring-1 focus:ring-[#d4a046]/20 resize-none leading-snug"
                  value={formData.message}
                  onChange={(e) => setField("message", e.target.value)}
                />
              </div>
            </div>

            {/* Row 4: Agreement & Submit Button */}
            <div className="mt-3 pt-2.5 border-t border-[#f1f5f9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <label
                htmlFor="agreeToContact"
                className="flex items-center gap-2 text-xs font-medium text-[#475569] cursor-pointer select-none"
              >
                <input
                  id="agreeToContact"
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-[#cbd5e1] text-[#063120] focus:ring-[#063120]"
                  checked={formData.agreeToContact}
                  onChange={(e) => setField("agreeToContact", e.target.checked)}
                />
                <span>I agree to be contacted by ENSIS regarding my enquiry.</span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-lg bg-[#063120] hover:bg-[#0c442e] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white transition shadow-xs cursor-pointer disabled:opacity-50 shrink-0"
              >
                <Send size={12} className="rotate-45" />
                <span>{isSubmitting ? "SUBMITTING..." : "SUBMIT ENQUIRY"}</span>
                <span>→</span>
              </button>
            </div>
            {errors.agreeToContact && (
              <p className={errorClass}>{errors.agreeToContact}</p>
            )}
          </div>

          {/* Right: Sidebar Cards */}
          <aside className="flex flex-col gap-3.5 sm:gap-4 h-full">
            {/* Card 1: WHY CHOOSE ENSIS? with enquiry_new.png */}
            <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 border border-[#143b2c] shadow-sm min-h-[310px] lg:min-h-0 flex-1 flex flex-col justify-between">
              {/* Full Background from enquiry_new.png */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={enquiryNewImg}
                  alt="Why Choose ENSIS"
                  fill
                  className="object-cover object-right"
                  sizes="(max-width: 1024px) 100vw, 450px"
                  priority
                />
              </div>

              {/* Subtle gradient to ensure 100% text contrast on the left */}
              <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#042418]/95 via-[#042418]/70 to-transparent max-w-[65%] pointer-events-none" />

              <div className="relative z-10 max-w-[62%] sm:max-w-[64%] flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-xs sm:text-[13px] font-extrabold uppercase tracking-wide text-white">
                    WHY CHOOSE ENSIS?
                  </h3>
                  <div className="mt-1.5 mb-3 h-px w-full bg-white/20" />
                </div>

                <div className="space-y-3 sm:space-y-3.5 my-auto">
                  {whyChooseItems.map((item) => (
                    <div key={item.title} className="flex items-center gap-2.5 sm:gap-3">
                      <Image
                        src={item.icon}
                        alt={item.title}
                        width={46}
                        height={46}
                        className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 object-contain rounded-full shadow-xs"
                      />
                      <div>
                        <p className="text-[12px] sm:text-[13px] font-bold text-[#f5b838] leading-tight">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-[10.5px] sm:text-[11px] leading-[1.25] text-white/90">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: OUR PRESENCE ON MAP */}
            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 sm:p-5 shadow-xs shrink-0">
              <div className="flex items-start gap-2.5">
                <Image
                  src={mapPinBadge}
                  alt="Presence"
                  width={28}
                  height={28}
                  className="h-7 w-7 shrink-0 object-contain"
                />
                <div>
                  <h3 className="text-xs sm:text-[13px] font-extrabold uppercase tracking-wide text-[#0f2438]">
                    OUR PRESENCE ON MAP
                  </h3>
                  <p className="mt-0.5 text-[10px] sm:text-[10.5px] leading-tight text-[#64748b]">
                    Strategically located across India to serve our clients better.
                  </p>
                </div>
              </div>

              {/* Map & Right Column Row (Logo + View All Locations button below it) */}
              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="relative w-[185px] sm:w-[205px] h-[155px] sm:h-[168px] shrink-0">
                  <Image
                    src={footerMap}
                    alt="Presence in Delhi, Ghaziabad, Mumbai"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between items-center h-[155px] sm:h-[168px] pl-2 py-1">
                  <div className="w-full flex items-center justify-center pt-1">
                    <Image
                      src={designHouseLogo}
                      alt="Design House India Pvt. Ltd."
                      width={145}
                      height={65}
                      className="object-contain max-h-[75px]"
                    />
                  </div>
                  <a
                    href="/contact#map-section"
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#063120] hover:bg-[#0c442e] py-2 px-2.5 text-[11px] sm:text-[12px] font-bold text-white transition shadow-xs text-center"
                  >
                    <MapPin size={12} className="text-white fill-white shrink-0" />
                    <span>View All Locations</span>
                    <span className="text-[#f5b838]">→</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </form>
      </Container>
    </div>
  );
}
