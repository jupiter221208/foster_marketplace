import client from './client'

const API_URL = process.env.BACKEND_URL

class Dashboard {
  getDashboardBanner() {
    return client.get(API_URL + 'v1/dashboard').then(response => {
      return response?.data
    })
  }

  getTopRatedArtists(period) {
    return client.get(API_URL + 'v1/dashboard/top-rated-artists?period=' + period).then(response => {
      return response?.data
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
        return response?.data
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
        return response?.data
      })
  }

  getTrendingCollections(category, period) {
    return client
      .get(
        API_URL +
          'v1/dashboard/trending-collections' +
          (category !== null && category?.length > 0 ? '?category=' + category : '') +
          (period !== null && period?.length > 0 ? '?period=' + period : '')
      )
      .then(response => {
        return response?.data ?? []
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
        return response?.data
      })
  }

  getLiveAuctions(category, artist, mode) {
    let url = category !== null && category?.length > 0 ? '?category=' + category : ''
    if (artist !== null && artist?.length > 0) {
      if (url.length > 0) url = url + '&artist=' + artist
      else url = '?artist=' + artist
    }
    if (mode !== null && mode.length > 0) {
      if (url.length > 0) url = url + '&mode=' + mode
      else url = '?mode=' + mode
    }
    return client.get(API_URL + 'v1/dashboard/live-auctions' + url).then(response => {
      return response?.data
    })
  }

  getNftPublic() {
    return client.get(API_URL + 'v1/nfts/public').then(response => {
      return response?.data
    })
  }
}

export default new Dashboard()
