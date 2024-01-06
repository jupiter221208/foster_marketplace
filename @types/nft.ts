import { Metadata, Pda } from '@metaplex-foundation/js'
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
  json: {
    name: string
    image: string
    description: string
    category: string
    animation_url: string
    attributes: { trait_type: string; value: string }[]
    properties: {
      category: string
    }
  }
  sellerFeeBasisPoints: number
  address: string
  metadataAddress: Pda
}

export interface NftCreator {
  address: PublicKey
  share: number
  verified: boolean
}
