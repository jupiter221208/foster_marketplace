import React, { useEffect, useState } from 'react'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// third party components
import { useDispatch, useSelector } from 'react-redux'

// custom components
import SearchBox from 'components/Input/SearchBox'
import Menu from 'components/Menu'
import WalletButton from 'components/Button/WalletButton'
import ProfileMenu from 'components/Menu/ProfileMenu'
import IconButton from 'components/Button/IconButton'

// images and icons
import LogoTextIcon from 'assets/icons/logo-text-01.svg'
import LogoTextMobileIcon from 'assets/icons/logo-text-01-mobile.svg'
import AvatarImage from 'assets/images/avatar.jpg'
import SearchGrayIcon from 'assets/icons/search-gray.svg'
import HamburgerMenuGreenIcon from 'assets/icons/hamburger-menu-green.svg'

// json
import SearchList from 'assets/json/search-list.json'
import ExploreMenuList from 'assets/json/explore-menu.json'
import CreateMenuList from 'assets/json/create-menu.json'
import ProfileMenuList from 'assets/json/profile-menu.json'

// styles
import styles from './index.module.scss'

const PrimaryHeader = props => {
  const { viewport } = props
  const router = useRouter()

  const [searchKeyword, setSearchKeyword] = useState('')

  const [searchList, setSearchList] = useState({ nfts: [], artists: [], collections: [] })

  useEffect(() => {
    if (searchKeyword !== '') {
      const getRandom = (arr, n) => {
        var result = new Array(n),
          len = arr.length,
          taken = new Array(len)
        if (n > len) throw new RangeError('getRandom: more elements taken than available')
        while (n--) {
          var x = Math.floor(Math.random() * len)
          result[n] = arr[x in taken ? taken[x] : x]
          taken[x] = --len in taken ? taken[len] : len
        }
        return result
      }

      let object = {}
      object.nfts = getRandom(SearchList.nfts, Math.floor(Math.random() * 5))
      object.artists = getRandom(SearchList.artists, Math.floor(Math.random() * 5))
      object.collections = getRandom(SearchList.collections, Math.floor(Math.random() * 5))
      setSearchList(object)
    } else {
      setSearchList({ nfts: [], artists: [], collections: [] })
    }
  }, [searchKeyword])

  const handleSearch = () => {
    if (searchKeyword !== '') {
      const getRandom = (arr, n) => {
        var result = new Array(n),
          len = arr.length,
          taken = new Array(len)
        if (n > len) throw new RangeError('getRandom: more elements taken than available')
        while (n--) {
          var x = Math.floor(Math.random() * len)
          result[n] = arr[x in taken ? taken[x] : x]
          taken[x] = --len in taken ? taken[len] : len
        }
        return result
      }

      let object = {}
      object.nfts = getRandom(SearchList.nfts, Math.floor(Math.random() * 5))
      object.artists = getRandom(SearchList.artists, Math.floor(Math.random() * 5))
      object.collections = getRandom(SearchList.collections, Math.floor(Math.random() * 5))
      setSearchList(object)
    } else {
      setSearchList({ nfts: [], artists: [], collections: [] })
    }
  }

  const handleClose = () => {
    setSearchList({ nfts: [], artists: [], collections: [] })
  }

  const { connected } = useWallet()

  const openMobileMenu = useSelector(state => state.openMobileMenu)
  const openMobileSearchBox = useSelector(state => state.openMobileSearchBox)
  const openConnectWallet = useSelector(state => state.openConnectWallet)
  const dispatch = useDispatch()

  const handleExploreMenu = item => {
    dispatch({ type: 'set', exploreTab: item.id })
    router.push(item.path)
  }

  const handleOpenMobileSearchBox = () => {
    dispatch({ type: 'set', openMobileSearchBox: !openMobileSearchBox })
  }

  const handleOpenMobileMenu = () => {
    dispatch({ type: 'set', openMobileMenu: !openMobileMenu })
  }

  const handleGotoHomepage = () => {
    dispatch({ type: 'set', openMobileSearchBox: false })
    dispatch({ type: 'set', openMobileMenu: false })
    router.push('/')
  }

  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    <div className={styles.blurContainer}>
      <div className={styles.container}>
        <div className="g-container w-full h-full flex justify-between items-center gap-4">
          <div
            className="cursor-pointer min-w-[140px] xl:min-w-[176px] flex items-center"
            onClick={() => handleGotoHomepage()}
          >
            <Image src={LogoTextIcon} alt="" />
          </div>
          <SearchBox
            value={searchKeyword}
            placeholder="Search by NFT, Collection, or Artist"
            onChange={value => setSearchKeyword(value)}
            searchList={searchList}
            viewport={viewport}
            onClick={() => handleSearch()}
            onClose={() => handleClose()}
          />
          <Menu label="Explore" menuList={ExploreMenuList} onSelect={item => handleExploreMenu(item)} />
          <Menu label="Create" menuList={CreateMenuList} onSelect={item => router.push(item.path)} />
          <WalletButton />
          <ProfileMenu
            avatar={AvatarImage}
            menuList={ProfileMenuList}
            onSelect={item => router.push(item.path)}
            connectWalletStatus={connected}
          />
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.mobileBlurContainer}>
      <div className={styles.mobileContainer}>
        <div className="g-container flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => handleGotoHomepage()}>
            <Image src={LogoTextMobileIcon} width={110} height={25} alt="" />
          </div>
          <div className="flex">
            <IconButton
              icon={SearchGrayIcon}
              onClick={() => handleOpenMobileSearchBox()}
              backgroundColor="transparent"
            />
            <div className="ml-3">
              <IconButton
                icon={HamburgerMenuGreenIcon}
                onClick={() => handleOpenMobileMenu()}
                backgroundColor="transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrimaryHeader
