import { Resend } from "resend";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { escapeHtml } from "@/lib/email-templates/escape-html";
import {
  buildSenderConfirmationHtml,
  buildSenderConfirmationText,
} from "@/lib/email-templates/sender-confirmation";
import { LOCALE_COOKIE, parseLocale } from "@/lib/i18n-config";
import { getTranslator } from "@/lib/i18n-server";
import { getPortfolioCanonicalUrl } from "@/lib/contact-constants";

/** Default inbox for form submissions; use CONTACT_TO_EMAIL in .env to override. */
const DEFAULT_TO = "usamalabanieh87@gmail.com";
/**
 * Prefer a reachable mailbox (hello@) over noreply@ — “noreply” often trains
 * Gmail toward Spam/Updates. Override with RESEND_FROM_EMAIL if you need noreply.
 */
const DEFAULT_FROM = "Usama Labanieh <hello@usamalabanieh.com>";

/** Space between two Resend sends to avoid provider edge cases. */
const BETWEEN_SENDS_MS = 600;

export const maxDuration = 60;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function getSiteUrl(): string | null {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const v = process.env.VERCEL_URL?.trim();
  if (v) return `https://${v}`;
  return null;
}

function truncateSubject(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trim()}…`;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const locale = parseLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  const nls = getTranslator(locale);

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM;

  /**
   * Where you receive form notifications. If CONTACT_TO_EMAIL is set to another
   * address (e.g. on Vercel), we also always deliver to DEFAULT_TO so
   * usamalabanieh87@gmail.com is never skipped by a mis-typed env var.
   */
  const configuredTo = process.env.CONTACT_TO_EMAIL?.trim();
  const primaryInbox = configuredTo || DEFAULT_TO;
  const inboundTo: string[] =
    configuredTo &&
    configuredTo.toLowerCase() !== DEFAULT_TO.toLowerCase()
      ? [configuredTo, DEFAULT_TO]
      : [primaryInbox];

  /** Used for reply routing on the visitor acknowledgement email. */
  const ownerReplyTo = primaryInbox;

  if (!apiKey) {
    console.error("contact: missing RESEND_API_KEY");
    return NextResponse.json(
      {
        error: nls("api.errors.noApiKey"),
      },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: nls("api.errors.invalidJson") },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { error: nls("api.errors.invalidPayload") },
      { status: 400 }
    );
  }

  const { name, email, subject, message } = body as Record<string, unknown>;

  const nameStr = typeof name === "string" ? name.trim() : "";
  const emailStr = typeof email === "string" ? email.trim() : "";
  const subjectStr = typeof subject === "string" ? subject.trim() : "";
  const messageStr = typeof message === "string" ? message.trim() : "";

  if (!nameStr || nameStr.length > 120) {
    return NextResponse.json(
      { error: nls("api.errors.invalidName") },
      { status: 400 }
    );
  }
  if (!emailStr || !isValidEmail(emailStr) || emailStr.length > 254) {
    return NextResponse.json(
      { error: nls("api.errors.invalidEmail") },
      { status: 400 }
    );
  }
  if (!subjectStr || subjectStr.length > 200) {
    return NextResponse.json(
      { error: nls("api.errors.invalidSubject") },
      { status: 400 }
    );
  }
  if (!messageStr || messageStr.length > 10000) {
    return NextResponse.json(
      { error: nls("api.errors.invalidMessage") },
      { status: 400 }
    );
  }

  const safeName = escapeHtml(nameStr);
  const safeMessage = escapeHtml(messageStr).replace(/\n/g, "<br/>");
  const siteUrl = getSiteUrl();
  const siteLine = siteUrl
    ? `<p style="margin:24px 0 0 0;font-size:13px;color:#555;">${escapeHtml(nls("email.inbound.siteLine", { url: siteUrl! }))}</p>`
    : `<p style="margin:24px 0 0 0;font-size:13px;color:#555;">${escapeHtml(nls("email.inbound.siteLineNoUrl"))}</p>`;

  const inboundHtml = `
