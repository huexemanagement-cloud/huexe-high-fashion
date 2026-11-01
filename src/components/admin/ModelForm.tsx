"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveModel, type FormState } from "@/app/admin/actions";
import {
  CheckboxField,
  SelectField,
  TextArea,
  TextField,
  UploadField,
} from "@/components/admin/Fields";
import { MODEL_CATEGORIES } from "@/lib/utils";
import type { ModelRecord } from "@/db/schema";

const initial: FormState = { ok: false, message: "" };

export function ModelForm({ model }: { model?: ModelRecord }) {
  const [state, action, pending] = useActionState(saveModel, initial);
  const stats = model?.stats ?? {};

  return (
    <form action={action} className="space-y-10">
      <input type="hidden" name="id" defaultValue={model?.id ?? ""} />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <TextField label="Name" name="name" defaultValue={model?.name} required />
        <TextField label="Slug" name="slug" defaultValue={model?.slug} placeholder="auto from name" />
        <SelectField
          label="Category"
          name="category"
          options={MODEL_CATEGORIES}
          defaultValue={model?.category ?? "New Faces"}
        />
        <TextField label="Location" name="location" defaultValue={model?.location} placeholder="Chennai // Paris" />
        <TextField label="Instagram" name="instagram" defaultValue={model?.instagram} placeholder="@handle" />
        <SelectField
          label="Status"
          name="status"
          options={["published", "draft"]}
          defaultValue={model?.status ?? "published"}
        />
        <TextField label="Sort order" name="sortOrder" type="number" defaultValue={model?.sortOrder ?? 0} />
        <CheckboxField label="Feature on homepage" name="isFeatured" defaultChecked={model?.isFeatured} />
      </section>

      <section>
        <p className="mono border-b border-raw/10 pb-3 text-raw/35">Measurements</p>
        <div className="mt-6 grid gap-6 md:grid-cols-3 xl:grid-cols-7">
          <TextField label="Height" name="height" defaultValue={stats.height} placeholder="178 cm" />
          <TextField label="Bust / chest" name="bust" defaultValue={stats.bust ?? stats.chest} placeholder="82 cm" />
          <TextField label="Waist" name="waist" defaultValue={stats.waist} placeholder="61 cm" />
          <TextField label="Hips" name="hips" defaultValue={stats.hips} placeholder="88 cm" />
          <TextField label="Shoe" name="shoe" defaultValue={stats.shoe} placeholder="EU 40" />
          <TextField label="Hair" name="hair" defaultValue={stats.hair} placeholder="Black" />
          <TextField label="Eyes" name="eyes" defaultValue={stats.eyes} placeholder="Brown" />
        </div>
      </section>

      <section>
        <p className="mono border-b border-raw/10 pb-3 text-raw/35">Imagery</p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <UploadField label="Featured image" name="featuredImage" defaultValue={model?.featuredImage} />
          <UploadField label="Hover polaroid" name="hoverPolaroid" defaultValue={model?.hoverPolaroid} />
          <TextArea
            label="Gallery images"
            name="galleryImages"
            rows={5}
            defaultValue={(model?.galleryImages ?? []).join("\n")}
            hint="One URL per line — powers the horizontal lookbook."
          />
          <TextArea
            label="Polaroid / digitals"
            name="polaroidImages"
            rows={5}
            defaultValue={(model?.polaroidImages ?? []).join("\n")}
            hint="One URL per line — powers the polaroid tab."
          />
        </div>
      </section>

      <section>
        <p className="mono border-b border-raw/10 pb-3 text-raw/35">Biography</p>
        <div className="mt-6">
          <TextArea label="Bio" name="bio" rows={4} defaultValue={model?.bio} />
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4 border-t border-raw/10 pt-6">
        <button
          type="submit"
          disabled={pending}
          className="mono bg-raw px-8 py-3.5 text-obsidian transition hover:bg-accent hover:text-raw disabled:opacity-40"
        >
          {pending ? "Saving…" : model ? "Update talent" : "Create talent"}
        </button>
        <Link href="/admin/models" className="mono text-raw/45 hover:text-raw">
          Back to roster
        </Link>
        {state.message ? (
          <span className={state.ok ? "mono text-raw/70" : "mono text-accent"}>{state.message}</span>
        ) : null}
      </div>
    </form>
  );
}
