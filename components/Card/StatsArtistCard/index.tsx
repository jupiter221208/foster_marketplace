import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// next components
import ReactPlaceholder from 'react-placeholder/lib'
import 'react-placeholder/lib/reactPlaceholder.css'

// styles
import styles from './index.module.scss'

// icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import SolanaLogoMobileIcon from 'assets/icons/solana-logo-dark-mobile.svg?component'
import DefaultAvatar from 'assets/images/dashboard-avatar.png'
import ImageWithFallback from 'components/ImageWithFallback'

const StatsArtistCard = props => {
  const { data, type } = props
  const router = useRouter()
  const dispatch = useDispatch()

  return (
    <div
      className={styles.container}
      onClick={() => {
        dispatch({ type: 'set', isLoading: true })
        router.push(
          `/${
            type === 'creators' ? data.creator_name.replaceAll(' ', '%20') : data.collector_name.replaceAll(' ', '%20')
          }`
        )
      }}
    >
      <div className="w-full flex justify-center pt-[30px]">
        <div className={styles.avatarArea}>
          <div className="w-full h-full overflow-hidden rounded-full">
            <ImageWithFallback
              src={data.pfp_url !== null && data.pfp_url !== '' ? data.pfp_url : DefaultAvatar.src}
              alt=""
              width={180}
              height={180}
              className="rounded-[90px]"
            />
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center pt-[3px] lg:pt-[7px]">
        <div className={styles.name}>{type === 'creators' ? data.creator_name : data.collector_name}</div>
      </div>
      <div className="w-full pt-[20px] lg:pt-[36px]">
        <div className="flex justify-center items-center gap-[4px]">
          <div className="hidden lg:flex mt-[2px]">
            <SolanaLogoIcon alt="" />
          </div>
          <div className="flex lg:hidden">
            <SolanaLogoMobileIcon alt="" />
          </div>
          <div className={styles.value}>
            {type === 'creators'
              ? parseFloat(data.total_sales).toFixed(2)
              : parseFloat(data.purchase_volume).toFixed(2)}
          </div>
        </div>
        <div className="flex justify-center mt-[4px]">
          <div className={styles.totalSales}>{type === 'creators' ? 'Total Sales' : 'Total Purchases'}</div>
        </div>
      </div>
    </div>
  )
}

export default StatsArtistCard
