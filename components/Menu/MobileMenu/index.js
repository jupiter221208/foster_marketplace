import React from 'react'

// third party components
import { useSelector } from 'react-redux'

// custom components
import AccordionMenu from 'components/Menu/AccordionMenu'
import OutlineButton from 'components/Button/OutlineButton'

// images and icons
import AvatarIcon from 'assets/images/avatar.jpg'
import ExploreWhiteIcon from 'assets/icons/explore-white.svg'
import PlusWhiteIcon from 'assets/icons/plus-white.svg'
import WalletWhiteIcon from 'assets/icons/wallet-white.svg'
import SpeedWhiteIcon from 'assets/icons/speed-white.svg'
import CollectionWhiteIcon from 'assets/icons/collection-white.svg'
import ChartWhiteIcon from 'assets/icons/chart-white.svg'
import BookWhiteIcon from 'assets/icons/book-white.svg'
import LogoutWhiteIcon from 'assets/icons/logout-white.svg'

// json data
import ProfileMenuList from 'assets/json/profile-menu.json'
import ExploreMenuList from 'assets/json/explore-menu.json'
import CreateMenuList from 'assets/json/create-menu.json'

// styles
import styles from './index.module.scss'

const MobileMenu = () => {
  const openMobileMenu = useSelector(state => state.openMobileMenu)

  return (
    // <div className={openMobileMenu ? styles.menuOpen : !openMobileMenu ? styles.menuClose : styles.menu}>
    <div className={styles.menu}>
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
            <AccordionMenu icon={WalletWhiteIcon} label="My Wallet" type="" data={CreateMenuList} />
          </div>
          <div className="my-[10px]">
            <AccordionMenu icon={SpeedWhiteIcon} label="Dashboard" type="" data={[]} path="/" />
          </div>
          <div className="my-[10px]">
            <AccordionMenu icon={CollectionWhiteIcon} label="Collections" type="" data={[]} path="/" />
          </div>

          <div className="my-[10px]">
            <AccordionMenu icon={ChartWhiteIcon} label="Stats" type="" data={[]} path="/" />
          </div>
          <div className="my-[10px]">
            <AccordionMenu icon={BookWhiteIcon} label="Resources" type="" data={[]} path="/" />
          </div>
        </div>
        <div className="w-full">
          <OutlineButton
            label="Logout part"
            fullWidth
            onClick={() => {}}
            borderColor="#ffffff"
            height="45px"
            icon={LogoutWhiteIcon}
          />
        </div>
      </div>
    </div>
  )
}

export default MobileMenu
