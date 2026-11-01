import {
  deleteApplication,
  promoteApplication,
  updateApplication,
} from "@/app/admin/actions";
import { getApplications } from "@/db/queries";
import { APPLICATION_STATUSES, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const applications = await getApplications();
  const grouped = APPLICATION_STATUSES.map((status) => ({
    status,
    items: applications.filter((application) => application.status === status),
  }));

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mono text-raw/35">Scouting pipeline</p>
          <h1 className="display-lg mt-3">Submitted digitals</h1>
        </div>
        <div className="mono flex gap-4 text-raw/40">
          {grouped.map((group) => (
            <span key={group.status}>
              {group.status}: <span className="text-raw">{group.items.length}</span>
            </span>
          ))}
        </div>
      </header>

      <div className="space-y-6">
        {applications.map((application) => {
          const digitals = Object.entries(application.digitalsUrls ?? {}).filter(([, url]) => url);
          const measurements = application.measurements ?? {};
          return (
            <article key={application.id} className="border border-raw/10 p-6">
              <div className="grid gap-8 xl:grid-cols-[1.2fr_1fr_1fr]">
                <div>
                  <div className="flex items-baseline gap-3">
                    <h2 className="font-display text-xl uppercase">{application.fullName}</h2>
                    <span className="mono text-raw/30">
                      {application.age ? `${application.age} yrs` : ""}
                    </span>
                  </div>
                  <p className="mono mt-3 space-x-2 text-raw/45">
                    <span>{application.email}</span>
                    <span>·</span>
                    <span>{application.phone ?? "no phone"}</span>
                  </p>
                  <p className="mono mt-1 text-raw/45">
                    {application.location ?? "—"} · {application.instagram ?? "—"}
                  </p>
                  <p className="mono mt-4 text-raw/25">
                    Submitted {formatDate(application.submittedAt)} · ID {application.id.slice(0, 8)}
                  </p>

                  <dl className="mono mt-5 grid grid-cols-3 gap-y-3 border-t border-raw/10 pt-4 text-raw/50">
                    <Spec label="Height" value={measurements.heightCm ? `${measurements.heightCm} cm` : measurements.heightFt} />
                    <Spec label="Bust" value={measurements.bust} />
                    <Spec label="Waist" value={measurements.waist} />
                    <Spec label="Hips" value={measurements.hips} />
                    <Spec label="Shoe" value={measurements.shoe} />
                  </dl>
                </div>

                <div>
                  <p className="mono text-raw/35">Digitals</p>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {digitals.map(([key, url]) => (
                      <a
                        key={key}
                        href={url as string}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative block aspect-[3/4] overflow-hidden border border-raw/10"
                      >
                        {key === "walkVideo" ? (
                          <video src={url as string} className="h-full w-full object-cover" muted />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={url as string} alt={key} className="h-full w-full object-cover" />
                        )}
                        <span className="mono absolute inset-x-0 bottom-0 bg-obsidian/70 px-1 py-0.5 text-[0.5rem] text-raw/70">
                          {key}
                        </span>
                      </a>
                    ))}
                    {digitals.length === 0 ? (
                      <p className="mono col-span-4 text-raw/25">No uploads attached.</p>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-4">
                  <form action={updateApplication} className="space-y-3">
                    <input type="hidden" name="id" value={application.id} />
                    <label className="block">
                      <span className="mono text-raw/35">Pipeline status</span>
                      <select
                        name="status"
                        defaultValue={application.status}
                        className="mt-2 w-full border border-raw/15 bg-ink px-3 py-2.5 text-sm outline-none focus:border-raw/60"
                      >
                        {APPLICATION_STATUSES.map((status) => (
                          <option key={status} value={status} className="bg-ink">
                            {status}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mono text-raw/35">Internal notes</span>
                      <textarea
                        name="internalNotes"
                        rows={3}
                        defaultValue={application.internalNotes ?? ""}
                        className="mt-2 w-full border border-raw/15 bg-ink px-3 py-2.5 text-sm outline-none focus:border-raw/60"
                      />
                    </label>
                    <button className="mono w-full bg-raw py-2.5 text-obsidian transition hover:bg-accent hover:text-raw">
                      Save pipeline
                    </button>
                  </form>

                  <div className="flex gap-3">
                    <form action={promoteApplication} className="flex-1">
                      <input type="hidden" name="id" value={application.id} />
                      <button className="mono w-full border border-raw/20 py-2.5 text-raw/70 transition hover:border-raw hover:text-raw">
                        Promote to roster
                      </button>
                    </form>
                    <form action={deleteApplication}>
                      <input type="hidden" name="id" value={application.id} />
                      <button className="mono border border-accent/40 px-4 py-2.5 text-accent/80 transition hover:border-accent">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        {applications.length === 0 ? (
          <p className="mono text-raw/35">No submissions yet — the portal is live on the homepage.</p>
        ) : null}
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-raw/25">{label}</dt>
      <dd className="mt-1 text-raw/70">{value || "—"}</dd>
    </div>
  );
}
