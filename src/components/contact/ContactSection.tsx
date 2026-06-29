"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import { Container } from "../ui/Container";
import { verifyApi, API_URL } from "@/lib/api/api";
import Image from "next/image";
import SocialSidebar from "../layout/SocialSidebar";
import HtmlRenderer from "../layout/HtmlRender";

interface ContactDetailItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface ContactSectionContent {
  title: string;
  description: string;
  contactDetails: ContactDetailItem[];
  formImage:string;

}

const ContactSection = ({ sectionContent }: { sectionContent: ContactSectionContent }) => {
  const [formData, setFormData] = useState({ fullName: "", mobile: "", email: "", productType: "", message: "" });
  const [mobileOtp, setMobileOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  useEffect(() => {
    if (mobileTimer <= 0) return;
    const t = setInterval(() => setMobileTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [mobileTimer]);

  useEffect(() => {
    if (emailTimer <= 0) return;
    const t = setInterval(() => setEmailTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [emailTimer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "mobile") { setMobileVerified(false); setMobileOtpSent(false); }
    if (name === "email") { setEmailVerified(false); setEmailOtpSent(false); }
    setFormData({ ...formData, [name]: value });
  };

  const sendMobileOtp = async () => {
    if (!/^[0-9]{10,15}$/.test(formData.mobile.replace(/\D/g, ""))) { alert("Enter valid mobile number"); return; }
    try {
      setSendingMobileOtp(true);
      const res = await verifyApi.sendPhoneOtp(formData.mobile);
      if (res.success) { setMobileOtpSent(true); setMobileTimer(60); }
      else alert(res.message || "Failed");
    } catch (e: any) { alert(e.message); } finally { setSendingMobileOtp(false); }
  };

  const verifyMobileOtp = async () => {
    if (!mobileOtp) return;
    try {
      setVerifyingMobile(true);
      const res = await verifyApi.verifyPhoneOtp(formData.mobile, mobileOtp);
      if (res.success) { setMobileVerified(true); setMobileOtpSent(false); }
      else alert(res.message || "Invalid OTP");
    } catch (e: any) { alert(e.message); } finally { setVerifyingMobile(false); }
  };

  const sendEmailOtp = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { alert("Enter valid email"); return; }
    try {
      setSendingEmailOtp(true);
      const res = await verifyApi.sendEmailOtp(formData.email);
      if (res.success) { setEmailOtpSent(true); setEmailTimer(60); }
      else alert(res.message || "Failed");
    } catch (e: any) { alert(e.message); } finally { setSendingEmailOtp(false); }
  };

  const verifyEmailOtp = async () => {
    if (!emailOtp) return;
    try {
      setVerifyingEmail(true);
      const res = await verifyApi.verifyEmailOtp(formData.email, emailOtp);
      if (res.success) { setEmailVerified(true); setEmailOtpSent(false); }
      else alert(res.message || "Invalid OTP");
    } catch (e: any) { alert(e.message); } finally { setVerifyingEmail(false); }
  };

  const isFormValid = useMemo(() => (
    formData.fullName.trim() !== "" &&
    formData.mobile.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.productType.trim() !== "" &&
    formData.message.trim() !== "" &&
    mobileVerified && emailVerified
  ), [formData, mobileVerified, emailVerified]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/enquiry/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          mobileNumber: formData.mobile,
          email: formData.email,
          projectType: formData.productType,
          message: formData.message,
          agreeToContact: true,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      alert("Message sent successfully!");
      setFormData({ fullName: "", mobile: "", email: "", productType: "", message: "" });
      setMobileVerified(false);
      setEmailVerified(false);
    } catch { alert("Something went wrong.");
    } finally { setIsSubmitting(false); }
  };

  const inputClass = "w-full rounded-xl px-4 py-3 text-sm text-white/90 bg-[#1e4434] border border-[#2d5a43] placeholder:text-white/40 outline-none focus:border-[#D9B25F] transition-all";

  return (
    <section className="py-12 bg-[#faf6ef]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* LEFT — Contact Info */}
          <div className="bg-white rounded-2xl border border-[#ebe7df] p-7 md:p-9 shadow-sm">
            <h2 className="text-xl font-bold text-[#111]">{sectionContent.title || "Contact Information"}</h2>
            <div className="w-8 h-[3px] bg-[#D9B25F] mt-1.5 mb-7 rounded-full" />

            <div className="divide-y divide-[#f0ece5]">
              {sectionContent.contactDetails.map((detail) => (
                <div key={detail.id} className="flex items-start gap-4 py-4">
                  <div className="w-10 h-10 rounded-xl bg-[#f5f0e8] border border-[#ebe7df] flex items-center justify-center shrink-0">
                    <Image src={detail.icon} alt={detail.title} width={18} height={18} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[#111]">{detail.title}</p>
                    <HtmlRenderer className="text-[13px] text-[#6b7280] mt-0.5 leading-6" content={detail.description}></HtmlRenderer>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-sm font-bold text-[#111]">Follow Us</span>
              <SocialSidebar layout="horizontal" />
            </div>
          </div>

          {/* RIGHT — Form */}
          <div className="relative overflow-hidden rounded-2xl bg-[#163527] p-7 md:p-9 shadow-sm">
   {sectionContent.formImage && (
    <Image
      src={sectionContent.formImage}
      alt="form bg"
      fill
      className="absolute inset-0 object-cover opacity-20 pointer-events-none"
    />
  )}

  <div className="relative z-10">
            <h2 className="text-xl font-bold text-white">Send Us a Message</h2>
            <div className="w-8 h-[3px] bg-[#D9B25F] mt-1.5 mb-7 rounded-full" />

            <form className="space-y-3" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your Name" className={inputClass} />
                <div className="relative">
                  <input name="mobile" value={formData.mobile} onChange={handleChange} disabled={mobileVerified} placeholder="Mobile Number" className={`${inputClass} ${mobileVerified ? "border-green-500" : ""} pr-24`} />
                  {!mobileVerified ? (
                    <button type="button" onClick={sendMobileOtp} disabled={sendingMobileOtp || mobileTimer > 0 || !formData.mobile}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 px-2.5 rounded-lg bg-[#D9B25F] text-[#0f2e22] font-bold text-[10px] disabled:opacity-50">
                      {sendingMobileOtp ? "..." : mobileTimer > 0 ? `${mobileTimer}s` : mobileOtpSent ? "Resend" : "Send OTP"}
                    </button>
                  ) : <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400" size={16} />}
                </div>
              </div>

              {mobileOtpSent && !mobileVerified && (
                <div className="flex gap-2">
                  <input value={mobileOtp} onChange={e => setMobileOtp(e.target.value)} placeholder="Enter Mobile OTP" maxLength={6} className={inputClass} />
                  <button type="button" onClick={verifyMobileOtp} disabled={verifyingMobile || !mobileOtp}
                    className="px-5 rounded-xl bg-[#D9B25F] text-[#0f2e22] font-bold text-sm whitespace-nowrap">
                    {verifyingMobile ? "..." : "Verify"}
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <input name="email" type="email" value={formData.email} onChange={handleChange} disabled={emailVerified} placeholder="Email Address" className={`${inputClass} ${emailVerified ? "border-green-500" : ""} pr-24`} />
                  {!emailVerified ? (
                    <button type="button" onClick={sendEmailOtp} disabled={sendingEmailOtp || emailTimer > 0 || !formData.email}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 px-2.5 rounded-lg bg-[#D9B25F] text-[#0f2e22] font-bold text-[10px] disabled:opacity-50">
                      {sendingEmailOtp ? "..." : emailTimer > 0 ? `${emailTimer}s` : emailOtpSent ? "Resend" : "Send OTP"}
                    </button>
                  ) : <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400" size={16} />}
                </div>
                <select name="productType" value={formData.productType} onChange={handleChange} className={inputClass}>
                  <option value="">Select Product Type</option>
                  <option>Panchkarma Equipment</option>
                  <option>Wellness Interiors</option>
                  <option>Custom Solutions</option>
                </select>
              </div>

              {emailOtpSent && !emailVerified && (
                <div className="flex gap-2">
                  <input value={emailOtp} onChange={e => setEmailOtp(e.target.value)} placeholder="Enter Email OTP" maxLength={6} className={inputClass} />
                  <button type="button" onClick={verifyEmailOtp} disabled={verifyingEmail || !emailOtp}
                    className="px-5 rounded-xl bg-[#D9B25F] text-[#0f2e22] font-bold text-sm whitespace-nowrap">
                    {verifyingEmail ? "..." : "Verify"}
                  </button>
                </div>
              )}

              <textarea name="message" rows={5} value={formData.message} onChange={handleChange} placeholder="Your Message" className={`${inputClass} resize-none`} />

              <button type="submit" disabled={!isFormValid || isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#D9B25F] text-[#0f2e22] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#e8c16d] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <Send size={16} />
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              <p className="text-xs text-white/40 flex items-center gap-1.5">
                <span>🔒</span> Your information is safe with us.
              </p>
            </form>

          </div>
</div>
        </div>
      </Container>
    </section>
  );
};

export default ContactSection;