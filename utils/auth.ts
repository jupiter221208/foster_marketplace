import authAPI from 'apis/auth'
import { useDispatch } from 'react-redux'

export const loginWithSigned = async (publicKey, signature) => {
  const dispatch = useDispatch()
  let { new_user, user, bid_wallet_lock, offer_wallet_lock } = await authAPI.login({
    wallet_id: publicKey?.toBase58() || '',
    signature: Buffer.from(signature).toString('base64'),
  })
  if (new_user) dispatch({ type: 'set', profileSetup: true })
  dispatch({ type: 'set', profileInfo: user })
  dispatch({ type: 'set', bidWalletLock: bid_wallet_lock })
  dispatch({ type: 'set', offerWalletLock: offer_wallet_lock })
  return user
}
