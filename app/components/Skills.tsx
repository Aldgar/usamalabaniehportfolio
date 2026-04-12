"use client";

import {
  Brain,
  LineChart,
  BarChart3,
  Wrench,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { MotionDiv, StaggerContainer, StaggerItem } from "./MotionWrapper";
import HudFrame from "./HudFrame";

const icons = [Brain, LineChart, BarChart3, Wrench, Users] as const;

type SkillCategory = {
  title: string;
  skills: string[];
};

export default function Skills() {
  const t = useTranslations("skills");
  const rawCategories = t.raw("categories") as SkillCategory[];
  const skillCategories = rawCategories.map((cat, i) => ({
    ...cat,
    icon: icons[i] ?? Brain,
  }));

  return (
    <section id="skills" className="relative py-24 bg-background">
      <div className="absolute inset-0 grid-bg" />
      <div className="relative max-w-6xl mx-auto px-6">
        <MotionDiv variant="fadeUp" className="text-center mb-16">
          <span className="font-mono text-xs text-gold uppercase tracking-[0.3em] block mb-3">
            {t("kicker")}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {t("title")}
          </h2>
        </MotionDiv>

        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          staggerDelay={0.12}
        >
          {skillCategories.map((category) => {
            const Icon = category.icon;
            return (
              <StaggerItem key={category.title} variant="scaleUp">
                <HudFrame>
                  <motion.div
                    className="p-6 bg-card-bg border border-card-border backdrop-blur-sm h-full"
                    whileHover={{
                      borderColor: "rgba(255,195,0,0.25)",
                      boxShadow: "0 0 25px rgba(255, 195, 0, 0.06)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <motion.div
                        className="p-2 text-gold shrink-0"
                        style={{
                          border: "1px solid rgba(255,195,0,0.2)",
                          background: "rgba(255,195,0,0.05)",
                        }}
                        whileHover={{
                          boxShadow: "0 0 12px rgba(255,195,0,0.3)",
                          borderColor: "rgba(255,195,0,0.5)",
                        }}
                      >
                        <Icon size={18} />
                      </motion.div>
                      <h3 className="font-mono text-sm font-semibold text-foreground uppercase tracking-wider leading-tight">
                        {category.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <span
                          key={skill}
                          className="font-mono text-[11px] leading-snug px-2.5 py-1.5 text-muted"
                          style={{
                            border: "1px solid rgba(255,195,0,0.15)",
                            background: "rgba(255,195,0,0.03)",
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </HudFrame>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
