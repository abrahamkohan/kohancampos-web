"use client"
import { Instagram } from "lucide-react"
import { useLanguage } from "@/components/language-context"

export function Footer() {
  const { t } = useLanguage()

  const navLinks = [
    { label: t("nav.inicio"), href: "#inicio" },
    { label: t("nav.quienes"), href: "#quienes-somos" },
    { label: t("nav.especialidades"), href: "#especialidades" },
    { label: t("nav.proceso"), href: "#proceso" },
    { label: t("nav.contacto"), href: "#contacto" },
  ]

  return (
    <footer className="bg-navy-deep border-t border-white/5 px-6 pt-10 pb-6">
      <div className="mx-auto max-w-[1200px] flex flex-col items-center gap-8">

        {/* ── Bloque 1: marca ── */}
        <div className="flex flex-col items-center gap-3">
          <span className="font-sans text-base font-[200] uppercase tracking-[0.3em] text-kc-white">
            Kohan &amp; Campos
          </span>
          <span className="font-sans text-[10px] font-[300] tracking-[0.25em] text-gold/55">
            {t("footer.tagline")}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 mt-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-sans text-[11px] font-[300] tracking-wide text-kc-white/38 hover:text-gold transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* ── Bloque 2: secundario ── */}
        <div className="w-full border-t border-white/5 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href="https://instagram.com/kohancampos"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-kc-white/30 hover:text-gold transition-colors"
          >
            <Instagram size={13} strokeWidth={1.5} />
            <span className="font-sans text-[10px] font-[300]">@kohancampos</span>
          </a>
          <p className="font-sans text-[10px] font-[300] text-kc-white/25">
            {t("footer.copyright")}
          </p>
          <p className="font-sans text-[10px] font-[300] text-kc-white/18 text-center sm:text-right max-w-xs">
            {t("footer.disclaimer")}
          </p>
        </div>

      </div>
    </footer>
  )
}
