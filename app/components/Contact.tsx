"use client";

import { useState, useEffect, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { Send, Mail, MapPin, Phone, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { MotionDiv } from "./MotionWrapper";
import HudFrame from "./HudFrame";
import { PORTFOLIO_EMAIL_DISPLAY } from "@/lib/contact-constants";
import { subscribeEmailModalOpen } from "@/lib/email-modal";

type FormFields = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const emptyForm = (): FormFields => ({
  name: "",
  email: "",
  subject: "",
  message: "",
});

export default function Contact() {
  const t = useTranslations("contact");
  const tErr = useTranslations("contact.errors");

  const [formData, setFormData] = useState<FormFields>(emptyForm());
  const [modalForm, setModalForm] = useState<FormFields>(emptyForm());
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [mainStatus, setMainStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [mainErrorDetail, setMainErrorDetail] = useState<string | null>(null);
  const [modalStatus, setModalStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [modalErrorDetail, setModalErrorDetail] = useState<string | null>(
    null
  );
  const [mainSuccessNote, setMainSuccessNote] = useState<string | null>(null);
  const [modalSuccessNote, setModalSuccessNote] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    return subscribeEmailModalOpen(() => setEmailModalOpen(true));
  }, []);

  useEffect(() => {
    if (!emailModalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [emailModalOpen]);

  useEffect(() => {
    if (!emailModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEmailModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [emailModalOpen]);

  const inputClass =
    "w-full px-4 py-3 bg-transparent border-b-2 text-foreground font-mono text-sm placeholder:text-muted/50 focus:outline-none transition-colors duration-300";

  async function postContactMessage(body: FormFields): Promise<{
    confirmationSent: boolean;
    confirmationError?: string;
  }> {
    let res: Response;
    try {
      res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch {
      throw new Error(tErr("network"));
    }

    const data = (await res.json().catch(() => ({}))) as {
      error?: string;
      confirmationSent?: boolean;
      confirmationError?: string;
    };
    if (!res.ok) {
      throw new Error(
        data.error ||
          (res.status === 503
            ? tErr("notConfigured")
            : tErr("requestFailed", { status: res.status }))
      );
    }
    return {
      confirmationSent: data.confirmationSent !== false,
      confirmationError: data.confirmationError,
    };
  }

  const handleMainSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMainErrorDetail(null);
    setMainSuccessNote(null);
    setMainStatus("sending");
    try {
      const { confirmationSent, confirmationError } =
        await postContactMessage(formData);
      setMainStatus("sent");
      setMainSuccessNote(
        confirmationSent
          ? t("successConfirmationNote")
          : `${t("successDelivered")}${
              confirmationError
                ? t("successCopyFailed", { error: confirmationError })
                : t("successNoCopy")
            }`
      );
      setFormData(emptyForm());
      setTimeout(() => {
        setMainStatus("idle");
        setMainSuccessNote(null);
      }, 12000);
    } catch (err) {
      setMainStatus("error");
      setMainErrorDetail(
        err instanceof Error ? err.message : tErr("generic")
      );
      setTimeout(() => {
        setMainStatus("idle");
        setMainErrorDetail(null);
      }, 20000);
    }
  };

  const handleModalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setModalErrorDetail(null);
    setModalSuccessNote(null);
    setModalStatus("sending");
    try {
      const { confirmationSent, confirmationError } =
        await postContactMessage(modalForm);
      setModalStatus("sent");
      setModalSuccessNote(
        confirmationSent
          ? t("modalSuccessConfirm")
          : `${t("modalDelivered")}${
              confirmationError
                ? t("modalConfirmFail", { error: confirmationError })
                : t("modalNoConfirm")
            }`
      );
      setModalForm(emptyForm());
      setTimeout(() => {
        setModalStatus("idle");
        setModalSuccessNote(null);
        setEmailModalOpen(false);
      }, 4500);
    } catch (err) {
      setModalStatus("error");
      setModalErrorDetail(
        err instanceof Error ? err.message : tErr("generic")
      );
    }
  };

  const contactItems = [
    {
      icon: Mail,
      label: t("labelEmail"),
      value: PORTFOLIO_EMAIL_DISPLAY,
      action: "modal" as const,
    },
    {
      icon: Phone,
      label: t("labelComms"),
      value: "+31 6 8534 2648",
    },
    {
      icon: MapPin,
      label: t("labelLocation"),
      value: t("locationValue"),
    },
  ];

  const modalOverlay = (
    <AnimatePresence>
      {emailModalOpen && (
        <motion.div
          className="fixed inset-0 z-200 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="email-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-background/80 backdrop-blur-sm cursor-default"
            aria-label={t("closeDialog")}
            onClick={() => setEmailModalOpen(false)}
          />
          <motion.div
            className="relative w-full max-w-md z-10"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <HudFrame>
              <div
                className="p-6 bg-card-bg border border-card-border backdrop-blur-md relative"
                style={{
                  boxShadow:
                    "0 0 0 1px rgba(255,195,0,0.12), 0 25px 50px rgba(0,0,0,0.35)",
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, #ffc300, transparent)",
                  }}
                />
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div>
                    <span className="font-mono text-[10px] text-gold/70 uppercase tracking-[0.25em] block mb-1">
                      {t("secureRelay")}
                    </span>
                    <h3
                      id="email-modal-title"
                      className="text-lg font-semibold text-foreground"
                    >
                      {t("modalTitle")}{" "}
                      <span className="text-gold">Usama Labanieh</span>
                    </h3>
                    <p className="text-xs text-muted mt-1 font-mono leading-relaxed">
                      {t("modalSubtitle", { email: PORTFOLIO_EMAIL_DISPLAY })}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailModalOpen(false)}
                    className="p-2 text-muted hover:text-gold border transition-colors shrink-0 cursor-pointer"
                    style={{ borderColor: "rgba(255,195,0,0.2)" }}
                    aria-label={t("close")}
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleModalSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder={t("placeholderName")}
                    required
                    value={modalForm.name}
                    onChange={(e) =>
                      setModalForm({ ...modalForm, name: e.target.value })
                    }
                    className={inputClass}
                    style={{ borderColor: "rgba(255,195,0,0.15)" }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(255,195,0,0.6)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "rgba(255,195,0,0.15)")
                    }
                  />
                  <input
                    type="email"
                    placeholder={t("placeholderYourEmail")}
                    required
                    value={modalForm.email}
                    onChange={(e) =>
                      setModalForm({ ...modalForm, email: e.target.value })
                    }
                    className={inputClass}
                    style={{ borderColor: "rgba(255,195,0,0.15)" }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(255,195,0,0.6)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "rgba(255,195,0,0.15)")
                    }
                  />
                  <input
                    type="text"
                    placeholder={t("placeholderSubject")}
                    required
                    value={modalForm.subject}
                    onChange={(e) =>
                      setModalForm({ ...modalForm, subject: e.target.value })
                    }
                    className={inputClass}
                    style={{ borderColor: "rgba(255,195,0,0.15)" }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(255,195,0,0.6)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "rgba(255,195,0,0.15)")
                    }
                  />
                  <textarea
                    placeholder={t("placeholderMessage")}
                    required
                    rows={4}
                    value={modalForm.message}
                    onChange={(e) =>
                      setModalForm({ ...modalForm, message: e.target.value })
                    }
                    className={`${inputClass} resize-none border-b-2`}
                    style={{ borderColor: "rgba(255,195,0,0.15)" }}
                    onFocus={(e) =>
                      ((e.target as HTMLTextAreaElement).style.borderColor =
                        "rgba(255,195,0,0.6)")
                    }
                    onBlur={(e) =>
                      ((e.target as HTMLTextAreaElement).style.borderColor =
                        "rgba(255,195,0,0.15)")
                    }
                  />

                  {modalStatus === "error" && modalErrorDetail && (
                    <p className="text-xs text-red-400 font-mono leading-relaxed break-words border border-red-500/25 bg-red-500/5 p-2 rounded-sm">
                      {modalErrorDetail}
                    </p>
                  )}
                  {modalStatus === "sent" && modalSuccessNote && (
                    <div
                      className="flex gap-2 p-3 border rounded-sm text-left"
                      style={{
                        borderColor: "rgba(255,195,0,0.35)",
                        background: "rgba(255,195,0,0.08)",
                      }}
                    >
                      <CheckCircle2
                        className="shrink-0 text-gold"
                        size={18}
                        aria-hidden
                      />
                      <div>
                        <p className="font-mono text-[10px] text-gold uppercase tracking-widest mb-1">
                          {t("complete")}
                        </p>
                        <p className="text-xs text-foreground leading-relaxed">
                          {modalSuccessNote}
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={modalStatus === "sending" || modalStatus === "sent"}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold font-mono text-sm font-semibold uppercase tracking-wider disabled:opacity-60 cursor-pointer"
                    style={{
                      color: "#0a0e1a",
                      boxShadow: "0 0 15px rgba(255, 195, 0, 0.2)",
                    }}
                  >
                    {modalStatus === "sending"
                      ? t("transmitting")
                      : modalStatus === "sent"
                        ? t("sent")
                        : t("transmit")}
                    <Send size={14} />
                  </button>
                </form>
              </div>
            </HudFrame>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <section id="contact" className="relative py-24 bg-background">
      {mounted ? createPortal(modalOverlay, document.body) : null}

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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <MotionDiv
            variant="slideLeft"
            delay={0.1}
            className="lg:col-span-2"
          >
            <div className="space-y-6">
              {contactItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.2 + idx * 0.15,
                      duration: 0.5,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  >
                    <motion.div
                      className="p-3 text-gold shrink-0"
                      style={{
                        border: "1px solid rgba(255,195,0,0.2)",
                        background: "rgba(255,195,0,0.05)",
                      }}
                      whileHover={{
                        boxShadow: "0 0 15px rgba(255,195,0,0.2)",
                        borderColor: "rgba(255,195,0,0.5)",
                      }}
                    >
                      <Icon size={18} />
                    </motion.div>
                    <div>
                      <span className="font-mono text-[10px] text-gold/60 tracking-widest block mb-1">
                        {`// ${item.label}`}
                      </span>
                      {"action" in item && item.action === "modal" ? (
                        <button
                          type="button"
                          onClick={() => setEmailModalOpen(true)}
                          className="text-left text-muted hover:text-gold transition-colors text-sm font-mono underline decoration-gold/20 underline-offset-4 hover:decoration-gold/50"
                        >
                          {item.value}
                        </button>
                      ) : (
                        <span className="text-muted text-sm font-mono">
                          {item.value}
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </MotionDiv>

          <MotionDiv
            variant="slideRight"
            delay={0.2}
            className="lg:col-span-3"
          >
            <HudFrame>
              <motion.form
                onSubmit={handleMainSubmit}
                className="p-6 bg-card-bg border border-card-border backdrop-blur-sm space-y-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.08,
                      delayChildren: 0.3,
                    },
                  },
                }}
              >
                <AnimatePresence>
                  {mainStatus === "sent" && mainSuccessNote && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-3 p-4 border rounded-sm"
                      style={{
                        borderColor: "rgba(255,195,0,0.35)",
                        background: "rgba(255,195,0,0.08)",
                        boxShadow: "0 0 24px rgba(255, 195, 0, 0.08)",
                      }}
                    >
                      <CheckCircle2
                        className="shrink-0 text-gold mt-0.5"
                        size={22}
                        strokeWidth={2}
                        aria-hidden
                      />
                      <div>
                        <p className="font-mono text-xs text-gold uppercase tracking-widest mb-1">
                          {t("transmissionComplete")}
                        </p>
                        <p className="text-sm text-foreground leading-relaxed">
                          {t("messageReceived")}
                        </p>
                        <p className="text-xs text-muted mt-2 leading-relaxed">
                          {mainSuccessNote}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5 },
                    },
                  }}
                >
                  <input
                    type="text"
                    placeholder={t("placeholderName")}
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={inputClass}
                    style={{
                      borderColor: "rgba(255,195,0,0.15)",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(255,195,0,0.6)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "rgba(255,195,0,0.15)")
                    }
                  />
                  <input
                    type="email"
                    placeholder={t("placeholderEmail")}
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={inputClass}
                    style={{
                      borderColor: "rgba(255,195,0,0.15)",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "rgba(255,195,0,0.6)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "rgba(255,195,0,0.15)")
                    }
                  />
                </motion.div>
                <motion.input
                  type="text"
                  placeholder={t("placeholderSubject")}
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className={inputClass}
                  style={{
                    borderColor: "rgba(255,195,0,0.15)",
                  }}
                  onFocus={(e) =>
                    ((e.target as HTMLInputElement).style.borderColor =
                      "rgba(255,195,0,0.6)")
                  }
                  onBlur={(e) =>
                    ((e.target as HTMLInputElement).style.borderColor =
                      "rgba(255,195,0,0.15)")
                  }
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5 },
                    },
                  }}
                />
                <motion.textarea
                  placeholder={t("placeholderMessage")}
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className={`${inputClass} resize-none border-b-2`}
                  style={{
                    borderColor: "rgba(255,195,0,0.15)",
                  }}
                  onFocus={(e) =>
                    ((e.target as HTMLTextAreaElement).style.borderColor =
                      "rgba(255,195,0,0.6)")
                  }
                  onBlur={(e) =>
                    ((e.target as HTMLTextAreaElement).style.borderColor =
                      "rgba(255,195,0,0.15)")
                  }
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5 },
                    },
                  }}
                />
                {mainStatus === "error" && mainErrorDetail && (
                  <p className="text-xs sm:text-sm text-red-400 font-mono leading-relaxed break-words border border-red-500/25 bg-red-500/5 p-3 rounded-sm">
                    {mainErrorDetail}
                  </p>
                )}
                <motion.button
                  type="submit"
                  disabled={mainStatus === "sending"}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gold font-mono text-sm font-semibold uppercase tracking-wider disabled:opacity-60 cursor-pointer transition-colors duration-300"
                  style={{
                    color: "#0a0e1a",
                    boxShadow: "0 0 15px rgba(255, 195, 0, 0.2)",
                  }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5 },
                    },
                  }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 0 25px rgba(255, 195, 0, 0.4)",
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  {mainStatus === "sending"
                    ? t("transmitting")
                    : mainStatus === "sent"
                      ? t("transmitted")
                      : t("transmit")}
                  <Send size={14} />
                </motion.button>
              </motion.form>
            </HudFrame>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}
