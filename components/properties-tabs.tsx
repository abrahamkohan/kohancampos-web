"use client"

import { useState, type ReactNode } from "react"

type Props = {
  pozoCards: ReactNode[]
  terminadasCards: ReactNode[]
  pozoCount: number
  terminadasCount: number
}

export function PropertiesTabs({ pozoCards, terminadasCards, pozoCount, terminadasCount }: Props) {
  const [active, setActive] = useState<"pozo" | "terminadas">("pozo")

  const tabs = [
    { key: "pozo" as const, label: "Proyectos en Pozo", count: pozoCount },
    { key: "terminadas" as const, label: "Propiedades", count: terminadasCount },
  ]

  const cards = active === "pozo" ? pozoCards : terminadasCards

  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-[1200px]">
        {/* Tab switcher */}
        <div className="mb-10 flex gap-0 border-b border-gold/15">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`relative pb-4 pr-8 font-sans text-sm font-[400] transition-colors
                ${active === tab.key
                  ? "text-gold after:absolute after:bottom-0 after:left-0 after:right-8 after:h-px after:bg-gold"
                  : "text-kc-white/40 hover:text-kc-white/70"
                }`}
            >
              {tab.label}
              <span className={`ml-2 font-sans text-xs ${active === tab.key ? "text-gold/60" : "text-kc-white/25"}`}>
                ({tab.count})
              </span>
            </button>
          ))}
        </div>

        {/* Grid */}
        {cards.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-sans text-base font-[300] text-kc-white/30">
              No hay propiedades publicadas en esta categoría por el momento.
            </p>
            <a
              href="/#contacto"
              className="mt-8 bg-gold px-8 py-3 font-sans text-[10px] font-[600] uppercase tracking-[0.2em] text-navy-deep transition-all hover:bg-gold-light"
            >
              Consultanos
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
