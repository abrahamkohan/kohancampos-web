"use client"

interface Props {
  precio: string | null
  precioM2: string | null
  whatsappUrl: string
}

export function MobileCTA({ precio, precioM2, whatsappUrl }: Props) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#0b1d2c]/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-8px_40px_rgba(0,0,0,0.6)] px-4 py-2.5 flex items-center gap-4">
      {precio ? (
        <div className="flex-1 min-w-0">
          <p className="font-sans text-sm font-[300] text-white leading-none truncate">{precio}</p>
          {precioM2 && (
            <p className="font-sans text-[10px] text-white/30 mt-0.5">{precioM2}</p>
          )}
        </div>
      ) : (
        <div className="flex-1" />
      )}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 bg-gold rounded-xl px-7 py-3 font-sans text-[10px] font-[700] uppercase tracking-[0.2em] text-navy-deep shadow-[0_4px_16px_rgba(197,168,100,0.35)] active:scale-[0.97] transition-transform"
      >
        Contactar
      </a>
    </div>
  )
}
