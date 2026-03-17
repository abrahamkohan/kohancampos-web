import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { TerminadaCard } from "@/components/property-card"
import { getPropiedadesPublicadas } from "@/lib/supabase-properties"

export const revalidate = 60

export default async function PropiedadesPage() {
  const propiedades = await getPropiedadesPublicadas()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-navy-deep pt-24">
        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-[1200px]">
            <span className="mb-4 inline-block font-sans text-xs font-[600] uppercase tracking-[0.3em] text-gold">
              Oportunidades de Inversión
            </span>
            <h1 className="font-sans text-[clamp(2rem,4vw,3.5rem)] font-[200] leading-[1.1] text-kc-white">
              Stock de propiedades
            </h1>
            <p className="mt-4 max-w-xl font-sans text-base font-[300] text-kc-white/60">
              Selección curada de propiedades listas para habitar o invertir en Paraguay.
            </p>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto max-w-[1200px]">
            {propiedades.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {propiedades.map((p) => (
                  <TerminadaCard key={p.id} p={p} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="font-sans text-base font-[300] text-kc-white/30">
                  No hay propiedades publicadas por el momento.
                </p>
                <a
                  href="/#contacto"
                  className="mt-8 bg-gold px-8 py-3 font-sans text-[10px] font-[600] uppercase tracking-[0.2em] text-navy-deep transition-all hover:bg-gold-light"
                >
                  Consultanos
                </a>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
