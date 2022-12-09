import client from './client'

const API_URL = process.env.BACKEND_URL

class User {
  get(wallet) {
    return client.get(API_URL + 'v1/users/' + wallet).then(response => {
      return response.data
    })
  }
  update(userInfo) {
    return client.put(API_URL + 'v1/users', userInfo).then(response => {
      return response.data
    })
  }
  getNotifications() {
    return client.get(API_URL + 'v1/users/notifications').then(response => {
      return response.data
    })
  }
  getCollected() {
    return client.get(API_URL + 'v1/users/collected').then(response => {
      return response.data
    })
  }
  getCollectedNFT(collectionId) {
    return client.get(API_URL + 'v1/users/collected/' + collectionId).then(response => {
      return response.data
    })
  }

  getFavoriteNFT() {
    return client.get(API_URL + 'v1/users/favorites/nfts').then(response => {
      return response.data
    })
  }

  getFavoriteCollection() {
    return client.get(API_URL + 'v1/users/favorites/collections').then(response => {
      return response.data
    })
  }
}

export default new User()
