"use server";

import crypto from "crypto";
import { getSiteSettings } from "@/db/queries";

export type CloudinarySignatureResponse = {
  enabled: boolean;
  cloudName?: string;
  apiKey?: string;
  folder?: string;
  timestamp?: number;
  signature?: string;
  error?: string;
};

export async function getCloudinaryUploadSignatureAction(): Promise<CloudinarySignatureResponse> {
  try {
    const settings = await getSiteSettings();
    const cloudName =
      settings.cloudinary_cloud_name?.trim() || process.env.CLOUDINARY_CLOUD_NAME?.trim();
    const apiKey =
      settings.cloudinary_api_key?.trim() || process.env.CLOUDINARY_API_KEY?.trim();
    const apiSecret =
      settings.cloudinary_api_secret?.trim() || process.env.CLOUDINARY_API_SECRET?.trim();
    const folder =
      settings.cloudinary_folder?.trim() ||
      process.env.CLOUDINARY_FOLDER?.trim() ||
      "huexe-production";

    if (!cloudName || !apiKey || !apiSecret) {
      return { enabled: false };
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    // Cloudinary signature algorithm: sorted key=value string + apiSecret, SHA-1 hashed
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

    return {
      enabled: true,
      cloudName,
      apiKey,
      folder,
      timestamp,
      signature,
    };
  } catch (err) {
    console.error("[huexe:cloudinary:sign]", err);
    return { enabled: false, error: (err as Error)?.message };
  }
}

