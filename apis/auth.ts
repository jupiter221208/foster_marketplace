import axios from 'axios'

const API_URL = process.env.BACKEND_URL

class Auth {
  login(authInfo) {
    return axios.post(API_URL + 'v1/login', authInfo).then(response => {
      if (response.data.token !== null) {
        localStorage.setItem('token', JSON.stringify(response.data.token))
      }
      return response.data
    })
  }
}

export default new Auth()
