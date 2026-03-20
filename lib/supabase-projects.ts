// lib/supabase-projects.ts
// Fetch proyectos desde el mismo Supabase del sistema interno.

export type EstadoObra    = "en_pozo" | "en_obra" | "terminado"
export type BadgeAnalisis = "oportunidad" | "estable" | "a_evaluar"

export interface Proyecto {
  id:             string
  nombre:         string
  zona:           string | null
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
  categoria:  string
  icon:       string | null
  sort_order: number
  images:     AmenityImg[]
}

export interface Typology {
  id:              string
  name:            string
  area_m2:         number
  bedrooms:        number | null
  bathrooms:       number | null
  units_available: number | null
  features:        string[]
  images:          string[]   // full URLs
  floor_plan:      string | null  // full URL
}

export interface ProjectLink {
  type: string
  name: string
  url:  string
}

export interface ProyectoDetalle extends Proyecto {
  ciudad:          string | null
  barrio:          string | null
  direccion:       string | null
  descripcion:     string | null
  caracteristicas: string | null
  delivery_date:   string | null
  tipo_proyecto:   string | null
  precio_desde:    number | null
  precio_hasta:    number | null
  moneda:          string | null
  lat:             number | null
  lng:             number | null
  maps_url:        string | null
  tour_360_url:    string | null
  brochure_url:    string | null
  /** Derived from dedicated columns for backward compatibility */
  links:           ProjectLink[]
  fotos:           string[]
  typologies:      Typology[]
  amenities:       Amenity[]
}

// ─── Tipos Supabase raw ───────────────────────────────────────────────────────

interface SupabaseProyecto {
  id:              string
  name:            string | null
  zona:            string | null
  location:        string | null
  status:          "en_pozo" | "en_construccion" | "entregado" | null
  developer_name:  string | null
  badge_analisis:  string | null
  hero_image_url:  string | null
  project_photos:  { storage_path: string }[]
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

const HEADERS = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }

// ─── Listado ──────────────────────────────────────────────────────────────────

export async function getProyectosPublicados(): Promise<Proyecto[]> {
  try {
    const res = await fetch(
      SUPABASE_URL +
        "/rest/v1/projects" +
        "?publicado_en_web=eq.true" +
        "&select=id,name,zona,location,status,developer_name,badge_analisis,hero_image_url,project_photos(storage_path)" +
        "&project_photos.order=sort_order.asc" +
        "&order=created_at.desc",
      { headers: HEADERS, next: { revalidate: 60 } }
    )
    if (!res.ok) {
      console.error("[getProyectosPublicados] error:", res.status, await res.text())
      return []
    }
    const data: SupabaseProyecto[] = await res.json()
    return data.map((p): Proyecto => ({
      id:             p.id,
      nombre:         p.name ?? "Proyecto sin nombre",
      zona:           p.zona ?? p.location ?? null,
      estado:         toEstado(p.status),
      desarrolladora: p.developer_name ?? "",
      badge_analisis: (p.badge_analisis as BadgeAnalisis) ?? null,
      imagen:         p.hero_image_url ?? (p.project_photos?.[0]?.storage_path ? mediaUrl(p.project_photos[0].storage_path) : null),
    }))
  } catch { return [] }
}

// ─── Detalle ─────────────────────────────────────────────────────────────────

interface SupabaseProyectoBase {
  id:              string
  name:            string | null
  zona:            string | null
  ciudad:          string | null
  barrio:          string | null
  direccion:       string | null
  location:        string | null
  status:          string | null
  developer_name:  string | null
  badge_analisis:  string | null
  description:     string | null
  caracteristicas: string | null
  delivery_date:   string | null
  tipo_proyecto:   string | null
  precio_desde:    number | null
  precio_hasta:    number | null
  moneda:          string | null
  lat:             number | null
  lng:             number | null
  maps_url:        string | null
  tour_360_url:    string | null
  brochure_url:    string | null
  hero_image_url:  string | null
  project_photos:  { storage_path: string; sort_order: number }[]
}

interface SupabaseAmenity {
  id: string; name: string; categoria: string; icon: string | null; sort_order: number
  project_amenity_images: { id: string; storage_path: string; sort_order: number }[]
}

interface SupabaseTypology {
  id:              string
  name:            string
  area_m2:         number
  unit_type:       string | null
  bathrooms:       number | null
  units_available: number | null
  features:        string[] | null
  images:          string[] | null
  floor_plan:      string | null
  floor_plan_path: string | null
}

function parseBedroomsFromUnitType(ut: string | null): number | null {
  if (!ut) return null
  const n = parseInt(ut)
  if (!isNaN(n) && n >= 0) return n
  if (ut === 'monoambiente' || ut === 'mono') return 0
  if (ut === '1_dormitorio' || ut === '1dorm') return 1
  if (ut === '2_dormitorios' || ut === '2dorm') return 2
  if (ut === '3_dormitorios' || ut === '3dorm') return 3
  if (ut === '4dorm') return 4
  return null
}

