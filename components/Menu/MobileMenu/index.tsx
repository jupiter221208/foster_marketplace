import React, { useEffect, useState } from 'react'

// next components
import Image from 'next/image'

// third party components
import { useWallet } from '@solana/wallet-adapter-react'
import { useDispatch, useSelector } from 'react-redux'

// custom components
import Alert from 'components/Alert'
import AccordionMenu from 'components/Menu/AccordionMenu'
import WalletButton from 'components/Button/WalletButton'
import MyWalletSubMenu from 'components/Menu/MyWalletSubMenu'

// images and icons
import AvatarIcon from 'assets/icons/profile-thumb.svg'
import ExploreWhiteIcon from 'assets/icons/explore-white.svg'
import PlusWhiteIcon from 'assets/icons/plus-white.svg'
import WalletWhiteIcon from 'assets/icons/wallet-white.svg'
import NotificationWhiteIcon from 'assets/icons/quick-buy-white.svg'
import DaoWhiteIcon from 'assets/icons/dao-white.svg'
import CollectionWhiteIcon from 'assets/icons/collection-white.svg'
import StatisticWhiteIcon from 'assets/icons/statistic-white.svg'
import ResourceWhiteIcon from 'assets/icons/resource-white.svg'
import LogoutWhiteIcon from 'assets/icons/logout-white.svg'

// json data
import ProfileMenuList from 'assets/json/profile-menu.json'
import ExploreMenuList from 'assets/json/explore-menu.json'
import CreateMenuList from 'assets/json/create-menu.json'

// styles
import styles from './index.module.scss'

// call api
import authAPI from 'apis/auth'

const MobileMenu = () => {
  const dispatch = useDispatch()
  const { connected, publicKey, disconnect } = useWallet()

  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const [buttonClicked, setButtonClicked] = useState(false)

  const profileInfo = useSelector(state => (state as any).profileInfo)
  const [profileImage, setProfileImage] = useState('')
  const [profileName, setProfileName] = useState('')

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
      },
      error => {
        console.log(error)
      }
    )
  }

  return (
    <div className={styles.menu}>
      {connected ? (
        <div className={styles.container}>
          <div className="w-full">
            <div className="my-[10px]">
              <AccordionMenu
                icon={profileImage.length > 0 ? profileImage : AvatarIcon}
                label={profileName.length > 0 ? profileName : 'Anonymous'}
                type="avatar"
                data={ProfileMenuList}
              />
            </div>
            <div className="my-[10px]">
              <AccordionMenu icon={ExploreWhiteIcon} label="Explore" type="" data={ExploreMenuList} />
            </div>
            <div className="my-[10px]">
              <AccordionMenu icon={PlusWhiteIcon} label="Create" type="" data={CreateMenuList} />
            </div>
            <div className="my-[10px]">
              <MyWalletSubMenu icon={WalletWhiteIcon} label="My Wallet" type="" data={CreateMenuList} />
            </div>
            <div className="my-[10px]">
              <AccordionMenu icon={CollectionWhiteIcon} label="Dashboard" type="" data={[]} path="/dashboard" />
            </div>
            <div className="my-[10px]">
              <AccordionMenu
                icon={NotificationWhiteIcon}
                label="Notifications"
                type=""
                data={[]}
                path="/notifications"
              />
            </div>

            <div className="my-[10px]">
              <AccordionMenu icon={StatisticWhiteIcon} label="Stats" type="" data={[]} path="/stats" />
            </div>
            <div className="my-[10px]">
              <AccordionMenu icon={DaoWhiteIcon} label="DAO" type="" data={[]} path="/dao" />
            </div>
            <div className="my-[10px]">
              <AccordionMenu icon={ResourceWhiteIcon} label="Resources" type="" data={[]} path="/resources" />
            </div>
          </div>
          <div className="w-full">
            <div
              className={styles.logout}
              onClick={() => {
                setButtonClicked(true)
                disconnect()
              }}
            >
              <div>Logout part</div>
              <div className="flex items-center ml-2">
                <Image src={LogoutWhiteIcon} alt="" />
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
          </div>
          <div className="w-full flex items-end">
            <WalletButton fullWidth />
          </div>
          {/* disconnect wallet alert */}
          <Alert
            open={showAlert}
            close={() => {
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
