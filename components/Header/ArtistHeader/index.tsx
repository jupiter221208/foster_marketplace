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
import ExploreMenu from 'components/Menu/ExploreMenu'
import WalletButton from 'components/Button/WalletButton'
import ProfileMenu from 'components/Menu/ProfileMenu'
import IconButtonWithSVG from 'components/Button/IconButtonWithSVG'

// custom functions
import { useViewport } from 'utils'
import { useAuthentication } from 'hooks/useAuthentication'

// images and icons
import SearchWhiteIcon from 'assets/icons/search-white.svg?component'
import DarkLightModeIcon from 'assets/icons/dark-light-mode-mobile.svg?component'
import LightDarkModeIcon from 'assets/icons/light-dark-mode-mobile.svg?component'
import FosterNavLogo from 'assets/icons/foster-logo-nav-mobile.svg?component'
import FosterLogoDark from 'assets/icons/foster-logo-dark.svg?component'
import NotificationIcon from 'assets/icons/notification-icon-navbar.svg?component'
import ShoppingCartIcon from 'assets/icons/shoppingcart-icon-navbar.svg?component'
import FosterHeroLogo from 'assets/icons/foster-hero-logo-new.svg?component'
import FosterLogo from 'assets/logo.svg?component'

// json
import { activeList, filterList, categoryList, performerList } from 'assets/json/explore-menu.json'
import CreateMenuList from 'assets/json/create-menu.json'
import ProfileMenuList from 'assets/json/profile-menu.json'
import { setColorTheme } from 'utils/helpers'

// styles
import styles from './index.module.scss'

// call apis
import searchAPI from 'apis/search'
import userAPI from 'apis/user'

const PrimaryHeader = () => {
  const viewport = useViewport()
  const router = useRouter()
  const routePath = router.pathname
  const dispatch = useDispatch()
  const { setVisible } = useWalletModal()
  const { connected } = useWallet()
  const { profileInfo } = useAuthentication()
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchList, setSearchList] = useState({ nfts: [], artists: [], collections: [] })
  const [isNewNotification, setIsNewNotification] = useState(false)
  const [isScrollTop, setIsScrollTop] = useState(true)
  const [isScrollingTop, setIsScrollingTop] = useState(true)
  const [lightMode, setLightMode] = useState(useSelector(state => (state as any).lightMode))
  const openMobileSearchBox = useSelector(state => (state as any).openMobileSearchBox)
  const openMobileMenu = useSelector(state => (state as any).openMobileMenu)
  const markAsRead = useSelector(state => (state as any).markAsRead)

  let timer = null

  let lastScrollPosition = 0

  useEffect(() => {
    const intervalId = setInterval(() => {
      const position = window.pageYOffset

      if (position > 50) setIsScrollTop(false)
      else setIsScrollTop(true)

      if (position < 250) {
        lastScrollPosition = position
        setIsScrollingTop(true)
      } else if (position > lastScrollPosition) {
        lastScrollPosition = position
        setIsScrollingTop(false)
      } else if (position < lastScrollPosition) {
        lastScrollPosition = position
        setIsScrollingTop(true)
      }
    }, 100)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (connected && router.asPath !== '/notifications') {
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
    }
  }, [])

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
    if (searchKeyword !== '' && searchKeyword.length >= 2) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      timer = setTimeout(() => {
        setSearchList({ nfts: [], artists: [], collections: [] })
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

  const handleThemeMode = (changeTo = !lightMode) => {
    setColorTheme(changeTo)
    dispatch({ type: 'set', lightMode: changeTo })
    setLightMode(changeTo)
  }

  const handleClear = () => {
    setSearchKeyword('')
    setSearchList({ nfts: [], artists: [], collections: [] })
  }

  const handleClose = () => {
    setSearchKeyword('')
    setSearchList({ nfts: [], artists: [], collections: [] })
  }

  const handleSelectMenu = (item: any) => {
    if (connected) {
      router.push(item.path)
    } else {
      setVisible(true)
    }
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

  return (
    <div className="fixed top-0 left-0 z-50 w-full">
      {viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? (
        <div
          className={`${styles.blurContainer} ${
            isScrollingTop ? 'top-0' : '-top-28'
          } flex justify-center transition-all`}
        >
          <nav className="gap-16 flex justify-between w-full max-w-[1750px] p-6 ">
            <div className={`${styles.linkNames} flex gap-14 my-auto items-center w-full max-w-max`}>
              <div className="cursor-pointer" onClick={() => handleGotoHomepage()}>
                <FosterLogo className={styles.logoIcon} />
              </div>

              <div className={styles.studioMenu} onClick={() => router.push('/studio')}>
                Studio
              </div>

              <div>
                <ExploreMenu
                  label="Explore"
                  activeList={activeList}
                  filterList={filterList}
                  categoryList={categoryList}
                  performerList={performerList}
                />
              </div>

              <div>
                <Menu label="Create" menuList={CreateMenuList} onSelect={item => handleSelectMenu(item)} />
              </div>
            </div>

            <div className="w-full">
              <SearchBox
                value={searchKeyword}
                placeholder="Search Marketplace"
                onChange={value => setSearchKeyword(value)}
                searchList={searchList}
                onClick={() => handleClear()}
                onClose={() => handleClose()}
              />
            </div>

            <div className="flex items-center my-auto min-w-max">
              <div className="flex">
                {connected && (
                  <>
                    <div className="flex flex-row">
                      <div>
                        <WalletButton />
                      </div>
                      <div
                        className={`${styles.iconArea} flex mr-[20px] cursor-pointer`}
                        onClick={() => {
                          dispatch({ type: 'set', activeTab: 4 })
                          router.push(`/merch-logs`)
                        }}
                      >
                        <ShoppingCartIcon alt="" />
                      </div>
                      <div
                        className={`${styles.iconArea} flex relative cursor-pointer`}
                        onClick={() => router.push('/notifications')}
                      >
                        <NotificationIcon alt="" />
                      </div>
                    </div>
                  </>
                )}

                {connected && isNewNotification && (
                  <div className="absolute ml-[155px] mt-[-10px]" onClick={() => router.push('/notifications')}>
                    <Lottie animationData={NotifyAlarmIcon} loop={true} />
                  </div>
                )}
              </div>

              <div className="min-w-fit">
                <ProfileMenu
                  avatar={profileInfo?.profile_picture}
                  wallet={profileInfo?.wallet_id}
                  username={profileInfo?.username ?? ''}
                  menuList={profileMenuList}
                  onSelect={item => router.push(item.path)}
                  connectWalletStatus={connected}
                  lightMode={lightMode}
                  handleThemeMode={handleThemeMode}
                />
              </div>

              {!connected && (
                <button className="ml-7" onClick={() => handleThemeMode()}>
                  {lightMode ? <LightDarkModeIcon /> : <DarkLightModeIcon />}
                </button>
              )}
            </div>
          </nav>
        </div>
      ) : (
        <div
          className={`${isScrollTop ? styles.mobileNonBlurContainer : styles.mobileBlurContainer} ${
            isScrollingTop ? 'top-0' : '-top-28'
          } transition-all`}
        >
          {isScrollingTop && (
            <div className={styles.mobileContainer}>
              <div className="g-container flex justify-between items-center">
                <div className="flex">
                  <div className="flex cursor-pointer items-center" onClick={() => handleGotoHomepage()}>
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
          )}
          <div className={styles.divider} />
        </div>
      )}
    </div>
  )
}

export default PrimaryHeader
