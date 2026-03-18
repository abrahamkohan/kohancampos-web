"use client"

import { useState } from "react"
import { Share2 } from "lucide-react"

export function ShareButton({ titulo, propertyId }: { titulo: string; propertyId: string }) {
  const [msg, setMsg] = useState("")

  function handleShare() {
    const url = `${window.location.origin}/propiedades/${propertyId}`
    if (navigator.share) {
      navigator.share({ title: titulo + " — Kohan & Campos", url })
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setMsg("Link copiado")
        setTimeout(() => setMsg(""), 2000)
      })
    }
  }

  return (
    <button
      onClick={handleShare}
      className="relative flex items-center gap-2 border border-gold/20 px-4 py-2 font-sans text-[10px] font-[600] uppercase tracking-[0.15em] text-gold/60 transition-colors hover:border-gold/50 hover:text-gold"
    >
      <Share2 size={13} />
      Compartir
      {msg && (
        <span className="absolute -bottom-8 right-0 whitespace-nowrap border border-gold/20 bg-navy-deep px-3 py-1 font-sans text-[10px] normal-case tracking-normal text-gold">
          {msg}
        </span>
      )}
    </button>
  )
}
