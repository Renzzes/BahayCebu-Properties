/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb'
    }
  },
  images: {
    domains: ['*'],
  },
}

module.exports = nextConfig 