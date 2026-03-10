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
    <footer className="bg-navy-deep px-6 pb-8 pt-16">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-10 flex flex-col items-center gap-2 text-center">
          <span className="font-sans text-xl font-[200] uppercase tracking-[0.25em] text-kc-white">
            Kohan & Campos
          </span>
          <span className="font-sans text-xs font-[300] tracking-[0.2em] text-gold/70">
            {t("footer.tagline")}
          </span>
        </div>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-6 md:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-sans text-xs font-[300] tracking-wide text-kc-white/50 transition-colors hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="mb-10 flex items-center justify-center">
          <a
            href="https://instagram.com/kohancampos"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-kc-white/40 transition-colors hover:text-gold"
          >
            <Instagram size={18} strokeWidth={1.5} />
            <span className="font-sans text-xs font-[300]">@kohancampos</span>
          </a>
        </div>

        <div className="mb-6 h-px bg-gold/15" />

        <div className="flex flex-col items-center gap-3 text-center">
          <p className="font-sans text-[11px] font-[300] text-kc-white/40">
            {t("footer.copyright")}
          </p>
          <p className="max-w-md font-sans text-[10px] font-[300] text-kc-white/25">
            {t("footer.disclaimer")}
          </p>
        </div>
      </div>
    </footer>
  )
}
