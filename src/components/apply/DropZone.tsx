"use client";

import { useCallback, useRef, useState } from "react";
import { getCloudinaryUploadSignatureAction } from "@/app/actions/cloudinary";
import { cn } from "@/lib/utils";

export type UploadState = { url?: string; name?: string; progress: number; error?: string };

type Props = {
  label: string;
  hint: string;
  accept: string;
  guide: "front" | "profile" | "closeup" | "video";
  value: UploadState | undefined;
  onChange: (state: UploadState | undefined) => void;
};

const GUIDES: Record<Props["guide"], React.ReactNode> = {
  front: (
    <svg viewBox="0 0 60 120" className="h-full w-full">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="30" cy="16" r="9" />
        <path d="M30 25v40M16 36l14-8 14 8M18 65h24M20 65l-3 48M40 65l3 48" />
      </g>
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 60 120" className="h-full w-full">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="32" cy="16" r="9" />
        <path d="M32 25c-4 10-6 22-5 40M26 36l10-6M27 65h10M28 65l-2 48M37 65l1 48" />
      </g>
    </svg>
  ),
  closeup: (
    <svg viewBox="0 0 60 120" className="h-full w-full">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <ellipse cx="30" cy="54" rx="22" ry="30" />
        <path d="M21 48h7M32 48h7M26 66c3 3 6 3 9 0M30 50v10l-3 3" />
      </g>
    </svg>
  ),
  video: (
    <svg viewBox="0 0 60 120" className="h-full w-full">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="30" cy="60" r="26" strokeDasharray="4 5" />
        <path d="M25 50l16 10-16 10z" />
      </g>
    </svg>
  ),
};

export function DropZone({ label, hint, accept, guide, value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const upload = useCallback(
    async (file: File) => {
      onChange({ progress: 12, name: file.name });
      try {
        const timer = window.setInterval(() => {
          onChange({ progress: Math.min(92, Math.random() * 20 + 40), name: file.name });
        }, 300);

        // 1. Try direct-to-cloud signed upload if Cloudinary is configured
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

          window.clearInterval(timer);
          if (cRes.ok) {
            const json = (await cRes.json()) as { secure_url?: string };
            if (json.secure_url) {
              onChange({ progress: 100, name: file.name, url: json.secure_url });
              return;
            }
          }
        }

        // 2. Fallback to local API upload endpoint
        const body = new FormData();
        body.append("file", file);
        body.append("bucket", "digitals");

        const res = await fetch("/api/upload", { method: "POST", body });
        window.clearInterval(timer);
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Upload failed" }));
          onChange({ progress: 0, name: file.name, error: err.error ?? "Upload failed" });
          return;
        }
        const data = (await res.json()) as { url: string };
        onChange({ progress: 100, name: file.name, url: data.url });
      } catch {
        onChange({ progress: 0, name: file.name, error: "Network error" });
      }
    },
    [onChange],
  );

  const isVideo = guide === "video";
  const done = value?.progress === 100 && value.url;

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) void upload(file);
      }}
      onClick={() => inputRef.current?.click()}
      data-cursor={done ? "replace" : "upload"}
      className={cn(
        "group relative flex aspect-[3/4] cursor-pointer flex-col justify-between overflow-hidden border p-4 transition-colors duration-300",
        dragging ? "border-raw bg-raw/10" : "border-raw/20 hover:border-raw/60",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
        }}
      />

      {done && !isVideo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value!.url}
          alt={label}
          className="absolute inset-0 h-full w-full object-cover opacity-70 transition group-hover:opacity-40"
        />
      ) : null}
      {done && isVideo ? (
        <video
          src={value!.url}
          muted
          loop
          playsInline
          autoPlay
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
      ) : null}

      {!done ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-8 text-raw/15 transition group-hover:text-raw/30">
          {GUIDES[guide]}
        </div>
      ) : null}

      <div className="relative z-10 flex items-start justify-between">
        <span className="mono text-raw/80">{label}</span>
        <span className="mono text-raw/35">{done ? "✓" : "+"}</span>
      </div>

      <div className="relative z-10 space-y-2">
        {value?.progress && value.progress < 100 ? (
          <div className="h-[2px] w-full bg-raw/15">
            <span
              className="block h-full bg-raw transition-all duration-300"
              style={{ width: `${value.progress}%` }}
            />
          </div>
        ) : null}
        <p className="mono text-[0.6rem] leading-relaxed text-raw/45">
          {value?.error ? value.error : done ? value?.name : hint}
        </p>
      </div>
    </div>
  );
}
