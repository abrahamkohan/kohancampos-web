"use client"

interface Props {
  precio: string | null
  precioM2: string | null
  whatsappUrl: string
}

export function MobileCTA({ precio, whatsappUrl }: Props) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#0b1d2c]/92 backdrop-blur-xl border-t border-white/10 shadow-[0_-8px_40px_rgba(0,0,0,0.6)] flex items-center gap-3.5 px-4 py-3">

      {/* Precio — protagonista */}
      <div className="flex-1 min-w-0 pl-1">
        <p className="font-sans text-[9px] uppercase tracking-[0.18em] text-white/35 leading-none mb-1">Precio</p>
        <p className="font-sans text-[20px] font-[600] text-white leading-none truncate">
          {precio ?? "Consultar"}
        </p>
      </div>

      {/* CTA — acción clara */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ width: "40%", minWidth: 150 }}
        className="flex-shrink-0 text-center bg-gold rounded-lg py-3.5 font-sans text-[13px] font-[700] uppercase tracking-[0.16em] text-navy-deep shadow-[0_4px_20px_rgba(197,168,100,0.45)] active:scale-[0.97] transition-transform"
      >
        Contactar
      </a>

    </div>
  )
}
