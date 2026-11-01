import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { mediaAssets } from "@/db/schema";
import { fallbackMediaCache } from "@/lib/media-cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 24 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const bucket = String(formData.get("bucket") ?? "digitals");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File exceeds 24MB limit" }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const filename = file.name.slice(0, 250) || "upload";
    const mimeType = file.type || "application/octet-stream";

    let mediaId: string;

    try {
      const [row] = await db
        .insert(mediaAssets)
        .values({
          bucket,
          filename,
          mimeType,
          byteSize: file.size,
          dataBase64: base64,
        })
        .returning({ id: mediaAssets.id });
      mediaId = row.id;
    } catch {
      // Fallback storage when DB is offline locally
      mediaId = crypto.randomUUID();
      fallbackMediaCache.set(mediaId, {
        dataBase64: base64,
        mimeType,
        filename,
      });
    }

    return NextResponse.json({
      id: mediaId,
      url: `/api/media/${mediaId}`,
      mimeType,
      size: file.size,
    });
  } catch (error) {
    console.error("[huexe:upload]", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
