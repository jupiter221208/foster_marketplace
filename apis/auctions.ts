import client from './client'

const API_URL = process.env.BACKEND_URL

class Auctions {
  create(new_token_id, auction) {
    return client.post(API_URL + 'v1/nfts/auctions/' + new_token_id, auction).then(res => {
      return res.data
    })
  }

  getListings() {
    return client.get(API_URL + 'v1/nfts/auctions').then(res => {
      return res.data
    })
  }

  getListing(new_token_id) {
    return client.get(API_URL + 'v1/nfts/auctions/' + new_token_id).then(res => {
      return res.data
    })
  }

  getListingsBySeller(new_wallet_id) {
    return client.get(API_URL + 'v1/nfts/auctions/seller/' + new_wallet_id).then(res => {
      return res.data
    })
  }

  cancelAuction(new_token_id) {
    return client.delete(API_URL + 'v1/nfts/auctions/' + new_token_id).then(res => {
      return res.data
    })
  }

  placeBid(new_token_id, bid) {
    return client.post(API_URL + 'v1/nfts/bid/' + new_token_id, bid).then(res => {
      return res.data
    })
  }

  executeSale(new_token_id, sale) {
    return client.post(API_URL + 'v1/nfts/auctions/' + new_token_id + '/sold', sale).then(res => {
      return res.data
    })
  }
}

export default new Auctions()
