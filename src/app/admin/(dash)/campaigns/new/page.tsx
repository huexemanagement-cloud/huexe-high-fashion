import { CampaignForm } from "@/components/admin/CampaignForm";

export const dynamic = "force-dynamic";

export default function NewCampaignPage() {
  return (
    <div className="space-y-10">
      <header>
        <p className="mono text-raw/35">Portfolio / new</p>
        <h1 className="display-lg mt-3">Add project</h1>
      </header>
      <CampaignForm />
    </div>
  );
}
