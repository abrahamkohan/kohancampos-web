"use client"

import { MapPin, CalendarDays, Building2 } from "lucide-react"
import type { EstadoObra, BadgeAnalisis } from "@/lib/supabase-projects"

const ESTADO_LABEL: Record<string, string> = {
  en_pozo:   "En pozo",
  en_obra:   "En obra",
  terminado: "Terminado",
}
const ESTADO_CLS: Record<string, string> = {
  en_pozo:   "bg-navy-deep/70 text-violet-300 border border-violet-400/30",
  en_obra:   "bg-navy-deep/70 text-yellow-300 border border-yellow-400/30",
  terminado: "bg-navy-deep/70 text-emerald-300 border border-emerald-400/30",
}
const BADGE_LABEL: Record<string, string> = {
  oportunidad: "Oportunidad",
  estable:     "Estable",
  a_evaluar:   "A evaluar",
}
const BADGE_CLS: Record<string, string> = {
  oportunidad: "bg-gold text-navy-deep",
  estable:     "bg-navy-deep/75 text-blue-300 border border-blue-400/50",
  a_evaluar:   "bg-navy-deep/75 text-kc-white/55 border border-kc-white/20",
}

function formatUsd(n: number) {
  return `USD ${n.toLocaleString("es-PY")}`
}

interface Props {
  nombre:        string
  zona:          string | null
  estado:        EstadoObra
  badgeAnalisis: BadgeAnalisis | null
  coverUrl:      string | null
  minPriceUsd:   number | null
  deliveryDate:  string | null
  desarrolladora: string | null
}

export function LandingHero({
  nombre,
  zona,
  estado,
  badgeAnalisis,
  coverUrl,
  minPriceUsd,
  deliveryDate,
  desarrolladora,
}: Props) {
  return (
    <section className="relative w-full" style={{ minHeight: "48vh" }}>

      {/* Imagen de fondo */}
      {coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverUrl}
          alt={nombre}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-navy-primary" />
      )}

      {/* Gradientes overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b1a2b] via-[#0b1a2b]/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b1a2b]/85 via-[#0b1a2b]/30 to-transparent" />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col justify-end min-h-[48vh] px-6 pb-10 md:pb-16">
        <div className="mx-auto w-full max-w-[1100px]">
          <div className="max-w-lg">

            {/* Badges */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {estado && (
                <span
                  className={`rounded-sm px-2.5 py-1 font-sans text-[9px] font-[600] uppercase tracking-[0.15em] backdrop-blur-sm ${ESTADO_CLS[estado] ?? ""}`}
                >
                  {ESTADO_LABEL[estado] ?? estado}
                </span>
              )}
              {badgeAnalisis && (
                <span
                  className={`rounded-sm px-2.5 py-1 font-sans text-[9px] font-[700] uppercase tracking-[0.15em] backdrop-blur-sm ${BADGE_CLS[badgeAnalisis] ?? ""}`}
                >
                  {BADGE_LABEL[badgeAnalisis] ?? badgeAnalisis}
                </span>
              )}
            </div>

            {/* Nombre */}
            <h1 className="font-sans text-4xl md:text-5xl font-semibold leading-tight text-white mb-4 drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)]">
              {nombre}
            </h1>

            {/* Meta */}
            <div className="flex flex-col gap-1.5 mb-6">
              {zona && (
                <div className="flex items-center gap-2">
                  <MapPin size={13} strokeWidth={1.5} className="text-gold shrink-0" />
                  <span className="font-sans text-sm font-[400] text-[#cbd5e1]">{zona}</span>
                </div>
              )}
              {deliveryDate && (
                <div className="flex items-center gap-2">
                  <CalendarDays size={13} strokeWidth={1.5} className="text-gold/80 shrink-0" />
                  <span className="font-sans text-sm font-[400] text-[#cbd5e1]">
                    Entrega:{" "}
                    {new Date(deliveryDate).toLocaleDateString("es-PY", {
                      year:  "numeric",
                      month: "long",
                    })}
                  </span>
                </div>
              )}
              {desarrolladora && (
                <div className="flex items-center gap-2">
                  <Building2 size={13} strokeWidth={1.5} className="text-gold/80 shrink-0" />
                  <span className="font-sans text-sm font-[400] text-[#cbd5e1]">{desarrolladora}</span>
                </div>
              )}
            </div>

            {/* Precio desde */}
            {minPriceUsd != null && (
              <div className="inline-block border border-gold/50 px-5 py-3.5 bg-[#0b1a2b]/85 backdrop-blur-sm">
                <span className="block font-sans text-[9px] font-[600] uppercase tracking-[0.3em] text-gold mb-1">
                  Precio desde
                </span>
                <span className="font-sans text-3xl md:text-4xl font-semibold text-white">
                  {formatUsd(minPriceUsd)}
                </span>
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  )
}
