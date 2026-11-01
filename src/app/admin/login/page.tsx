import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Studio Access // HUEXE CMS",
  description: "Restricted administrative portal for HUEXE Talent & Atelier Management.",
};

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/admin");

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-obsidian px-6 py-12 selection:bg-accent selection:text-raw">
      {/* Editorial corner frame markers */}
      <div className="pointer-events-none fixed inset-6 border border-raw/[0.04] sm:inset-10">
        <span className="mono-xs absolute -top-2 left-4 bg-obsidian px-2 text-raw/20">
          HUEXE ATELIER SECURE PORTAL
        </span>
        <span className="mono-xs absolute -bottom-2 right-4 bg-obsidian px-2 text-raw/20">
          SYSTEM: RESTRICTED
        </span>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Top security metadata */}
        <div className="flex items-center justify-between border-b border-raw/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="mono text-[10px] tracking-[0.28em] text-raw/50">
              SECURE ENCLAVE 2026
            </span>
          </div>
          <span className="mono text-[10px] tracking-[0.25em] text-raw/30">
            CHENNAI // PARIS
          </span>
        </div>

        {/* Portal Header */}
        <div className="mt-8">
          <Link
            href="/"
            className="mono-xs tracking-[0.3em] text-raw/40 transition hover:text-raw"
          >
            ← RETURN TO ROSTER
          </Link>
          <h1 className="display-lg mt-4 tracking-tight text-raw">
            Studio Access
          </h1>
          <p className="mono mt-3 leading-relaxed text-raw/45">
            Internal talent directory, scouting pipeline & production portal. Authorized agency personnel only.
          </p>
        </div>

        {/* Hardened Login Form */}
        <div className="mt-8 border border-raw/10 bg-ink/40 p-6 backdrop-blur-sm sm:p-8">
          <LoginForm />
        </div>

        {/* Security & Audit Notice */}
        <div className="mt-6 flex flex-col gap-2 border-t border-raw/10 pt-4 text-center">
          <p className="mono text-[9px] tracking-[0.22em] text-raw/30">
            ALL SESSION REQUESTS ARE TIME-STAMPED AND CRYPTOGRAPHICALLY LOGGED.
          </p>
          <p className="mono-xs text-raw/20">
            HUEXE MANAGEMENT © 2026 · ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </div>
  );
}
