"use client"
import { ScrollReveal } from "./scroll-reveal"
import { useLanguage } from "@/components/language-context"

export function ValueProposition() {
  const { t } = useLanguage()

  const items = [
    t("value.i1"), t("value.i2"), t("value.i3"), t("value.i4"), t("value.i5"),
  ]

  return (
    <section className="bg-navy-primary px-6 py-24 md:py-32">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <span className="mb-4 inline-block font-sans text-xs font-[600] uppercase tracking-[0.3em] text-gold">
            {t("value.tag")}
          </span>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <h2 className="mb-14 font-sans text-[clamp(1.8rem,3.5vw,3rem)] font-[200] leading-[1.15] text-kc-white md:mb-16">
            {t("value.title")}
          </h2>
        </ScrollReveal>
        <div className="flex flex-col">
          {items.map((item, i) => (
            <ScrollReveal key={i} delay={200 + i * 80}>
              <div className="flex items-start gap-6 border-t border-gold/20 py-7 md:py-8">
                <span className="shrink-0 font-sans text-2xl font-[200] text-gold md:text-3xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-sans text-base font-[300] leading-relaxed text-kc-white/80 md:text-lg">
                  {item}
                </p>
              </div>
            </ScrollReveal>
          ))}
          <div className="border-t border-gold/20" />
        </div>
      </div>
    </section>
  )
}
