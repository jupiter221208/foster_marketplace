import authAPI from 'apis/auth'

export const loginWithSigned = async (publicKey, signature, dispatch) => {
  let { new_user, user, bid_wallet_lock, offer_wallet_lock } = await authAPI.login({
    wallet_id: publicKey?.toBase58() || '',
    signature: Buffer.from(signature).toString('hex'),
  })
  if (new_user) dispatch({ type: 'set', profileSetup: true })
  dispatch({ type: 'set', profileInfo: user })
  dispatch({ type: 'set', bidWalletLock: bid_wallet_lock })
  dispatch({ type: 'set', offerWalletLock: offer_wallet_lock })
  let expiryTimestamp = Date.now() + 59 * 60 * 1000
  localStorage.setItem('expiryDate', expiryTimestamp.toString())
  return user
}

export const checkExpiryDate = () => {
  let expiryDate = localStorage.getItem('expiryDate')
  if (expiryDate === null) {
    return false
  }
  let expiryTimestamp = parseInt(expiryDate)
  let nowTimeStamp = Date.now()

  if (expiryTimestamp >= nowTimeStamp) {
    return true
  }

  return false
}
