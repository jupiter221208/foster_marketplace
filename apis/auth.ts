import axios from 'axios'

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
  solarplex_url?: string
  three_land_url: string
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
      return response.data
    })
  }
}

export default new Auth()
