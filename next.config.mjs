/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      // Todas las regiones de S3 (cubre prod-files-secure.s3.us-west-2.amazonaws.com, etc.)
      { protocol: "https", hostname: "**.amazonaws.com" },
      // Notion CDN
      { protocol: "https", hostname: "**.notion.so" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
}

export default nextConfig
