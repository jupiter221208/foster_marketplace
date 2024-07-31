export const OG_BASE_URL = process.env.CONTEXT === 'production' ? process.env.URL : process.env.DEPLOY_PRIME_URL

export function getAbsoluteOgUrl(path: string): string {
  // for local builds, allow undefined OG_BASE_URL
  if (!process.env.NETLIFY && !OG_BASE_URL) return path
  return new URL(path, OG_BASE_URL).toString()
}

export function getTwitterUsername(twitterUrl?: string): string | null {
  if (!twitterUrl) return null
  let url = new URL(twitterUrl)
  let rawUsername = url.pathname.split('/')[1]
  let username = rawUsername?.match(/^[a-zA-Z0-9_]{1,15}/)?.[0]
  return username ? '@' + username : null
}
