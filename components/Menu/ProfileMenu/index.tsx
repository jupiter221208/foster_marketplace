import React, { Fragment, useEffect, useRef, useState } from 'react'
// next components
import Image from 'next/image'
// third party components
import { Menu, Transition } from '@headlessui/react'
// images and icons
import UserAccountWhiteIcon from 'assets/icons/user-account-white.svg'
// styles
import styles from './index.module.scss'

const ProfileMenu = props => {
  const { avatar, menuList, onSelect, connectWalletStatus } = props
  const [open, setOpen] = useState<boolean>(false)

  const closeRef = useRef<any>()

  const useOnClickOutside = (ref, handler) => {
    useEffect(() => {
      const listener = event => {
        if (!ref.current || ref.current.contains(event.target)) {
          return
        }
        handler(!open)
      }
      document.addEventListener('mousedown', listener)
      document.addEventListener('touchstart', listener)
      return () => {
        document.removeEventListener('mousedown', listener)
        document.removeEventListener('touchstart', listener)
      }
    }, [ref, handler])
  }

  useOnClickOutside(closeRef, () => handleSetOpen(closeRef))

  const handleSetOpen = bool => {
    setOpen(bool)
  }

  return (
    <div className="relative">
      <Menu>
        <Menu.Button>
          <div
            className={connectWalletStatus ? styles.activeContainer : styles.container}
            onClick={() => setOpen(!open)}
          >
            {connectWalletStatus ? (
              <Image src={avatar} alt="" width={42} height={42} layout="responsive" objectFit="cover" />
            ) : (
              <Image src={UserAccountWhiteIcon} alt="" />
            )}
          </div>
        </Menu.Button>

        {connectWalletStatus && open && (
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <div className={styles.menuArea} ref={closeRef}>
              {menuList.map((item, index) => (
                <div
                  key={index}
                  className={styles.menuItem}
                  onClick={() => {
                    setOpen(!open)
                    onSelect(item)
                  }}
                >
                  {item.id === 0 ? (
                    <div className="w-10 h-10 flex justify-center items-center">
                      <div className={styles.imageArea}>
                        <Image src={avatar} alt="" width={24} height={24} className="rounded-full" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-10 h-10">
                      <Image src={item.icon} alt="" width={40} height={40} />
                    </div>
                  )}
                  {item.label}
                </div>
              ))}
            </div>
          </Transition>
        )}
      </Menu>
    </div>
  )
}
export default ProfileMenu
