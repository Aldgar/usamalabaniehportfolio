import { Github, Linkedin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { SOCIAL } from "@/lib/site-links";

export default async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="relative py-8 bg-section-alt">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #ffc300, transparent)",
        }}
      />
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-mono text-xs text-muted tracking-wider">
          <span className="text-gold/50">{t("sysId")}</span> {t("copyright")}
        </p>
        <div className="flex items-center gap-1">
          {[
            { icon: Github, href: SOCIAL.github, label: "GitHub" },
            { icon: Linkedin, href: SOCIAL.linkedin, label: "LinkedIn" },
          ].map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted hover:text-gold transition-colors"
              aria-label={label}
            >
              <Icon size={15} />
            </a>
          ))}
          <span className="ml-3 font-mono text-[10px] text-gold/30 tracking-widest">
            {t("status")}
          </span>
        </div>
      </div>
    </footer>
  );
}
