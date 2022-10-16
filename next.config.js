/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  reactStrictMode: true,
  env: {
    WALLET_ADAPTER_NETWORK: process.env.WALLET_ADAPTER_NETWORK,
    BUNDLR_ADDRESS: process.env.BUNDLR_ADDRESS,
    PROVIDER_URL: process.env.PROVIDER_URL,
    BACKEND_URL: process.env.BACKEND_URL,
    AUCTION_HOUSE_ADDRESS: process.env.AUCTION_HOUSE_ADDRESS,
    AUCTION_HOUSE_PUBLIC_KEY: process.env.AUCTION_HOUSE_PUBLIC_KEY
  },
  images: {
    domains: [
      'arweave.net',
      'www.arweave.net',
      'foster-marketplace-dev.s3.us-east-2.amazonaws.com',
      'foster-marketplace.s3.us-east-2.amazonaws.com'
    ],
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
