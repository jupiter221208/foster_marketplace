import React from 'react'

// next components
import Image from 'next/image'

// images and icons
import WalletGrayIcon from 'assets/icons/wallet-gray.svg'
import FosterLightGreenIcon from 'assets/icons/foster-light-green.svg'

// styles
import styles from './index.module.scss'

const WalletButton = props => {
  const { onClick, connectWalletStatus, fullWidth = false } = props

  return (
    <button
      className={connectWalletStatus ? styles.connectedContainer : styles.container}
      onClick={() => onClick()}
      style={{ width: fullWidth ? '100%' : '' }}
    >
      <div>{connectWalletStatus ? 'cGtKb.frm' : 'Connect Wallet'}</div>
      <Image src={connectWalletStatus ? WalletGrayIcon : FosterLightGreenIcon} alt="" />
    </button>
  )
}

export default WalletButton
