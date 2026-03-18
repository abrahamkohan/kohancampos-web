import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getPropiedadById } from "@/lib/supabase-properties"
import { MapPin, Bed, Bath, Maximize2, Car, ArrowLeft, ExternalLink, Check } from "lucide-react"
import { PropertyGallery } from "./gallery-client"
import { ShareButton } from "./share-button"

export const dynamic = "force-dynamic"

const TIPO_LABEL: Record<string, string> = {
  departamento: "Departamento", casa: "Casa", terreno: "Terreno", comercial: "Comercial",
}
const CONDICION_LABEL: Record<string, string> = {
  nuevo: "Nuevo", usado: "Usado", reventa: "Reventa",
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const p = await getPropiedadById(id)
  if (!p) return { title: "Propiedad — Kohan & Campos" }
  const titulo = p.titulo ?? `${TIPO_LABEL[p.tipo] ?? p.tipo} en ${p.zona ?? "Paraguay"}`
  return {
    title: `${titulo} — Kohan & Campos`,
    description: p.descripcion?.slice(0, 160) ?? "Propiedad en Paraguay — Kohan & Campos Real Estate.",
    openGraph: {
      title: titulo,
      images: p.fotos[0] ? [{ url: p.fotos[0] }] : [],
    },
  }
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 mb-4">
      <h2 className="font-sans text-xs font-[600] uppercase tracking-[0.2em] text-kc-white/50 mb-3">
        {children}
      </h2>
      <hr className="border-gold/25" />
    </div>
  )
}

function parseBullets(text: string): { intro: string; bullets: string[] } {
  const lines = text.split("\n")
  const bullets: string[] = []
  const intro: string[] = []
  for (const line of lines) {
    const t = line.trim()
    if (/^[•\-\*]/.test(t)) bullets.push(t.replace(/^[•\-\*]\s*/, ""))
    else if (t) intro.push(t)
  }
  return { intro: intro.join("\n"), bullets }
}

