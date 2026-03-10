"use client"
import { TrendingUp, Users, DollarSign, MapPin, BarChart3 } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"
import { useLanguage } from "@/components/language-context"

export function WhyParaguay() {
  const { t } = useLanguage()

  const reasons = [
    { icon: TrendingUp, text: t("why.r1") },
    { icon: Users, text: t("why.r2") },
    { icon: DollarSign, text: t("why.r3") },
    { icon: MapPin, text: t("why.r4") },
    { icon: BarChart3, text: t("why.r5") },
  ]

  return (
    <section className="relative bg-navy-primary px-6 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.03]">
        <svg viewBox="0 0 800 400" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
          <circle cx="400" cy="200" r="180" fill="none" stroke="#C9B99A" strokeWidth="0.5" />
          <circle cx="400" cy="200" r="130" fill="none" stroke="#C9B99A" strokeWidth="0.3" />
          <line x1="100" y1="200" x2="700" y2="200" stroke="#C9B99A" strokeWidth="0.3" />
          <line x1="400" y1="20" x2="400" y2="380" stroke="#C9B99A" strokeWidth="0.3" />
        </svg>
      </div>
      <div className="relative z-10 mx-auto max-w-[1200px]">
        <ScrollReveal>
          <span className="mb-4 inline-block font-sans text-xs font-[600] uppercase tracking-[0.3em] text-gold">
            {t("why.tag")}
          </span>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <h2 className="mb-3 font-sans text-[clamp(1.8rem,3.5vw,3rem)] font-[200] leading-[1.15] text-kc-white">
            {t("why.title")}
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={150}>
          <p className="mb-14 font-sans text-base font-[300] text-kc-white/60 md:mb-16 md:text-lg">
            {t("why.subtitle")}
          </p>
        </ScrollReveal>
        <div className="flex flex-col gap-6 md:gap-8">
          {reasons.map((reason, i) => (
            <ScrollReveal key={i} delay={200 + i * 80}>
              <div className="flex items-center gap-5 md:gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-gold/20">
                  <reason.icon size={18} strokeWidth={1.5} className="text-gold" />
                </div>
                <p className="font-sans text-base font-[300] text-kc-white/80 md:text-lg">
                  {reason.text}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <ScrollReveal delay={700}>
          <div className="mt-16 border-l-2 border-gold/40 pl-6 md:mt-20 md:pl-8">
            <p className="max-w-lg font-sans text-xl font-[300] italic leading-relaxed text-gold md:text-2xl">
              {t("why.quote")}
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
