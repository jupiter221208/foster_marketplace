import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// third party components
import { useWallet } from '@solana/wallet-adapter-react'
import { useDispatch, useSelector } from 'react-redux'

// custom components
import Alert from 'components/Alert'
import AccordionMenu from 'components/Menu/AccordionMenu'
import WalletButton from 'components/Button/WalletButton'
import MyWalletSubMenu from 'components/Menu/MyWalletSubMenu'

// images and icons
import EllipseGreenKingsizeIcon from 'assets/icons/ellipse-green-kingsize.svg'
import EllipseLightIcon from 'assets/icons/ellipse-light-kingsize.svg'

import AvatarIcon from 'assets/images/dashboard-avatar.png'
import ExploreWhiteIcon from 'assets/icons/explore-green.svg'
import ExploreGrayIcon from 'assets/icons/explore-gray.svg'
import PlusWhiteIcon from 'assets/icons/plus-green.svg'
import PlusGrayIcon from 'assets/icons/plus-gray.svg'
import WalletWhiteIcon from 'assets/icons/wallet-green.svg'
import WalletGrayIcon from 'assets/icons/wallet-gray.svg'
import NotificationWhiteIcon from 'assets/icons/quick-buy-green.svg'
import DaoWhiteIcon from 'assets/icons/dao-green-menu.svg'
import CollectionWhiteIcon from 'assets/icons/dashboard-green-menu.svg'
import StatisticWhiteIcon from 'assets/icons/statistic-green-menu.svg'
import ResourceWhiteIcon from 'assets/icons/resource-green-menu.svg'
import LogoutDarkRedIcon from 'assets/icons/logout-dark-red.svg'
import LogoutDarkIcon from 'assets/icons/logout-dark.svg'

// json data
import ProfileMenuList from 'assets/json/profile-menu-mobile.json'
import ExploreMenuList from 'assets/json/explore-menu.json'
import CreateMenuList from 'assets/json/create-menu.json'

// styles
import styles from './index.module.scss'

// call apis
import authAPI from 'apis/auth'

