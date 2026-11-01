import { eq } from "drizzle-orm";
import { db } from "@/db";
import { mediaAssets } from "@/db/schema";
import { fallbackMediaCache } from "@/lib/media-cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  try {
    let asset: { dataBase64: string; mimeType: string; filename: string } | undefined;

    try {
      const rows = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1);
      asset = rows[0];
    } catch {
      // Check in-memory fallback
      asset = fallbackMediaCache.get(id);
    }

    if (!asset) {
      asset = fallbackMediaCache.get(id);
    }

    if (!asset) return new Response("Not found", { status: 404 });

    const buffer = Buffer.from(asset.dataBase64, "base64");
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": asset.mimeType,
        "Content-Length": String(buffer.byteLength),
        "Cache-Control": "private, max-age=3600",
        "Content-Disposition": `inline; filename="${asset.filename.replace(/"/g, "")}"`,
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
