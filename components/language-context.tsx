"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import es from "@/messages/es.json"
import en from "@/messages/en.json"
import pt from "@/messages/pt.json"
import de from "@/messages/de.json"

const messages = { es, en, pt, de } as const
export type Locale = keyof typeof messages

type Messages = typeof es

interface LanguageContextType {
  locale: Locale
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "es",
  t: (key) => key,
})

function getNestedValue(obj: Record<string, unknown>, key: string): string {
  const keys = key.split(".")
  let current: unknown = obj
  for (const k of keys) {
    if (typeof current !== "object" || current === null) return key
    current = (current as Record<string, unknown>)[k]
  }
  return typeof current === "string" ? current : key
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("es")

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )locale=([^;]*)/)
    const cookieLocale = match?.[1]
    if (cookieLocale && cookieLocale in messages) {
      setLocale(cookieLocale as Locale)
    }
  }, [])

  const t = (key: string): string => {
    return getNestedValue(messages[locale] as unknown as Record<string, unknown>, key)
  }

  return (
    <LanguageContext.Provider value={{ locale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
