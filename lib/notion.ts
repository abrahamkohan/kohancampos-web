import { Client } from "@notionhq/client/build/src/Client"

const notion = new Client({ auth: process.env.NOTION_TOKEN })

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getTitle(prop: any): string {
  return prop?.title?.map((r: any) => r.plain_text).join("") ?? ""
}
function getRichText(prop: any): string {
  return prop?.rich_text?.map((r: any) => r.plain_text).join("") ?? ""
}
function getSelect(prop: any): string {
  return prop?.select?.name ?? ""
}
function getFileUrl(prop: any): string | null {
  const files: any[] = prop?.files ?? []
  if (files.length === 0) return null
  const f = files[0]
  if (f.type === "external") return f.external?.url ?? null
  if (f.type === "file") return f.file?.url ?? null
  return null
}

// ─── Types ────────────────────────────────────────────────────────────────────
export type ProyectoPozo = {
  id: string
  nombre: string
  desarrolladora: string
  zona: string
  barrio: string
  estado: string
  fechaEntrega: string | null
  imagen: string | null
}

export type PropiedadTerminada = {
  id: string
  nombre: string
  tipo: string
  zona: string
  barrio: string
  precio: string
  m2: string
  tipologia: string
  estadoComercial: string
  imagen: string | null
}

// ─── Fetch functions ──────────────────────────────────────────────────────────
export async function getProyectosEnPozo(): Promise<ProyectoPozo[]> {
  const result = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_POZO!,
    filter: {
      property: "PublicadoEnWeb",
      checkbox: { equals: true },
    },
  })

  return result.results
    .filter((page: any) => page.object === "page")
    .map((page: any) => {
      const p = page.properties
      return {
        id: page.id,
        nombre: getTitle(p["Proyecto"]),
        desarrolladora: getSelect(p["Desarrolladora"]),
        zona: getSelect(p["Zona"]),
        barrio: getSelect(p["Barrio"]),
        estado: getSelect(p["Estado del Proyecto"]),
        fechaEntrega: p["Fecha Entrega"]?.date?.start ?? null,
        imagen: getFileUrl(p["Imagen"]),
      }
    })
}

export async function getPropiedadesTerminadas(): Promise<PropiedadTerminada[]> {
  const result = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_TERMINADAS!,
    filter: {
      property: "PublicadoEnWeb",
      checkbox: { equals: true },
    },
  })

  return result.results
    .filter((page: any) => page.object === "page")
    .map((page: any) => {
      const p = page.properties
      return {
        id: page.id,
        nombre: getTitle(p["Unidad"]),
        tipo: getSelect(p["Tipo de Producto"]),
        zona: getSelect(p["Zona"]),
        barrio: getSelect(p["Barrio"]),
        precio: getRichText(p["Precio de Venta"]),
        m2: getRichText(p["M2"]),
        tipologia: getSelect(p["Tipologia"]),
        estadoComercial: getSelect(p["Estado Comercial"]),
        imagen: getFileUrl(p["Imagen"]),
      }
    })
}
