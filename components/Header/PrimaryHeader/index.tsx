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
import IconButton from 'components/Button/IconButton'
// custom functions
import { useViewport } from 'utils'

// images and icons
import AvatarImage from 'assets/images/dashboard-avatar.png'
import SearchWhiteIcon from 'assets/icons/search-white.svg'
import SearchDarkIcon from 'assets/icons/search-dark.svg'

import HamburgerMenuGreenIcon from 'assets/icons/hamburger-menu-green.svg'
import HamburgerMenuDarkIcon from 'assets/icons/hamburger-menu-dark.svg'
import LogoIcon from 'assets/icons/logo-green.svg'
import LogoDarkIcon from 'assets/icons/logo-dark.svg'
import alphaGreenIcon from 'assets/icons/alpha-green.svg'
import alphaBlackIcon from 'assets/icons/alpha-black.png'
import alphaGreenMobileIcon from 'assets/icons/alpha-green-mobile.svg'
import alphaBlackMobileIcon from 'assets/icons/alpha-black-mobile.png'

// json
import ExploreMenuList from 'assets/json/explore-menu.json'
import CreateMenuList from 'assets/json/create-menu.json'
import ProfileMenuList from 'assets/json/profile-menu.json'

// styles
import styles from './index.module.scss'

// call apis
import authAPI from 'apis/auth'
import searchAPI from 'apis/search'

