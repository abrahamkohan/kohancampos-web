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

  function prev() { setPhotoIndex(i => i === 0 ? allPhotos.length - 1 : i - 1) }
  function next() { setPhotoIndex(i => i === allPhotos.length - 1 ? 0 : i + 1) }

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
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full h-[92vh] md:h-auto md:max-h-[90vh] md:max-w-[1000px] rounded-t-2xl md:rounded-2xl bg-white overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable area */}
        <div className="overflow-y-auto flex-1">

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-32">
              <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
            </div>
          )}

          {!isLoading && property && (
            <>
              {/* Gallery */}
              {allPhotos.length > 0 && (
                <div>
                  <div className="relative h-64 md:h-[380px] bg-gray-100">
                    <Image
                      src={allPhotos[photoIndex]}
                      alt={titulo}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 1000px"
                      priority
                    />
                    {allPhotos.length > 1 && (
                      <>
                        <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors">
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
                          {photoIndex + 1} / {allPhotos.length}
                        </span>
                      </>
                    )}
                  </div>
                  {allPhotos.length > 1 && (
                    <div className="flex gap-2 px-4 py-3 overflow-x-auto bg-gray-50">
                      {allPhotos.map((url, i) => (
                        <button
                          key={i}
                          onClick={() => setPhotoIndex(i)}
                          className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === photoIndex ? "border-gray-900 opacity-100" : "border-transparent opacity-50 hover:opacity-80"}`}
                        >
                          <Image src={url} alt="" fill className="object-cover" sizes="64px" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="p-5 md:p-8 pb-28 md:pb-8">
                <div className="flex flex-col md:flex-row gap-8">

                  {/* Left */}
                  <div className="flex-1 flex flex-col gap-6">
                    {/* Header */}
                    <div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-900 text-white">
                          {property.operacion === "venta" ? "En Venta" : "En Alquiler"}
                        </span>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                          {TIPO_LABEL[property.tipo] ?? property.tipo}
                        </span>
                      </div>
                      <h2 className="text-2xl font-semibold text-gray-900 leading-snug mb-2">{titulo}</h2>
                      {(property.zona || property.direccion) && (
                        <p className="flex items-center gap-1.5 text-sm text-gray-400">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                          {[property.zona, property.direccion].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>

                    {/* Chips */}
                    {chips.length > 0 && (
                      <div className="flex flex-wrap gap-3 pb-6 border-b border-gray-100">
                        {chips.map((c, i) => (
                          <div key={i} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm font-medium text-gray-700">
                            {c.icon === "bed" && <Bed className="w-4 h-4 text-gray-400" />}
                            {c.icon === "bath" && <Bath className="w-4 h-4 text-gray-400" />}
                            {c.icon === "m2" && <Maximize2 className="w-4 h-4 text-gray-400" />}
                            {c.icon === "car" && <Car className="w-4 h-4 text-gray-400" />}
                            {c.label}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Description */}
                    {property.descripcion && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Descripción</p>
                        <p className="text-sm text-gray-600 leading-7 whitespace-pre-line">{property.descripcion}</p>
                      </div>
                    )}

                    {/* Detalles */}
                    {detalles.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Detalles</p>
                        <div className="grid grid-cols-2 gap-2">
                          {detalles.map(d => (
                            <div key={d.label} className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm">
                              <span className="text-gray-500">{d.label}</span>
                              <span className="font-medium text-gray-800">{d.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Map */}
                    {property.latitud && property.longitud && (
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Ubicación</p>
                        <div className="rounded-xl overflow-hidden h-52 border border-gray-100">
                          <iframe
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.longitud - 0.008},${property.latitud - 0.008},${property.longitud + 0.008},${property.latitud + 0.008}&layer=mapnik&marker=${property.latitud},${property.longitud}`}
                            className="w-full h-full border-0"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right sidebar — desktop */}
                  <div className="hidden md:block w-72 flex-shrink-0">
                    <div className="border border-gray-100 rounded-2xl p-5 sticky top-4">
                      {precio && (
                        <>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Precio</p>
                          <p className="text-3xl font-bold text-gray-900 tracking-tight mb-6">{precio}</p>
                        </>
                      )}
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-700 transition-colors text-sm"
                      >
                        Consultar por esta propiedad
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile sticky bottom bar */}
        {!isLoading && property && (
          <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-t border-gray-100">
            {precio && (
              <div className="flex-1">
                <p className="text-xs text-gray-400">Precio</p>
                <p className="font-bold text-gray-900 text-sm">{precio}</p>
              </div>
            )}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-900 text-white font-medium text-sm hover:bg-gray-700 transition-colors"
            >
              Consultar
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
