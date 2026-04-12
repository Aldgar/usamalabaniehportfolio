import { createTranslator } from "next-intl";
import type { AppLocale } from "@/lib/i18n-config";
import en from "@/messages/en.json";
import nl from "@/messages/nl.json";

const messages: Record<AppLocale, typeof nl> = {
  en,
  nl,
};

/**
 * Server-side translator. Use dot paths, e.g. `api.errors.noApiKey`,
 * `email.inbound.greeting`.
 */
export function getTranslator(locale: AppLocale) {
  return createTranslator({
    locale,
    messages: messages[locale],
  });
}

/** @deprecated use getTranslator(locale) */
export function getNlTranslator() {
  return getTranslator("nl");
}
