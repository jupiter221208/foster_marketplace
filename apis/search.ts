import client from './client'

const API_URL = process.env.BACKEND_URL

class Search {
  search(query) {
    return client.get(API_URL + 'v1/search?query=' + query).then(response => {
      return response.data
    })
  }
}

export default new Search()
