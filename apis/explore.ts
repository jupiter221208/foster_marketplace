import client from './client'

const API_URL = process.env.BACKEND_URL

class Explore {
  getExploreNFT(data) {
    return client.post(API_URL + 'v1/explore/nfts', data).then(response => {
      return response.data
    })
  }
  getExploreCollection(data) {
    return client.post(API_URL + 'v1/explore/collections', data).then(response => {
      return response.data
    })
  }
}

export default new Explore()
