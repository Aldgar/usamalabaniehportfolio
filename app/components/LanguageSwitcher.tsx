"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { AppLocale } from "@/lib/i18n-config";

export default function LanguageSwitcher() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("nav");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  async function switchLocale(next: AppLocale) {
    if (next === locale) return;
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: next }),
    });
    startTransition(() => {
      router.refresh();
    });
  }

  const btn =
    "px-1.5 py-1 rounded-sm font-mono text-[11px] uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer";

  return (
    <div
      className="flex items-center gap-0.5 border px-1 py-0.5"
      style={{ borderColor: "rgba(255,195,0,0.2)" }}
      role="group"
      aria-label={t("langAria")}
    >
      <button
        type="button"
        disabled={pending}
        onClick={() => switchLocale("en")}
        className={`${btn} ${
          locale === "en"
            ? "text-gold bg-gold/10"
            : "text-muted hover:text-foreground"
        }`}
      >
        {t("langEn")}
      </button>
      <span className="text-gold/25 select-none" aria-hidden>
        |
      </span>
      <button
        type="button"
        disabled={pending}
        onClick={() => switchLocale("nl")}
        className={`${btn} ${
          locale === "nl"
            ? "text-gold bg-gold/10"
            : "text-muted hover:text-foreground"
        }`}
      >
        {t("langNl")}
      </button>
    </div>
  );
}
