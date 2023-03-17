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
import AvatarIcon from 'assets/images/dashboard-avatar.png'
import ExploreWhiteIcon from 'assets/icons/explore-green.svg'
import PlusWhiteIcon from 'assets/icons/plus-green.svg'
import WalletWhiteIcon from 'assets/icons/wallet-green.svg'
import NotificationWhiteIcon from 'assets/icons/quick-buy-green.svg'
import DaoWhiteIcon from 'assets/icons/dao-green-menu.svg'
import CollectionWhiteIcon from 'assets/icons/dashboard-green-menu.svg'
import StatisticWhiteIcon from 'assets/icons/statistic-green-menu.svg'
import ResourceWhiteIcon from 'assets/icons/resource-green-menu.svg'
import LogoutDarkRedIcon from 'assets/icons/logout-dark-red.svg'

// json data
import ProfileMenuList from 'assets/json/profile-menu.json'
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
        <Image src={EllipseGreenKingsizeIcon} width={549} height={1005} alt="" />
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
            <AccordionMenu icon={ExploreWhiteIcon} label="Explore" type="" data={ExploreMenuList} />
            <AccordionMenu icon={PlusWhiteIcon} label="Create" type="" data={CreateMenuList} />
            <MyWalletSubMenu icon={WalletWhiteIcon} label="My Wallet" type="" data={CreateMenuList} />
            <AccordionMenu icon={CollectionWhiteIcon} label="Dashboard" type="" data={[]} path="/dashboard" />
            <AccordionMenu icon={NotificationWhiteIcon} label="Notifications" type="" data={[]} path="/notifications" />
            <AccordionMenu icon={StatisticWhiteIcon} label="Stats" type="" data={[]} path="/stats" />
            <AccordionMenu icon={DaoWhiteIcon} label="DAO" type="" data={[]} path="/dao" />
            <AccordionMenu icon={ResourceWhiteIcon} label="Resources" type="" data={[]} path="/resources" />
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
                <Image src={LogoutDarkRedIcon} alt="" />
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
            <AccordionMenu icon={ExploreWhiteIcon} label="Explore" type="" data={ExploreMenuList} />
            <AccordionMenu icon={PlusWhiteIcon} label="Create" type="" data={CreateMenuList} />
            {/* <AccordionMenu icon={StatisticWhiteIcon} label="Stats" type="" data={[]} path="/stats" /> */}
            {/* <AccordionMenu icon={DaoWhiteIcon} label="DAO" type="" data={[]} path="/dao" /> */}
            {/* <AccordionMenu icon={ResourceWhiteIcon} label="Resources" type="" data={[]} path="/resources" /> */}
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
