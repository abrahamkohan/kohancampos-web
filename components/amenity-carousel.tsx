"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { mediaUrl } from "@/lib/supabase-projects"
import type { Amenity } from "@/lib/supabase-projects"

const SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"

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

  if (!current) return null

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
        <p className="font-sans text-sm font-[400] text-kc-white/80 tracking-wide">
          {amenity.name}
        </p>
      </div>
    </div>
  )
}

// ─── Sección completa (agrupada por categoría) ───────────────────────────────

function AmenityGroup({ label, items }: { label: string; items: Amenity[] }) {
  if (!items.length) return null
  return (
    <div className="flex flex-col gap-4">
      <p className="font-sans text-[10px] font-[600] uppercase tracking-[0.25em] text-gold/50">
        {label}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(a => (
          <AmenityCard key={a.id} amenity={a} />
        ))}
      </div>
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
        <span className="block font-sans text-[10px] font-[600] uppercase tracking-[0.3em] text-gold/60 mb-2">
          Infraestructura
        </span>
        <h2 className="font-sans text-2xl font-[200] text-kc-white">
          Amenities del proyecto
        </h2>
      </div>

      <AmenityGroup label="Interior" items={interior} />
      <AmenityGroup label="Edificio" items={edificio} />
    </section>
  )
}
