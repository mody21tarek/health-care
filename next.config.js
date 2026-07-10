/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['fitpro.app', 'localhost'],
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
