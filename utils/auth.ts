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

export const loginWithWallet = async (publicKey, signMessage, dispatch) => {
  let walletSign = null
  if (!checkExpiryDate()) {
    let signature = await signMessage(Buffer.from(getSignMessageVerbiage(publicKey)))
    walletSign = Buffer.from(signature).toString('hex')
    let expiryTimestamp = Date.now() + 59 * 60 * 1000
    localStorage.setItem('expiryDate', expiryTimestamp.toString())
    localStorage.setItem('signature', walletSign)
  } else {
    walletSign = localStorage.getItem('signature')
  }
  await login(publicKey?.toBase58() || '', walletSign, dispatch)
}

export const checkExpiryToken = async (publicKey, signMessage, dispatch) => {
  if (!checkExpiryDate()) {
    let signature = await signMessage(Buffer.from(getSignMessageVerbiage(publicKey)))
    let walletSign = Buffer.from(signature).toString('hex')
    await login(publicKey?.toBase58() || '', walletSign, dispatch)
    let expiryTimestamp = Date.now() + 59 * 60 * 1000
    localStorage.setItem('expiryDate', expiryTimestamp.toString())
    localStorage.setItem('signature', walletSign)
  }
}

export const login = async (wallet_id, signature, dispatch) => {
  let { new_user, user, bid_wallet_lock, offer_wallet_lock } = await authAPI.login({
    wallet_id,
    signature,
  })
  if (new_user) dispatch({ type: 'set', profileSetup: true })
  dispatch({ type: 'set', profileInfo: user })
  dispatch({ type: 'set', bidWalletLock: bid_wallet_lock })
  dispatch({ type: 'set', offerWalletLock: offer_wallet_lock })
}

export const checkExpiryDate = () => {
  let expiryDate = localStorage.getItem('expiryDate')
  if (expiryDate === null) {
    return false
  }
  let expiryTimestamp = parseInt(expiryDate)
  let nowTimeStamp = Date.now()
  console.log(expiryTimestamp, nowTimeStamp)

  if (expiryTimestamp >= nowTimeStamp) {
    return true
  }

  return false
}

export const getSignMessageVerbiage = address => {
  let message =
    'fostermarketplace.app wants you to sign in with your Solana account: ' +
    address +
    '\n\n' +
    'By clicking approve, you are verifying ownership of this wallet. This request will not trigger any blockchain transaction or cost any gas fees.\n\n' +
    'Click approve to sign in and accept the Terms of Service.'
  return message
}
