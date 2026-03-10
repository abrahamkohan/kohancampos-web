"use client"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { useLanguage } from "@/components/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"

export function Navbar() {
  const { t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { label: t("nav.inicio"), href: "#inicio" },
    { label: t("nav.quienes"), href: "#quienes-somos" },
    { label: t("nav.especialidades"), href: "#especialidades" },
    { label: t("nav.proceso"), href: "#proceso" },
    { label: t("nav.contacto"), href: "#contacto" },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-navy-deep/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4 lg:py-5">
        <a href="#inicio" className="flex items-center">
          <img src="/logo-navbar.svg" alt="Kohan & Campos" className="h-[22px] w-auto md:h-[28px]" />
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative font-sans text-sm font-[300] tracking-wide text-kc-white/80 transition-colors hover:text-gold after:absolute after:bottom-[-4px] after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
          <span className="text-kc-white/30 text-sm">|</span>
          <LanguageSwitcher />
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <LanguageSwitcher />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-kc-white"
            aria-label={mobileOpen ? "Cerrar menu" : "Abrir menu"}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="flex flex-col items-center gap-6 bg-navy-deep/98 px-6 pb-8 pt-4 backdrop-blur-md lg:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="font-sans text-sm font-[300] tracking-wide text-kc-white/80 transition-colors hover:text-gold"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contacto"
            onClick={() => setMobileOpen(false)}
            className="border border-gold px-6 py-2.5 font-sans text-xs font-[600] uppercase tracking-[0.15em] text-kc-white transition-all hover:bg-gold hover:text-navy-deep"
          >
            {t("nav.contacto")}
          </a>
        </div>
      )}
    </nav>
  )
}
