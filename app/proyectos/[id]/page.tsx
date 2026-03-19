import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AmenitiesSection } from "@/components/amenity-carousel"
import { TypologiasTabs } from "@/components/typologias-tabs"
import { GaleriaSection } from "@/components/galeria-section"
import { LinksSection } from "@/components/links-section"
import { getProyectoById } from "@/lib/supabase-projects"
import { MapPin, CalendarDays, Building2, MessageCircle } from "lucide-react"

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

export default async function ProyectoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const p = await getProyectoById(id)
  if (!p) notFound()

  const waMsg   = encodeURIComponent(`Hola, me interesa conocer más sobre el proyecto ${p.nombre}`)
  const coverUrl = p.fotos[0] ?? null

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-navy-deep pt-20">

        {/* ── HERO — 50/50, max 60vh ─────────────────────────────────────────── */}
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

              {/* Info panel */}
              <div className="flex flex-col gap-4 justify-between py-1">
                <div className="flex flex-col gap-3">
                  {p.desarrolladora && (
                    <span className="font-sans text-[9px] font-[600] uppercase tracking-[0.25em] text-gold/60">
                      {p.desarrolladora}
                    </span>
                  )}
                  <h1 className="font-sans text-2xl md:text-3xl font-[200] leading-tight text-kc-white">
                    {p.nombre}
                  </h1>

                  <div className="flex flex-col gap-1.5 border-t border-gold/10 pt-3">
                    {p.zona && (
                      <div className="flex items-center gap-2">
                        <MapPin size={12} strokeWidth={1.5} className="text-gold/50 shrink-0" />
                        <span className="font-sans text-xs font-[300] text-kc-white/60">{p.zona}</span>
                      </div>
                    )}
                    {p.direccion && (
                      <div className="flex items-center gap-2">
                        <MapPin size={12} strokeWidth={1.5} className="text-gold/30 shrink-0" />
                        <span className="font-sans text-xs font-[300] text-kc-white/40">{p.direccion}</span>
                      </div>
                    )}
                    {p.delivery_date && (
                      <div className="flex items-center gap-2">
                        <CalendarDays size={12} strokeWidth={1.5} className="text-gold/50 shrink-0" />
                        <span className="font-sans text-xs font-[300] text-kc-white/60">
                          Entrega: {new Date(p.delivery_date).toLocaleDateString("es-PY", { year: "numeric", month: "long" })}
                        </span>
                      </div>
                    )}
                  </div>

                  {p.descripcion && (
                    <p className="font-sans text-xs font-[300] text-kc-white/50 leading-relaxed line-clamp-3 border-t border-gold/10 pt-3">
                      {p.descripcion}
                    </p>
                  )}
                </div>

                <a
                  href={`https://wa.me/595982000808?text=${waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 text-white font-sans text-xs font-[600] uppercase tracking-[0.2em] hover:bg-emerald-500 transition-colors"
                >
                  <MessageCircle size={13} />
                  Consultar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Características ───────────────────────────────────────────────── */}
        {p.caracteristicas && (
          <section className="px-6 pb-10">
            <div className="mx-auto max-w-[1100px] border-t border-gold/10 pt-8">
              <p className="font-sans text-sm font-[300] text-kc-white/50 leading-relaxed max-w-2xl">
                {p.caracteristicas}
              </p>
            </div>
          </section>
        )}

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

        {/* ── Links ─────────────────────────────────────────────────────────── */}
        {p.links.length > 0 && (
          <section className="px-6 pb-10">
            <div className="mx-auto max-w-[1100px] border-t border-gold/10 pt-8">
              <LinksSection links={p.links} />
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
