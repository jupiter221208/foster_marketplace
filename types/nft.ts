import { BigNumber, Pda } from '@metaplex-foundation/js'
import { PublicKey } from '@solana/web3.js'

export interface NftData {
  id?: any
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
  address?: PublicKey
  metadataAddress?: Pda
  url?: string
  price?: number
  creator?: string
  sellerAddress?: PublicKey
  tradeStateAddress?: PublicKey
  uri?: string
  creatorAddress?: string
  startTime?: number
  endTime?: number
  amount?: string

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
  end_time?: number
  asset_name?: string
  action_type?: string
  created_at?: Date
  mint_address?: string
  artist_profile_picture?: string

  content?: {
    $schema: string
    files: { uri: string; mime: string }[]
    json_uri: string
    links: {
      image: string
    }
    metadata: {
      attributes: any[]
      description: string
      name: string
      symbol: string
      token_standard: string
    }
  }

  highestBid?: {
    buyer_address: string
    amount: string
  }
  mint?: {
    address: PublicKey
  }
  properties?: {
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
    size: number | BigNumber
  }
  tokenAccount?: {
    delegate: PublicKey | null
    isFrozen: boolean
  }
  json?: {
    name?: string
    symbol?: string
    description?: string
    seller_fee_basis_points?: number
    image?: string
    external_url?: string
    attributes?: Array<{
      trait_type?: string
      value?: string
      [key: string]: unknown
    }>
    properties?: {
      creators?: Array<{
        address?: string
        share?: number
        [key: string]: unknown
      }>
      files?: Array<{
        type?: string
        uri?: string
        [key: string]: unknown
      }>
      [key: string]: unknown
    }
    collection?: {
      name?: string
      family?: string
      [key: string]: unknown
    }
    [key: string]: unknown
  }
}

export interface NftCreator {
  address: PublicKey
  share: number
  verified: boolean
}
