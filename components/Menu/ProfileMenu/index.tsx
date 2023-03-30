import React, { Fragment, useState, useEffect } from 'react'

import { useWallet } from '@solana/wallet-adapter-react'

// next components
import Image from 'next/image'

// third party components
import { Menu, Transition } from '@headlessui/react'

// styles
import styles from './index.module.scss'

import ProfileMenuItem from '../ProfileMenuItem'
import Alert from 'components/Alert'

const ProfileMenu = props => {
  const { avatar, menuList, onSelect, connectWalletStatus } = props
  const [showAlert, setShowAlert] = useState(false)
  const [alertData, setAlertData] = useState<any[]>([])
  const { connected } = useWallet()
  const [buttonClicked, setButtonClicked] = useState(false)

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

  return (
    <div className="relative flex items-center">
      <Menu>
        <Menu.Button>
          <div className={connectWalletStatus ? styles.activeContainer : styles.container}>
            {connectWalletStatus ? (
              <Image src={avatar} alt="" width={42} height={42} layout="responsive" objectFit="cover" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="19.902" height="20.012" viewBox="0 0 19.902 20.012">
                <path
                  id="user-19"
                  d="M15.71,12.71a6,6,0,1,0-7.42,0,10,10,0,0,0-6.22,8.18,1.006,1.006,0,1,0,2,.22,8,8,0,0,1,15.9,0,1,1,0,0,0,1,.89h.11a1,1,0,0,0,.88-1.1,10,10,0,0,0-6.25-8.19ZM12,12a4,4,0,1,1,4-4A4,4,0,0,1,12,12Z"
                  transform="translate(-2.064 -1.995)"
                  fill="var(--profile-user-color)"
                />
              </svg>
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
