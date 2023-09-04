import React, { Fragment, useState, useEffect } from 'react'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

// next components
import Image from 'next/image'

// third party components
import { Menu, Transition } from '@headlessui/react'

// styles
import styles from './index.module.scss'

// resources
import DarkLightModeMobileIcon from 'assets/icons/dark-light-mode-mobile.svg?component'
import LightDarkModeMobileIcon from 'assets/icons/light-dark-mode-mobile.svg?component'

import ProfileMenuItem from '../ProfileMenuItem'
import Alert from 'components/Alert'
import { setColorTheme } from 'utils/helpers'
import { useDispatch, useSelector } from 'react-redux'

const ProfileMenu = props => {
  const { avatar, wallet, username, menuList, onSelect, connectWalletStatus } = props
  const dispatch = useDispatch()
  const [lightMode, setLightMode] = useState(useSelector(state => (state as any).lightMode))
  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const { connected } = useWallet()
  const { setVisible } = useWalletModal()
  const [buttonClicked, setButtonClicked] = useState(false)
  const loginSignedFlag = useSelector(state => (state as any).loginSignedFlag)

  const handleThemeMode = () => {
    setColorTheme(!lightMode)
    dispatch({ type: 'set', lightMode: !lightMode })
    setLightMode(!lightMode)
  }

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
        setAlertData([
          {
            id: 0,
            title: 'Wallet Connected!',
            description: `You've successfully connected your wallet!`,
            type: 'success',
          },
        ])
        dispatch({ type: 'set', showConnectAlert: true })
        setTimeout(() => {
          setShowAlert(true)
        }, 1000)
      }
    }
  }, [loginSignedFlag])

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
                      dispatch({ type: 'set', loginSignedFlag: false })
                      setVisible(true)
                    }}
                  >
                    Sign In
                  </div>
                </div>
                <div className={connectWalletStatus ? styles.activeAvatar : styles.avatar}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="19.902" height="20.012" viewBox="0 0 19.902 20.012">
                    <path
                      id="user-19"
                      d="M15.71,12.71a6,6,0,1,0-7.42,0,10,10,0,0,0-6.22,8.18,1.006,1.006,0,1,0,2,.22,8,8,0,0,1,15.9,0,1,1,0,0,0,1,.89h.11a1,1,0,0,0,.88-1.1,10,10,0,0,0-6.25-8.19ZM12,12a4,4,0,1,1,4-4A4,4,0,0,1,12,12Z"
                      transform="translate(-2.064 -1.995)"
                      fill="var(--profile-user-color)"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              <div className={connectWalletStatus ? styles.activeAvatar : styles.avatar}>
                <Image src={avatar} alt="" width={42} height={42} layout="responsive" objectFit="cover" />
              </div>
            )}
            {connectWalletStatus && (
              <div className="flex gap-[8px] items-center">
                <div>
                  <div className={styles.username}>@{username.replaceAll(' ', '').toLowerCase()}</div>
                  <div className={styles.wallet}>{wallet}</div>
                </div>
                <div className="w-3 h-3 flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10.542" height="6.247" viewBox="0 0 10.542 6.247">
                    <path
                      id="angle-down-9"
                      d="M17,9.17a1,1,0,0,0-1.41,0L12,12.71,8.46,9.17a1,1,0,1,0-1.41,1.42l4.24,4.24a1,1,0,0,0,1.42,0L17,10.59a1,1,0,0,0,0-1.42Z"
                      transform="translate(-6.754 -8.879)"
                      fill="var(--chevron-up-icon-color)"
                    />
                  </svg>
                </div>
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
                  item={item}
                  key={index}
                  onSelect={item => {
                    if (item.id === 7) setButtonClicked(true)
                    onSelect(item)
                  }}
                />
              ))}
              <div
                className="w-full mt-[20px] mb-[10px] flex justify-center cursor-pointer"
                onClick={() => handleThemeMode()}
              >
                {lightMode ? <LightDarkModeMobileIcon /> : <DarkLightModeMobileIcon />}
              </div>
            </div>
          </Transition>
        )}
        <Alert
          open={showAlert}
          close={() => {
            setShowAlert(false)
          }}
          data={alertData}
        />
      </Menu>
    </div>
  )
}
export default ProfileMenu
