import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://kohancampos.com.py",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ]
}
