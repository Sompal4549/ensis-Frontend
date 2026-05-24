import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail } from 'lucide-react';
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { Container } from '../ui/Container';
import logoImg from '@/assets/logo.png';
import BookButton from '../ui/BookButton';

export const Footer = () => {
  const heading = "mb-5 text-[11px] font-bold tracking-widest text-[#d0a965]";
  const linkList = "space-y-2 text-sm text-[#cfc7ba]";
  const linkClass = "transition-colors hover:text-white";

  return (
    <footer className="bg-[#171c11] pt-2 text-white">
      <Container className='pt-2!'>
        <div className="grid gap-8 border-b border-white/10 pb-10 md:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_0.9fr_0.9fr_1.2fr]">
          <div>
            <Image src={logoImg} alt="ENSIS Logo" className="h-[54px] w-auto object-contain brightness-125" />
            <p className="mt-5 max-w-[320px] text-sm leading-6 text-[#cfc7ba]">
              Leading manufacturer of Ayurvedic, Spa & Wellness equipments. Crafting premium solutions for a healthier & better tomorrow.
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
              <li><Link href="/" className={linkClass}>Home</Link></li>
              <li><Link href="/about" className={linkClass}>About Us</Link></li>
              <li><Link href="/products" className={linkClass}>Products</Link></li>
              <li><Link href="/turnkey" className={linkClass}>Turnkey Solutions</Link></li>
              <li><Link href="/projects" className={linkClass}>Projects</Link></li>
              <li><Link href="/blog" className={linkClass}>Blog</Link></li>
              <li><Link href="/contact" className={linkClass}>Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className={heading}>PRODUCT CATEGORIES</h4>
            <ul className={linkList}>
              <li><Link href="/products/panchkarma-beds" className={linkClass}>Panchkarma Beds</Link></li>
              <li><Link href="/products/spa-massage-tables" className={linkClass}>Spa Massage Tables</Link></li>
              <li><Link href="/products/steam-chambers" className={linkClass}>Steam Chambers</Link></li>
              <li><Link href="/products/sauna-systems" className={linkClass}>Sauna Systems</Link></li>
              <li><Link href="/products/bronze-accessories" className={linkClass}>Bronze Accessories</Link></li>
              <li><Link href="/products/spa-furniture" className={linkClass}>Spa Furniture</Link></li>
              <li><Link href="/products/steam-generators" className={linkClass}>Steam Generators</Link></li>
              <li><Link href="/products/yoga-wellness" className={linkClass}>Yoga & Wellness</Link></li>
            </ul>
          </div>

          <div>
            <h4 className={heading}>OUR SOLUTIONS</h4>
            <ul className={linkList}>
              <li><Link href="/solutions/clinic" className={linkClass}>Panchkarma Clinic Setup</Link></li>
              <li><Link href="/solutions/resort" className={linkClass}>Resort & Spa Setup</Link></li>
              <li><Link href="/solutions/retreat" className={linkClass}>Wellness Retreat Design</Link></li>
              <li><Link href="/solutions/hospital" className={linkClass}>Ayurveda Hospital Setup</Link></li>
              <li><Link href="/solutions/integration" className={linkClass}>Interior & Equipment Integration</Link></li>
            </ul>
          </div>

          <div>
            <h4 className={heading}>CONTACT US</h4>
            <ul className="space-y-4 text-sm leading-6 text-[#cfc7ba]">
              <li className="flex gap-3">
                <MapPin size={16} className="mt-1 shrink-0 text-[#d0a965]" />
                <span>Address: 12/29, Site-II, Loni Road, Industrial Area,<br/> Mohan Nagar - 201007, India, Uttar Pradesh, India</span>
              </li>
              <li className="flex gap-3">
                <Link href="tel:++919654900525" className='flex gap-3'>
                <Phone size={16} className="mt-1 shrink-0 text-[#d0a965]" />
                <span>+91 9654900525</span>
                </Link>

              </li>
              <li className="">
                <Link href="mailto:info@ensis.in" className='flex gap-3'>
                <Mail size={16} className="mt-1 shrink-0 text-[#d0a965]" />
                <span>info@ensis.in</span>
                </Link>
              </li>
            </ul>
            <div className='max-w-[180px] mt-3'>
            <BookButton path="https://wa.me/+919654900525" text="WHATSAPP CHAT" rightIcon={<FaWhatsapp size={14} className="ml-2" />} />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3 py-5 text-xs text-[#9f978a] md:flex-row md:items-center">
          <p>&copy; {new Date().getFullYear()} Ensis Panchkarma & Spa Solutions. All Rights Reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className={linkClass}>Privacy Policy</Link>
            <Link href="/terms" className={linkClass}>Terms & Conditions</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
