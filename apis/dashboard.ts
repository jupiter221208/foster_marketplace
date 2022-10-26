import client from './client'

const API_URL = process.env.BACKEND_URL

class Dashboard {
  getDashboardBanner() {
    return client.get(API_URL + 'v1/dashboard').then(response => {
      return response.data
    })
  }

  getTopRatedArtists() {
    return client.get(API_URL + 'v1/dashboard/top-rated-artists').then(response => {
      return response.data
    })
  }

  getMarketplaceReleases() {
    return client.get(API_URL + 'v1/dashboard/marketplace-releases').then(response => {
      return response.data
    })
  }

  getNftPublic() {
    return client.get(API_URL + 'v1/nfts/public').then(response => {
      return response.data
    })
  }
}

export default new Dashboard()
