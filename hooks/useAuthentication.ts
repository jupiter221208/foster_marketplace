import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useWallet } from '@solana/wallet-adapter-react'
import { setCookie } from 'cookies-next'

import { type User, default as authAPI } from 'apis/auth'
import { isTokenValid, getSignMessageVerbiage } from 'utils/auth'

export interface UseAuthenticationReturn {
  isCurrentTokenValid: () => boolean
  refreshToken: (force?: boolean) => Promise<User>
  user: User | null
}

let fetchUserPromise: null | Promise<User> = null

export function useAuthentication(): UseAuthenticationReturn {
  const dispatch = useDispatch()
  const { connected, publicKey, signMessage } = useWallet()

  const [user, setUser] = useState<User | null>(null)

  const isCurrentTokenValid = useCallback((): boolean => isTokenValid(localStorage.getItem('token')), [])

  const refreshToken = useCallback(
    async (force: boolean = false): Promise<User> => {
      if (isCurrentTokenValid() && fetchUserPromise && !force) return fetchUserPromise

      let signature = localStorage.getItem('signature')
      if (!signature?.match(/^[0-9a-f]{128}$/)) {
        let signatureBuffer = await signMessage(Buffer.from(getSignMessageVerbiage(publicKey)))
        signature = Buffer.from(signatureBuffer).toString('hex')
        localStorage.setItem('signature', signature)
      }

      fetchUserPromise = authAPI
        .login({
          wallet_id: publicKey?.toBase58() || '',
          signature,
        })
        .then(({ new_user, user, token, bid_wallet_lock, offer_wallet_lock }) => {
          if (!isTokenValid(token)) throw new Error(`received invalid token after login: ${token}`)

          localStorage.setItem('token', token)
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
    [fetchUserPromise, publicKey]
  )

  useEffect(() => {
    if (!connected || !publicKey) return
    refreshToken()
  }, [connected, publicKey, refreshToken])

  return { isCurrentTokenValid, refreshToken, user }
}
