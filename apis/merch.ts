import client from './client'

const API_URL = process.env.BACKEND_URL

class MerchHub {
  prepareCart(data) {
    return client.post(API_URL + 'v1/merch/prepare_cart', data).then(response => {
      return response.data
    })
  }
}

export default new MerchHub()
