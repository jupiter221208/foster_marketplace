import client from './client'

const API_URL = process.env.BACKEND_URL

class Store {
  createProduct(user_id, product) {
    return client.post(API_URL + 'v1/stores/' + user_id + '/items', product).then(response => {
      if (typeof response.data === 'string') throw new Error(response.data)

      return response.data
    })
  }

  getStoreByUserId(user_id, page, per_page) {
    return client.get(API_URL + 'v1/stores/' + user_id + `/items?include_inactive=true&page=${page}&per_page=${per_page}`).then(response => {
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
    return client.get(API_URL + 'v1/stores/' + user_id + '/items?include_inactive=true&edition=true&page=1&per_page=all').then(response => {
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

  getStoreMerchEditions() {
    return client.get(API_URL + 'v1/stores/merch-editions').then(response => {
      return response.data
    })
  }

  getStoreClaimed() {
    return client.get(API_URL + 'v1/stores/claimed-products').then(response => {
      return response.data
    })
  }

  updateStoreById(user_id, product_id, item) {
    return client.patch(API_URL + 'v1/stores/' + user_id + '/items/' + product_id, item).then(response => {
      return response.data
    })
  }

  getPaymentId(order_id) {
    return client.post(API_URL + `v1/stores/orders/${order_id}/pay-fiat`).then(response => {
      return response.data
    })
  }

  getStoreTypes() {
    return client.get(API_URL + 'v1/stores/product-types').then(response => {
      return response.data
    })
  }

  getStoreFeeds(page, page_count, params) {
    return client.post(API_URL + `v1/stores/feed?per_page=${page_count}&page=${page}`, params).then(response => {
      return response.data
    })
  }

  deleteStoreById(user_id, product_id, item) {
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

  getBuyerOrder(page, per_page) {
    return client.get(`${API_URL}v1/stores/orders?page=${page}&per_page=${per_page}`).then(response => {
      return response?.data
    })
  }

  getSellerOrder(page, per_page) {
    return client.get(`${API_URL}v1/stores/orders/by-seller?page=${page}&per_page=${per_page}`).then(response => {
      return response?.data
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

  addShippingOrder(id, params) {
    return client.post(`${API_URL}v1/stores/orders/${id}/shipping`, params).then(response => {
      return response?.data
    })
  }

  exportOrder(fulfillment, from, to, status) {
    let api_url = `${API_URL}v1/stores/orders.csv`
    let params = ''
    if (fulfillment !== null) {
      params += `?fulfillment=${fulfillment}`
    }
    if (from !== null && to !== null) {
      if (params.length > 0) params += "&"
      else params ="?"
      params += `from=${from}&to=${to}`
    }
    if (status !== null) {
      if (params.length > 0) params += "&"
      else params ="?"
      params += `status=${status}`
    }

    return client.get(api_url + params).then(response => {
      return response?.data
    })
  }

}

export default new Store()
