import { isLoggedIn } from 'utils/helpers'
import client from './client'

const API_URL = process.env.BACKEND_URL

class Store {
  createProduct(user_id, product) {
    return client.post(API_URL + 'v1/stores/' + user_id + '/items', product).then(response => {
      if (typeof response.data === 'string') throw new Error(response.data)

      return response.data
    })
  }

  getStoreItemByFoster(user_id) {
    return client.get(API_URL + 'v1/stores/' + user_id + '/items?fulfillment=foster').then(response => {
      return response.data
    })
  }

  getStoreItemByUser(user_id) {
    return client.get(API_URL + 'v1/stores/' + user_id + '/items?fulfillment=user').then(response => {
      return response.data
    })
  }

  getStoreItemByEdition(user_id) {
    return client.get(API_URL + 'v1/stores/' + user_id + '/items?edition=true').then(response => {
      return response.data
    })
  }

  getStoreById(user_id, product_id) {
    return client.get(API_URL + 'v1/stores/' + user_id + '/items/' + product_id).then(response => {
      if (typeof response.data === 'string') throw new Error(response.data)
        
      return response.data
    })
  }
}

export default new Store()
