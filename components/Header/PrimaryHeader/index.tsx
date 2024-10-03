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
import ExploreMenu from 'components/Menu/ExploreMenu'
import WalletButton from 'components/Button/WalletButton'
import ProfileMenu from 'components/Menu/ProfileMenu'

// custom functions
import { useAuthentication } from 'hooks/useAuthentication'

// images and icons
import SearchWhiteIcon from 'assets/icons/search-white.svg?component'
import MenuWhiteIcon from 'assets/icons/hamburger-white.svg?component'
import DarkLightModeIcon from 'assets/icons/dark-light-mode-mobile.svg?component'
import LightDarkModeIcon from 'assets/icons/light-dark-mode-mobile.svg?component'
import ShoppingCartIcon from 'assets/icons/shoppingcart-icon-navbar.svg?component'
import FosterLogo from 'assets/logo-new.svg?component'
import FosterLogoMobile from 'assets/logo-new-mobile.svg?component'

// json
import ExploreMenuList from 'assets/json/explore-menu.json'
import ProfileMenuList from 'assets/json/profile-menu.json'
import { setColorTheme } from 'utils/helpers'

// styles
import styles from './index.module.scss'

// call apis
import userAPI from 'apis/user'
import { getShortAddress } from 'utils/wallet.util'
import NotificationMenu from 'components/Menu/NotificationMenu'
import ShoppingCartMenu from 'components/Menu/ShoppingCartMenu'
import CreateMenu from 'components/Menu/CreateMenu'

