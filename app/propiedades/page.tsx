import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PozoCard, TerminadaCard } from "@/components/property-card"
import { getProyectosEnPozo } from "@/lib/notion"
import { getPropiedadesPublicadas } from "@/lib/supabase-properties"
import { PropertiesTabs } from "@/components/properties-tabs"

export const revalidate = 60 // ISR: refresca cada 60 segundos

export default async function PropiedadesPage() {
  const [enPozo, terminadas] = await Promise.all([
    getProyectosEnPozo().catch(() => []),
    getPropiedadesPublicadas(),
  ])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-navy-deep pt-24">
        {/* Header */}
        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-[1200px]">
            <span className="mb-4 inline-block font-sans text-xs font-[600] uppercase tracking-[0.3em] text-gold">
              Oportunidades de Inversión
            </span>
            <h1 className="font-sans text-[clamp(2rem,4vw,3.5rem)] font-[200] leading-[1.1] text-kc-white">
              Stock de propiedades
            </h1>
            <p className="mt-4 max-w-xl font-sans text-base font-[300] text-kc-white/60">
              Selección curada de proyectos en desarrollo y propiedades listas para habitar o invertir en Paraguay.
            </p>
          </div>
        </section>

        {/* Tabs + Grids */}
        <PropertiesTabs
          pozoCards={enPozo.map((p) => <PozoCard key={p.id} p={p} />)}
          terminadasCards={terminadas.map((p) => <TerminadaCard key={p.id} p={p} />)}
          pozoCount={enPozo.length}
          terminadasCount={terminadas.length}
        />
      </main>
      <Footer />
    </>
  )
}
