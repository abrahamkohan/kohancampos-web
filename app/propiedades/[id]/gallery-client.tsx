"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react"

interface Props {
  photos: string[]
  titulo: string
}

export function PropertyGallery({ photos, titulo }: Props) {
  const [active, setActive] = useState(0)

  if (photos.length === 0) return null

  function prev(e: React.MouseEvent) {
    e.preventDefault()
    setActive(i => (i === 0 ? photos.length - 1 : i - 1))
  }
  function next(e: React.MouseEvent) {
    e.preventDefault()
    setActive(i => (i === photos.length - 1 ? 0 : i + 1))
  }

  const extraCount = photos.length > 5 ? photos.length - 5 : 0

  return (
    <div
      className="relative rounded-xl overflow-hidden w-full"
      style={{ height: "clamp(220px, 42vw, 440px)" }}
    >
      <div
        className="grid h-full gap-1"
        style={{ gridTemplateColumns: photos.length > 1 ? "1fr 220px" : "1fr" }}
      >
        {/* ── Foto principal ── */}
        <div className="relative overflow-hidden">
          <Image
            src={photos[active]}
            alt={titulo}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 900px"
            priority
          />
          {photos.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <span className="absolute bottom-3 left-3 font-sans text-[11px] text-white/70 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm">
                {active + 1} / {photos.length}
              </span>
            </>
          )}
        </div>

        {/* ── 2×2 thumbnails (solo desktop) ── */}
        {photos.length > 1 && (
          <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-1">
            {[1, 2, 3, 4].map((thumbIdx) => {
              const realIdx = thumbIdx < photos.length ? thumbIdx : -1
              if (realIdx === -1) return <div key={thumbIdx} style={{ background: "rgba(15,34,51,0.4)" }} />
              const isLastSlot = thumbIdx === 4 && extraCount > 0
              return (
                <button
                  key={thumbIdx}
                  onClick={() => setActive(realIdx)}
                  className={`relative overflow-hidden hover:opacity-90 transition-opacity ${
                    active === realIdx ? "ring-2 ring-inset ring-gold/60" : ""
                  }`}
                >
                  <Image src={photos[realIdx]} alt="" fill className="object-cover" sizes="110px" />
                  {isLastSlot && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-0.5">
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

      {/* "Ver todas las fotos" — overlay bottom-right */}
      {photos.length > 1 && (
        <button
          onClick={() => setActive(0)}
          className="absolute bottom-3 right-3 hidden md:flex items-center gap-1.5 bg-white/90 hover:bg-white text-gray-800 font-sans text-[11px] font-[500] px-3 py-1.5 rounded-lg shadow-sm transition-colors z-10"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          Ver todas las fotos
        </button>
      )}
    </div>
  )
}
