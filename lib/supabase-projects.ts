// lib/supabase-projects.ts

export type EstadoObra   = "en_pozo" | "en_obra" | "terminado"
export type BadgeAnalisis = "oportunidad" | "estable" | "a_evaluar"

export interface Proyecto {
  id:           string
  slug:         string
  nombre:       string
  ubicacion:    string
  estado:       EstadoObra
  desarrolladora: string
  imagen:       string | null
  badge_analisis: BadgeAnalisis | null
}

interface SupabaseProyecto {
  id:            string
  slug:          string
  nombre:        string | null
  ubicacion:     string | null
  estado:        string | null
  desarrolladora: string | null
  imagen_portada: string | null
  badge_analisis: string | null
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function getProyectosPublicados(): Promise<Proyecto[]> {
  try {
    const res = await fetch(
      SUPABASE_URL + "/rest/v1/projects?publicado=eq.true&select=id,slug,nombre,ubicacion,estado,desarrolladora,imagen_portada,badge_analisis&order=created_at.desc",
      {
        headers: { apikey: SUPABASE_KEY, Prefer: "return=representation" },
        next: { revalidate: 60 },
      }
    )
    if (!res.ok) return []
    const data: SupabaseProyecto[] = await res.json()
    return data.map((p): Proyecto => ({
      id:             p.id,
      slug:           p.slug ?? p.id,
      nombre:         p.nombre ?? "Proyecto sin nombre",
      ubicacion:      p.ubicacion ?? "",
      estado:         (p.estado as EstadoObra) ?? "en_pozo",
      desarrolladora: p.desarrolladora ?? "",
      badge_analisis: (p.badge_analisis as BadgeAnalisis) ?? null,
      imagen: p.imagen_portada
        ? SUPABASE_URL + "/storage/v1/object/public/project-photos/" + p.imagen_portada
        : null,
    }))
  } catch {
    return []
  }
}
