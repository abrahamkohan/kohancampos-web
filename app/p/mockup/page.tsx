// Maqueta estática — sin datos reales. Usala como base para Illustrator.
// URL: /p/mockup

import { MapPin, CalendarDays, MessageCircle, FileImage, Building2, ExternalLink } from "lucide-react"

// ─── Bloque placeholder de imagen ────────────────────────────────────────────

function ImgPlaceholder({
  label,
  aspect = "aspect-video",
  className = "",
}: {
  label: string
  aspect?: string
  className?: string
}) {
  return (
    <div
      className={`${aspect} ${className} w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gold/30 bg-navy-primary`}
    >
      <div className="w-8 h-8 border border-gold/30 flex items-center justify-center">
        <FileImage size={16} className="text-gold/40" />
      </div>
      <span className="font-sans text-[10px] font-[600] uppercase tracking-[0.2em] text-gold/40">
        {label}
      </span>
    </div>
  )
}

// ─── Sección label ────────────────────────────────────────────────────────────

function SectionLabel({ text }: { text: string }) {
  return (
    <span className="block font-sans text-[10px] font-[600] uppercase tracking-[0.3em] text-gold/60 mb-1">
      {text}
    </span>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function Badge({ label, cls }: { label: string; cls: string }) {
  return (
    <span className={`rounded-sm px-2.5 py-1 font-sans text-[9px] font-[700] uppercase tracking-[0.15em] ${cls}`}>
      {label}
    </span>
  )
}

// ─── Card de tipología ────────────────────────────────────────────────────────

function TypCard({
  nombre,
  m2,
  precio,
  features,
}: {
  nombre: string
  m2: string
  precio: string
  features: string
}) {
  return (
    <div className="flex flex-col border border-gold/20 bg-navy-primary">
      <ImgPlaceholder label="img tipología" aspect="aspect-video" />
      <div className="flex flex-col gap-3 p-5 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-sans text-base font-[300] text-kc-white">{nombre}</h3>
          <span className="font-sans text-xs font-[300] text-kc-white/40 shrink-0">{m2}</span>
        </div>
        <div className="border-t border-gold/10 pt-3">
          <span className="block font-sans text-[9px] font-[600] uppercase tracking-[0.2em] text-gold/60 mb-0.5">
            Precio desde
          </span>
          <span className="font-sans text-xl font-[300] text-kc-white">{precio}</span>
        </div>
        <p className="font-sans text-xs font-[300] text-kc-white/45">{features}</p>
        <button
          type="button"
          className="mt-auto flex items-center gap-2 w-fit px-3 py-1.5 border border-gold/25 text-kc-white/60 font-sans text-xs font-[500] tracking-wide"
        >
          <FileImage size={12} />
          Ver plano
        </button>
      </div>
    </div>
  )
}

// ─── Card de amenity ──────────────────────────────────────────────────────────

function AmenityCard({ nombre }: { nombre: string }) {
  return (
    <div className="flex flex-col gap-3">
      <ImgPlaceholder label="img amenity" aspect="aspect-square" />
      <p className="font-sans text-sm font-[400] text-kc-white/80">{nombre}</p>
    </div>
  )
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default function MaquetaLanding() {
  return (
    <main className="min-h-screen bg-navy-deep pb-20 md:pb-0">

      {/* ── NAVBAR ────────────────────────────────────────────────────────────── */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-gold/20 bg-navy-deep sticky top-0 z-40">
        <span className="font-sans text-sm font-[300] tracking-[0.3em] uppercase text-kc-white">
          Kohan & Campos
        </span>
        <button
          type="button"
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-sans text-xs font-[600] uppercase tracking-[0.15em]"
        >
          <MessageCircle size={12} />
          Consultar
        </button>
      </div>

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative w-full border-b border-gold/10" style={{ minHeight: "72vh" }}>

        {/* Imagen fondo */}
        <div className="absolute inset-0">
          <ImgPlaceholder label="img portada" aspect="" className="absolute inset-0 h-full rounded-none border-0 border-b-0" />
        </div>

        {/* Gradiente overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/70 via-transparent to-transparent" />

        {/* Contenido */}
        <div className="relative z-10 flex flex-col justify-end min-h-[72vh] px-6 pb-10 md:pb-16">
          <div className="mx-auto w-full max-w-[1100px]">
            <div className="max-w-lg">

              {/* Badges */}
              <div className="flex items-center gap-2 mb-4">
                <Badge label="En pozo" cls="bg-navy-deep/70 text-violet-300 border border-violet-400/30 backdrop-blur-sm" />
                <Badge label="Oportunidad" cls="bg-gold text-navy-deep" />
              </div>

              {/* Nombre */}
              <h1 className="font-sans text-3xl md:text-5xl font-[200] leading-tight text-kc-white mb-4">
                Nombre del Proyecto
              </h1>

              {/* Meta */}
              <div className="flex flex-col gap-1.5 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin size={12} strokeWidth={1.5} className="text-gold/60 shrink-0" />
                  <span className="font-sans text-sm font-[300] text-kc-white/70">Zona / Ciudad</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays size={12} strokeWidth={1.5} className="text-gold/60 shrink-0" />
                  <span className="font-sans text-sm font-[300] text-kc-white/70">Entrega: diciembre de 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 size={12} strokeWidth={1.5} className="text-gold/60 shrink-0" />
                  <span className="font-sans text-sm font-[300] text-kc-white/70">Nombre Desarrolladora</span>
                </div>
              </div>

              {/* Precio desde */}
              <div className="inline-block border border-gold/30 px-4 py-3 bg-navy-deep/60 backdrop-blur-sm">
                <span className="block font-sans text-[9px] font-[600] uppercase tracking-[0.3em] text-gold/60 mb-0.5">
                  Precio desde
                </span>
                <span className="font-sans text-2xl md:text-3xl font-[300] text-kc-white">
                  USD 65.000
                </span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── SOBRE EL PROYECTO ─────────────────────────────────────────────────── */}
      <section className="px-6 py-12 border-t border-gold/10">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-6">
            <SectionLabel text="El proyecto" />
            <h2 className="font-sans text-xl font-[200] text-kc-white">Sobre el proyecto</h2>
          </div>
          <div className="flex flex-col gap-6 max-w-2xl">
            <div className="flex items-start gap-2">
              <MapPin size={14} strokeWidth={1.5} className="text-gold/50 shrink-0 mt-0.5" />
              <span className="font-sans text-sm font-[300] text-kc-white/60">Av. Principal 1234, Asunción</span>
            </div>
            <p className="font-sans text-sm font-[300] text-kc-white/70 leading-relaxed">
              Descripción del proyecto. Un párrafo corto que resume la propuesta, el concepto y los
              atributos principales del emprendimiento para el cliente.
            </p>
            <p className="font-sans text-sm font-[300] text-kc-white/55 leading-relaxed border-l border-gold/20 pl-4">
              Torre de 20 pisos · 80 unidades · Cocheras en subsuelo · Losa radiante · Doble
              vidrio · Sistema de seguridad integrado · Lobby climatizado
            </p>
          </div>
        </div>
      </section>

      {/* ── LINKS ─────────────────────────────────────────────────────────────── */}
      <section className="px-6 pb-10 border-t border-gold/10 pt-10">
        <div className="mx-auto max-w-[1100px]">
          <div className="flex flex-wrap gap-2">
            {["Google Maps", "Vista 360°", "Brochure PDF", "Video del proyecto"].map(label => (
              <span
                key={label}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gold/25 text-kc-white/60 font-sans text-xs font-[400] tracking-wide"
              >
                <ExternalLink size={11} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIPOLOGÍAS ────────────────────────────────────────────────────────── */}
      <section className="px-6 py-12 border-b border-gold/10">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-6">
            <SectionLabel text="Tipologías" />
            <h2 className="font-sans text-xl font-[200] text-kc-white">Unidades disponibles</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <TypCard
              nombre="1 Dormitorio"
              m2="30 m²"
              precio="USD 55.000"
              features="Balcón · Cocina integrada · 1 baño"
            />
            <TypCard
              nombre="2 Dormitorios"
              m2="55 m²"
              precio="USD 90.000"
              features="Balcón · Living · 2 baños · Depósito"
            />
            <TypCard
              nombre="3 Dormitorios"
              m2="80 m²"
              precio="USD 130.000"
              features="Terraza · Suite principal · 3 baños"
            />
          </div>
        </div>
      </section>

      {/* ── AMENITIES ─────────────────────────────────────────────────────────── */}
      <section className="px-6 py-12 border-b border-gold/10">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-6">
            <SectionLabel text="Infraestructura" />
            <h2 className="font-sans text-2xl font-[200] text-kc-white">Amenities del proyecto</h2>
          </div>

          {/* Interior */}
          <p className="font-sans text-[10px] font-[600] uppercase tracking-[0.25em] text-gold/50 mb-4">Interior</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <AmenityCard nombre="Pileta climatizada" />
            <AmenityCard nombre="Gimnasio" />
            <AmenityCard nombre="Coworking" />
          </div>

          {/* Edificio */}
          <p className="font-sans text-[10px] font-[600] uppercase tracking-[0.25em] text-gold/50 mb-4">Edificio</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AmenityCard nombre="Lobby" />
            <AmenityCard nombre="Seguridad 24hs" />
            <AmenityCard nombre="Estacionamiento" />
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────────────────────── */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-[1100px]">
          <div className="border border-gold/20 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div>
              <p className="font-sans text-lg font-[200] text-kc-white">
                ¿Te interesa este proyecto?
              </p>
              <p className="font-sans text-sm font-[300] text-kc-white/50 mt-1">
                Analizamos la inversión juntos, sin compromiso.
              </p>
            </div>
            <button
              type="button"
              className="flex-shrink-0 flex items-center gap-2 px-8 py-4 bg-gold text-navy-deep font-sans text-xs font-[700] uppercase tracking-[0.2em]"
            >
              <MessageCircle size={14} />
              Hablar con un asesor
            </button>
          </div>
        </div>
      </section>

      {/* ── STICKY CTA MOBILE ─────────────────────────────────────────────────── */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 p-3 bg-navy-deep border-t border-gold/10">
        <button
          type="button"
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-600 text-white font-sans text-sm font-[600] uppercase tracking-[0.2em]"
        >
          <MessageCircle size={15} />
          Consultar por WhatsApp
        </button>
      </div>

    </main>
  )
}
