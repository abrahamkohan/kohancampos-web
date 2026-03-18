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
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [shareMsg, setShareMsg] = useState("")

  async function openModal(id: string) {
    setActiveId(id)
    setModalOpen(true)
    setIsLoading(true)
    setSelectedProperty(null)
    window.history.pushState({}, "", `/propiedades/${id}`)
    const data = await fetchDetalle(id)
    setSelectedProperty(data)
    setIsLoading(false)
  }

  function handleClose() {
    setModalOpen(false)
    setSelectedProperty(null)
    setActiveId(null)
    window.history.pushState({}, "", "/propiedades")
  }

  function handleShare(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    const url = `${window.location.origin}/propiedades/${id}`
    if (navigator.share) {
      navigator.share({ title: "Propiedad — Kohan & Campos", url })
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setShareMsg(id)
        setTimeout(() => setShareMsg(""), 2000)
      })
    }
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
      {/* Toast compartir */}
      {shareMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-navy-deep border border-gold/30 px-5 py-3 font-sans text-sm font-[300] text-gold shadow-xl">
          Link copiado al portapapeles
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {propiedades.map(p => (
          <div
            key={p.id}
            onClick={() => openModal(p.id)}
            className="cursor-pointer h-full"
          >
            <TerminadaCard
              p={p}
              onShare={(e) => handleShare(e, p.id)}
            />
          </div>
        ))}
      </div>

      {modalOpen && (
        <PropertyModal
          property={selectedProperty}
          isLoading={isLoading}
          propertyId={activeId}
          onClose={handleClose}
        />
      )}
    </>
  )
}
