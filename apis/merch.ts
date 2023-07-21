import client from './client'

const API_URL = process.env.BACKEND_URL

export interface OrderData {
  id: number
  amount: number
  paymentMethod: string
  paymentAmount: number
  transactionId: string | null
}

export function prepareCart(data) {
  return client.post(API_URL + 'v1/merch/prepare_cart', data).then(response => {
    return response.data
  })
}

export function checkout(data) {
  return client.post(API_URL + 'v1/merch/checkout', data).then(response => {
    return response.data
  })
}

export async function getOrder(id): Promise<OrderData> {
  return client.get(`${API_URL}v1/merch/orders/${id}`).then(response => {
    return response?.data
  })
}

export default {
  prepareCart,
  checkout,
  getOrder,
}
