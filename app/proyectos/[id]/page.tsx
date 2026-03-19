import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AmenitiesSection } from "@/components/amenity-carousel"
import { TypologiasTabs } from "@/components/typologias-tabs"
import { GaleriaSection } from "@/components/galeria-section"
import { getProyectoById } from "@/lib/supabase-projects"
import type { ProjectLink } from "@/lib/supabase-projects"
import {
  MapPin, CalendarDays, Building2, MessageCircle,
  Map, Globe, FileText, Eye, FolderOpen, ExternalLink,
} from "lucide-react"

export const dynamic = "force-dynamic"

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
const TIPO_LABEL: Record<string, string> = {
  residencial: "Residencial",
  comercial:   "Comercial",
  mixto:       "Mixto",
}

function LinkIcon({ type }: { type: string }) {
  switch (type.toLowerCase()) {
    case "maps":     return <Map size={12} />
    case "web":      return <Globe size={12} />
    case "brochure": return <FileText size={12} />
    case "vista360": return <Eye size={12} />
    case "drive":    return <FolderOpen size={12} />
    default:         return <ExternalLink size={12} />
  }
}

function HeroLinks({ links }: { links: ProjectLink[] }) {
  if (!links.length) return null
  return (
    <div className="flex flex-wrap gap-2 border-t border-gold/10 pt-3">
      {links.map((link, i) => (
        <a
          key={i}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 border border-gold/20 text-kc-white/60 hover:border-gold/50 hover:text-kc-white font-sans text-[11px] font-[500] tracking-wide transition-all"
        >
          <LinkIcon type={link.type} />
          {link.name}
        </a>
      ))}
    </div>
  )
}

