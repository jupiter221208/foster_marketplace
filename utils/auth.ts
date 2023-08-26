import type { PublicKey } from '@solana/web3.js'
import authAPI from 'apis/auth'

export function isTokenValid(token: string | undefined | null): boolean {
  if (!token) return false
  let [, bodyEncoded = ''] = token.split('.')
  try {
    let { exp = 0 } = JSON.parse(Buffer.from(bodyEncoded, 'base64').toString())
    return Math.floor(Date.now() / 1000) < exp
  } catch (e) {
    console.warn(`could not parse token "${token}": ${e}`)
    return false
  }
}

export function getSignMessageVerbiage(address: PublicKey): string {
  return (
    `fostermarketplace.app wants you to sign in with your Solana account: ${address}\n` +
    '\n' +
    'By clicking approve, you are verifying ownership of this wallet. This request will not trigger any blockchain transaction or cost any gas fees.\n' +
    '\n' +
    'Click approve to sign in and accept the Terms of Service.'
  )
}
