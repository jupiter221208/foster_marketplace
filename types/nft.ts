export interface NftData {
  mintAddress?: string
  metadataAddress?: string
  tokenAccount?: {
    address: string
    delegate: string | null
    isFrozen: boolean
  }

  name?: string
  symbol?: string
  description?: string
  uri?: string

  image?: string
  animationUrl?: string
  original?: {
    image: string
    animationUrl: string
  }
  optimized?: {
    image: string
    animationUrl: string
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

  supply: {
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
    }
  }

  marketplaceInfo?: NftMarketplaceInfo
  auction_info?: AuctionInfo

  properties?: {
    category: string
    files?: FlilesInfo[]
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
      files?: Array<FlilesInfo>
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
  artist_username: string
  [key: string]: unknown
}

export interface NftMarketplaceInfo {
  id: number
  minterId: string
  timestamp: number
  mintedOnFoster: boolean
  views: number
  likes: number
  shares: number
  saves: number
  categories: string
  listingStatus: string
  coverImageUrl?: string
  merchHubEnabled: boolean
}

export interface FlilesInfo {
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
