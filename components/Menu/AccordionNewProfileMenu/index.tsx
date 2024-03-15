import React from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// third party components
import { useDispatch } from 'react-redux'
import DashboardIcon from 'assets/icons/dashboard-icon-menu.svg?component'
import NotificationIcon from 'assets/icons/notification-icon-menu.svg?component'
import LogoutIcon from 'assets/icons/logout-mobile-icon.svg?component'
import SettingsIcon from 'assets/icons/setting-icon.svg?component'
import OrderIcon from 'assets/icons/order-icon.svg?component'
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
      dispatch({ type: 'set', isLoading: true })
    }

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
                        <ImageWithFoster
                          src={icon}
                          showPlaceHolder={false}
                          alt=""
                          width={100}
                          className="w-[22px] h-[22px] rounded-full"
                        />
                      </div>
                    </div>
                  ) : item.type === 'order' ? (
                    <div className="px-[1px]">
                      <OrderIcon />
                    </div>
                  ) : item.type === 'dashboard' ? (
                    <div className="px-[10px] py-2">
                      <DashboardIcon />
                    </div>
                  ) : item.type === 'notifications' ? (
                    <div className="px-[10px] py-2">
                      <NotificationIcon />
                    </div>
                  ) : item.type === 'settings' ? (
                    <SettingsIcon />
                  ) : item.type === 'logout' ? (
                    <LogoutIcon />
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
