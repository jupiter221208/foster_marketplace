import React, { useEffect, useState } from 'react'

// third party components
import { useSelector } from 'react-redux'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletDisconnectButton } from '@solana/wallet-adapter-react-ui'

// custom components
import AccordionMenu from 'components/Menu/AccordionMenu'
import WalletButton from 'components/Button/WalletButton'

// images and icons
import AvatarIcon from 'assets/icons/profile-thumb.svg'
import ExploreWhiteIcon from 'assets/icons/explore-white.svg'
import PlusWhiteIcon from 'assets/icons/plus-white.svg'
import WalletWhiteIcon from 'assets/icons/wallet-white.svg'
import NotificationWhiteIcon from 'assets/icons/quick-buy-white.svg'
import DaoWhiteIcon from 'assets/icons/dao-white.svg'
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
  const { connected } = useWallet()
  const openMyWallet = useSelector((state: any) => state.openMyWallet)
  const profileInfo = useSelector(state => (state as any).profileInfo)
  const [profileImage, setProfileImage] = useState('')
  const [profileName, setProfileName] = useState('')

  useEffect(() => {
    if (profileInfo && profileInfo.profile_picture) {
      setProfileImage(profileInfo.profile_picture)
      setProfileName(profileInfo.username)
    }
  }, [profileInfo])

  return (
    <div className={styles.menu}>
      {openMyWallet ? (
        <MyWalletMenu />
      ) : connected ? (
        <div className={styles.container}>
          <div className="w-full">
            <div className="my-[10px]">
              <AccordionMenu
                icon={profileImage.length > 0 ? profileImage : AvatarIcon}
                label={profileName.length > 0 ? profileName : 'Anonymous'}
                type="avatar"
                data={ProfileMenuList}
              />
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
              <AccordionMenu icon={CollectionWhiteIcon} label="Dashboard" type="" data={[]} path="/dashboard" />
            </div>
            <div className="my-[10px]">
              <AccordionMenu
                icon={NotificationWhiteIcon}
                label="Notifications"
                type=""
                data={[]}
                path="/notifications"
              />
            </div>

            <div className="my-[10px]">
              <AccordionMenu icon={StatisticWhiteIcon} label="Stats" type="" data={[]} path="/stats" />
            </div>
            <div className="my-[10px]">
              <AccordionMenu icon={DaoWhiteIcon} label="DAO" type="" data={[]} path="/dao" />
            </div>
            <div className="my-[10px]">
              <AccordionMenu icon={ResourceWhiteIcon} label="Resources" type="" data={[]} path="/resources" />
            </div>
            {/* <div className="my-[10px]">
              <AccordionMenu icon={SettingWhiteIcon} label="Settings" type="" data={[]} path="/settings" />
            </div> */}
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
