"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image, { StaticImageData } from "next/image";
import {
  Phone,
  Mail,
  User,
  LayoutGrid,
  MapPin,
  MessageSquare,
  Send,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Container } from "../ui/Container";
import { API_URL, verifyApi } from "@/lib/api/api";

// Visual assets from src/assets/contact
import flourishImg from "@/assets/contact/query_right.webp";
import leafLeft from "@/assets/contact/contact-left.webp";
import leafRight from "@/assets/contact/map-right.webp";
import headOfficeImg from "@/assets/contact/head-office.webp";
import delhiOfficeImg from "@/assets/contact/delhi-branch.webp";
import mumbaiOfficeImg from "@/assets/contact/mumbai-branch.webp";
import locationIcon from "@/assets/contact/location.webp";

export interface ContactDetailItem {
  id: string;
  icon?: string;
  title: string;
  description: string;
}

export interface ContactSectionContent {
  title?: string;
  description?: string;
  contactDetails?: ContactDetailItem[];
  formImage?: string;
}

interface OfficeInfo {
  id: string;
  category: string;
  city: string;
  address: string;
  image: StaticImageData;
  directionsUrl: string;
}

const OFFICES: OfficeInfo[] = [
  {
    id: "head-office",
    category: "Head Office",
    city: "GHAZIABAD",
    address: "Plot No. 12/29, Site-II Industrial Area, Mohan Nagar, Ghaziabad, Uttar Pradesh 201007, India",
    image: headOfficeImg,
    directionsUrl:
      "https://www.google.com/maps/dir//Ensis+(Best+Ayurvedic,+Spa+%26+Panchkarma+Equipment+Manufacturer+in+Delhi+NCR),+12%2F29+2nd+Floor,+Site-2,+Sunrise,+Industrial+Area,+Sahibabad,+Ghaziabad,+Uttar+Pradesh+201007/@28.6814285,77.3861532,17z/data=!4m17!1m7!3m6!1s0x390cf1ead9e1d9e5:0x31a2384cd903039b!2sEnsis+(Best+Ayurvedic,+Spa+%26+Panchkarma+Equipment+Manufacturer+in+Delhi+NCR)!8m2!3d28.6814285!4d77.3887281!16s%2Fg%2F11g4bcmf_7!4m8!1m0!1m5!1m1!1s0x390cf1ead9e1d9e5:0x31a2384cd903039b!2m2!1d77.3887281!2d28.6814285!3e3?entry=ttu",
  },
  {
    id: "delhi-branch",
    category: "Delhi Branch",
    city: "NEW DELHI",
    address: "Ground Floor, Main Market, E-1, opposite KFC, Kalkaji, New Delhi 110019, India",
    image: delhiOfficeImg,
    directionsUrl:
      "https://www.google.com/maps/dir//Ground+Floor,+E-1,+Main+Market,+opp.+KFC,+Kalkaji,+New+Delhi,+Delhi+110019/@28.5412495,77.2514574,17z",
  },
  {
    id: "mumbai-branch",
    category: "Mumbai Branch",
    city: "VASAI EAST",
    address: "Unit-II SR Compound, Plot No. 49/459, Opp. Dynamic Flow Company, Wakanpada Road, Vasai Phata, Vasai East - 401208, India",
    image: mumbaiOfficeImg,
    directionsUrl:
      "https://www.google.com/maps/dir//UNIT-IISR+Compound,+Plot+No+49%2F459.,+Opp+Dynamic+Flow+Company,+Wakanpada+Road,+Vasai+Phata,+Vasai+East+-+401208,+India/@19.398418,72.859664,17z",
  },
];

