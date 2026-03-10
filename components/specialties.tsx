"use client"
import { Check } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"
import { useLanguage } from "@/components/language-context"

export function Specialties() {
  const { t } = useLanguage()

  const cards = [
    {
      label: t("specialties.c1_label"),
      description: t("specialties.c1_desc"),
      points: [t("specialties.c1_p1"), t("specialties.c1_p2"), t("specialties.c1_p3")],
    },
    {
      label: t("specialties.c2_label"),
      description: t("specialties.c2_desc"),
      points: [t("specialties.c2_p1"), t("specialties.c2_p2"), t("specialties.c2_p3")],
    },
  ]

  return (
    <section id="especialidades" className="bg-navy-deep px-6 py-24 md:py-32">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <span className="mb-4 inline-block font-sans text-xs font-[600] uppercase tracking-[0.3em] text-gold">
            {t("specialties.tag")}
          </span>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <h2 className="mb-14 font-sans text-[clamp(1.8rem,3.5vw,3rem)] font-[200] leading-[1.15] text-kc-white md:mb-16">
            {t("specialties.title")}
          </h2>
        </ScrollReveal>
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {cards.map((card, i) => (
            <ScrollReveal key={card.label} delay={200 + i * 150}>
              <div className="group flex h-full flex-col border border-gold/20 bg-navy-light/50 p-8 transition-all hover:border-gold/40 hover:shadow-[0_0_30px_rgba(201,185,154,0.08)] md:p-10">
                <span className="mb-6 font-sans text-xs font-[600] uppercase tracking-[0.2em] text-gold">
                  {card.label}
                </span>
                <p className="mb-8 font-sans text-base font-[300] leading-relaxed text-kc-white/70">
                  {card.description}
                </p>
                <div className="mt-auto flex flex-col gap-3">
                  {card.points.map((point) => (
                    <div key={point} className="flex items-center gap-3">
                      <Check size={16} strokeWidth={2} className="shrink-0 text-gold" />
                      <span className="font-sans text-sm font-[400] text-kc-white/80">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={500}>
          <div className="mt-16 flex justify-center">
            <a
              href="#contacto"
              className="inline-flex items-center justify-center bg-gold px-10 py-4 font-sans text-[11px] font-[700] uppercase tracking-[0.2em] text-navy-deep transition-all hover:bg-gold-light hover:scale-[1.02] active:scale-[0.98]"
            >
              {t("specialties.cta")}
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
