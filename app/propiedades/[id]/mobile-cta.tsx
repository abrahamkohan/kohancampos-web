"use client"

interface Props {
  precio: string | null
  precioM2: string | null
  whatsappUrl: string
}

export function MobileCTA({ precio, precioM2, whatsappUrl }: Props) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-[#0d1e2e]/95 backdrop-blur-md border-t border-white/8 shadow-[0_-6px_32px_rgba(0,0,0,0.5)] px-4 py-3 flex items-center gap-3">
      {precio ? (
        <div className="flex-1 min-w-0">
          <p className="font-sans text-[9px] uppercase tracking-[0.18em] text-white/35 mb-0.5">Precio</p>
          <p className="font-sans text-base font-[300] text-white leading-none truncate">{precio}</p>
          {precioM2 && (
            <p className="font-sans text-[10px] text-white/25 mt-0.5">{precioM2}</p>
          )}
        </div>
      ) : (
        <div className="flex-1" />
      )}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 bg-gold px-6 py-3 font-sans text-[10px] font-[600] uppercase tracking-[0.22em] text-navy-deep transition-opacity hover:opacity-90"
      >
        Contactar
      </a>
    </div>
  )
}
