import { getSiteSettings } from "@/db/queries";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Studio Settings & SEO — Huexe CMS" };

export default async function SettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-10">
      <header>
        <p className="mono text-raw/35">Studio Operations / Configuration</p>
        <h1 className="display-lg mt-3">Studio Settings &amp; SEO Suite</h1>
        <p className="mono text-raw/50 text-xs mt-2 max-w-2xl">
          Manage integrations, web analytics, social navigation endpoints, transactional Resend email keys, and the floating WhatsApp concierge.
        </p>
      </header>

      <SettingsForm settings={settings} />
    </div>
  );
}

