"use client"
import { useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"
import { useLanguage } from "@/components/language-context"

export function Hero() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const children = el.querySelectorAll("[data-animate]")
    children.forEach((child, i) => {
      const htmlEl = child as HTMLElement
      htmlEl.style.opacity = "0"
      htmlEl.style.transform = "translateY(24px)"
      htmlEl.style.transition = `opacity 0.8s ease ${i * 0.2}s, transform 0.8s ease ${i * 0.2}s`
      requestAnimationFrame(() => {
        setTimeout(() => {
          htmlEl.style.opacity = "1"
          htmlEl.style.transform = "translateY(0)"
        }, 100)
      })
    })
  }, [])

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="grain-overlay relative flex min-h-screen flex-col items-center justify-center pt-40 pb-16 md:pt-32 md:pb-32 overflow-hidden bg-navy-deep px-6"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -right-40 top-1/4 h-[600px] w-px rotate-[25deg] bg-gold/[0.06]" />
        <div className="absolute -left-20 bottom-1/3 h-[400px] w-px rotate-[-15deg] bg-gold/[0.04]" />
        <div className="absolute right-1/4 top-20 h-px w-[300px] rotate-[25deg] bg-gold/[0.05]" />
      </div>

      <div className="relative z-10 flex max-w-[1200px] flex-col items-center text-center">
        <div data-animate className="mb-16 md:mb-20">
          <img
            src="/logo-hero.svg"
            alt="Kohan & Campos Real Estate"
            className="mx-auto h-auto w-[clamp(220px,75vw,380px)] md:w-[clamp(280px,50vw,580px)]"
          />
        </div>

        <div data-animate className="mb-8 md:mb-14">
          <p className="max-w-xl font-sans text-[clamp(1.6rem,4.5vw,2.8rem)] font-[300] leading-[1.2] text-kc-white">
            {t("hero.line1")}
            <br />
            {t("hero.line2")}{" "}
            <span className="font-[400] text-gold">{t("hero.highlight")}</span>
          </p>
          <p className="mt-4 max-w-lg font-sans text-[clamp(0.9rem,2vw,1.1rem)] font-[300] leading-[1.6] text-kc-white/65">
            {t("hero.subtitle")}
          </p>
        </div>

        <div data-animate className="mt-12 md:mt-0 flex w-full max-w-xs flex-col items-center justify-center gap-4 sm:max-w-none sm:flex-row sm:justify-center sm:gap-6">
          <a
            href="#contacto"
            className="inline-flex w-full items-center justify-center bg-gold px-8 py-4 font-sans text-[11px] font-[700] uppercase tracking-[0.18em] text-navy-deep shadow-lg shadow-gold/10 transition-all hover:bg-gold-light hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
          >
            {t("hero.cta1")}
          </a>
          <a
            href="#proceso"
            className="inline-flex w-full items-center justify-center border border-kc-white/20 bg-kc-white/5 backdrop-blur-sm px-8 py-4 font-sans text-[11px] font-[600] uppercase tracking-[0.18em] text-kc-white/90 transition-all hover:border-gold/50 hover:text-gold sm:w-auto"
          >
            {t("hero.cta2")}
          </a>
        </div>
      </div>

      <div data-animate className="absolute bottom-10 z-10 flex flex-col items-center gap-2">
        <span className="font-sans text-[10px] font-[600] uppercase tracking-[0.3em] text-gold/60">
          {t("hero.scroll")}
        </span>
        <ChevronDown size={18} className="animate-bounce text-gold/60" />
      </div>
    </section>
  )
}
