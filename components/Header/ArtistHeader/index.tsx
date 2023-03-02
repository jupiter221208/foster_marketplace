import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// third party components
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useDispatch, useSelector } from 'react-redux'

// custom components
import SearchBox from 'components/Input/SearchBox'
import Menu from 'components/Menu'
import WalletButton from 'components/Button/WalletButton'
import ProfileMenu from 'components/Menu/ProfileMenu'
// custom functions
import { useViewport } from 'utils'

// images and icons
import AvatarImage from 'assets/images/dashboard-avatar.png'
import BackButton from 'assets/icons/artist-back-icon.svg'
import SearchButton from 'assets/icons/artist-search-icon.svg'
import MenuButton from 'assets/icons/artist-menu-icon.svg'
import LogoIcon from 'assets/icons/logo-light-green.svg'
import LogoDarkIcon from 'assets/icons/logo-dark.svg'

// json
import SearchList from 'assets/json/search-list.json'
import ExploreMenuList from 'assets/json/explore-menu.json'
import CreateMenuList from 'assets/json/create-menu.json'
import ProfileMenuList from 'assets/json/profile-menu.json'

// styles
import styles from './index.module.scss'

// call apis
import authAPI from 'apis/auth'
import searchAPI from 'apis/search'
import { isLoggedIn } from 'utils/helpers'

