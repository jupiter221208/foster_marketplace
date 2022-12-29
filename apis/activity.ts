import client from './client'

const API_URL = process.env.BACKEND_URL

class Activity {
  getNFTActivity(token_id) {
    return client.get(API_URL + 'v1/activity/nft/' + token_id).then(response => {
      return response.data
    })
  }
  getUserActivity(token_id) {
    return client.get(API_URL + 'v1/activity/user/' + token_id).then(response => {
      return response.data
    })
  }
  getCollectionActivity(token_id) {
    return client.get(API_URL + 'v1/activity/collection/' + token_id).then(response => {
      return response.data
    })
  }
}

export default new Activity()
