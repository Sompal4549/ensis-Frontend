import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail } from 'lucide-react';
import designHouse from "@/assets/icons/design_house.webp"
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { Container } from '../ui/Container';
import logoImg from '@/assets/logo.png';
import BookButton from '../ui/BookButton';
import GlowLogo from './GlowLogo';
import { getComponentContent } from '@/app/lib/api';

const defaultFooter = {
  companyDescription: "Leading manufacturer of Ayurvedic, Spa & Wellness equipments. Crafting premium solutions for a healthier & better tomorrow.",
  quickLinks: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Turnkey Solutions", href: "/turnkey" },
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "Contact Us", href: "/contact" }
  ],
  productCategories: [
    { label: "Panchkarma Beds", href: "/products/panchkarma-beds" },
    { label: "Spa Massage Tables", href: "/products/spa-massage-tables" },
    { label: "Steam Chambers", href: "/products/steam-chambers" },
    { label: "Sauna Systems", href: "/products/sauna-systems" },
    { label: "Bronze Accessories", href: "/products/bronze-accessories" },
    { label: "Spa Furniture", href: "/products/spa-furniture" },
    { label: "Steam Generators", href: "/products/steam-generators" },
    { label: "Yoga & Wellness", href: "/products/yoga-wellness" }
  ],
  solutionLinks: [
    { label: "Panchkarma Clinic Setup", href: "/solutions/clinic" },
    { label: "Resort & Spa Setup", href: "/solutions/resort" },
    { label: "Wellness Retreat Design", href: "/solutions/retreat" },
    { label: "Ayurveda Hospital Setup", href: "/solutions/hospital" },
    { label: "Interior & Equipment Integration", href: "/solutions/integration" }
  ],
  contact: {
    address: "12/29, Site-II, Loni Road, Industrial Area, Mohan Nagar - 201007, India, Uttar Pradesh, India",
    phone: "+91 9654900525",
    email: "info@ensis.in",
    whatsappPhone: "+919654900525"
  },
  copyrightText: "Ensis Panchkarma & Spa Solutions. All Rights Reserved."
};

export const Footer = async () => {
  const content = await getComponentContent("layout.footer", defaultFooter);

  const heading = "mb-5 text-[11px] font-bold tracking-widest text-[#d0a965]";
  const linkList = "space-y-2 text-sm text-[#cfc7ba]";
  const linkClass = "transition-colors hover:text-white";

  return (
    <footer className="bg-[#171c11] pt-2 text-white">
      <Container className='pt-2!'>
        <div className="grid gap-8 border-b border-white/10 pb-10 md:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_0.9fr_0.9fr_1.2fr]">
          <div>
            <GlowLogo href="/">
            <Image src={designHouse} alt="ENSIS Logo" className="h-[54px] w-[120px] object-contain brightness-125" />
            </GlowLogo>
            <p className="mt-5 max-w-[320px] text-sm leading-6 text-[#cfc7ba]">
              {content.companyDescription}
            </p>
            <div className="mt-5 flex items-center gap-4 text-[#d0a965]">
              <Link href="#" aria-label="Facebook" className={linkClass}><FaFacebook size={18} /></Link>
              <Link href="#" aria-label="Instagram" className={linkClass}><FaInstagram size={18} /></Link>
              <Link href="#" aria-label="Youtube" className={linkClass}><FaYoutube size={18} /></Link>
              <Link href="#" aria-label="LinkedIn" className={linkClass}><FaLinkedin size={18} /></Link>
            </div>
          </div>

          <div>
            <h4 className={heading}>QUICK LINKS</h4>
            <ul className={linkList}>
              {content.quickLinks.map((link: { label: string; href: string }, index: number) => (
                <li key={index}><Link href={link.href} className={linkClass}>{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={heading}>PRODUCT CATEGORIES</h4>
            <ul className={linkList}>
              {content.productCategories.map((link: { label: string; href: string }, index: number) => (
                <li key={index}><Link href={link.href} className={linkClass}>{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={heading}>OUR SOLUTIONS</h4>
            <ul className={linkList}>
              {content.solutionLinks.map((link: { label: string; href: string }, index: number) => (
                <li key={index}><Link href={link.href} className={linkClass}>{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={heading}>CONTACT US</h4>
            <ul className="space-y-4 text-sm leading-6 text-[#cfc7ba]">
              <li>
                <GlowLogo>
                <Image src={logoImg} alt="ENSIS Logo" className="h-[54px] w-auto object-contain brightness-125" style={{ width: "auto" }} />
                </GlowLogo>
              </li>
              <li className="flex gap-3">
                <MapPin size={16} className="mt-1 shrink-0 text-[#d0a965]" />
                <span>Address: {content.contact.address}</span>
              </li>
              <li className="flex gap-3">
                <Link href={`tel:${content.contact.phone}`} className='flex gap-3'>
                <Phone size={16} className="mt-1 shrink-0 text-[#d0a965]" />
                <span>{content.contact.phone}</span>
                </Link>
              </li>
              <li className="">
                <Link href={`mailto:${content.contact.email}`} className='flex gap-3'>
                <Mail size={16} className="mt-1 shrink-0 text-[#d0a965]" />
                <span>{content.contact.email}</span>
                </Link>
              </li>
            </ul>
            <div className='max-w-[180px] mt-3'>
            <BookButton path={`https://wa.me/${content.contact.whatsappPhone}`} text="WHATSAPP CHAT" rightIcon={<FaWhatsapp size={14} className="ml-2" />} />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3 py-5 text-xs text-[#9f978a] md:flex-row md:items-center">
          <p>&copy; {new Date().getFullYear()} {content.copyrightText}</p>
          <div className="flex gap-5">
            <Link href="/privacy" className={linkClass}>Privacy Policy</Link>
            <Link href="/terms" className={linkClass}>Terms & Conditions</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
