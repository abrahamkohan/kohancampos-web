"use client"

import { useState } from "react"
import { X } from "lucide-react"

export function GaleriaSection({ fotos }: { fotos: string[] }) {
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  // Primera foto ya está en el hero — mostrar desde la segunda
  const galeria = fotos.slice(1)
  if (!galeria.length) return null

  const visible = showAll ? galeria : galeria.slice(0, 6)
  const hasMore = galeria.length > 6

  // Layout: fila 1 = 1 grande (span 2) + 2 chicas; fila 2 = 3 iguales
  // Usamos un grid de 3 columnas, primera imagen ocupa 2 cols
  const [first, ...rest] = visible

  return (
    <section className="flex flex-col gap-4">
      <span className="block font-sans text-[10px] font-[600] uppercase tracking-[0.3em] text-gold/60">
        Galería
      </span>

      <div className="grid grid-cols-3 gap-2">
        {/* Primera imagen — ancho doble */}
        <button
          type="button"
          onClick={() => setLightbox(first)}
          className="col-span-2 relative aspect-[4/3] overflow-hidden bg-navy-primary group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={first} alt="Foto 1" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        </button>

        {/* Columna de 2 imágenes chicas */}
        <div className="flex flex-col gap-2">
          {rest.slice(0, 2).map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setLightbox(url)}
              className="relative flex-1 overflow-hidden bg-navy-primary group"
              style={{ minHeight: 0 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Foto ${i + 2}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
            </button>
          ))}
        </div>

        {/* Fila 2: resto de imágenes (máx 3) */}
        {rest.slice(2, 5).map((url, i) => (
          <button
            key={`row2-${i}`}
            type="button"
            onClick={() => setLightbox(url)}
            className="relative aspect-square overflow-hidden bg-navy-primary group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Foto ${i + 4}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
          </button>
        ))}
      </div>

      {/* Ver todas */}
      {hasMore && !showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="self-start font-sans text-xs font-[500] text-kc-white/40 hover:text-gold transition-colors tracking-wide"
        >
          Ver todas las fotos ({galeria.length})
        </button>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-navy-deep/80 flex items-center justify-center text-kc-white/70 hover:text-kc-white transition-colors"
          >
            <X size={18} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt=""
            className="max-w-full max-h-full object-contain"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}
