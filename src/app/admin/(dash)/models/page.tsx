import Link from "next/link";
import { deleteModel, toggleModelStatus } from "@/app/admin/actions";
import { getAllModels } from "@/db/queries";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminModelsPage() {
  const models = await getAllModels();

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mono text-raw/35">Roster</p>
          <h1 className="display-lg mt-3">Talent management</h1>
        </div>
        <Link
          href="/admin/models/new"
          className="mono bg-raw px-6 py-3 text-obsidian transition hover:bg-accent hover:text-raw"
        >
          + New talent
        </Link>
      </header>

      <div className="overflow-x-auto border border-raw/10">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="mono border-b border-raw/10 text-left text-raw/35">
              <th className="p-4 font-normal">Talent</th>
              <th className="p-4 font-normal">Board</th>
              <th className="p-4 font-normal">Stats</th>
              <th className="p-4 font-normal">Status</th>
              <th className="p-4 font-normal">Added</th>
              <th className="p-4 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model) => (
              <tr key={model.id} className="border-b border-raw/5 align-middle">
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={model.featuredImage}
                      alt={model.name}
                      className="h-16 w-12 border border-raw/10 object-cover"
                    />
                    <div>
                      <p className="text-raw">{model.name}</p>
                      <p className="mono mt-1 text-raw/30">/{model.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="mono p-4 text-raw/60">{model.category}</td>
                <td className="mono p-4 text-raw/40">
                  {model.stats?.height ?? "—"} · {model.stats?.waist ?? "—"} ·{" "}
                  {model.stats?.shoe ?? "—"}
                </td>
                <td className="p-4">
                  <form action={toggleModelStatus}>
                    <input type="hidden" name="id" value={model.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={model.status === "published" ? "draft" : "published"}
                    />
                    <button
                      className={`mono border px-3 py-1.5 transition ${
                        model.status === "published"
                          ? "border-raw/30 text-raw"
                          : "border-accent/50 text-accent"
                      }`}
                    >
                      {model.status}
                    </button>
                  </form>
                </td>
                <td className="mono p-4 text-raw/35">{formatDate(model.createdAt)}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/models/${model.id}`} className="mono text-raw/60 hover:text-raw">
                      Edit
                    </Link>
                    <Link
                      href={`/talent/${model.slug}`}
                      className="mono text-raw/40 hover:text-raw"
                      target="_blank"
                    >
                      View
                    </Link>
                    <form action={deleteModel}>
                      <input type="hidden" name="id" value={model.id} />
                      <button className="mono text-accent/70 hover:text-accent">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {models.length === 0 ? (
              <tr>
                <td colSpan={6} className="mono p-8 text-raw/35">
                  No talent yet — create the first board entry.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
