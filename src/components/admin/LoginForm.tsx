"use client";

import { useActionState } from "react";
import { loginAction, type FormState } from "@/app/admin/actions";

const initial: FormState = { ok: false, message: "" };

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);

  return (
    <form action={action} className="space-y-6">
      <div className="space-y-1">
        <label className="block">
          <div className="flex items-center justify-between">
            <span className="mono text-[11px] tracking-[0.24em] text-raw/60">
              Identity / Email
            </span>
            <span className="mono-xs text-raw/30">STUDIO ID</span>
          </div>
          <div className="relative mt-2">
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="director@huexe.co"
              className="w-full border border-raw/15 bg-obsidian/70 px-4 py-3 font-mono text-sm text-raw placeholder:text-raw/20 transition-colors focus:border-raw/70 focus:outline-none"
            />
          </div>
        </label>
      </div>

      <div className="space-y-1">
        <label className="block">
          <div className="flex items-center justify-between">
            <span className="mono text-[11px] tracking-[0.24em] text-raw/60">
              Passphrase
            </span>
            <span className="mono-xs text-raw/30">ENCRYPTED</span>
          </div>
          <div className="relative mt-2">
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••••••"
              className="w-full border border-raw/15 bg-obsidian/70 px-4 py-3 font-mono text-sm tracking-widest text-raw placeholder:text-raw/20 transition-colors focus:border-raw/70 focus:outline-none"
            />
          </div>
        </label>
      </div>

      {state.message ? (
        <div className="border border-accent/30 bg-accent/10 px-4 py-3">
          <p className="mono text-xs tracking-wider text-accent">
            {state.message}
          </p>
        </div>
      ) : null}

      <div className="pt-2">
        <button
          type="submit"
          disabled={pending}
          className="mono group relative w-full overflow-hidden bg-raw py-4 text-xs tracking-[0.28em] text-obsidian transition-all duration-300 hover:bg-bone disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {pending ? (
              <>
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-obsidian border-t-transparent" />
                <span>VERIFYING CREDENTIALS…</span>
              </>
            ) : (
              <>
                <span>ENTER ATELIER</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </>
            )}
          </span>
        </button>
      </div>

      <div className="flex items-center justify-between border-t border-raw/10 pt-4">
        <span className="mono text-[10px] tracking-[0.2em] text-raw/30">
          ENCRYPTION: AES-256 / SCRYPT
        </span>
        <span className="mono text-[10px] tracking-[0.2em] text-raw/30">
          TLS 1.3 VERIFIED
        </span>
      </div>
    </form>
  );
}
