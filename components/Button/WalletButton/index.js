import React, { useMemo } from 'react'

// next components
import Image from 'next/image'

// images and icons
import WalletGrayIcon from 'assets/icons/wallet-gray.svg'
import FosterLightGreenIcon from 'assets/icons/foster-light-green.svg'

// styles
import styles from './index.module.scss'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'

const WalletButton = props => {
  const { fullWidth = false } = props
  const { connected, publicKey } = useWallet()
  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey])
  const address = useMemo(() => base58 && base58.slice(0, 4) + '..' + base58.slice(-4), [base58])

  return (
    <WalletMultiButton
      className={connected ? styles.connectedContainer : styles.container}
      style={{ width: fullWidth ? '100%' : '' }}
    >
      <div>{connected ? address : 'Connect Wallet'}</div>
      <Image src={connected ? WalletGrayIcon : FosterLightGreenIcon} alt="" />
    </WalletMultiButton>
  )
}

export default WalletButton
