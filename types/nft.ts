import { Pda } from '@metaplex-foundation/js'

export interface NftData {
  mintAddress?: string
  metadataAddress?: string
  tokenAccount?: {
    address?: string
    delegate?: string | null
    isFrozen?: boolean
  }

  name?: string
  symbol?: string
  description?: string
  uri?: string

  image?: string
  animation_url?: string
  original?: {
    image?: string
    animationUrl?: string
  }
  optimized?: {
    image?: string
    animationUrl?: string
  }

  sellerFeeBasisPoints?: number
  creators?: NftCreator[]
  category?: string
  attributes?: Array<{ value: string; trait_type: string }>

  collection?: {
    address: string
    verified: boolean
  }
  collectionDetails?: {
    size?: number
  }

  supply?: {
    edition: number | null
    current: number | null
    max: number | null
  }

  content?: {
    files: {
      uri: string
      mime: string
      cdn_uri: string
    }[]
    links: {
      image: string
    }
    metadata: {
      name: string
      description: string
      token_standard: string
      attributes: { value: string; trait_type: string }[]
      symbol: string
    }
    json_uri: string
  }
  royalty?: {
    basis_points: number
  }
  grouping?: { group_key: string; group_value: string }[]

  marketplaceInfo?: NftMarketplaceInfo
  auction?: AuctionInfo

  properties?: {
    category: string
    files?: FilesInfo[]
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
      creators?: NftCreator[]
      files?: Array<FilesInfo>
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
  address: string
  share: number
  verified: boolean
  artist_username?: string
  [key: string]: unknown
}

export interface NftMarketplaceInfo {
  id?: number
  minterId?: string
  timestamp?: number
  mintedOnFoster?: boolean
  views?: number
  likes?: number
  shares?: number
  saves?: number
  shared?: boolean
  liked?: boolean
  saved?: boolean
  categories?: string
  listingStatus?: string
  coverImageUrl?: string
  merchHubEnabled?: boolean
}

export interface FilesInfo {
  type?: string
  uri?: string
  [key: string]: unknown
}

export interface AuctionInfo {
  list_price: number
  start_time: number
  end_time: number
  current_bid: number
}

export interface DashboardAPIData {
  token_id: string
  asset_url: string
  nft_name: string
  asset_type: string
  cover_image_url: string
  artist_username: string
  collection_name: string
  list_price: number
}

export interface ListingsAPIData {
  address?: string
  name?: string
  uri?: string
  sellerAddress?: string
  tradeStateAddress?: string
  price?: number
  creatorAddress?: string
  startTime?: number
  endTime?: number
  highestBid?: {
    buyer_address: string
    amount: string
  }
}

export interface ExploreAPIData {
  url: string
  image: string
  asset_type: string
  cover_image_url: string
  current_bid: number
  reserve_price: number
  end_time: number
  price: number
  token_id: string
  name: string
  creator: string
  collection_name: string
}

export interface ActivityAPIData {
  asset_url: string
  mint_address: string
  asset_name: string
  action_type: string
  amount: string
  created_at: string
}

export interface ArtistsAPIData {
  token_id: string
}

export interface NftApiData {
  address: string
  collection: {
    address: string
    verified: boolean
  }
  creators: NftCreator[]
  metadataAddress: Pda
  model: string
  symbol: string
  sellerFeeBasisPoints: number
  edition: {
    address: string
    parent: string
    number: number | string
    maxSupply: number | string
    supply: number | string
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
      creators?: NftCreator[]
      files?: Array<FilesInfo>
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
