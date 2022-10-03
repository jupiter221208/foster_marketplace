/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  reactStrictMode: true,
  env: {
    WALLET_ADAPTER_NETWORK: process.env.WALLET_ADAPTER_NETWORK,
    BUNDLR_ADDRESS: process.env.BUNDLR_ADDRESS,
    PROVIDER_URL: process.env.PROVIDER_URL,
    BACKEND_URL: process.env.BACKEND_URL,
  },
  images: {
    domains: ['arweave.net', 'www.arweave.net'],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  webpack(config, options) {
    config.resolve.modules.push(path.resolve('./'))
    return config
  },
  typescript: {
    // TODO: REMOVE THIS ASAP, Critical for SC integration though
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
