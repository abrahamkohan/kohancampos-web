import { notFound } from "next/navigation"
import { getProyectoById, getProyectosPublicados } from "@/lib/supabase-projects"
import type { ProyectoDetalle } from "@/lib/supabase-projects"
import { AmenitiesSection } from "@/components/amenity-carousel"
import { MessageCircle, MapPin, ExternalLink, ChevronLeft, ChevronRight, Navigation, FileText, Video, Globe } from "lucide-react"
import { LandingHero } from "./landing-hero"
import { LandingTypologias } from "./landing-typologias"
import { CopyButton } from "./copy-button"

export const dynamic = "force-dynamic"

const MOCK_PROYECTO: ProyectoDetalle = {
  id: "mock",
  nombre: "Torre Ycuá Bolados",
  zona: "Villa Morra, Asunción",
  ciudad: "Asunción",
  barrio: "Villa Morra",
  direccion: "Av. Mcal. López 4455 esq. Tte. Héctor Vera",
  estado: "en_pozo",
  desarrolladora: "Urban Domus S.A.",
  imagen: null,
  badge_analisis: "oportunidad",
  descripcion: "Torre residencial de alta gama en el corazón de Villa Morra. Concebida para quienes buscan un estilo de vida urbano con todas las comodidades, rodeada de los mejores restaurantes, comercios y servicios de la ciudad.",
  caracteristicas: "20 pisos · 2 subsuelos de cocheras · 80 unidades · Losa radiante · Doble vidrio hermético · Sistema domótico · Generador propio · Lobby climatizado con recepcionista",
  delivery_date: "2027-06-01",
  tipo_proyecto: "residencial",
  precio_desde: null,
  precio_hasta: null,
  moneda: "USD",
  maps_url: null,
  tour_360_url: null,
  brochure_url: null,
  links: [
    { type: "maps", name: "Google Maps", url: "#" },
    { type: "360", name: "Vista 360°", url: "#" },
    { type: "brochure", name: "Brochure PDF", url: "#" },
  ],
  fotos: ["https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=80"],
  typologies: [
    {
      id: "t1", name: "1 Dormitorio", area_m2: 52,
      bedrooms: 1, bathrooms: 1, units_available: null,
      features: ["Balcón", "Cocina integrada", "Piso vinílico"],
      images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80"],
      floor_plan: null,
    },
    {
      id: "t2", name: "2 Dormitorios", area_m2: 82,
      bedrooms: 2, bathrooms: 2, units_available: null,
      features: ["Balcón amplio", "Living-comedor", "Walk-in closet", "Lavadero"],
      images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80"],
      floor_plan: null,
    },
    {
      id: "t3", name: "3 Dormitorios", area_m2: 130,
      bedrooms: 3, bathrooms: 3, units_available: null,
      features: ["Terraza privada", "Suite principal", "Dependencia de servicio"],
      images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80"],
      floor_plan: null,
    },
  ],
  amenities: [
    { id: "a1", name: "Pileta climatizada", categoria: "interior", icon: "waves", sort_order: 1, images: [] },
    { id: "a2", name: "Gimnasio equipado", categoria: "interior", icon: "dumbbell", sort_order: 2, images: [] },
    { id: "a3", name: "Coworking", categoria: "interior", icon: "building-2", sort_order: 3, images: [] },
    { id: "a4", name: "Salón de usos múltiples", categoria: "interior", icon: "building-2", sort_order: 4, images: [] },
    { id: "a5", name: "Lobby con recepción 24hs", categoria: "edificio", icon: "shield", sort_order: 5, images: [] },
    { id: "a6", name: "Cocheras en subsuelo", categoria: "edificio", icon: "car", sort_order: 6, images: [] },
    { id: "a7", name: "Generador eléctrico propio", categoria: "edificio", icon: "flame", sort_order: 7, images: [] },
    { id: "a8", name: "Seguridad con cámaras", categoria: "edificio", icon: "shield", sort_order: 8, images: [] },
  ],
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const p = projectId === "mock" ? MOCK_PROYECTO : await getProyectoById(projectId)
  if (!p) return {}
  return {
    title: `${p.nombre} — Kohan & Campos`,
    description: p.descripcion ?? `Conocé el proyecto ${p.nombre}${p.zona ? ` en ${p.zona}` : ""}.`,
    openGraph: {
      title: p.nombre,
      description: p.descripcion ?? "",
      images: p.fotos[0] ? [{ url: p.fotos[0] }] : [],
    },
  }
}

