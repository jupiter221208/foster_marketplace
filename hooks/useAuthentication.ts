import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { type PublicKey } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { setCookie, deleteCookie } from 'cookies-next'
import { type User, default as authAPI } from 'apis/auth'
import { isTokenValid, getSignMessageVerbiage } from 'utils/auth'
import AvatarImage from 'assets/images/dashboard-avatar.png'
import { useRouter } from 'next/router'

export interface UseAuthenticationReturn {
  isCurrentTokenValid: () => boolean
  refreshToken: (force?: boolean) => Promise<User>
  profileInfo: any | null
}

let fetchUserPromise: null | Promise<User> = null
let signLoginMessagePromise: null | Promise<string | void> = null
let isFetching = false

export function useAuthentication(): UseAuthenticationReturn {
  const dispatch = useDispatch()
  const router = useRouter()
  const { connected, disconnect, publicKey, signMessage } = useWallet()
  const [user, setUser] = useState<User | null>(null)
  const userInfo = useSelector((state: any) => state.profileInfo)

  const isCurrentTokenValid = useCallback((): boolean => isTokenValid(localStorage.getItem('token')), [])

  const getLoginMessageSignature = useCallback(
    async (address: PublicKey): Promise<string | void | null> => {
      let signature = localStorage.getItem('signature')
      if (signature?.match(/^[0-9a-f]{128}$/)) return signature

      if (!connected) return null
      else if (!signLoginMessagePromise) {
        const buffer = Buffer.from(getSignMessageVerbiage(address)) 
        const uint8Array = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
        signLoginMessagePromise = signMessage(uint8Array).then(signatureRaw => {
          let signature = Buffer.from(signatureRaw).toString('hex')
          localStorage.setItem('signature', signature)
          signLoginMessagePromise = null
          dispatch({ type: 'set', loginSignedFlag: true })
          return signature
        }, 
        onrejected => {
          logout()
          signLoginMessagePromise = null
          return null
        })
      }
      return signLoginMessagePromise
    },
    [connected, signLoginMessagePromise, signMessage]
  )

  const logout = () => {
    if (localStorage.getItem('walletName') === '"Phantom"') {
      localStorage.removeItem('walletName')
      ;(window as any).solana.disconnect()
    } else disconnect()
    
    localStorage.removeItem('token')
    dispatch({ type: 'set', profileInfo: null })
    localStorage.removeItem('expiryDate')
    localStorage.removeItem('signature')
    deleteCookie('token')

    if (router.pathname.includes('merch-logs')) {
      router.push('/')
    }

  }

  const refreshToken = useCallback(
    async (force: boolean = false): Promise<User | null> => {
      if (!connected) return null
      else if (isCurrentTokenValid() && fetchUserPromise && !force) return fetchUserPromise

      let signature = await getLoginMessageSignature(publicKey)
      if (!signature) return null

      if (isFetching) {
        return fetchUserPromise
      }

      isFetching = true
      fetchUserPromise = authAPI
        .login({
          wallet_id: publicKey?.toBase58() || '',
          signature,
        })
        .then(({ new_user, user, token, bid_wallet_lock, offer_wallet_lock }) => {
          if (!isTokenValid(token)) {
            logout()
            throw new Error(`received invalid token after login: ${token}`)
          }

          user.profile_picture ??= AvatarImage.src;
          localStorage.setItem('token', token)
          isFetching = false

          setCookie('token', token, { maxAge: 60 * 6 * 24 })

          if (new_user) dispatch({ type: 'set', profileSetup: true })

          dispatch({ type: 'set', profileInfo: user })
          dispatch({ type: 'set', bidWalletLock: bid_wallet_lock })
          dispatch({ type: 'set', offerWalletLock: offer_wallet_lock })
          setUser(user)
          return user
        })

      return fetchUserPromise
    },
    [connected, fetchUserPromise, publicKey]
  )

  useEffect(() => {
    if (!connected || !publicKey) {
      if (userInfo)
        logout()
      return
    } 

    if (userInfo && userInfo.wallet_id !== publicKey.toString()) {
      logout()
    } else {
      refreshToken().then(setUser)
    }
  }, [connected, publicKey, refreshToken])

  return { isCurrentTokenValid, refreshToken, profileInfo: userInfo,  }
}