function SobreElProyecto({ description, caracteristicas }: { description: string | null; caracteristicas: string | null }) {
  if (!description && !caracteristicas) return null
  const bullets = caracteristicas
    ? caracteristicas.split(/\n|(?<=\.) /).map(s => s.trim()).filter(Boolean)
    : []
  return (
    <section className="px-6 pb-10">
      <div className="mx-auto max-w-[1100px] border-t border-gold/10 pt-8">
        <span className="block font-sans text-[10px] font-[600] uppercase tracking-[0.3em] text-gold/60 mb-4">
          Sobre el proyecto
        </span>
        <div className="grid md:grid-cols-2 gap-6">
          {description && (
            <p className="font-sans text-sm font-[300] text-kc-white/70 leading-relaxed">
              {description}
            </p>
          )}
          {bullets.length > 0 && (
            <ul className="flex flex-col gap-1.5">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 font-sans text-xs font-[300] text-kc-white/55 leading-relaxed">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-gold/40 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

export default async function ProyectoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const p = await getProyectoById(id)
  if (!p) notFound()

  const waMsg    = encodeURIComponent(`Hola, me interesa conocer más sobre el proyecto ${p.nombre}`)
  const coverUrl = p.fotos[0] ?? null

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-navy-deep pt-20">

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section className="px-6 pt-6 pb-10">
          <div className="mx-auto max-w-[1100px]">

            <a href="/proyectos"
              className="inline-flex items-center gap-1.5 font-sans text-xs text-kc-white/40 hover:text-gold transition-colors mb-5"
            >
              ← Proyectos
            </a>

            <div className="grid md:grid-cols-[3fr_2fr] gap-6 items-stretch" style={{ maxHeight: "60vh" }}>

              {/* Imagen */}
              <div className="relative overflow-hidden bg-navy-primary min-h-[220px]">
                {coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverUrl} alt={p.nombre} className="w-full h-full object-cover" style={{ maxHeight: "60vh" }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-kc-white/10 min-h-[220px]">
                    <Building2 size={48} strokeWidth={0.5} />
                  </div>
                )}
                <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                  {p.estado && (
                    <span className={`rounded-sm px-2 py-0.5 font-sans text-[9px] font-[600] uppercase tracking-[0.15em] backdrop-blur-sm ${ESTADO_CLS[p.estado] ?? ""}`}>
                      {ESTADO_LABEL[p.estado] ?? p.estado}
                    </span>
                  )}
                  {p.badge_analisis && (
                    <span className={`rounded-sm px-2 py-0.5 font-sans text-[9px] font-[700] uppercase tracking-[0.15em] backdrop-blur-sm ${BADGE_CLS[p.badge_analisis] ?? ""}`}>
                      {BADGE_LABEL[p.badge_analisis] ?? p.badge_analisis}
                    </span>
                  )}
                </div>
              </div>

              {/* Panel info */}
              <div className="flex flex-col gap-3 justify-between py-1 overflow-y-auto">
                <div className="flex flex-col gap-3">

                  {/* Desarrolladora + tipo */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {p.desarrolladora && (
                      <span className="font-sans text-[9px] font-[600] uppercase tracking-[0.25em] text-gold/60">
                        {p.desarrolladora}
                      </span>
                    )}
                    {p.tipo_proyecto && (
                      <span className="px-2 py-0.5 border border-gold/20 font-sans text-[9px] font-[500] uppercase tracking-[0.1em] text-kc-white/50">
                        {TIPO_LABEL[p.tipo_proyecto] ?? p.tipo_proyecto}
                      </span>
                    )}
                  </div>

                  <h1 className="font-sans text-2xl md:text-[1.6rem] font-[200] leading-tight text-kc-white">
                    {p.nombre}
                  </h1>

                  {/* Meta */}
                  <div className="flex flex-col gap-1.5 border-t border-gold/10 pt-2.5">
                    {p.zona && (
                      <div className="flex items-center gap-2">
                        <MapPin size={11} strokeWidth={1.5} className="text-gold/50 shrink-0" />
                        <span className="font-sans text-xs font-[300] text-kc-white/60">{p.zona}</span>
                      </div>
                    )}
                    {p.direccion && (
                      <div className="flex items-center gap-2">
                        <MapPin size={11} strokeWidth={1.5} className="text-gold/25 shrink-0" />
                        <span className="font-sans text-xs font-[300] text-kc-white/40">{p.direccion}</span>
                      </div>
                    )}
                    {p.delivery_date && (
                      <div className="flex items-center gap-2">
                        <CalendarDays size={11} strokeWidth={1.5} className="text-gold/50 shrink-0" />
                        <span className="font-sans text-xs font-[300] text-kc-white/60">
                          Entrega: {new Date(p.delivery_date).toLocaleDateString("es-PY", { year: "numeric", month: "long" })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Descripción */}
                  {p.descripcion && (
                    <p className="font-sans text-[11px] font-[300] text-kc-white/50 leading-relaxed border-t border-gold/10 pt-2.5">
                      {p.descripcion}
                    </p>
                  )}
                </div>

                {/* CTA + Links */}
                <div className="flex flex-col gap-2">
                  <a
                    href={`https://wa.me/595982000808?text=${waMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 text-white font-sans text-xs font-[600] uppercase tracking-[0.2em] hover:bg-emerald-500 transition-colors"
                  >
                    <MessageCircle size={13} />
                    Consultar por WhatsApp
                  </a>
                  <HeroLinks links={p.links} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Sobre el proyecto ─────────────────────────────────────────────── */}
        <SobreElProyecto description={p.descripcion} caracteristicas={p.caracteristicas} />

        {/* ── Tipologías ────────────────────────────────────────────────────── */}
        {p.typologies.length > 0 && (
          <section className="px-6 pb-10">
            <div className="mx-auto max-w-[1100px] border-t border-gold/10 pt-8">
              <div className="mb-5">
                <span className="block font-sans text-[10px] font-[600] uppercase tracking-[0.3em] text-gold/60 mb-1">
                  Tipologías
                </span>
                <h2 className="font-sans text-xl font-[200] text-kc-white">Unidades disponibles</h2>
              </div>
              <TypologiasTabs typologies={p.typologies} />
            </div>
          </section>
        )}

        {/* ── Galería ───────────────────────────────────────────────────────── */}
        {p.fotos.length > 1 && (
          <section className="px-6 pb-10">
            <div className="mx-auto max-w-[1100px] border-t border-gold/10 pt-8">
              <GaleriaSection fotos={p.fotos} />
            </div>
          </section>
        )}

        {/* ── Amenities ─────────────────────────────────────────────────────── */}
        {p.amenities.length > 0 && (
          <section className="px-6 pb-10">
            <div className="mx-auto max-w-[1100px] border-t border-gold/10 pt-8">
              <AmenitiesSection amenities={p.amenities} />
            </div>
          </section>
        )}

        {/* ── CTA final ─────────────────────────────────────────────────────── */}
        <section className="px-6 pb-14">
          <div className="mx-auto max-w-[1100px]">
            <div className="border border-gold/15 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-sans text-base font-[200] text-kc-white">¿Te interesa este proyecto?</p>
                <p className="font-sans text-sm font-[300] text-kc-white/50 mt-0.5">
                  Analizamos la inversión juntos, sin compromiso.
                </p>
              </div>
              <a
                href={`https://wa.me/595982000808?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-gold text-navy-deep font-sans text-xs font-[700] uppercase tracking-[0.2em] hover:bg-gold-light transition-colors"
              >
                <MessageCircle size={13} />
                Hablar con un asesor
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
