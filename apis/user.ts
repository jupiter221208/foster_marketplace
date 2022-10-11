import axios from 'axios'

const API_URL = process.env.BACKEND_URL

class User {
  get(wallet) {
    return axios.get(API_URL + 'v1/users/' + wallet).then(response => {
      return response.data
    })
  }
  update(userInfo) {
    return axios.put(API_URL + 'v1/users', userInfo).then(response => {
      return response.data
    })
  }
}

export default new User()
