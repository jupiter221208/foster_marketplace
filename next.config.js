// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig } = require('@sentry/nextjs');

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
    AUCTION_HOUSE_PUBLIC_KEY: process.env.AUCTION_HOUSE_PUBLIC_KEY,
    AUCTION_HOUSE_OWNER_ADDRESS: process.env.AUCTION_HOUSE_OWNER_ADDRESS,
    TIMED_AUCTION_HOUSE_PUBLIC_KEY: process.env.TIMED_AUCTION_HOUSE_PUBLIC_KEY,
    TIMED_AUCTION_HOUSE_OWNER_ADDRESS: process.env.TIMED_AUCTION_HOUSE_OWNER_ADDRESS,
    TOKEN_METADATA_PROGRAM_ID: process.env.TOKEN_METADATA_PROGRAM_ID,
    WRAPPED_SOL_MINT: process.env.WRAPPED_SOL_MINT,
    AUCTIONEER_ADDRESS: process.env.AUCTIONEER_ADDRESS,
    AUCTION_HOUSE_OWNER_ADDRESS: process.env.AUCTION_HOUSE_OWNER_ADDRESS
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
  staticPageGenerationTimeout: 1000,
}

module.exports = nextConfig

module.exports = withSentryConfig(
  module.exports,
  { silent: true },
  { hideSourcemaps: true },
);
