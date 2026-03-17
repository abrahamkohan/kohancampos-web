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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function getPropiedadesPublicadas(): Promise<PropiedadTerminada[]> {
  const res = await fetch(
    SUPABASE_URL + "/rest/v1/properties?publicado_en_web=eq.true&select=id,titulo,tipo,zona,precio,moneda,superficie_m2,dormitorios,operacion,foto_portada",
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: "Bearer " + SUPABASE_KEY,
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
