// lib/supabase-projects.ts
// Fetch proyectos desde el mismo Supabase del sistema interno.

export type EstadoObra    = "en_pozo" | "en_obra" | "terminado"
export type BadgeAnalisis = "oportunidad" | "estable" | "a_evaluar"

export interface Proyecto {
  id:             string
  nombre:         string
  ubicacion:      string
  estado:         EstadoObra
  desarrolladora: string
  imagen:         string | null
  badge_analisis: BadgeAnalisis | null
}

// ─── Tipos Supabase (tabla projects) ─────────────────────────────────────────

interface SupabaseProyecto {
  id:             string
  name:           string | null
  location:       string | null
  status:         "en_pozo" | "en_construccion" | "entregado" | null
  developer_name: string | null
  badge_analisis: string | null
  project_photos: { storage_path: string }[]
}

// ─── Mapeo status BD → estado display ────────────────────────────────────────

function toEstado(s: string | null): EstadoObra {
  if (s === "en_pozo")       return "en_pozo"
  if (s === "en_construccion") return "en_obra"
  if (s === "entregado")     return "terminado"
  return "en_pozo"
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function getProyectosPublicados(): Promise<Proyecto[]> {
  try {
    const res = await fetch(
      SUPABASE_URL +
        "/rest/v1/projects" +
        "?publicado_en_web=eq.true" +
        "&select=id,name,location,status,developer_name,badge_analisis,project_photos(storage_path)" +
        "&project_photos.order=sort_order.asc" +
        "&project_photos.limit=1" +
        "&order=created_at.desc",
      {
        headers: { apikey: SUPABASE_KEY, Prefer: "return=representation" },
        next: { revalidate: 60 },
      }
    )

    if (!res.ok) return []
    const data: SupabaseProyecto[] = await res.json()

    return data.map((p): Proyecto => ({
      id:             p.id,
      nombre:         p.name ?? "Proyecto sin nombre",
      ubicacion:      p.location ?? "",
      estado:         toEstado(p.status),
      desarrolladora: p.developer_name ?? "",
      badge_analisis: (p.badge_analisis as BadgeAnalisis) ?? null,
      imagen: p.project_photos?.[0]?.storage_path
        ? SUPABASE_URL + "/storage/v1/object/public/project-photos/" + p.project_photos[0].storage_path
        : null,
    }))
  } catch {
    return []
  }
}
