"use client";

import { Briefcase } from "lucide-react";
import { useTranslations } from "next-intl";
import { MotionDiv, StaggerContainer, StaggerItem } from "./MotionWrapper";
import { motion } from "framer-motion";
import HudFrame from "./HudFrame";

type ExperienceItem = {
  title: string;
  company: string;
  period: string;
  bullets: string[];
  technologies: string[];
};

export default function Experience() {
  const t = useTranslations("experience");
  const experiences = t.raw("items") as ExperienceItem[];

  return (
    <section id="experience" className="relative py-24 bg-section-alt">
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

        <div className="relative">
          <div
            className="absolute left-8 top-0 bottom-0 w-px hidden md:block"
            style={{
              background:
                "linear-gradient(to bottom, transparent, #ffc300, transparent)",
            }}
          />

          <StaggerContainer className="space-y-10" staggerDelay={0.2}>
            {experiences.map((exp, idx) => (
              <StaggerItem key={idx} variant="slideLeft">
                <div className="relative flex gap-6 md:gap-10">
                  <motion.div
                    className="hidden md:flex shrink-0 w-16 h-16 items-center justify-center border-2 z-10"
                    style={{
                      borderColor: "rgba(255,195,0,0.3)",
                      background: "rgba(255,195,0,0.05)",
                      boxShadow: "0 0 15px rgba(255, 195, 0, 0.1)",
                    }}
                    whileHover={{
                      scale: 1.1,
                      borderColor: "#ffc300",
                      boxShadow: "0 0 25px rgba(255, 195, 0, 0.25)",
                    }}
                  >
                    <Briefcase size={20} className="text-gold" />
                  </motion.div>

                  <HudFrame className="flex-1">
                    <motion.div
                      className="p-6 bg-card-bg border border-card-border backdrop-blur-sm"
                      whileHover={{
                        borderColor: "rgba(255,195,0,0.25)",
                        boxShadow: "0 0 25px rgba(255, 195, 0, 0.06)",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {exp.title}
                          </h3>
                          <p className="text-gold text-sm font-medium">
                            {exp.company}
                          </p>
                        </div>
                        <span
                          className="font-mono text-xs text-gold/70 px-3 py-1 whitespace-nowrap tracking-wider"
                          style={{
                            border: "1px solid rgba(255,195,0,0.15)",
                            background: "rgba(255,195,0,0.05)",
                          }}
                        >
                          {exp.period}
                        </span>
                      </div>
                      <ul className="text-muted text-sm leading-relaxed mb-4 space-y-2 list-disc pl-4 marker:text-gold/50">
                        {exp.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="font-mono text-xs px-2.5 py-1 text-gold/80"
                            style={{
                              border: "1px solid rgba(255,195,0,0.2)",
                              background: "rgba(255,195,0,0.05)",
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </HudFrame>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
