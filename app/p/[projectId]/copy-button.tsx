"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import type { ProyectoDetalle } from "@/lib/supabase-projects"

function formatUsd(n: number) {
  return `USD ${n.toLocaleString("es-PY")}`
}

export function CopyButton({ p }: { p: ProyectoDetalle }) {
  const [copied, setCopied] = useState(false)

  function buildText() {
    const lines: string[] = []
    lines.push(p.nombre)
    if (p.zona) lines.push(p.zona)
    if (p.delivery_date) {
      const fecha = new Date(p.delivery_date).toLocaleDateString("es-PY", { year: "numeric", month: "long" })
      lines.push(`Entrega: ${fecha}`)
    }
    if (p.desarrolladora) lines.push(`Desarrolladora: ${p.desarrolladora}`)
    if (p.typologies.length > 0) {
      lines.push("")
      lines.push("Tipologías:")
      p.typologies.forEach(t => {
        const price = t.price_usd ? formatUsd(t.price_usd) : "Consultar"
        const area = t.area_m2 > 0 ? ` — ${t.area_m2} m²` : ""
        lines.push(`  · ${t.name}${area} — ${price}`)
      })
    }
    lines.push("")
    lines.push(`${window.location.origin}/p/${p.id}`)
    return lines.join("\n")
  }

  function handleCopy() {
    navigator.clipboard.writeText(buildText()).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 border border-white/15 text-white/50 hover:border-white/30 hover:text-white/80 font-sans text-xs font-[400] tracking-wide transition-all"
    >
      {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
      {copied ? "Copiado" : "Copiar"}
    </button>
  )
}
