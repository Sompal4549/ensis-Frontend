"use client";

import React, { useEffect, useRef, useState } from "react";
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
import logoImg from "@/assets/logo.webp";
import GreenButton from "../ui/GreenButton";
import BookButton from "../ui/BookButton";
import { useShop } from "@/context/ShopContext";
import { getComponentContent } from "@/lib/api/api";

export const Header = () => {
    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [wishlistOpen, setWishlistOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
    const { addToCart, cartCount, likedCount, likedItems, toggleLike } = useShop();
    const wishlistRef = useRef<HTMLDivElement | null>(null);
    const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001";

    useEffect(() => setMounted(true), []);

    const handleLogout = () => {
        localStorage.removeItem("ensis_access_token");
        localStorage.removeItem("ensis_user");
        window.dispatchEvent(new Event("ensis-auth-change"));
        setUser(null);
        window.location.href = "/";
    };

    useEffect(() => {
        const syncUser = () => {
            const storedUser = typeof window !== "undefined" ? localStorage.getItem("ensis_user") : null;
            if (!storedUser) {
                setUser(null);
                return;
            }
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                setUser(null);
            }
        };

        syncUser();
        window.addEventListener("ensis-auth-change", syncUser);
        window.addEventListener("storage", syncUser);

        return () => {
            window.removeEventListener("ensis-auth-change", syncUser);
            window.removeEventListener("storage", syncUser);
        };
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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wishlistRef.current &&
                !wishlistRef.current.contains(event.target as Node)
            ) {
                setWishlistOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const navLink =
        "inline-flex items-center border-b-2 border-transparent pt-0.5 text-[11px] font-bold tracking-wide text-[#1f261b] transition-colors hover:border-[#8d6a3a] hover:text-[#8d6a3a]";

    const mobileLink =
        "border-b border-[#e8e0d3] py-4 text-[12px] font-bold tracking-wide text-[#1f261b]";

    // Default content shape matches the actual DB schema for "layout.header"
    // (contactInfo + navigation), NOT the old badges/navLinks shape.
    const [headerContent, setHeaderContent] = useState({
        phone: "+91 9654900525",
        email: "info@ensis.in",
        brochureUrl: "https://ensis.in/pdf/e-broucher.pdf",
        contactInfo: [
            {
                image: { imageUrl: "/icons/factory.svg", alt: "Factory Icon" },
                text: "Manufactured in India",
            },
            {
                image: { imageUrl: "/icons/phone.svg", alt: "Phone Icon" },
                text: "+91 9654900525",
                href: "tel:+919654900525",
            },
            {
                image: { imageUrl: "/icons/mail.svg", alt: "Mail Icon" },
                text: "info@ensis.in",
                href: "mailto:info@ensis.in",
            },
        ],
        navigation: [
            { title: "Home", slug: "/" },
            { title: "About Us", slug: "/about" },
            { title: "Products", slug: "/products" },
            { title: "Turnkey Solutions", slug: "/turnkey" },
            { title: "Consultancy", slug: "/consultancy" },
            { title: "Projects And Clients", slug: "/projects-and-clients" },
            { title: "Blog", slug: "/blog" },
            { title: "Enquiry", slug: "/enquiry" },
            { title: "Contact Us", slug: "/contact" },
        ],
    });

    useEffect(() => {
        const fetchHeader = async () => {
            try {
                const data = await getComponentContent("layout.header", headerContent);
                setHeaderContent(data);
            } catch (err) {
                // Keep default
            }
        };
        fetchHeader();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Map DB's `navigation` (title/slug) to the {label, href} shape this component renders
    const navLinks = (headerContent.navigation ?? []).map((n: any) => ({
        label: n.title,
        href: n.slug,
    }));

    return (
        <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-sm" : "bg-transparent"}`}>
            <div className={`bg-[#263016] text-white py-1.5`}>
                <Container className="flex min-h-10 items-center justify-between gap-4 text-[11px] font-medium py-0!">
                    <div className="hidden items-center gap-6 md:flex">
                        {headerContent.contactInfo?.map((item: any, index: number) => {
                            // Phone/email get clickable links; everything else is plain text with an icon
                            const isPhone = item.href?.startsWith("tel:");
                            const isEmail = item.href?.startsWith("mailto:");

                            const iconFor = (alt: string = "") => {
                                if (alt.toLowerCase().includes("factory")) return <Factory size={13} />;
                                if (alt.toLowerCase().includes("phone")) return <Phone size={13} />;
                                if (alt.toLowerCase().includes("mail")) return <Mail size={13} />;
                                return <Globe size={13} />;
                            };

                            if (item.href) {
                                return (
                                    <Link key={index} href={item.href} className="flex items-center gap-2">
                                        {item.image?.imageUrl ? (
                                            <Image src={item.image.imageUrl} priority alt={item.image?.alt ?? ''} width={13} height={13} />
                                        ) : (
                                            iconFor(item.image?.alt)
                                        )}
                                        {item.text}
                                    </Link>
                                );
                            }

                            return (
                                <span key={index} className="flex items-center gap-2">
                                    {item.image?.imageUrl ? (
                                        <Image src={item.image.imageUrl} alt={item.image?.alt ?? ''} width={13} height={13} />
                                    ) : (
                                        iconFor(item.image?.alt)
                                    )}
                                    {item.text}
                                </span>
                            );
                        })}
                    </div>

                    <div className="flex w-full items-center justify-end gap-3 md:w-auto">
                        {/* Wishlist */}
                        <div ref={wishlistRef} className="relative hidden sm:block">
                            <button
                                suppressHydrationWarning
                                type="button"
                                aria-label="Open wishlist"
                                aria-expanded={wishlistOpen}
                                onClick={() => setWishlistOpen((open) => !open)}
                                className="relative inline-flex size-8 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
                            >
                                <Heart size={15} />
                                {mounted && (
                                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#c8a45d] text-[9px] font-bold text-white">
                                        {likedCount}
                                    </span>
                                )}
                            </button>

                            {wishlistOpen && (
                                <div className="absolute right-0 top-10 z-50 w-[340px] overflow-hidden rounded-md border border-[#e2d8ca] bg-white text-left shadow-[0_18px_45px_rgba(0,0,0,0.14)]">
                                    <div className="flex items-center justify-between border-b border-[#eee6dc] px-4 py-3">
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#263016]">
                                            Wishlist
                                        </p>
                                        <span className="rounded-full bg-[#fbf8f2] px-2 py-1 text-[10px] font-bold text-[#8d6a3a]">
                                            {likedCount}
                                        </span>
                                    </div>

                                    {likedItems.length > 0 ? (
                                        <div className="max-h-[380px] overflow-y-auto">
                                            {likedItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="grid grid-cols-[64px_1fr] gap-3 border-b border-[#f0e8df] px-4 py-3 last:border-b-0"
                                                >
                                                    <Link
                                                        href={`/products/${item.id}`}
                                                        onClick={() => setWishlistOpen(false)}
                                                        className="relative block aspect-square overflow-hidden bg-[#f8f3ec]"
                                                    >
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            fill
                                                            sizes="64px"
                                                            className="object-cover"
                                                        />
                                                    </Link>

                                                    <div className="min-w-0">
                                                        <Link
                                                            href={`/products/${item.id}`}
                                                            onClick={() => setWishlistOpen(false)}
                                                            className="line-clamp-2 text-[12px] font-bold leading-snug text-[#1f261b] hover:text-[#8d6a3a]"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                        <p className="mt-1 text-[11px] font-semibold text-[#8d6a3a]">
                                                            {"\u20b9"}
                                                            {item.price.toLocaleString("en-IN")}
                                                        </p>

                                                        <div className="mt-3 flex items-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => addToCart(item)}
                                                                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-sm bg-[#263016] px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#101010]"
                                                            >
                                                                <ShoppingCart size={12} />
                                                                Add to Cart
                                                            </button>
                                                            <button
                                                                type="button"
                                                                aria-label={`Remove ${item.name} from wishlist`}
                                                                onClick={() => toggleLike(item)}
                                                                className="inline-flex size-8 items-center justify-center rounded-sm border border-[#e2d8ca] text-[#6f675d] transition-colors hover:bg-[#fbf8f2] hover:text-[#1f261b]"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="px-5 py-8 text-center">
                                            <Heart size={28} className="mx-auto mb-3 text-[#c8a45d]" />
                                            <p className="text-sm font-bold text-[#1f261b]">
                                                No wishlist items
                                            </p>
                                            <p className="mt-2 text-xs leading-5 text-[#6f675d]">
                                                Tap the heart on products you want to save here.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Cart */}
                        <Link
                            href="/cart"
                            aria-label="Shopping cart"
                            className="relative inline-flex size-8 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
                        >
                            <ShoppingCart size={15} />
                            {mounted && (
                                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#c8a45d] text-[9px] font-bold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* E-Brochure */}
                        <div className="hidden sm:block">
                            <BookButton text="E-Brochure" path={headerContent.brochureUrl} />
                        </div>

                        {/* User / Login */}
                        {mounted && (user ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1">
                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#d9c49d] text-[10px] font-black text-[#263016]">
                                        {user.name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                    <span className="text-[10px] font-bold tracking-wide text-white">{user.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#d9c49d] hover:text-white transition-colors"
                                >
                                    <LogOut size={12} /> Logout
                                </button>
                            </div>
                        ) : (
                            <GreenButton path="/login" leftIcon={<LogIn size={14} className="text-[#050A1A]" />} text="User Login" />
                        ))}

                        {/* Mobile menu trigger */}
                    
                    </div>
                </Container>
            </div>

            <div className={`bg-white`}>
           <Container className="flex items-center justify-between gap-6 py-2!">
        <Link href="/" className="shrink-0">
            <Image
                src={logoImg}
                alt="ENSIS Logo"
                className="h-10 md:h-11.5 w-auto object-contain"
                priority
                style={{ width: "auto" }}
            />
        </Link>

                    {/* Spacer so nav doesn't go under the logo */}
                    <div className="w-[40px] md:w-[120px] shrink-0" />
      <nav className="hidden xl:flex">
            <ul className="flex items-center gap-7">
                            {navLinks.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        href={item.href}
                                        className={`${navLink} uppercase font-semibold`}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
       <button
            suppressHydrationWarning
            className="inline-flex size-10 items-center justify-center border border-[#d8cbb9] text-[#263016] xl:hidden"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(true)}
        >
            <Menu size={24} />
        </button>
                    {/* Right spacer for symmetry with logo/left spacer */}
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
                        style={{ width: "auto" }}
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
                            className={`${mobileLink}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <Link
                        href="/cart"
                        className={`${mobileLink} flex items-center justify-between`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <span>Cart</span>
                        {mounted && (
                            <span className="rounded-full bg-[#263016] px-2 py-0.5 text-[10px] font-bold text-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    <div className="mt-4 flex flex-col gap-3">
                        <GreenButton text={<span className="uppercase text-[#050A1A]">E-Brochure</span>} path={headerContent.brochureUrl} />

                        {mounted && (user ? (
                            <div className="mt-2 rounded-md border border-[#d8cbb9] bg-white p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#263016] text-sm font-bold text-white">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[#1f261b]">{user.name}</p>
                                        <button onClick={handleLogout} className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#9b2c2c]">
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <GreenButton path="/login" leftIcon={<LogIn size={14} className="text-[#050A1A]" />} text="User Login" />
                        ))}
                    </div>
                </nav>
            </aside>
        </header>
    );
};