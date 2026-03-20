"use client"

import { useState } from "react"
import { X, LayoutGrid } from "lucide-react"
import type { Typology } from "@/lib/supabase-projects"

function formatUsd(n: number) {
  return `USD ${n.toLocaleString("es-PY")}`
}

// ─── Modal plano ──────────────────────────────────────────────────────────────

function PlanoModal({
  url,
  name,
  onClose,
}: {
  url: string
  name: string
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-navy-deep/80 flex items-center justify-center text-kc-white/70 hover:text-kc-white transition-colors"
      >
        <X size={18} />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={`Plano — ${name}`}
        className="max-w-full max-h-[90vh] object-contain"
        onClick={e => e.stopPropagation()}
      />
    </div>
  )
}

// ─── Card individual ──────────────────────────────────────────────────────────

function TypologiaCard({
  t,
  onVerPlano,
}: {
  t: Typology
  onVerPlano: (t: Typology) => void
}) {
  return (
    <div className="group flex flex-col border border-[#2f4a66] bg-navy-card hover:border-[#3a5a7a] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">

      {/* Imagen */}
      {t.images.length > 0 ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={t.images[0]}
          alt={t.name}
          className="w-full aspect-video object-cover"
        />
      ) : (
        <div className="w-full aspect-video bg-navy-primary/60 flex items-center justify-center">
          <LayoutGrid size={22} className="text-white/10" />
        </div>
      )}

      <div className="flex flex-col gap-5 p-5 flex-1">

        {/* Nombre · m² */}
        <div className="flex items-baseline gap-2">
          <span className="font-sans text-base font-semibold text-white">{t.name}</span>
          {t.area_m2 > 0 && (
            <span className="font-sans text-xs text-[#94a3b8]">{t.area_m2} m²</span>
          )}
        </div>

        {/* Precio — elemento dominante */}
        {t.price_usd != null && t.price_usd > 0 && (
          <div className="border-t border-[#2f4a66] pt-4">
            <span className="block font-sans text-xs uppercase tracking-wider text-[#94a3b8] mb-1.5">Precio desde</span>
            <span className="font-sans text-3xl font-semibold text-white leading-none">{formatUsd(t.price_usd)}</span>
          </div>
        )}

        {/* Features como lista */}
        {t.features.length > 0 && (
          <ul className="flex flex-col gap-1.5 border-t border-[#2f4a66] pt-4">
            {t.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 font-sans text-xs text-[#94a3b8]">
                <span className="text-[#94a3b8]/50 shrink-0 mt-px">·</span>
                {f}
              </li>
            ))}
          </ul>
        )}

        {/* Ver plano */}
        {t.floor_plan && (
          <button
            type="button"
            onClick={() => onVerPlano(t)}
            className="mt-auto flex items-center gap-2 w-fit px-3 py-1.5 border border-white/15 text-white/50 hover:border-white/35 hover:text-white font-sans text-xs tracking-wide transition-all"
          >
            <LayoutGrid size={11} />
            Ver plano
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Export principal ─────────────────────────────────────────────────────────

export function LandingTypologias({ typologies }: { typologies: Typology[] }) {
  const [plano, setPlano] = useState<Typology | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {typologies.map(t => (
          <TypologiaCard key={t.id} t={t} onVerPlano={setPlano} />
        ))}
      </div>

      {plano?.floor_plan && (
        <PlanoModal
          url={plano.floor_plan}
          name={plano.name}
          onClose={() => setPlano(null)}
        />
      )}
    </>
  )
}
