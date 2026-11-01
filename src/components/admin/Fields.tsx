"use client";

import { useRef, useState } from "react";
import { getCloudinaryUploadSignatureAction } from "@/app/actions/cloudinary";

const base =
  "mt-2 w-full border border-raw/15 bg-ink px-3 py-2.5 text-sm text-raw outline-none transition focus:border-raw/60";

export function TextField({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mono text-raw/40">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className={base}
      />
    </label>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  rows = 4,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mono text-raw/40">{label}</span>
      <textarea name={name} rows={rows} defaultValue={defaultValue ?? ""} className={base} />
      {hint ? <span className="mono mt-1 block text-raw/25">{hint}</span> : null}
    </label>
  );
}

export function SelectField({
  label,
  name,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  options: readonly string[];
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="mono text-raw/40">{label}</span>
      <select name={name} defaultValue={defaultValue} className={base}>
        {options.map((option) => (
          <option key={option} value={option} className="bg-ink">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function CheckboxField({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="mono mt-7 flex items-center gap-3 text-raw/60">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-[#c9542a]" />
      {label}
    </label>
  );
}

export function UploadField({
  label,
  name,
  defaultValue,
  accept = "image/*",
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  accept?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setBusy(true);
    try {
      const sig = await getCloudinaryUploadSignatureAction();
      if (sig.enabled && sig.cloudName && sig.apiKey && sig.signature && sig.timestamp) {
        const cData = new FormData();
        cData.append("file", file);
        cData.append("api_key", sig.apiKey);
        cData.append("timestamp", sig.timestamp.toString());
        if (sig.folder) cData.append("folder", sig.folder);
        cData.append("signature", sig.signature);

        const cRes = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`, {
          method: "POST",
          body: cData,
        });

        if (cRes.ok) {
          const json = (await cRes.json()) as { secure_url?: string };
          if (json.secure_url) {
            setValue(json.secure_url);
            setBusy(false);
            return;
          }
        }
      }

      const body = new FormData();
      body.append("file", file);
      body.append("bucket", "cms");
      const res = await fetch("/api/upload", { method: "POST", body });
      if (res.ok) {
        const data = (await res.json()) as { url: string };
        setValue(data.url);
      }
    } catch (err) {
      console.error("[huexe:upload]", err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className="mono text-raw/40">{label}</span>
      <div className="mt-2 flex gap-2">
        <input
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="https:// or /api/media/…"
          className="w-full border border-raw/15 bg-ink px-3 py-2.5 text-sm text-raw outline-none focus:border-raw/60"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mono shrink-0 border border-raw/20 px-4 text-raw/60 transition hover:border-raw hover:text-raw"
        >
          {busy ? "…" : "Upload"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
          }}
        />
      </div>
      {value ? (
        <div className="mt-2 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-16 w-12 border border-raw/10 object-cover" />
          <span className="mono truncate text-raw/25">{value}</span>
        </div>
      ) : null}
    </div>
  );
}
