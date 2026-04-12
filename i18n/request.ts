import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import {
  LOCALE_COOKIE,
  parseLocale,
  type AppLocale,
} from "@/lib/i18n-config";

export default getRequestConfig(async () => {
  const store = await cookies();
  const locale: AppLocale = parseLocale(store.get(LOCALE_COOKIE)?.value);

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
