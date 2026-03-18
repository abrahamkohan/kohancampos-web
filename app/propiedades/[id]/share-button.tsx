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
      title="Compartir"
      className="relative w-8 h-8 flex items-center justify-center text-kc-white/30 hover:text-gold/80 transition-colors"
    >
      <Share2 size={15} />
      {msg && (
        <span className="absolute -bottom-8 right-0 whitespace-nowrap border border-gold/20 bg-navy-deep px-3 py-1 font-sans text-[10px] normal-case tracking-normal text-gold">
          {msg}
        </span>
      )}
    </button>
  )
}