const ContactSection: React.FC<{ sectionContent?: ContactSectionContent }> = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    productType: "",
    projectLocation: "",
    message: "",
  });

  const [mobileOtp, setMobileOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileTimer, setMobileTimer] = useState(0);
  const [emailTimer, setEmailTimer] = useState(0);
  const [sendingMobileOtp, setSendingMobileOtp] = useState(false);
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [verifyingMobile, setVerifyingMobile] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  useEffect(() => {
    if (mobileTimer <= 0) return;
    const t = setInterval(() => setMobileTimer((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [mobileTimer]);

  useEffect(() => {
    if (emailTimer <= 0) return;
    const t = setInterval(() => setEmailTimer((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [emailTimer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "mobile") {
      setMobileVerified(false);
      setMobileOtpSent(false);
    }
    if (name === "email") {
      setEmailVerified(false);
      setEmailOtpSent(false);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const sendMobileOtp = async () => {
    const cleanMobile = formData.mobile.replace(/\D/g, "");
    if (!/^[0-9]{10,15}$/.test(cleanMobile)) {
      setStatus({ type: "error", message: "Please enter a valid 10-digit mobile number." });
      return;
    }
    try {
      setSendingMobileOtp(true);
      setStatus({ type: null, message: "" });
      const res = await verifyApi.sendPhoneOtp(formData.mobile);
      if (res?.success) {
        setMobileOtpSent(true);
        setMobileTimer(60);
      } else {
        setStatus({ type: "error", message: res?.message || "Failed to send mobile OTP." });
      }
    } catch {
      setStatus({ type: "error", message: "Error sending mobile OTP. Please try again." });
    } finally {
      setSendingMobileOtp(false);
    }
  };

  const verifyMobileOtp = async () => {
    if (!mobileOtp.trim()) return;
    try {
      setVerifyingMobile(true);
      const res = await verifyApi.verifyPhoneOtp(formData.mobile, mobileOtp.trim());
      if (res?.success) {
        setMobileVerified(true);
        setMobileOtpSent(false);
        setStatus({ type: null, message: "" });
      } else {
        setStatus({ type: "error", message: res?.message || "Invalid mobile OTP entered." });
      }
    } catch {
      setStatus({ type: "error", message: "Failed to verify mobile OTP." });
    } finally {
      setVerifyingMobile(false);
    }
  };

  const sendEmailOtp = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }
    try {
      setSendingEmailOtp(true);
      setStatus({ type: null, message: "" });
      const res = await verifyApi.sendEmailOtp(formData.email.trim());
      if (res?.success) {
        setEmailOtpSent(true);
        setEmailTimer(60);
      } else {
        setStatus({ type: "error", message: res?.message || "Failed to send email OTP." });
      }
    } catch {
      setStatus({ type: "error", message: "Error sending email OTP. Please try again." });
    } finally {
      setSendingEmailOtp(false);
    }
  };

  const verifyEmailOtp = async () => {
    if (!emailOtp.trim()) return;
    try {
      setVerifyingEmail(true);
      const res = await verifyApi.verifyEmailOtp(formData.email.trim(), emailOtp.trim());
      if (res?.success) {
        setEmailVerified(true);
        setEmailOtpSent(false);
        setStatus({ type: null, message: "" });
      } else {
        setStatus({ type: "error", message: res?.message || "Invalid email OTP entered." });
      }
    } catch {
      setStatus({ type: "error", message: "Failed to verify email OTP." });
    } finally {
      setVerifyingEmail(false);
    }
  };

  const isFormValid = useMemo(() => {
    return (
      formData.fullName.trim() !== "" &&
      formData.mobile.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.productType.trim() !== "" &&
      formData.message.trim() !== "" &&
      mobileVerified &&
      emailVerified
    );
  }, [formData, mobileVerified, emailVerified]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileVerified || !emailVerified) {
      setStatus({
        type: "error",
        message: "Please verify both Mobile Number and Email Address with OTP.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const res = await fetch(`${API_URL}/enquiry/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "contact",
          fullName: formData.fullName,
          mobileNumber: formData.mobile,
          email: formData.email,
          projectType: formData.productType || "General Enquiry",
          city: formData.projectLocation,
          message: formData.message || "Enquiry from website contact page",
          agreeToContact: true,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit enquiry.");
      }

      setStatus({
        type: "success",
        message: "Thank you! Your enquiry has been received. Our team will contact you shortly.",
      });
      setFormData({
        fullName: "",
        mobile: "",
        email: "",
        productType: "",
        projectLocation: "",
        message: "",
      });
      setMobileVerified(false);
      setEmailVerified(false);
      setMobileOtp("");
      setEmailOtp("");
    } catch {
      setStatus({
        type: "error",
        message: "Something went wrong while sending your message. Please call us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[#faf6ef] pt-1 sm:pt-2 pb-0 relative overflow-hidden">
      {/* Decorative botanical floating leaves */}
      <div className="pointer-events-none absolute left-0 bottom-10 sm:bottom-14 z-20 w-24 sm:w-32 md:w-36 select-none opacity-90">
        <Image src={leafLeft} alt="Decorative Leaf" className="w-full h-auto object-contain" />
      </div>
      <div className="pointer-events-none absolute right-0 bottom-3 sm:bottom-6 z-20 w-24 sm:w-32 md:w-36 select-none opacity-90">
        <Image src={leafRight} alt="Decorative Leaf" className="w-full h-auto object-contain" />
      </div>

      <Container className="relative z-10 max-w-[1400px] px-3 sm:px-6 py-0">
        {/* 3-Card Row: Contact Information, Send Us an Enquiry & Our Offices */}
        <div className="grid grid-cols-1 lg:grid-cols-[28.5%_35.5%_36%] gap-4 xl:gap-5 items-stretch">

          {/* CARD 1 — Contact Information */}
          <div className="bg-white rounded-2xl border border-[#ebe7df] p-4 shadow-xs flex flex-col">
            <div>
              <h2 className="text-md sm:text-lg font-[800] text-[#0a1e36] tracking-tight">Contact Information</h2>
              <div className="w-8 h-[2.5px] bg-[#f59e0b] rounded-full mt-1.5 mb-4" />

              {/* Contact detail rows */}
              <div className="space-y-4">
                {/* Phone Number */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fef5e7] flex items-center justify-center shrink-0">
                    <Phone className="size-4.5 text-[#d97706]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-[13px] font-bold text-[#0a1e36]">Phone Number</h4>
                    <p className="text-[13px] sm:text-[13.5px] text-[#2d4059] mt-0.5 font-medium leading-relaxed">
                      <a href="tel:+919654900525" className="hover:text-[#c87a14] transition-colors whitespace-nowrap">+91 9654900525</a>
                      <span className="mx-1.5 text-gray-300 font-normal">|</span>
                      <a href="tel:+919810242841" className="hover:text-[#c87a14] transition-colors whitespace-nowrap">+91 9810242841</a>
                    </p>
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fef5e7] flex items-center justify-center shrink-0">
                    <Mail className="size-4.5 text-[#d97706]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-[13px] font-bold text-[#0a1e36]">Email Address</h4>
                    <a
                      href="mailto:info@ensis.in"
                      className="text-[13px] sm:text-[13.5px] text-[#2d4059] hover:text-[#c87a14] transition-colors mt-0.5 block font-medium leading-relaxed"
                    >
                      info@ensis.in
                    </a>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#fef5e7] flex items-center justify-center shrink-0">
                    <Clock className="size-4.5 text-[#d97706]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-[13px] font-bold text-[#0a1e36]">Business Hours</h4>
                    <p className="text-[13px] sm:text-[13.5px] text-[#2d4059] mt-0.5 leading-snug font-medium">
                      Monday – Saturday
                      <br />
                      <span className="font-medium text-[#2d4059]">9:00 AM – 6:00 PM (IST)</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Follow Us footer - moved up, clear top border, justify-between */}
              <div className="mt-5 pt-3.5 border-t border-[#ebe7df] flex items-center justify-between">
                <span className="text-xs sm:text-[13px] font-bold text-[#0a1e36]">Follow Us</span>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <a
                    href="https://www.facebook.com/ensis.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1877f2] hover:opacity-90 flex items-center justify-center text-white transition-transform hover:scale-110 shadow-2xs"
                  >
                    <FaFacebookF className="size-3.5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/ensis-in"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0a66c2] hover:opacity-90 flex items-center justify-center text-white transition-transform hover:scale-110 shadow-2xs"
                  >
                    <FaLinkedinIn className="size-3.5" />
                  </a>
                  <a
                    href="https://www.youtube.com/@ensis-in"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#ff0000] hover:opacity-90 flex items-center justify-center text-white transition-transform hover:scale-110 shadow-2xs"
                  >
                    <FaYoutube className="size-3.5" />
                  </a>
                  <a
                    href="https://twitter.com/ensis_in"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X (formerly Twitter)"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black hover:opacity-90 flex items-center justify-center text-white transition-transform hover:scale-110 shadow-2xs"
                  >
                    <FaXTwitter className="size-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2 — Send Us an Enquiry */}
          <div className="relative overflow-hidden rounded-2xl bg-[#0c2e22] p-4 shadow-sm flex flex-col justify-between border border-[#143b2c]">
            {/* Elegant botanical corner watermark */}
            <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none opacity-25">
              <Image src={flourishImg} alt="Botanical Flourish" fill className="object-contain object-top-right" />
            </div>

            <div className="relative z-10">
              <h2 className="text-md sm:text-lg font-bold text-white tracking-tight">Send Us an Enquiry</h2>
              <div className="w-8 h-[2.5px] bg-[#f59e0b] rounded-full mt-1.5 mb-2" />
              <p className="text-xs text-emerald-100/80 mb-3 leading-tight">
                Share your requirements and our team will get back to you shortly.
              </p>

              {status.type && (
                <div
                  className={`mb-2.5 p-2 rounded-md text-xs flex items-center gap-2 ${status.type === "success"
                    ? "bg-emerald-950/80 text-emerald-300 border border-emerald-700/60"
                    : "bg-red-950/80 text-red-300 border border-red-700/60"
                    }`}
                >
                  {status.type === "success" ? (
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertCircle className="size-4 shrink-0 text-red-400" />
                  )}
                  <span>{status.message}</span>
                </div>
              )}

              <form className="space-y-2 sm:space-y-2.5" onSubmit={handleSubmit}>
                {/* Row 1: Full Name & Mobile Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                  <div className="bg-white rounded-lg flex items-center px-3 py-2 sm:py-2.5 border border-transparent focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400 shadow-2xs transition">
                    <User className="text-gray-400 shrink-0 mr-2 size-4" />
                    <input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Full Name *"
                      className="w-full text-xs sm:text-[13px] text-gray-800 placeholder:text-gray-400 outline-none bg-transparent"
                    />
                  </div>

                  <div>
                    <div className={`bg-white rounded-lg flex items-center px-3 py-2 sm:py-2.5 border ${mobileVerified ? "border-emerald-500" : "border-transparent"} focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400 shadow-2xs transition`}>
                      <Phone className="text-gray-400 shrink-0 mr-2 size-4" />
                      <input
                        name="mobile"
                        type="tel"
                        value={formData.mobile}
                        onChange={handleChange}
                        disabled={mobileVerified}
                        required
                        placeholder="Mobile Number *"
                        className="w-full text-xs sm:text-[13px] text-gray-800 placeholder:text-gray-400 outline-none bg-transparent pr-1"
                      />
                      {!mobileVerified ? (
                        <button
                          type="button"
                          onClick={sendMobileOtp}
                          disabled={sendingMobileOtp || mobileTimer > 0 || !formData.mobile}
                          className="px-2 py-0.5 rounded bg-[#f5b335] text-slate-900 font-bold text-[10px] sm:text-xs hover:bg-[#e6a225] shrink-0 disabled:opacity-50 transition cursor-pointer"
                        >
                          {sendingMobileOtp ? "..." : mobileTimer > 0 ? `${mobileTimer}s` : mobileOtpSent ? "Resend" : "Send OTP"}
                        </button>
                      ) : (
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                      )}
                    </div>

                    {/* Mobile OTP Entry Row */}
                    {mobileOtpSent && !mobileVerified && (
                      <div className="flex gap-1.5 mt-1">
                        <input
                          value={mobileOtp}
                          onChange={(e) => setMobileOtp(e.target.value)}
                          placeholder="Enter OTP"
                          maxLength={6}
                          className="flex-1 bg-white rounded-md px-2.5 py-1 text-xs text-gray-800 placeholder:text-gray-400 outline-none border border-amber-300"
                        />
                        <button
                          type="button"
                          onClick={verifyMobileOtp}
                          disabled={verifyingMobile || !mobileOtp.trim()}
                          className="px-2.5 py-1 rounded-md bg-[#f5b335] text-slate-900 font-bold text-xs hover:bg-[#e6a225] disabled:opacity-50 transition cursor-pointer"
                        >
                          {verifyingMobile ? "..." : "Verify"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 2: Email Address & Product Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                  <div>
                    <div className={`bg-white rounded-lg flex items-center px-3 py-2 sm:py-2.5 border ${emailVerified ? "border-emerald-500" : "border-transparent"} focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400 shadow-2xs transition`}>
                      <Mail className="text-gray-400 shrink-0 mr-2 size-4" />
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={emailVerified}
                        required
                        placeholder="Email Address *"
                        className="w-full text-xs sm:text-[13px] text-gray-800 placeholder:text-gray-400 outline-none bg-transparent pr-1"
                      />
                      {!emailVerified ? (
                        <button
                          type="button"
                          onClick={sendEmailOtp}
                          disabled={sendingEmailOtp || emailTimer > 0 || !formData.email}
                          className="px-2 py-0.5 rounded bg-[#f5b335] text-slate-900 font-bold text-[10px] sm:text-xs hover:bg-[#e6a225] shrink-0 disabled:opacity-50 transition cursor-pointer"
                        >
                          {sendingEmailOtp ? "..." : emailTimer > 0 ? `${emailTimer}s` : emailOtpSent ? "Resend" : "Send OTP"}
                        </button>
                      ) : (
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                      )}
                    </div>

                    {/* Email OTP Entry Row */}
                    {emailOtpSent && !emailVerified && (
                      <div className="flex gap-1.5 mt-1">
                        <input
                          value={emailOtp}
                          onChange={(e) => setEmailOtp(e.target.value)}
                          placeholder="Enter OTP"
                          maxLength={6}
                          className="flex-1 bg-white rounded-md px-2.5 py-1 text-xs text-gray-800 placeholder:text-gray-400 outline-none border border-amber-300"
                        />
                        <button
                          type="button"
                          onClick={verifyEmailOtp}
                          disabled={verifyingEmail || !emailOtp.trim()}
                          className="px-2.5 py-1 rounded-md bg-[#f5b335] text-slate-900 font-bold text-xs hover:bg-[#e6a225] disabled:opacity-50 transition cursor-pointer"
                        >
                          {verifyingEmail ? "..." : "Verify"}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg flex items-center px-3 py-2 sm:py-2.5 border border-transparent focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400 shadow-2xs relative">
                    <LayoutGrid className="text-gray-400 shrink-0 mr-2 size-4" />
                    <select
                      name="productType"
                      value={formData.productType}
                      onChange={handleChange}
                      required
                      className="w-full text-xs sm:text-[13px] text-gray-800 outline-none bg-transparent appearance-none cursor-pointer pr-4"
                    >
                      <option value="">Select Product Type *</option>
                      <option value="Panchkarma Equipment">Panchkarma Equipment</option>
                      <option value="Wellness Interiors">Wellness Interiors</option>
                      <option value="Custom Solutions">Custom Solutions</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none size-4" />
                  </div>
                </div>

                {/* Row 3: Project Location */}
                <div className="bg-white rounded-lg flex items-center px-3 py-2 sm:py-2.5 border border-transparent focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400 shadow-2xs transition">
                  <MapPin className="text-gray-400 shrink-0 mr-2 size-4" />
                  <input
                    name="projectLocation"
                    value={formData.projectLocation}
                    onChange={handleChange}
                    placeholder="Project Location"
                    className="w-full text-xs sm:text-[13px] text-gray-800 placeholder:text-gray-400 outline-none bg-transparent"
                  />
                </div>

                {/* Row 4: Your Message */}
                <div className="bg-white rounded-lg flex items-start px-3 py-2 sm:py-2.5 border border-transparent focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400 shadow-2xs transition">
                  <MessageSquare className="text-gray-400 shrink-0 mr-2 size-4 mt-0.5" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={2}
                    placeholder="Your Message *&#10;Tell us about your requirement..."
                    className="w-full text-xs sm:text-[13px] text-gray-800 placeholder:text-gray-400 outline-none bg-transparent resize-none leading-snug"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#f5b335] hover:bg-[#e6a225] active:scale-[0.99] text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-1"
                >
                  <Send className="size-4" />
                  <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                  <ArrowRight className="size-4" />
                </button>
              </form>

              {/* Security badge */}
              <p className="text-[11px] text-white/75 flex items-center gap-1.5 mt-2 font-medium">
                <span className="text-amber-400">🔒</span>
                <span>Your information is safe with us.</span>
              </p>
            </div>
          </div>

          {/* CARD 3 — Our Offices */}
          <div className="bg-white rounded-2xl border border-[#ebe7df] p-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2 sm:mb-2.5">
                <div>
                  <h2 className="text-md sm:text-lg font-[800] text-[#0a1e36]">Our Offices</h2>
                  <div className="w-8 h-[2.5px] bg-[#f59e0b] rounded-full mt-1" />
                </div>
                <a
                  href="#map-section"
                  className="rounded-lg border border-gray-300 px-3 py-1 text-[11px] sm:text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 transition"
                >
                  <span>View All Locations</span>
                  <ArrowRight className="size-3" />
                </a>
              </div>

              {/* Office List */}
              <div className="divide-y divide-[#f2ede4]">
                {OFFICES.map((office) => (
                  <div key={office.id} className="flex items-start gap-2.5 sm:gap-3 py-2 sm:py-2.5 first:pt-0.5 last:pb-0.5">
                    {/* Thumbnail Image */}
                    <div className="relative w-18 sm:w-20 md:w-22 h-16 sm:h-18 rounded-xl overflow-hidden shrink-0 border border-gray-100 shadow-2xs mt-0.5">
                      <Image
                        src={office.image}
                        alt={`${office.category} - ${office.city}`}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Address Content - Complete address, NO ellipsis, tight line height and spacing */}
                    <div className="flex-1 min-w-0 pr-1">
                      <p className="text-[12px] sm:text-[12.5px] font-bold text-[#e05a2b] leading-tight">
                        {office.category}
                      </p>
                      <p className="text-[13.5px] sm:text-[14px] font-extrabold text-[#0a1e36] mt-0.5 leading-tight tracking-wide">
                        {office.city}
                      </p>
                      <p className="text-[11.5px] sm:text-[12px] text-[#5a6b82] leading-[1.35] mt-1 font-normal">
                        {office.address}
                      </p>
                    </div>

                    {/* Get Directions Action Button */}
                    <a
                      href={office.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 sm:w-16 self-stretch min-h-[64px] rounded-xl bg-[#f0f4f9] hover:bg-[#e4ecf7] transition flex flex-col items-center justify-center p-1.5 text-center shrink-0 border border-[#e2e8f0] shadow-2xs group"
                    >
                      <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-white shadow-xs flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                        <Image
                          src={locationIcon}
                          alt="Directions"
                          width={18}
                          height={18}
                          className="w-4.5 h-4.5 object-contain"
                        />
                      </div>
                      <span className="text-[9.5px] sm:text-[10px] font-bold text-[#0a1e36] group-hover:text-blue-700 leading-tight">
                        Get
                        <br />
                        Directions
                      </span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM FULL-WIDTH BANNER — Actual Interactive Google Map (Slim & Compact) */}
        <div
          id="map-section"
          className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm h-[85px] sm:h-[95px] md:h-[105px] bg-slate-100 mt-3.5 sm:mt-4 group"
        >
          {/* Actual Embedded Google Map */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.2746923971895!2d77.386153175291!3d28.681428475638054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf1ead9e1d9e5%3A0x31a2384cd903039b!2sEnsis%20(Best%20Ayurvedic%2C%20Spa%20%26%20Panchkarma%20Equipment%20Manufacturer%20in%20Delhi%20NCR)!5e0!3m2!1sen!2sin!4v1782911335816!5m2!1sen!2sin"
            title="Google Maps location of Ensis"
            className="w-full h-full border-0 absolute inset-0 pointer-events-auto"
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />

          {/* Left Overlay Card */}
          <div className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-4 md:left-5 z-10 bg-white/95 backdrop-blur-md p-2 sm:p-2.5 rounded-xl border border-gray-100/90 shadow-sm flex items-center gap-2 sm:gap-2.5 max-w-[330px] pointer-events-auto">
            <div className="w-8 h-8 rounded-full bg-[#fef5e7] flex items-center justify-center shrink-0 text-[#e88a1a]">
              <MapPin className="size-4 text-[#e88a1a]" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#0f2438] leading-tight">Find Us on Map</h3>
              <p className="text-[10px] text-gray-600 mt-0.5 leading-tight">
                Locate our offices easily across India.
              </p>
              <a
                href={OFFICES[0].directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0f2438] hover:bg-[#1a3a56] text-white text-[9.5px] font-semibold shadow-2xs transition mt-1"
              >
                <span>Open in Google Maps</span>
                <ArrowRight className="size-2.5" />
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ContactSection;