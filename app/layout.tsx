import type { Metadata, Viewport } from "next"
import { Nunito } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/components/language-context"
import Script from "next/script"
import "./globals.css"

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "700"],
  variable: "--font-nunito",
})

export const metadata: Metadata = {
  title: "Kohan & Campos Real Estate | Inversiones Inmobiliarias en Paraguay",
  description:
    "Asesoramiento inmobiliario independiente en Paraguay. Ayudamos a inversores argentinos y extranjeros a identificar oportunidades claras y seguras. Sin comisiones ocultas, sin sorpresas.",
  keywords: [
    "inversiones inmobiliarias Paraguay",
    "real estate Paraguay",
    "invertir en Paraguay",
    "propiedades Paraguay inversores",
    "asesor inmobiliario Paraguay",
    "compra pozo Paraguay",
    "Kohan Campos",
  ],
  authors: [{ name: "Kohan & Campos Real Estate" }],
  creator: "Kohan & Campos Real Estate",
  metadataBase: new URL("https://kohancampos.com.py"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://kohancampos.com.py",
    title: "Kohan & Campos Real Estate | Inversiones en Paraguay",
    description:
      "Asesoramiento inmobiliario independiente. Invertís en Paraguay, nosotros nos aseguramos de que valga la pena.",
    siteName: "Kohan & Campos Real Estate",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kohan & Campos Real Estate - Paraguay",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kohan & Campos Real Estate | Inversiones en Paraguay",
    description:
      "Asesoramiento inmobiliario independiente. Invertís en Paraguay, nosotros nos aseguramos de que valga la pena.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export const viewport: Viewport = {
  themeColor: "#0F1D35",
  width: "device-width",
  initialScale: 1,
}

const schemaMarkup = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Kohan & Campos Real Estate",
  url: "https://kohancampos.com.py",
  logo: "https://kohancampos.com.py/logo-hero.svg",
  image: "https://kohancampos.com.py/og-image.png",
  description:
    "Asesoramiento inmobiliario independiente en Paraguay. Especialistas en inversiones para argentinos y extranjeros.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "PY",
    addressLocality: "Asunción",
  },
  areaServed: ["Paraguay", "Argentina", "Brasil", "Alemania"],
  serviceType: [
    "Asesoramiento inmobiliario",
    "Inversiones en pozo",
    "Reventa con inquilino",
    "Consultoría de inversiones",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["Spanish", "English", "Portuguese", "German"],
  },
  sameAs: ["https://kohancampos.com.py"],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <Script
          id="schema-markup"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      </head>
      <body className={`${nunito.variable} font-sans antialiased`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}