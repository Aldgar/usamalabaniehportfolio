/** Public inbox shown in the UI; must match Resend testing allowlist until a domain is verified. */
export const PORTFOLIO_EMAIL_DISPLAY = "usamalabanieh87@gmail.com";

/** Canonical public URL for “Open portfolio” in confirmation emails (not preview hosts). */
const DEFAULT_PORTFOLIO_SITE = "https://usamalabanieh.com";

/** Use `NEXT_PUBLIC_SITE_URL` when set (e.g. production); otherwise the live portfolio domain. */
export function getPortfolioCanonicalUrl(): string {
  const u = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (u) return u.replace(/\/$/, "");
  return DEFAULT_PORTFOLIO_SITE;
}
