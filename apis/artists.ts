import { isLoggedIn } from 'utils/helpers'
import client from './client'

const API_URL = process.env.BACKEND_URL

class Artists {
  getArtist(wallet_id) {
    if (isLoggedIn())
      return client.get(API_URL + 'v1/artists/' + wallet_id).then(response => {
        return response.data
      })
    else
      return client.get(API_URL + 'v1/artists/' + wallet_id + '/public').then(response => {
        return response.data
      })
  }

  getCollector(wallet_id) {
    if (isLoggedIn())
      return client.get(API_URL + 'v1/collectors/' + wallet_id).then(response => {
        return response.data
      })
    else
      return client.get(API_URL + 'v1/collector/' + wallet_id + '/public').then(response => {
        return response.data
      })
  }

  getExploreCircus(wallet_id) {
    return client.get(API_URL + 'v1/artists/' + wallet_id + '/explore-the-circus').then(response => {
      return response.data
    })
  }

  getFollowings(wallet_id) {
    return client.get(API_URL + 'v1/artists/' + wallet_id + '/following').then(response => {
      return response.data
    })
  }

  getFollowers(wallet_id) {
    return client.get(API_URL + 'v1/artists/' + wallet_id + '/followers').then(response => {
      return response.data
    })
  }

  followArtist(wallet_id) {
    return client.post(API_URL + 'v1/artists/follow/' + wallet_id).then(response => {
      return response.data
    })
  }

  unfollowArtist(wallet_id) {
    return client.delete(API_URL + 'v1/artists/follow/' + wallet_id).then(response => {
      return response.data
    })
  }
}

export default new Artists()
