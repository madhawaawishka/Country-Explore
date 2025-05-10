/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
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