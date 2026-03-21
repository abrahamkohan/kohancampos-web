"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Waves, Dumbbell, Monitor, Users, Building2, Car, Zap, Shield, Wifi, Sun, Leaf, Check, Wind, Flame, Utensils, Archive, ArrowUpDown } from "lucide-react"
import { mediaUrl } from "@/lib/supabase-projects"
import type { Amenity } from "@/lib/supabase-projects"

const SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"

// Icon map by amenity NAME (fuzzy, Spanish/English)
const ICON_MAP: Record<string, React.ElementType> = {
  pileta: Waves, piscina: Waves, pool: Waves,
  gimnasio: Dumbbell, gym: Dumbbell,
  coworking: Monitor,
  salón: Users, salon: Users,
  lobby: Building2,
  cochera: Car, cocheras: Car, estacionamiento: Car,
  generador: Zap,
  seguridad: Shield,
  wifi: Wifi, internet: Wifi,
  terraza: Sun, jardín: Leaf, jardin: Leaf,
}

// Icon map by Lucide icon name (from project_amenities.icon field)
const LUCIDE_ICON_MAP: Record<string, React.ElementType> = {
  waves: Waves, dumbbell: Dumbbell, wind: Wind, flame: Flame,
  utensils: Utensils, archive: Archive, sun: Sun, leaf: Leaf,
  car: Car, shield: Shield, 'arrow-up-down': ArrowUpDown,
  'building-2': Building2, beef: Flame, 'tree-pine': Leaf,
  'door-open': Monitor, 'washing-machine': Zap,
  monitor: Monitor, users: Users, zap: Zap, wifi: Wifi,
}

function getAmenityIcon(amenity: Amenity): React.ElementType {
  if (amenity.icon && LUCIDE_ICON_MAP[amenity.icon]) return LUCIDE_ICON_MAP[amenity.icon]
  const key = amenity.name.toLowerCase().split(/[\s,]/)[0]
  return ICON_MAP[key] ?? Check
}

// ─── Card individual ──────────────────────────────────────────────────────────

export function AmenityCard({ amenity }: { amenity: Amenity }) {
  const [idx, setIdx] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const multi = amenity.images.length > 1
  const current = amenity.images[idx]

  const prev = useCallback(() => setIdx(i => (i === 0 ? amenity.images.length - 1 : i - 1)), [amenity.images.length])
  const next = useCallback(() => setIdx(i => (i === amenity.images.length - 1 ? 0 : i + 1)), [amenity.images.length])

  function onTouchStart(e: React.TouchEvent) { touchStartX.current = e.touches[0].clientX }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
    touchStartX.current = null
  }

  if (!current) {
    const Icon = getAmenityIcon(amenity)
    return (
      <li className="group flex items-center gap-3">
        <div className="w-10 h-10 shrink-0 border border-gold/50 flex items-center justify-center text-gold/65 transition-all duration-200 group-hover:border-gold/80 group-hover:text-gold group-hover:shadow-[0_0_10px_rgba(201,185,154,0.15)]">
          <Icon size={19} strokeWidth={1.5} />
        </div>
        <span className="font-sans text-sm font-[400] text-[#cbd5e1]">{amenity.name}</span>
      </li>
    )
  }

  return (
    <div className="group flex flex-col gap-0">
      {/* Imagen / carrusel */}
      <div
        className="relative aspect-square overflow-hidden rounded-sm bg-navy-primary"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Image
          key={current.id}
          src={mediaUrl(current.storage_path)}
          alt={amenity.name}
          fill
          sizes={SIZES}
          className="object-cover transition-all duration-500 group-hover:scale-[1.03] group-hover:brightness-110"
        />

        {/* Overlay gradient bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/60 via-transparent to-transparent pointer-events-none" />

        {/* Flechas — solo si hay múltiples */}
        {multi && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-navy-deep/70 backdrop-blur-sm flex items-center justify-center text-kc-white/80 hover:text-kc-white hover:bg-navy-deep/90 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-navy-deep/70 backdrop-blur-sm flex items-center justify-center text-kc-white/80 hover:text-kc-white hover:bg-navy-deep/90 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={14} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {amenity.images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdx(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === idx ? "bg-gold w-3" : "bg-kc-white/40"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Nombre */}
      <div className="pt-3 pb-1 px-0.5">
        <p className="font-sans text-sm font-[500] text-white/90 tracking-wide">
          {amenity.name}
        </p>
      </div>
    </div>
  )
}

// ─── Sección completa (agrupada por categoría) ───────────────────────────────

function AmenityGroup({ label, items }: { label: string; items: Amenity[] }) {
  if (!items.length) return null
  const hasImages = items.some(a => a.images.length > 0)
  return (
    <div className="flex flex-col gap-4">
      <p className="font-sans text-xs font-[600] uppercase tracking-wider text-[#94a3b8]">
        {label}
      </p>
      {hasImages ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(a => (
            <AmenityCard key={a.id} amenity={a} />
          ))}
        </div>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {items.map(a => (
            <AmenityCard key={a.id} amenity={a} />
          ))}
        </ul>
      )}
    </div>
  )
}

export function AmenitiesSection({ amenities }: { amenities: Amenity[] }) {
  if (!amenities.length) return null

  const interior = amenities.filter(a => a.categoria === "interior")
  const edificio = amenities.filter(a => a.categoria !== "interior")

  return (
    <section className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <span className="block font-sans text-xs font-[600] uppercase tracking-wider text-[#94a3b8] mb-2">
          Infraestructura
        </span>
        <h2 className="font-sans text-xl font-semibold text-white">
          Amenities del proyecto
        </h2>
      </div>

      <AmenityGroup label="Interior" items={interior} />
      <AmenityGroup label="Edificio" items={edificio} />
    </section>
  )
}
