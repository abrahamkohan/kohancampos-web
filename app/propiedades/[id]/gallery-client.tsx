"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, LayoutGrid, X } from "lucide-react"

interface Props {
  photos: string[]
  titulo: string
}

export function PropertyGallery({ photos, titulo }: Props) {
  const [active, setActive] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState(0)

  // Keyboard nav for lightbox
  useEffect(() => {
    if (!lightboxOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false)
      if (e.key === "ArrowLeft") setLightboxIdx(i => (i === 0 ? photos.length - 1 : i - 1))
      if (e.key === "ArrowRight") setLightboxIdx(i => (i === photos.length - 1 ? 0 : i + 1))
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [lightboxOpen, photos.length])

  if (photos.length === 0) return null

  function prevMain(e: React.MouseEvent) {
    e.preventDefault()
    setActive(i => (i === 0 ? photos.length - 1 : i - 1))
  }
  function nextMain(e: React.MouseEvent) {
    e.preventDefault()
    setActive(i => (i === photos.length - 1 ? 0 : i + 1))
  }

  function openLightbox(idx: number) {
    setLightboxIdx(idx)
    setLightboxOpen(true)
  }

  const extraCount = photos.length > 5 ? photos.length - 5 : 0

  return (
    <>
      {/* ── Galería principal ──
          THUMB_SIZE px: el cuadrado de thumbnails mide THUMB_SIZE × THUMB_SIZE
          (2 cols × 2 rows, cada celda = THUMB_SIZE/2 × THUMB_SIZE/2)
          La altura total del gallery = THUMB_SIZE para que la grilla quede cuadrada.
      ── */}
      <div
        className="relative rounded-xl overflow-hidden w-full h-[260px] md:h-[380px]"
      >
        <div
          className={`grid h-full gap-1 ${photos.length > 1 ? "grid-cols-1 md:grid-cols-[1fr_380px]" : "grid-cols-1"}`}
        >
          {/* Foto principal */}
          <div
            className="relative overflow-hidden cursor-pointer"
            onClick={() => openLightbox(active)}
          >
            <Image
              src={photos[active]}
              alt={titulo}
              fill
              className="object-cover hover:scale-[1.02] transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 900px"
              priority
            />
            {/* Gradient overlay — solo mobile, depth sutil */}
            <div className="md:hidden absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-10" />
            {photos.length > 1 && (
              <>
                <button
                  onClick={e => { e.stopPropagation(); prevMain(e) }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-colors backdrop-blur-sm z-10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={e => { e.stopPropagation(); nextMain(e) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-colors backdrop-blur-sm z-10"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <span className="absolute bottom-3 left-3 font-sans text-[11px] text-white/70 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm z-10">
                  {active + 1} / {photos.length}
                </span>
              </>
            )}
          </div>

          {/* 2×2 thumbnails (solo desktop) */}
          {photos.length > 1 && (
            <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-1">
              {[1, 2, 3, 4].map((thumbIdx) => {
                const realIdx = thumbIdx < photos.length ? thumbIdx : -1
                if (realIdx === -1) return <div key={thumbIdx} style={{ background: "rgba(15,34,51,0.5)" }} />
                const isLastSlot = thumbIdx === 4 && extraCount > 0
                return (
                  <button
                    key={thumbIdx}
                    onClick={() => { setActive(realIdx); openLightbox(realIdx) }}
                    className={`relative overflow-hidden hover:opacity-85 transition-opacity ${
                      active === realIdx ? "ring-2 ring-inset ring-gold/60" : ""
                    }`}
                  >
                    <Image src={photos[realIdx]} alt="" fill className="object-cover" sizes="110px" />
                    {isLastSlot && (
                      <div className="absolute inset-0 bg-black/65 flex flex-col items-center justify-center gap-0.5">
                        <span className="font-sans text-2xl font-[200] text-white leading-none">+{extraCount}</span>
                        <span className="font-sans text-[10px] uppercase tracking-[0.12em] text-white/60">fotos</span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* "Ver todas" overlay button */}
        {photos.length > 1 && (
          <button
            onClick={() => openLightbox(0)}
            className="absolute bottom-3 right-3 hidden md:flex items-center gap-1.5 bg-white/90 hover:bg-white text-gray-800 font-sans text-[11px] font-[500] px-3 py-1.5 rounded-lg shadow-sm transition-colors z-10"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Ver todas las fotos
          </button>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/96 flex flex-col items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Botón cerrar */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Contador */}
          <span className="absolute top-5 left-1/2 -translate-x-1/2 font-sans text-sm text-white/50 z-20">
            {lightboxIdx + 1} / {photos.length}
          </span>

          {/* Foto grande */}
          <div
            className="relative w-full h-full max-w-5xl px-16 py-16 flex items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image
                src={photos[lightboxIdx]}
                alt={titulo}
                fill
                className="object-contain"
                sizes="1200px"
              />
            </div>

            {/* Flechas lightbox */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={() => setLightboxIdx(i => i === 0 ? photos.length - 1 : i - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setLightboxIdx(i => i === photos.length - 1 ? 0 : i + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Strip de thumbnails abajo */}
          {photos.length > 1 && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-4 z-20"
              onClick={e => e.stopPropagation()}
            >
              {photos.slice(0, 12).map((url, i) => (
                <button
                  key={i}
                  onClick={() => setLightboxIdx(i)}
                  className={`relative w-12 h-9 overflow-hidden rounded flex-shrink-0 transition-opacity ${
                    lightboxIdx === i ? "opacity-100 ring-2 ring-gold/70" : "opacity-40 hover:opacity-70"
                  }`}
                >
                  <Image src={url} alt="" fill className="object-cover" sizes="48px" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
