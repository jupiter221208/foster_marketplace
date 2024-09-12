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
  linkedMerchProduct?: number
}

export interface CreatePrintTransaction {
  editionMint: string
  transaction: string
  editionNumber: number
  lastValidBlockHeight: number
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

export async function cancelListingEdition(mintAddress: string) {
  return client.delete(API_URL + 'v1/editions/' + mintAddress).then(res => {
    return res.data
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
  ...body
}: {
  mintAddress: string
  buyer: string
  count?: number
  editions?: number[]
}): Promise<CreatePrintTransaction[]> {
  return client.post(API_URL + `v1/editions/${mintAddress}/create-print`, body).then(response => {
    return response.data
  })
}

export async function updateEditionListing({ mintAddress, ...data }: UpdateListingRequest & { mintAddress: string }) {
  return client.patch(API_URL + `v1/editions/${mintAddress}`, data).then(response => {
    return response.data
  })
}
