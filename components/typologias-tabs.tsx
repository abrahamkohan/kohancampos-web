"use client"

import { useState } from "react"
import Image from "next/image"
import { X, FileImage } from "lucide-react"
import type { Typology } from "@/lib/supabase-projects"

const SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"

function unitLabel(t: Typology): string {
  const parts: string[] = [`${t.area_m2} m²`]
  if (t.bathrooms != null && t.bathrooms > 0) {
    parts.push(`${t.bathrooms} baño${t.bathrooms > 1 ? "s" : ""}`)
  }
  return parts.join(" · ")
}

export function TypologiasTabs({ typologies }: { typologies: Typology[] }) {
  // Group by name
  const groups: Record<string, Typology[]> = {}
  for (const t of typologies) {
    if (!groups[t.name]) groups[t.name] = []
    groups[t.name].push(t)
  }
  const groupNames = Object.keys(groups)

  const [activeGroup, setActiveGroup] = useState(0)
  const [activeUnit,  setActiveUnit]  = useState(0)
  const [planoModal,  setPlanoModal]  = useState(false)

  const currentGroup = groups[groupNames[activeGroup]] ?? []
  const t = currentGroup[activeUnit]

  if (!t || groupNames.length === 0) return null

  function switchGroup(i: number) {
    setActiveGroup(i)
    setActiveUnit(0)
    setPlanoModal(false)
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Tabs por nombre */}
      <div className="flex flex-wrap gap-0 border-b border-gold/10">
        {groupNames.map((name, i) => (
          <button
            key={name}
            type="button"
            onClick={() => switchGroup(i)}
            className={`px-4 py-2.5 font-sans text-xs font-[600] uppercase tracking-[0.15em] transition-all border-b-2 -mb-px ${
              i === activeGroup
                ? "border-gold text-kc-white"
                : "border-transparent text-kc-white/40 hover:text-kc-white/70"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Lista de unidades dentro del grupo (solo si hay más de una) */}
      {currentGroup.length > 1 && (
        <div className="flex flex-col gap-1">
          {currentGroup.map((unit, i) => (
            <button
              key={unit.id}
              type="button"
              onClick={() => { setActiveUnit(i); setPlanoModal(false) }}
              className={`flex items-center gap-3 px-4 py-2.5 text-left transition-all border ${
                i === activeUnit
                  ? "border-gold/30 bg-gold/5"
                  : "border-gold/10 hover:border-gold/20"
              }`}
            >
              <span className={`font-sans text-sm font-[300] ${
                i === activeUnit ? "text-kc-white" : "text-kc-white/50"
              }`}>
                {unitLabel(unit)}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Detalle de la unidad activa */}
      <div className="grid md:grid-cols-2 gap-6 items-start">

        {/* Ficha */}
        <div className="flex flex-col gap-4">

          {/* Nombre + datos */}
          <div className="flex items-baseline gap-3 flex-wrap">
            <h3 className="font-sans text-lg font-[200] text-kc-white">{t.name}</h3>
            <span className="font-sans text-sm font-[300] text-kc-white/40">{unitLabel(t)}</span>
          </div>

          {/* Precio: siempre "Consultar" */}
          <div className="inline-block border border-gold/20 px-4 py-2.5 w-fit">
            <span className="block font-sans text-[9px] font-[600] uppercase tracking-[0.3em] text-gold/60 mb-0.5">
              Precio
            </span>
            <span className="font-sans text-sm font-[300] text-kc-white/60">
              Consultar
            </span>
          </div>

          {/* Features */}
          {t.features.length > 0 && (
            <p className="font-sans text-xs font-[300] text-kc-white/55 leading-relaxed">
              {t.features.join(" · ")}
            </p>
          )}

          {/* Ver plano */}
          {t.floor_plan && (
            <button
              type="button"
              onClick={() => setPlanoModal(true)}
              className="flex items-center gap-2 w-fit px-4 py-2 border border-gold/30 text-kc-white/70 hover:border-gold/70 hover:text-kc-white font-sans text-xs font-[500] tracking-wide transition-all"
            >
              <FileImage size={13} />
              Ver plano
            </button>
          )}
        </div>

        {/* Imágenes */}
        {t.images.length > 0 && (
          <div className={`grid gap-2 ${t.images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
            {t.images.slice(0, 4).map((url, i) => (
              <div key={i} className="relative aspect-square overflow-hidden bg-navy-primary">
                <Image
                  src={url}
                  alt={`${t.name} — ${i + 1}`}
                  fill
                  sizes={SIZES}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal plano */}
      {planoModal && t.floor_plan && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPlanoModal(false)}
        >
          <button
            type="button"
            onClick={() => setPlanoModal(false)}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-navy-deep/80 flex items-center justify-center text-kc-white/70 hover:text-kc-white transition-colors"
          >
            <X size={18} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={t.floor_plan}
            alt={`Plano — ${t.name}`}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
