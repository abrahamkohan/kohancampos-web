"use client"
import { useState, useEffect, useRef } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import { useLanguage } from "@/components/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"

const INVERSIONES = [
  { label: "Propiedades", href: "/propiedades" },
  { label: "Proyectos",   href: "/proyectos" },
]

export function Navbar() {
  const { t } = useLanguage()
  const [scrolled, setScrolled]         = useState(false)
  const [mobileOpen, setMobileOpen]     = useState(false)
  const [invOpen, setInvOpen]           = useState(false)   // mobile accordion
  const [dropVisible, setDropVisible]   = useState(false)   // desktop dropdown
  const dropTimer                       = useRef<ReturnType<typeof setTimeout> | null>(null)

  const navLinks = [
    { label: t("nav.quienes"),  href: "/#quienes-somos" },
    { label: t("nav.proceso"),  href: "/#proceso" },
    { label: t("nav.contacto"), href: "/#contacto" },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  function onDropEnter() {
    if (dropTimer.current) clearTimeout(dropTimer.current)
    setDropVisible(true)
  }
  function onDropLeave() {
    dropTimer.current = setTimeout(() => setDropVisible(false), 120)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-navy-deep/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4 lg:py-5">
        <a href="/" className="flex items-center">
          <img src="/logo-navbar.svg" alt="Kohan & Campos" className="h-[22px] w-auto md:h-[28px]" />
        </a>

        {/* ── Desktop ── */}
        <div className="hidden items-center gap-8 lg:flex">

          {/* Inversiones dropdown */}
          <div
            className="relative"
            onMouseEnter={onDropEnter}
            onMouseLeave={onDropLeave}
          >
            <button
              type="button"
              className="relative flex items-center gap-1 font-sans text-sm font-[300] tracking-wide text-kc-white/80 transition-colors hover:text-gold"
            >
              Inversiones
              <ChevronDown
                size={13}
                strokeWidth={1.5}
                className={`mt-px transition-transform duration-200 ${dropVisible ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown panel */}
            <div
              className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-40 flex flex-col gap-0 rounded-xl border border-white/8 bg-navy-deep/98 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-200 origin-top ${
                dropVisible ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"
              }`}
            >
              {INVERSIONES.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="px-5 py-3 font-sans text-sm font-[300] tracking-wide text-kc-white/75 hover:text-gold hover:bg-white/[0.04] transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Regular links */}
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

        {/* ── Mobile toggle ── */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-kc-white p-2"
            aria-label={mobileOpen ? "Cerrar menu" : "Abrir menu"}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="flex flex-col items-center gap-5 bg-navy-deep/98 px-6 pb-8 pt-4 backdrop-blur-md lg:hidden">

          {/* Inversiones accordion */}
          <div className="flex flex-col items-center gap-0 w-full">
            <button
              type="button"
              onClick={() => setInvOpen(o => !o)}
              className="flex items-center gap-1.5 font-sans text-sm font-[300] tracking-wide text-kc-white/80 hover:text-gold transition-colors"
            >
              Inversiones
              <ChevronDown
                size={13}
                strokeWidth={1.5}
                className={`mt-px transition-transform duration-200 ${invOpen ? "rotate-180" : ""}`}
              />
            </button>
            {invOpen && (
              <div className="mt-3 flex flex-col items-center gap-3 border-t border-white/8 pt-3 w-full">
                {INVERSIONES.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-sans text-sm font-[300] tracking-wide text-gold/80 hover:text-gold transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Regular links */}
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
            href="/#contacto"
            onClick={() => setMobileOpen(false)}
            className="border border-gold px-6 py-2.5 font-sans text-xs font-[600] uppercase tracking-[0.15em] text-kc-white transition-all hover:bg-gold hover:text-navy-deep"
          >
            {t("nav.contacto")}
          </a>
          <div className="h-px w-10 bg-kc-white/10 my-2" />
          <LanguageSwitcher />
        </div>
      )}
    </nav>
  )
}
