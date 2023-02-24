import client from './client'

const API_URL = process.env.BACKEND_URL

class Stats {
  getStatsArtwork(data) {
    return client.post(API_URL + 'v1/stats/artworks', data).then(response => {
      return response.data
    })
  }
}

export default new Stats()