const ArtistHeader = () => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const loginAndRefresh = useSelector(state => (state as any).loginAndRefresh)

  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchList, setSearchList] = useState({ nfts: [], artists: [], collections: [] })
  const [profileImage, setProfileImage] = useState('')
  let timer = null

  useEffect(() => {
    if (searchKeyword !== '' && searchKeyword.length >= 2) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      timer = setTimeout(() => {
        searchAPI.search(searchKeyword).then(
          response => {
            let object: any = {}
            object.nfts = response.nfts
            object.artists = response.artists
            object.collections = response.collections
            setSearchList(object)
          },
          error => {
            console.log(error)
          }
        )
      }, 500)
    } else {
      setSearchList({ nfts: [], artists: [], collections: [] })
    }
  }, [searchKeyword])

  const handleClear = () => {
    setSearchKeyword('')
    setSearchList({ nfts: [], artists: [], collections: [] })
  }

  const handleClose = () => {
    setSearchKeyword('')
    setSearchList({ nfts: [], artists: [], collections: [] })
  }

  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const openMobileMenu = useSelector(state => (state as any).openMobileMenu)
  const openMobileSearchBox = useSelector(state => (state as any).openMobileSearchBox)
  const profileInfo = useSelector(state => (state as any).profileInfo)

  // update profile menu list
  const [profileMenuList, setProfileMenuList] = useState(ProfileMenuList)
  useEffect(() => {
    if (publicKey !== null) {
      let array = [...profileMenuList]
      array.forEach(item => {
        if (item.label === 'Profile' && item.path === '/artist-profile?id=') {
          item.path += publicKey.toString()
        }
      })
      setProfileMenuList(array)
    }
  }, [publicKey])

  useEffect(() => {
    if (profileInfo && profileInfo.profile_picture) {
      setProfileImage(profileInfo.profile_picture)
    }
  }, [profileInfo])

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

  const [offset, setOffset] = useState([0, 0])
  const [profileOffset, setProfileOffset] = useState([0, 0])

  useEffect(() => {
    if (document.getElementById('walletButton') !== null) {
      let offsets = document?.getElementById('walletButton')?.getBoundingClientRect() || { top: 0, left: 0 }
      setOffset([offsets.top, offsets.left])
    }
    if (document.getElementById('profileButton') !== null) {
      let offsets = document?.getElementById('profileButton')?.getBoundingClientRect() || { top: 0, left: 0 }
      setProfileOffset([offsets.top, offsets.left])
    }
  }, [connected])

  useEffect(() => {
    const resizeFunction = () => {
      if (document.getElementById('walletButton') !== null) {
        let offsets = document?.getElementById('walletButton')?.getBoundingClientRect() || { top: 0, left: 0 }
        setOffset([offsets.top, offsets.left])
      }
      if (document.getElementById('profileButton') !== null) {
        let offsets = document?.getElementById('profileButton')?.getBoundingClientRect() || { top: 0, left: 0 }
        setProfileOffset([offsets.top, offsets.left])
      }
    }
    window.addEventListener('resize', resizeFunction)
  }, [connected])

  useEffect(() => {
    if (connected) {
      if (!profileInfo && !loginAndRefresh) {
        authAPI.login({ wallet_id: publicKey?.toBase58() || '' }).then(
          response => {
            if (response.new_user === true) {
              dispatch({ type: 'set', profileSetup: true })
            }
            dispatch({ type: 'set', profileInfo: response.user })
            dispatch({ type: 'set', bidWalletLock: response.bid_wallet_lock })
            dispatch({ type: 'set', offerWalletLock: response.offer_wallet_lock })
          },
          error => {
            console.log(error)
          }
        )
      }
    }
  }, [connected])

  const handleSelectMenu = (item: any) => {
    if (connected) {
      router.push(item.path)
    } else {
      setVisible(true)
    }
  }

  const lightMode = useSelector(state => (state as any).lightMode)

  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    <div>
      <div className={`${styles.blurContainer} ${lightMode === true ? styles.lightBlurContainer : ''}`}>
        <div className={styles.container}>
          <div className="g-container w-full h-full flex justify-between items-center gap-4">
            {!connected && (
              <div className={styles.logoArea} onClick={() => router.push('/')}>
                <Image src={lightMode ? LogoDarkIcon : LogoIcon} alt="" />
              </div>
            )}
            <SearchBox
              value={searchKeyword}
              placeholder="Search by NFT, Collection, or Artist"
              onChange={value => setSearchKeyword(value)}
              searchList={searchList}
              onClick={() => handleClear()}
              onClose={() => handleClose()}
            />
            <div className="cursor-pointer min-w-[80px] xl:min-w-[120px] 2xl:min-w-[376px] flex items-center" />
            <div id="exploreButton" className="h-full w-[100px] min-w-[100px]" />
            <div id="createButton" className="h-full min-w-[80px]" />
            <div id="walletButton" className={connected ? 'h-full min-w-[180px]' : 'h-full min-w-[220px]'} />
            <div id="profileButton" className="h-full min-w-[40px]" />
          </div>
        </div>
      </div>
      {offset[1] !== 0 && (
        <div style={{ zIndex: 10000, position: 'fixed', top: `${offset[0] + 38}px`, left: `${offset[1] - 262}px` }}>
          <Menu label="Explore" menuList={ExploreMenuList} onSelect={item => handleExploreMenu(item)} />
        </div>
      )}
      {offset[1] !== 0 && (
        <div style={{ zIndex: 10000, position: 'fixed', top: `${offset[0] + 25}px`, left: `${offset[1]}px` }}>
          <WalletButton />
        </div>
      )}
      {offset[1] !== 0 && (
        <div style={{ zIndex: 10000, position: 'fixed', top: `${offset[0] + 38}px`, left: `${offset[1] - 130}px` }}>
          <Menu label="Create" menuList={CreateMenuList} onSelect={item => handleSelectMenu(item)} />
        </div>
      )}
      {offset[1] !== 0 && (
        <div style={{ zIndex: 10000, position: 'fixed', top: `${offset[0] + 25}px`, left: `${offset[1]}px` }}>
          <WalletButton />
        </div>
      )}
      {profileOffset[1] !== 0 && (
        <div
          style={{
            zIndex: 10000,
            position: 'fixed',
            top: `${profileOffset[0] + 27}px`,
            left: `${profileOffset[1] - 5}px`,
          }}
        >
          <ProfileMenu
            avatar={profileImage.length > 0 ? profileImage : AvatarImage}
            menuList={profileMenuList}
            onSelect={item => router.push(item.path)}
            connectWalletStatus={connected}
          />{' '}
        </div>
      )}
    </div>
  ) : (
    <div className={`${styles.mobileBlurContainer} ${lightMode === true ? styles.lightMobileBlurContainer : ''}`}>
      <div className={styles.mobileContainer}>
        <div className="g-container flex justify-between items-center">
          <div className="cursor-pointer" onClick={() => handleGotoHomepage()}>
            <div className={styles.backButton}>
              <Image src={BackButton} alt="" />
            </div>
          </div>
          <div className="flex">
            <div className={styles.backButton} onClick={() => handleOpenMobileSearchBox()}>
              <Image src={SearchButton} alt="" />
            </div>

            <div className={`${styles.backButton} ml-3`} onClick={() => handleOpenMobileMenu()}>
              <Image src={MenuButton} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArtistHeader
