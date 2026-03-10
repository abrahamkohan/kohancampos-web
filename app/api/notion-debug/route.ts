import { NextResponse } from "next/server"
import { Client } from "@notionhq/client"

const notion = new Client({ auth: process.env.NOTION_TOKEN })

async function getColumns(databaseId: string) {
  const db = await notion.databases.retrieve({ database_id: databaseId })
  const dataSources: { id: string }[] = (db as any).data_sources ?? []
  if (dataSources.length === 0) return { error: "no data_sources", db }

  const result = await notion.dataSources.query({
    data_source_id: dataSources[0].id,
    page_size: 1,
  })

  const firstPage = result.results[0]
  if (!firstPage) return { message: "base vacía", dataSourceId: dataSources[0].id }

  // @ts-ignore
  const props = firstPage.properties ?? {}
  return { dataSourceId: dataSources[0].id, columns: Object.keys(props), sample: props }
}

export async function GET() {
  try {
    const [pozo, terminadas] = await Promise.all([
      getColumns(process.env.NOTION_DATABASE_POZO!),
      getColumns(process.env.NOTION_DATABASE_TERMINADAS!),
    ])
    return NextResponse.json({ pozo, terminadas })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message, code: err?.code }, { status: 500 })
  }
}
