"use client"
import { ScrollReveal } from "./scroll-reveal"
import { useLanguage } from "@/components/language-context"

export function Process() {
  const { t } = useLanguage()

  const steps = [
    { number: "01", title: t("process.s1_title"), description: t("process.s1_desc") },
    { number: "02", title: t("process.s2_title"), description: t("process.s2_desc") },
    { number: "03", title: t("process.s3_title"), description: t("process.s3_desc") },
    { number: "04", title: t("process.s4_title"), description: t("process.s4_desc") },
  ]

  return (
    <section id="proceso" className="bg-gold-light px-6 py-24 md:py-32">
      <div className="mx-auto max-w-[1200px]">
        <ScrollReveal>
          <span className="mb-4 inline-block font-sans text-xs font-[600] uppercase tracking-[0.3em] text-navy-primary">
            {t("process.tag")}
          </span>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <h2 className="mb-14 font-sans text-[clamp(1.8rem,3.5vw,3rem)] font-[200] leading-[1.15] text-navy-deep md:mb-16">
            {t("process.title")}
          </h2>
        </ScrollReveal>
        <div className="grid gap-10 md:grid-cols-4 md:gap-6 lg:gap-8">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} delay={200 + i * 120}>
              <div className="relative flex flex-col">
                {i < steps.length - 1 && (
                  <div className="absolute right-0 top-8 hidden h-px w-full translate-x-1/2 bg-navy-primary/10 md:block" />
                )}
                <span className="mb-4 font-sans text-4xl font-[200] leading-none text-gold md:text-5xl">
                  {step.number}
                </span>
                <div className="mb-3 h-px w-8 bg-navy-primary/20" />
                <h3 className="mb-3 font-sans text-sm font-[600] uppercase tracking-[0.15em] text-navy-deep">
                  {step.title}
                </h3>
                <p className="font-sans text-sm font-[300] leading-relaxed text-navy-primary/70">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
