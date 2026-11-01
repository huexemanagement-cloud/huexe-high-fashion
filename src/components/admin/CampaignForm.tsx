"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveCampaign, type FormState } from "@/app/admin/actions";
import { SelectField, TextArea, TextField, UploadField } from "@/components/admin/Fields";
import { CAMPAIGN_CATEGORIES } from "@/lib/utils";
import type { CampaignRecord } from "@/db/schema";

const initial: FormState = { ok: false, message: "" };

export function CampaignForm({ campaign }: { campaign?: CampaignRecord }) {
  const [state, action, pending] = useActionState(saveCampaign, initial);
  const credits = campaign?.credits ?? {};

  return (
    <form action={action} className="space-y-10">
      <input type="hidden" name="id" defaultValue={campaign?.id ?? ""} />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <TextField label="Title" name="title" defaultValue={campaign?.title} required />
        <TextField label="Client / brand" name="clientBrand" defaultValue={campaign?.clientBrand} />
        <SelectField
          label="Category"
          name="category"
          options={CAMPAIGN_CATEGORIES}
          defaultValue={campaign?.category ?? "Editorial"}
        />
        <SelectField
          label="Media type"
          name="mediaType"
          options={["image", "video"]}
          defaultValue={campaign?.mediaType ?? "image"}
        />
        <SelectField
          label="Status"
          name="status"
          options={["published", "draft"]}
          defaultValue={campaign?.status ?? "published"}
        />
      </section>

      <section>
        <p className="mono border-b border-raw/10 pb-3 text-raw/35">Media</p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <UploadField label="Cover media" name="coverMediaUrl" defaultValue={campaign?.coverMediaUrl} />
          <TextField
            label="Hover preview video URL"
            name="previewVideoUrl"
            defaultValue={campaign?.previewVideoUrl}
            placeholder="https://…mp4"
          />
          <TextArea
            label="Gallery"
            name="gallery"
            rows={5}
            defaultValue={(campaign?.gallery ?? []).join("\n")}
            hint="One URL per line."
          />
          <TextArea label="Summary" name="summary" rows={5} defaultValue={campaign?.summary} />
        </div>
      </section>

      <section>
        <p className="mono border-b border-raw/10 pb-3 text-raw/35">Credits</p>
        <div className="mt-6 grid gap-6 md:grid-cols-3 xl:grid-cols-5">
          <TextField label="Photographer" name="photographer" defaultValue={credits.photographer} />
          <TextField label="Stylist" name="stylist" defaultValue={credits.stylist} />
          <TextField label="Direction" name="direction" defaultValue={credits.direction} />
          <TextField label="Location" name="creditLocation" defaultValue={credits.location} />
          <TextField label="Talent" name="talent" defaultValue={credits.talent} />
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4 border-t border-raw/10 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="mono bg-raw px-8 py-3.5 text-obsidian transition hover:bg-accent hover:text-raw disabled:opacity-40"
        >
          {pending ? "Saving…" : campaign ? "Update project" : "Create project"}
        </button>
        <Link href="/admin/campaigns" className="mono text-raw/45 hover:text-raw">
          Back to portfolio
        </Link>
        {state.message ? (
          <span className={state.ok ? "mono text-raw/70" : "mono text-accent"}>{state.message}</span>
        ) : null}
      </div>
    </form>
  );
}
