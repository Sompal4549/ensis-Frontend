"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, Globe, Award, Factory, Menu, ChevronDown, X } from 'lucide-react';
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { Container } from '../ui/Container';
import logoImg from '@/assets/logo.png';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLink = "inline-flex h-20 items-center border-b-2 border-transparent pt-0.5 text-[11px] font-bold tracking-wide text-[#1f261b] transition-colors hover:border-[#8d6a3a] hover:text-[#8d6a3a]";
  const mobileLink = "border-b border-[#e8e0d3] py-4 text-[12px] font-bold tracking-wide text-[#1f261b]";

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white shadow-sm">
      <div className="bg-[#263016] text-white">
        <Container className="flex min-h-8 items-center justify-between gap-4 text-[11px] font-medium py-2!">
          <div className="hidden items-center gap-6 md:flex">
            <span className="flex items-center gap-2"><Globe size={13} /> Exporting Worldwide</span>
            <span className="flex items-center gap-2"><Award size={13} /> ISO 9001:2015 Certified</span>
            <span className="flex items-center gap-2"><Factory size={13} /> Manufactured in India</span>
          </div>
          <div className="flex w-full items-center justify-between gap-4 md:w-auto md:justify-end">
            <a href="tel:+919654900525" className="flex items-center gap-2"><Phone size={13} /> +91 9654900525
</a>
            <a href="mailto:info@ensis.in" className="hidden items-center gap-2 sm:flex"><Mail size={13} /> info@ensis.in</a>
            <div className="hidden items-center gap-3 md:flex">
              <Link href="#" aria-label="Facebook"><FaFacebook size={14} /></Link>
              <Link href="#" aria-label="Instagram"><FaInstagram size={14} /></Link>
              <Link href="#" aria-label="Youtube"><FaYoutube size={14} /></Link>
              <Link href="#" aria-label="LinkedIn"><FaLinkedin size={14} /></Link>
            </div>
          </div>
        </Container>
      </div>

      <div className="border-b border-[#e8e0d3] bg-white">
        <Container className="flex min-h-20 items-center justify-between gap-6 py-2!">
          <Link href="/" className="shrink-0">
            <Image src={logoImg} alt="ENSIS Logo" className="h-[52px] w-auto object-contain" priority />
          </Link>

          <nav className="hidden flex-1 justify-center xl:flex">
            <ul className="flex h-20 items-center gap-6">
              <li><Link href="/" className={navLink}>HOME</Link></li>
              <li><Link href="/about" className={navLink}>ABOUT US</Link></li>
              <li>
                <Link href="/products" className={`${navLink} gap-1`}>
                  PRODUCTS <ChevronDown size={13} strokeWidth={2.2} className="translate-y-px" />
                </Link>
              </li>
              <li><Link href="/turnkey" className={navLink}>TURNKEY SOLUTIONS</Link></li>
              <li><Link href="/projects" className={navLink}>PROJECTS</Link></li>
              <li><Link href="/manufacturing" className={navLink}>MANUFACTURING</Link></li>
              <li><Link href="/certifications" className={navLink}>CERTIFICATIONS</Link></li>
              <li><Link href="/blog" className={navLink}>BLOG</Link></li>
              <li><Link href="/contact" className={navLink}>CONTACT</Link></li>
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/catalogue" className="hidden bg-[#6f542f] px-5 py-3 text-[11px] font-bold tracking-wide text-white transition-colors hover:bg-[#4c381f] sm:inline-flex">
            <span className='text-white'>

              GET CATALOGUE
            </span>
            </Link>
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

      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity xl:hidden ${isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setIsMenuOpen(false)}
      />
      <aside
        className={`fixed right-0 top-0 z-50 h-screen w-1/2 min-w-[190px] max-w-[320px] bg-[#fbf8f2] shadow-2xl transition-transform duration-300 ease-out xl:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        aria-hidden={!isMenuOpen}
      >
        <div className="flex h-20 items-center justify-between border-b border-[#e8e0d3] px-4">
          <Image src={logoImg} alt="ENSIS Logo" className="h-10 w-auto object-contain" />
          <button
            className="inline-flex size-9 items-center justify-center border border-[#d8cbb9] text-[#263016]"
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex flex-col px-5 py-3">
          <Link href="/" className={mobileLink} onClick={() => setIsMenuOpen(false)}>HOME</Link>
          <Link href="/about" className={mobileLink} onClick={() => setIsMenuOpen(false)}>ABOUT US</Link>
          <Link href="/products" className={`${mobileLink} flex items-center justify-between`} onClick={() => setIsMenuOpen(false)}>
            PRODUCTS <ChevronDown size={14} />
          </Link>
          <Link href="/turnkey" className={mobileLink} onClick={() => setIsMenuOpen(false)}>TURNKEY SOLUTIONS</Link>
          <Link href="/projects" className={mobileLink} onClick={() => setIsMenuOpen(false)}>PROJECTS</Link>
          <Link href="/manufacturing" className={mobileLink} onClick={() => setIsMenuOpen(false)}>MANUFACTURING</Link>
          <Link href="/certifications" className={mobileLink} onClick={() => setIsMenuOpen(false)}>CERTIFICATIONS</Link>
          <Link href="/blog" className={mobileLink} onClick={() => setIsMenuOpen(false)}>BLOG</Link>
          <Link href="/contact" className={mobileLink} onClick={() => setIsMenuOpen(false)}>CONTACT</Link>
          <Link href="/catalogue" className="mt-5 bg-[#6f542f] px-4 py-3 text-center text-[11px] font-bold tracking-wide text-white" onClick={() => setIsMenuOpen(false)}>
              <span className='text-white'>

              GET CATALOGUE
            </span>
          </Link>
        </nav>
      </aside>
    </header>
  );
};
