"use client"

import { useState } from "react"
import Image from "next/image"
import { Maximize2, Bath, Check, MessageCircle } from "lucide-react"
import type { Typology } from "@/lib/supabase-projects"

const SIZES = "(max-width: 640px) 100vw, 50vw"
const CARD_LABELS = ["Más vendido", "Mejor inversión"]

export function TypologiasTabs({ typologies }: { typologies: Typology[] }) {
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

  const waUrl = `https://wa.me/595982000808?text=${encodeURIComponent("Hola, quiero consultar sobre una tipología")}`

  return (
    <div className="flex flex-col gap-8">

      {/* ── Tabs — scroll horizontal en mobile ── */}
      <div className="overflow-x-auto -mx-6 px-6 scrollbar-none">
        <div className="flex gap-0 border-b border-gold/10 min-w-max">
          {groupNames.map((name, i) => (
            <button
              key={name}
              type="button"
              onClick={() => switchGroup(i)}
              className={`px-5 py-2.5 font-sans text-xs font-[600] uppercase tracking-[0.15em] transition-all border-b-2 -mb-px whitespace-nowrap ${
                i === activeGroup
                  ? "border-gold text-kc-white"
                  : "border-transparent text-kc-white/40 hover:text-kc-white/70"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid de cards — 1 col mobile, 2 col desktop ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
        {currentGroup.map((t, i) => {
          const isActive = t.id === effectiveId
          const thumb    = t.images[0] ?? t.floor_plan ?? null
          const label    = i < CARD_LABELS.length ? CARD_LABELS[i] : null

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedId(t.id)}
              className={`relative flex flex-col text-left rounded-xl overflow-hidden border transition-all duration-200 ${
                isActive
                  ? "border-gold/60 bg-gold/[0.06] shadow-[0_0_24px_rgba(201,185,154,0.12)] scale-[1.02]"
                  : "border-white/8 bg-white/[0.02] hover:border-white/25 hover:scale-[1.01]"
              }`}
            >
              {/* Label */}
              {label && (
                <span className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-gold text-navy-deep font-sans text-[9px] font-[700] uppercase tracking-[0.12em] rounded-sm shadow-sm">
                  {label}
                </span>
              )}

              {/* Preview */}
              <div className="relative aspect-[4/3] bg-[#091825] overflow-hidden">
                {thumb ? (
                  <Image
                    src={thumb}
                    alt={t.name}
                    fill
                    sizes={SIZES}
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-sans text-[10px] text-kc-white/15 uppercase tracking-widest">Sin imagen</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="px-3 pt-3 pb-3.5 flex flex-col gap-2">
                <div className="flex items-center gap-3 flex-wrap">
                  {t.area_m2 && (
                    <div className="flex items-center gap-1.5">
                      <Maximize2 size={12} strokeWidth={1.5} className="text-gold/60 shrink-0" />
                      <span className="font-sans text-xs font-[300] text-kc-white/75">{t.area_m2} m²</span>
                    </div>
                  )}
                  {t.bathrooms != null && t.bathrooms > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Bath size={12} strokeWidth={1.5} className="text-gold/60 shrink-0" />
                      <span className="font-sans text-xs font-[300] text-kc-white/75">
                        {t.bathrooms} baño{t.bathrooms > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
                {isActive && (
                  <div className="flex items-center gap-1.5">
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

      {/* ── Panel de detalle ── */}
      <div className="border border-white/8 rounded-2xl bg-[#0d1f2d] overflow-hidden">

        {/* Header del detalle */}
        <div className="px-6 pt-6 pb-5 border-b border-white/8 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-1.5">
            <h3 className="font-sans text-2xl font-[200] text-kc-white leading-tight">
              {selected.name}
            </h3>
            <div className="flex items-center gap-4 flex-wrap">
              {selected.area_m2 && (
                <div className="flex items-center gap-2">
                  <Maximize2 size={14} strokeWidth={1.5} className="text-gold/60 shrink-0" />
                  <span className="font-sans text-sm font-[300] text-kc-white/60">{selected.area_m2} m²</span>
                </div>
              )}
              {selected.bathrooms != null && selected.bathrooms > 0 && (
                <div className="flex items-center gap-2">
                  <Bath size={14} strokeWidth={1.5} className="text-gold/60 shrink-0" />
                  <span className="font-sans text-sm font-[300] text-kc-white/60">
                    {selected.bathrooms} baño{selected.bathrooms > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* CTA — top right */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-gold text-navy-deep font-sans text-[10px] font-[700] uppercase tracking-[0.18em] hover:bg-gold-light transition-colors rounded-sm"
          >
            <MessageCircle size={13} />
            Consultar
          </a>
        </div>

        {/* Features */}
        {selected.features.length > 0 && (
          <div className="px-6 py-5 border-b border-white/8 flex flex-wrap gap-x-6 gap-y-2.5">
            {selected.features.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check size={13} strokeWidth={2} className="text-gold/60 shrink-0" />
                <span className="font-sans text-sm font-[300] text-kc-white/60">{f}</span>
              </div>
            ))}
          </div>
        )}

        {/* Plano con aire */}
        {selected.floor_plan && (
          <div className="p-4 md:p-8 flex items-center justify-center bg-[#091825]">
            <div className="w-full max-w-lg rounded-xl overflow-hidden shadow-[0_4px_32px_rgba(0,0,0,0.4)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selected.floor_plan}
                alt={`Plano — ${selected.name}`}
                className="w-full object-contain max-h-[320px] md:max-h-[460px]"
              />
            </div>
          </div>
        )}

      </div>

    </div>
  )
}
