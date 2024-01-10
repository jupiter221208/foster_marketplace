import { addUrlSearchParams } from 'utils'
import { isLoggedIn } from 'utils/helpers'
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

  updateCollectionBanner(collection_id, bannerInfo) {
    return client.put(API_URL + 'v1/collections/' + collection_id + '/banner', bannerInfo).then(response => {
      return response.data
    })
  }

  unsaveCollection(collection_id) {
    return client.delete(API_URL + 'v1/collections/save/' + collection_id).then(response => {
      return response.data
    })
  }

  getCollectionNft(collection_id) {
    if (isLoggedIn())
      return client.get(API_URL + 'v1/collections/' + collection_id + '/nfts').then(response => {
        if (typeof response.data === 'string') throw new Error(response.data)
        return response.data
      })
    else
      return client.get(API_URL + 'v1/collections/' + collection_id + '/public/nfts').then(response => {
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

  exchangeArtInfo(collection_name: string) {
    return client
      .get(addUrlSearchParams(API_URL + 'v1/collections/exchange-art-info', { collection_name }).toString())
      .then(response => {
        if (typeof response.data === 'string') throw new Error(response.data)
        return response.data
      })
  }
}

export default new Collections()
