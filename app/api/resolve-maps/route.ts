import { NextResponse } from "next/server"

function extractCoords(url: string): { lat: number; lng: number } | null {
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) }
  const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) }
  const latMatch = url.match(/!3d(-?\d+\.\d+)/)
  const lngMatch = url.match(/!2d(-?\d+\.\d+)/)
  if (latMatch && lngMatch) return { lat: parseFloat(latMatch[1]), lng: parseFloat(lngMatch[1]) }
  const llMatch = url.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (llMatch) return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) }
  return null
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")
  if (!url) return NextResponse.json({ error: "missing url" }, { status: 400 })

  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; KohanCampos/1.0)" },
    })
    const finalUrl = res.url
    const coords = extractCoords(finalUrl)
    return NextResponse.json(
      { finalUrl, coords },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
  } catch {
    return NextResponse.json({ error: "failed to resolve" }, { status: 500 })
  }
}
