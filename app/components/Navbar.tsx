"use client";

import { useState, useEffect, useCallback } from "react";
import { Menu, X } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";
import BrandLogo from "./BrandLogo";

const navIds = ["home", "experience", "education", "skills", "projects", "contact"] as const;

export default function Navbar() {
  const t = useTranslations("nav");
  const navLinks = navIds.map((id) => ({ id, label: t(id) }));

  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 50);
    if (latest > prev && latest > 200 && !mobileOpen) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const updateActiveSection = useCallback(() => {
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    const ids = navLinks.map((l) => l.id);
    for (let i = ids.length - 1; i >= 0; i--) {
      const el = document.getElementById(ids[i]);
      if (el && el.offsetTop <= scrollPos) {
        setActiveSection(ids[i]);
        return;
      }
    }
    setActiveSection("home");
  }, [navLinks]);

  useEffect(() => {
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    const frameId = requestAnimationFrame(() => updateActiveSection());
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, [updateActiveSection]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -80 }}
      animate={{ y: hidden ? -80 : 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div
        className={`absolute inset-0 transition-all duration-300 ${
          scrolled ? "bg-background/90 backdrop-blur-xl" : "bg-transparent"
        }`}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: scrolled
            ? "linear-gradient(90deg, transparent, #ffc300, transparent)"
            : "linear-gradient(90deg, transparent, rgba(255,195,0,0.15), transparent)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-3">
        <motion.a
          href="#home"
          className="shrink-0 flex items-center"
          aria-label={t("brandLinkAria")}
          whileHover={{ scale: 1.05 }}
        >
          <BrandLogo size={40} className="h-9 w-9 md:h-10 md:w-10" />
        </motion.a>

        <div className="hidden md:flex flex-1 items-center justify-center gap-1 min-w-0">
          {navLinks.map((link, idx) => {
            const isActive = activeSection === link.id;
            return (
              <motion.a
                key={link.id}
                href={`#${link.id}`}
                className={`relative px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors duration-200 ${
                  isActive
                    ? "text-gold"
                    : "text-muted hover:text-foreground"
                }`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.07, duration: 0.4 }}
              >
                {link.label}
                {isActive && (
                  <motion.div
                    className="absolute left-1 right-1 bottom-0 h-px bg-gold"
                    layoutId="navIndicator"
                    style={{
                      boxShadow: "0 0 8px rgba(255, 195, 0, 0.5)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
              </motion.a>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <LanguageSwitcher />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={t("toggleMenu")}
            className="md:hidden text-gold cursor-pointer p-1"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden bg-background/95 backdrop-blur-xl overflow-hidden"
            style={{ borderBottom: "1px solid rgba(255,195,0,0.1)" }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link, idx) => {
                const isActive = activeSection === link.id;
                return (
                  <motion.a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={() => setMobileOpen(false)}
                    className={`font-mono text-xs uppercase tracking-wider py-2 px-3 transition-colors ${
                      isActive
                        ? "text-gold bg-gold/10"
                        : "text-muted hover:text-gold"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06, duration: 0.3 }}
                  >
                    {isActive && "▸ "}
                    {link.label}
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
