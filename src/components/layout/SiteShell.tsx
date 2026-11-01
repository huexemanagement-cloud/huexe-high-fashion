"use client";

import type { ReactNode } from "react";
import { ApplyProvider } from "@/components/apply/ApplyProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import { Preloader } from "@/components/ui/Preloader";
import { Nav } from "@/components/layout/Nav";
import { Footer, type FooterSocials } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

export function SiteShell({
  children,
  showPreloader = false,
  socials,
  whatsappNumber,
  whatsappMessage,
}: {
  children: ReactNode;
  showPreloader?: boolean;
  socials?: FooterSocials;
  whatsappNumber?: string;
  whatsappMessage?: string;
}) {
  return (
    <SmoothScroll>
      <ApplyProvider>
        {showPreloader ? <Preloader /> : null}
        <Cursor />
        <Nav />
        <main>{children}</main>
        <Footer socials={socials} />
        <WhatsAppButton number={whatsappNumber} message={whatsappMessage} />
        <ScrollToTop />
      </ApplyProvider>
    </SmoothScroll>
  );
}
