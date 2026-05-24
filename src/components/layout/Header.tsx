"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  Globe,
  Award,
  Factory,
  Menu,
  ChevronDown,
  X,
  LogIn,
  ShieldCheck,
  LogOut,
  Heart,
  ShoppingCart,
} from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa";
const Container = dynamic(() => import("../ui/Container").then((mod) => mod.Container));
import logoImg from "@/assets/logo.png";
import GreenButton from "../ui/GreenButton";
import BookButton from "../ui/BookButton";
import { useShop } from "@/context/ShopContext";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const { cartCount, likedCount } = useShop();
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001";

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("ensis_user") : null;
    if (!stored) return;
    try {
      setUser(JSON.parse(stored));
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ensis_user_token");
    localStorage.removeItem("ensis_user");
    setUser(null);
    window.location.href = "/";
  };

  const navLink =
    "inline-flex items-center border-b-2 border-transparent pt-0.5 text-[11px] font-bold tracking-wide text-[#1f261b] transition-colors hover:border-[#8d6a3a] hover:text-[#8d6a3a]";

  const mobileLink =
    "border-b border-[#e8e0d3] py-4 text-[12px] font-bold tracking-wide text-[#1f261b]";

  // Navigation Links Array
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Products", href: "/products", hasDropdown: true },
    { label: "Turnkey Solutions", href: "/turnkey" },
    { label: "Consultancy", href: "/consultancy" },
    { label: "Projects And Clients", href: "/projects-and-clients" },
    { label: "Blog", href: "/blog" },
    { label: "Enquiry", href: "/enquiry" },
    { label: "Contact Us", href: "/contact" },
  ];

  // Social Links Array
  const socialLinks = [
    {
      icon: <FaFacebook size={14} />,
      href: "#",
      label: "Facebook",
    },
    {
      icon: <FaInstagram size={14} />,
      href: "#",
      label: "Instagram",
    },
    {
      icon: <FaYoutube size={14} />,
      href: "#",
      label: "Youtube",
    },
    {
      icon: <FaLinkedin size={14} />,
      href: "#",
      label: "LinkedIn",
    },
  ];

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-sm" : "bg-transparent"}`}>
      <div className={`bg-[#263016] text-white py-1`}>
        <Container className="flex min-h-8 items-center justify-between gap-4 text-[11px] font-medium py-0!">
          <div className="hidden items-center gap-6 md:flex">
            {/* <span className="flex items-center gap-2">
              <Globe size={13} />
              Exporting Worldwide
            </span>

            <span className="flex items-center gap-2">
              <Award size={13} />
              ISO 9001:2015 Certified
            </span> */}

            <span className="flex items-center gap-2">
              <Factory size={13} />
              Manufactured in India
            </span>
            <Link href="tel:+919654900525" className="flex items-center gap-2">
              <Phone size={13} />
              +91 9654900525
            </Link>

            <Link
              href="mailto:info@ensis.in"
              className="hidden items-center gap-2 sm:flex"
            >
              <Mail size={13} />
              info@ensis.in
            </Link>
          </div>

          <div className="flex w-full items-center justify-between gap-4 md:w-auto md:justify-end">
            {!user && (
              <GreenButton path="/login" leftIcon={<LogIn size={14} className="text-[#050A1A]" />} text="User Login" />
            )}

            {/* <div className="hidden items-center gap-3 md:flex">
              {socialLinks.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  aria-label={item.label}
                >
                  {item.icon}
                </Link>
              ))}
            </div> */}
            {/* {user && (
            <GreenButton text="Logout" onClick={handleLogout} leftIcon={<LogOut size={14} className="text-[#050A1A]" />} />
            )} */}
          </div>
        </Container>
      </div>

      <div
        className={`bg-white`}

      >
        <Container className="flex items-center justify-between gap-6 py-2!">
          <Link href="/" className="shrink-0">
            <Image
              src={logoImg}
              alt="ENSIS Logo"
              className="h-[32px] w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden flex-1 justify-center xl:flex">
            <ul className="flex items-center gap-6">
              {navLinks.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className={`${navLink} ${item.hasDropdown ? "gap-1" : ""
                      } uppercase font-semibold`}
                  >
                    {item.label}

                    {item.hasDropdown && (
                      <ChevronDown
                        size={13}
                        strokeWidth={2.2}
                        className="translate-y-px"
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/products"
              aria-label="Liked products"
              className="relative hidden size-10 items-center justify-center rounded-full border border-[#d8cbb9] text-[#263016] transition-colors hover:bg-[#fbf8f2] sm:inline-flex"
            >
              <Heart size={18} />
              {likedCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-[#c8a45d] px-1 text-[10px] font-bold text-white">
                  {likedCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              aria-label="Shopping cart"
              className="relative inline-flex size-10 items-center justify-center rounded-full border border-[#d8cbb9] text-[#263016] transition-colors hover:bg-[#fbf8f2]"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-[#263016] px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <GreenButton text={<span className="uppercase  text-[#050A1A]">E-Brochure</span>} path={"https://ensis.in/pdf/e-broucher.pdf"} />
            <button
              className="inline-flex size-10 items-center justify-center border border-[#d8cbb9] text-[#263016] xl:hidden"
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </Container>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity xl:hidden ${isMenuOpen
          ? "opacity-100"
          : "pointer-events-none opacity-0"
          }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <aside
        className={`fixed right-0 top-0 z-50 h-screen w-[60%] min-w-[190px] max-w-[320px] bg-[#fbf8f2] shadow-2xl transition-transform duration-300 ease-out xl:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="flex h-20 items-center justify-between border-b border-[#e8e0d3] px-4">
          <Image
            src={logoImg}
            alt="ENSIS Logo"
            className="h-10 w-auto object-contain"
          />

          <button
            className="inline-flex size-9 items-center justify-center border border-[#d8cbb9] text-[#263016]"
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col px-5 py-3">
          {navLinks.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`${mobileLink} ${item.hasDropdown
                ? "flex items-center justify-betwee uppercasen"
                : ""
                }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}

              {item.hasDropdown && <ChevronDown size={14} />}
            </Link>
          ))}
          <Link
            href="/cart"
            className={`${mobileLink} flex items-center justify-between`}
            onClick={() => setIsMenuOpen(false)}
          >
            <span>Cart</span>
            <span className="rounded-full bg-[#263016] px-2 py-0.5 text-[10px] font-bold text-white">
              {cartCount}
            </span>
          </Link>
          <GreenButton text={<span className="uppercase text-[#050A1A]">E-Brochure</span>} path={"https://ensis.in/pdf/e-broucher.pdf"} />
          <div className="flex justify-between gap-2 mt-2">
            {!user &&
              (<GreenButton path="/login" leftIcon={<LogIn size={14} className="text-[#050A1A]" />} text="User Login" />
              )}
          </div>
        </nav>
      </aside>
    </header>
  );
};
