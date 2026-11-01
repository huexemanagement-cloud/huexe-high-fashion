import { Resend } from "resend";

export type EmailPayload = {
  apiKey?: string;
  from?: string;
  to: string | string[];
  subject: string;
  html: string;
};

export async function sendEmail({ apiKey, from, to, subject, html }: EmailPayload) {
  const activeKey = apiKey?.trim() || process.env.RESEND_API_KEY?.trim();
  const defaultFrom = from?.trim() || process.env.RESEND_FROM_EMAIL?.trim() || "HUEXE Studio <onboarding@resend.dev>";

  if (!activeKey) {
    console.info(`[huexe:email] Notification to [${Array.isArray(to) ? to.join(", ") : to}] skipped (Resend API key not set in Admin Settings or env).`);
    return { ok: false, skipped: true, error: "No Resend API key configured" };
  }

  try {
    const resend = new Resend(activeKey);
    const { data, error } = await resend.emails.send({
      from: defaultFrom,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("[huexe:email] Resend API error:", error);
      return { ok: false, error: error.message };
    }

    return { ok: true, data };
  } catch (err) {
    console.error("[huexe:email] Dispatch exception:", err);
    return { ok: false, error: (err as Error)?.message || "Failed to dispatch email." };
  }
}

export function generateScoutingConfirmationHtml(applicantName: string) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f3; padding: 40px; border-radius: 4px;">
      <h1 style="font-size: 24px; letter-spacing: 0.1em; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 20px; margin-bottom: 24px;">HUEXE // SCOUTING BOARD</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #e8e6e1;">Dear ${applicantName},</p>
      <p style="font-size: 15px; line-height: 1.6; color: #8a8a85;">We have received your digital scouting submission. Our casting board reviews all prospective talent entries weekly.</p>
      <p style="font-size: 15px; line-height: 1.6; color: #8a8a85;">If your profile matches our current editorial or runway requirements, a studio director will reach out directly with instructions for test polaroids.</p>
      <div style="margin-top: 36px; padding-top: 20px; border-top: 1px solid #222; font-size: 12px; color: #666; letter-spacing: 0.05em; text-transform: uppercase;">
        HUEXE MOTHER AGENCY & STUDIO — SOUTH INDIA // PARIS // MILAN
      </div>
    </div>
  `;
}

export function generateInquiryAcknowledgmentHtml(contactName: string, companyName: string, serviceType: string) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f5f5f3; padding: 40px; border-radius: 4px;">
      <h1 style="font-size: 24px; letter-spacing: 0.1em; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 20px; margin-bottom: 24px;">HUEXE // PRODUCTION &amp; CASTING</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #e8e6e1;">Hello ${contactName},</p>
      <p style="font-size: 15px; line-height: 1.6; color: #8a8a85;">Thank you for contacting HUEXE regarding <strong>${serviceType}</strong> on behalf of <strong>${companyName}</strong>.</p>
      <p style="font-size: 15px; line-height: 1.6; color: #8a8a85;">Your project brief has been logged with our executive team. An agent will review the specifications and follow up within 24 business hours.</p>
      <div style="margin-top: 36px; padding-top: 20px; border-top: 1px solid #222; font-size: 12px; color: #666; letter-spacing: 0.05em; text-transform: uppercase;">
        HUEXE MOTHER AGENCY & STUDIO — SOUTH INDIA // PARIS // MILAN
      </div>
    </div>
  `;
}

