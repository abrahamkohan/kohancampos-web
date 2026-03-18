import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getPropiedadById } from "@/lib/supabase-properties"
import { MapPin, Bed, Bath, Maximize2, Car, ArrowLeft, ExternalLink, Check } from "lucide-react"
import { PropertyGallery } from "./gallery-client"
import { ShareButton } from "./share-button"
import { MobileCTA } from "./mobile-cta"

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

// ── Componentes de layout ────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#112a3c] border border-white/8 rounded-2xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.3)] ${className}`}>
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-[11px] font-[600] uppercase tracking-[0.25em] text-white/55 mb-4">
      {children}
    </p>
  )
}

// ── Utils ────────────────────────────────────────────────────────────────────

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

// ── Page ─────────────────────────────────────────────────────────────────────

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
    p.deposito != null && { label: "Depósito", value: p.deposito ? "Sí" : "No" },
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

      {/* CTA fija mobile */}
      <MobileCTA precio={precio} precioM2={precioM2} whatsappUrl={whatsappUrl} />

      <main className="min-h-screen bg-[#0b1d2c] pt-20 pb-28 lg:pb-16">
        <div className="mx-auto max-w-[1140px] px-4 sm:px-5">

          {/* ── Nav row ── */}
          <div className="flex items-center mb-4 pt-4">
            <a
              href="/propiedades"
              className="inline-flex items-center gap-2 font-sans text-xs font-[400] uppercase tracking-[0.15em] text-white/35 hover:text-gold transition-colors"
            >
              <ArrowLeft size={14} /> Propiedades
            </a>
          </div>

          {/* ── Galería ── */}
          <div className="rounded-2xl overflow-hidden">
            <PropertyGallery photos={allPhotos} titulo={titulo} />
          </div>

          {/* ── Contenido principal ── */}
          <div className="mt-5 lg:mt-8 grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-5 lg:gap-12 items-start">

            {/* ════════ Columna izquierda ════════ */}
            <div className="space-y-5 lg:space-y-0">

              {/* ── Hero card (más padding, protagonista) ── */}
              <Card className="p-6">
                {/* Badge operación */}
                <div className="mb-3">
                  <span className="px-2.5 py-1 font-sans text-[9px] font-[600] uppercase tracking-[0.2em] bg-gold/15 text-gold rounded-md">
                    {p.operacion === "venta" ? "En Venta" : "En Alquiler"}
                  </span>
                </div>

                {/* Título — compacto */}
                <h1 className="font-sans text-xl sm:text-2xl lg:text-4xl font-[300] leading-[1.25] text-white mb-1.5">
                  {titulo}
                </h1>

                {/* Subtítulo: tipo · zona */}
                <p className="font-sans text-sm font-[300] text-white/40 mb-4">
                  {TIPO_LABEL[p.tipo] ?? p.tipo}
                  {(p.zona || p.direccion) && (
                    <span> · {[p.zona, p.direccion].filter(Boolean).join(", ")}</span>
                  )}
                </p>

                {/* Fila de datos inline */}
                {chips.length > 0 && (
                  <div className="flex items-center flex-wrap gap-x-3 gap-y-2 py-4 border-t border-white/8">
                    {chips.map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5 font-sans text-sm font-[300] text-white/60">
                        {c.icon === "bed" && <Bed size={13} className="text-gold/50" />}
                        {c.icon === "bath" && <Bath size={13} className="text-gold/50" />}
                        {c.icon === "m2" && <Maximize2 size={13} className="text-gold/50" />}
                        {c.icon === "car" && <Car size={13} className="text-gold/50" />}
                        <span>{c.label}</span>
                        {i < chips.length - 1 && <span className="text-white/20 ml-1.5">·</span>}
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* ── Detalles ── */}
              {detalles.length > 0 && (
                <Card className="lg:mt-6">
                  <SectionLabel>Detalles de la propiedad</SectionLabel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0">
                    {detalles.map(d => (
                      <div key={d.label} className="flex items-center justify-between py-3 border-b border-white/6">
                        <span className="font-sans text-sm font-[400] text-white/45">{d.label}</span>
                        <span className="font-sans text-sm font-[500] text-white/85">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* ── Comodidades ── */}
              {amenities.length > 0 && (
                <Card className="lg:mt-6">
                  <SectionLabel>Comodidades</SectionLabel>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    {amenities.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check size={12} className="text-gold/60 flex-shrink-0 mt-1" />
                        <span className="font-sans text-sm font-[300] text-white/60 leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* ── Descripción ── */}
              {descIntro && (
                <Card className="lg:mt-6">
                  <SectionLabel>Descripción</SectionLabel>
                  <p className="font-sans text-sm font-[300] leading-[1.9] text-white/55 whitespace-pre-line">
                    {descIntro}
                  </p>
                </Card>
              )}

              {/* ── Ubicación + mapa ── */}
              {(p.latitud || p.direccion) && (
                <Card className="lg:mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-gold/50" />
                      <p className="font-sans text-sm font-[300] text-white/60">
                        {[p.zona, p.direccion].filter(Boolean).join(", ")}
                      </p>
                    </div>
                    {mapsUrl && (
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 flex items-center gap-1 font-sans text-[10px] font-[400] text-white/30 hover:text-gold transition-colors"
                      >
                        <ExternalLink size={11} />
                        Google Maps
                      </a>
                    )}
                  </div>

                  {p.latitud && p.longitud && (
                    <div className="overflow-hidden rounded-xl border border-white/8" style={{ height: 200 }}>
                      <iframe
                        src={`https://maps.google.com/maps?q=${p.latitud},${p.longitud}&z=16&output=embed`}
                        className="w-full h-full border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  )}
                </Card>
              )}
            </div>

            {/* ════════ Sidebar sticky (solo desktop) ════════ */}
            <div className="hidden lg:block lg:sticky lg:top-24">

              <div className="relative bg-[#152840] border border-white/10 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.35)]">

                {/* Share icon — esquina superior derecha */}
                <div className="absolute top-4 right-4">
                  <ShareButton titulo={titulo} propertyId={id} />
                </div>

                {/* Empresa */}
                <div className="mb-5 pb-4 border-b border-white/8 pr-8">
                  <p className="font-sans text-[10px] font-[600] uppercase tracking-[0.28em] text-gold/70 mb-0.5">
                    Kohan &amp; Campos
                  </p>
                  <p className="font-sans text-xs font-[300] text-white/35 tracking-[0.1em]">Real Estate · Paraguay</p>
                </div>

                {/* Precio */}
                {precio && (
                  <div className="mb-6">
                    <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/30 mb-1.5">Precio</p>
                    <p className="font-sans text-xl font-[300] text-white leading-tight">{precio}</p>
                    {precioM2 && (
                      <p className="font-sans text-xs text-white/25 mt-1">{precioM2}</p>
                    )}
                  </div>
                )}

                {/* CTA WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gold py-3.5 text-center font-sans text-[10px] font-[600] uppercase tracking-[0.22em] text-navy-deep rounded-lg transition-opacity hover:opacity-90"
                >
                  Consultar por WhatsApp
                </a>

              </div>

            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
