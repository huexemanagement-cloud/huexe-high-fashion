"use client";

import { useActionState } from "react";
import { createTeamMember, type FormState } from "@/app/admin/actions";
import { SelectField, TextField } from "@/components/admin/Fields";

const initial: FormState = { ok: false, message: "" };

export function TeamForm() {
  const [state, action, pending] = useActionState(createTeamMember, initial);

  return (
    <form action={action} className="mt-6 space-y-5">
      <TextField label="Name" name="name" />
      <TextField label="Email" name="email" type="email" required />
      <TextField label="Temporary password" name="password" type="password" required />
      <SelectField label="Role" name="role" options={["owner", "editor", "scout"]} defaultValue="editor" />
      <button
        disabled={pending}
        className="mono w-full bg-raw py-3 text-obsidian transition hover:bg-accent hover:text-raw disabled:opacity-40"
      >
        {pending ? "Adding…" : "Add member"}
      </button>
      {state.message ? (
        <p className={state.ok ? "mono text-raw/70" : "mono text-accent"}>{state.message}</p>
      ) : null}
    </form>
  );
}
