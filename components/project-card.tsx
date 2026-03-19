"use client"

import { useState } from "react"
import Image from "next/image"
import { MapPin, ArrowRight } from "lucide-react"
import type { Proyecto, EstadoObra, BadgeAnalisis } from "@/lib/supabase-projects"

// ─── Placeholder ──────────────────────────────────────────────────────────────

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%231B2A4A'/%3E%3Crect x='220' y='120' width='160' height='140' fill='none' stroke='%23C9B99A' stroke-width='1.5' opacity='0.25'/%3E%3Cpath d='M220 190 L300 120 L380 190' fill='none' stroke='%23C9B99A' stroke-width='1.5' opacity='0.25'/%3E%3Crect x='260' y='195' width='80' height='65' fill='none' stroke='%23C9B99A' stroke-width='1' opacity='0.2'/%3E%3C/svg%3E"

const SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"

// ─── Estado config ────────────────────────────────────────────────────────────

const ESTADO_LABEL: Record<EstadoObra, string> = {
  en_pozo:   "En pozo",
  en_obra:   "En obra",
  terminado: "Terminado",
}

const ESTADO_CLS: Record<EstadoObra, string> = {
  en_pozo:   "bg-violet-500/15 text-violet-300",
  en_obra:   "bg-yellow-500/15 text-yellow-300",
  terminado: "bg-emerald-500/15 text-emerald-300",
}

// ─── Análisis badge config ─────────────────────────────────────────────────────

const BADGE_LABEL: Record<BadgeAnalisis, string> = {
  oportunidad: "Oportunidad",
  estable:     "Estable",
  a_evaluar:   "A evaluar",
}

const BADGE_CLS: Record<BadgeAnalisis, string> = {
  oportunidad: "bg-gold text-navy-deep",
  estable:     "bg-blue-500/20 text-blue-200",
  a_evaluar:   "bg-kc-white/10 text-kc-white/60",
}

// ─── Imagen ───────────────────────────────────────────────────────────────────

function ProjectImage({ src, alt }: { src: string | null; alt: string }) {
  const [errored, setErrored] = useState(false)
  if (!src || errored) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={PLACEHOLDER} alt={alt} className="h-full w-full object-cover" />
  }
  return (
    <Image
      src={src} alt={alt} fill sizes={SIZES}
      className="object-cover transition-transform duration-700 group-hover:scale-105"
      onError={() => setErrored(true)}
    />
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export function ProyectoCard({ p, href }: { p: Proyecto; href?: string }) {
  const dest = href ?? `https://wa.me/595982000808?text=${encodeURIComponent(`Hola, me interesa conocer más sobre el proyecto ${p.nombre}`)}`
  const isExternal = dest.startsWith("http")

  return (
    <a
      href={dest}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex flex-col h-full min-h-[460px] border border-gold/15 bg-navy-light/50 transition-all duration-300 hover:border-gold/35 hover:shadow-[0_0_40px_rgba(201,185,154,0.08)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
    >
      {/* Imagen */}
      <div className="relative h-[256px] flex-shrink-0 overflow-hidden">
        <ProjectImage src={p.imagen} alt={p.nombre} />

        {/* Estado badge — top-left */}
        <div className="absolute left-4 top-4">
          <span className={`inline-block rounded-sm px-2.5 py-1 font-sans text-[10px] font-[600] uppercase tracking-[0.15em] ${ESTADO_CLS[p.estado]}`}>
            {ESTADO_LABEL[p.estado]}
          </span>
        </div>

        {/* Análisis badge — bottom strip */}
        {p.badge_analisis && (
          <div className="absolute bottom-0 left-0 right-0">
            <div className={`flex items-center gap-2 px-4 py-2.5 font-sans text-[10px] font-[700] uppercase tracking-[0.2em] ${BADGE_CLS[p.badge_analisis]}`}>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-80" />
              {BADGE_LABEL[p.badge_analisis]}
            </div>
          </div>
        )}
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

        {/* Ubicación */}
        <div className="mt-auto border-t border-gold/10 pt-4">
          <div className="flex items-center gap-2 min-h-[20px] mb-5">
            <MapPin size={13} strokeWidth={1.5} className="shrink-0 text-gold/50" />
            <span className="font-sans text-xs font-[300] text-kc-white/50">
              {p.ubicacion || "\u00A0"}
            </span>
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between bg-gold/10 px-4 py-3 transition-all group-hover:bg-gold/20">
            <span className="font-sans text-[10px] font-[600] uppercase tracking-[0.2em] text-gold">
              Ver análisis
            </span>
            <ArrowRight
              size={14}
              className="text-gold transition-transform duration-300 group-hover:translate-x-1"
            />
          </div>
        </div>
      </div>
    </a>
  )
}
