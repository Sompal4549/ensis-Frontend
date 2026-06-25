
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail } from 'lucide-react';
import designHouse from "@/assets/icons/design_house.webp"
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin, FaWhatsapp, FaTwitter } from 'react-icons/fa';
import { Container } from '../ui/Container';
import logoImg from '@/assets/logo.png';
import BookButton from '../ui/BookButton';
import GlowLogo from './GlowLogo';
import { getComponentContent, socialApi } from '@/lib/api/api';
import { SocialLink } from '@/constants';
import type { IconType } from "react-icons";
import SocialIconLink from './SocialLink';

const iconMap: Record<string, IconType> = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  youtube: FaYoutube,
  linkedin: FaLinkedin,
  whatsapp: FaWhatsapp,
  twitter: FaTwitter,
  x: FaTwitter,
};

const defaultFooter =  {
            "company": {
                "name": "Design House India Pvt. Ltd.",
                "designHouselogo": {
                    "imageUrl": "/images/design-house-logo.png",
                    "alt": "Design House Logo"
                },
                "description": "Leading manufacturer of Ayurvedic, Spa & Wellness equipments. Crafting premium solutions for a healthier & better tomorrow.",
                "ensisLogo": {
                    "imageUrl": "/images/ensis-logo.png",
                    "alt": "Ensis Logo"
                },
                "socialLinks": [
                    {
                        "image": {
                            "imageUrl": "/icons/facebook.svg",
                            "alt": "Facebook Icon"
                        },
                        "url": "https://facebook.com"
                    },
                    {
                        "image": {
                            "imageUrl": "/icons/instagram.svg",
                            "alt": "Instagram Icon"
                        },
                        "url": "https://instagram.com"
                    },
                    {
                        "image": {
                            "imageUrl": "/icons/youtube.svg",
                            "alt": "YouTube Icon"
                        },
                        "url": "https://youtube.com"
                    },
                    {
                        "image": {
                            "imageUrl": "/icons/linkedin.svg",
                            "alt": "LinkedIn Icon"
                        },
                        "url": "https://linkedin.com"
                    }
                ],
                "maplink": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7000.624411489639!2d77.38796300000001!3d28.680306000000005!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf1ead9e1d9e5%3A0x31a2384cd903039b!2sEnsis%20(Best%20Ayurvedic%2C%20Spa%20%26%20Panchkarma%20Equipment%20Manufacturer%20in%20Delhi%20NCR)!5e0!3m2!1sen!2sin!4v1782380646800!5m2!1sen!2sin"
            },
            "navigation": [
                {
                    "title": "Quick Links",
                    "links": [
                        {
                            "label": "Home",
                            "href": "/"
                        },
                        {
                            "label": "About Us",
                            "href": "/about-us"
                        },
                        {
                            "label": "Products",
                            "href": "/products"
                        },
                        {
                            "label": "Turnkey Solutions",
                            "href": "/turnkey-solutions"
                        },
                        {
                            "label": "Projects",
                            "href": "/projects"
                        },
                        {
                            "label": "Blog",
                            "href": "/blog"
                        },
                        {
                            "label": "Contact Us",
                            "href": "/contact-us"
                        }
                    ]
                },
                {
                    "title": "Product Categories",
                    "links": [
                        {
                            "label": "Panchkarma Beds",
                            "href": "/products/panchkarma-beds"
                        },
                        {
                            "label": "Spa Massage Tables",
                            "href": "/products/spa-massage-tables"
                        },
                        {
                            "label": "Steam Chambers",
                            "href": "/products/steam-chambers"
                        },
                        {
                            "label": "Sauna Systems",
                            "href": "/products/sauna-systems"
                        },
                        {
                            "label": "Bronze Accessories",
                            "href": "/products/bronze-accessories"
                        },
                        {
                            "label": "Spa Furniture",
                            "href": "/products/spa-furniture"
                        },
                        {
                            "label": "Steam Generators",
                            "href": "/products/steam-generators"
                        },
                        {
                            "label": "Yoga & Wellness",
                            "href": "/products/yoga-wellness"
                        }
                    ]
                },
                {
                    "title": "Our Solutions",
                    "links": [
                        {
                            "label": "Panchkarma Clinic Setup",
                            "href": "/solutions/panchkarma-clinic-setup"
                        },
                        {
                            "label": "Resort & Spa Setup",
                            "href": "/solutions/resort-spa-setup"
                        },
                        {
                            "label": "Wellness Retreat Design",
                            "href": "/solutions/wellness-retreat-design"
                        },
                        {
                            "label": "Ayurveda Hospital Setup",
                            "href": "/solutions/ayurveda-hospital-setup"
                        },
                        {
                            "label": "Interior & Equipment Integration",
                            "href": "/solutions/interior-equipment-integration"
                        }
                    ]
                }
            ],
            "contact": {
                "address": "12/29, Site-II, Loni Road, Industrial Area, Mohan Nagar - 201007, India, Uttar Pradesh, India",
                "phone": "+91 9654900525",
                "email": "info@ensis.in",
                "whatsappPhone": "+919654900525"
            },
            "copyright": {
                "text": "© 2026 Ensis Panchkarma & Spa Solutions. All Rights Reserved.",
                "links": [
                    {
                        "label": "Privacy Policy",
                        "href": "/privacy-policy"
                    },
                    {
                        "label": "Terms & Conditions",
                        "href": "/terms-and-conditions"
                    }
                ]
            }
        };

