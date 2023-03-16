import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useWallet } from '@solana/wallet-adapter-react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// images and icons
import LogoIcon from 'assets/icons/logo-light-green.svg'
import DashboardGreenIcon from 'assets/icons/dashboard-green.svg'
import DashboardGrayIcon from 'assets/icons/dashboard-gray.svg'
import NotificationGreenIcon from 'assets/icons/notification-green.svg'
import NotificationGrayIcon from 'assets/icons/notification-gray.svg'
import StatisticGreenIcon from 'assets/icons/statistic-green.svg'
import StatisticGrayIcon from 'assets/icons/statistic-gray.svg'
import ResourceGreenIcon from 'assets/icons/resource-green.svg'
import ResourceGrayIcon from 'assets/icons/resource-gray.svg'
import SettingGreenIcon from 'assets/icons/setting-green.svg'
import SettingGrayIcon from 'assets/icons/setting-gray.svg'
import DaoGreenIcon from 'assets/icons/dao-green.svg'
import DaoGrayIcon from 'assets/icons/dao-gray.svg'
import LogoTextIcon from 'assets/icons/logo-text-01.svg'
import LogoutIcon from 'assets/icons/logout.svg'

// styles
import styles from './index.module.scss'

const Navbar = props => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { disconnect } = useWallet()

  const [selectedNavMenu, setSelectedNavMenu] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [showLogo, setShowLogo] = useState(true)

  const showExpandMenu = () => {
    setShowMenu(true)
    setTimeout(() => {
      setShowLogo(true)
    }, 500)
  }

  const hideExpandMenu = () => {
    setShowMenu(false)
    setTimeout(() => {
      setShowLogo(false)
    }, 500)
  }

  return (
    <div
      className={`${styles.container} ${showMenu ? 'w-[277px]' : 'w-[84px]'} `}
      onMouseOver={() => showExpandMenu()}
      onMouseLeave={() => hideExpandMenu()}
    >
      <div className={styles.iconBar}>
        <div>
          <div className={styles.logoArea} onClick={() => setShowMenu(!showMenu)}>
            <Image src={LogoIcon} alt="" />
          </div>
          <div className={styles.navmenuArea}>
            <div
              className={styles.navItemArea}
              onMouseOver={() => setSelectedNavMenu('dashboard')}
              onMouseLeave={() => setSelectedNavMenu('')}
              onClick={() => router.push('/dashboard')}
            >
              <Image
                src={
                  router.asPath === '/dashboard' || selectedNavMenu === 'dashboard'
                    ? DashboardGreenIcon
                    : DashboardGrayIcon
                }
                alt=""
              />
            </div>
            <div
              className={styles.navItemArea}
              onMouseOver={() => setSelectedNavMenu('notifications')}
              onMouseLeave={() => setSelectedNavMenu('')}
              onClick={() => router.push('/notifications')}
            >
              <Image
                src={
                  router.asPath === '/notifications' || selectedNavMenu === 'notifications'
                    ? NotificationGreenIcon
                    : NotificationGrayIcon
                }
                alt=""
              />
            </div>
            <div
              className={styles.navItemArea}
              onMouseOver={() => setSelectedNavMenu('stats')}
              onMouseLeave={() => setSelectedNavMenu('')}
              onClick={() => router.push('/stats')}
            >
              <Image
                src={router.asPath === '/stats' || selectedNavMenu === 'stats' ? StatisticGreenIcon : StatisticGrayIcon}
                alt=""
              />
            </div>
            <div
              className={styles.navItemArea}
              onMouseOver={() => setSelectedNavMenu('dao')}
              onMouseLeave={() => setSelectedNavMenu('')}
              onClick={() => router.push('/dao')}
            >
              <Image src={router.asPath === '/dao' || selectedNavMenu === 'dao' ? DaoGreenIcon : DaoGrayIcon} alt="" />
            </div>
            <div
              className={styles.navItemArea}
              onMouseOver={() => setSelectedNavMenu('resources')}
              onMouseLeave={() => setSelectedNavMenu('')}
              onClick={() => router.push('/resources')}
            >
              <Image
                src={
                  router.asPath === '/resources' || selectedNavMenu === 'resources'
                    ? ResourceGreenIcon
                    : ResourceGrayIcon
                }
                alt=""
              />
            </div>
            <div
              className={styles.navItemArea}
              onMouseOver={() => setSelectedNavMenu('settings')}
              onMouseLeave={() => setSelectedNavMenu('')}
              onClick={() => router.push('/settings')}
            >
              <Image
                src={
                  router.asPath === '/settings' || selectedNavMenu === 'settings' ? SettingGreenIcon : SettingGrayIcon
                }
                alt=""
              />
            </div>
          </div>
        </div>
        <div className={styles.logoutArea} />
      </div>
      <div className={showMenu ? styles.menuShowBlur : styles.menuHide}>
        <div className={styles.menuContent}>
          <div className={styles.menuTextArea}>
            <div
              onMouseOver={() => setSelectedNavMenu('dashboard')}
              onMouseLeave={() => setSelectedNavMenu('')}
              className={`${
                router.asPath === '/dashboard' || selectedNavMenu === 'dashboard'
                  ? styles.textWhiteColor
                  : styles.textGrayColor
              } ${'h-[65px] flex items-center'}`}
              onClick={() => router.push('/dashboard')}
            >
              Dashboard
            </div>
            <div
              onMouseOver={() => setSelectedNavMenu('notifications')}
              onMouseLeave={() => setSelectedNavMenu('')}
              className={`${
                router.asPath === '/notifications' || selectedNavMenu === 'notifications'
                  ? styles.textWhiteColor
                  : styles.textGrayColor
              } ${'h-[65px] flex items-center'}`}
              onClick={() => router.push('/notifications')}
            >
              Notifications
            </div>
            <div
              onMouseOver={() => setSelectedNavMenu('stats')}
              onMouseLeave={() => setSelectedNavMenu('')}
              className={`${
                router.asPath === '/stats' || selectedNavMenu === 'stats' ? styles.textWhiteColor : styles.textGrayColor
              } ${'h-[65px] flex items-center'}`}
              onClick={() => router.push('/stats')}
            >
              Stats
            </div>
            <div
              onMouseOver={() => setSelectedNavMenu('dao')}
              onMouseLeave={() => setSelectedNavMenu('')}
              className={`${
                router.asPath === '/dao' || selectedNavMenu === 'dao' ? styles.textWhiteColor : styles.textGrayColor
              } ${'h-[65px] flex items-center'}`}
              onClick={() => router.push('/dao')}
            >
              DAO
            </div>
            <div
              onMouseOver={() => setSelectedNavMenu('resources')}
              onMouseLeave={() => setSelectedNavMenu('')}
              className={`${
                router.asPath === '/resources' || selectedNavMenu === 'resources'
                  ? styles.textWhiteColor
                  : styles.textGrayColor
              } ${'h-[65px] flex items-center'}`}
              onClick={() => router.push('/resources')}
            >
              Resources
            </div>
            <div
              onMouseOver={() => setSelectedNavMenu('settings')}
              onMouseLeave={() => setSelectedNavMenu('')}
              className={`${
                router.asPath === '/settings' || selectedNavMenu === 'settings'
                  ? styles.textWhiteColor
                  : styles.textGrayColor
              } ${'h-[65px] flex items-center'}`}
              onClick={() => router.push('/settings')}
            >
              Settings
            </div>
          </div>
        </div>
      </div>

      <div className={showMenu ? styles.logoShow : styles.logoHide} onClick={() => router.push('/')}>
        <div className="ml-[42px] mt-[36px]">
          <Image src={LogoTextIcon} alt="" />
        </div>
      </div>

      <div
        className={showMenu ? styles.logoutShow : styles.logoutHide}
        onClick={() => {
          disconnect()
          if (localStorage.getItem('walletName') === '"Phantom"') {
            localStorage.removeItem('walletName')
            router.reload()
          }

          localStorage.removeItem('token')
          dispatch({ type: 'set', profileInfo: null })
          router.push('/')
        }}
      >
        <div className="ml-[60px]">
          <Image src={LogoutIcon} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Navbar
