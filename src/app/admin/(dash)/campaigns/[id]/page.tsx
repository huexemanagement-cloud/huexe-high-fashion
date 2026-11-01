import { notFound } from "next/navigation";
import { CampaignForm } from "@/components/admin/CampaignForm";
import { getCampaignById } from "@/db/queries";

export const dynamic = "force-dynamic";

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await getCampaignById(id);
  if (!campaign) notFound();

  return (
    <div className="space-y-10">
      <header>
        <p className="mono text-raw/35">Portfolio / edit</p>
        <h1 className="display-lg mt-3">{campaign.title}</h1>
      </header>
      <CampaignForm campaign={campaign} />
    </div>
  );
}
