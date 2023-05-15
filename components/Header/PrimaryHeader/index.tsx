import React, { useEffect, useState } from 'react'

// next components
import { useRouter } from 'next/router'

// third party components
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useDispatch, useSelector } from 'react-redux'
import Lottie from 'lottie-react'
import NotifyAlarmIcon from 'assets/lottery/notify-alarm.json'

// custom components
import SearchBox from 'components/Input/SearchBox'
import Menu from 'components/Menu'
import WalletButton from 'components/Button/WalletButton'
import ProfileMenu from 'components/Menu/ProfileMenu'
import IconButtonWithSVG from 'components/Button/IconButtonWithSVG'

// custom functions
import { useViewport } from 'utils'

// images and icons
import AvatarImage from 'assets/images/dashboard-avatar.png'
import SearchWhiteIcon from 'assets/icons/search-white.svg?component'
import DarkLightModeIcon from 'assets/icons/dark-light-mode-mobile.svg?component'
import LightDarkModeIcon from 'assets/icons/light-dark-mode-mobile.svg?component'
import FosterNavLogo from 'assets/icons/foster-logo-nav-mobile.svg?component'
import FosterLogoDark from 'assets/icons/foster-logo-dark.svg?component'
import NotificationIcon from 'assets/icons/notification-icon-navbar.svg?component'

// json
import ExploreMenuList from 'assets/json/explore-menu.json'
import CreateMenuList from 'assets/json/create-menu.json'
import ProfileMenuList from 'assets/json/profile-menu.json'
import { setColorTheme } from 'utils/helpers'

// styles
import styles from './index.module.scss'

// call apis
import authAPI from 'apis/auth'
import searchAPI from 'apis/search'
import userAPI from 'apis/user'
import { loginWithSigned } from 'utils/auth'

