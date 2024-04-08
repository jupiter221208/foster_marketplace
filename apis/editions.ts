import client from './client'

const API_URL = process.env.BACKEND_URL

export interface ListedMasterEdition {
  id: number
  mintAddress: string
  price: string
  startTime: string
  endTime: string
  buyLimit?: number
  authorityPublicKey: string
  createdAt: string
}

export interface ListMasterEditionRequest {
  price: string
  startTime?: string
  endTime?: string
  buyLimit?: number
}

export interface CreatePrintResponse {
  editionMint: string
  transaction: string
}

export interface UpdateListingRequest {
  price?: string
  startTime?: string
  endTime?: string
  buyLimit?: number
}

export async function getListedMasterEditionInfo(mintAddress: string): Promise<ListedMasterEdition | null> {
  return client.get(API_URL + `v1/editions/${mintAddress}`).then(response => {
    return response.data.mintAddress ? response.data : null
  })
}

export async function getEditionList(mintAddress: string): Promise<[any] | null> {
  return client.get(API_URL + `v1/editions/?owner=${mintAddress}`).then(response => {
    return response.data
  })
}

export async function listMasterEdition({
  mintAddress,
  ...data
}: ListMasterEditionRequest & { mintAddress: string }): Promise<ListedMasterEdition> {
  return client.put(API_URL + `v1/editions/${mintAddress}`, data).then(response => {
    return response.data
  })
}

export async function createPrint({
  mintAddress,
  buyer,
}: {
  mintAddress: string
  buyer: string
}): Promise<CreatePrintResponse> {
  return client.post(API_URL + `v1/editions/${mintAddress}/create-print`, { buyer }).then(response => {
    return response.data
  })
}

export async function updateListing({ mintAddress, ...data }: UpdateListingRequest & { mintAddress: string }) {
  return client.patch(API_URL + `v1/editions/${mintAddress}`, data).then(response => {
    return response.data
  })
}
