import client from './client'

const API_URL = process.env.BACKEND_URL

class Stats {
  getStatsArtwork(data) {
    return client.post(API_URL + 'v1/stats/artworks', data).then(response => {
      return response.data
    })
  }

  getStatsCollection(data) {
    return client.post(API_URL + 'v1/stats/collections', data).then(response => {
      return response.data
    })
  }

  getStatsCreator(data) {
    console.log(data)
    return client.post(API_URL + 'v1/stats/creators', data).then(response => {
      return response.data
    })
  }

  getStatsCollector(data) {
    return client.post(API_URL + 'v1/stats/collectors', data).then(response => {
      return response.data
    })
  }
}

export default new Stats()
