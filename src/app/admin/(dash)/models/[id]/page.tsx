import { notFound } from "next/navigation";
import { ModelForm } from "@/components/admin/ModelForm";
import { getModelById } from "@/db/queries";

export const dynamic = "force-dynamic";

export default async function EditModelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const model = await getModelById(id);
  if (!model) notFound();

  return (
    <div className="space-y-10">
      <header>
        <p className="mono text-raw/35">Roster / edit</p>
        <h1 className="display-lg mt-3">{model.name}</h1>
      </header>
      <ModelForm model={model} />
    </div>
  );
}