<!DOCTYPE html>
<html lang="nl">
  <body style="font-family: Georgia, 'Times New Roman', serif; line-height: 1.6; color: #1a1a1a; max-width: 560px;">
    <p style="margin:0 0 16px 0; font-size: 16px;">${escapeHtml(nls("email.inbound.greeting"))}</p>
    <p style="margin:0 0 18px 0; font-size: 15px; font-family: system-ui, sans-serif; color: #333;">
      ${escapeHtml(nls("email.inbound.intro"))}
    </p>
    <p style="margin:0 0 6px 0; font-size: 13px; font-family: system-ui, sans-serif; color: #555;"><strong>${escapeHtml(nls("email.inbound.from"))}</strong></p>
    <p style="margin:0 0 16px 0; font-size: 15px; font-family: system-ui, sans-serif;">${safeName} &lt;${escapeHtml(emailStr)}&gt;</p>
    <p style="margin:0 0 6px 0; font-size: 13px; font-family: system-ui, sans-serif; color: #555;"><strong>${escapeHtml(nls("email.inbound.subjectLabel"))}</strong></p>
    <p style="margin:0 0 16px 0; font-size: 15px; font-family: system-ui, sans-serif;">${escapeHtml(subjectStr)}</p>
    <p style="margin:0 0 8px 0; font-size: 13px; font-family: system-ui, sans-serif; color: #555;"><strong>${escapeHtml(nls("email.inbound.messageLabel"))}</strong></p>
    <div style="border-left: 3px solid #c9a227; padding: 12px 0 12px 16px; margin: 0 0 8px 0; font-family: system-ui, sans-serif; font-size: 15px; color: #222;">
      ${safeMessage}
    </div>
    ${siteLine}
  </body>
</html>
`;

  const inboundText = [
    nls("email.inbound.greeting"),
    "",
    nls("email.inbound.intro"),
    "",
    `${nls("email.inbound.from")}: ${nameStr} <${emailStr}>`,
    `${nls("email.inbound.subjectLabel")}: ${subjectStr}`,
    "",
    `${nls("email.inbound.messageLabel")}:`,
    messageStr,
    "",
    siteUrl
      ? nls("email.inbound.siteLine", { url: siteUrl })
      : nls("email.inbound.siteLineNoUrl"),
  ].join("\n");

  /** Personal subject line — reads like a normal thread, not a system alert. */
  const inboundSubject = truncateSubject(
    nls("email.inbound.threadSubject", { subject: subjectStr, name: nameStr }),
    180
  );

  const resend = new Resend(apiKey);

  const inbound = await resend.emails.send({
    from,
    to: inboundTo,
    replyTo: emailStr,
    subject: inboundSubject,
    html: inboundHtml,
    text: inboundText,
  });

  if (inbound.error) {
    console.error(
      "Resend inbound error:",
      inbound.error,
      "to:",
      inboundTo.join(", ")
    );
    const resendMsg = inbound.error.message?.trim() || "";
    return NextResponse.json(
      {
        error: resendMsg
          ? nls("api.errors.provider", { message: resendMsg })
          : nls("api.errors.sendFailed"),
      },
      { status: 502 }
    );
  }

  await new Promise((r) => setTimeout(r, BETWEEN_SENDS_MS));

  const confirmationSubject = truncateSubject(
    nls("email.confirmation.subject", { subject: subjectStr }),
    180
  );

  const portfolioCanonicalUrl = getPortfolioCanonicalUrl();

  const confirmationPayload = {
    from,
    to: [emailStr] as string[],
    /** Replies go to your inbox, not to Resend. */
    replyTo: ownerReplyTo,
    subject: confirmationSubject,
    html: buildSenderConfirmationHtml(
      {
        recipientName: nameStr,
        subject: subjectStr,
        messagePreview: messageStr,
        siteUrl: portfolioCanonicalUrl,
        referenceId: inbound.data?.id ?? null,
      },
      locale
    ),
    text: buildSenderConfirmationText(
      {
        recipientName: nameStr,
        subject: subjectStr,
        messagePreview: messageStr,
        siteUrl: portfolioCanonicalUrl,
        referenceId: inbound.data?.id ?? null,
      },
      locale
    ),
  };

  let confirmation = await resend.emails.send(confirmationPayload);

  if (confirmation.error) {
    console.error(
      "Resend confirmation (html) error:",
      JSON.stringify(confirmation.error)
    );
    confirmation = await resend.emails.send({
      from,
      to: [emailStr],
      replyTo: ownerReplyTo,
      subject: confirmationSubject,
      text: buildSenderConfirmationText(
        {
          recipientName: nameStr,
          subject: subjectStr,
          messagePreview: messageStr,
          siteUrl: portfolioCanonicalUrl,
          referenceId: inbound.data?.id ?? null,
        },
        locale
      ),
    });
  }

  if (confirmation.error) {
    const msg =
      confirmation.error.message?.trim() || "Unknown Resend error";
    console.error("Resend confirmation (fallback) error:", msg);
    return NextResponse.json({
      ok: true,
      id: inbound.data?.id,
      confirmationSent: false,
      confirmationError: msg,
    });
  }

  return NextResponse.json({
    ok: true,
    id: inbound.data?.id,
    confirmationId: confirmation.data?.id,
    confirmationSent: true,
  });
}
