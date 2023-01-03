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

  getFreshMints(category) {
    return client
      .get(
        API_URL +
          'v1/dashboard/fresh-mints' +
          (category !== null && category?.length > 0 ? '?category=' + category : '')
      )
      .then(response => {
        return response.data
      })
  }

  getMostPopular(category) {
    return client
      .get(
        API_URL +
          'v1/dashboard/most-popular' +
          (category !== null && category?.length > 0 ? '?category=' + category : '')
      )
      .then(response => {
        return response.data
      })
  }

  getTrendingCollections(category) {
    return client
      .get(
        API_URL +
          'v1/dashboard/trending-collections' +
          (category !== null && category?.length > 0 ? '?category=' + category : '')
      )
      .then(response => {
        return response.data
      })
  }

  getMarketplaceReleases(category, artist) {
    return client
      .get(
        API_URL +
          'v1/dashboard/marketplace-releases' +
          (category !== null && category?.length > 0 ? '?category=' + category : '') +
          (artist !== null && artist?.length > 0 ? '?artist=' + artist : '')
      )
      .then(response => {
        return response.data
      })
  }

  getLiveAuctions(category, artist) {
    return client
      .get(
        API_URL +
          'v1/dashboard/live-auctions' +
          (category !== null && category?.length > 0 ? '?category=' + category : '') +
          (artist !== null && artist?.length > 0 ? '?artist=' + artist : '')
      )
      .then(response => {
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
