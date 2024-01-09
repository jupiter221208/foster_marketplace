import React, { useState } from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useWallet } from '@solana/wallet-adapter-react'

import MerchHubIcon from 'assets/icons/merch-icon.svg?component'
import DashboardIcon from 'assets/icons/dashboard-icon.svg?component'
import StatsIcon from 'assets/icons/statistic-icon.svg?component'
import SettingIcon from 'assets/icons/setting-icon.svg?component'
import AvatarImage from 'assets/images/dashboard-avatar.png'
import LogoutIcon from 'assets/icons/logout-icon.svg?component'
import { deleteCookie } from 'cookies-next'

const ProfileMenuItem = props => {
  const { avatar, username, key, item, onSelect } = props
  const profile = useSelector(state => (state as any).profileInfo)
  const dispatch = useDispatch()
  const { disconnect } = useWallet()
  const [mouseHover, setMouseHover] = useState(false)

  return (
    <button
      key={key}
      className={`${styles.menuItem} ${item.id === 0 && 'mb-4'}`}
      onMouseEnter={() => setMouseHover(true)}
      onMouseLeave={() => setMouseHover(false)}
      onClick={() => {
        if (item.id === 7) {
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
      // onMouseEnter={() => setMouseHover(true)}
      // onMouseLeave={() => setMouseHover(false)}
    >
      {item.id === 0 ? (
        <div className="w-full">
          {avatar?.length > 0 ? (
            <div>
              <Image src={avatar} alt="profile image" width={100} height={100} className="rounded-full w-full h-full" />
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="rounded-full w-[100px] h-[100px] overflow-hidden">
                <Image src={AvatarImage} alt="" width={100} height={100} layout="responsive" objectFit="cover" />
              </div>
            </div>
          )}

          <span className={styles.username}>{profile?.username}</span>
        </div>
      ) : (
        <div className={`w-full flex max-h-[25px] items-center ${item.id !== 2 && 'pl-[10px]'}`}>
          {item.id === 1 ? (
            <DashboardIcon className={styles.iconFill} />
          ) : item.id === 2 ? (
            <MerchHubIcon className={`${styles.iconStroke} ${styles.iconFill}`} />
          ) : item.id === 3 ? (
            <StatsIcon />
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
            <SettingIcon className={styles.iconFill} />
          ) : item.id === 7 ? (
            <LogoutIcon className={styles.iconFill} />
          ) : (
            <div />
          )}
          <span className={`ml-4 ${item.id === 2 && 'ml-[12px]'} flex`}>{item.label}</span>
        </div>
      )}
    </button>
  )
}
export default ProfileMenuItem

// {
//   item.id === 0 ? (
//     <div className="w-full h-40 ml-2 mr-2 flex flex-col justify-center items-center">
//       <div className={styles.imageArea}>
//         <Image src={avatar} alt="" width={24} height={24} className="rounded-full w-full h-full" />
//       </div>
//       <span>{item.label}</span>
//     </div>
//   ) : (
//     <div className="w-10 h-10 ml-2 mr-2 flex justify-center items-center">
//       {item.id === 1 ? (
//         mouseHover ? (
//           <DashboardHoverIcon />
//         ) : (
//           <DashboardIcon />
//         )
//       ) : item.id === 2 ? (
//         mouseHover ? (
//           <MerchHubHoverIcon />
//         ) : (
//           <MerchHubIcon />
//         )
//       ) : item.id === 3 ? (
//         mouseHover ? (
//           <StatsHoverIcon />
//         ) : (
//           <StatsIcon />
//         )
//       ) : // : item.id === 4 ? (
//       //   mouseHover ? (
//       //     <DaoHoverIcon />
//       //   ) : (
//       //     <DaoIcon />
//       //   )
//       // )
//       // item.id === 5 ? (
//       //   mouseHover ? (
//       //     <ResourceHoverIcon />
//       //   ) : (
//       //     <ResourceIcon />
//       //   )
//       // ) :
//       item.id === 6 ? (
//         mouseHover ? (
//           <SettingHoverIcon />
//         ) : (
//           <SettingIcon />
//         )
//       ) : item.id === 7 ? (
//         mouseHover ? (
//           <LogoutHoverIcon />
//         ) : (
//           <LogoutIcon />
//         )
//       ) : (
//         <div />
//       )}
//     </div>
//   )
// }
