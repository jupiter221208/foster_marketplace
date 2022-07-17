import React, { useState } from 'react'

// next components
import Image from 'next/image'

// custom components
import SearchBox from 'components/Input/SearchBox'
import Menu from 'components/Menu'
import WalletButton from 'components/Button/WalletButton'
import ProfileMenu from 'components/Menu/ProfileMenu'
import IconButton from 'components/Button/IconButton'

// images and icons
import LogoTextIcon from 'assets/icons/logo-text.svg'
import AvatarImage from 'assets/images/avatar.jpg'
import SearchGrayIcon from 'assets/icons/search-gray.svg'
import HamburgerMenuGreenIcon from 'assets/icons/hamburger-menu-green.svg'

// json
import ExploreMenuList from 'assets/json/explore-menu.json'
import CreateMenuList from 'assets/json/create-menu.json'
import ProfileMenuList from 'assets/json/profile-menu.json'

// styles
import styles from './index.module.scss'

const PrimaryHeader = props => {
  const { viewport } = props
  const [searchKeyword, setSearchKeyword] = useState('')

  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    <div className={styles.container}>
      <div className="g-container flex justify-between items-center">
        <div className="flex-1 flex justify-center">
          <SearchBox
            value={searchKeyword}
            placeholder="Search by NFT, Collection, or Artist"
            onChange={value => setSearchKeyword(value)}
          />
        </div>
        <div className="flex justify-end items-center">
          <div className="ml-[60px]">
            <Menu label="Explore" menuList={ExploreMenuList} onSelect={() => {}} />
          </div>
          <div className="ml-[60px]">
            <Menu label="Create" menuList={CreateMenuList} onSelect={() => {}} />
          </div>
          <div className="ml-[60px]">
            <WalletButton label="cGtKb.frm" onClick={() => {}} />
          </div>
          <div className="ml-[60px]">
            <ProfileMenu avatar={AvatarImage} menuList={ProfileMenuList} onSelect={() => {}} />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.mobileContainer}>
      <div className="g-container flex justify-between items-center">
        <Image src={LogoTextIcon} alt="" />
        <div className="flex">
          <Image src={SearchGrayIcon} alt="" />
          <div className="ml-3">
            <IconButton icon={HamburgerMenuGreenIcon} onClick={() => {}} backgroundColor="transparent" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrimaryHeader
