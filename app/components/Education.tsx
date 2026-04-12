"use client";

import { GraduationCap, Award, Languages } from "lucide-react";
import { useTranslations } from "next-intl";
import { MotionDiv, StaggerContainer, StaggerItem } from "./MotionWrapper";
import HudFrame from "./HudFrame";

type CertItem = { title: string; org: string; period: string };
type FormalItem = { title: string; org: string; period: string };
type LangItem = { name: string; level: string };

export default function Education() {
  const t = useTranslations("education");
  const certifications = t.raw("certifications") as CertItem[];
  const formalEducation = t.raw("formal") as FormalItem[];
  const languages = t.raw("languages") as LangItem[];

  return (
    <section id="education" className="relative py-24 bg-section-alt">
      <div className="absolute inset-0 grid-bg" />
      <div className="relative max-w-5xl mx-auto px-6">
        <MotionDiv variant="fadeUp" className="text-center mb-16">
          <span className="font-mono text-xs text-gold uppercase tracking-[0.3em] block mb-3">
            {t("kicker")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {t("title")}
          </h2>
        </MotionDiv>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <StaggerContainer className="space-y-6" staggerDelay={0.1}>
            <StaggerItem variant="slideLeft">
              <HudFrame>
                <div className="p-6 bg-card-bg border border-card-border backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="p-2 text-gold"
                      style={{
                        border: "1px solid rgba(255,195,0,0.2)",
                        background: "rgba(255,195,0,0.05)",
                      }}
                    >
                      <Award size={18} />
                    </div>
                    <h3 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">
                      {t("certificationsTitle")}
                    </h3>
                  </div>
                  <ul className="space-y-4">
                    {certifications.map((c) => (
                      <li
                        key={c.title}
                        className="border-b border-card-border pb-4 last:border-0 last:pb-0"
                      >
                        <p className="text-foreground text-sm font-medium leading-snug">
                          {c.title}
                        </p>
                        <p className="text-gold/80 text-xs font-mono mt-1">
                          {c.org}
                        </p>
                        <span
                          className="inline-block mt-2 font-mono text-[10px] text-gold/60 px-2 py-0.5 tracking-wider"
                          style={{
                            border: "1px solid rgba(255,195,0,0.15)",
                            background: "rgba(255,195,0,0.05)",
                          }}
                        >
                          {c.period}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </HudFrame>
            </StaggerItem>

            <StaggerItem variant="slideLeft">
              <HudFrame>
                <div className="p-6 bg-card-bg border border-card-border backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="p-2 text-gold"
                      style={{
                        border: "1px solid rgba(255,195,0,0.2)",
                        background: "rgba(255,195,0,0.05)",
                      }}
                    >
                      <GraduationCap size={18} />
                    </div>
                    <h3 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">
                      {t("formalTitle")}
                    </h3>
                  </div>
                  {formalEducation.map((e) => (
                    <div key={e.title}>
                      <p className="text-foreground text-sm font-medium leading-snug">
                        {e.title}
                      </p>
                      <p className="text-muted text-xs mt-1">{e.org}</p>
                      <span
                        className="inline-block mt-2 font-mono text-[10px] text-gold/60 px-2 py-0.5 tracking-wider"
                        style={{
                          border: "1px solid rgba(255,195,0,0.15)",
                          background: "rgba(255,195,0,0.05)",
                        }}
                      >
                        {e.period}
                      </span>
                    </div>
                  ))}
                </div>
              </HudFrame>
            </StaggerItem>
          </StaggerContainer>

          <MotionDiv variant="slideRight" delay={0.1}>
            <HudFrame>
              <div className="p-6 h-full bg-card-bg border border-card-border backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="p-2 text-gold"
                    style={{
                      border: "1px solid rgba(255,195,0,0.2)",
                      background: "rgba(255,195,0,0.05)",
                    }}
                  >
                    <Languages size={18} />
                  </div>
                  <h3 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider">
                    {t("languagesTitle")}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {languages.map((lang) => (
                    <li
                      key={lang.name}
                      className="flex items-center justify-between gap-4 py-2 border-b border-card-border last:border-0"
                    >
                      <span className="text-foreground text-sm">{lang.name}</span>
                      <span
                        className="font-mono text-xs text-gold/80 shrink-0 px-2 py-0.5"
                        style={{
                          border: "1px solid rgba(255,195,0,0.2)",
                          background: "rgba(255,195,0,0.05)",
                        }}
                      >
                        {lang.level}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </HudFrame>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}
