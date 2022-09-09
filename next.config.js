/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  reactStrictMode: true,
  env: {
    BASE_CLUSTER: process.env.BASE_CLUSTER,
    MAINNET_PRIMARY: process.env.MAINNET_PRIMARY,
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
}

module.exports = nextConfig
