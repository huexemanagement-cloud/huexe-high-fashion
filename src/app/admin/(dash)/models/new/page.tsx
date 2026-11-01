import { ModelForm } from "@/components/admin/ModelForm";

export const dynamic = "force-dynamic";

export default function NewModelPage() {
  return (
    <div className="space-y-10">
      <header>
        <p className="mono text-raw/35">Roster / new</p>
        <h1 className="display-lg mt-3">Add talent</h1>
      </header>
      <ModelForm />
    </div>
  );
}
