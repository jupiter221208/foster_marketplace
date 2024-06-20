import { isLoggedIn } from 'utils/helpers'
import client from './client'

const API_URL = process.env.BACKEND_URL

class Store {
  createProduct(user_id, product) {
    return client.post(API_URL + 'v1/stores/' + user_id + '/items', product).then(response => {
      return response.data
    })
  }
}

export default new Store()
