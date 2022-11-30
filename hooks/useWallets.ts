import { useEffect, useState } from 'react'

import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { getEscrowPaymentAccount as getOfferEscrowAddress } from 'utils/auction.util'
import { getEscrowPaymentAccount as getBiddingEscrowAddress } from 'utils/auctioneer.util'
import { useMetaplex } from './useMetaplex'
import { getPriceValue } from 'utils/strings'

export const useWallets = () => {
  const { connected } = useWallet()
  const { metaplex: mx } = useMetaplex()

  const [mainBalance, setMainBalance] = useState(0)
  const [offerBalance, setOfferBalance] = useState(0)
  const [biddingBalance, setBiddingBalance] = useState(0)
  const [offerWalletAddress, setOfferWalletAddress] = useState<PublicKey>()
  const [biddingWalletAddress, setBiddingWalletAddress] = useState<PublicKey>()

  const updateSolBalance = async () => {
    const main = await mx.connection.getBalance(mx.identity().publicKey)
    setMainBalance(Number(getPriceValue(main)))

    const [offerEscrowAddress] = await getOfferEscrowAddress(mx.identity().publicKey)
    setOfferWalletAddress(offerEscrowAddress)
    const offer = await mx.connection.getBalance(offerEscrowAddress)
    setOfferBalance(Number(getPriceValue(offer)))

    const [biddingEscrowAddress] = await getBiddingEscrowAddress(mx.identity().publicKey)
    setBiddingWalletAddress(biddingEscrowAddress)
    const bidding = await mx.connection.getBalance(biddingEscrowAddress)
    setBiddingBalance(Number(getPriceValue(bidding)))
  }

  useEffect(() => {
    if (mx && connected) updateSolBalance()
  }, [mx, connected])

  return {
    mainBalance,
    offerBalance,
    biddingBalance,
    offerWalletAddress,
    biddingWalletAddress,
    updateSolBalance,
  }
}
