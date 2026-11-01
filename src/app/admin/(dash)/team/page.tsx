import { desc } from "drizzle-orm";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { getSessionUser } from "@/lib/auth";
import { TeamForm } from "@/components/admin/TeamForm";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const user = await getSessionUser();
  const members = await db
    .select({
      id: adminUsers.id,
      email: adminUsers.email,
      name: adminUsers.name,
      role: adminUsers.role,
      createdAt: adminUsers.createdAt,
    })
    .from(adminUsers)
    .orderBy(desc(adminUsers.createdAt))
    .catch(() => []);

  return (
    <div className="space-y-10">
      <header>
        <p className="mono text-raw/35">Access control</p>
        <h1 className="display-lg mt-3">Team &amp; roles</h1>
        <p className="mono mt-4 max-w-xl leading-relaxed text-raw/40">
          Role-based access: <span className="text-raw">owner</span> manages the team and every
          record, <span className="text-raw">editor</span> manages roster, portfolio and pipeline,{" "}
          <span className="text-raw">scout</span> reviews submitted digitals.
        </p>
      </header>

      <div className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="border border-raw/10">
          <table className="w-full border-collapse">
            <thead>
              <tr className="mono border-b border-raw/10 text-left text-raw/35">
                <th className="p-4 font-normal">Member</th>
                <th className="p-4 font-normal">Role</th>
                <th className="p-4 font-normal">Added</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-raw/5">
                  <td className="p-4">
                    <p className="text-raw">{member.name}</p>
                    <p className="mono mt-1 text-raw/35">{member.email}</p>
                  </td>
                  <td className="mono p-4 text-accent uppercase">{member.role}</td>
                  <td className="mono p-4 text-raw/35">{formatDate(member.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border border-raw/10 p-6">
          <p className="mono text-raw/35">Invite a studio member</p>
          {user?.role === "owner" ? (
            <TeamForm />
          ) : (
            <p className="mono mt-6 text-raw/40">Owner role required to add members.</p>
          )}
        </div>
      </div>
    </div>
  );
}
