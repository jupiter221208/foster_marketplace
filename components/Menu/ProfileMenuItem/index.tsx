import React, { useState } from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'
import { useDispatch } from 'react-redux'
import { useWallet } from '@solana/wallet-adapter-react'

import DashboardIcon from 'assets/icons/dashboard-icon.svg?component'
import DashboardHoverIcon from 'assets/icons/dashboard-green.svg?component'
import StatsIcon from 'assets/icons/statistic-icon.svg?component'
import StatsHoverIcon from 'assets/icons/statistic-green.svg?component'
import SettingIcon from 'assets/icons/setting-icon.svg?component'
import SettingHoverIcon from 'assets/icons/setting-green.svg?component'
import LogoutIcon from 'assets/icons/logout-icon.svg?component'
import LogoutHoverIcon from 'assets/icons/logout-green.svg?component'

const ProfileMenuItem = props => {
  const { avatar, key, item, onSelect } = props
  const dispatch = useDispatch()
  const { disconnect } = useWallet()
  const [mouseHover, setMouseHover] = useState(false)

  return (
    <div
      key={key}
      className={styles.menuItem}
      onClick={() => {
        if (item.id === 7) {
          if (localStorage.getItem('walletName') === '"Phantom"') {
            localStorage.removeItem('walletName')
            ;(window as any).solana.disconnect()
          } else disconnect()

          localStorage.removeItem('token')
          dispatch({ type: 'set', profileInfo: null })
        }
        onSelect(item)
      }}
      onMouseEnter={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
    >
      {item.id === 0 ? (
        <div className="w-10 h-10 ml-2 flex justify-center items-center">
          <div className={styles.imageArea}>
            <Image src={avatar} alt="" width={24} height={24} className="rounded-full" />
          </div>
        </div>
      ) : (
        <div className="w-10 h-10 ml-2 mr-2 flex items-center">
          {item.id === 1 ? (
            mouseHover ? (
              <DashboardHoverIcon />
            ) : (
              <DashboardIcon />
            )
          ) : // : item.id === 2 ? (
          //   mouseHover ? (
          //     <NotificationHoverIcon />
          //   ) : (
          //     <NotificationIcon />
          //   )
          // )
          item.id === 3 ? (
            mouseHover ? (
              <StatsHoverIcon />
            ) : (
              <StatsIcon />
            )
          ) : // : item.id === 4 ? (
          //   mouseHover ? (
          //     <DaoHoverIcon />
          //   ) : (
          //     <DaoIcon />
          //   )
          // )
          // item.id === 5 ? (
          //   mouseHover ? (
          //     <ResourceHoverIcon />
          //   ) : (
          //     <ResourceIcon />
          //   )
          // ) :
          item.id === 6 ? (
            mouseHover ? (
              <SettingHoverIcon />
            ) : (
              <SettingIcon />
            )
          ) : item.id === 7 ? (
            mouseHover ? (
              <LogoutHoverIcon />
            ) : (
              <LogoutIcon />
            )
          ) : (
            <div />
          )}
        </div>
      )}
      {item.label}
    </div>
  )
}
export default ProfileMenuItem