export const Footer = async () => {
  const content = await getComponentContent("layout.footer", defaultFooter);
  const heading = "mb-5 text-[11px] font-bold tracking-widest text-[#d0a965]";
  const linkList = "space-y-2 text-sm text-[#cfc7ba]";
  const linkClass = "transition-colors hover:text-white";
 const socialLinks = (await socialApi.getLinks())
  .filter((item) => item.isActive)
  .sort((a, b) => a.order - b.order);

  return (
    <footer className="bg-[#171c11] pt-2 text-white">
      <Container className='pt-2!'>
        <div className="grid gap-8 border-b border-white/10 pb-10 md:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_0.9fr_0.9fr_1.2fr]">
          <div>
            <GlowLogo href="/">
            <Image src={designHouse} alt="ENSIS Logo" className="h-[54px] w-[120px] object-contain brightness-125" />
            </GlowLogo>
            <p className="mt-5 max-w-[320px] text-sm leading-6 text-[#cfc7ba]">
              {content.company.description}
            </p>
             <div className="mt-5 flex items-center gap-4 text-[#d0a965]">
              {socialLinks.map((social) => {
        const platform = social.platform.toLowerCase();
        const Icon = iconMap[platform];

        if (!Icon) return null;

        return (
       <SocialIconLink
  key={social._id}
  href={social.url}
  platform={social.platform}
  className="text-2xl hover:scale-110 transition"
>
  <Icon />
</SocialIconLink>
        );
      })}
      </div>
    <div className="mt-6">
  <div className="group relative overflow-hidden rounded-2xl border-2 border-[#d0a965]/30 bg-gradient-to-br from-[#1f2518] to-[#171c11] p-1 shadow-[0_10px_40px_rgba(0,0,0,0.45)] transition-all duration-500 hover:border-[#d0a965]/60 hover:shadow-[0_15px_50px_rgba(208,169,101,0.2)]">
    {/* Top Label
    <div className="absolute left-4 top-3 z-10 rounded-full bg-black/60 px-3 py-1 text-[8px] font-semibold tracking-[0.2em] text-[#d0a965] backdrop-blur-md">
       Panchkarma Equipments | Therapy Equipments - Ensis
    </div> */}

    {/* Glow Effect */}
    <div className="absolute inset-0 bg-gradient-to-tr from-[#d0a965]/5 via-transparent to-[#d0a965]/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

    <iframe
      src={
        content.company.maplink ||
        "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7000.624411489639!2d77.38796300000001!3d28.680306000000005!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf1ead9e1d9e5%3A0x31a2384cd903039b!2sEnsis%20(Best%20Ayurvedic%2C%20Spa%20%26%20Panchkarma%20Equipment%20Manufacturer%20in%20Delhi%20NCR)!5e0!3m2!1sen!2sin!4v1782367991356!5m2!1sen!2sin"
      }
      width="100%"
      height="150"
      loading="lazy"
      className="relative rounded-[18px] transition-transform duration-500 group-hover:scale-[1.02]"
      style={{
        border: 0,
        filter: "saturate(1.15) contrast(1.08)",
      }}
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
    />
  </div>
</div>
          </div>

          <div>
            <h4 className={heading}>{content.navigation[0].title||"QUICK LINKS"}</h4>
            <ul className={linkList}>
              {content.navigation[0].links.map((link: { label: string; href: string }, index: number) => (
                <li key={index}><Link href={link.href} className={linkClass}>{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={heading}>{content.navigation[1].title||'PRODUCT CATEGORIES'}</h4>
            <ul className={linkList}>
              {content.navigation[1].links.map((link: { label: string; href: string }, index: number) => (
                <li key={index}><Link href={link.href} className={linkClass}>{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={heading}>{content.navigation[2].title||'OUR SOLUTIONS'}</h4>
            <ul className={linkList}>
              {content.navigation[2].links.map((link: { label: string; href: string }, index: number) => (
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
          <p>&copy; {new Date().getFullYear()} {content.copyright.text}</p>
          <div className="flex gap-5">
            <Link href={content.copyright.links[0].href||"/privacy"} className={linkClass}>{content.copyright.links[1].label||`Privacy Policy`}</Link>
            <Link href={content.copyright.links[1].href||"/terms"} className={linkClass}>{content.copyright.links[1].label||'Terms & Conditions'}</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};
