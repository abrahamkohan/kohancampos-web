"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, MapPin, Bed, Bath, Maximize2, Car, Check, ExternalLink } from "lucide-react"
import type { PropiedadDetalle } from "@/lib/supabase-properties"

const TIPO_LABEL: Record<string, string> = {
  departamento: "Departamento", casa: "Casa", terreno: "Terreno", comercial: "Comercial",
}
const CONDICION_LABEL: Record<string, string> = {
  nuevo: "Nuevo", usado: "Usado", reventa: "Reventa",
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

interface Props {
  property: PropiedadDetalle | null
  isLoading: boolean
  onClose: () => void
}

export function PropertyModal({ property, isLoading, onClose }: Props) {
  const [photoIndex, setPhotoIndex] = useState(0)

  useEffect(() => { setPhotoIndex(0) }, [property?.id])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose])
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  const allPhotos = property
    ? property.fotos.length > 0 ? property.fotos
      : property.foto_portada ? [`${supabaseUrl}/storage/v1/object/public/property-photos/${property.foto_portada}`] : []
    : []

  const titulo = property
    ? property.titulo ?? (TIPO_LABEL[property.tipo] ?? property.tipo) + " en " + (property.zona ?? "Sin ubicación")
    : ""
  const precio = property?.precio != null
    ? (property.moneda === "usd" ? "USD" : "PYG") + " " + property.precio.toLocaleString("es-PY")
    : null
  const whatsappUrl = `https://wa.me/595982000808?text=${encodeURIComponent("Hola, me interesa: " + titulo)}`
  const mapsUrl = property?.latitud && property?.longitud
    ? `https://www.google.com/maps?q=${property.latitud},${property.longitud}`
    : property?.direccion ? `https://www.google.com/maps/search/${encodeURIComponent(property.direccion)}` : null

  function prev(e: React.MouseEvent) { e.stopPropagation(); setPhotoIndex(i => (i === 0 ? allPhotos.length - 1 : i - 1)) }
  function next(e: React.MouseEvent) { e.stopPropagation(); setPhotoIndex(i => (i === allPhotos.length - 1 ? 0 : i + 1)) }

  const chips = property ? [
    property.dormitorios != null && { icon: "bed", label: property.dormitorios === 0 ? "Monoambiente" : property.dormitorios + " dorm." },
    property.banos != null && { icon: "bath", label: property.banos + " baño" + (property.banos !== 1 ? "s" : "") },
    property.superficie_m2 != null && { icon: "m2", label: property.superficie_m2 + " m²" },
    property.garajes != null && property.garajes > 0 && { icon: "car", label: property.garajes + " garage" + (property.garajes !== 1 ? "s" : "") },
  ].filter(Boolean) as { icon: string; label: string }[] : []

  const detalles = property ? [
    property.condicion && { label: "Condición", value: CONDICION_LABEL[property.condicion] ?? property.condicion },
    property.piso != null && { label: "Piso", value: String(property.piso) },
    property.superficie_cubierta_m2 != null && { label: "Sup. cubierta", value: property.superficie_cubierta_m2 + " m²" },
    property.terreno_m2 != null && { label: "Terreno", value: property.terreno_m2 + " m²" },
  ].filter(Boolean) as { label: string; value: string }[] : []

  const { intro: descIntro, bullets: amenities } = property?.descripcion
    ? parseBullets(property.descripcion)
    : { intro: "", bullets: [] }

  function ChipIcon({ icon }: { icon: string }) {
    if (icon === "bed") return <Bed className="w-4 h-4 text-[#C9B99A]/50" />
    if (icon === "bath") return <Bath className="w-4 h-4 text-[#C9B99A]/50" />
    if (icon === "m2") return <Maximize2 className="w-4 h-4 text-[#C9B99A]/50" />
    if (icon === "car") return <Car className="w-4 h-4 text-[#C9B99A]/50" />
    return null
  }

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full h-[96vh] md:h-auto md:max-h-[90vh] md:max-w-[1060px] rounded-t-2xl md:rounded-2xl overflow-hidden flex flex-col"
        style={{ background: "#0B1C2C" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors text-white/80 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ══════════════════════════════════════════════
            SCROLLABLE CONTENT
        ══════════════════════════════════════════════ */}
        <div className="overflow-y-auto flex-1">

          {isLoading && (
            <div className="flex items-center justify-center h-72">
              <div className="w-7 h-7 border-2 border-white/10 border-t-white/50 rounded-full animate-spin" />
            </div>
          )}

          {!isLoading && property && (
            <>
              {/* ── HERO (mobile) ── */}
              {allPhotos.length > 0 && (
                <div className="md:hidden relative overflow-hidden" style={{ height: 260 }}>
                  <Image src={allPhotos[photoIndex]} alt={titulo} fill className="object-cover" sizes="100vw" priority />
                  {/* Gradient overlay bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2C] via-[#0B1C2C]/20 to-transparent" />
                  {/* Badges on image */}
                  <div className="absolute top-4 left-4 flex gap-2 z-10">
                    <span className="px-2.5 py-1 font-sans text-[10px] font-[600] uppercase tracking-[0.15em]" style={{ background: "#C9B99A", color: "#0B1C2C", borderRadius: 3 }}>
                      {property.operacion === "venta" ? "En Venta" : "En Alquiler"}
                    </span>
                    <span className="px-2.5 py-1 font-sans text-[10px] font-[600] uppercase tracking-[0.15em] text-white/70 bg-black/40 backdrop-blur-sm" style={{ borderRadius: 3 }}>
                      {TIPO_LABEL[property.tipo] ?? property.tipo}
                    </span>
                  </div>
                  {/* Carousel arrows */}
                  {allPhotos.length > 1 && (
                    <>
                      <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <span className="absolute bottom-4 right-4 text-[11px] text-white/50 font-sans">{photoIndex + 1}/{allPhotos.length}</span>
                    </>
                  )}
                </div>
              )}

              {/* ── GALERÍA DESKTOP: mosaic ── */}
              {allPhotos.length > 0 && (
                <div className="hidden md:grid gap-1 rounded-t-2xl overflow-hidden" style={{ height: 320, gridTemplateColumns: allPhotos.length > 1 ? "1fr 180px" : "1fr" }}>
                  <div className="relative overflow-hidden">
                    <Image src={allPhotos[0]} alt={titulo} fill className="object-cover" sizes="800px" priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2C]/50 via-transparent to-transparent" />
                  </div>
                  {allPhotos.length > 1 && (
                    <div className="grid gap-1" style={{ gridTemplateRows: allPhotos.length > 2 ? "1fr 1fr" : "1fr" }}>
                      {allPhotos.slice(1, 3).map((url, i) => (
                        <div key={i} className="relative overflow-hidden">
                          <Image src={url} alt="" fill className="object-cover" sizes="180px" />
                          {i === 1 && allPhotos.length > 3 && (
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                              <span className="text-white font-sans text-xl font-[200]">+{allPhotos.length - 3}</span>
                              <span className="text-white/50 font-sans text-[10px] uppercase tracking-[0.15em]">fotos</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── HEADER MOBILE: título + chips ── */}
              <div className="md:hidden px-4 pt-4 pb-3">
                <h2 className="font-sans text-xl font-[200] leading-snug text-white mb-1">{titulo}</h2>
                {(property.zona || property.direccion) && (
                  <p className="flex items-center gap-1.5 font-sans text-xs font-[300] text-white/40 mb-4">
                    <MapPin className="w-3 h-3 text-[#C9B99A]/50 flex-shrink-0" />
                    {[property.zona, property.direccion].filter(Boolean).join(", ")}
                  </p>
                )}
                {chips.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {chips.map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5 px-3 py-2 font-sans text-sm font-[300] text-white/70 border border-white/10" style={{ background: "#11263A", borderRadius: 8 }}>
                        <ChipIcon icon={c.icon} />
                        {c.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── PRECIO + CTA (mobile-only, inmediato) — HIDDEN: sticky bottom lo reemplaza ── */}
              {precio && (
                <div className="hidden mx-4 mb-6 p-4 border border-white/10 flex items-center gap-4" style={{ background: "#11263A", borderRadius: 14 }}>
                  <div className="flex-1">
                    <p className="font-sans text-[10px] font-[300] text-[#C9B99A]/60 uppercase tracking-wider mb-0.5">Precio</p>
                    <p className="font-sans text-2xl font-[200] text-white leading-none">{precio}</p>
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-6 font-sans text-[11px] font-[600] uppercase tracking-[0.15em] flex-shrink-0"
                    style={{ background: "#C9B99A", color: "#0B1C2C", borderRadius: 8, height: 52 }}
                  >
                    Consultar
                  </a>
                </div>
              )}

              {/* ── DIVISOR ── */}
              <div className="mx-4 md:mx-8 border-t border-white/8" />

              {/* ── HEADER DESKTOP: badges + título + chips ── */}
              <div className="hidden md:block px-8 pt-7 pb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 font-sans text-[10px] font-[600] uppercase tracking-[0.2em]" style={{ background: "#C9B99A", color: "#0B1C2C", borderRadius: 4 }}>
                    {property.operacion === "venta" ? "En Venta" : "En Alquiler"}
                  </span>
                  <span className="px-3 py-1 font-sans text-[10px] font-[600] uppercase tracking-[0.2em] text-white/50 border border-white/15" style={{ borderRadius: 4 }}>
                    {TIPO_LABEL[property.tipo] ?? property.tipo}
                  </span>
                </div>
                <h2 className="font-sans text-[28px] font-[200] leading-tight text-white mb-2">{titulo}</h2>
                {(property.zona || property.direccion) && (
                  <p className="flex items-center gap-1.5 font-sans text-sm font-[300] text-white/40 mb-5">
                    <MapPin className="w-3.5 h-3.5 text-[#C9B99A]/50 flex-shrink-0" />
                    {[property.zona, property.direccion].filter(Boolean).join(", ")}
                  </p>
                )}
                {chips.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {chips.map((c, i) => (
                      <div key={i} className="flex items-center gap-2 px-4 py-2.5 font-sans text-sm font-[300] text-white/70 border border-white/10" style={{ background: "#11263A", borderRadius: 10 }}>
                        <ChipIcon icon={c.icon} />
                        {c.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── DIVISOR DESKTOP ── */}
              <div className="hidden md:block mx-8 border-t border-white/8" />

              {/* ── CONTENIDO PRINCIPAL ── */}
              <div className="px-4 md:px-8 py-6 pb-6 md:pb-10 flex flex-col md:flex-row gap-6 md:gap-8">

                {/* Columna izquierda */}
                <div className="flex-1 flex flex-col gap-7 min-w-0">

                  {descIntro && (
                    <div>
                      <p className="font-sans text-[10px] font-[600] uppercase tracking-[0.25em] text-[#C9B99A]/50 mb-4">Descripción</p>
                      <p className="font-sans text-sm font-[300] leading-7 text-white/60 whitespace-pre-line">{descIntro}</p>
                    </div>
                  )}

                  {amenities.length > 0 && (
                    <div>
                      <p className="font-sans text-[10px] font-[600] uppercase tracking-[0.25em] text-[#C9B99A]/50 mb-4">Comodidades</p>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                        {amenities.map((item, i) => (
                          <div key={i} className="flex items-center gap-2.5">
                            <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#C9B99A20" }}>
                              <Check className="w-2.5 h-2.5 text-[#C9B99A]" />
                            </div>
                            <span className="font-sans text-sm font-[300] text-white/60">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {detalles.length > 0 && (
                    <div>
                      <p className="font-sans text-[10px] font-[600] uppercase tracking-[0.25em] text-[#C9B99A]/50 mb-4">Detalles</p>
                      <div className="grid grid-cols-2 gap-2">
                        {detalles.map(d => (
                          <div key={d.label} className="flex items-center justify-between px-4 py-3 border border-white/8" style={{ background: "#11263A", borderRadius: 10 }}>
                            <span className="font-sans text-xs font-[300] text-white/40">{d.label}</span>
                            <span className="font-sans text-xs font-[400] text-white/80">{d.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(property.latitud || property.direccion) && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <p className="font-sans text-[10px] font-[600] uppercase tracking-[0.25em] text-[#C9B99A]/50">Ubicación</p>
                        {mapsUrl && (
                          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-sans text-xs font-[300] text-white/40 hover:text-[#C9B99A] transition-colors">
                            <ExternalLink className="w-3 h-3" /> Abrir en Google Maps
                          </a>
                        )}
                      </div>
                      {(property.zona || property.direccion) && (
                        <p className="flex items-center gap-1.5 font-sans text-sm font-[300] text-white/50 mb-3">
                          <MapPin className="w-3.5 h-3.5 text-[#C9B99A]/50 flex-shrink-0" />
                          {[property.zona, property.direccion].filter(Boolean).join(", ")}
                        </p>
                      )}
                      {property.latitud && property.longitud && (
                        <div className="overflow-hidden border border-white/10" style={{ borderRadius: 12, height: 200 }}>
                          <iframe
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.longitud - 0.008},${property.latitud - 0.008},${property.longitud + 0.008},${property.latitud + 0.008}&layer=mapnik&marker=${property.latitud},${property.longitud}`}
                            className="w-full h-full border-0"
                            loading="lazy"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Columna derecha — precio desktop */}
                <div className="hidden md:block w-64 flex-shrink-0">
                  <div className="p-6 border border-white/10 sticky top-6" style={{ background: "#11263A", borderRadius: 16 }}>
                    <p className="font-sans text-[10px] font-[600] uppercase tracking-[0.25em] text-[#C9B99A]/50 mb-2">Precio</p>
                    <p className="font-sans text-3xl font-[200] text-white mb-8 leading-none tracking-tight">{precio ?? "Consultar"}</p>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full font-sans text-[11px] font-[600] uppercase tracking-[0.2em] transition-all hover:opacity-90"
                      style={{ background: "#C9B99A", color: "#0B1C2C", borderRadius: 8, height: 48 }}
                    >
                      Consultar
                    </a>
                  </div>
                </div>

              </div>
            </>
          )}
        </div>

        {/* ── STICKY CTA MOBILE (scroll) ── */}
        {!isLoading && property && (
          <div
            className="md:hidden flex items-center gap-4 px-4 py-3 border-t border-white/10 flex-shrink-0"
            style={{ background: "#0a1929" }}
          >
            <div className="flex-1">
              <p className="font-sans text-[10px] text-white/30 uppercase tracking-wider mb-0.5">Precio</p>
              <p className="font-sans text-base font-[200] text-white leading-none">{precio ?? "Consultar"}</p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-6 font-sans text-[11px] font-[600] uppercase tracking-[0.15em]"
              style={{ background: "#C9B99A", color: "#0B1C2C", borderRadius: 8, height: 48 }}
            >
              Consultar
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
