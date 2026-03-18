"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { X, MapPin, Bed, Bath, Maximize2, Car, Check, ExternalLink, Share2, ChevronLeft, ChevronRight } from "lucide-react"
import type { PropiedadDetalle } from "@/lib/supabase-properties"

const TIPO_LABEL: Record<string, string> = {
  departamento: "Departamento", casa: "Casa", terreno: "Terreno", comercial: "Comercial",
}
const CONDICION_LABEL: Record<string, string> = {
  nuevo: "Nuevo", usado: "Usado", reventa: "Reventa",
}

const BG_MAIN = "#0f2233"
const BG_CARD = "rgba(255,255,255,0.04)"
const BG_CHIP = "rgba(255,255,255,0.06)"
const GOLD = "#C9B99A"
const DIVIDER = "rgba(255,255,255,0.08)"

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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-[10px] font-[600] uppercase tracking-[0.28em] mb-3" style={{ color: `${GOLD}99` }}>
      {children}
    </p>
  )
}

function Divider() {
  return <div style={{ borderTop: `1px solid ${DIVIDER}`, margin: "22px 0" }} />
}

interface Props {
  property: PropiedadDetalle | null
  isLoading: boolean
  propertyId: string | null
  onClose: () => void
}

export function PropertyModal({ property, isLoading, propertyId, onClose }: Props) {
  const [photoIndex, setPhotoIndex] = useState(0)
  const [shareMsg, setShareMsg] = useState("")

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

  function handleShare() {
    const url = `${window.location.origin}/propiedades/${propertyId}`
    if (navigator.share) {
      navigator.share({ title: titulo || "Propiedad — Kohan & Campos", url })
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setShareMsg("Link copiado")
        setTimeout(() => setShareMsg(""), 2000)
      })
    }
  }

  function prev(e: React.MouseEvent) {
    e.stopPropagation()
    setPhotoIndex(i => i === 0 ? allPhotos.length - 1 : i - 1)
  }
  function next(e: React.MouseEvent) {
    e.stopPropagation()
    setPhotoIndex(i => i === allPhotos.length - 1 ? 0 : i + 1)
  }

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
    if (icon === "bed") return <Bed className="w-4 h-4" style={{ color: `${GOLD}80` }} />
    if (icon === "bath") return <Bath className="w-4 h-4" style={{ color: `${GOLD}80` }} />
    if (icon === "m2") return <Maximize2 className="w-4 h-4" style={{ color: `${GOLD}80` }} />
    if (icon === "car") return <Car className="w-4 h-4" style={{ color: `${GOLD}80` }} />
    return null
  }

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full h-[96vh] md:h-auto md:max-h-[92vh] md:max-w-[920px] rounded-t-2xl md:rounded-2xl overflow-hidden flex flex-col"
        style={{ background: BG_MAIN }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Close + Share ── */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          {propertyId && (
            <button
              onClick={handleShare}
              className="relative w-9 h-9 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors text-white/70 hover:text-white"
              title="Compartir propiedad"
            >
              <Share2 className="w-4 h-4" />
              {shareMsg && (
                <span className="absolute -bottom-9 right-0 whitespace-nowrap px-2 py-1 font-sans text-[10px]"
                  style={{ background: BG_MAIN, border: `1px solid ${GOLD}40`, color: GOLD, borderRadius: 4 }}>
                  {shareMsg}
                </span>
              )}
            </button>
          )}
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 transition-colors text-white/70 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── SCROLLABLE ── */}
        <div className="overflow-y-auto flex-1">

          {isLoading && (
            <div className="flex items-center justify-center h-72">
              <div className="w-7 h-7 border-2 border-white/10 border-t-white/50 rounded-full animate-spin" />
            </div>
          )}

          {!isLoading && property && (
            <>
              {/* ════════ MOBILE ════════ */}

              {/* Hero mobile */}
              {allPhotos.length > 0 && (
                <div className="md:hidden relative overflow-hidden" style={{ height: 260 }}>
                  <Image src={allPhotos[photoIndex]} alt={titulo} fill className="object-cover" sizes="100vw" priority />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f2233] via-[#0f2233]/20 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2 z-10">
                    <span className="px-2.5 py-1 font-sans text-[10px] font-[600] uppercase tracking-[0.15em]"
                      style={{ background: GOLD, color: BG_MAIN, borderRadius: 3 }}>
                      {property.operacion === "venta" ? "En Venta" : "En Alquiler"}
                    </span>
                    <span className="px-2.5 py-1 font-sans text-[10px] font-[600] uppercase tracking-[0.15em] text-white/70 bg-black/40 backdrop-blur-sm"
                      style={{ borderRadius: 3 }}>
                      {TIPO_LABEL[property.tipo] ?? property.tipo}
                    </span>
                  </div>
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

              {/* Header mobile */}
              <div className="md:hidden px-4 pt-4 pb-3">
                <h2 className="font-sans text-xl font-[200] leading-snug text-white mb-1">{titulo}</h2>
                {(property.zona || property.direccion) && (
                  <p className="flex items-center gap-1.5 font-sans text-xs font-[300] text-white/40 mb-4">
                    <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: `${GOLD}60` }} />
                    {[property.zona, property.direccion].filter(Boolean).join(", ")}
                  </p>
                )}
                {chips.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {chips.map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5 px-3 py-2 font-sans text-sm font-[300] text-white/70 border border-white/10"
                        style={{ background: BG_CHIP, borderRadius: 8 }}>
                        <ChipIcon icon={c.icon} />
                        {c.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Contenido mobile */}
              <div className="md:hidden px-4 pb-6 flex flex-col gap-6">
                {descIntro && (
                  <div>
                    <SectionLabel>Descripción</SectionLabel>
                    <p className="font-sans text-sm font-[300] leading-7 text-white/65 whitespace-pre-line">{descIntro}</p>
                  </div>
                )}
                {amenities.length > 0 && (
                  <div>
                    <SectionLabel>Comodidades</SectionLabel>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                      {amenities.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${GOLD}18` }}>
                            <Check className="w-2.5 h-2.5" style={{ color: GOLD }} />
                          </div>
                          <span className="font-sans text-sm font-[300] text-white/65">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {(property.latitud || property.direccion) && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <SectionLabel>Ubicación</SectionLabel>
                      {mapsUrl && (
                        <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 font-sans text-xs font-[300] text-white/40 hover:text-white/70 transition-colors">
                          <ExternalLink className="w-3 h-3" /> Google Maps
                        </a>
                      )}
                    </div>
                    {property.latitud && property.longitud && (
                      <div className="overflow-hidden border border-white/10" style={{ borderRadius: 12, height: 200 }}>
                        <iframe src={`https://maps.google.com/maps?q=${property.latitud},${property.longitud}&z=16&output=embed`}
                          className="w-full h-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ════════ DESKTOP ════════ */}

              {/* ── Galería desktop ── */}
              {allPhotos.length > 0 && (
                <div className="hidden md:grid gap-1 rounded-t-2xl overflow-hidden"
                  style={{
                    height: 360,
                    gridTemplateColumns: allPhotos.length > 1 ? "1fr 230px" : "1fr",
                  }}>
                  {/* Foto principal — cambia con photoIndex */}
                  <div className="relative overflow-hidden">
                    <Image
                      src={allPhotos[photoIndex]}
                      alt={titulo}
                      fill
                      className="object-cover transition-opacity duration-200"
                      sizes="690px"
                      priority
                    />
                    {allPhotos.length > 1 && (
                      <>
                        <button
                          onClick={prev}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={next}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <span className="absolute bottom-3 right-3 font-sans text-[11px] text-white/50 bg-black/40 px-2 py-0.5 rounded">
                      {photoIndex + 1}/{allPhotos.length}
                    </span>
                  </div>

                  {/* Thumbnails derecha */}
                  {allPhotos.length > 1 && (
                    <div className="grid gap-1" style={{ gridTemplateRows: "1fr 1fr" }}>
                      {[1, 2].map((offset) => {
                        const idx = (photoIndex + offset) % allPhotos.length
                        const isLast = offset === 2 && allPhotos.length > 3
                        return (
                          <button
                            key={offset}
                            onClick={(e) => { e.stopPropagation(); setPhotoIndex(idx) }}
                            className="relative overflow-hidden w-full h-full block"
                          >
                            <Image src={allPhotos[idx]} alt="" fill className="object-cover" sizes="230px" />
                            {isLast && (
                              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1">
                                <span className="text-white font-sans text-2xl font-[200]">+{allPhotos.length - 3}</span>
                                <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-white/60">fotos</span>
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ── Contenido desktop: dos columnas ── */}
              <div className="hidden md:flex gap-8 px-8 pt-7 pb-8">

                {/* Columna izquierda */}
                <div className="flex-1 min-w-0">

                  {/* Badges + título + ubicación */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 font-sans text-[10px] font-[600] uppercase tracking-[0.2em]"
                      style={{ background: GOLD, color: BG_MAIN, borderRadius: 4 }}>
                      {property.operacion === "venta" ? "En Venta" : "En Alquiler"}
                    </span>
                    <span className="px-3 py-1 font-sans text-[10px] font-[600] uppercase tracking-[0.2em] text-white/50 border border-white/15"
                      style={{ borderRadius: 4 }}>
                      {TIPO_LABEL[property.tipo] ?? property.tipo}
                    </span>
                  </div>
                  <h2 className="font-sans text-2xl font-[200] leading-snug text-white mb-2">{titulo}</h2>
                  {(property.zona || property.direccion) && (
                    <p className="flex items-center gap-1.5 font-sans text-sm font-[300] text-white/45">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: `${GOLD}70` }} />
                      {[property.zona, property.direccion].filter(Boolean).join(", ")}
                    </p>
                  )}

                  {/* Chips */}
                  {chips.length > 0 && (
                    <>
                      <Divider />
                      <div className="flex flex-wrap gap-2">
                        {chips.map((c, i) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-2 font-sans text-sm font-[300] text-white/70 border border-white/10"
                            style={{ background: BG_CHIP, borderRadius: 8 }}>
                            <ChipIcon icon={c.icon} />
                            {c.label}
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Descripción */}
                  {descIntro && (
                    <>
                      <Divider />
                      <SectionLabel>Descripción</SectionLabel>
                      <p className="font-sans text-sm font-[300] leading-[1.9] text-white/65 whitespace-pre-line">{descIntro}</p>
                    </>
                  )}

                  {/* Comodidades */}
                  {amenities.length > 0 && (
                    <>
                      <Divider />
                      <SectionLabel>Comodidades</SectionLabel>
                      <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                        {amenities.map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ background: `${GOLD}18` }}>
                              <Check className="w-2.5 h-2.5" style={{ color: GOLD }} />
                            </div>
                            <span className="font-sans text-sm font-[300] text-white/65">{item}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Detalles */}
                  {detalles.length > 0 && (
                    <>
                      <Divider />
                      <SectionLabel>Detalles</SectionLabel>
                      <div className="grid grid-cols-2 gap-2">
                        {detalles.map(d => (
                          <div key={d.label} className="flex items-center justify-between px-4 py-3 border border-white/8"
                            style={{ background: BG_CARD, borderRadius: 8 }}>
                            <span className="font-sans text-xs font-[300] text-white/40">{d.label}</span>
                            <span className="font-sans text-xs font-[400] text-white/80">{d.value}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Mapa */}
                  {(property.latitud || property.direccion) && (
                    <>
                      <Divider />
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: `${GOLD}70` }} />
                          <span className="font-sans text-sm font-[300] text-white/65">
                            {[property.zona, property.direccion].filter(Boolean).join(", ") || "Ubicación"}
                          </span>
                        </div>
                        {mapsUrl && (
                          <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 font-sans text-xs font-[300] text-white/40 hover:text-white/70 transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                            Abrir en Google Maps
                          </a>
                        )}
                      </div>
                      {property.latitud && property.longitud && (
                        <div className="overflow-hidden border border-white/10" style={{ borderRadius: 10, height: 240 }}>
                          <iframe
                            src={`https://maps.google.com/maps?q=${property.latitud},${property.longitud}&z=16&output=embed`}
                            className="w-full h-full border-0"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                      )}
                    </>
                  )}

                </div>

                {/* Columna derecha — precio sticky */}
                <div className="w-60 flex-shrink-0">
                  <div className="sticky top-6 p-5 border border-white/8"
                    style={{ background: BG_CARD, borderRadius: 12 }}>
                    <p className="font-sans text-[10px] font-[600] uppercase tracking-[0.28em] mb-1"
                      style={{ color: `${GOLD}80` }}>
                      Precio
                    </p>
                    <p className="font-sans text-2xl font-[200] text-white mb-0.5 leading-none tracking-tight">
                      {precio ?? "Consultar"}
                    </p>
                    {property.superficie_m2 && property.precio && (
                      <p className="font-sans text-xs font-[300] text-white/35 mb-6">
                        {(property.moneda === "usd" ? "USD" : "PYG")} {Math.round(property.precio / property.superficie_m2).toLocaleString("es-PY")}/m²
                      </p>
                    )}
                    {!property.superficie_m2 && <div className="mb-6" />}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full font-sans text-[11px] font-[600] uppercase tracking-[0.2em] transition-all hover:opacity-90 mb-3"
                      style={{ background: GOLD, color: BG_MAIN, borderRadius: 8, height: 44 }}
                    >
                      Consultar
                    </a>
                    {propertyId && (
                      <button
                        onClick={handleShare}
                        className="flex items-center justify-center gap-2 w-full font-sans text-[11px] font-[400] text-white/40 hover:text-white/70 transition-colors py-2"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        Compartir propiedad
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </>
          )}
        </div>

        {/* ── Sticky bottom mobile ── */}
        {!isLoading && property && (
          <div className="md:hidden flex items-center gap-4 px-4 py-3 border-t border-white/10 flex-shrink-0"
            style={{ background: "#0a1929" }}>
            <div className="flex-1">
              <p className="font-sans text-[10px] text-white/30 uppercase tracking-wider mb-0.5">Precio</p>
              <p className="font-sans text-base font-[200] text-white leading-none">{precio ?? "Consultar"}</p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-6 font-sans text-[11px] font-[600] uppercase tracking-[0.15em]"
              style={{ background: GOLD, color: BG_MAIN, borderRadius: 8, height: 44 }}
            >
              Consultar
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
