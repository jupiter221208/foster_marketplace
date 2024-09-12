import React from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// third party components
import { useDispatch } from 'react-redux'
import { Disclosure } from '@headlessui/react'

import NotificationIcon from 'assets/icons/notification-icon-menu.svg?component'
import MerchHubIcon from 'assets/icons/merch-icon.svg?component'
import DashboardIcon from 'assets/icons/dashboard-icon.svg?component'
import SettingIcon from 'assets/icons/setting-icon-17x17.svg?component'
import LogoutIcon from 'assets/icons/logout-icon.svg?component'
import ShoppingCartIcon from 'assets/icons/shoppingcart-icon-navbar.svg?component'

import AvatarImage from 'assets/images/dashboard-avatar.png'
import ArrowRightWhiteIcon from 'assets/icons/arrow-right-white-medium.svg?component'
import ArrowDownWhiteIcon from 'assets/icons/arrow-down-white.svg?component'

// styles
import styles from './index.module.scss'
import ImageWithFoster from 'components/ImageWithFoster'

const AccordionNewProfileMenu = props => {
  const { icon, label, type = '', data, path = '', lightMode, logout, handleThemeMode } = props

  const router = useRouter()
  const dispatch = useDispatch()

  const handleClick = item => {
    if (item.type === 'logout') {
      logout()
    } else {
      dispatch({ type: 'set', openMobileMenu: false })
    }

    if (item.type === 'order') dispatch({ type: 'set', activeTab: 0 })

    router.push(item.path)
  }

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className={`${styles.container} ${open ? '' : styles.bottomBorder}`} onClick={() => {}}>
            <div className="flex items-center">
              <div className={styles.label}>Account</div>
            </div>
            {data.length > 0 && (open ? <ArrowDownWhiteIcon /> : <ArrowRightWhiteIcon />)}
          </Disclosure.Button>

          {data.length !== 0 && (
            <Disclosure.Panel className={`w-full mt-[-6px] pb-2 text-sm text-gray-500 ${styles.bottomBorder}`}>
              {data.map((item, index) => (
                <div key={index} className={styles.menuItem}>
                  <div className="flex gap-[12px] items-center" onClick={() => handleClick(item)}>
                    <div className="w-[24px] h-[36px] flex justify-start items-center">
                      {type === 'avatar' && item.id === 0 ? (
                        <div className="w-[21px] h-[21px] flex justify-center items-center">
                          <div className={styles.imageArea}>
                            {icon ? (
                              <ImageWithFoster
                                src={icon}
                                showPlaceHolder={false}
                                alt=""
                                width={100}
                                className="w-[21px] h-[21px] rounded-full"
                              />
                            ) : (
                              <Image src={AvatarImage} alt="" width={21} height={21} className="rounded-full" />
                            )}
                          </div>
                        </div>
                      ) : item.type === 'order' ? (
                        <div className="">
                          <ShoppingCartIcon className={styles.profileIconFill} />
                        </div>
                      ) : item.type === 'store' ? (
                        <div className="">
                          <MerchHubIcon className={styles.profileIconFill} />
                        </div>
                      ) : item.type === 'dashboard' ? (
                        <div className="py-2">
                          <DashboardIcon className={styles.iconFill} />
                        </div>
                      ) : item.type === 'notifications' ? (
                        <div className="py-2">
                          <NotificationIcon className={styles.iconFill} />
                        </div>
                      ) : item.type === 'settings' ? (
                        <SettingIcon />
                      ) : item.type === 'logout' ? (
                        <LogoutIcon className={styles.iconFill} />
                      ) : (
                        <div className="w-10 h-10">
                          <Image src={item.icon} alt="" width={40} height={40} />
                        </div>
                      )}
                    </div>
                    <div>{item.label}</div>
                  </div>
                </div>
              ))}
            </Disclosure.Panel>
          )}
        </>
      )}
    </Disclosure>
  )
}

export default AccordionNewProfileMenu
