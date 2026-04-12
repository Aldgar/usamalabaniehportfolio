export const LOCALE_COOKIE = "PORTFOLIO_LOCALE";

export type AppLocale = "en" | "nl";

export const locales: AppLocale[] = ["en", "nl"];

export const defaultLocale: AppLocale = "nl";

export function parseLocale(value: string | undefined): AppLocale {
  return value === "en" ? "en" : "nl";
}
