import React from 'react'

// third party components
import { useDispatch, useSelector } from 'react-redux'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletDisconnectButton } from '@solana/wallet-adapter-react-ui'

// custom components
import AccordionMenu from 'components/Menu/AccordionMenu'
import OutlineButton from 'components/Button/OutlineButton'
import WalletButton from 'components/Button/WalletButton'

// images and icons
import AvatarIcon from 'assets/images/avatar.jpg'
import ExploreWhiteIcon from 'assets/icons/explore-white.svg'
import PlusWhiteIcon from 'assets/icons/plus-white.svg'
import WalletWhiteIcon from 'assets/icons/wallet-white.svg'
import SpeedWhiteIcon from 'assets/icons/speed-white.svg'
import CollectionWhiteIcon from 'assets/icons/collection-white.svg'
import StatisticWhiteIcon from 'assets/icons/statistic-white.svg'
import ResourceWhiteIcon from 'assets/icons/resource-white.svg'
import LogoutWhiteIcon from 'assets/icons/logout-white.svg'

// json data
import ProfileMenuList from 'assets/json/profile-menu.json'
import ExploreMenuList from 'assets/json/explore-menu.json'
import CreateMenuList from 'assets/json/create-menu.json'

// styles
import styles from './index.module.scss'
import MyWalletMenu from '../MyWalletMenu'
import MyWalletSubMenu from '../MyWalletSubMenu'
import Image from 'next/image'

const MobileMenu = () => {
  const dispatch = useDispatch()

  const { connected } = useWallet()
  const openMyWallet = useSelector(state => state.openMyWallet)

  const handleDisconnectWallet = () => {
    dispatch({ type: 'set', connectWalletStatus: false })
    dispatch({ type: 'set', openMobileMenu: false })
  }

  const handleOpenConnectWallet = () => {
    dispatch({ type: 'set', openMyWallet: true })
  }

  return (
    <div className={styles.menu}>
      {openMyWallet ? (
        <MyWalletMenu />
      ) : connected ? (
        <div className={styles.container}>
          <div className="w-full">
            <div className="my-[10px]">
              <AccordionMenu icon={AvatarIcon} label="Lesile Alexander" type="avatar" data={ProfileMenuList} />
            </div>
            <div className="my-[10px]">
              <AccordionMenu icon={ExploreWhiteIcon} label="Explore" type="" data={ExploreMenuList} />
            </div>
            <div className="my-[10px]">
              <AccordionMenu icon={PlusWhiteIcon} label="Create" type="" data={CreateMenuList} />
            </div>
            <div className="my-[10px]">
              <MyWalletSubMenu icon={WalletWhiteIcon} label="My Wallet" type="" data={CreateMenuList} />
            </div>
            <div className="my-[10px]">
              <AccordionMenu icon={SpeedWhiteIcon} label="Dashboard" type="" data={[]} path="/dashboard" />
            </div>
            <div className="my-[10px]">
              <AccordionMenu icon={CollectionWhiteIcon} label="Collections" type="" data={[]} path="/" />
            </div>

            <div className="my-[10px]">
              <AccordionMenu icon={StatisticWhiteIcon} label="Stats" type="" data={[]} path="/" />
            </div>
            <div className="my-[10px]">
              <AccordionMenu icon={ResourceWhiteIcon} label="Resources" type="" data={[]} path="/" />
            </div>
          </div>
          <div className="w-full">
            <WalletDisconnectButton className={styles.logout}>
              <div>Logout part</div>
              <div className="flex items-center ml-2">
                <Image src={LogoutWhiteIcon} alt="" />
              </div>
            </WalletDisconnectButton>
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <div className="w-full flex flex-col flex-wrap items-start gap-[10px]">
            <AccordionMenu icon={ExploreWhiteIcon} label="Explore" type="" data={ExploreMenuList} />
            <AccordionMenu icon={PlusWhiteIcon} label="Create" type="" data={CreateMenuList} />
          </div>
          <div className="w-full flex items-end">
            <WalletButton fullWidth />
          </div>
        </div>
      )}
    </div>
  )
}

export default MobileMenu
