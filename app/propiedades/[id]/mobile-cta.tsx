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
          <p className="font-sans text-[10px] uppercase tracking-[0.15em] text-white/30 leading-none mb-0.5">Precio</p>
          <p className="font-sans text-[14px] font-[400] text-white leading-none">{precio}</p>
        </div>
      ) : null}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 text-center bg-gold rounded-lg py-[18px] font-sans text-[12px] font-[700] uppercase tracking-[0.18em] text-navy-deep shadow-[0_4px_24px_rgba(197,168,100,0.5)] active:scale-[0.97] transition-transform"
      >
        Contactar
      </a>
    </div>
  )
}
