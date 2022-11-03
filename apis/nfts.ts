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
}

export default new Nfts()
