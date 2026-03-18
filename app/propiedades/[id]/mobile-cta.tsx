"use client"

interface Props {
  precio: string | null
  precioM2: string | null
  whatsappUrl: string
}

export function MobileCTA({ precio, precioM2, whatsappUrl }: Props) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#0b1d2c]/92 backdrop-blur-xl border-t border-white/10 shadow-[0_-8px_40px_rgba(0,0,0,0.6)] px-4 py-2 flex items-center gap-3">
      {precio ? (
        <div className="flex-shrink-0">
          <p className="font-sans text-[12px] font-[300] text-white/70 leading-none">{precio}</p>
          {precioM2 && (
            <p className="font-sans text-[9px] text-white/25 mt-0.5">{precioM2}</p>
          )}
        </div>
      ) : null}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 text-center bg-gold rounded-lg py-3.5 font-sans text-[11px] font-[700] uppercase tracking-[0.2em] text-navy-deep shadow-[0_4px_20px_rgba(197,168,100,0.4)] active:scale-[0.97] transition-transform"
      >
        Contactar
      </a>
    </div>
  )
}
