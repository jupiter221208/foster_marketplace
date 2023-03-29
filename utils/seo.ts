export const OG_BASE_URL = process.env.CONTEXT === 'production' ? process.env.URL : process.env.DEPLOY_PRIME_URL

export function getAbsoluteOgUrl(path: string): string {
  // for local builds, allow undefined OG_BASE_URL
  if (!process.env.NETLIFY && !OG_BASE_URL) return path
  return new URL(path, OG_BASE_URL).toString()
}
