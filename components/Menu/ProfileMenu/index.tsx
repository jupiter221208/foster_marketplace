import React, { Fragment, useState, useEffect } from 'react'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

// next components
import Image from 'next/image'
import ReactPlaceholder from 'react-placeholder/lib'
import 'react-placeholder/lib/reactPlaceholder.css'

// third party components
import { Menu, Transition } from '@headlessui/react'

// styles
import styles from './index.module.scss'

// resources
import SunIcon from 'assets/icons/sun-icon-dark.svg?component'
import MoonIcon from 'assets/icons/moon-icon-dark.svg?component'
import AvatarImage from 'assets/images/dashboard-avatar.png'

import ProfileMenuItem from '../ProfileMenuItem'
import Alert from 'components/Alert'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'

const ProfileMenu = props => {
  const { avatar, wallet, username, menuList, onSelect, connectWalletStatus, lightMode, handleThemeMode } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()
  const [buttonClicked, setButtonClicked] = useState(false)
  const loginSignedFlag = useSelector(state => (state as any).loginSignedFlag)
  const [loaded, setLoaded] = useState(false)
  const [shortProfileMenuBtn, setShortProfileMenuBtn] = useState(false)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setShortProfileMenuBtn(innerWidth > 1200)
    }, 500)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (!buttonClicked) {
      return
    }

    setButtonClicked(false)

    if (!connected) {
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
    if (loginSignedFlag === true) {
      if (connected) {
        dispatch({ type: 'set', loginSignedFlag: false })
        setAlertData([
          {
            id: 0,
            title: 'Wallet Connected!',
            description: `You've successfully connected your wallet!`,
            type: 'success',
          },
        ])
        setTimeout(() => {
          setShowAlert(true)
        }, 1000)
      }
    }
  }, [loginSignedFlag, connected])

  return (
    <div className="relative flex items-center">
      <Menu>
        <Menu.Button>
          <div className={styles.container}>
            {!connectWalletStatus ? (
              <div className="w-full flex gap-[20px]">
                <div className="flex items-center mb-[3px]">
                  <div
                    className={styles.signIn}
                    onClick={() => {
                      setButtonClicked(true)
                      setVisible(true)
                    }}
                  >
                    Sign In
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {avatar === null || avatar === undefined ? (
                  <div className="w-full h-full">
                    <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
                      <div></div>
                    </ReactPlaceholder>
                  </div>
                ) : avatar?.length > 0 ? (
                  <div>
                    <img className={styles.profileOutline} src={avatar} alt="" width={42} height={42} />
                  </div>
                ) : (
                  <div className={styles.profileOutline}>
                    <Image src={AvatarImage} alt="" width={42} height={42} layout="responsive" objectFit="cover" />
                  </div>
                )}
              </div>
            )}
          </div>
        </Menu.Button>

        {connectWalletStatus && (
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <div className={styles.menuArea}>
              {menuList.map((item, index) => (
                <ProfileMenuItem
                  avatar={avatar}
                  username={username}
                  item={item}
                  key={index}
                  onSelect={item => {
                    if (item.id === 7) {
                      setButtonClicked(true)
                    } else {
                      onSelect(item)
                    }
                  }}
                />
              ))}

              <div className="w-full flex min-h-[40px] items-center">
                <div className={`${styles.themeContainer} ${lightMode ? 'bg-[#20242725]' : 'bg-[#eff0f616]'}`}>
                  <button
                    onClick={() => handleThemeMode(true)}
                    className={`w-full flex items-center h-full space-x-[6px] rounded py-2 px-[18px] text-sm font-medium ${
                      lightMode ? 'text-[#1A1A1A] bg-[#F3F2F0]' : 'text-[#eff0f6b6]'
                    }`}
                  >
                    <SunIcon className={lightMode ? 'fill-[#1A1A1A]' : 'fill-[#EFF0F6]'} />
                    <span className="ml-4">Light Mode</span>
                  </button>

                  <button
                    onClick={() => handleThemeMode(false)}
                    className={`w-full flex items-center h-full space-x-[6px] rounded py-2 px-[18px] text-sm font-medium ${
                      !lightMode ? 'text-[#EFF0F6] bg-[#242424]' : 'text-[#1a1a1ab4]'
                    }`}
                  >
                    <MoonIcon className={lightMode ? 'fill-[#202427]' : 'fill-[#95DBD5]'} />
                    <span className="ml-4">Dark Mode</span>
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        )}
        <Alert
          open={showAlert}
          close={() => {
            setShowAlert(false)
            if (!connected) {
              router.push('/')
            }
          }}
          data={alertData}
        />
      </Menu>
    </div>
  )
}
export default ProfileMenu