export default async function LandingProyectoPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  const [p, allProjects] = await Promise.all([
    projectId === "mock" ? Promise.resolve(MOCK_PROYECTO) : getProyectoById(projectId),
    projectId === "mock" ? Promise.resolve([]) : getProyectosPublicados(),
  ])
  if (!p) notFound()

  const minPriceUsd = p.precio_desde ?? null

  const currentIdx = allProjects.findIndex(pr => pr.id === p.id)
  const prevProject = currentIdx > 0 ? allProjects[currentIdx - 1] : null
  const nextProject = currentIdx < allProjects.length - 1 ? allProjects[currentIdx + 1] : null

  const waMsg = encodeURIComponent(
    `Hola, me interesa conocer más sobre el proyecto ${p.nombre}`
  )
  const waUrl = `https://wa.me/595982000808?text=${waMsg}`

  return (
    <main className="min-h-screen bg-navy-deep pb-20 md:pb-0">

      {/* Navbar */}
      <div className="px-6 py-3 flex items-center justify-between border-b border-white/8 bg-navy-deep/95 backdrop-blur-sm sticky top-0 z-40 gap-4">
        <a href="/" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-navbar.svg" alt="Kohan & Campos" className="h-6 opacity-70" />
        </a>

        {/* Nav entre proyectos */}
        {(prevProject || nextProject) && (
          <div className="flex items-center gap-1 text-xs font-sans text-white/40">
            {prevProject ? (
              <a href={`/p/${prevProject.id}`} className="flex items-center gap-1 px-2 py-1 hover:text-white/80 transition-colors">
                <ChevronLeft size={12} />
                <span className="hidden sm:inline max-w-[120px] truncate">{prevProject.nombre}</span>
              </a>
            ) : <span className="w-8" />}
            <span className="text-white/15">|</span>
            {nextProject ? (
              <a href={`/p/${nextProject.id}`} className="flex items-center gap-1 px-2 py-1 hover:text-white/80 transition-colors">
                <span className="hidden sm:inline max-w-[120px] truncate">{nextProject.nombre}</span>
                <ChevronRight size={12} />
              </a>
            ) : <span className="w-8" />}
          </div>
        )}

        <div className="flex items-center gap-2 shrink-0">
          <CopyButton p={p} />
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white font-sans text-xs font-[600] uppercase tracking-[0.1em] hover:bg-emerald-500 transition-colors"
          >
            <MessageCircle size={11} />
            Consultar
          </a>
        </div>
      </div>

      {/* Hero */}
      <LandingHero
        nombre={p.nombre}
        zona={p.zona}
        estado={p.estado}
        badgeAnalisis={p.badge_analisis}
        coverUrl={p.fotos[0] ?? null}
        minPriceUsd={minPriceUsd}
        deliveryDate={p.delivery_date}
        desarrolladora={p.desarrolladora || null}
      />

      {/* Ficha rápida */}
      <div className="bg-navy-surface border-b border-navy-border/50">
        <div className="mx-auto max-w-6xl px-6 py-7">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-5">
            {p.zona && (
              <div className="flex flex-col space-y-1">
                <dt className="font-sans text-xs uppercase tracking-wider text-[#94a3b8]">Ubicación</dt>
                <dd className="font-sans text-[15px] font-semibold text-white leading-snug">{p.zona}</dd>
              </div>
            )}
            {p.delivery_date && (
              <div className="flex flex-col space-y-1">
                <dt className="font-sans text-xs uppercase tracking-wider text-[#94a3b8]">Entrega</dt>
                <dd className="font-sans text-[15px] font-semibold text-white leading-snug">
                  {new Date(p.delivery_date).toLocaleDateString("es-PY", { year: "numeric", month: "long" })}
                </dd>
              </div>
            )}
            {p.desarrolladora && (
              <div className="flex flex-col space-y-1">
                <dt className="font-sans text-xs uppercase tracking-wider text-[#94a3b8]">Desarrolladora</dt>
                <dd className="font-sans text-[15px] font-semibold text-white leading-snug">{p.desarrolladora}</dd>
              </div>
            )}
            {p.typologies.length > 0 && (
              <div className="flex flex-col space-y-1">
                <dt className="font-sans text-xs uppercase tracking-wider text-[#94a3b8]">Tipologías</dt>
                <dd className="font-sans text-[15px] font-semibold text-white leading-snug">
                  {p.typologies.map(t => t.name).join(", ")}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Sobre el proyecto */}
      {(p.descripcion || p.caracteristicas || p.direccion) && (
        <section className="px-6 py-20 bg-navy-deep border-t border-navy-border/30">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-sans text-xl font-semibold text-white mb-8">Sobre el proyecto</h2>
            <div className="flex flex-col gap-5 max-w-2xl">
              {p.direccion && (
                <div className="flex items-start gap-2">
                  <MapPin size={13} strokeWidth={1.5} className="text-[#94a3b8] shrink-0 mt-0.5" />
                  <span className="font-sans text-sm text-[#94a3b8]">{p.direccion}</span>
                </div>
              )}
              {p.descripcion && (
                <p className="font-sans text-sm leading-relaxed text-[#cbd5e1] whitespace-pre-line">
                  {p.descripcion}
                </p>
              )}
              {p.caracteristicas && (
                <p className="font-sans text-sm leading-relaxed text-[#94a3b8] whitespace-pre-line border-l-2 border-navy-border pl-4">
                  {p.caracteristicas}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Links */}
      {p.links.length > 0 && (
        <section className="px-6 pb-16 bg-navy-deep border-t border-navy-border/20">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap gap-3">
              {p.links.map((link, i) => {
                const Icon =
                  link.type === "maps" ? Navigation :
                  link.type === "360" ? Globe :
                  link.type === "brochure" ? FileText :
                  link.type === "video" ? Video :
                  ExternalLink
                return (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-5 py-2.5 rounded-lg bg-navy-card border border-navy-border text-[#cbd5e1] hover:bg-[#223a52] hover:border-[#3a5a7a] hover:text-white font-sans text-sm font-[400] tracking-wide transition-all duration-200"
                  >
                    <Icon size={14} strokeWidth={1.5} />
                    {link.name}
                  </a>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Tipologías */}
      {p.typologies.length > 0 && (
        <section className="px-6 py-20 bg-navy-surface border-t border-navy-border/30">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-sans text-xl font-semibold text-white mb-8">Unidades disponibles</h2>
            <LandingTypologias typologies={p.typologies} />
          </div>
        </section>
      )}

      {/* Amenities */}
      {p.amenities.length > 0 && (
        <section className="px-6 py-20 bg-navy-deep border-t border-navy-border/30">
          <div className="mx-auto max-w-6xl">
            <AmenitiesSection amenities={p.amenities} />
          </div>
        </section>
      )}

      {/* CTA Final */}
      <section className="px-6 py-20 bg-navy-surface border-t border-navy-border/30">
        <div className="mx-auto max-w-6xl">
          <div className="border border-navy-border bg-navy-card p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <p className="font-sans text-2xl font-semibold text-white mb-2">
                ¿Te interesa {p.nombre}?
              </p>
              <p className="font-sans text-sm font-[300] text-[#cbd5e1]">
                Analizamos la inversión juntos, sin compromiso.
              </p>
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center gap-3 px-10 py-4 bg-gold text-navy-deep font-sans text-sm font-[700] uppercase tracking-[0.2em] hover:bg-gold-light transition-colors shadow-[0_4px_24px_rgba(201,185,154,0.25)] hover:shadow-[0_4px_32px_rgba(201,185,154,0.4)]"
            >
              <MessageCircle size={16} />
              Hablar con un asesor
            </a>
          </div>
        </div>
      </section>

      {/* Sticky CTA mobile */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 p-3 bg-navy-deep/95 backdrop-blur-sm border-t border-gold/10">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-600 text-white font-sans text-sm font-[600] uppercase tracking-[0.2em] hover:bg-emerald-500 transition-colors"
        >
          <MessageCircle size={15} />
          Consultar por WhatsApp
        </a>
      </div>

    </main>
  )
}
