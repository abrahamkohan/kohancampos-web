"use client"
import { useTransition, useEffect } from "react"
import { useLanguage } from "@/components/language-context"

function FlagES() {
  return <svg viewBox="0 0 20 15" className="w-5 h-4 rounded-sm overflow-hidden"><rect width="20" height="15" fill="#c60b1e" /><rect y="3.75" width="20" height="7.5" fill="#ffc400" /></svg>
}
function FlagEN() {
  return <svg viewBox="0 0 60 30" className="w-5 h-4 rounded-sm overflow-hidden"><rect width="60" height="30" fill="#012169" /><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" /><path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" /><path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" /><path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" /></svg>
}
function FlagPT() {
  return <svg viewBox="0 0 20 14" className="w-5 h-4 rounded-sm overflow-hidden"><rect width="20" height="14" fill="#009c3b" /><polygon points="8,0 8,14 20,7" fill="#ffdf00" /><circle cx="14" cy="7" r="3" fill="#002776" /></svg>
}
function FlagDE() {
  return <svg viewBox="0 0 5 3" className="w-5 h-4 rounded-sm overflow-hidden"><rect width="5" height="1" fill="#000" /><rect y="1" width="5" height="1" fill="#D00" /><rect y="2" width="5" height="1" fill="#FFCE00" /></svg>
}

const languages = [
  { code: "es", label: "ES", Flag: FlagES },
  { code: "en", label: "EN", Flag: FlagEN },
  { code: "pt", label: "PT", Flag: FlagPT },
  { code: "de", label: "DE", Flag: FlagDE },
]

export function LanguageSwitcher() {
  const { locale } = useLanguage()
  const [, startTransition] = useTransition()

  useEffect(() => {
    const savedPos = sessionStorage.getItem("scrollPos")
    if (savedPos) {
      window.scrollTo(0, parseInt(savedPos))
      sessionStorage.removeItem("scrollPos")
    }
  }, [])

  const handleChange = (newLocale: string) => {
    startTransition(() => {
      sessionStorage.setItem("scrollPos", String(window.scrollY))
      document.cookie = `locale=${newLocale};path=/;max-age=31536000`
      window.location.reload()
    })
  }

  return (
    <div className="flex items-center gap-1">
      {languages.map(({ code, label, Flag }) => (
        <button
          key={code}
          onClick={() => handleChange(code)}
          className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-[11px] font-semibold tracking-wide transition-all ${locale === code
              ? "bg-gold/20 text-gold border border-gold/30"
              : "text-kc-white/50 hover:text-kc-white hover:bg-white/5"
            }`}
        >
          <Flag />
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}