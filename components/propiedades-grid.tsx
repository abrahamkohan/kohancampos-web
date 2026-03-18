"use client"

import { useState } from "react"
import Link from "next/link"
import { TerminadaCard } from "./property-card"
import type { PropiedadTerminada } from "@/lib/supabase-properties"

export function PropiedadesGrid({ propiedades }: { propiedades: PropiedadTerminada[] }) {
  const [shareMsg, setShareMsg] = useState("")

  function handleShare(e: React.MouseEvent, id: string) {
    e.preventDefault()
    e.stopPropagation()
    const url = `${window.location.origin}/propiedades/${id}`
    if (navigator.share) {
      navigator.share({ title: "Propiedad — Kohan & Campos", url })
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setShareMsg(id)
        setTimeout(() => setShareMsg(""), 2000)
      })
    }
  }

  if (propiedades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-sans text-base font-[300] text-kc-white/30">
          No hay propiedades publicadas por el momento.
        </p>
        <a
          href="/#contacto"
          className="mt-8 bg-gold px-8 py-3 font-sans text-[10px] font-[600] uppercase tracking-[0.2em] text-navy-deep transition-all hover:bg-gold-light"
        >
          Consultanos
        </a>
      </div>
    )
  }

  return (
    <>
      {shareMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-navy-deep border border-gold/30 px-5 py-3 font-sans text-sm font-[300] text-gold shadow-xl">
          Link copiado al portapapeles
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {propiedades.map(p => (
          <Link key={p.id} href={`/propiedades/${p.id}`} className="h-full block">
            <TerminadaCard p={p} onShare={(e) => handleShare(e, p.id)} />
          </Link>
        ))}
      </div>
    </>
  )
}
