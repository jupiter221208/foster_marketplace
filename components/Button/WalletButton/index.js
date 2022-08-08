import React from 'react'

// next components
import Image from 'next/image'

// images and icons
import WalletGrayIcon from 'assets/icons/wallet-gray.svg'
import FosterLightGreenIcon from 'assets/icons/foster-light-green.svg'

// styles
import styles from './index.module.scss'

const WalletButton = props => {
  const { onClick, connectWalletStatus } = props
  return (
    <button className={styles.container} onClick={() => onClick()}>
      <div className="mr-[13px]">{connectWalletStatus ? 'Connect Wallet' : 'cGtKb.frm'}</div>
      <Image src={connectWalletStatus ? FosterLightGreenIcon : WalletGrayIcon} alt="" />
    </button>
  )
}

export default WalletButton
