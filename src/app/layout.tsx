import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import SocialSidebar from "@/components/layout/SocialSidebar";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";

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
