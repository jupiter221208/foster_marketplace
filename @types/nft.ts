import { PublicKey } from '@solana/web3.js'

export interface NftData {
  mintAddress: PublicKey
  name?: string
  symbol?: string
  description?: string
  image?: string
  imageCdn?: string
  animation_url?: string
  category?: string
  creators?: NftCreator[]
  attributes?: Array<{ value: string; trait_type: string }>
  collection?: {
    address: PublicKey
    verified: boolean
  }
  collectionDetails?: {
    size: number
  }
  tokenAccount: {
    delegate: PublicKey | null
    isFrozen: boolean
  }
}

export interface NftCreator {
  address: PublicKey
  share: number
  verified: boolean
}
