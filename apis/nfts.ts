import client from './client'

const API_URL = process.env.BACKEND_URL

export type NFT = {
  address: string
  asset_type: string
  name: string
  collection_address: string
  collection_name: string
  owner_address: string
  owner_username: string
  creator_address: string
  creator_username: string
  creator_profile_image: string | null | undefined
  description: string
  categories: string
  asset_url: string
  cover_image_url: string | null | undefined
  likes: number
  saves: number
  shares: number
  liked: boolean
  saved: boolean
  shared: NftShareData
  listing_status: string
  listing: NftListing | null | undefined
  auction: NftAuctionData | null | undefined
  created_at: String
}

export type NftShareData = {
  facebook: boolean
  twitter: boolean
  telegram: boolean
}

export type NftListing = {
  id: number
  token_id: string
  offers: number
  result: string | null | undefined
  created_at: string
  list_price: string
}

export type NftAuctionData = {
  auction: NftAuction
  highest_bid: NftHighestBid
}

export type NftAuction = {
  id: number
  mint_address: string
  associated_address: string
  free_trade_state: string
  metadata: string
  signer: string
  seller_address: string
  start_time: string
  end_time: string
  reserve_price: string
  canceled_at: string
  sold_at: string
  created_at: string
}

export type NftHighestBid = {
  id: number
  mint_address: string
  buyer_address: string
  amount: string
  created_at: string
}

class Nfts {
  create(nftInfo) {
    return client.post(API_URL + 'v1/nfts', nftInfo).then(response => {
      return response.data
    })
  }
  get(token_id) {
    return client.get(API_URL + 'v1/nfts/' + token_id).then(response => {
      return response.data
    })
  }
  getDetail(token_id) {
    return client.get(API_URL + 'v1/nfts/detail/' + token_id).then(response => {
      return response.data
    })
  }
  getMyFavorites() {
    return client.get(API_URL + 'v1/nfts/favorites').then(response => {
      return response.data
    })
  }
  likeNft(token_id) {
    return client.post(API_URL + 'v1/nfts/like/' + token_id).then(response => {
      return response.data
    })
  }
  unlikeNft(token_id) {
    return client.delete(API_URL + 'v1/nfts/like/' + token_id).then(response => {
      return response.data
    })
  }
  saveNft(token_id) {
    return client.post(API_URL + 'v1/nfts/save/' + token_id).then(response => {
      return response.data
    })
  }
  unsaveNft(token_id) {
    return client.delete(API_URL + 'v1/nfts/save/' + token_id).then(response => {
      return response.data
    })
  }
  shareNft(social_site, token_id) {
    return client.post(API_URL + 'v1/nfts/share/' + social_site + '/' + token_id).then(response => {
      return response.data
    })
  }
  filteredNfts() {
    return client.get(API_URL + 'v1/users/filtered-nfts').then(response => {
      return response.data
    })
  }
}

export default new Nfts()
