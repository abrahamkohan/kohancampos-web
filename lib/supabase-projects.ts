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

export interface AmenityImg {
  id:           string
  storage_path: string
  sort_order:   number
}

export interface Amenity {
  id:         string
  name:       string
  sort_order: number
  images:     AmenityImg[]
}

export interface ProyectoDetalle extends Proyecto {
  descripcion:    string | null
  precio_desde:   number | null
  precio_hasta:   number | null
  moneda:         string
  delivery_date:  string | null
  tipo_proyecto:  string | null
  fotos:          string[]
  amenities:      Amenity[]
}

// ─── Tipos Supabase raw ───────────────────────────────────────────────────────

interface SupabaseProyecto {
  id:             string
  name:           string | null
  location:       string | null
  status:         "en_pozo" | "en_construccion" | "entregado" | null
  developer_name: string | null
  badge_analisis: string | null
  project_photos: { storage_path: string }[]
}

interface SupabaseProyectoDetalle {
  id:             string
  name:           string | null
  location:       string | null
  status:         string | null
  developer_name: string | null
  badge_analisis: string | null
  description:    string | null
  precio_desde:   number | null
  precio_hasta:   number | null
  moneda:         string | null
  delivery_date:  string | null
  tipo_proyecto:  string | null
  project_photos: { storage_path: string; sort_order: number }[]
  project_amenities: {
    id: string; name: string; sort_order: number
    project_amenity_images: { id: string; storage_path: string; sort_order: number }[]
  }[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toEstado(s: string | null): EstadoObra {
  if (s === "en_pozo")         return "en_pozo"
  if (s === "en_construccion") return "en_obra"
  if (s === "entregado")       return "terminado"
  return "en_pozo"
}

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const MEDIA_BUCKET  = "project-media"

export function mediaUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`
}

// ─── Listado ──────────────────────────────────────────────────────────────────

export async function getProyectosPublicados(): Promise<Proyecto[]> {
  try {
    const res = await fetch(
      SUPABASE_URL +
        "/rest/v1/projects" +
        "?publicado_en_web=eq.true" +
        "&select=id,name,location,status,developer_name,badge_analisis,project_photos(storage_path)" +
        "&project_photos.order=sort_order.asc" +
        "&order=created_at.desc",
      { headers: { apikey: SUPABASE_KEY }, next: { revalidate: 60 } }
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
      imagen:         p.project_photos?.[0]?.storage_path ? mediaUrl(p.project_photos[0].storage_path) : null,
    }))
  } catch { return [] }
}

// ─── Detalle ─────────────────────────────────────────────────────────────────

export async function getProyectoById(id: string): Promise<ProyectoDetalle | null> {
  try {
    const res = await fetch(
      SUPABASE_URL +
        `/rest/v1/projects?id=eq.${id}&publicado_en_web=eq.true` +
        "&select=id,name,location,status,developer_name,badge_analisis,description,precio_desde,precio_hasta,moneda,delivery_date,tipo_proyecto" +
        ",project_photos(storage_path,sort_order)" +
        ",project_amenities(id,name,sort_order,project_amenity_images(id,storage_path,sort_order))" +
        "&project_photos.order=sort_order.asc" +
        "&project_amenities.order=sort_order.asc" +
        "&project_amenity_images.order=sort_order.asc" +
        "&limit=1",
      { headers: { apikey: SUPABASE_KEY }, next: { revalidate: 60 } }
    )
    if (!res.ok) return null
    const rows: SupabaseProyectoDetalle[] = await res.json()
    if (!rows.length) return null
    const p = rows[0]

    const fotos = (p.project_photos ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(f => mediaUrl(f.storage_path))

    const amenities: Amenity[] = (p.project_amenities ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(a => ({
        id:         a.id,
        name:       a.name,
        sort_order: a.sort_order,
        images:     (a.project_amenity_images ?? [])
          .sort((x, y) => x.sort_order - y.sort_order)
          .map(img => ({ id: img.id, storage_path: img.storage_path, sort_order: img.sort_order })),
      }))
      // Solo con imágenes, ordenados: con fotos primero
      .sort((a, b) => (b.images.length > 0 ? 1 : 0) - (a.images.length > 0 ? 1 : 0))
      .filter(a => a.images.length > 0)

    return {
      id:            p.id,
      nombre:        p.name ?? "Proyecto sin nombre",
      ubicacion:     p.location ?? "",
      estado:        toEstado(p.status),
      desarrolladora: p.developer_name ?? "",
      badge_analisis: (p.badge_analisis as BadgeAnalisis) ?? null,
      imagen:         fotos[0] ?? null,
      descripcion:    p.description ?? null,
      precio_desde:   p.precio_desde ?? null,
      precio_hasta:   p.precio_hasta ?? null,
      moneda:         p.moneda ?? "USD",
      delivery_date:  p.delivery_date ?? null,
      tipo_proyecto:  p.tipo_proyecto ?? null,
      fotos,
      amenities,
    }
  } catch { return null }
}
