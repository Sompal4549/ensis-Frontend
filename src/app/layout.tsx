export const dynamic = 'force-dynamic';
import nextDynamic from "next/dynamic";
import type { Metadata } from "next";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { Montserrat, Playfair_Display } from 'next/font/google';
import { ShopProvider } from "@/context/ShopContext";
import footerTop1 from "@/assets/footer-top.webp"
import footerTop2 from "@/assets/footer-top2.webp"
import footerTop3 from "@/assets/footer-top-3.webp"
import footerTop4 from "@/assets/footer-bottom5.png"
import footerTop5 from "@/assets/footer-top-6.png"
import footerTop6 from "@/assets/footer-top-4.png"


const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-montserrat', display: "swap" });
const cormorant = Playfair_Display({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-cormorant', display: "swap" });

import { Header } from "@/components/layout/Header";
const Footer = nextDynamic(() => import("@/components/layout/Footer").then((mod) => mod.Footer));
const SocialSidebar = nextDynamic(() => import("@/components/layout/SocialSidebar").then((mod) => mod.default));
const WhatsAppFloat = nextDynamic(() => import("@/components/ui/WhatsAppFloat").then((mod) => mod.default));


// export const metadata: Metadata = {
//   title: "Ensis - Premium Panchkarma & Wellness Spaces",
//   description: "Leading manufacturer of Ayurvedic, Spa & Wellness equipments. Crafting premium solutions for a healthier & better tomorrow.",
// };

async function getAdvancedSeo() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/seo/advanced`, {
      next: { revalidate: 3600 }, // 1 hour cache
    });
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const advSeo = await getAdvancedSeo();

  const analytics = advSeo?.analytics || {};
  const searchConsole = advSeo?.searchConsole || {};

  return (
    <html lang="en" className={`${montserrat.variable} ${cormorant.variable}`}>
      <head>
        {/* Search Console Verification */}
        {searchConsole.googleVerification && (
          <meta name="google-site-verification" content={searchConsole.googleVerification} />
        )}
        {searchConsole.bingVerification && (
          <meta name="msvalidate.01" content={searchConsole.bingVerification} />
        )}

        {/* Google Tag Manager */}
        {analytics.gtmId && (
          <Script id="gtm-head" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${analytics.gtmId}');`}
          </Script>
        )}

        {/* Google Analytics 4 */}
        {analytics.gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${analytics.gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${analytics.gaId}');`}
            </Script>
          </>
        )}

        {/* Meta (Facebook) Pixel */}
        {analytics.fbPixelId && (
          <Script id="fb-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${analytics.fbPixelId}');
            fbq('track', 'PageView');`}
          </Script>
        )}

        {/* Microsoft Clarity */}
        {analytics.clarityId && (
          <Script id="ms-clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${analytics.clarityId}");`}
          </Script>
        )}
      </head>
      <body>
        {/* GTM noscript fallback */}
        {analytics.gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${analytics.gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        <ShopProvider>
          <Header />
          <main className="pt-22">{children}</main>
          <Footer />          {/* <Footer image={footerTop1} />
          <Footer image={footerTop2} />
          <Footer image={footerTop3} />
          <Footer image={footerTop4} />
          <Footer image={footerTop5} />
          <Footer image={footerTop6} /> */}
          <SocialSidebar />
          <WhatsAppFloat />
          <ToastContainer position="top-right" autoClose={4000} />
        </ShopProvider>
      </body>
    </html>
  );
}