"use client";

import { useActionState } from "react";
import { updateSiteSettingsAction, type FormState } from "@/app/admin/actions";
import { TextField, TextArea } from "@/components/admin/Fields";
import type { SiteSettingsMap } from "@/db/queries";

const initial: FormState = { ok: false, message: "" };

export function SettingsForm({ settings }: { settings: SiteSettingsMap }) {
  const [state, action, pending] = useActionState(updateSiteSettingsAction, initial);

  return (
    <form action={action} className="space-y-12 max-w-5xl">
      {state.message && (
        <div
          className={`p-4 border mono text-xs uppercase tracking-wider ${
            state.ok
              ? "border-emerald-500/50 bg-emerald-950/20 text-emerald-300"
              : "border-red-500/50 bg-red-950/20 text-red-300"
          }`}
        >
          {state.message}
        </div>
      )}

      {/* 1. SEO & Web Analytics */}
      <section className="border border-raw/10 bg-ink/40 p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="display-sm text-raw text-xl font-bold">SEO &amp; Web Analytics</h2>
          <p className="mono text-raw/40 text-xs mt-1">
            Tracking tags are automatically injected into the public HTML head.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <TextField
            label="Google Tag (GTM / gtag)"
            name="seo_gtag_id"
            defaultValue={settings.seo_gtag_id}
            placeholder="GTM-XXXXXXX or G-XXXXXXX"
          />
          <TextField
            label="Google Analytics 4 (GA4)"
            name="seo_ga_id"
            defaultValue={settings.seo_ga_id}
            placeholder="G-XXXXXXXXXX"
          />
          <TextField
            label="Microsoft Clarity Project ID"
            name="seo_clarity_id"
            defaultValue={settings.seo_clarity_id}
            placeholder="e.g. j7k2l9p4"
          />
        </div>
      </section>

      {/* 2. Resend Email Service */}
      <section className="border border-raw/10 bg-ink/40 p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="display-sm text-raw text-xl font-bold">Email Service (Resend API)</h2>
          <p className="mono text-raw/40 text-xs mt-1">
            Powers automated scouting confirmations and prospective client inquiry receipts.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <TextField
            label="Resend API Key"
            name="resend_api_key"
            type="password"
            defaultValue={settings.resend_api_key}
            placeholder="re_123456789_abcdef..."
          />
          <TextField
            label="Sender Email Address (From)"
            name="resend_from_email"
            defaultValue={settings.resend_from_email}
            placeholder="HUEXE Studio <onboarding@resend.dev>"
          />
          <div className="md:col-span-2">
            <TextField
              label="Studio Notification Recipient"
              name="admin_notification_email"
              type="email"
              defaultValue={settings.admin_notification_email}
              placeholder="studio@huexe.co"
            />
          </div>
        </div>
      </section>

      {/* 3. Cloudinary Direct Asset Ingestion */}
      <section className="border border-raw/10 bg-ink/40 p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="display-sm text-raw text-xl font-bold">Media &amp; CDN Storage (Cloudinary)</h2>
          <p className="mono text-raw/40 text-xs mt-1">
            Offloads media direct-to-cloud from the browser with signed uploads, bypassing server payload &amp; database limits.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <TextField
            label="Cloudinary Cloud Name"
            name="cloudinary_cloud_name"
            defaultValue={settings.cloudinary_cloud_name}
            placeholder="e.g. huexe-agency"
          />
          <TextField
            label="Cloudinary API Key"
            name="cloudinary_api_key"
            defaultValue={settings.cloudinary_api_key}
            placeholder="e.g. 182746193748291"
          />
          <TextField
            label="Cloudinary API Secret"
            name="cloudinary_api_secret"
            type="password"
            defaultValue={settings.cloudinary_api_secret}
            placeholder="Secret (never exposed to browser)"
          />
          <TextField
            label="Upload Folder"
            name="cloudinary_folder"
            defaultValue={settings.cloudinary_folder}
            placeholder="huexe-production"
          />
        </div>
      </section>

      {/* 3. Social Media Links */}
      <section className="border border-raw/10 bg-ink/40 p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="display-sm text-raw text-xl font-bold">Social Media Profiles</h2>
          <p className="mono text-raw/40 text-xs mt-1">
            URLs entered here dynamically populate the agency footer navigation.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <TextField
            label="Instagram URL"
            name="social_instagram"
            defaultValue={settings.social_instagram}
            placeholder="https://instagram.com/huexe"
          />
          <TextField
            label="X / Twitter URL"
            name="social_twitter"
            defaultValue={settings.social_twitter}
            placeholder="https://x.com/huexe"
          />
          <TextField
            label="LinkedIn URL"
            name="social_linkedin"
            defaultValue={settings.social_linkedin}
            placeholder="https://linkedin.com/company/huexe"
          />
          <TextField
            label="TikTok URL"
            name="social_tiktok"
            defaultValue={settings.social_tiktok}
            placeholder="https://tiktok.com/@huexe"
          />
          <div className="md:col-span-2">
            <TextField
              label="YouTube URL"
              name="social_youtube"
              defaultValue={settings.social_youtube}
              placeholder="https://youtube.com/@huexe"
            />
          </div>
        </div>
      </section>

      {/* 4. WhatsApp Floating Concierge */}
      <section className="border border-raw/10 bg-ink/40 p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="display-sm text-raw text-xl font-bold">WhatsApp Concierge</h2>
          <p className="mono text-raw/40 text-xs mt-1">
            Powers the floating WhatsApp action button on the public landing page.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <TextField
            label="WhatsApp Business Phone Number"
            name="whatsapp_number"
            defaultValue={settings.whatsapp_number}
            placeholder="+919876543210 (include country code, digits only or +)"
          />
          <div className="md:col-span-2">
            <TextArea
              label="Default Prefilled Message"
              name="whatsapp_message"
              defaultValue={settings.whatsapp_message}
              rows={2}
              hint="Pre-populates the WhatsApp chat dialog when visitors click the floating button."
            />
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-4 border-t border-raw/15 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="mono bg-raw px-8 py-4 text-obsidian text-xs font-semibold tracking-widest uppercase transition hover:bg-accent hover:text-raw disabled:opacity-50"
        >
          {pending ? "Saving Settings..." : "Save Studio Settings"}
        </button>
      </div>
    </form>
  );
}

