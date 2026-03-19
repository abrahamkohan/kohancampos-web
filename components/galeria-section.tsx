"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"

export function GaleriaSection({ fotos }: { fotos: string[] }) {
  const [lightbox, setLightbox] = useState<string | null>(null)

  // La primera foto ya está en el hero — mostrar desde la segunda
  const galeria = fotos.slice(1)
  if (!galeria.length) return null

  return (
    <section className="flex flex-col gap-6">
      <div>
        <span className="block font-sans text-[10px] font-[600] uppercase tracking-[0.3em] text-gold/60 mb-2">
          Galería
        </span>
        <h2 className="font-sans text-2xl font-[200] text-kc-white">
          Imágenes del proyecto
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {galeria.map((url, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setLightbox(url)}
            className="relative aspect-[4/3] overflow-hidden rounded-sm bg-navy-primary group"
          >
            <Image
              src={url}
              alt={`Foto ${i + 2}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </button>
        ))}
      </div>

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
            className="max-w-full max-h-full object-contain rounded-sm"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}
