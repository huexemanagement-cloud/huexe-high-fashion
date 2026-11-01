"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useApply } from "@/components/apply/ApplyProvider";
import { useLenis } from "@/components/providers/SmoothScroll";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Roster", href: "/#roster", id: "roster" },
  { label: "Campaigns", href: "/#services", id: "services" },
  { label: "The Agency", href: "/#about", id: "about" },
  { label: "Contact", href: "/#apply", id: "apply" },
];

export function Nav() {
  const { openDrawer } = useApply();
  const { scrollTo } = useLenis();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href: string, id: string) => (event: React.MouseEvent) => {
    setMenu(false);
    if (pathname !== "/") return; // allow default navigation on subpages
    event.preventDefault();
    const el = document.getElementById(id);
    if (el) scrollTo(el, -10);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[8000] transition-all duration-500",
          scrolled
            ? "border-b border-raw/10 bg-obsidian/85 py-3.5 backdrop-blur-md"
            : "border-b border-transparent py-6",
        )}
      >
        <div className="edge-x flex items-center justify-between gap-6">
          <Link
            href="/"
            className="font-display text-xl leading-none font-extrabold tracking-[-0.04em] text-raw uppercase transition-opacity hover:opacity-80 md:text-2xl"
          >
            Huexe<span className="text-accent">.</span>
          </Link>

          <nav className="hidden items-center gap-9 lg:flex">
            {LINKS.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={go(link.href, link.id)}
                className="text-xs font-medium tracking-[0.22em] text-raw/60 uppercase transition-colors hover:text-raw"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-4 sm:gap-6">
            <Link
              href="/admin/login"
              className="hidden text-xs font-medium tracking-[0.18em] text-raw/40 uppercase transition-colors hover:text-raw md:block"
            >
              Studio ↗
            </Link>
            <button
              onClick={openDrawer}
              className="border border-raw/30 bg-transparent px-5 py-2.5 text-xs font-semibold tracking-[0.18em] text-raw uppercase transition-all duration-300 hover:border-raw hover:bg-raw hover:text-obsidian"
            >
              Submit Digitals
            </button>
            <button
              onClick={() => setMenu((m) => !m)}
              aria-label="Menu"
              className="flex items-center gap-2 border border-raw/25 px-4 py-2.5 text-xs font-semibold tracking-[0.16em] text-raw uppercase lg:hidden"
            >
              {menu ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu ? (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[7900] flex flex-col justify-center bg-obsidian px-[var(--edge)] lg:hidden"
          >
            <div className="space-y-4">
              {LINKS.map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.12 + index * 0.05, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={go(link.href, link.id)}
                    className="font-display text-3xl font-bold tracking-tight text-raw/90 uppercase hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-14 space-y-4">
              <button
                onClick={() => {
                  setMenu(false);
                  openDrawer();
                }}
                className="w-full bg-raw py-4 text-xs font-bold tracking-[0.2em] text-obsidian uppercase transition hover:bg-accent hover:text-raw"
              >
                Submit Digitals
              </button>
              <Link
                href="/admin/login"
                onClick={() => setMenu(false)}
                className="block text-center text-xs tracking-[0.2em] text-raw/40 uppercase py-2 hover:text-raw"
              >
                Studio Access ↗
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
