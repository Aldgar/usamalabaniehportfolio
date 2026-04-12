import { escapeHtml } from "./escape-html";
import type { AppLocale } from "@/lib/i18n-config";
import { getTranslator } from "@/lib/i18n-server";

const GOLD = "#e8b923";
const BG = "#0a0e1a";
const SURFACE = "#0f1419";
const BORDER = "rgba(232, 185, 35, 0.22)";
const TEXT = "#e8eaed";
const SUBTLE = "#8b929a";

function excerpt(text: string, max = 200): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

function firstWordOrFallback(full: string, fallback: string): string {
  const p = full.trim().split(/\s+/)[0];
  return p || fallback;
}

export function buildSenderConfirmationHtml(
  params: {
    recipientName: string;
    subject: string;
    messagePreview: string;
    siteUrl: string | null;
    referenceId?: string | null;
  },
  locale: AppLocale
): string {
  const nls = getTranslator(locale);
  const fallbackName = nls("email.confirmation.dearFallbackName");
  const subject = escapeHtml(params.subject);
  const preview = escapeHtml(excerpt(params.messagePreview)).replace(
    /\n/g,
    "<br/>"
  );
  const ref = params.referenceId?.trim();
  const refBlock = ref
    ? `<p style="margin:0 0 20px 0;font-size:12px;font-family:ui-monospace,Consolas,monospace;color:${SUBTLE};letter-spacing:0.04em;">${escapeHtml(nls("email.confirmation.reference"))} <span style="color:${GOLD};">${escapeHtml(ref.slice(0, 36))}</span></p>`
    : "";

  const cta = params.siteUrl
    ? `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:28px 0 0 0;">
        <tr>
          <td style="border-radius:2px;background:${GOLD};">
            <a href="${escapeHtml(params.siteUrl)}" style="display:inline-block;padding:12px 22px;font-size:13px;font-weight:600;color:#0a0e1a;text-decoration:none;font-family:ui-sans-serif,system-ui,sans-serif;letter-spacing:0.06em;text-transform:uppercase;">${escapeHtml(nls("email.confirmation.cta"))}</a>
          </td>
        </tr>
      </table>`
    : "";

  const rawFirst = firstWordOrFallback(params.recipientName, fallbackName);
  const dearHtml = `Beste ${escapeHtml(rawFirst)},`;

  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <title>${escapeHtml(nls("email.confirmation.metaTitle"))}</title>
  <!-- -->
</head>
<body style="margin:0;padding:0;background:${BG};-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(nls("email.confirmation.preheader"))}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BG};padding:40px 16px 48px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:520px;border-collapse:separate;border-spacing:0;">
          <tr>
            <td style="padding:0 0 24px 0;border-bottom:1px solid ${BORDER};">
              <p style="margin:0 0 6px 0;font-family:ui-monospace,Consolas,monospace;font-size:10px;letter-spacing:0.28em;color:${GOLD};text-transform:uppercase;">${escapeHtml(nls("email.confirmation.brandLine"))}</p>
              <p style="margin:0;font-size:11px;color:${SUBTLE};letter-spacing:0.12em;text-transform:uppercase;">${escapeHtml(nls("email.confirmation.brandSub"))}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 0 0 0;">
              <p style="margin:0 0 16px 0;font-size:17px;font-weight:600;color:${TEXT};line-height:1.45;font-family:Georgia,'Times New Roman',serif;">${dearHtml}</p>
              <p style="margin:0 0 18px 0;font-size:15px;line-height:1.7;color:${TEXT};font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
                ${escapeHtml(nls("email.confirmation.body1"))}
              </p>
              ${refBlock}
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${SURFACE};border:1px solid ${BORDER};border-radius:3px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <p style="margin:0 0 6px 0;font-size:10px;font-family:ui-monospace,monospace;letter-spacing:0.14em;color:${GOLD};text-transform:uppercase;">${escapeHtml(nls("email.confirmation.subjectHeading"))}</p>
                    <p style="margin:0 0 16px 0;font-size:15px;font-weight:600;color:${TEXT};line-height:1.4;">${subject}</p>
                    <p style="margin:0 0 8px 0;font-size:10px;font-family:ui-monospace,monospace;letter-spacing:0.12em;color:${SUBTLE};text-transform:uppercase;">${escapeHtml(nls("email.confirmation.excerptHeading"))}</p>
                    <p style="margin:0;font-size:14px;line-height:1.65;color:#c4c9cf;">${preview}</p>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0 0;font-size:14px;line-height:1.7;color:${TEXT};font-family:ui-sans-serif,system-ui,sans-serif;">
                ${escapeHtml(nls("email.confirmation.body2"))}
              </p>
              ${cta}
            </td>
          </tr>
          <tr>
            <td style="padding:36px 0 0 0;border-top:1px solid ${BORDER};">
              <p style="margin:0;font-size:13px;line-height:1.65;color:${SUBTLE};font-family:ui-sans-serif,system-ui,sans-serif;">
                ${escapeHtml(nls("email.confirmation.signoff"))}<br /><br />
                <strong style="color:${TEXT};">Usama Labanieh</strong><br />
                <span style="color:${SUBTLE};">${escapeHtml(nls("email.confirmation.location"))}</span>
              </p>
              <p style="margin:20px 0 0 0;font-size:11px;line-height:1.5;color:#5c636a;font-family:ui-sans-serif,sans-serif;">
                ${escapeHtml(nls("email.confirmation.footerNote"))}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildSenderConfirmationText(
  params: {
    recipientName: string;
    subject: string;
    messagePreview: string;
    siteUrl: string | null;
    referenceId?: string | null;
  },
  locale: AppLocale
): string {
  const nls = getTranslator(locale);
  const fallbackName = nls("email.confirmation.dearFallbackName");
  const preview = excerpt(params.messagePreview);
  const ref = params.referenceId?.trim();
  const nameWord = firstWordOrFallback(params.recipientName, fallbackName);

  const lines: string[] = [
    nls("email.confirmation.textHeader"),
    "",
    nls("email.confirmation.dear", { name: nameWord }),
    "",
    nls("email.confirmation.textThanks"),
    "",
  ];

  if (ref) lines.push(`${nls("email.confirmation.reference")}: ${ref}`, "");
  lines.push(
    `${nls("email.confirmation.textSubject")} ${params.subject}`,
    "",
    `${nls("email.confirmation.textExcerpt")}`,
    preview,
    "",
    nls("email.confirmation.textReply"),
    "",
    nls("email.confirmation.textRegards"),
    "Usama Labanieh",
    nls("email.confirmation.location")
  );
  if (params.siteUrl) {
    lines.push("", `${nls("email.confirmation.textPortfolio")} ${params.siteUrl}`);
  }
  return lines.join("\n");
}
