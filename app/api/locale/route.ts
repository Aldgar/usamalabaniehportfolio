import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { LOCALE_COOKIE, type AppLocale } from "@/lib/i18n-config";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const raw =
    body && typeof body === "object" && "locale" in body
      ? (body as { locale?: unknown }).locale
      : undefined;
  const localeStr = typeof raw === "string" ? raw : "";
  if (localeStr !== "en" && localeStr !== "nl") {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }

  const locale = localeStr as AppLocale;

  const jar = await cookies();
  jar.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return NextResponse.json({ ok: true, locale });
}
