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
import ChartGreenIcon from 'assets/icons/chart-green.svg'
import ChartGrayIcon from 'assets/icons/chart-gray.svg'
import BookGreenIcon from 'assets/icons/book-green.svg'
import BookGrayIcon from 'assets/icons/book-gray.svg'

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
          <div
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
          </div>
          <div
            className={styles.navItemArea}
            onMouseOver={() => setSelectedNavMenu('dashboard')}
            onMouseLeave={() => setSelectedNavMenu('')}
            onClick={() => router.push('/#dashboard')}
          >
            <Image
              src={
                router.asPath === '/#dashboard' || selectedNavMenu === 'dashboard'
                  ? DashboardGreenIcon
                  : DashboardGrayIcon
              }
              alt=""
            />
          </div>
          <div
            className={styles.navItemArea}
            onMouseOver={() => setSelectedNavMenu('chart')}
            onMouseLeave={() => setSelectedNavMenu('')}
            onClick={() => router.push('/#chart')}
          >
            <Image
              src={router.asPath === '/#chart' || selectedNavMenu === 'chart' ? ChartGreenIcon : ChartGrayIcon}
              alt=""
            />
          </div>
          <div
            className={styles.navItemArea}
            onMouseOver={() => setSelectedNavMenu('book')}
            onMouseLeave={() => setSelectedNavMenu('')}
            onClick={() => router.push('/#book')}
          >
            <Image
              src={router.asPath === '/#book' || selectedNavMenu === 'book' ? BookGreenIcon : BookGrayIcon}
              alt=""
            />
          </div>
        </div>
      </div>
      <div className={styles.logoutArea} />
    </div>
  )
}

export default Navbar
