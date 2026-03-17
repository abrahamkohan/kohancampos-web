"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, MapPin, Bed, Bath, Maximize2, Car } from "lucide-react"
import type { PropiedadDetalle } from "@/lib/supabase-properties"

const TIPO_LABEL: Record<string, string> = {
  departamento: "Departamento", casa: "Casa", terreno: "Terreno", comercial: "Comercial",
}
const CONDICION_LABEL: Record<string, string> = {
  nuevo: "Nuevo", usado: "Usado", reventa: "Reventa",
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
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  const allPhotos = property
    ? property.fotos.length > 0
      ? property.fotos
      : property.foto_portada
        ? [`${supabaseUrl}/storage/v1/object/public/property-photos/${property.foto_portada}`]
        : []
    : []

  const titulo = property
    ? property.titulo ?? (TIPO_LABEL[property.tipo] ?? property.tipo) + " en " + (property.zona ?? "Sin ubicación")
    : ""

  const precio = property?.precio != null
    ? (property.moneda === "usd" ? "USD" : "PYG") + " " + property.precio.toLocaleString("es-PY")
    : null

  const whatsappUrl = `https://wa.me/595982000808?text=${encodeURIComponent("Hola, me interesa: " + titulo)}`

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full h-[94vh] md:h-auto md:max-h-[88vh] md:max-w-[1000px] rounded-t-2xl md:rounded-2xl overflow-hidden flex flex-col"
        style={{ background: "#0B1C2C" }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Close button ── */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 transition-colors text-white/80 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ── Scrollable content ── */}
        <div className="overflow-y-auto flex-1">

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <div className="w-7 h-7 border-2 border-white/10 border-t-white/60 rounded-full animate-spin" />
            </div>
          )}

          {!isLoading && property && (
            <>
              {/* ── Galería ── */}
              <div className="relative h-64 md:h-[360px] bg-white/5 flex-shrink-0">
                {allPhotos.length > 0 ? (
                  <>
                    <Image
                      src={allPhotos[photoIndex]}
                      alt={titulo}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 1000px"
                      priority
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2C]/80 via-transparent to-transparent" />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white/20 text-sm font-sans font-[300]">Sin fotos</span>
                  </div>
                )}

                {/* Flechas */}
                {allPhotos.length > 1 && (
                  <>
                    <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/60 text-white transition-colors backdrop-blur-sm">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/60 text-white transition-colors backdrop-blur-sm">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/60 font-sans font-[300]">
                      {photoIndex + 1} / {allPhotos.length}
                    </span>
                  </>
                )}
              </div>

              {/* Miniaturas */}
              {allPhotos.length > 1 && (
                <div className="flex gap-2 px-5 py-3 overflow-x-auto" style={{ background: "#0a1929" }}>
                  {allPhotos.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setPhotoIndex(i)}
                      className={`relative flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden border transition-all ${
                        i === photoIndex ? "border-[#C9B99A] opacity-100" : "border-white/10 opacity-40 hover:opacity-70"
                      }`}
                    >
                      <Image src={url} alt="" fill className="object-cover" sizes="56px" />
                    </button>
                  ))}
                </div>
              )}

              {/* ── Contenido ── */}
              <div className="p-6 md:p-8 pb-28 md:pb-8">

                {/* Header */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-block px-3 py-1 font-sans text-[10px] font-[600] uppercase tracking-[0.2em] text-[#0B1C2C]" style={{ background: "#C9B99A" }}>
                      {property.operacion === "venta" ? "En Venta" : "En Alquiler"}
                    </span>
                    <span className="inline-block px-3 py-1 font-sans text-[10px] font-[600] uppercase tracking-[0.2em] text-white/60 border border-white/15">
                      {TIPO_LABEL[property.tipo] ?? property.tipo}
                    </span>
                  </div>

                  <h2 className="font-sans text-2xl md:text-3xl font-[200] leading-snug text-white mb-2">
                    {titulo}
                  </h2>

                  {(property.zona || property.direccion) && (
                    <p className="flex items-center gap-1.5 font-sans text-sm font-[300] text-white/40">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-[#C9B99A]/60" />
                      {[property.zona, property.direccion].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>

                {/* Chips de características */}
                {chips.length > 0 && (
                  <div className="flex flex-wrap gap-3 pb-6 mb-6 border-b border-white/8">
                    {chips.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-4 py-2.5 font-sans text-sm font-[300] text-white/70 border border-white/10"
                        style={{ background: "#11263A", borderRadius: 10 }}
                      >
                        {c.icon === "bed" && <Bed className="w-4 h-4 text-[#C9B99A]/60" />}
                        {c.icon === "bath" && <Bath className="w-4 h-4 text-[#C9B99A]/60" />}
                        {c.icon === "m2" && <Maximize2 className="w-4 h-4 text-[#C9B99A]/60" />}
                        {c.icon === "car" && <Car className="w-4 h-4 text-[#C9B99A]/60" />}
                        {c.label}
                      </div>
                    ))}
                  </div>
                )}

                {/* 2 columnas */}
                <div className="flex flex-col md:flex-row gap-8">

                  {/* Izquierda: descripción + detalles + mapa */}
                  <div className="flex-1 flex flex-col gap-7">

                    {property.descripcion && (
                      <div>
                        <p className="font-sans text-[10px] font-[600] uppercase tracking-[0.25em] text-[#C9B99A]/60 mb-4">
                          Descripción
                        </p>
                        <p className="font-sans text-sm font-[300] leading-7 text-white/60 whitespace-pre-line">
                          {property.descripcion}
                        </p>
                      </div>
                    )}

                    {detalles.length > 0 && (
                      <div>
                        <p className="font-sans text-[10px] font-[600] uppercase tracking-[0.25em] text-[#C9B99A]/60 mb-4">
                          Detalles
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {detalles.map(d => (
                            <div
                              key={d.label}
                              className="flex items-center justify-between px-4 py-3 border border-white/8"
                              style={{ background: "#11263A", borderRadius: 10 }}
                            >
                              <span className="font-sans text-xs font-[300] text-white/40">{d.label}</span>
                              <span className="font-sans text-xs font-[400] text-white/80">{d.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {property.latitud && property.longitud && (
                      <div>
                        <p className="font-sans text-[10px] font-[600] uppercase tracking-[0.25em] text-[#C9B99A]/60 mb-4">
                          Ubicación
                        </p>
                        <div className="overflow-hidden border border-white/10" style={{ borderRadius: 12, height: 200 }}>
                          <iframe
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.longitud - 0.008},${property.latitud - 0.008},${property.longitud + 0.008},${property.latitud + 0.008}&layer=mapnik&marker=${property.latitud},${property.longitud}`}
                            className="w-full h-full border-0"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Derecha: precio + CTA — desktop */}
                  <div className="hidden md:block w-64 flex-shrink-0">
                    <div
                      className="p-6 border border-white/10 sticky top-4"
                      style={{ background: "#11263A", borderRadius: 16 }}
                    >
                      <p className="font-sans text-[10px] font-[600] uppercase tracking-[0.2em] text-[#C9B99A]/60 mb-2">
                        Precio
                      </p>
                      <p className="font-sans text-3xl font-[200] text-white mb-8 leading-none">
                        {precio ?? "Consultar"}
                      </p>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-3.5 text-center font-sans text-[11px] font-[600] uppercase tracking-[0.2em] transition-all"
                        style={{ background: "#C9B99A", color: "#0B1C2C", borderRadius: 8 }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#d4c5aa")}
                        onMouseLeave={e => (e.currentTarget.style.background = "#C9B99A")}
                      >
                        Consultar
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Mobile sticky CTA ── */}
        {!isLoading && property && (
          <div
            className="md:hidden flex items-center gap-4 px-5 py-4 border-t border-white/10"
            style={{ background: "#0a1929" }}
          >
            <div className="flex-1">
              <p className="font-sans text-[10px] font-[300] text-white/40 uppercase tracking-wider">Precio</p>
              <p className="font-sans text-lg font-[300] text-white leading-tight">{precio ?? "Consultar"}</p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 font-sans text-[11px] font-[600] uppercase tracking-[0.15em] transition-all"
              style={{ background: "#C9B99A", color: "#0B1C2C", borderRadius: 8 }}
            >
              Consultar
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
