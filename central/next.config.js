/**
 * @type {import('next').NextConfig}
 */
const nextConfig = (phase, { defaultConfig }) => ({
  ...defaultConfig,
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false }

    return config
  },
  reactStrictMode: true,
  compiler: {
    styledComponents: true
  },
  swcMinify: true,
  experimental: {
    outputStandalone: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
})

module.exports = nextConfig
