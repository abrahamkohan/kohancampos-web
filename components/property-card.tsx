"use client"

import { useState } from "react"
import Image from "next/image"
import { MapPin, Calendar, Ruler } from "lucide-react"
import type { ProyectoPozo, PropiedadTerminada } from "@/lib/notion"

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%231B2A4A'/%3E%3Crect x='240' y='140' width='120' height='100' fill='none' stroke='%23C9B99A' stroke-width='1.5' opacity='0.3'/%3E%3Cpath d='M240 180 L300 140 L360 180' fill='none' stroke='%23C9B99A' stroke-width='1.5' opacity='0.3'/%3E%3C/svg%3E"

const SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"

const estadoColors: Record<string, string> = {
  "En Construccion":  "bg-yellow-500/15 text-yellow-300",
  "En Construcción":  "bg-yellow-500/15 text-yellow-300",
  "Disponible":       "bg-emerald-500/15 text-emerald-300",
  "Reservado":        "bg-orange-500/15 text-orange-300",
  "Señada":           "bg-orange-500/15 text-orange-300",
  "Vendido":          "bg-red-500/15 text-red-300",
  "Entregado":        "bg-blue-500/15 text-blue-300",
}

function Badge({ label }: { label: string }) {
  const cls = estadoColors[label] ?? "bg-gold/10 text-gold"
  return (
    <span className={`inline-block rounded-sm px-2.5 py-1 font-sans text-[10px] font-[600] uppercase tracking-[0.15em] ${cls}`}>
      {label}
    </span>
  )
}

function PropertyImage({ src, alt }: { src: string | null; alt: string }) {
  const [errored, setErrored] = useState(false)

  if (!src || errored) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={PLACEHOLDER} alt={alt} className="h-full w-full object-cover" />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={SIZES}
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      onError={() => setErrored(true)}
    />
  )
}

// ─── Card: Proyecto en Pozo ───────────────────────────────────────────────────

export function PozoCard({ p }: { p: ProyectoPozo }) {
  const location = [p.barrio, p.zona].filter(Boolean).join(" · ")
  const entrega = p.fechaEntrega
    ? new Date(p.fechaEntrega).toLocaleDateString("es-PY", { month: "long", year: "numeric" })
    : null

  return (
    <div className="group flex flex-col border border-gold/15 bg-navy-light/50 transition-all hover:border-gold/35 hover:shadow-[0_0_30px_rgba(201,185,154,0.07)]">
      <div className="relative h-52 overflow-hidden">
        <PropertyImage src={p.imagen} alt={p.nombre} />
        {p.estado && (
          <div className="absolute left-4 top-4">
            <Badge label={p.estado} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        {p.desarrolladora && (
          <span className="mb-2 font-sans text-[10px] font-[600] uppercase tracking-[0.2em] text-gold/60">
            {p.desarrolladora}
          </span>
        )}

        <h3 className="mb-3 font-sans text-xl font-[300] leading-snug text-kc-white">
          {p.nombre || "Proyecto sin nombre"}
        </h3>

        <div className="mt-auto flex flex-col gap-2 border-t border-gold/10 pt-4">
          {location && (
            <div className="flex items-center gap-2">
              <MapPin size={13} strokeWidth={1.5} className="shrink-0 text-gold/50" />
              <span className="font-sans text-xs font-[300] text-kc-white/50">{location}</span>
            </div>
          )}
          {entrega && (
            <div className="flex items-center gap-2">
              <Calendar size={13} strokeWidth={1.5} className="shrink-0 text-gold/50" />
              <span className="font-sans text-xs font-[300] text-kc-white/50">Entrega {entrega}</span>
            </div>
          )}
        </div>

        <a
          href={`https://wa.me/595982000808?text=${encodeURIComponent(`Hola, me interesa conocer más sobre ${p.nombre}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block w-full bg-gold/10 py-3 text-center font-sans text-[10px] font-[600] uppercase tracking-[0.2em] text-gold transition-all hover:bg-gold hover:text-navy-deep"
        >
          Consultar
        </a>
      </div>
    </div>
  )
}

// ─── Card: Propiedad Terminada ────────────────────────────────────────────────

export function TerminadaCard({ p }: { p: PropiedadTerminada }) {
  const location = [p.barrio, p.zona].filter(Boolean).join(" · ")

  return (
    <div className="group flex flex-col border border-gold/15 bg-navy-light/50 transition-all hover:border-gold/35 hover:shadow-[0_0_30px_rgba(201,185,154,0.07)]">
      <a href={`/propiedades/${p.id}`} className="relative h-52 overflow-hidden block">
        <PropertyImage src={p.imagen} alt={p.nombre} />
        {p.estadoComercial && (
          <div className="absolute left-4 top-4">
            <Badge label={p.estadoComercial} />
          </div>
        )}
        {p.tipo && (
          <div className="absolute right-4 top-4">
            <span className="bg-navy-deep/80 px-2.5 py-1 font-sans text-[10px] font-[600] uppercase tracking-[0.15em] text-gold backdrop-blur-sm">
              {p.tipo}
            </span>
          </div>
        )}
      </a>

      <div className="flex flex-1 flex-col p-6">
        {p.tipologia && (
          <span className="mb-2 font-sans text-[10px] font-[600] uppercase tracking-[0.2em] text-gold/60">
            {p.tipologia}
          </span>
        )}

        <h3 className="mb-3 font-sans text-xl font-[300] leading-snug text-kc-white">
          {p.nombre || "Unidad sin nombre"}
        </h3>

        <div className="mt-auto flex flex-col gap-2 border-t border-gold/10 pt-4">
          {location && (
            <div className="flex items-center gap-2">
              <MapPin size={13} strokeWidth={1.5} className="shrink-0 text-gold/50" />
              <span className="font-sans text-xs font-[300] text-kc-white/50">{location}</span>
            </div>
          )}
          <div className="flex items-center gap-4">
            {p.m2 && (
              <div className="flex items-center gap-1.5">
                <Ruler size={13} strokeWidth={1.5} className="shrink-0 text-gold/50" />
                <span className="font-sans text-xs font-[300] text-kc-white/50">{p.m2} m²</span>
              </div>
            )}
            {p.precio && (
              <span className="font-sans text-sm font-[400] text-gold">{p.precio}</span>
            )}
          </div>
        </div>

        <a
          href={`https://wa.me/595982000808?text=${encodeURIComponent(`Hola, me interesa conocer más sobre ${p.nombre}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 block w-full bg-gold/10 py-3 text-center font-sans text-[10px] font-[600] uppercase tracking-[0.2em] text-gold transition-all hover:bg-gold hover:text-navy-deep"
        >
          Consultar
        </a>
      </div>
    </div>
  )
}
