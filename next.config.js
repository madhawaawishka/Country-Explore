/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["flagcdn.com", "upload.wikimedia.org", "mainfacts.com"],
    unoptimized: true,
  },
}

module.exports = nextConfig
