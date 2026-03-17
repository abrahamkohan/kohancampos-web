"use client"

import { useState } from "react"
import { TerminadaCard } from "./property-card"
import { PropertyModal } from "./property-modal"
import type { PropiedadTerminada, PropiedadDetalle } from "@/lib/supabase-properties"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

async function fetchDetalle(id: string): Promise<PropiedadDetalle | null> {
  const [propRes, fotosRes] = await Promise.all([
    fetch(
      `${SUPABASE_URL}/rest/v1/properties?id=eq.${id}&select=id,titulo,tipo,zona,direccion,precio,moneda,superficie_m2,superficie_cubierta_m2,terreno_m2,dormitorios,banos,garajes,piso,condicion,descripcion,operacion,foto_portada,latitud,longitud&limit=1`,
      { headers: { apikey: SUPABASE_KEY } }
    ),
    fetch(
      `${SUPABASE_URL}/rest/v1/property_photos?property_id=eq.${id}&select=storage_path&order=created_at.asc`,
      { headers: { apikey: SUPABASE_KEY } }
    ),
  ])
  if (!propRes.ok) return null
  const props = await propRes.json()
  if (!props.length) return null
  const fotos: { storage_path: string }[] = fotosRes.ok ? await fotosRes.json() : []
  return {
    ...props[0],
    fotos: fotos.map((f: { storage_path: string }) => `${SUPABASE_URL}/storage/v1/object/public/property-photos/${f.storage_path}`),
  }
}

export function PropiedadesGrid({ propiedades }: { propiedades: PropiedadTerminada[] }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<PropiedadDetalle | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleCardClick(id: string) {
    setModalOpen(true)
    setIsLoading(true)
    setSelectedProperty(null)
    const data = await fetchDetalle(id)
    setSelectedProperty(data)
    setIsLoading(false)
  }

  function handleClose() {
    setModalOpen(false)
    setSelectedProperty(null)
  }

  if (propiedades.length === 0) {
    return (
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
    )
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {propiedades.map(p => (
          <div key={p.id} onClick={() => handleCardClick(p.id)} className="cursor-pointer">
            <TerminadaCard p={p} />
          </div>
        ))}
      </div>

      {modalOpen && (
        <PropertyModal
          property={selectedProperty}
          isLoading={isLoading}
          onClose={handleClose}
        />
      )}
    </>
  )
}
