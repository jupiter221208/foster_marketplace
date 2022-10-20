import client from './client'

const API_URL = process.env.BACKEND_URL

class Artists {
  getArtist(wallet_id) {
    return client.get(API_URL + 'v1/artists/' + wallet_id).then(response => {
      return response.data
    })
  }

  followArtist(wallet_id) {
    return client.post(API_URL + 'v1/users/follow/' + wallet_id).then(response => {
      return response.data
    })
  }

  unfollowArtist(wallet_id) {
    return client.delete(API_URL + 'v1/users/follow/' + wallet_id).then(response => {
      return response.data
    })
  }
}

export default new Artists()
