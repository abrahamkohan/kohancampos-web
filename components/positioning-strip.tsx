"use client"
import { useLanguage } from "@/components/language-context"

export function PositioningStrip() {
  const { t } = useLanguage()
  const pillars = [
    t("positioning.p1"), t("positioning.p2"),
    t("positioning.p3"), t("positioning.p4"),
  ]

  return (
    <section className="bg-navy-primary">
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-y-8 gap-x-4 px-6 py-10 sm:flex sm:flex-row sm:justify-center sm:gap-0 sm:py-6">
        {pillars.map((text, i) => (
          <div key={text} className="flex items-center justify-center sm:justify-start">
            {i > 0 && <div className="mx-6 hidden h-8 w-px bg-gold/30 sm:block" />}
            <div className="flex flex-col items-center gap-1.5 text-center px-2">
              <div className="h-px w-4 bg-gold" />
              <span className="font-sans text-[10px] sm:text-[11px] font-[600] uppercase tracking-[0.2em] text-kc-white leading-relaxed">
                {text}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
