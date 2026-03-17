import type { PropiedadTerminada } from "./notion"

interface SupabaseProperty {
  id: string
  titulo: string | null
  tipo: string
  zona: string | null
  precio: number | null
  moneda: string | null
  superficie_m2: number | null
  dormitorios: number | null
  operacion: string
  foto_portada: string | null
}

export interface PropiedadDetalle {
  id: string
  titulo: string | null
  tipo: string
  zona: string | null
  direccion: string | null
  precio: number | null
  moneda: string | null
  superficie_m2: number | null
  superficie_cubierta_m2: number | null
  terreno_m2: number | null
  dormitorios: number | null
  banos: number | null
  garajes: number | null
  piso: number | null
  condicion: string | null
  descripcion: string | null
  operacion: string
  foto_portada: string | null
  latitud: number | null
  longitud: number | null
  fotos: string[]
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function getPropiedadesPublicadas(): Promise<PropiedadTerminada[]> {
  const res = await fetch(
    SUPABASE_URL + "/rest/v1/properties?publicado_en_web=eq.true&select=id,titulo,tipo,zona,precio,moneda,superficie_m2,dormitorios,operacion,foto_portada",
    {
      headers: {
        apikey: SUPABASE_KEY,
        Prefer: "return=representation",
      },
      next: { revalidate: 60 },
    }
  )

  if (!res.ok) return []

  const data: SupabaseProperty[] = await res.json()

  return data.map((p): PropiedadTerminada => {
    const nombre = p.titulo ?? p.tipo + " en " + (p.zona ?? "Sin ubicacion")
    const precio = p.precio != null
      ? (p.moneda === "usd" ? "USD" : "PYG") + " " + p.precio.toLocaleString("es-PY")
      : "Consultar"
    const m2 = p.superficie_m2 != null ? p.superficie_m2 + " m2" : "-"
    const tipologia = p.dormitorios != null
      ? (p.dormitorios === 0 ? "Monoambiente" : p.dormitorios + " dorm.")
      : p.tipo
    const imagen = p.foto_portada
      ? SUPABASE_URL + "/storage/v1/object/public/property-photos/" + p.foto_portada
      : null

    return {
      id: p.id,
      nombre,
      tipo: p.tipo,
      zona: p.zona ?? "",
      barrio: p.zona ?? "",
      precio,
      m2,
      tipologia,
      estadoComercial: p.operacion === "venta" ? "En Venta" : "En Alquiler",
      imagen,
    }
  })
}

export async function getPropiedadById(id: string): Promise<PropiedadDetalle | null> {
  const [propRes, fotosRes] = await Promise.all([
    fetch(
      SUPABASE_URL + "/rest/v1/properties?id=eq." + id + "&select=id,titulo,tipo,zona,direccion,precio,moneda,superficie_m2,superficie_cubierta_m2,terreno_m2,dormitorios,banos,garajes,piso,condicion,descripcion,operacion,foto_portada,latitud,longitud&limit=1",
      { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY }, next: { revalidate: 60 } }
    ),
    fetch(
      SUPABASE_URL + "/rest/v1/property_photos?property_id=eq." + id + "&select=storage_path&order=created_at.asc",
      { headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY }, next: { revalidate: 60 } }
    ),
  ])

  if (!propRes.ok) return null
  const props = await propRes.json()
  if (!props.length) return null

  const fotos: { storage_path: string }[] = fotosRes.ok ? await fotosRes.json() : []

  return {
    ...props[0],
    fotos: fotos.map((f) => SUPABASE_URL + "/storage/v1/object/public/property-photos/" + f.storage_path),
  }
}