const PrimaryHeader = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { setVisible } = useWalletModal()
  const cartUpdated = useSelector(state => (state as any).cartUpdated)

  const { connected } = useWallet()
  const { profileInfo } = useAuthentication()
  const [isNewNotification, setIsNewNotification] = useState(false)
  const [isScrollTop, setIsScrollTop] = useState(true)
  const [lightMode, setLightMode] = useState(useSelector(state => (state as any).lightMode))
  const [cartCount, setCartCount] = useState(0)

  const openShoppingCart = useSelector(state => (state as any).openShoppingCart)
  const openMobileSearchBox = useSelector(state => (state as any).openMobileSearchBox)
  const openMobileMenu = useSelector(state => (state as any).openMobileMenu)
  const markAsRead = useSelector(state => (state as any).markAsRead)

  const [lastScrollPosition, setLastScrollPosition] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      const position = window.pageYOffset

      if (position > 50) setIsScrollTop(false)
      else setIsScrollTop(true)

      if (position < 250) {
        setLastScrollPosition(position)
      } else if (position > lastScrollPosition) {
        setLastScrollPosition(position)
      } else if (position < lastScrollPosition) {
        setLastScrollPosition(position)
      }
    }, 50)

    return () => clearInterval(intervalId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (connected) {
      if (router.asPath !== '/notifications') {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (connected) {
      setTimeout(() => {
        let count = 0
        let cartV1 = JSON.parse(localStorage.getItem('cart_v1'))
        if (cartV1) {
          count += cartV1.length
        }

        let cartV2 = JSON.parse(localStorage.getItem('cart_v2'))
        if (cartV2) {
          count += cartV2.length
        }
        setCartCount(count)

        if (cartUpdated) {
          dispatch({ type: 'set', cartUpdated: false })
        }
      }, 1000)
    }
  }, [connected, cartUpdated])

  // update profile menu list
  const [profileMenuList, setProfileMenuList] = useState(ProfileMenuList)
  useEffect(() => {
    if (profileInfo !== null) {
      let array = [...profileMenuList]
      array.forEach(item => {
        if (item.label === 'Profile' && item.path === '/') {
          item.path += profileInfo.username.replaceAll(' ', '%20')
        } else if (item.label === 'My Store' && item.path === '/') {
          item.path += profileInfo.username.replaceAll(' ', '%20') + '/merch'
        }
      })
      setProfileMenuList(array)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileInfo])

  useEffect(() => {
    if (markAsRead) {
      setIsNewNotification(false)
      dispatch({ type: 'set', markAsRead: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (changeTo) {
      localStorage.setItem('lightDarkMode', 'true')
    } else {
      localStorage.setItem('lightDarkMode', 'false')
    }

    setLightMode(changeTo)
  }

  const handleOpenShoppingCart = () => {
    if (connected) {
      dispatch({ type: 'set', openMobileMenu: false })
      dispatch({ type: 'set', openShoppingCart: !openShoppingCart })
    } else {
      setVisible(true)
    }
  }

  const handleOpenMobileSearchBox = () => {
    dispatch({ type: 'set', openShoppingCart: false })

    dispatch({ type: 'set', openMobileSearchBox: !openMobileSearchBox })
  }

  const handleOpenMobileMenu = () => {
    dispatch({ type: 'set', openShoppingCart: false })

    dispatch({ type: 'set', openMobileMenu: !openMobileMenu })
  }

  const handleGotoHomepage = () => {
    dispatch({ type: 'set', openShoppingCart: false })

    dispatch({ type: 'set', openMobileSearchBox: false })
    dispatch({ type: 'set', openMobileMenu: false })
    router.push('/')
  }

  return (
    <div className="fixed top-0 left-0 z-50 w-full">
      <div className={`${styles.blurContainer} justify-center transition-all lg:flex hidden`}>
        <nav className="w-full max-w-[1920px] relative">
          <div className="w-full h-full flex justify-between g-container">
            <div className={`flex lg:gap-[15px] xl:gap-[20px] 2xl:gap-[40px] my-auto items-center z-[10001]`}>
              <div
                className="flex gap-[6px] cursor-pointer items-center mr-[15px]"
                onClick={() => handleGotoHomepage()}
              >
                <FosterLogo className={styles.logoIcon} />
                <div className={styles.logoFont}>foster</div>
              </div>

              <div>
                <CreateMenu />
              </div>

              <div>
                <ExploreMenu
                  label="Explore"
                  activeList={ExploreMenuList.activeList}
                  filterList={ExploreMenuList.filterList}
                  categoryList={ExploreMenuList.categoryList}
                  performerList={ExploreMenuList.performerList}
                />
              </div>
            </div>
            <div className="w-full flex items-center mt-[4px] lg:ml-[5px] xl:ml-[10px] 2xl:ml-[20px] mr-[30px] xl:mr-[40px] 2xl:mr-[40px]">
              <SearchBox placeholder="Search" />
            </div>
            <div className="flex items-center my-auto min-w-max z-[10001]">
              <div className="flex">
                {connected && (
                  <>
                    <div className="flex flex-row">
                      <div>
                        <WalletButton />
                      </div>
                      <div>
                        <ShoppingCartMenu />
                      </div>
                      <div>
                        <NotificationMenu />
                      </div>
                    </div>
                  </>
                )}

                {connected && cartCount > 0 && (
                  <div className="absolute ml-[105px] mt-[-8px]">
                    <div className={styles.cartCount}>
                      <div className="mt-[-2px]">{cartCount}</div>
                    </div>
                  </div>
                )}

                {connected && isNewNotification && (
                  <div className="absolute ml-[175px] mt-[-10px]">
                    <Lottie animationData={NotifyAlarmIcon} loop={true} />
                  </div>
                )}

                {connected && (
                  <button className="mr-[30px]" onClick={() => handleThemeMode()}>
                    {lightMode ? <LightDarkModeIcon /> : <DarkLightModeIcon />}
                  </button>
                )}
              </div>

              <div className="min-w-fit">
                <ProfileMenu
                  avatar={profileInfo?.profile_picture}
                  wallet={getShortAddress(profileInfo?.wallet_id)}
                  username={profileInfo?.username ?? ''}
                  menuList={profileMenuList}
                  onSelect={item => router.push(item.path)}
                  connectWalletStatus={connected}
                  lightMode={lightMode}
                  handleThemeMode={handleThemeMode}
                />
              </div>

              {!connected && (
                <button className="ml-[30px]" onClick={() => handleThemeMode()}>
                  {lightMode ? <LightDarkModeIcon /> : <DarkLightModeIcon />}
                </button>
              )}
            </div>
          </div>
        </nav>
      </div>

      <div
        className={`${
          isScrollTop && router.pathname === '/' ? styles.mobileNonBlurContainer : styles.mobileBlurContainer
        } top-0 transition-all block lg:hidden`}
      >
        <div className={styles.mobileContainer}>
          <div className="g-container flex justify-between items-center relative">
            <div className="absolute inset-0 w-full flex justify-center items-center z-[10]">
              <div className="flex gap-[6px] cursor-pointer items-center" onClick={() => handleGotoHomepage()}>
                <FosterLogoMobile />
              </div>
            </div>

            <div className="flex items-center z-[1000] relative">
              <div className="w-[39px] h-[39px] flex justify-center items-center">
                <ShoppingCartIcon onClick={() => handleOpenShoppingCart()} />
              </div>
              {cartCount > 0 && (
                <div className="absolute left-[20px] top-[0px]">
                  <div className={styles.cartCount}>
                    <div className="mt-[-2px]">{cartCount}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex z-[1000]">
              <div className="w-[39px] h-[39px] flex justify-center items-center">
                <SearchWhiteIcon onClick={() => handleOpenMobileSearchBox()} />
              </div>

              <div className="w-[39px] h-[39px] flex justify-center items-center">
                <MenuWhiteIcon onClick={() => handleOpenMobileMenu()} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrimaryHeader
