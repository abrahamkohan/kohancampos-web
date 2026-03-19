"use client"

import { useState } from "react"
import Image from "next/image"
import type { Typology } from "@/lib/supabase-projects"

const SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"

export function TypologiasTabs({ typologies }: { typologies: Typology[] }) {
  const [active, setActive] = useState(0)
  const t = typologies[active]

  return (
    <div className="flex flex-col gap-6">

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gold/10 pb-0">
        {typologies.map((typ, i) => (
          <button
            key={typ.id}
            type="button"
            onClick={() => setActive(i)}
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

      {/* Contenido del tab activo */}
      <div className="flex flex-col gap-6">

        {/* Nombre + m2 */}
        <div className="flex items-baseline gap-3">
          <h3 className="font-sans text-xl font-[200] text-kc-white">{t.name}</h3>
          {t.area_m2 > 0 && (
            <span className="font-sans text-sm font-[300] text-kc-white/40">{t.area_m2} m²</span>
          )}
        </div>

        {/* Features */}
        {t.features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {t.features.map(f => (
              <span
                key={f}
                className="px-3 py-1 rounded-sm border border-gold/20 font-sans text-[11px] font-[400] text-kc-white/60 tracking-wide"
              >
                {f}
              </span>
            ))}
          </div>
        )}

        {/* Imágenes */}
        {t.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {t.images.map((url, i) => (
              <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-sm bg-navy-primary">
                <Image
                  src={url}
                  alt={`${t.name} — imagen ${i + 1}`}
                  fill
                  sizes={SIZES}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Plano */}
        {t.floor_plan && (
          <div className="flex flex-col gap-2">
            <p className="font-sans text-[10px] font-[600] uppercase tracking-[0.25em] text-gold/60">
              Plano
            </p>
            <div className="relative w-full max-w-lg aspect-[4/3] overflow-hidden rounded-sm bg-navy-primary">
              <Image
                src={t.floor_plan}
                alt={`Plano — ${t.name}`}
                fill
                sizes="(max-width: 640px) 100vw, 512px"
                className="object-contain"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
