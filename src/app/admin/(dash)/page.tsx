import Link from "next/link";
import { getApplications, getDashboardStats, getInquiries } from "@/db/queries";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const [stats, applications, inquiries] = await Promise.all([
    getDashboardStats(),
    getApplications(),
    getInquiries(),
  ]);

  const cards = [
    { label: "Talent on roster", value: stats.models, meta: `${stats.publishedModels} published`, href: "/admin/models" },
    { label: "Portfolio projects", value: stats.campaigns, meta: "campaigns & productions", href: "/admin/campaigns" },
    { label: "Scouting applications", value: stats.applications, meta: `${stats.pending} pending review`, href: "/admin/applications" },
    { label: "B2B inquiries", value: stats.inquiries, meta: `${stats.openInquiries} open`, href: "/admin/inquiries" },
  ];

  return (
    <div className="space-y-12">
      <header>
        <p className="mono text-raw/35">Overview</p>
        <h1 className="display-lg mt-3">Agency operations</h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group border border-raw/10 p-6 transition hover:border-raw/40"
          >
            <p className="mono text-raw/35">{card.label}</p>
            <p className="font-display mt-6 text-5xl font-extrabold">{card.value}</p>
            <p className="mono mt-3 text-raw/40 group-hover:text-raw/70">{card.meta} →</p>
          </Link>
        ))}
      </div>

      <section className="grid gap-10 xl:grid-cols-2">
        <div>
          <div className="mono flex items-center justify-between border-b border-raw/10 pb-3 text-raw/35">
            <span>Latest digitals</span>
            <Link href="/admin/applications" className="hover:text-raw">
              Open pipeline →
            </Link>
          </div>
          <ul className="divide-y divide-raw/10">
            {applications.slice(0, 6).map((application) => (
              <li key={application.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-raw">{application.fullName}</p>
                  <p className="mono mt-1 text-raw/35">
                    {application.location ?? "—"} · {formatDate(application.submittedAt)}
                  </p>
                </div>
                <span className="mono border border-raw/20 px-3 py-1.5 text-raw/60">
                  {application.status}
                </span>
              </li>
            ))}
            {applications.length === 0 ? (
              <li className="mono py-6 text-raw/35">No applications yet.</li>
            ) : null}
          </ul>
        </div>

        <div>
          <div className="mono flex items-center justify-between border-b border-raw/10 pb-3 text-raw/35">
            <span>Incoming B2B</span>
            <Link href="/admin/inquiries" className="hover:text-raw">
              Open board →
            </Link>
          </div>
          <ul className="divide-y divide-raw/10">
            {inquiries.slice(0, 6).map((inquiry) => (
              <li key={inquiry.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-raw">{inquiry.companyName}</p>
                  <p className="mono mt-1 text-raw/35">
                    {inquiry.serviceType} · {formatDate(inquiry.createdAt)}
                  </p>
                </div>
                <span className="mono border border-raw/20 px-3 py-1.5 text-raw/60">
                  {inquiry.status}
                </span>
              </li>
            ))}
            {inquiries.length === 0 ? (
              <li className="mono py-6 text-raw/35">No inquiries yet.</li>
            ) : null}
          </ul>
        </div>
      </section>
    </div>
  );
}
