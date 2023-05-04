import React, { useEffect, useState } from 'react'

// next components
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
import EllipseGreen from 'assets/icons/ellipse-green.svg?component'
import AvatarIcon from 'assets/images/dashboard-avatar.png'
import DarkLightModeIcon from 'assets/icons/dark-light-mode-small.svg?component'
import LightDarkModeIcon from 'assets/icons/light-dark-mode-small.svg?component'

// json data
import ProfileMenuList from 'assets/json/profile-menu-mobile.json'
import ExploreMenuList from 'assets/json/explore-menu.json'
import CreateMenuList from 'assets/json/create-menu.json'

// styles
import styles from './index.module.scss'

// call apis
import authAPI from 'apis/auth'
import { useViewport } from 'utils'
import { setColorTheme } from 'utils/helpers'

const MobileMenu = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const viewport = useViewport()
  const { connected, publicKey, disconnect, signMessage } = useWallet()
  const [lightMode, setLightMode] = useState(useSelector(state => (state as any).lightMode))

  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const [buttonClicked, setButtonClicked] = useState(false)

  const profileInfo = useSelector(state => (state as any).profileInfo)
  const [profileImage, setProfileImage] = useState('')
  const [profileName, setProfileName] = useState('')

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
  const handleLogin = async () => {
    let signature = await signMessage(Buffer.from('Foster Protocol'))
    let { new_user, user, bid_wallet_lock, offer_wallet_lock } = await authAPI.login({
      wallet_id: publicKey?.toBase58() || '',
        signature: Buffer.from(signature).toString('base64'),
    })
    if (new_user === true) {
      dispatch({ type: 'set', profileSetup: true })
    }
    dispatch({ type: 'set', profileInfo: user })
    setProfileImage(user.profile_picture)
    setProfileName(user.username)
    dispatch({ type: 'set', bidWalletLock: bid_wallet_lock })
    dispatch({ type: 'set', offerWalletLock: offer_wallet_lock })
  }

  const handleThemeMode = () => {
    setColorTheme(!lightMode)
    dispatch({ type: 'set', lightMode: !lightMode })
    setLightMode(!lightMode)
  }

  return (
    <div className={styles.menu}>
      <div className={styles.bgImage}>
        {(viewport === 'lg' || viewport === 'xl' || viewport === '2xl') && <EllipseGreen />}
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
            <AccordionMenu label="Explore" type="explore" data={ExploreMenuList} />
            <AccordionMenu label="Create" type="create" data={CreateMenuList} />
            <MyWalletSubMenu label="My Wallet" type="" />
            <AccordionMenu label="Dashboard" type="dashboard" data={[]} path="/dashboard" />
            <AccordionMenu label="Stats" type="stats" data={[]} path="/stats" />
            <AccordionMenu label="DAO" type="dao" data={[]} path="/dao" />
            <AccordionMenu label="Resources" type="resources" data={[]} path="/resources" />
            <AccordionMenu label="Notifications" type="notifications" data={[]} path="/notifications" />
            <div className="w-full flex justify-end mt-[10px]" onClick={() => handleThemeMode()}>
              {lightMode ? <LightDarkModeIcon /> : <DarkLightModeIcon />}
            </div>
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
            <AccordionMenu label="Explore" type="explore" data={ExploreMenuList} />
            <AccordionMenu label="Create" type="create" data={CreateMenuList} />
            <AccordionMenu label="Stats" type="stats" data={[]} path="/stats" />
            <AccordionMenu label="DAO" type="dao" data={[]} path="/dao" />
            <AccordionMenu label="Resources" type="resources" data={[]} path="/resources" />
            <div className="w-full flex justify-end mt-[10px]" onClick={() => handleThemeMode()}>
              {lightMode ? <LightDarkModeIcon /> : <DarkLightModeIcon />}
            </div>
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