export async function getProyectoById(id: string): Promise<ProyectoDetalle | null> {
  // ── Fetch principal ───────────────────────────────────────────────────────
  let p: SupabaseProyectoBase
  try {
    const res = await fetch(
      SUPABASE_URL +
        `/rest/v1/projects?id=eq.${id}&publicado_en_web=eq.true` +
        "&select=id,name,zona,ciudad,barrio,direccion,location,status,developer_name,badge_analisis" +
        ",description,caracteristicas,delivery_date,tipo_proyecto" +
        ",precio_desde,precio_hasta,moneda,lat,lng,maps_url,tour_360_url,brochure_url,hero_image_url" +
        ",project_photos(storage_path,sort_order)" +
        "&project_photos.order=sort_order.asc" +
        "&limit=1",
      { headers: HEADERS, cache: "no-store" }
    )
    if (!res.ok) {
      console.error("[getProyectoById] base fetch error:", res.status, await res.text())
      return null
    }
    const rows: SupabaseProyectoBase[] = await res.json()
    if (!rows.length) return null
    p = rows[0]
  } catch (err) {
    console.error("[getProyectoById] base fetch exception:", err)
    return null
  }

  const fotos = (p.project_photos ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(f => mediaUrl(f.storage_path))

  // ── Fetch tipologías (resiliente) ─────────────────────────────────────────
  let typologies: Typology[] = []
  try {
    const resT = await fetch(
      SUPABASE_URL +
        `/rest/v1/typologies?project_id=eq.${id}` +
        "&select=id,name,area_m2,unit_type,bathrooms,units_available,features,images,floor_plan,floor_plan_path" +
        "&order=area_m2.asc",
      { headers: HEADERS, cache: "no-store" }
    )
    if (resT.ok) {
      const rawT: SupabaseTypology[] = await resT.json()
      typologies = rawT.map(t => {
        const floorPath = t.floor_plan ?? t.floor_plan_path ?? null
        return {
          id:              t.id,
          name:            t.name,
          area_m2:         t.area_m2,
          bedrooms:        parseBedroomsFromUnitType(t.unit_type),
          bathrooms:       t.bathrooms ?? null,
          units_available: t.units_available ?? null,
          features:        t.features ?? [],
          images:          (t.images ?? []).map(path => mediaUrl(path)),
          floor_plan:      floorPath ? mediaUrl(floorPath) : null,
        }
      })
    } else {
      console.warn("[getProyectoById] typologies fetch failed:", resT.status)
    }
  } catch (err) {
    console.warn("[getProyectoById] typologies fetch exception:", err)
  }

  // ── Fetch amenities (resiliente) ──────────────────────────────────────────
  let amenities: Amenity[] = []
  try {
    const resA = await fetch(
      SUPABASE_URL +
        `/rest/v1/project_amenities?project_id=eq.${id}` +
        "&select=id,name,categoria,icon,sort_order,project_amenity_images(id,storage_path,sort_order)" +
        "&order=sort_order.asc" +
        "&project_amenity_images.order=sort_order.asc",
      { headers: HEADERS, cache: "no-store" }
    )
    if (resA.ok) {
      const rawA: SupabaseAmenity[] = await resA.json()
      amenities = rawA.map(a => ({
        id:         a.id,
        name:       a.name,
        categoria:  a.categoria ?? "edificio",
        icon:       a.icon ?? null,
        sort_order: a.sort_order,
        images:     (a.project_amenity_images ?? [])
          .sort((x, y) => x.sort_order - y.sort_order)
          .map(img => ({ id: img.id, storage_path: img.storage_path, sort_order: img.sort_order })),
      }))
    } else {
      console.warn("[getProyectoById] amenities fetch failed:", resA.status)
    }
  } catch (err) {
    console.warn("[getProyectoById] amenities fetch exception:", err)
  }

  // precio_desde: solo del campo manual del proyecto
  const precioDesde = p.precio_desde ?? null

  // ── Derive links for backward compatibility ───────────────────────────────
  const links: ProjectLink[] = [
    p.maps_url     ? { type: "maps",     name: "Google Maps", url: p.maps_url }     : null,
    p.tour_360_url ? { type: "vista360", name: "Vista 360°",  url: p.tour_360_url } : null,
    p.brochure_url ? { type: "brochure", name: "Brochure PDF", url: p.brochure_url } : null,
  ].filter(Boolean) as ProjectLink[]

  return {
    id:              p.id,
    nombre:          p.name ?? "Proyecto sin nombre",
    ciudad:          p.ciudad ?? null,
    barrio:          p.barrio ?? null,
    zona:            p.zona ?? p.location ?? null,
    direccion:       p.direccion ?? null,
    estado:          toEstado(p.status),
    desarrolladora:  p.developer_name ?? "",
    badge_analisis:  (p.badge_analisis as BadgeAnalisis) ?? null,
    imagen:          p.hero_image_url ?? fotos[0] ?? null,
    descripcion:     p.description ?? null,
    caracteristicas: p.caracteristicas ?? null,
    delivery_date:   p.delivery_date ?? null,
    tipo_proyecto:   p.tipo_proyecto ?? null,
    precio_desde:    precioDesde,
    precio_hasta:    p.precio_hasta ?? null,
    moneda:          p.moneda ?? "USD",
    lat:             p.lat ?? null,
    lng:             p.lng ?? null,
    maps_url:        p.maps_url ?? null,
    tour_360_url:    p.tour_360_url ?? null,
    brochure_url:    p.brochure_url ?? null,
    links,
    fotos,
    typologies,
    amenities,
  }
}
