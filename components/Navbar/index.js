import React, { useState } from 'react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// images and icons
import LogoIcon from 'assets/icons/logo.svg'
import AvatarIcon from 'assets/images/avatar.jpg'
import SpeedGreenIcon from 'assets/icons/speed-green.svg'
import SpeedGrayIcon from 'assets/icons/speed-gray.svg'
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

// styles
import styles from './index.module.scss'

const Navbar = props => {
  const router = useRouter()

  const [selectedNavMenu, setSelectedNavMenu] = useState('')
  return (
    <div className={styles.container}>
      <div>
        <div className={styles.logoArea} onClick={() => router.push('/')}>
          <Image src={LogoIcon} alt="" />
        </div>
        <div className={styles.navmenuArea}>
          <div className={styles.navItemArea}>
            <div className={styles.avatar}>
              <Image src={AvatarIcon} alt="" width={42} height={42} layout="responsive" objectFit="cover" />
            </div>
          </div>
          {/* <div
            className={styles.navItemArea}
            onMouseOver={() => setSelectedNavMenu('speed')}
            onMouseLeave={() => setSelectedNavMenu('')}
            onClick={() => router.push('/#speed')}
          >
            <Image
              src={
                router.asPath === '/#speed' || router.asPath === '/' || selectedNavMenu === 'speed'
                  ? SpeedGreenIcon
                  : SpeedGrayIcon
              }
              alt=""
            />
          </div> */}
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
            onMouseOver={() => setSelectedNavMenu('notification')}
            onMouseLeave={() => setSelectedNavMenu('')}
            onClick={() => router.push('/#notification')}
          >
            <Image
              src={
                router.asPath === '/#notification' || selectedNavMenu === 'notification'
                  ? NotificationGreenIcon
                  : NotificationGrayIcon
              }
              alt=""
            />
          </div>
          <div
            className={styles.navItemArea}
            onMouseOver={() => setSelectedNavMenu('statistic')}
            onMouseLeave={() => setSelectedNavMenu('')}
            onClick={() => router.push('/#statistic')}
          >
            <Image
              src={
                router.asPath === '/#statistic' || selectedNavMenu === 'statistic'
                  ? StatisticGreenIcon
                  : StatisticGrayIcon
              }
              alt=""
            />
          </div>
          <div
            className={styles.navItemArea}
            onMouseOver={() => setSelectedNavMenu('resource')}
            onMouseLeave={() => setSelectedNavMenu('')}
            onClick={() => router.push('/#resource')}
          >
            <Image
              src={
                router.asPath === '/#resource' || selectedNavMenu === 'resource' ? ResourceGreenIcon : ResourceGrayIcon
              }
              alt=""
            />
          </div>
          <div
            className={styles.navItemArea}
            onMouseOver={() => setSelectedNavMenu('setting')}
            onMouseLeave={() => setSelectedNavMenu('')}
            onClick={() => router.push('/#setting')}
          >
            <Image
              src={router.asPath === '/#setting' || selectedNavMenu === 'setting' ? SettingGreenIcon : SettingGrayIcon}
              alt=""
            />
          </div>
          <div
            className={styles.navItemArea}
            onMouseOver={() => setSelectedNavMenu('dao')}
            onMouseLeave={() => setSelectedNavMenu('')}
            onClick={() => router.push('/#dao')}
          >
            <Image src={router.asPath === '/#dao' || selectedNavMenu === 'dao' ? DaoGreenIcon : DaoGrayIcon} alt="" />
          </div>
        </div>
      </div>
      <div className={styles.logoutArea} />
    </div>
  )
}

export default Navbar
