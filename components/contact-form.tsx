"use client"

import { useState, type FormEvent } from "react"
import { ScrollReveal } from "./scroll-reveal"
import { Check } from "lucide-react"
import { useLanguage } from "@/components/language-context"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog"

export function ContactForm() {
  const { t } = useLanguage()

  const countries = [
    { value: "Argentina", label: t("contact.country_arg") },
    { value: "Brasil", label: t("contact.country_bra") },
    { value: "Paraguay", label: t("contact.country_pry") },
    { value: "Otro", label: t("contact.country_other") },
  ]

  const budgets = [
    { value: "USD 30k - 50k", label: t("contact.budget_30_50") },
    { value: "USD 50k - 100k", label: t("contact.budget_50_100") },
    { value: "USD 100k+", label: t("contact.budget_100plus") },
    { value: "Prefiero no indicar", label: t("contact.budget_na") },
  ]

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [country, setCountry] = useState("")
  const [budget, setBudget] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus("loading")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          country: country || "No indicado",
          budget: budget || "No indicado",
          message: message || "Sin mensaje",
        }),
      })

      if (!res.ok) throw new Error("Request failed")

      setStatus("success")
      setShowSuccessDialog(true)
      setName("")
      setEmail("")
      setCountry("")
      setBudget("")
      setMessage("")
    } catch {
      setStatus("error")
    }
  }

  const inputBase =
    "w-full border-0 border-b border-gold/30 bg-transparent px-0 py-3 font-sans text-base font-[300] text-kc-white placeholder:text-kc-white/30 focus:border-gold focus:outline-none focus:ring-0 transition-colors"

  const labelClass =
    "mb-1 block font-sans text-[10px] font-[600] uppercase tracking-[0.25em] text-gold/60"

  const selectStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23C9B99A' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat" as const,
    backgroundPosition: "right 0 center",
  }

  return (
    <section id="contacto" className="bg-navy-deep px-6 py-24 md:py-32">
      <div className="mx-auto max-w-[600px]">
        <ScrollReveal>
          <span className="mb-4 inline-block font-sans text-xs font-[600] uppercase tracking-[0.3em] text-gold">
            {t("contact.tag")}
          </span>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h2 className="mb-3 font-sans text-[clamp(1.8rem,3.5vw,3rem)] font-[200] leading-[1.15] text-kc-white">
            {t("contact.title")}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <p className="mb-12 font-sans text-base font-[300] text-kc-white/60 md:mb-14">
            {t("contact.subtitle")}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Nombre */}
            <div>
              <label htmlFor="name" className={labelClass}>
                {t("contact.name_label")}
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("contact.name_placeholder")}
                className={inputBase}
                disabled={status === "loading"}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={labelClass}>
                {t("contact.email_label")}
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("contact.email_placeholder")}
                className={inputBase}
                disabled={status === "loading"}
              />
            </div>

            {/* País */}
            <div>
              <label htmlFor="country" className={labelClass}>
                {t("contact.country_label")}
              </label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={`${inputBase} cursor-pointer appearance-none`}
                disabled={status === "loading"}
                style={selectStyle}
              >
                <option value="" className="bg-navy-deep text-kc-white/50">
                  {t("contact.country_select")}
                </option>
                {countries.map((c) => (
                  <option key={c.value} value={c.value} className="bg-navy-deep text-kc-white">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Capital */}
            <div>
              <label htmlFor="budget" className={labelClass}>
                {t("contact.budget_label")}
              </label>
              <select
                id="budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className={`${inputBase} cursor-pointer appearance-none`}
                disabled={status === "loading"}
                style={selectStyle}
              >
                <option value="" className="bg-navy-deep text-kc-white/50">
                  {t("contact.budget_select")}
                </option>
                {budgets.map((b) => (
                  <option key={b.value} value={b.value} className="bg-navy-deep text-kc-white">
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mensaje */}
            <div>
              <label htmlFor="message" className={labelClass}>
                {t("contact.message_label")}
              </label>
              <textarea
                id="message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("contact.message_placeholder")}
                className={`${inputBase} resize-none`}
                disabled={status === "loading"}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-gold px-8 py-4 font-sans text-xs font-[600] uppercase tracking-[0.15em] text-navy-deep transition-all hover:bg-gold-light disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "loading" ? t("contact.sending") : t("contact.submit")}
            </button>

            {status === "error" && (
              <p className="text-center font-sans text-sm font-[400] text-red-400">
                {t("contact.error")}
              </p>
            )}

            <p className="text-center font-sans text-[11px] font-[300] text-kc-white/40">
              {t("contact.privacy")}
            </p>
          </form>
        </ScrollReveal>
      </div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="border-gold/20 bg-navy-deep p-10 text-center sm:max-w-[450px]">
          <DialogHeader className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
              <Check className="h-8 w-8 text-gold" />
            </div>
            <DialogTitle className="font-sans text-2xl font-[200] tracking-tight text-kc-white">
              {t("contact.popup_title")}
            </DialogTitle>
            <DialogDescription className="font-sans text-base font-[300] leading-relaxed text-kc-white/60">
              {t("contact.popup_subtitle")}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-8">
            <button
              onClick={() => setShowSuccessDialog(false)}
              className="w-full bg-gold px-8 py-3 font-sans text-[10px] font-[600] uppercase tracking-[0.2em] text-navy-deep transition-all hover:bg-gold-light"
            >
              {t("contact.popup_close")}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}