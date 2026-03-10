"use client"
import { Crosshair, BarChart3, Globe, Lock } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"
import { useLanguage } from "@/components/language-context"

export function About() {
  const { t } = useLanguage()

  const features = [
    {
      icon: Crosshair,
      title: t("about.f1_title"),
      description: [t("about.f1_l1"), t("about.f1_l2"), t("about.f1_l3")],
    },
    {
      icon: BarChart3,
      title: t("about.f2_title"),
      description: [t("about.f2_l1"), t("about.f2_l2"), t("about.f2_l3")],
    },
    {
      icon: Globe,
      title: t("about.f3_title"),
      description: [t("about.f3_l1"), t("about.f3_l2"), t("about.f3_l3")],
    },
    {
      icon: Lock,
      title: t("about.f4_title"),
      description: [t("about.f4_l1"), t("about.f4_l2"), t("about.f4_l3")],
    },
  ]

  return (
    <section
      id="quienes-somos"
      className="relative overflow-hidden bg-gold-light px-6 py-24 md:py-32"
    >
      <div className="pointer-events-none absolute left-6 top-12 select-none font-sans text-[10rem] font-[200] leading-none text-navy-primary/[0.06] md:left-16 md:text-[16rem]">
        02
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px]">
        <ScrollReveal>
          <span className="mb-4 inline-block font-sans text-xs font-[600] uppercase tracking-[0.3em] text-gold">
            {t("about.tag")}
          </span>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h2 className="mb-1 max-w-3xl font-sans text-[clamp(1.8rem,3.5vw,3rem)] font-[200] leading-[1.15] text-navy-deep">
            {t("about.title")}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <h3 className="mb-6 max-w-3xl font-sans text-lg font-[300] leading-snug text-navy-primary/70">
            {t("about.subtitle")}
          </h3>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="mb-16 max-w-2xl font-sans text-base font-[300] leading-relaxed text-navy-primary/70 md:text-lg">
            {t("about.body")}
          </p>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={300 + i * 100}>
              <div className="group flex flex-col gap-4 border border-navy-primary/10 bg-kc-white/60 p-8 transition-all hover:bg-kc-white hover:shadow-md">
                <feature.icon size={28} strokeWidth={1.2} className="text-gold" />
                <h3 className="font-sans text-base font-[600] uppercase tracking-[0.1em] text-navy-deep">
                  {feature.title}
                </h3>
                <div className="flex flex-col gap-2 font-sans text-sm font-[300] leading-relaxed text-navy-primary/70">
                  {feature.description.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
