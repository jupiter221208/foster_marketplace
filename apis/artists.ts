import { isLoggedIn } from 'utils/helpers'
import client from './client'

const API_URL = process.env.BACKEND_URL

class Artists {
  getArtist(wallet_id, per_page, page) {
    if (isLoggedIn())
      return client
        .get(API_URL + 'v1/artists/' + wallet_id + '?per_page=' + per_page + '&page=' + page)
        .then(response => {
          return response.data
        })
    else
      return client
        .get(API_URL + 'v1/artists/' + wallet_id + '/public' + '?per_page=' + per_page + '&page=' + page)
        .then(response => {
          return response.data
        })
  }

  getArtistByUsername(username) {
    return client.get(API_URL + 'v1/artists/' + username + '/username').then(response => {
      return response.data
    })
  }

  getCollector(wallet_id, per_page, page) {
    if (isLoggedIn())
      return client
        .get(API_URL + 'v1/collectors/' + wallet_id + '?per_page=' + per_page + '&page=' + page)
        .then(response => {
          return response.data
        })
    else
      return client
        .get(API_URL + 'v1/collectors/' + wallet_id + '/public' + '?per_page=' + per_page + '&page=' + page)
        .then(response => {
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
