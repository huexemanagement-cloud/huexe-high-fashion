import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { Cormorant_Garamond, JetBrains_Mono, Plus_Jakarta_Sans, Syne } from "next/font/google";
import { getSiteSettings } from "@/db/queries";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jakarta",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-tech",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://huexe.co";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HUEXE — Mother Agency & Remote Production Studio",
    template: "%s — HUEXE",
  },
  description:
    "Huexe defines the next generation of visual storytelling. A South India based global mother agency and turnkey remote production studio representing exceptional, diverse and striking talent.",
  keywords: [
    "model agency India",
    "mother agency South India",
    "remote production studio",
    "fashion casting",
    "runway models Chennai",
    "editorial talent management",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "HUEXE",
    title: "HUEXE — Defining the next generation of visual storytelling",
    description:
      "Premier talent management, global event casting and turnkey remote production. South India // Global capitals.",
  },
  twitter: {
    card: "summary_large_image",
    title: "HUEXE — Mother Agency & Remote Production Studio",
    description:
      "We don't just manage talent—we build enduring visual icons for the world's most progressive brands.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "HUEXE",
  alternateName: "Huexe Mother Agency",
  url: siteUrl,
  description:
    "Full-service mother agency and turnkey remote production studio headquartered in South India, representing high fashion, runway, commercial and digital media talent worldwide.",
  address: {
    "@type": "PostalAddress",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  areaServed: ["IN", "AE", "GB", "FR", "IT", "SG", "US"],
  knowsAbout: ["Talent Management", "Event Casting", "Remote Catalogue Production"],
  sameAs: ["https://www.instagram.com/huexe"],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <html
      lang="en"
      className={`${syne.variable} ${cormorant.variable} ${jakarta.variable} ${mono.variable}`}
    >
      <head>
        {/* Google Tag (GTM / gtag) */}
        {settings.seo_gtag_id ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.seo_gtag_id}`}
              strategy="afterInteractive"
            />
            <Script id="google-gtag" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settings.seo_gtag_id}');
              `}
            </Script>
          </>
        ) : null}

        {/* Google Analytics 4 (GA4) if separate */}
        {settings.seo_ga_id && settings.seo_ga_id !== settings.seo_gtag_id ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.seo_ga_id}`}
              strategy="afterInteractive"
            />
            <Script id="google-ga4" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settings.seo_ga_id}');
              `}
            </Script>
          </>
        ) : null}

        {/* Microsoft Clarity */}
        {settings.seo_clarity_id ? (
          <Script id="microsoft-clarity" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${settings.seo_clarity_id}");
            `}
          </Script>
        ) : null}
      </head>
      <body className="bg-obsidian text-raw antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
