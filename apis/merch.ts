import client from './client'

const API_URL = process.env.BACKEND_URL

export interface ShipStationOrder {
  orderId?: number
  orderNumber: string
  orderKey?: string
  orderDate: string
  paymentDate?: string
  orderStatus: string

  customerId?: number
  customerEmail: string

  billTo?: ShipStationAddress
  shipTo?: ShipStationAddress

  items: ShipStationOrderItem[]
  amountPaid: number
  taxAmount: number
  shippingAmount: number

  customerNotes: string
  internalNotes: string

  gift: boolean
  giftMessage?: string

  paymentMethod?: string
  requestedShippingService: string

  weight: {
    value: number
    units: string
  }
  tagIds: number[]
}

export interface ShipStationAddress {
  name: string
  company?: string
  street1?: string
  street2?: string
  street3?: string
  city?: string
  state: string
  postalCode: string
  country: string
  phone: string
  residential?: boolean
  addressVerified?: string
}

export interface ShipStationOrderItem {
  orderItemId: number
  lineItemKey: string

  sku: string
  name: string
  imageUrl?: string
  weight: {
    value: number
    units: string
  }
  quantity: number
  unitOrice: number
  taxAmount: number
  options: ShipStationOrderItemOption[]
  adjustment: boolean
}

export interface ShipStationOrderItemOption {
  name: string
  value: string
}

export interface ShipStationShipment {
  shipment_id: number
  createDate: String
  shipDate: String
  shipmentCost: number
  insuranceCost: number
  trackingNumber: String
  isreturnLabel: boolean
  batchNumber?: String

  carrierCode: String
  serviceCode: String
  packageCode: String
  confirmation: String
  warehouseId: number

  voided: boolean
  voidDate?: String
  marketplaceNotified: boolean
  notifyerrorMessage?: String

  dimensions?: JSON

  insuranceOptions?: JSON
  advancedOptions?: JSON
  shipmentItems?: JSON
  labelData?: JSON
  formData?: JSON
}

export interface OrderData {
  order: {
    id: number
    amount: number
    payment_method: string
    payment_amount: number
    transaction_id?: string
    maddies_cost: number
    foster_commission: number
    artist_commission: number
    tax_amount: number
    shipping_amount: number
    seller_shares: any
    buyer_address: string
  }
  ssorder: ShipStationOrder
  shipment?: ShipStationShipment
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

export async function getBuyerOrder(page, per_page) {
  return client.get(`${API_URL}v1/merch/orders?page=${page}&per_page=${per_page}`).then(response => {
    return response?.data
  })
}

export async function getSellerOrder(page, per_page) {
  return client.get(`${API_URL}v1/merch/orders/by-seller?page=${page}&per_page=${per_page}`).then(response => {
    return response?.data
  })
}

export async function getOrder(id): Promise<OrderData> {
  return client.get(`${API_URL}v1/merch/orders/${id}`).then(response => {
    return response?.data
  })
}

export async function getAllOrder() {
  return client.get(API_URL + 'v1/merch/orders').then(response => {
    return response?.data
  })
}

export async function payOrder(id, params) {
  return client.post(`${API_URL}v1/merch/orders/${id}/pay`, params).then(response => {
    return response?.data
  })
}

export async function getOrderStats() {
  return client.get(API_URL + 'v1/merch/orders/stats').then(response => {
    return response?.data
  })
}

export default {
  prepareCart,
  checkout,
  getOrder,
  payOrder,
  getAllOrder,
  getBuyerOrder,
  getSellerOrder,
  getOrderStats,
}
