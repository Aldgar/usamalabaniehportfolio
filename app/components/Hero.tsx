"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import Particles from "./Particles";
import { openEmailModal } from "@/lib/email-modal";
import { SOCIAL } from "@/lib/site-links";
import { useTranslations } from "next-intl";

function useTypingEffect(text: string, speed = 40, delay = 1800) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;
    let i = 0;

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        if (i < text.length) {
          i++;
          setDisplayed(text.slice(0, i));
        } else if (intervalId) {
          clearInterval(intervalId);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, delay]);

  return displayed;
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function Hero() {
  const t = useTranslations("hero");
  const typedText = useTypingEffect(t("typed"), 26, 2000);

  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center overflow-hidden scanlines pt-[calc(6rem+env(safe-area-inset-top,0px))] pb-10 max-lg:justify-start lg:justify-center lg:pt-20 lg:pb-0"
    >
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, #111827 0%, #0a0e1a 70%)",
        }}
      />
      <div className="absolute inset-0 grid-bg" />
      <Particles />

      {/* Gold accent lines */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #ffc300, transparent)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,195,0,0.3), transparent)",
        }}
      />

      <motion.div
        className="relative z-10 w-full max-w-6xl mx-auto px-6"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <div className="flex w-full flex-col-reverse items-center gap-10 max-lg:gap-8 lg:flex-row lg:items-center lg:gap-12 xl:gap-16 lg:justify-between">
          {/* Copy + actions — DOM first: left column on lg; mobile stack uses reverse so photo stays on top */}
          <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col items-center text-center lg:max-w-[min(100%,42rem)] lg:items-start lg:text-left">
            {/* System badge */}
            <motion.div
              variants={item}
              className="flex items-center justify-center lg:justify-start gap-2 mb-8 w-full"
            >
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 border font-mono text-xs tracking-widest uppercase text-gold"
                style={{
                  borderColor: "rgba(255,195,0,0.3)",
                  background: "rgba(255,195,0,0.05)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full bg-gold"
                  style={{ animation: "blink 1.5s ease-in-out infinite" }}
                />
                {t("systemOnline")}
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              variants={item}
              className="text-5xl md:text-6xl xl:text-7xl font-bold mb-6 leading-tight text-foreground"
            >
              <span className="font-mono text-gold/50 text-base md:text-lg block mb-3 tracking-widest">
                {t("identity")}
              </span>
              {t("greeting")}{" "}
              <span className="text-gold">Usama Labanieh</span>
            </motion.h1>

            {/* Typed tagline + profile */}
            <motion.div
              variants={item}
              className="w-full max-w-2xl lg:max-w-none mb-8 space-y-5"
            >
              <p className="text-sm md:text-base text-muted leading-relaxed font-mono text-left lg:text-left">
                <span className="text-gold/60">&gt; </span>
                {typedText}
                <span
                  className="text-gold"
                  style={{ animation: "blink 0.8s ease-in-out infinite" }}
                >
                  _
                </span>
              </p>
              <p className="text-sm md:text-base text-muted/90 leading-relaxed text-left px-1">
                {t("bio")}
              </p>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              variants={item}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12 w-full"
            >
              <motion.a
                href="#projects"
                className="px-8 py-3 bg-gold font-semibold font-mono text-sm uppercase tracking-wider"
                style={{
                  color: "#0a0e1a",
                  boxShadow: "0 0 20px rgba(255, 195, 0, 0.3)",
                }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 30px rgba(255, 195, 0, 0.5)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                {t("viewProjects")}
              </motion.a>
              <motion.a
                href="#contact"
                className="px-8 py-3 border text-gold font-mono text-sm uppercase tracking-wider transition-colors duration-300 hover:bg-gold/10"
                style={{ borderColor: "rgba(255,195,0,0.3)" }}
                whileHover={{
                  scale: 1.03,
                  borderColor: "rgba(255,195,0,0.6)",
                }}
                whileTap={{ scale: 0.97 }}
              >
                {t("transmitMessage")}
              </motion.a>
            </motion.div>

            {/* Social links */}
            <motion.div
              className="flex gap-4 justify-center lg:justify-start"
              variants={item}
            >
              {[
                { icon: Github, href: SOCIAL.github, label: "GitHub" },
                {
                  icon: Linkedin,
                  href: SOCIAL.linkedin,
                  label: "LinkedIn",
                },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 border text-muted hover:text-gold transition-colors duration-300"
                  style={{ borderColor: "rgba(255,195,0,0.15)" }}
                  aria-label={label}
                  whileHover={{
                    scale: 1.15,
                    borderColor: "rgba(255,195,0,0.5)",
                    boxShadow: "0 0 15px rgba(255, 195, 0, 0.15)",
                  }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
              <motion.button
                type="button"
                className="p-3 border text-muted hover:text-gold transition-colors duration-300 cursor-pointer"
                style={{ borderColor: "rgba(255,195,0,0.15)" }}
                aria-label={t("emailAria")}
                onClick={() => {
                  openEmailModal();
                  document.getElementById("contact")?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }}
                whileHover={{
                  scale: 1.15,
                  borderColor: "rgba(255,195,0,0.5)",
                  boxShadow: "0 0 15px rgba(255, 195, 0, 0.15)",
                }}
                whileTap={{ scale: 0.9 }}
              >
                <Mail size={18} />
              </motion.button>
            </motion.div>
          </div>

          {/* Portrait — right column on lg; extra top offset on small screens so it clears the fixed nav */}
          <motion.div
            variants={item}
            className="relative shrink-0 max-lg:mt-2 lg:mt-0 lg:pl-2"
          >
            <div
              className="absolute -inset-1 rounded-full opacity-60 blur-xl"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(255,195,0,0.25), transparent 70%)",
              }}
              aria-hidden
            />
            <div
              className="relative rounded-full p-[3px]"
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,195,0,0.55), rgba(255,195,0,0.12) 45%, rgba(255,195,0,0.35))",
                boxShadow:
                  "0 0 0 1px rgba(255,195,0,0.15), 0 12px 40px rgba(0,0,0,0.45)",
              }}
            >
              <div className="rounded-full overflow-hidden bg-[#0a0e1a]">
                <Image
                  src="/body_background2_square.png"
                  alt={t("portraitAlt")}
                  width={320}
                  height={320}
                  priority
                  sizes="(max-width: 1024px) 224px, 288px"
                  className="h-52 w-52 object-cover object-top sm:h-56 sm:w-56 lg:h-64 lg:w-64 xl:h-72 xl:w-72"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.a
        href="#experience"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold/30 hover:text-gold/60 transition-colors"
        aria-label={t("scrollDown")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { delay: 3, duration: 0.5 },
          y: { delay: 3, duration: 1.5, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <ArrowDown size={24} />
      </motion.a>
    </section>
  );
}
