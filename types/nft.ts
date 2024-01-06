import { Pda } from '@metaplex-foundation/js'
import { PublicKey } from '@solana/web3.js'

export interface NftData {
  mintAddress?: PublicKey
  name?: string
  symbol?: string
  description?: string
  image?: string
  imageCdn?: string
  category?: string
  creators?: NftCreator[]
  attributes?: Array<{ value: string; trait_type: string }>
  sellerFeeBasisPoints?: number
  address?: string
  metadataAddress?: Pda
  url?: string
  price?: number
  creator?: string

  animation_url?: string
  token_id?: PublicKey
  asset_url?: string
  nft_name?: string
  asset_type?: string
  cover_image_url?: string
  artist_username?: string
  artist_id?: PublicKey
  list_price?: number
  collection_name?: string
  current_bid?: number
  reserve_price?: number
  end_time?: Date

  properties: {
    category: string
    files?: {
      [key: string]: unknown
      type?: string
      uri?: string
    }[]
  }
  collection?: {
    address: PublicKey
    verified: boolean
  }
  collectionDetails?: {
    size: number
  }
  tokenAccount?: {
    delegate: PublicKey | null
    isFrozen: boolean
  }
  json?: {
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
}

export interface NftCreator {
  address: PublicKey
  share: number
  verified: boolean
}