export default async function PropiedadDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const p = await getPropiedadById(id)
  if (!p) notFound()

  const titulo = p.titulo ?? (TIPO_LABEL[p.tipo] ?? p.tipo) + " en " + (p.zona ?? "Sin ubicación")

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  const portadaUrl = p.foto_portada
    ? `${supabaseUrl}/storage/v1/object/public/property-photos/${p.foto_portada}`
    : p.fotos[0] ?? null
  const allPhotos = p.fotos.length > 0 ? p.fotos : portadaUrl ? [portadaUrl] : []

  const precio = p.precio != null
    ? (p.moneda === "usd" ? "USD" : "PYG") + " " + p.precio.toLocaleString("es-PY")
    : null
  const precioM2 = p.precio && p.superficie_m2
    ? (p.moneda === "usd" ? "USD" : "PYG") + " " + Math.round(p.precio / p.superficie_m2).toLocaleString("es-PY") + "/m²"
    : null

  const chips = [
    p.dormitorios != null && { icon: "bed", label: p.dormitorios === 0 ? "Monoambiente" : p.dormitorios + " dorm." },
    p.banos != null && { icon: "bath", label: p.banos + " baño" + (p.banos !== 1 ? "s" : "") },
    p.superficie_m2 != null && { icon: "m2", label: p.superficie_m2 + " m²" },
    p.garajes != null && p.garajes > 0 && { icon: "car", label: p.garajes + " garage" + (p.garajes !== 1 ? "s" : "") },
  ].filter(Boolean) as { icon: string; label: string }[]

  const detalles = [
    p.condicion && { label: "Condición", value: CONDICION_LABEL[p.condicion] ?? p.condicion },
    p.zona && { label: "Zona", value: p.zona },
    p.piso != null && { label: "Piso", value: String(p.piso) },
    p.superficie_cubierta_m2 != null && { label: "Sup. cubierta", value: p.superficie_cubierta_m2 + " m²" },
    p.terreno_m2 != null && { label: "Terreno", value: p.terreno_m2 + " m²" },
  ].filter(Boolean) as { label: string; value: string }[]

  const { intro: descIntro, bullets: amenities } = p.descripcion
    ? parseBullets(p.descripcion)
    : { intro: "", bullets: [] }

  const whatsappUrl = "https://wa.me/595982000808?text=" + encodeURIComponent("Hola, me interesa: " + titulo)
  const mapsUrl = p.latitud && p.longitud
    ? `https://www.google.com/maps?q=${p.latitud},${p.longitud}`
    : p.direccion ? `https://www.google.com/maps/search/${encodeURIComponent(p.direccion)}` : null

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-navy-deep pt-20 pb-16">
        <div className="mx-auto max-w-[1140px] px-4 sm:px-6">

          {/* ── Nav row ── */}
          <div className="flex items-center justify-between mb-5 pt-4">
            <a
              href="/propiedades"
              className="inline-flex items-center gap-2 font-sans text-xs font-[400] uppercase tracking-[0.15em] text-kc-white/40 hover:text-gold transition-colors"
            >
              <ArrowLeft size={14} /> Propiedades
            </a>
            <ShareButton titulo={titulo} propertyId={id} />
          </div>

          {/* ── Galería ── */}
          <PropertyGallery photos={allPhotos} titulo={titulo} />

          {/* ── 2 columnas ── */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-8 lg:gap-12 items-start">

            {/* ════════ Columna izquierda ════════ */}
            <div>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 font-sans text-[10px] font-[600] uppercase tracking-[0.15em] bg-gold/15 text-gold">
                  {p.operacion === "venta" ? "En Venta" : "En Alquiler"}
                </span>
                <span className="px-3 py-1 font-sans text-[10px] font-[600] uppercase tracking-[0.15em] border border-gold/20 text-kc-white/50">
                  {TIPO_LABEL[p.tipo] ?? p.tipo}
                </span>
              </div>

              {/* Título */}
              <h1 className="font-sans text-3xl font-[200] leading-snug text-kc-white mb-2">
                {titulo}
              </h1>

              {/* Ubicación */}
              {(p.zona || p.direccion) && (
                <p className="flex items-center gap-1.5 font-sans text-sm font-[300] text-kc-white/45 mb-4">
                  <MapPin size={14} className="text-gold/50 flex-shrink-0" />
                  {[p.zona, p.direccion].filter(Boolean).join(", ")}
                </p>
              )}

              {/* Chips */}
              {chips.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {chips.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 border border-gold/15 px-3 py-2 font-sans text-sm font-[300] text-kc-white/65"
                    >
                      {c.icon === "bed" && <Bed size={14} className="text-gold/50" />}
                      {c.icon === "bath" && <Bath size={14} className="text-gold/50" />}
                      {c.icon === "m2" && <Maximize2 size={14} className="text-gold/50" />}
                      {c.icon === "car" && <Car size={14} className="text-gold/50" />}
                      {c.label}
                    </div>
                  ))}
                </div>
              )}

              {/* Precio (compacto, en columna izquierda) */}
              {precio && (
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-sans text-2xl font-[300] text-kc-white">{precio}</span>
                  {precioM2 && (
                    <span className="font-sans text-sm font-[300] text-kc-white/35">{precioM2}</span>
                  )}
                </div>
              )}

              {/* ── Detalles ── */}
              {detalles.length > 0 && (
                <section>
                  <SectionHeader>Detalles de la propiedad</SectionHeader>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                    {detalles.map(d => (
                      <div key={d.label} className="flex items-center justify-between py-2 border-b border-gold/15">
                        <span className="font-sans text-sm font-[300] text-kc-white/40">{d.label}</span>
                        <span className="font-sans text-sm font-[400] text-kc-white/80">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ── Comodidades ── */}
              {amenities.length > 0 && (
                <section>
                  <SectionHeader>Comodidades de la propiedad</SectionHeader>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
                    {amenities.map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <Check size={14} className="text-gold/60 flex-shrink-0" />
                        <span className="font-sans text-sm font-[300] text-kc-white/65">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ── Descripción ── */}
              {descIntro && (
                <section>
                  <SectionHeader>Descripción</SectionHeader>
                  <p className="font-sans text-sm font-[300] leading-[1.9] text-kc-white/65 whitespace-pre-line">
                    {descIntro}
                  </p>
                </section>
              )}

              {/* ── Ubicación + mapa ── */}
              {(p.latitud || p.direccion) && (
                <section>
                  <div className="mt-8 mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gold/50" />
                      <span className="font-sans text-xs font-[600] uppercase tracking-[0.2em] text-kc-white/50">
                        {p.zona ?? p.direccion ?? "Ubicación"}
                      </span>
                    </div>
                    {mapsUrl && (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 font-sans text-xs font-[300] text-kc-white/35 hover:text-gold transition-colors"
                      >
                        <ExternalLink size={12} />
                        Abrir en Google Maps
                      </a>
                    )}
                  </div>
                  <hr className="border-gold/25 mb-4" />
                  {p.latitud && p.longitud && (
                    <div className="overflow-hidden border border-gold/25 rounded-lg" style={{ height: 280 }}>
                      <iframe
                        src={`https://maps.google.com/maps?q=${p.latitud},${p.longitud}&z=16&output=embed`}
                        className="w-full h-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  )}
                </section>
              )}
            </div>

            {/* ════════ Sidebar sticky ════════ */}
            <div className="lg:sticky lg:top-24">
              <div className="border border-gold/15 p-6 bg-navy-light/30">
                {/* Empresa */}
                <div className="mb-5 pb-5 border-b border-gold/25">
                  <p className="font-sans text-[10px] font-[600] uppercase tracking-[0.25em] text-gold/70 mb-0.5">
                    Kohan &amp; Campos
                  </p>
                  <p className="font-sans text-sm font-[200] text-kc-white/60">Real Estate</p>
                </div>

                {/* Precio resumido */}
                {precio && (
                  <div className="mb-5">
                    <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-kc-white/30 mb-1">Precio</p>
                    <p className="font-sans text-lg font-[300] text-kc-white leading-none">{precio}</p>
                    {precioM2 && (
                      <p className="font-sans text-xs text-kc-white/30 mt-0.5">{precioM2}</p>
                    )}
                  </div>
                )}

                {/* CTA WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gold py-3 text-center font-sans text-[10px] font-[600] uppercase tracking-[0.2em] text-navy-deep transition-all hover:bg-gold-light mb-3"
                >
                  Consultar por WhatsApp
                </a>

                {/* Teléfono */}
                <p className="font-sans text-sm font-[300] text-kc-white/40 text-center mb-4">
                  +595 982 000 808
                </p>

                {/* Compartir */}
                <div className="border-t border-gold/25 pt-4">
                  <ShareButton titulo={titulo} propertyId={id} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
