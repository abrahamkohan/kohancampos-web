import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProyectoCard } from "@/components/project-card"
import { getProyectosPublicados } from "@/lib/supabase-projects"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Proyectos | Kohan & Campos",
  description: "Proyectos inmobiliarios seleccionados y analizados con criterio de inversión.",
}

export default async function ProyectosPage() {
  const proyectos = await getProyectosPublicados()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-navy-deep pt-24">

        {/* Header */}
        <section className="px-6 py-16 md:py-20">
          <div className="mx-auto max-w-[1200px]">
            <span className="mb-4 inline-block font-sans text-xs font-[600] uppercase tracking-[0.3em] text-gold">
              Inversión en real estate
            </span>
            <h1 className="font-sans text-[clamp(2rem,4vw,3.5rem)] font-[200] leading-[1.1] text-kc-white">
              Proyectos inmobiliarios<br className="hidden md:block" /> seleccionados
            </h1>
            <p className="mt-4 max-w-xl font-sans text-base font-[300] text-kc-white/60">
              Analizados con criterio de inversión.
            </p>

            {/* Leyenda de badges */}
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { label: "Oportunidad", cls: "bg-gold text-navy-deep" },
                { label: "Estable",     cls: "bg-blue-500/20 text-blue-200" },
                { label: "A evaluar",   cls: "bg-kc-white/10 text-kc-white/60" },
              ].map(b => (
                <span key={b.label}
                  className={`inline-flex items-center gap-2 rounded-sm px-3 py-1.5 font-sans text-[10px] font-[700] uppercase tracking-[0.2em] ${b.cls}`}
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                  {b.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-[1200px]">
            {proyectos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <p className="font-sans text-sm font-[300] text-kc-white/40 max-w-sm">
                  Estamos curating la selección de proyectos. Volvé pronto o consultanos directamente.
                </p>
                <a
                  href="https://wa.me/595982000808"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 border border-gold px-6 py-2.5 font-sans text-[10px] font-[600] uppercase tracking-[0.2em] text-gold transition-all hover:bg-gold hover:text-navy-deep"
                >
                  Consultar proyectos
                </a>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {proyectos.map(p => (
                  <ProyectoCard key={p.id} p={p} />
                ))}
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
