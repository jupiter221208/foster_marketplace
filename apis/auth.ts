import axios from 'axios'
import { setCookie } from 'cookies-next'

const API_URL = process.env.BACKEND_URL

class Auth {
  login(authInfo) {
    return axios.post(API_URL + 'v1/login', authInfo).then(response => {
      if (response.data.token !== null) {
        localStorage.setItem('token', response.data.token)
        setCookie('token', response.data.token, { maxAge: 60 * 6 * 24 })
      }
      return response.data
    })
  }
}

export default new Auth()
