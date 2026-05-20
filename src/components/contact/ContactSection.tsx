"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Globe,
  Send,
  User,
  Package,
  PencilLine,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Container } from "../ui/Container";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import Link from "next/link";
import { verifyApi } from "@/app/lib/api";
// import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  // const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    productType: "",
    message: "",
  });

  // OTP States
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

  // Timers
  useEffect(() => {
    if (mobileTimer <= 0) return;

    const timer = setInterval(() => {
      setMobileTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [mobileTimer]);

  useEffect(() => {
    if (emailTimer <= 0) return;

    const timer = setInterval(() => {
      setEmailTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [emailTimer]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Reset verification when changed
    if (name === "mobile") {
      setMobileVerified(false);
      setMobileOtpSent(false);
    }

    if (name === "email") {
      setEmailVerified(false);
      setEmailOtpSent(false);
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // SEND MOBILE OTP
  const sendMobileOtp = async () => {
    const mobile = formData.mobile.replace(/\D/g, "");

    if (!/^[0-9]{10,15}$/.test(mobile)) {
      alert("Enter valid mobile number");
      return;
    }

    try {
      setSendingMobileOtp(true);

      const res = await verifyApi.sendPhoneOtp(formData.mobile);

      if (res.success) {
        setMobileOtpSent(true);
        setMobileTimer(60);

        // toast({
        //   title: "OTP Sent",
        //   description: "Mobile OTP sent successfully",
        // });

        alert("Mobile OTP sent successfully");
      } else {
        alert(res.message || "Failed to send OTP");
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSendingMobileOtp(false);
    }
  };

  // VERIFY MOBILE OTP
  const verifyMobileOtp = async () => {
    if (!mobileOtp) return;

    try {
      setVerifyingMobile(true);

      const res = await verifyApi.verifyPhoneOtp(
        formData.mobile,
        mobileOtp
      );

      if (res.success) {
        setMobileVerified(true);
        setMobileOtpSent(false);

        alert("Mobile verified successfully");
      } else {
        alert(res.message || "Invalid OTP");
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setVerifyingMobile(false);
    }
  };

  // SEND EMAIL OTP
  const sendEmailOtp = async () => {
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      alert("Enter valid email");
      return;
    }

    try {
      setSendingEmailOtp(true);

      const res = await verifyApi.sendEmailOtp(formData.email);

      if (res.success) {
        setEmailOtpSent(true);
        setEmailTimer(60);

        alert("Email OTP sent successfully");
      } else {
        alert(res.message || "Failed to send OTP");
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSendingEmailOtp(false);
    }
  };

  // VERIFY EMAIL OTP
  const verifyEmailOtp = async () => {
    if (!emailOtp) return;

    try {
      setVerifyingEmail(true);

      const res = await verifyApi.verifyEmailOtp(
        formData.email,
        emailOtp
      );

      if (res.success) {
        setEmailVerified(true);
        setEmailOtpSent(false);

        alert("Email verified successfully");
      } else {
        alert(res.message || "Invalid OTP");
      }
    } catch (error: any) {
      alert(error.message);
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

  return (
    <section className="relative">
      {/* Background Blur Plants */}
      <div className="absolute top-0 left-0 w-56 h-56 bg-[#d8d1c3]/30 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#d8d1c3]/20 blur-3xl rounded-full translate-x-1/3 translate-y-1/3" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Contact Details */}
          <div className="bg-white rounded-[28px] border border-[#ebe7df] shadow-[0_10px_40px_rgba(0,0,0,0.04)] p-4 md:p-5">
            <div className="text-center mb-2">
              <h2 className="text-[#20351f] text-xl md:text-2xl font-serif font-semibold mb-2">
                Get In Touch
              </h2>

              <div className="w-16 h-[2px] bg-[#d4b06a] mx-auto mb-2" />

              <p className="text-[#6f6f6f] text-sm max-w-md mx-auto">
                Have a question or need assistance? We’re here to help you on
                your wellness journey.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex gap-5 pb-2 border-b border-[#f0ece5]">
                <div className="min-w-[58px] h-[58px] rounded-full bg-[#faf6ee] flex items-center justify-center">
                  <MapPin
                    className="text-[#c8a45d]"
                    size={24}
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <h3 className="text-[#20351f] text-base font-semibold mb-2">
                    Address
                  </h3>

                  <p className="text-[#555] text-[15px]">
                    <span className="text-[#20351f]">
                      12/29, Site-II, Loni Road, Industrial Area,Mohan Nagar -
                      201007, Ghaziabad, Uttar Pradesh, India
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-5 pb-2 border-b border-[#f0ece5]">
                <div className="min-w-[58px] h-[58px] rounded-full bg-[#faf6ee] flex items-center justify-center">
                  <Link href="tel:+919654900525">
                    <Phone
                      className="text-[#c8a45d]"
                      size={24}
                      strokeWidth={1.8}
                    />
                  </Link>
                </div>

                <div>
                  <h3 className="text-[#20351f] text-base font-semibold mb-2">
                    Call Us
                  </h3>

                  <p className="text-[#555] text-[15px]">
                    <Link href="tel:+919654900525">
                      <span className="text-[#20351f]">
                        +91-9654900525
                      </span>
                    </Link>

                    <br />

                    <span className="text-xs">
                      Mon – Sat, 9:00 AM – 6:00 PM (GST)
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-5 pb-2 border-b border-[#f0ece5]">
                <div className="min-w-[58px] h-[58px] rounded-full bg-[#faf6ee] flex items-center justify-center">
                  <Link href="mailto:info@ensis.in">
                    <Mail
                      className="text-[#c8a45d]"
                      size={24}
                      strokeWidth={1.8}
                    />
                  </Link>
                </div>

                <div>
                  <h3 className="text-[#20351f] text-base font-semibold mb-2">
                    Email
                  </h3>

                  <p className="text-[#555] text-[15px]">
                    <Link href="mailto:info@ensis.in">
                      <span className="text-[#20351f]">
                        info@ensis.in
                      </span>
                    </Link>

                    <br />

                    <span className="text-xs">
                      We'll respond within 24 hours
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-5 pb-2 border-b border-[#f0ece5]">
                <div className="min-w-[58px] h-[58px] rounded-full bg-[#faf6ee] flex items-center justify-center">
                  <Clock
                    className="text-[#c8a45d]"
                    size={24}
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <h3 className="text-[#20351f] text-base font-semibold mb-2">
                    Business Hours
                  </h3>

                  <p className="text-[#555] text-[15px]">
                    <span className=" text-[#20351f]">
                      Mon – Sat: 9:00 AM – 6:00 PM
                    </span>

                    <br />

                    <span className="text-xs">
                      Sunday: Closed
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="min-w-[58px] h-[58px] rounded-full bg-[#faf6ee] flex items-center justify-center">
                  <Globe
                    className="text-[#c8a45d]"
                    size={24}
                    strokeWidth={1.8}
                  />
                </div>

                <div>
                  <h3 className="text-[#20351f] text-base font-semibold mb-2">
                    Social
                  </h3>

                  <div className="flex gap-3">
                    {[
                      {
                        url: "https://www.facebook.com/EnsisPanchkarmaSpaSolutions",
                        icon: <FaFacebook />,
                      },
                      {
                        url: "https://x.com/Ensis9",
                        icon: <FaTwitter />,
                      },
                      {
                        url: "https://www.instagram.com/solutionensis/",
                        icon: <FaInstagram />,
                      },
                      {
                        url: "https://www.linkedin.com/company/ensis-panchkarma-and-spa-solutions/",
                        icon: <FaLinkedin />,
                      },
                      {
                        url: "https://ensis.in/",
                        icon: <Globe />,
                      },
                      {
                        url: "https://www.youtube.com/channel/UCbREPw5Nyi0DqpByPdaS-3w",
                        icon: <FaYoutube />,
                      },
                    ].map((item, index) => (
                      <Link
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={index}
                        className="w-8 h-8 rounded-full border border-[#e8d7b3] text-[#c8a45d] hover:bg-[#20351f] hover:text-white! transition-all duration-300 flex items-center justify-center text-lg"
                      >
                        {React.cloneElement(item.icon, {
                          className: "transition-colors duration-300",
                        })}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-[28px] border border-[#ebe7df] shadow-[0_10px_40px_rgba(0,0,0,0.04)] p-4 md:p-5">
            <div className="text-center mb-2">
              <h2 className="text-[#20351f] text-xl md:text-2xl font-serif font-semibold mb-2">
                Send Us a Message
              </h2>

              <div className="w-16 h-[2px] bg-[#d4b06a] mx-auto mb-2" />
            </div>

            <form className="space-y-2">
              {/* Row 1 */}
              <div className="flex items-center gap-4">
                {/* Full Name */}
                <div className="relative w-full">
                  <User
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-[#c8a45d]"
                    size={20}
                    strokeWidth={1.8}
                  />

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full h-16 rounded-2xl border border-[#ece7de] bg-[#fff] pl-14 pr-5 text-[15px] outline-none focus:border-[#c8a45d] transition-all"
                  />
                </div>

                {/* Mobile */}
                <div className="relative w-full">
                  <Phone
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-[#c8a45d]"
                    size={20}
                    strokeWidth={1.8}
                  />

                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    disabled={mobileVerified}
                    placeholder="Mobile Number"
                    className={`w-full h-16 rounded-2xl border border-[#ece7de] bg-[#fff] pl-14 pr-32 text-[15px] outline-none focus:border-[#c8a45d] transition-all ${
                      mobileVerified
                        ? "border-green-500 bg-green-50"
                        : ""
                    }`}
                  />

                  {!mobileVerified ? (
                    <button
                      type="button"
                      onClick={sendMobileOtp}
                      disabled={
                        sendingMobileOtp ||
                        mobileTimer > 0 ||
                        !formData.mobile
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-10 px-4 rounded-xl bg-[#c8a45d] text-[#183b17] font-semibold text-xs hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      {sendingMobileOtp
                        ? "..."
                        : mobileTimer > 0
                        ? `${mobileTimer}s`
                        : mobileOtpSent
                        ? "Resend"
                        : "Send OTP"}
                    </button>
                  ) : (
                    <CheckCircle2
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-green-500"
                      size={22}
                    />
                  )}
                </div>
              </div>

              {/* Mobile OTP */}
              {mobileOtpSent && !mobileVerified && (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={mobileOtp}
                    onChange={(e) => setMobileOtp(e.target.value)}
                    placeholder="Enter Mobile OTP"
                    maxLength={6}
                    className="w-full h-14 rounded-2xl border border-[#ece7de] bg-[#fff] px-5 text-[15px] outline-none focus:border-[#c8a45d]"
                  />

                  <button
                    type="button"
                    onClick={verifyMobileOtp}
                    disabled={verifyingMobile || !mobileOtp}
                    className="min-w-[120px] h-14 rounded-2xl bg-[#183b17] text-white font-semibold text-sm"
                  >
                    {verifyingMobile ? "..." : "Verify"}
                  </button>
                </div>
              )}

              {/* Row 2 */}
              <div className="flex items-center gap-4">
                {/* Email */}
                <div className="relative w-full">
                  <Mail
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-[#c8a45d]"
                    size={20}
                    strokeWidth={1.8}
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={emailVerified}
                    placeholder="Email Address"
                    className={`w-full h-16 rounded-2xl border border-[#ece7de] bg-[#fff] pl-14 pr-32 text-[15px] outline-none focus:border-[#c8a45d] transition-all ${
                      emailVerified
                        ? "border-green-500 bg-green-50"
                        : ""
                    }`}
                  />

                  {!emailVerified ? (
                    <button
                      type="button"
                      onClick={sendEmailOtp}
                      disabled={
                        sendingEmailOtp ||
                        emailTimer > 0 ||
                        !formData.email
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-10 px-4 rounded-xl bg-[#c8a45d] text-[#183b17] font-semibold text-xs hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      {sendingEmailOtp
                        ? "..."
                        : emailTimer > 0
                        ? `${emailTimer}s`
                        : emailOtpSent
                        ? "Resend"
                        : "Send OTP"}
                    </button>
                  ) : (
                    <CheckCircle2
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-green-500"
                      size={22}
                    />
                  )}
                </div>

                {/* Product */}
                <div className="relative w-full">
                  <Package
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-[#c8a45d]"
                    size={20}
                    strokeWidth={1.8}
                  />

                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleChange}
                    className="w-full h-16 rounded-2xl border border-[#ece7de] bg-[#fff] pl-14 pr-5 text-[15px] outline-none focus:border-[#c8a45d] transition-all appearance-none text-[#777]"
                  >
                    <option value="">Select Product Type</option>
                    <option>Panchkarma Equipment</option>
                    <option>Wellness Interiors</option>
                    <option>Custom Solutions</option>
                  </select>
                </div>
              </div>

              {/* Email OTP */}
              {emailOtpSent && !emailVerified && (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                    placeholder="Enter Email OTP"
                    maxLength={6}
                    className="w-full h-14 rounded-2xl border border-[#ece7de] bg-[#fff] px-5 text-[15px] outline-none focus:border-[#c8a45d]"
                  />

                  <button
                    type="button"
                    onClick={verifyEmailOtp}
                    disabled={verifyingEmail || !emailOtp}
                    className="min-w-[120px] h-14 rounded-2xl bg-[#183b17] text-white font-semibold text-sm"
                  >
                    {verifyingEmail ? "..." : "Verify"}
                  </button>
                </div>
              )}

              {/* Textarea */}
              <div className="relative">
                <PencilLine
                  className="absolute left-5 top-6 text-[#c8a45d]"
                  size={20}
                  strokeWidth={1.8}
                />

                <textarea
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about yourself"
                  className="w-full rounded-2xl border border-[#ece7de] bg-[#fff] pl-14 pr-5 py-5 text-[15px] outline-none focus:border-[#c8a45d] transition-all resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full h-16 rounded-2xl text-white text-lg font-medium flex items-center justify-center gap-3 transition-all duration-300 ${
                  isFormValid
                    ? "bg-gradient-to-r from-[#183b17] to-[#2f5a21] hover:opacity-95 cursor-pointer"
                    : "bg-gray-500 cursor-not-allowed opacity-70"
                }`}
              >
                <Send size={18} />
                Send Message
              </button>

              <div className="flex items-center justify-center gap-2 pt-2">
                <div className="w-6 h-6 rounded-full border border-[#e8d7b3] flex items-center justify-center">
                  <span className="text-[#c8a45d] text-xs">✓</span>
                </div>

                <p className="text-sm text-[#7a7a7a]">
                  We’ll get back to you as soon as possible.
                </p>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ContactSection;