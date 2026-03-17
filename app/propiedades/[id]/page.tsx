import { notFound } from "next/navigation"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getPropiedadById } from "@/lib/supabase-properties"
import { MapPin, Bed, Bath, Maximize2, Car, ArrowLeft } from "lucide-react"

export const revalidate = 60

const TIPO_LABEL: Record<string, string> = {
  departamento: "Departamento", casa: "Casa", terreno: "Terreno", comercial: "Comercial",
}
const CONDICION_LABEL: Record<string, string> = {
  nuevo: "Nuevo", usado: "Usado", reventa: "Reventa",
}

export default async function PropiedadDetallePage({ params }: { params: { id: string } }) {
  const p = await getPropiedadById(params.id)
  if (!p) notFound()

  const titulo = p.titulo ?? (TIPO_LABEL[p.tipo] ?? p.tipo) + " en " + (p.zona ?? "Sin ubicación")
  const precio = p.precio != null
    ? (p.moneda === "usd" ? "USD" : "PYG") + " " + p.precio.toLocaleString("es-PY")
    : null

  const portadaUrl = p.foto_portada
    ? process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/property-photos/" + p.foto_portada
    : p.fotos[0] ?? null

  const allPhotos = p.fotos.length > 0 ? p.fotos : portadaUrl ? [portadaUrl] : []

  const chips = [
    p.dormitorios != null && { icon: "bed", label: p.dormitorios === 0 ? "Monoambiente" : p.dormitorios + " dorm." },
    p.banos != null && { icon: "bath", label: p.banos + " baño" + (p.banos !== 1 ? "s" : "") },
    p.superficie_m2 != null && { icon: "m2", label: p.superficie_m2 + " m²" },
    p.garajes != null && { icon: "car", label: p.garajes + " garage" + (p.garajes !== 1 ? "s" : "") },
  ].filter(Boolean) as { icon: string; label: string }[]

  const detalles = [
    p.condicion && { label: "Condición", value: CONDICION_LABEL[p.condicion] ?? p.condicion },
    p.zona && { label: "Zona", value: p.zona },
    p.direccion && { label: "Dirección", value: p.direccion },
    p.superficie_cubierta_m2 != null && { label: "Sup. cubierta", value: p.superficie_cubierta_m2 + " m²" },
    p.terreno_m2 != null && { label: "Terreno", value: p.terreno_m2 + " m²" },
    p.piso != null && { label: "Piso", value: String(p.piso) },
  ].filter(Boolean) as { label: string; value: string }[]

  const whatsappMsg = encodeURIComponent("Hola, me interesa conocer más sobre: " + titulo)
  const whatsappUrl = "https://wa.me/595982000808?text=" + whatsappMsg

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-navy-deep pt-24">
        <div className="mx-auto max-w-[900px] px-6 py-12">

          {/* Back */}
          <a href="/propiedades" className="mb-8 inline-flex items-center gap-2 font-sans text-xs font-[400] uppercase tracking-[0.15em] text-kc-white/40 transition-colors hover:text-gold">
            <ArrowLeft size={14} /> Volver
          </a>

          {/* Fotos */}
          {allPhotos.length > 0 && (
            <div className={`mb-8 grid gap-2 ${allPhotos.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
              {allPhotos.slice(0, 4).map((url, i) => (
                <div key={i} className={`relative overflow-hidden ${i === 0 && allPhotos.length > 1 ? "col-span-2 h-72" : "h-44"}`}>
                  <Image src={url} alt={titulo} fill className="object-cover" sizes="900px" />
                </div>
              ))}
            </div>
          )}

          {/* Header */}
          <div className="mb-8 border-b border-gold/10 pb-8">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="bg-gold/10 px-3 py-1 font-sans text-[10px] font-[600] uppercase tracking-[0.15em] text-gold">
                {p.operacion === "venta" ? "En Venta" : "En Alquiler"}
              </span>
              <span className="border border-gold/20 px-3 py-1 font-sans text-[10px] font-[600] uppercase tracking-[0.15em] text-kc-white/50">
                {TIPO_LABEL[p.tipo] ?? p.tipo}
              </span>
            </div>
            <h1 className="mb-3 font-sans text-3xl font-[200] leading-snug text-kc-white">{titulo}</h1>
            {(p.zona || p.direccion) && (
              <p className="flex items-center gap-2 font-sans text-sm font-[300] text-kc-white/50">
                <MapPin size={14} className="text-gold/50" />
                {[p.zona, p.direccion].filter(Boolean).join(", ")}
              </p>
            )}
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 flex flex-col gap-8">

              {/* Chips */}
              {chips.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {chips.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 border border-gold/15 px-4 py-2.5 font-sans text-sm font-[300] text-kc-white/70">
                      {c.icon === "bed" && <Bed size={15} className="text-gold/50" />}
                      {c.icon === "bath" && <Bath size={15} className="text-gold/50" />}
                      {c.icon === "m2" && <Maximize2 size={15} className="text-gold/50" />}
                      {c.icon === "car" && <Car size={15} className="text-gold/50" />}
                      {c.label}
                    </div>
                  ))}
                </div>
              )}

              {/* Descripción */}
              {p.descripcion && (
                <div>
                  <p className="mb-3 font-sans text-[10px] font-[600] uppercase tracking-[0.2em] text-gold/60">Descripción</p>
                  <p className="whitespace-pre-line font-sans text-sm font-[300] leading-7 text-kc-white/70">{p.descripcion}</p>
                </div>
              )}

              {/* Detalles */}
              {detalles.length > 0 && (
                <div>
                  <p className="mb-4 font-sans text-[10px] font-[600] uppercase tracking-[0.2em] text-gold/60">Detalles</p>
                  <div className="grid grid-cols-2 gap-2">
                    {detalles.map((d) => (
                      <div key={d.label} className="flex items-center justify-between border border-gold/10 px-4 py-3">
                        <span className="font-sans text-xs font-[300] text-kc-white/40">{d.label}</span>
                        <span className="font-sans text-xs font-[400] text-kc-white/80">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar precio + CTA */}
            <div className="flex flex-col gap-4">
              <div className="border border-gold/15 p-6">
                {precio && (
                  <>
                    <p className="mb-1 font-sans text-[10px] font-[600] uppercase tracking-[0.2em] text-gold/60">Precio</p>
                    <p className="mb-6 font-sans text-2xl font-[300] text-gold">{precio}</p>
                  </>
                )}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gold py-3 text-center font-sans text-[10px] font-[600] uppercase tracking-[0.2em] text-navy-deep transition-all hover:bg-gold-light"
                >
                  Consultar
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
