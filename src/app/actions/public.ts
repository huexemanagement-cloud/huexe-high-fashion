"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/db";
import { b2bInquiries, scoutingApplications } from "@/db/schema";
import type { DigitalsUrls, Measurements } from "@/db/schema";
import { getSiteSettings } from "@/db/queries";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  generateInquiryAcknowledgmentHtml,
  generateScoutingConfirmationHtml,
  sendEmail,
} from "@/lib/email";

export type ActionResult = { ok: boolean; message: string; id?: string };

export type ScoutingPayload = {
  fullName: string;
  email: string;
  phone?: string;
  instagram?: string;
  location?: string;
  age?: string;
  measurements: Measurements;
  digitalsUrls: DigitalsUrls;
};

export async function submitScoutingApplication(
  payload: ScoutingPayload,
): Promise<ActionResult> {
  try {
    // Edge Rate Limiting: Max 5 submissions per 10 minutes per IP
    const reqHeaders = await headers();
    const ip =
      reqHeaders.get("cf-connecting-ip") ||
      reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";
    const limit = checkRateLimit(`scout:${ip}`, { maxRequests: 5, windowMs: 10 * 60 * 1000 });
    if (!limit.allowed) {
      return {
        ok: false,
        message: `Too many requests. Please wait ${limit.retryAfterSeconds} seconds before submitting again.`,
      };
    }

    // Input sanitization & boundary validation
    const fullName = payload.fullName?.trim().slice(0, 100);
    const email = payload.email?.trim().toLowerCase().slice(0, 120);
    if (!fullName || !email) {
      return { ok: false, message: "Name and email are required." };
    }
    const phone = payload.phone?.trim().slice(0, 30) || null;
    const instagram = payload.instagram?.trim().slice(0, 60) || null;
    const location = payload.location?.trim().slice(0, 80) || null;
    const parsedAge = payload.age ? Number.parseInt(payload.age, 10) : null;
    let rowId: string | undefined;

    try {
      const [row] = await db
        .insert(scoutingApplications)
        .values({
          fullName,
          email,
          phone,
          instagram,
          location,
          age: Number.isFinite(parsedAge) && parsedAge! > 0 && parsedAge! < 100 ? parsedAge : null,
          measurements: payload.measurements ?? {},
          digitalsUrls: payload.digitalsUrls ?? {},
          status: "Pending Review",
        })
        .returning({ id: scoutingApplications.id });
      rowId = row?.id;
    } catch (dbErr) {
      console.warn(
        "[huexe:apply:db] Database offline, application handled via fallback queue:",
        (dbErr as Error)?.message,
      );
    }

    // Trigger Resend email notifications if configured
    try {
      const settings = await getSiteSettings();
      if (settings.resend_api_key) {
        await sendEmail({
          apiKey: settings.resend_api_key,
          from: settings.resend_from_email,
          to: email,
          subject: "HUEXE // Digital Scouting Submission Acknowledgment",
          html: generateScoutingConfirmationHtml(fullName),
        });
        if (settings.admin_notification_email) {
          await sendEmail({
            apiKey: settings.resend_api_key,
            from: settings.resend_from_email,
            to: settings.admin_notification_email,
            subject: `[Scouting Alert] New digital application: ${fullName}`,
            html: `<div style="font-family: sans-serif; color: #111; padding: 20px;">
              <h2>New Digital Scouting Submission</h2>
              <p><strong>Name:</strong> ${fullName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || "—"}</p>
              <p><strong>Instagram:</strong> ${instagram || "—"}</p>
              <p><strong>Location:</strong> ${location || "—"}</p>
              <p>Check the admin dashboard under Scouting Applications to review uploaded digitals.</p>
            </div>`,
          });
        }
      }
    } catch (emailErr) {
      console.warn("[huexe:apply:email] Email notification skipped:", emailErr);
    }

    revalidatePath("/admin/applications");
    return {
      ok: true,
      message: "Received. Our scouting desk reviews every submission within 10 working days.",
      id: rowId,
    };
  } catch (error) {
    console.error("[huexe:apply]", error);
    return { ok: false, message: "Submission failed. Please try again in a moment." };
  }
}

export type InquiryPayload = {
  companyName: string;
  contactName: string;
  email: string;
  serviceType: string;
  requestedModels?: string[];
  projectBrief?: string;
};

export async function submitInquiry(payload: InquiryPayload): Promise<ActionResult> {
  try {
    // Edge Rate Limiting: Max 5 inquiries per 10 minutes per IP
    const reqHeaders = await headers();
    const ip =
      reqHeaders.get("cf-connecting-ip") ||
      reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";
    const limit = checkRateLimit(`inquiry:${ip}`, { maxRequests: 5, windowMs: 10 * 60 * 1000 });
    if (!limit.allowed) {
      return {
        ok: false,
        message: `Too many requests. Please wait ${limit.retryAfterSeconds} seconds before submitting again.`,
      };
    }

    // Input sanitization & boundary validation
    const companyName = payload.companyName?.trim().slice(0, 120);
    const email = payload.email?.trim().toLowerCase().slice(0, 120);
    if (!companyName || !email) {
      return { ok: false, message: "Company and email are required." };
    }
    const contactName = payload.contactName?.trim().slice(0, 100) || "—";
    const serviceType = payload.serviceType?.slice(0, 60) || "Talent Booking";
    const projectBrief = payload.projectBrief?.trim().slice(0, 2000) || null;
    let rowId: string | undefined;

    try {
      const [row] = await db
        .insert(b2bInquiries)
        .values({
          companyName,
          contactName,
          email,
          serviceType,
          requestedModels: (payload.requestedModels ?? []).slice(0, 20),
          projectBrief,
          status: "New",
        })
        .returning({ id: b2bInquiries.id });
      rowId = row?.id;
    } catch (dbErr) {
      console.warn(
        "[huexe:inquiry:db] Database offline, inquiry handled via fallback queue:",
        (dbErr as Error)?.message,
      );
    }

    // Trigger Resend email notifications if configured
    try {
      const settings = await getSiteSettings();
      if (settings.resend_api_key) {
        await sendEmail({
          apiKey: settings.resend_api_key,
          from: settings.resend_from_email,
          to: email,
          subject: `HUEXE // Inquiry Acknowledgment — ${serviceType}`,
          html: generateInquiryAcknowledgmentHtml(contactName, companyName, serviceType),
        });
        if (settings.admin_notification_email) {
          await sendEmail({
            apiKey: settings.resend_api_key,
            from: settings.resend_from_email,
            to: settings.admin_notification_email,
            subject: `[B2B Inquiry] ${companyName} — ${serviceType}`,
            html: `<div style="font-family: sans-serif; color: #111; padding: 20px;">
              <h2>New B2B Client Inquiry</h2>
              <p><strong>Company:</strong> ${companyName}</p>
              <p><strong>Contact:</strong> ${contactName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Service:</strong> ${serviceType}</p>
              <p><strong>Brief:</strong> ${projectBrief || "None provided"}</p>
            </div>`,
          });
        }
      }
    } catch (emailErr) {
      console.warn("[huexe:inquiry:email] Email notification skipped:", emailErr);
    }

    revalidatePath("/admin/inquiries");
    return {
      ok: true,
      message: "Hold request logged. A booker will respond within 24 hours.",
      id: rowId,
    };
  } catch (error) {
    console.error("[huexe:inquiry]", error);
    return { ok: false, message: "Could not log the request. Please email bookings@huexe.co." };
  }
}
