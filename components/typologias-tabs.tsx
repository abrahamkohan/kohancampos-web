"use client"

import { useState } from "react"
import Image from "next/image"
import { X, FileImage } from "lucide-react"
import type { Typology } from "@/lib/supabase-projects"

const SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"

export function TypologiasTabs({ typologies }: { typologies: Typology[] }) {
  const [active, setActive] = useState(0)
  const [planoModal, setPlanoModal] = useState(false)
  const t = typologies[active]

  return (
    <div className="flex flex-col gap-4">

      {/* Tabs */}
      <div className="flex flex-wrap gap-0 border-b border-gold/10">
        {typologies.map((typ, i) => (
          <button
            key={typ.id}
            type="button"
            onClick={() => { setActive(i); setPlanoModal(false) }}
            className={`px-4 py-2.5 font-sans text-xs font-[600] uppercase tracking-[0.15em] transition-all border-b-2 -mb-px ${
              i === active
                ? "border-gold text-kc-white"
                : "border-transparent text-kc-white/40 hover:text-kc-white/70"
            }`}
          >
            {typ.name}
          </button>
        ))}
      </div>

      {/* Contenido — 2 columnas */}
      <div className="grid md:grid-cols-2 gap-6 items-start">

        {/* Columna izquierda: info */}
        <div className="flex flex-col gap-4">

          {/* Nombre + m2 */}
          <div className="flex items-baseline gap-3">
            <h3 className="font-sans text-lg font-[200] text-kc-white">{t.name}</h3>
            {t.area_m2 > 0 && (
              <span className="font-sans text-sm font-[300] text-kc-white/40">{t.area_m2} m²</span>
            )}
          </div>

          {/* Features */}
          {t.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {t.features.map(f => (
                <span
                  key={f}
                  className="px-2.5 py-1 border border-gold/20 font-sans text-[11px] font-[400] text-kc-white/60 tracking-wide"
                >
                  {f}
                </span>
              ))}
            </div>
          )}

          {/* Botón Ver plano */}
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

        {/* Columna derecha: imágenes */}
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
