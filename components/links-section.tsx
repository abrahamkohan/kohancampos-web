import {
  Map, Globe, FileText, MessageCircle, Eye, FolderOpen, ExternalLink,
} from "lucide-react"
import type { ProjectLink } from "@/lib/supabase-projects"

function iconForType(type: string) {
  switch (type.toLowerCase()) {
    case "maps":       return <Map size={14} />
    case "web":        return <Globe size={14} />
    case "brochure":   return <FileText size={14} />
    case "whatsapp":   return <MessageCircle size={14} />
    case "vista360":   return <Eye size={14} />
    case "drive":      return <FolderOpen size={14} />
    default:           return <ExternalLink size={14} />
  }
}

export function LinksSection({ links }: { links: ProjectLink[] }) {
  if (!links.length) return null

  return (
    <section className="flex flex-col gap-4">
      <span className="block font-sans text-[10px] font-[600] uppercase tracking-[0.3em] text-gold/60">
        Links del proyecto
      </span>
      <div className="flex flex-wrap gap-3">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 border border-gold/20 text-kc-white/70 hover:border-gold/60 hover:text-kc-white font-sans text-xs font-[500] tracking-wide transition-all"
          >
            {iconForType(link.type)}
            {link.name}
          </a>
        ))}
      </div>
    </section>
  )
}
