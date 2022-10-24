import client from './client'

const API_URL = process.env.BACKEND_URL

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
