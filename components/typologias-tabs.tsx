"use client"

import { useState } from "react"
import Image from "next/image"
import { Maximize2, Bath, Check } from "lucide-react"
import type { Typology } from "@/lib/supabase-projects"

const SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
const CARD_LABELS = ["Más vendido", "Mejor inversión"]

export function TypologiasTabs({ typologies }: { typologies: Typology[] }) {
  // Agrupar por nombre
  const groups: Record<string, Typology[]> = {}
  for (const t of typologies) {
    if (!groups[t.name]) groups[t.name] = []
    groups[t.name].push(t)
  }
  const groupNames = Object.keys(groups)

  const [activeGroup, setActiveGroup] = useState(0)
  const [selectedId, setSelectedId]   = useState<string | null>(null)

  const currentGroup = groups[groupNames[activeGroup]] ?? []
  const effectiveId  = selectedId ?? (currentGroup[0]?.id ?? null)
  const selected     = currentGroup.find(t => t.id === effectiveId) ?? currentGroup[0]

  if (!selected || groupNames.length === 0) return null

  function switchGroup(i: number) {
    setActiveGroup(i)
    setSelectedId(null)
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── Tabs ── */}
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

      {/* ── Grid de cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {currentGroup.map((t, i) => {
          const isActive = t.id === effectiveId
          const thumb    = t.images[0] ?? t.floor_plan ?? null
          const label    = i < CARD_LABELS.length ? CARD_LABELS[i] : null

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedId(t.id)}
              className={`relative flex flex-col text-left transition-all rounded-xl overflow-hidden border ${
                isActive
                  ? "border-gold/50 bg-gold/5 shadow-[0_0_20px_rgba(201,185,154,0.08)]"
                  : "border-white/8 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              {/* Label */}
              {label && (
                <span className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-gold text-navy-deep font-sans text-[9px] font-[700] uppercase tracking-[0.12em] rounded-sm">
                  {label}
                </span>
              )}

              {/* Preview */}
              <div className="relative aspect-[4/3] bg-[#0d1f2d] overflow-hidden">
                {thumb ? (
                  <Image
                    src={thumb}
                    alt={t.name}
                    fill
                    sizes={SIZES}
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-sans text-[10px] text-kc-white/15 uppercase tracking-widest">Sin imagen</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="px-3 py-3 flex flex-col gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  {t.area_m2 && (
                    <div className="flex items-center gap-1.5">
                      <Maximize2 size={12} strokeWidth={1.5} className="text-gold/55 shrink-0" />
                      <span className="font-sans text-xs font-[300] text-kc-white/70">{t.area_m2} m²</span>
                    </div>
                  )}
                  {t.bathrooms != null && t.bathrooms > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Bath size={12} strokeWidth={1.5} className="text-gold/55 shrink-0" />
                      <span className="font-sans text-xs font-[300] text-kc-white/70">
                        {t.bathrooms} baño{t.bathrooms > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
                {isActive && (
                  <div className="flex items-center gap-1">
                    <Check size={11} strokeWidth={2.5} className="text-gold shrink-0" />
                    <span className="font-sans text-[10px] font-[600] uppercase tracking-[0.15em] text-gold">
                      Seleccionada
                    </span>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* ── Detalle inline ── */}
      <div className="border-t border-white/8 pt-6 flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-baseline gap-3 flex-wrap">
          <h3 className="font-sans text-lg font-[200] text-kc-white">{selected.name}</h3>
          <span className="font-sans text-sm font-[300] text-kc-white/40">
            {selected.area_m2} m²
            {selected.bathrooms != null && selected.bathrooms > 0
              ? ` · ${selected.bathrooms} baño${selected.bathrooms > 1 ? "s" : ""}`
              : ""}
          </span>
        </div>

        {/* Features */}
        {selected.features.length > 0 && (
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {selected.features.map((f, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <Check size={12} strokeWidth={2} className="text-gold/60 shrink-0" />
                <span className="font-sans text-xs font-[300] text-kc-white/60">{f}</span>
              </div>
            ))}
          </div>
        )}

        {/* Plano inline */}
        {selected.floor_plan && (
          <div className="w-full rounded-xl overflow-hidden border border-white/6 bg-[#0d1f2d]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selected.floor_plan}
              alt={`Plano — ${selected.name}`}
              className="w-full object-contain max-h-[500px]"
            />
          </div>
        )}

        {/* Precio */}
        <div className="inline-block border border-gold/20 px-4 py-2.5 w-fit">
          <span className="block font-sans text-[9px] font-[600] uppercase tracking-[0.3em] text-gold/60 mb-0.5">
            Precio
          </span>
          <span className="font-sans text-sm font-[300] text-kc-white/60">Consultar</span>
        </div>

      </div>

    </div>
  )
}
