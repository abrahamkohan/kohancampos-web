import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AmenitiesSection } from "@/components/amenity-carousel"
import { TypologiasTabs } from "@/components/typologias-tabs"
import { getProyectoById } from "@/lib/supabase-projects"
import {
  MapPin, CalendarDays, Building2, MessageCircle,
  Map, FileText, Eye, ExternalLink,
} from "lucide-react"

export const dynamic = "force-dynamic"

// ─── Helpers de formato ───────────────────────────────────────────────────────

function formatUsd(n: number) {
  return `USD ${n.toLocaleString("es-PY")}`
}

function formatDelivery(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("es-PY", {
    year:  "numeric",
    month: "long",
  })
}

// ─── Estado / badge ───────────────────────────────────────────────────────────

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

// ─── Sección label ────────────────────────────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return (
    <span className="block font-sans text-[10px] font-[600] uppercase tracking-[0.3em] text-gold/60 mb-1">
      {text}
    </span>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default async function ProyectoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const p = await getProyectoById(id)
  if (!p) notFound()

  const coverUrl = p.imagen
  const waMsg    = encodeURIComponent(`Hola, me interesa conocer más sobre el proyecto ${p.nombre}`)
  const waUrl    = `https://wa.me/595982000808?text=${waMsg}`

  // Zona display: barrio + ciudad if available, else zona
  const ubicacion = [p.barrio, p.ciudad ?? p.zona].filter(Boolean).join(", ") || p.zona

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-navy-deep pb-20 md:pb-0">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative w-full border-b border-gold/10" style={{ minHeight: "72vh" }}>

          {/* Imagen de fondo */}
          {coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverUrl}
              alt={p.nombre}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-navy-primary" />
          )}

          {/* Gradientes overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/70 via-transparent to-transparent" />

          {/* Contenido */}
          <div
            className="relative z-10 flex flex-col justify-end px-6 pb-10 md:pb-16"
            style={{ minHeight: "72vh" }}
          >
            <div className="mx-auto w-full max-w-[1100px]">
              <div className="max-w-lg">

                {/* Badges */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {p.estado && (
                    <span className={`rounded-sm px-2.5 py-1 font-sans text-[9px] font-[600] uppercase tracking-[0.15em] backdrop-blur-sm ${ESTADO_CLS[p.estado] ?? ""}`}>
                      {ESTADO_LABEL[p.estado] ?? p.estado}
                    </span>
                  )}
                  {p.badge_analisis && (
                    <span className={`rounded-sm px-2.5 py-1 font-sans text-[9px] font-[700] uppercase tracking-[0.15em] backdrop-blur-sm ${BADGE_CLS[p.badge_analisis] ?? ""}`}>
                      {BADGE_LABEL[p.badge_analisis] ?? p.badge_analisis}
                    </span>
                  )}
                </div>

                {/* Nombre */}
                <h1 className="font-sans text-3xl md:text-5xl font-[200] leading-tight text-kc-white mb-4">
                  {p.nombre}
                </h1>

                {/* Meta */}
                <div className="flex flex-col gap-1.5 mb-6">
                  {ubicacion && (
                    <div className="flex items-center gap-2">
                      <MapPin size={12} strokeWidth={1.5} className="text-gold/60 shrink-0" />
                      <span className="font-sans text-sm font-[300] text-kc-white/70">{ubicacion}</span>
                    </div>
                  )}
                  {p.delivery_date && (
                    <div className="flex items-center gap-2">
                      <CalendarDays size={12} strokeWidth={1.5} className="text-gold/60 shrink-0" />
                      <span className="font-sans text-sm font-[300] text-kc-white/70">
                        Entrega: {formatDelivery(p.delivery_date)}
                      </span>
                    </div>
                  )}
                  {p.desarrolladora && (
                    <div className="flex items-center gap-2">
                      <Building2 size={12} strokeWidth={1.5} className="text-gold/60 shrink-0" />
                      <span className="font-sans text-sm font-[300] text-kc-white/70">{p.desarrolladora}</span>
                    </div>
                  )}
                </div>

                {/* Precio desde */}
                {p.precio_desde != null && (
                  <div className="inline-block border border-gold/30 px-4 py-3 bg-navy-deep/60 backdrop-blur-sm">
                    <span className="block font-sans text-[9px] font-[600] uppercase tracking-[0.3em] text-gold/60 mb-0.5">
                      Precio desde
                    </span>
                    <span className="font-sans text-2xl md:text-3xl font-[300] text-kc-white">
                      {formatUsd(p.precio_desde)}
                    </span>
                  </div>
                )}

              </div>
            </div>
          </div>
        </section>

        {/* ── CONTENIDO PRINCIPAL ──────────────────────────────────────────── */}
        <div className="px-6 py-14">
          <div className="mx-auto max-w-[1100px] flex flex-col space-y-8">

            {/* ── Card: Sobre el proyecto ── */}
            {(p.direccion || p.descripcion || p.caracteristicas || p.maps_url || p.tour_360_url || p.brochure_url) && (
              <div className="bg-[#112a3c] border border-white/8 rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.3)] w-full overflow-hidden">
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-white/8">
                  <SectionLabel text="El proyecto" />
                  <h2 className="font-sans text-xl font-[200] text-kc-white">Sobre el proyecto</h2>
                </div>

                {/* Meta: ubicación, entrega, desarrolladora */}
                {(ubicacion || p.delivery_date || p.desarrolladora || p.direccion) && (
                  <div className="px-6 py-5 flex flex-col gap-2.5 border-b border-white/8">
                    {ubicacion && (
                      <div className="flex items-start gap-2">
                        <MapPin size={13} strokeWidth={1.5} className="text-gold/50 shrink-0 mt-0.5" />
                        <span className="font-sans text-sm font-[300] text-kc-white/60">{ubicacion}</span>
                      </div>
                    )}
                    {p.direccion && (
                      <div className="flex items-start gap-2 pl-[21px]">
                        <span className="font-sans text-xs font-[300] text-kc-white/40">{p.direccion}</span>
                      </div>
                    )}
                    {p.delivery_date && (
                      <div className="flex items-center gap-2">
                        <CalendarDays size={13} strokeWidth={1.5} className="text-gold/50 shrink-0" />
                        <span className="font-sans text-sm font-[300] text-kc-white/60">
                          Entrega: {formatDelivery(p.delivery_date)}
                        </span>
                      </div>
                    )}
                    {p.desarrolladora && (
                      <div className="flex items-center gap-2">
                        <Building2 size={13} strokeWidth={1.5} className="text-gold/50 shrink-0" />
                        <span className="font-sans text-sm font-[300] text-kc-white/60">{p.desarrolladora}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Descripción */}
                {p.descripcion && (
                  <div className={`px-6 py-5 ${p.caracteristicas ? "border-b border-white/8" : ""}`}>
                    <p className="font-sans text-sm font-[300] text-kc-white/70 leading-relaxed whitespace-pre-line">
                      {p.descripcion}
                    </p>
                  </div>
                )}

                {/* Características */}
                {p.caracteristicas && (
                  <div className={`px-6 py-5 ${(p.maps_url || p.tour_360_url || p.brochure_url) ? "border-b border-white/8" : ""}`}>
                    <p className="font-sans text-sm font-[300] text-kc-white/55 leading-relaxed border-l border-gold/20 pl-4 whitespace-pre-line">
                      {p.caracteristicas}
                    </p>
                  </div>
                )}

                {/* Footer: Links */}
                {(p.maps_url || p.tour_360_url || p.brochure_url) && (
                  <div className="px-6 py-4 flex flex-wrap gap-2 bg-white/[0.02]">
                    {p.maps_url && (
                      <a href={p.maps_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-gold/20 text-kc-white/60 hover:border-gold/50 hover:text-kc-white font-sans text-xs font-[400] tracking-wide transition-all rounded-md">
                        <Map size={11} /> Google Maps
                      </a>
                    )}
                    {p.tour_360_url && (
                      <a href={p.tour_360_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-gold/20 text-kc-white/60 hover:border-gold/50 hover:text-kc-white font-sans text-xs font-[400] tracking-wide transition-all rounded-md">
                        <Eye size={11} /> Vista 360°
                      </a>
                    )}
                    {p.brochure_url && (
                      <a href={p.brochure_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-gold/20 text-kc-white/60 hover:border-gold/50 hover:text-kc-white font-sans text-xs font-[400] tracking-wide transition-all rounded-md">
                        <FileText size={11} /> Brochure PDF
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── Card: Tipologías ── */}
            {p.typologies.length > 0 && (
              <div className="bg-[#112a3c] border border-white/8 rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.3)] w-full overflow-hidden">
                <div className="px-6 pt-6 pb-4 border-b border-white/8">
                  <SectionLabel text="Tipologías" />
                  <h2 className="font-sans text-xl font-[200] text-kc-white">Unidades disponibles</h2>
                </div>
                <div className="px-6 py-6">
                  <TypologiasTabs typologies={p.typologies} />
                </div>
              </div>
            )}

            {/* ── Card: Amenities ── */}
            {p.amenities.length > 0 && (
              <div className="bg-[#112a3c] border border-white/8 rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.3)] w-full p-6">
                <AmenitiesSection amenities={p.amenities} />
              </div>
            )}

            {/* ── Card: Mapa ── */}
            {p.lat && p.lng && (
              <div className="bg-[#112a3c] border border-white/8 rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.3)] w-full overflow-hidden">
                <div className="px-6 pt-6 pb-4 border-b border-white/8 flex items-center justify-between">
                  <div>
                    <SectionLabel text="Ubicación" />
                    <h2 className="font-sans text-xl font-[200] text-kc-white">Dónde está</h2>
                  </div>
                  {p.maps_url && (
                    <a href={p.maps_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 font-sans text-[11px] font-[400] text-kc-white/30 hover:text-gold transition-colors">
                      <ExternalLink size={11} /> Google Maps
                    </a>
                  )}
                </div>
                <div className="overflow-hidden" style={{ height: 350 }}>
                  <iframe
                    src={`https://maps.google.com/maps?q=${p.lat},${p.lng}&z=16&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            )}

            {/* ── CTA Final ── */}
            <div className="border border-gold/20 p-6 md:p-10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
              <div>
                <p className="font-sans text-lg font-[200] text-kc-white">¿Te interesa este proyecto?</p>
                <p className="font-sans text-sm font-[300] text-kc-white/50 mt-1">Analizamos la inversión juntos, sin compromiso.</p>
              </div>
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-2 px-8 py-4 bg-gold text-navy-deep font-sans text-xs font-[700] uppercase tracking-[0.2em] hover:bg-gold-light transition-colors">
                <MessageCircle size={14} /> Hablar con un asesor
              </a>
            </div>

          </div>
        </div>

      </main>

      {/* ── STICKY CTA MOBILE ─────────────────────────────────────────────── */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 p-3 bg-navy-deep border-t border-gold/10">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-600 text-white font-sans text-sm font-[600] uppercase tracking-[0.2em] hover:bg-emerald-500 transition-colors"
        >
          <MessageCircle size={15} />
          Consultar por WhatsApp
        </a>
      </div>

      <Footer />
    </>
  )
}
