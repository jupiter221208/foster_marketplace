import React from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// third party components
import { useDispatch, useSelector } from 'react-redux'

// components
import WalletMenuItem from 'components/Card/WalletMenuItem'

// images
import MenuBackIcon from 'assets/icons/menu-back.svg'
import WalletWhiteIcon from 'assets/icons/wallet-white.svg'

// styles
import styles from './index.module.scss'

// json
import WalletItemList from 'assets/json/wallet-item.json'

const MyWalletMenu = props => {
  const {} = props
  const router = useRouter()
  const dispatch = useDispatch()

  const handleOpenConnectWallet = () => {
    dispatch({ type: 'set', connectWalletStatus: true })
    dispatch({ type: 'set', openMobileMenu: false })
    dispatch({ type: 'set', openMyWallet: false })
  }

  const closeMyWallet = () => {
    dispatch({ type: 'set', openMyWallet: false })
  }

  return (
    <div className={styles.container}>
      <div className="flex items-center">
        <div onClick={() => closeMyWallet()}>
          <Image src={MenuBackIcon} alt="" />
        </div>
        <div className="flex ml-[25px]">
          <Image src={WalletWhiteIcon} alt="" />
          <div className={styles.myWalletText}></div>
          My Wallet
        </div>
      </div>
      <p className={styles.content}>
        By connecting your wallet, you agree to our&nbsp;
        <span className={styles.contentBold}>Terms of Services</span> and our&nbsp;
        <span className={styles.contentBold}>Privacy Policy</span>.
      </p>
      <div className="mt-[18px]">
        {WalletItemList.map((item, index) => (
          <div key={index}>
            <WalletMenuItem item={item} onClick={() => handleOpenConnectWallet()} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyWalletMenu
