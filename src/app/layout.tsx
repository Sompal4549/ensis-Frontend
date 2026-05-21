import type { Metadata } from "next";
import dynamic from "next/dynamic";
import "./globals.css";
const Header = dynamic(() => import("@/components/layout/Header").then((mod) => mod.Header));
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
    <html lang="en">
      <body>
        <Header />
        <main className="pt-26">{children}</main>
        <Footer />
        <SocialSidebar/>
        <WhatsAppFloat/>
      </body>
    </html>
  );
}
