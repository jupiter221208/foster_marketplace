import client from './client'
import { addNonEmptySearchParams } from 'utils'

const API_URL = process.env.BACKEND_URL

class Dashboard {
  getDashboardBanner() {
    return client.get(API_URL + 'v1/dashboard').then(response => {
      return response?.data
    })
  }

  getTopRatedArtists(period) {
    return client
      .get(addNonEmptySearchParams(API_URL + 'v1/dashboard/top-rated-artists', { period }).toString())
      .then(response => {
        return response?.data
      })
  }

  getFreshMints(category) {
    return client
      .get(addNonEmptySearchParams(API_URL + 'v1/dashboard/fresh-mints', { category }).toString())
      .then(response => {
        return response?.data
      })
  }

  getMostPopular(category) {
    return client
      .get(addNonEmptySearchParams(API_URL + 'v1/dashboard/most-popular', { category }).toString())
      .then(response => {
        return response?.data
      })
  }

  getTrendingCollections(category, period) {
    return client
      .get(
        addNonEmptySearchParams(API_URL + 'v1/dashboard/trending-collections', {
          category,
          period,
        }).toString()
      )
      .then(response => {
        return response?.data ?? []
      })
  }

  getMarketplaceReleases(category: string | null, artist: string | null, page?: number) {
    return client
      .get(
        addNonEmptySearchParams(API_URL + 'v1/dashboard/marketplace-releases', {
          category,
          artist,
          page,
        }).toString()
      )
      .then(response => {
        return response?.data
      })
  }

  getLiveAuctions(category: string | null, artist: string | null, mode: string | null, page?: number) {
    return client
      .get(
        addNonEmptySearchParams(API_URL + 'v1/dashboard/live-auctions', {
          category,
          artist,
          mode,
          page,
        }).toString()
      )
      .then(response => {
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
