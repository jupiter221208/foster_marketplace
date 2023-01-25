import client from './client'

const API_URL = process.env.BACKEND_URL

class Collections {
  mintCollection(collectionInfo) {
    return client.post(API_URL + 'v1/collections', collectionInfo).then(response => {
      return response.data
    })
  }

  getCollection(collection_id) {
    return client.get(API_URL + 'v1/collections/' + collection_id).then(response => {
      return response.data
    })
  }

  likeCollection(collection_id) {
    return client.post(API_URL + 'v1/collections/like/' + collection_id).then(response => {
      return response.data
    })
  }

  saveCollection(collection_id) {
    return client.post(API_URL + 'v1/collections/save/' + collection_id).then(response => {
      return response.data
    })
  }

  unsaveCollection(collection_id) {
    return client.delete(API_URL + 'v1/collections/save/' + collection_id).then(response => {
      return response.data
    })
  }

  getCollectionNft(collection_id) {
    return client.get(API_URL + 'v1/collections/' + collection_id + '/nfts').then(response => {
      if (typeof response.data === 'string') throw new Error(response.data)
      return response.data
    })
  }

  getOtherCollections(artist_id) {
    return client.get(API_URL + 'v1/collections/other-by-artist/' + artist_id).then(response => {
      return response.data
    })
  }

  getFavorites() {
    return client.get(API_URL + 'v1/users/favorites?tab=nfts').then(response => {
      return response.data
    })
  }
}

export default new Collections()
