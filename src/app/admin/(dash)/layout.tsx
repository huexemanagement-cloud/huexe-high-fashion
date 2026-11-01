import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { logoutAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Huexe CMS" };

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/models", label: "Roster" },
  { href: "/admin/campaigns", label: "Portfolio" },
  { href: "/admin/applications", label: "Scouting pipeline" },
  { href: "/admin/inquiries", label: "B2B inquiries" },
  { href: "/admin/settings", label: "Settings & SEO" },
  { href: "/admin/team", label: "Team & roles" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-obsidian text-raw">
      <aside className="sticky top-0 hidden h-screen w-[250px] shrink-0 flex-col justify-between border-r border-raw/10 p-6 lg:flex">
        <div>
          <Link href="/" className="font-display text-xl font-extrabold tracking-tight uppercase">
            Huexe<span className="text-accent">.</span>
          </Link>
          <p className="mono mt-2 text-raw/30">Content management</p>
          <nav className="mt-10 space-y-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="mono block border border-transparent px-3 py-2.5 text-raw/55 transition hover:border-raw/20 hover:text-raw"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="space-y-4">
          <div className="mono border border-raw/10 p-3 text-raw/40">
            <p className="text-raw/70">{user.name}</p>
            <p className="mt-1">{user.email}</p>
            <p className="mt-1 text-accent uppercase">{user.role}</p>
          </div>
          <form action={logoutAction}>
            <button className="mono w-full border border-raw/20 py-2.5 text-raw/60 transition hover:border-raw hover:text-raw">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-raw/10 bg-obsidian/90 px-6 py-4 backdrop-blur lg:px-10">
          <div className="flex gap-4 overflow-x-auto lg:hidden">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="mono whitespace-nowrap text-raw/55">
                {item.label}
              </Link>
            ))}
          </div>
          <span className="mono hidden text-raw/35 lg:block">
            Huexe operations console — live database
          </span>
          <Link href="/" className="mono border border-raw/20 px-4 py-2 text-raw/70 hover:border-raw">
            View site ↗
          </Link>
        </header>
        <main className="px-6 py-10 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
