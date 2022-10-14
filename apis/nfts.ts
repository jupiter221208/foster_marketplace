import client from './client'

const API_URL = process.env.BACKEND_URL

class Nfts {
  create(nftInfo) {
    return client.post(API_URL + 'v1/nfts', nftInfo).then(response => {
      return response.data
    })
  }
}

export default new Nfts()
