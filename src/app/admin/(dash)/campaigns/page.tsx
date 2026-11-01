import Link from "next/link";
import { deleteCampaign } from "@/app/admin/actions";
import { getAllCampaigns } from "@/db/queries";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCampaignsPage() {
  const campaigns = await getAllCampaigns();

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mono text-raw/35">Portfolio</p>
          <h1 className="display-lg mt-3">Campaigns &amp; productions</h1>
        </div>
        <Link
          href="/admin/campaigns/new"
          className="mono bg-raw px-6 py-3 text-obsidian transition hover:bg-accent hover:text-raw"
        >
          + New project
        </Link>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {campaigns.map((campaign) => (
          <article key={campaign.id} className="border border-raw/10">
            <div className="relative aspect-[16/10] overflow-hidden bg-ink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={campaign.coverMediaUrl}
                alt={campaign.title}
                className="h-full w-full object-cover opacity-80"
              />
              <span className="mono absolute top-3 left-3 bg-obsidian/70 px-2 py-1 text-raw/70">
                {campaign.category}
              </span>
            </div>
            <div className="space-y-3 p-5">
              <h2 className="font-display text-lg uppercase">{campaign.title}</h2>
              <p className="mono text-raw/35">
                {campaign.clientBrand} · {formatDate(campaign.publishedAt)} · {campaign.status}
              </p>
              <div className="flex items-center gap-4 pt-2">
                <Link href={`/admin/campaigns/${campaign.id}`} className="mono text-raw/60 hover:text-raw">
                  Edit
                </Link>
                <form action={deleteCampaign}>
                  <input type="hidden" name="id" value={campaign.id} />
                  <button className="mono text-accent/70 hover:text-accent">Delete</button>
                </form>
              </div>
            </div>
          </article>
        ))}
        {campaigns.length === 0 ? (
          <p className="mono text-raw/35">No projects yet.</p>
        ) : null}
      </div>
    </div>
  );
}