const MobileMenu = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { connected, publicKey, disconnect } = useWallet()

  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const [buttonClicked, setButtonClicked] = useState(false)

  const profileInfo = useSelector(state => (state as any).profileInfo)
  const [profileImage, setProfileImage] = useState('')
  const [profileName, setProfileName] = useState('')

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
    if (!buttonClicked) {
      return
    }

    setButtonClicked(true)

    if (connected) {
      setAlertData([
        {
          id: 0,
          title: 'Wallet Connected!',
          description: `You've successfully connected your wallet!`,
          type: 'success',
        },
      ])
      setShowAlert(true)
    } else {
      setAlertData([
        {
          id: 0,
          title: 'Wallet Disconnected!',
          description: `You've successfully disconnected your wallet!`,
          type: 'success',
        },
      ])
      setShowAlert(true)
    }
  }, [connected])

  useEffect(() => {
    if (profileInfo) {
      if (profileInfo.username) {
        setProfileName(profileInfo.username)
      }
      if (profileInfo.profile_picture) {
        setProfileImage(profileInfo.profile_picture)
      }
    }
  }, [profileInfo])

  // handle login
  const handleLogin = () => {
    authAPI.login({ wallet_id: publicKey?.toBase58() || '' }).then(
      response => {
        if (response.new_user === true) {
          dispatch({ type: 'set', profileSetup: true })
        }
        dispatch({ type: 'set', profileInfo: response.user })
        setProfileImage(response.user.profile_picture)
        setProfileName(response.user.username)
        dispatch({ type: 'set', bidWalletLock: response.bid_wallet_lock })
        dispatch({ type: 'set', offerWalletLock: response.offer_wallet_lock })
      },
      error => {
        console.log(error)
      }
    )
  }

  return (
    <div className={styles.menu}>
      <div className={styles.bgImage}>
        <svg xmlns="http://www.w3.org/2000/svg" width="549" height="1005" viewBox="0 0 2321 2321">
          <defs>
            <radialGradient id="radial-gradient" cx="0.5" cy="0.5" r="0.5" gradientUnits="objectBoundingBox">
              <stop offset="0" stopColor="var(--ellipse-svg-1)" stopOpacity="0.404" />
              <stop offset="1" stopColor="var(--ellipse-svg-2)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle
            id="Ellipse_4322"
            data-name="Ellipse 4322"
            cx="1010.5"
            cy="1010.5"
            r="1010.5"
            transform="translate(150 150)"
            fill="url(#radial-gradient)"
          />
        </svg>
      </div>
      {connected ? (
        <div className={styles.container}>
          <div className="w-full flex flex-wrap gap-[10px]">
            <AccordionMenu
              icon={profileImage.length > 0 ? profileImage : AvatarIcon}
              label={profileName.length > 0 ? profileName : 'Anonymous'}
              type="avatar"
              data={profileMenuList}
            />
            <AccordionMenu
              icon={ExploreWhiteIcon}
              openIcon={ExploreGrayIcon}
              label="Explore"
              type=""
              data={ExploreMenuList}
            />
            <AccordionMenu icon={PlusWhiteIcon} openIcon={PlusGrayIcon} label="Create" type="" data={CreateMenuList} />
            <MyWalletSubMenu
              icon={WalletWhiteIcon}
              openIcon={WalletGrayIcon}
              label="My Wallet"
              type=""
              data={CreateMenuList}
            />
            <AccordionMenu icon={CollectionWhiteIcon} label="Dashboard" type="" data={[]} path="/dashboard" />
            <AccordionMenu icon={StatisticWhiteIcon} label="Stats" type="" data={[]} path="/stats" />
            <AccordionMenu icon={DaoWhiteIcon} label="DAO" type="" data={[]} path="/dao" />
            <AccordionMenu icon={ResourceWhiteIcon} label="Resources" type="" data={[]} path="/resources" />
            <AccordionMenu icon={NotificationWhiteIcon} label="Notifications" type="" data={[]} path="/notifications" />
          </div>
          <div className="w-full mt-5">
            <div
              className={styles.logout}
              onClick={() => {
                setButtonClicked(true)
                if (localStorage.getItem('walletName') === '"Phantom"') {
                  localStorage.removeItem('walletName')
                  ;(window as any).solana.disconnect()
                } else disconnect()

                localStorage.removeItem('token')
                dispatch({ type: 'set', profileInfo: null })
              }}
            >
              <div>Logout</div>
              <div className="flex items-center ml-2">
                {/* <Image src={lightMode ? LogoutDarkIcon : LogoutDarkRedIcon} alt="" /> */}
                <svg xmlns="http://www.w3.org/2000/svg" width="18.057" height="18.063" viewBox="0 0 18.057 18.063">
                  <path
                    id="sign-out-alt"
                    d="M3.359,13.83a.9.9,0,0,1,1.21.406,7.225,7.225,0,1,0,0-6.412.909.909,0,1,1-1.626-.813,9.031,9.031,0,1,1,0,8.037.9.9,0,0,1,.415-1.219Zm-.452-3.7h8.661L9.491,8.06a.907.907,0,0,1,1.282-1.282l3.612,3.612a.934.934,0,0,1,0,1.282l-3.612,3.612A.907.907,0,1,1,9.491,14l2.077-2.068H2.908a.9.9,0,0,1,0-1.806Z"
                    transform="translate(-2.005 -1.999)"
                    fill="var(--logout-icon-color)"
                  />
                </svg>
              </div>
            </div>
          </div>
          {/* connect wallet alert */}
          <Alert
            open={showAlert}
            close={() => {
              setShowAlert(false)
              handleLogin()
            }}
            data={alertData}
          />
        </div>
      ) : (
        <div className={styles.container}>
          <div className="w-full flex flex-col flex-wrap items-start gap-[10px]">
            <AccordionMenu
              icon={ExploreWhiteIcon}
              openIcon={ExploreGrayIcon}
              label="Explore"
              type=""
              data={ExploreMenuList}
            />
            <AccordionMenu icon={PlusWhiteIcon} openIcon={PlusGrayIcon} label="Create" type="" data={CreateMenuList} />
            <AccordionMenu icon={StatisticWhiteIcon} label="Stats" type="" data={[]} path="/stats" />
            <AccordionMenu icon={DaoWhiteIcon} label="DAO" type="" data={[]} path="/dao" />
            <AccordionMenu icon={ResourceWhiteIcon} label="Resources" type="" data={[]} path="/resources" />
          </div>
          <div className="w-full flex items-end mt-5">
            <WalletButton fullWidth />
          </div>
          {/* disconnect wallet alert */}
          <Alert
            open={showAlert}
            close={() => {
              router.push('/')
              setShowAlert(false)
            }}
            data={alertData}
          />
        </div>
      )}
    </div>
  )
}

export default MobileMenu