const PrimaryHeader = () => {
  const viewport = useViewport()
  const router = useRouter()
  const dispatch = useDispatch()
  const loginAndRefresh = useSelector(state => (state as any).loginAndRefresh)
  const markAsRead = useSelector(state => (state as any).markAsRead)
  const [isScrollTop, setIsScollTop] = useState(true)
  const [lightMode, setLightMode] = useState(useSelector(state => (state as any).lightMode))
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchList, setSearchList] = useState({ nfts: [], artists: [], collections: [] })
  const [profileImage, setProfileImage] = useState('')
  const [isNewNotification, setIsNewNotification] = useState(false)

  let timer = null

  const handleThemeMode = () => {
    setColorTheme(!lightMode)
    dispatch({ type: 'set', lightMode: !lightMode })
    setLightMode(!lightMode)
  }

  useEffect(() => {
    window.addEventListener('scroll', function () {
      let scrollTop = document.documentElement.scrollTop
      setIsScollTop(scrollTop < 10)
    })

    userAPI.getNotifications().then(
      response => {
        if (response !== null) {
          if (response.notifications.length > 0) {
            checkNotifications([...response.notifications])
          }
        }
      },
      error => {
        console.log(error)
      }
    )
  }, [])

  useEffect(() => {
    if (markAsRead) {
      setIsNewNotification(false)
      dispatch({ type: 'set', markAsRead: false })
    }
  }, [markAsRead])

  async function checkNotifications(notifications) {
    notifications.forEach(notification => {
      if (notification.acknowledged === false) {
        setIsNewNotification(true)
        return
      }
    })
  }

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

  const { connected, publicKey, signMessage } = useWallet()
  const { setVisible } = useWalletModal()
  const openMobileMenu = useSelector(state => (state as any).openMobileMenu)
  const openMobileSearchBox = useSelector(state => (state as any).openMobileSearchBox)
  const profileInfo = useSelector(state => (state as any).profileInfo)
  const routePath = router.pathname

  // update profile menu list
  const [profileMenuList, setProfileMenuList] = useState(ProfileMenuList)
  useEffect(() => {
    if (profileInfo !== null) {
      let array = [...profileMenuList]
      array.forEach(item => {
        if (item.label === 'Profile' && item.path === '/') {
          item.path += profileInfo.username.replaceAll(' ', '%20')
        }
      })
      setProfileMenuList(array)
    }
  }, [profileInfo])

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
  const [notificationOffset, setNotificationOffset] = useState([0, 0])

  useEffect(() => {
    if (document.getElementById('walletButton') !== null) {
      let offsets = document?.getElementById('walletButton')?.getBoundingClientRect() || { top: 0, left: 0 }
      setOffset([offsets.top, offsets.left])
    }
    if (document.getElementById('profileButton') !== null) {
      let offsets = document?.getElementById('profileButton')?.getBoundingClientRect() || { top: 0, left: 0 }
      setProfileOffset([offsets.top, offsets.left])
    }
    if (document.getElementById('notificationButton') !== null) {
      let offsets = document?.getElementById('notificationButton')?.getBoundingClientRect() || { top: 0, left: 0 }
      setNotificationOffset([offsets.top, offsets.left])
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
      if (document.getElementById('notificationButton') !== null) {
        let offsets = document?.getElementById('notificationButton')?.getBoundingClientRect() || { top: 0, left: 0 }
        setNotificationOffset([offsets.top, offsets.left])
      }
    }
    window.addEventListener('resize', resizeFunction)
  }, [connected])

  useEffect(() => {
    ;(async () => {
      if (!connected || profileInfo || loginAndRefresh) return
      let signature = await signMessage(Buffer.from('Foster Protocol'))
      loginWithSigned(publicKey, signature)
    })()
  }, [connected, signMessage])

  const handleSelectMenu = (item: any) => {
    if (connected) {
      router.push(item.path)
    } else {
      setVisible(true)
    }
  }

  return viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
    <div>
      <div className={styles.blurContainer}>
        <div className={styles.container}>
          <div className="g-container w-full h-full flex justify-between items-center gap-4">
            {routePath !== '/' && (
              <div className={styles.logoArea} onClick={() => router.push('/')}>
                <FosterLogoDark alt="" />
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
                <svg
                  id="Alpha_Icon_SVG_-_95DBD5_-_Desktop"
                  data-name="Alpha Icon SVG - 95DBD5 - Desktop"
                  xmlns="http://www.w3.org/2000/svg"
                  width="104.19"
                  height="17.641"
                  viewBox="0 0 104.19 17.641"
                >
                  <g id="Alpha_Icon_SVG_-_95DBD5" data-name="Alpha Icon SVG - 95DBD5">
                    <path
                      id="Path_108463"
                      data-name="Path 108463"
                      transform="translate(0 0.091)"
                      fill="var(--mint-btn-bg-1)"
                      fillRule="evenodd"
                    />
                    <path
                      id="Path_108464"
                      data-name="Path 108464"
                      d="M4.846,8.428C2.308,13.1.2,17.018.16,17.131s.612.2,1.534.2H3.3l3.077-5.587C8.07,8.675,9.505,6.161,9.568,6.161s1.139,1.861,2.394,4.137l2.281,4.137-2.337.061-2.337.061v2.779h4.74a22.336,22.336,0,0,0,4.668-.2c-.171-.49-9.312-17.2-9.408-17.2-.059,0-2.184,3.824-4.722,8.5m20.605.3V17.55H36.184V14.756H28.463L28.406,7.4,28.35.036,26.9-.028,25.452-.091v8.82m37.347-.1v8.7h3V-.071h-3v8.7M75.893,3.474V7.02H67.5l.064,1.343.064,1.343,4.132.058,4.132.058v7.512h3V-.071h-3V3.474M90.059,8.428c-2.538,4.674-4.647,8.59-4.686,8.7s.612.2,1.534.2h1.606l3.077-5.587c1.692-3.073,3.128-5.587,3.19-5.587s1.139,1.861,2.394,4.137l2.281,4.137-2.337.061-2.337.061v2.779h4.74a22.336,22.336,0,0,0,4.668-.2c-.172-.49-9.312-17.2-9.408-17.2-.059,0-2.184,3.824-4.722,8.5M42.666,1.272,42.731,2.4l3.971.107c4.174.113,4.424.169,5.393,1.217a3.132,3.132,0,0,1,1.046,2.544,3.134,3.134,0,0,1-1.046,2.544c-1.054,1.14-1.4,1.217-5.6,1.217H42.623V17.55h3V12.673l2.576-.139c4.09-.22,6.085-1.191,7.393-3.6a4.435,4.435,0,0,0,.62-2.684,4.28,4.28,0,0,0-.647-2.7A7.3,7.3,0,0,0,53.9,1.619C52.214.331,51.292.143,46.666.143H42.6l.065,1.128"
                      transform="translate(0 0.091)"
                      fill="var(--mint-btn-bg-1)"
                      fillRule="evenodd"
                    />
                  </g>
                </svg>
              </div>
            </div>
            <div className="cursor-pointer min-w-[40px] xl:min-w-[70px] 2xl:min-w-[280px] flex items-center" />
            <div id="exploreButton" className="h-full w-[100px] min-w-[100px]" />
            <div id="createButton" className="h-full min-w-[80px]" />
            <div id="walletButton" className={connected ? 'h-full min-w-[180px]' : 'h-full min-w-[220px]'} />
            <div id="notificationButton" className={connected ? 'min-w-[46px] h-full' : 'w-[0px]'} />
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

      {connected && notificationOffset[1] !== 0 && (
        <div
          style={{
            zIndex: 10000,
            position: 'fixed',
            cursor: 'pointer',
            top: `${notificationOffset[0] + 27}px`,
            left: `${notificationOffset[1] + 5}px`,
          }}
          onClick={() => router.push('/notifications')}
        >
          <NotificationIcon alt="" />
        </div>
      )}

      {connected && notificationOffset[1] !== 0 && isNewNotification && (
        <div
          style={{
            zIndex: 10000,
            position: 'fixed',
            cursor: 'pointer',
            top: `${notificationOffset[0] + 17}px`,
            left: `${notificationOffset[1] + 27}px`,
          }}
          onClick={() => router.push('/notifications')}
        >
          <Lottie animationData={NotifyAlarmIcon} loop={true} />
        </div>
      )}

      {profileOffset[1] !== 0 && (
        <div
          style={{
            zIndex: 10000,
            position: 'fixed',
            top: `${profileOffset[0] + 27}px`,
            left: `${profileOffset[1] - 0}px`,
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

      {profileOffset[1] !== 0 && !connected && (
        <div
          style={{
            zIndex: 10000,
            position: 'fixed',
            width: 83,
            height: 44,
            top: `${profileOffset[0] + 27}px`,
            left: `${profileOffset[1] + 70}px`,
          }}
          onClick={() => handleThemeMode()}
        >
          {lightMode ? <LightDarkModeIcon /> : <DarkLightModeIcon />}
        </div>
      )}
    </div>
  ) : (
    <div className={isScrollTop ? styles.mobileNonBlurContainer : styles.mobileBlurContainer}>
      <div className={styles.mobileContainer}>
        <div className="g-container flex justify-between items-center">
          <div className="flex">
            <div className="flex cursor-pointer items-center" onClick={() => handleGotoHomepage()}>
              {/* <Image src={lightMode ? LogoDarkIcon : LogoIcon} alt="" /> */}
              <FosterNavLogo width={101} height={23} />
            </div>
          </div>
          <div className="flex">
            <div className="w-[39px] h-[39px] flex justify-center items-center">
              <SearchWhiteIcon onClick={() => handleOpenMobileSearchBox()} />
            </div>
            <div>
              <IconButtonWithSVG
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="13.2" viewBox="0 0 22 13.2">
                    <path
                      id="bars-2"
                      d="M3.1,8.2H22.9a1.1,1.1,0,1,0,0-2.2H3.1a1.1,1.1,0,1,0,0,2.2ZM22.9,17H3.1a1.1,1.1,0,0,0,0,2.2H22.9a1.1,1.1,0,1,0,0-2.2Zm0-5.5H3.1a1.1,1.1,0,0,0,0,2.2H22.9a1.1,1.1,0,1,0,0-2.2Z"
                      transform="translate(-2 -6)"
                      fill="var(--mint-btn-bg-1)"
                    />
                  </svg>
                }
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
