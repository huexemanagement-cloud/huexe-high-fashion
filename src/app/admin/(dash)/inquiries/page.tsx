import { deleteInquiry, updateInquiry } from "@/app/admin/actions";
import { getInquiries, getAllModels } from "@/db/queries";
import { INQUIRY_STATUSES, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  const [inquiries, models] = await Promise.all([getInquiries(), getAllModels()]);
  const nameById = new Map(models.map((model) => [model.id, model.name]));

  return (
    <div className="space-y-10">
      <header>
        <p className="mono text-raw/35">B2B</p>
        <h1 className="display-lg mt-3">Booking &amp; production inquiries</h1>
      </header>

      <div className="overflow-x-auto border border-raw/10">
        <table className="w-full min-w-[960px] border-collapse">
          <thead>
            <tr className="mono border-b border-raw/10 text-left text-raw/35">
              <th className="p-4 font-normal">Company</th>
              <th className="p-4 font-normal">Contact</th>
              <th className="p-4 font-normal">Service</th>
              <th className="p-4 font-normal">Requested talent</th>
              <th className="p-4 font-normal">Brief</th>
              <th className="p-4 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id} className="border-b border-raw/5 align-top">
                <td className="p-4">
                  <p className="text-raw">{inquiry.companyName}</p>
                  <p className="mono mt-1 text-raw/30">{formatDate(inquiry.createdAt)}</p>
                </td>
                <td className="mono p-4 text-raw/55">
                  {inquiry.contactName}
                  <br />
                  <a href={`mailto:${inquiry.email}`} className="text-raw/40 hover:text-raw">
                    {inquiry.email}
                  </a>
                </td>
                <td className="mono p-4 text-raw/55">{inquiry.serviceType}</td>
                <td className="mono p-4 text-raw/45">
                  {(inquiry.requestedModels ?? []).length
                    ? (inquiry.requestedModels ?? [])
                        .map((id: string) => nameById.get(id) ?? id.slice(0, 8))
                        .join(", ")
                    : "—"}
                </td>
                <td className="max-w-sm p-4 text-sm text-raw/55">{inquiry.projectBrief ?? "—"}</td>
                <td className="p-4">
                  <form action={updateInquiry} className="flex flex-col gap-2">
                    <input type="hidden" name="id" value={inquiry.id} />
                    <select
                      name="status"
                      defaultValue={inquiry.status}
                      className="mono border border-raw/15 bg-ink px-3 py-2 outline-none focus:border-raw/60"
                    >
                      {INQUIRY_STATUSES.map((status) => (
                        <option key={status} value={status} className="bg-ink">
                          {status}
                        </option>
                      ))}
                    </select>
                    <button className="mono border border-raw/20 py-2 text-raw/60 transition hover:border-raw hover:text-raw">
                      Update
                    </button>
                  </form>
                  <form action={deleteInquiry} className="mt-2">
                    <input type="hidden" name="id" value={inquiry.id} />
                    <button className="mono text-accent/70 hover:text-accent">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan={6} className="mono p-8 text-raw/35">
                  No inquiries yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