const PrimaryHeader = () => {
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
  const routePath = router.pathname

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
      <div className={styles.blurContainer}>
        <div className={styles.container}>
          <div className="g-container w-full h-full flex justify-between items-center gap-4">
            {!connected && routePath !== '/' && (
              <div className={styles.logoArea} onClick={() => router.push('/')}>
                <svg
                  id="Component_2298"
                  data-name="Component 2298"
                  xmlns="http://www.w3.org/2000/svg"
                  width="30.582"
                  height="35.506"
                  viewBox="0 0 30.582 35.506"
                >
                  <path
                    id="Path_105643"
                    data-name="Path 105643"
                    d="M216.776,111.277a1.725,1.725,0,0,1,.341-.9c-1.908-2.484-7.555-8.567-9.842-16.315C207.274,94.06,202.487,101.214,216.776,111.277Z"
                    transform="translate(-206.504 -82.563)"
                    fill="var(--chevron-up-icon-color)"
                  />
                  <path
                    id="Path_105644"
                    data-name="Path 105644"
                    d="M232,48.433c-7.9-17.439-5.1-23.613-5.1-23.613-1.661.138-5.745,2.863-5.481,6.607.446,6.426,7.13,15.1,9.242,17.7A4.541,4.541,0,0,1,232,48.433Z"
                    transform="translate(-219.58 -21.786)"
                    fill="var(--chevron-up-icon-color)"
                  />
                  <path
                    id="Path_105645"
                    data-name="Path 105645"
                    d="M279.569,26.2c.17,0,.339,0,.507.012.394-5.721,1.123-19.9.733-23.821-.416-4.156-6.752-2.127-7.72.276-2.737,6.8,2.689,20.2,4.253,23.787A9.6,9.6,0,0,1,279.569,26.2Z"
                    transform="translate(-264.285 0.005)"
                    fill="var(--chevron-up-icon-color)"
                  />
                  <path
                    id="Path_105646"
                    data-name="Path 105646"
                    d="M341.13,32.516a8.555,8.555,0,0,1,1.386.273c3.259-6.53,5.932-15.09,5.424-20.828-.446-5.03-5.576-4.847-5.576-4.847C343.091,14.449,341.591,28.514,341.13,32.516Z"
                    transform="translate(-324.675 -6.243)"
                    fill="var(--chevron-up-icon-color)"
                  />
                  <path
                    id="Path_105647"
                    data-name="Path 105647"
                    d="M364.621,40.35c.815,8.236-4.262,18.761-5.891,21.886a3.7,3.7,0,0,1,1.1.708c3.2-4.546,7.465-9.591,8.589-15.647C369.345,42.283,364.621,40.35,364.621,40.35Z"
                    transform="translate(-340.123 -35.419)"
                    fill="var(--chevron-up-icon-color)"
                  />
                  <path
                    id="Path_105648"
                    data-name="Path 105648"
                    d="M379.983,94.06c-.46,5.98-6.673,13.626-9.193,16.5a1.672,1.672,0,0,1,.174.439C386.354,101.661,379.983,94.06,379.983,94.06Z"
                    transform="translate(-350.709 -82.563)"
                    fill="var(--chevron-up-icon-color)"
                  />
                  <path
                    id="Path_105649"
                    data-name="Path 105649"
                    d="M300.66,220.27c-2.375,0-4.3.856-4.3,1.919a4.827,4.827,0,0,0,.331,1.885,3.9,3.9,0,0,0,.253.56,1.422,1.422,0,0,1,.225-.295,2.719,2.719,0,0,1,.868-.548,6.936,6.936,0,0,1,2.624-.463,7.594,7.594,0,0,1,2.063.268,3.336,3.336,0,0,1,1.43.743,1.458,1.458,0,0,1,.229.3,4.011,4.011,0,0,0,.252-.56,4.838,4.838,0,0,0,.332-1.885C304.962,221.129,303.037,220.27,300.66,220.27Z"
                    transform="translate(-285.375 -193.345)"
                    fill="var(--chevron-up-icon-color)"
                  />
                  <path
                    id="Path_105650"
                    data-name="Path 105650"
                    d="M308.11,250.07c-1.823,0-3.3.438-3.3.978s1.478.978,3.3.978,3.3-.438,3.3-.978S309.933,250.07,308.11,250.07Z"
                    transform="translate(-292.795 -219.503)"
                    fill="var(--chevron-up-icon-color)"
                  />
                  <path
                    id="Path_105651"
                    data-name="Path 105651"
                    d="M314.416,271.442a21.012,21.012,0,0,0-2.689-.755c-.284-.031-.747.037-.747.592s.465,1.881,3.014,1.821c1.088-.024,1.7-.275,1.847-.611S315.737,271.993,314.416,271.442Z"
                    transform="translate(-298.211 -237.595)"
                    fill="var(--chevron-up-icon-color)"
                  />
                  <path
                    id="Path_105652"
                    data-name="Path 105652"
                    d="M325.229,269.379l2.413.79s.583.174.733-.2.171-.794-.455-.835S323.742,268.891,325.229,269.379Z"
                    transform="translate(-310.4 -236.169)"
                    fill="var(--chevron-up-icon-color)"
                  />
                </svg>
              </div>
            )}
            <div className="w-full max-w-[708px] min-w-[448px] flex items-center">
              <SearchBox
                value={searchKeyword}
                placeholder="Search by NFT, Collection, or Artist"
                onChange={value => setSearchKeyword(value)}
                searchList={searchList}
                onClick={() => handleClear()}
                onClose={() => handleClose()}
              />
              <div className={styles.alphaArea}>
                <Image src={lightMode ? alphaBlackIcon : alphaGreenIcon} alt="" width="105" height="17" />
              </div>
            </div>
            <div className="cursor-pointer min-w-[40px] xl:min-w-[70px] 2xl:min-w-[280px] flex items-center" />
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
          />
        </div>
      )}
    </div>
  ) : (
    <div className={styles.mobileBlurContainer}>
      <div className={styles.mobileContainer}>
        <div className="g-container flex justify-between items-center">
          <div className="flex">
            <div className="cursor-pointer" onClick={() => handleGotoHomepage()}>
              <Image src={lightMode ? LogoDarkIcon : LogoIcon} alt="" />
            </div>
            <div className={styles.alphaArea}>
              <Image src={lightMode ? alphaBlackMobileIcon : alphaGreenMobileIcon} alt="" width="71" height="12" />
            </div>
          </div>
          <div className="flex">
            <IconButton
              icon={SearchWhiteIcon}
              onClick={() => handleOpenMobileSearchBox()}
              backgroundColor="transparent"
            />
            <div>
              <IconButton
                icon={lightMode ? HamburgerMenuDarkIcon : HamburgerMenuGreenIcon}
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
