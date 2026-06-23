import type { Metadata } from "next";
import dynamic from "next/dynamic";
import "./globals.css";
import { Montserrat, Cormorant_Garamond, Playfair_Display } from 'next/font/google';
import { ShopProvider } from "@/context/ShopContext";

const montserrat = Montserrat({ subsets: ['latin'], weight: ['300','400','500','600','700'], variable: '--font-montserrat',display:"swap" });
const cormorant = Playfair_Display({ subsets: ['latin'], weight: ['400','600','700'], variable: '--font-cormorant', display:"swap" });
import { Header } from "@/components/layout/Header";
const Footer = dynamic(() => import("@/components/layout/Footer").then((mod) => mod.Footer));
const SocialSidebar = dynamic(() => import("@/components/layout/SocialSidebar").then((mod) => mod.default));
const WhatsAppFloat = dynamic(() => import("@/components/ui/WhatsAppFloat").then((mod) => mod.default));

export const metadata: Metadata = {
  title: "Ensis - Premium Panchkarma & Wellness Spaces",
  description: "Leading manufacturer of Ayurvedic, Spa & Wellness equipments. Crafting premium solutions for a healthier & better tomorrow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${cormorant.variable}`}>
      <body>
        <ShopProvider>
          <Header />
          <main className="pt-22">{children}</main>
          <Footer />
          <SocialSidebar/>
          <WhatsAppFloat/>
        </ShopProvider>
      </body>
    </html>
  );
}
