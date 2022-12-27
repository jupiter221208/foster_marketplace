import client from './client'

const API_URL = process.env.BACKEND_URL

class Listings {
  listNft(token_id, amount) {
    return client.post(API_URL + 'v1/nfts/list/' + token_id, amount).then(response => {
      return response.data
    })
  }
  updateNft(token_id, amount) {
    return client.put(API_URL + 'v1/nfts/list/' + token_id, amount).then(response => {
      return response.data
    })
  }
  unlistNft(token_id) {
    return client.delete(API_URL + 'v1/nfts/list/' + token_id).then(response => {
      return response.data
    })
  }
  makeOffer(token_id, amount) {
    return client.post(API_URL + 'v1/nfts/offer/' + token_id, amount).then(response => {
      return response.data
    })
  }
  updateOffer(token_id) {
    return client.put(API_URL + 'v1/nfts/offer/' + token_id).then(response => {
      return response.data
    })
  }
  deleteOffer(token_id) {
    return client.delete(API_URL + 'v1/nfts/offer/' + token_id).then(response => {
      return response.data
    })
  }
  acceptOffer(token_id, param) {
    return client.post(API_URL + 'v1/nfts/offer/accept/' + token_id, param).then(response => {
      return response.data
    })
  }
}

export default new Listings()
