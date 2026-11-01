"use client";

import { useState, useTransition } from "react";
import { submitInquiry } from "@/app/actions/public";
import { SERVICE_TYPES } from "@/lib/utils";

export function B2BForm() {
  const [state, setState] = useState({
    companyName: "",
    contactName: "",
    email: "",
    serviceType: SERVICE_TYPES[0] as string,
    projectBrief: "",
  });
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const send = () => {
    startTransition(async () => {
      const res = await submitInquiry(state);
      setResult(res);
      if (res.ok) {
        setState((s) => ({ ...s, companyName: "", contactName: "", email: "", projectBrief: "" }));
      }
    });
  };

  return (
    <div className="mt-24 grid gap-10 border-t border-raw/10 pt-14 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <p className="mono text-raw/35">Start a project</p>
        <h3 className="display-lg mt-5 text-raw">
          Brief us.
          <br />
          We handle the rest.
        </h3>
        <p className="mono mt-6 max-w-xs leading-relaxed text-raw/40">
          Casting, lineup management, studio, crew, retouch and delivery — contracted as a single
          production line.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Input label="Company / brand *" value={state.companyName} onChange={(v) => setState((s) => ({ ...s, companyName: v }))} />
        <Input label="Contact name" value={state.contactName} onChange={(v) => setState((s) => ({ ...s, contactName: v }))} />
        <Input label="Email *" value={state.email} onChange={(v) => setState((s) => ({ ...s, email: v }))} />
        <label className="block">
          <span className="mono text-raw/40">Service</span>
          <select
            value={state.serviceType}
            onChange={(e) => setState((s) => ({ ...s, serviceType: e.target.value }))}
            className="mt-2 w-full border-b border-raw/20 bg-transparent pb-2 text-raw outline-none focus:border-raw"
          >
            {SERVICE_TYPES.map((type) => (
              <option key={type} value={type} className="bg-ink">
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="block md:col-span-2">
          <span className="mono text-raw/40">Project brief</span>
          <textarea
            rows={3}
            value={state.projectBrief}
            onChange={(e) => setState((s) => ({ ...s, projectBrief: e.target.value }))}
            className="mt-2 w-full resize-none border-b border-raw/20 bg-transparent pb-2 text-raw outline-none focus:border-raw"
          />
        </label>
        <div className="flex flex-wrap items-center gap-4 md:col-span-2">
          <button
            onClick={send}
            disabled={pending}
            data-magnetic
            data-cursor="send brief"
            className="mono bg-raw px-8 py-4 text-obsidian transition hover:bg-accent hover:text-raw disabled:opacity-40"
          >
            {pending ? "Sending…" : "Send project brief"}
          </button>
          {result ? (
            <span className={result.ok ? "mono text-raw/60" : "mono text-accent"}>{result.message}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mono text-raw/40">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border-b border-raw/20 bg-transparent pb-2 text-raw outline-none focus:border-raw"
      />
    </label>
  );
}
