import axios from 'axios'
import { setCookie } from 'cookies-next'

const API_URL = process.env.BACKEND_URL

export interface User {
  id: number
  wallet_id: string
  username?: string
  profile_picture?: string
  banner_picture?: string
  ig_url?: string
  discord_url?: string
  twitter_url?: string
  email?: string
  created_at: string
  telegram_url?: string
  bio?: string
  followers: number
  site_url?: string
}

export interface LoginResponse {
  user: User
  token: string
  new_user: boolean
  bid_wallet_lock: number
  offer_wallet_lock: number
}

class Auth {
  login(authInfo): Promise<LoginResponse> {
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
