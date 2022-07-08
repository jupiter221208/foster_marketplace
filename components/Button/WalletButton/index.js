import React from 'react'

// next components
import Image from 'next/image'

// images and icons
import WalletGrayIcon from 'assets/icons/wallet-gray.svg'

// styles
import styles from './index.module.scss'

const WalletButton = props => {
  const { label, onClick } = props
  return (
    <button className={styles.container} onClick={() => onClick}>
      <div className="mr-[13px]">{label}</div>
      <Image src={WalletGrayIcon} alt="" />
    </button>
  )
}

export default WalletButton
