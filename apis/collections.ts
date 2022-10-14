import client from './client'

const API_URL = process.env.BACKEND_URL

class Collections {
  create(collectionInfo) {
    return client.post(API_URL + 'v1/collections', collectionInfo).then(response => {
      return response.data
    })
  }
}

export default new Collections()
