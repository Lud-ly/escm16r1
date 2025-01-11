/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn-transverse.azureedge.net'],
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
