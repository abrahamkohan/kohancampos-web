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
    <footer className="bg-navy-deep border-t border-white/5 px-6 pt-8 pb-6">
      <div className="mx-auto max-w-[1200px] flex flex-col gap-5">

        {/* Logo + social en una fila */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="font-sans text-sm font-[200] uppercase tracking-[0.25em] text-kc-white">
              Kohan &amp; Campos
            </span>
            <span className="font-sans text-[10px] font-[300] tracking-[0.2em] text-gold/60">
              {t("footer.tagline")}
            </span>
          </div>
          <a
            href="https://instagram.com/kohancampos"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-kc-white/35 hover:text-gold transition-colors"
          >
            <Instagram size={14} strokeWidth={1.5} />
            <span className="font-sans text-[11px] font-[300]">@kohancampos</span>
          </a>
        </div>

        {/* Nav links */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-sans text-[11px] font-[300] tracking-wide text-kc-white/40 hover:text-gold transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Separador + copyright */}
        <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-sans text-[10px] font-[300] text-kc-white/30">
            {t("footer.copyright")}
          </p>
          <p className="font-sans text-[10px] font-[300] text-kc-white/20 text-center sm:text-right max-w-sm">
            {t("footer.disclaimer")}
          </p>
        </div>

      </div>
    </footer>
  )
}
