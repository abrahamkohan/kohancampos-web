"use client"

import { useState } from "react"
import Image from "next/image"
import { MapPin, ArrowRight } from "lucide-react"
import type { Proyecto, EstadoObra, BadgeAnalisis } from "@/lib/supabase-projects"

// ─── Placeholder ──────────────────────────────────────────────────────────────

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%231B2A4A'/%3E%3Crect x='220' y='120' width='160' height='140' fill='none' stroke='%23C9B99A' stroke-width='1.5' opacity='0.25'/%3E%3Cpath d='M220 190 L300 120 L380 190' fill='none' stroke='%23C9B99A' stroke-width='1.5' opacity='0.25'/%3E%3Crect x='260' y='195' width='80' height='65' fill='none' stroke='%23C9B99A' stroke-width='1' opacity='0.2'/%3E%3C/svg%3E"

const SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"

// ─── Estado config ─────────────────────────────────────────────────────────────

const ESTADO_LABEL: Record<EstadoObra, string> = {
  en_pozo:   "En pozo",
  en_obra:   "En obra",
  terminado: "Terminado",
}

const ESTADO_CLS: Record<EstadoObra, string> = {
  en_pozo:   "bg-navy-deep/70 text-violet-300 border border-violet-400/30",
  en_obra:   "bg-navy-deep/70 text-yellow-300 border border-yellow-400/30",
  terminado: "bg-navy-deep/70 text-emerald-300 border border-emerald-400/30",
}

// ─── Análisis badge config ─────────────────────────────────────────────────────

const BADGE_LABEL: Record<BadgeAnalisis, string> = {
  oportunidad: "Oportunidad",
  estable:     "Estable",
  a_evaluar:   "A evaluar",
}

// Overlay sobre imagen: fondo oscuro semitransparente + color de texto diferenciado
const BADGE_CLS: Record<BadgeAnalisis, string> = {
  oportunidad: "bg-gold text-navy-deep",
  estable:     "bg-navy-deep/75 text-blue-300 border border-blue-400/50",
  a_evaluar:   "bg-navy-deep/75 text-kc-white/55 border border-kc-white/20",
}

// ─── Imagen ────────────────────────────────────────────────────────────────────

function ProjectImage({ src, alt }: { src: string | null; alt: string }) {
  const [errored, setErrored] = useState(false)
  if (!src || errored) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={PLACEHOLDER} alt={alt} className="h-full w-full object-cover" />
  }
  return (
    <Image
      src={src} alt={alt} fill sizes={SIZES}
      className="object-cover transition-all duration-500 group-hover:scale-[1.03] group-hover:brightness-110"
      onError={() => setErrored(true)}
    />
  )
}

// ─── Card ──────────────────────────────────────────────────────────────────────

export function ProyectoCard({ p, href }: { p: Proyecto; href?: string }) {
  const dest = href ?? `https://wa.me/595982000808?text=${encodeURIComponent(`Hola, me interesa conocer más sobre el proyecto ${p.nombre}`)}`
  const isExternal = dest.startsWith("http")

  return (
    <a
      href={dest}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex flex-col h-full min-h-[460px] border border-gold/15 bg-navy-light/50 cursor-pointer transition-all duration-300 hover:border-gold/35 hover:shadow-[0_0_40px_rgba(201,185,154,0.1)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
    >
      {/* Imagen */}
      <div className="relative h-[256px] flex-shrink-0 overflow-hidden">
        <ProjectImage src={p.imagen} alt={p.nombre} />

        {/* Overlay badges — top row sobre la imagen */}
        <div className="absolute left-0 right-0 top-0 flex items-start justify-between gap-2 p-4">
          {/* Estado — top-left */}
          <span className={`inline-block rounded-sm px-2.5 py-1 font-sans text-[10px] font-[600] uppercase tracking-[0.15em] backdrop-blur-sm ${ESTADO_CLS[p.estado]}`}>
            {ESTADO_LABEL[p.estado]}
          </span>

          {/* Badge análisis — top-right */}
          {p.badge_analisis && (
            <span className={`inline-block rounded-sm px-2.5 py-1 font-sans text-[10px] font-[700] uppercase tracking-[0.15em] backdrop-blur-sm ${BADGE_CLS[p.badge_analisis]}`}>
              {BADGE_LABEL[p.badge_analisis]}
            </span>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-6">
        {/* Desarrolladora */}
        <span className="mb-2 block font-sans text-[10px] font-[600] uppercase tracking-[0.2em] text-gold/60 min-h-[16px]">
          {p.desarrolladora || "\u00A0"}
        </span>

        {/* Nombre */}
        <h3 className="mb-4 font-sans text-xl font-[300] leading-snug text-kc-white line-clamp-2 flex-grow">
          {p.nombre}
        </h3>

        {/* Ubicación + CTA */}
        <div className="mt-auto border-t border-gold/10 pt-4">
          <div className="flex items-center gap-2 min-h-[20px] mb-5">
            <MapPin size={13} strokeWidth={1.5} className="shrink-0 text-gold/50" />
            <span className="font-sans text-xs font-[300] text-kc-white/50">
              {p.ubicacion || "\u00A0"}
            </span>
          </div>

          <div className="flex items-center justify-between bg-gold/10 px-4 py-3 transition-all duration-300 group-hover:bg-gold/20">
            <span className="font-sans text-[10px] font-[600] uppercase tracking-[0.2em] text-gold">
              Ver análisis de inversión
            </span>
            <ArrowRight
              size={14}
              className="text-gold transition-transform duration-300 group-hover:translate-x-1.5"
            />
          </div>
        </div>
      </div>
    </a>
  )
}
