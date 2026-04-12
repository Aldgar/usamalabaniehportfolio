"use client";

import { ExternalLink, Github, FolderOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { MotionDiv, StaggerContainer, StaggerItem } from "./MotionWrapper";
import HudFrame from "./HudFrame";
import { PROJECT_REPOS } from "@/lib/site-links";

const REPO_ORDER = [
  PROJECT_REPOS.utrechtHousing,
  PROJECT_REPOS.coffeeShopSales,
  PROJECT_REPOS.roadAccident,
  PROJECT_REPOS.covid19,
  PROJECT_REPOS.pizzaSales,
  PROJECT_REPOS.restaurantSalesAnalysis,
  PROJECT_REPOS.rollercoasterEda,
  PROJECT_REPOS.nashvilleHousingCleaning,
  PROJECT_REPOS.worldLayoffsMysql,
  PROJECT_REPOS.fassosRollsSql,
  PROJECT_REPOS.fifaWorldCup2022,
] as const;

type ProjectItem = {
  title: string;
  description: string;
  technologies: string[];
  category: string;
  demo?: string;
};

export default function Projects() {
  const t = useTranslations("projects");
  const rawItems = t.raw("items") as ProjectItem[];
  const projects = rawItems.map((item, idx) => ({
    ...item,
    github: REPO_ORDER[idx],
  }));

  return (
    <section id="projects" className="relative py-24 bg-section-alt">
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
          staggerDelay={0.1}
        >
          {projects.map((project, idx) => (
            <StaggerItem key={idx} variant="fadeUp">
              <HudFrame>
                <motion.div
                  className="group flex flex-col p-6 bg-card-bg border border-card-border backdrop-blur-sm h-full"
                  whileHover={{
                    borderColor: "rgba(255,195,0,0.3)",
                    boxShadow: "0 0 30px rgba(255, 195, 0, 0.08)",
                    y: -4,
                  }}
                  transition={{
                    duration: 0.35,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      whileHover={{
                        rotate: 10,
                        scale: 1.1,
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <FolderOpen size={24} className="text-gold" />
                    </motion.div>
                    {(project.github || project.demo) && (
                      <div className="flex gap-2">
                        {project.github && (
                          <motion.a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-muted hover:text-gold transition-colors"
                            aria-label={t("viewSource")}
                            whileHover={{ scale: 1.2 }}
                          >
                            <Github size={16} />
                          </motion.a>
                        )}
                        {project.demo && (
                          <motion.a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-muted hover:text-gold transition-colors"
                            aria-label={t("viewDemo")}
                            whileHover={{ scale: 1.2 }}
                          >
                            <ExternalLink size={16} />
                          </motion.a>
                        )}
                      </div>
                    )}
                  </div>

                  <span className="font-mono text-[10px] text-gold/60 uppercase tracking-widest mb-2">
                    {`// ${project.category}`}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-gold transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed flex-1 mb-5">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[10px] px-2 py-0.5 text-muted"
                        style={{
                          border: "1px solid rgba(255,195,0,0.15)",
                          background: "rgba(255,195,0,0.03)",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </HudFrame>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
