import React from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// third party components
import { useDispatch } from 'react-redux'

import NotificationIcon from 'assets/icons/notification-icon-menu.svg?component'
import MerchHubIcon from 'assets/icons/merch-icon.svg?component'
import MyProfileIcon from 'assets/icons/myprofile-icon.svg?component'
import DashboardIcon from 'assets/icons/dashboard-icon.svg?component'
import StatsIcon from 'assets/icons/statistic-icon.svg?component'
import SettingIcon from 'assets/icons/setting-icon.svg?component'
import LogoutIcon from 'assets/icons/logout-icon.svg?component'
import ShoppingCartIcon from 'assets/icons/shoppingcart-icon-navbar.svg?component'

import AvatarImage from 'assets/images/dashboard-avatar.png'
import DarkLightModeIcon from 'assets/icons/dark-light-mode-mobile.svg?component'
import LightDarkModeIcon from 'assets/icons/light-dark-mode-mobile.svg?component'

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
    <div className="w-full">
      {data.length !== 0 && (
        <div className="w-full pl-[7px] pt-1 pb-1 text-sm text-gray-500">
          {data.map((item, index) => (
            <div key={index} className={styles.menuItem}>
              <div className="flex gap-[12px] items-center" onClick={() => handleClick(item)}>
                <div className="w-10 h-10 flex justify-center items-center">
                  {type === 'avatar' && item.id === 0 ? (
                    <div className="w-10 h-10 flex justify-center items-center">
                      <div className={styles.imageArea}>
                        {icon ? (
                          <ImageWithFoster
                            src={icon}
                            showPlaceHolder={false}
                            alt=""
                            width={100}
                            className="w-[22px] h-[22px] rounded-full"
                          />
                        ) : (
                          <Image src={AvatarImage} alt="" width={22} height={22} className="rounded-full" />
                        )}
                      </div>
                    </div>
                  ) : item.type === 'order' ? (
                    <div className="px-[1px]">
                      <ShoppingCartIcon className={styles.profileIconFill} />
                    </div>
                  ) : item.type === 'store' ? (
                    <div className="px-[1px]">
                      <MerchHubIcon className={styles.profileIconFill} />
                    </div>
                  ) : item.type === 'dashboard' ? (
                    <div className="px-[10px] py-2">
                      <DashboardIcon className={styles.iconFill} />
                    </div>
                  ) : item.type === 'notifications' ? (
                    <div className="px-[10px] py-2">
                      <NotificationIcon className={styles.iconFill} />
                    </div>
                  ) : item.type === 'settings' ? (
                    <SettingIcon className={styles.iconFill} />
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
              {type === 'avatar' && item.id === 0 && (
                <button className="ml-7" onClick={() => handleThemeMode()}>
                  {lightMode ? <LightDarkModeIcon /> : <DarkLightModeIcon />}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AccordionNewProfileMenu
