import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'
import { useDispatch } from 'react-redux'
import { useWallet } from '@solana/wallet-adapter-react'

import MerchHubIcon from 'assets/icons/merch-icon.svg?component'
import MyProfileIcon from 'assets/icons/myprofile-icon.svg?component'
import DashboardIcon from 'assets/icons/dashboard-icon.svg?component'
import StatsIcon from 'assets/icons/statistic-icon.svg?component'
import SettingIcon from 'assets/icons/setting-icon.svg?component'
import AvatarImage from 'assets/images/dashboard-avatar.png'
import LogoutIcon from 'assets/icons/logout-icon.svg?component'
import ShoppingCartIcon from 'assets/icons/shoppingcart-icon-navbar.svg?component'

import { deleteCookie } from 'cookies-next'
import { getDisplayUserName } from 'utils/strings'
import { useRouter } from 'next/router'

const ProfileMenuItem = props => {
  const { avatar, username, item, onSelect } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const { disconnect } = useWallet()

  return (
    <button
      className={styles.menuItem}
      onClick={() => {
        if (item.id === 0) {
          return
        } else if (item.id === 3) {
          router.push(`/${username}`)
          return
        } else if (item.id === 4) {
          router.push(`/${username}/merch`)
          return
        } else if (item.id === 2) {
          dispatch({ type: 'set', activeTab: 0 })
          router.push(`/merch-logs`)
          return
        } else if (item.id === 7) {
          if (localStorage.getItem('walletName') === '"Phantom"') {
            localStorage.removeItem('walletName')
            ;(window as any).solana.disconnect()
          } else disconnect()

          localStorage.removeItem('token')
          localStorage.removeItem('expiryDate')
          localStorage.removeItem('signature')

          dispatch({ type: 'set', profileInfo: null })
          deleteCookie('token')
        }
        onSelect(item)
      }}
    >
      {item.id === 0 ? (
        <div>
          <div className="flex flex-col items-center gap-[10px]">
            {avatar?.length > 0 ? (
              <div className="rounded-full w-[70px] h-[70px] overflow-hidden">
                <img src={avatar} alt="profile image" width={70} height={70} className="rounded-full w-full h-full" />
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <div className="rounded-full w-[70px] h-[70px] overflow-hidden">
                  <Image src={AvatarImage} alt="" width={70} height={70} layout="responsive" objectFit="cover" />
                </div>
              </div>
            )}

            <span className={styles.username}>{getDisplayUserName(username)}</span>
          </div>

          <div className={styles.border}></div>
        </div>
      ) : (
        <div className={`w-full flex gap-[15px] max-h-[25px] items-center`}>
          <div className="w-[28px] flex justify-center items-center">
            {item.id === 3 ? (
              <MyProfileIcon className={`${styles.profileIconFill} ${styles.iconStroke}`} />
            ) : item.id === 1 ? (
              <DashboardIcon className={styles.iconFill} />
            ) : item.id === 2 ? (
              <ShoppingCartIcon className={styles.profileIconFill} />
            ) : item.id === 4 ? (
              <MerchHubIcon className={styles.profileIconFill} />
            ) : item.id === 3 ? (
              <StatsIcon />
            ) : item.id === 6 ? (
              <SettingIcon className={styles.iconFill} />
            ) : item.id === 7 ? (
              <LogoutIcon className={styles.iconFill} />
            ) : (
              <div />
            )}
          </div>

          <span>{item.label}</span>
        </div>
      )}
    </button>
  )
}
export default ProfileMenuItem
