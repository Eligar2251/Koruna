import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  skipTrailingSlashRedirect: true,
  serverExternalPackages: ['@supabase/supabase-js', 'pg'],
  async redirects() {
    return [{ source: '/:path*.html', destination: '/:path*', permanent: false }]
  },
}

export default nextConfig
