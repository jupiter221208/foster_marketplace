import client from './client'

const API_URL = process.env.BACKEND_URL

class Store {
  createProduct(user_id, product) {
    return client.post(API_URL + 'v1/stores/' + user_id + '/items', product).then(response => {
      if (typeof response.data === 'string') throw new Error(response.data)

      return response.data
    })
  }

  getStoreByUserId(user_id) {
    return client.get(API_URL + 'v1/stores/' + user_id + '/items').then(response => {
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

  getStoreItemByNewEdition(user_id) {
    return client.get(API_URL + 'v1/stores/' + user_id + '/items?edition=true&edition_assigned=false').then(response => {
      return response.data
    })
  }

  getStoreById(user_id, product_id) {
    return client.get(API_URL + 'v1/stores/' + user_id + '/items/' + product_id).then(response => {
      if (typeof response.data === 'string') throw new Error(response.data)
        
      return response.data
    })
  }

  getStoreUnclaimed() {
    return client.get(API_URL + 'v1/stores/unclaimed-products').then(response => {
      return response.data
    })
  }


  updateStoreById(user_id, product_id, item) {
    return client.patch(API_URL + 'v1/stores/' + user_id + '/items/' + product_id, item).then(response => {
      return response.data
    })
  }

  prepareCart(data) {
    return client.post(API_URL + 'v1/stores/prepare_cart', data).then(response => {
      return response.data
    })
  }

  checkout(data) {
    return client.post(API_URL + 'v1/stores/checkout', data).then(response => {
      return response.data
    })
  }

  getOrder(id) {
    return client.get(`${API_URL}v1/stores/orders/${id}`).then(response => {
      return response?.data
    })
  }

  payStoreOrder(id, params) {
    return client.post(`${API_URL}v1/stores/orders/${id}/pay`, params).then(response => {
      return response?.data
    })
  }
}

export default new Store()
