import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

// icons
import SolanaLogoIcon from 'assets/icons/solana-logo-dark.svg?component'
import SolanaLogoMobileIcon from 'assets/icons/solana-logo-dark-mobile.svg?component'

const StatsArtistCard = props => {
  const { data, type } = props
  return (
    <div className={styles.container}>
      <div className="w-full flex justify-center pt-[30px]">
        <div className={styles.avatarArea}>
          <div className="w-full h-full overflow-hidden hidden lg:flex">
            <Image src={data.pfp_url} alt="" width={180} height={180} objectFit="cover" className="rounded-[90px]" />
          </div>
          <div className="w-full h-full overflow-hidden lg:hidden">
            <Image src={data.pfp_url} alt="" width={100} height={100} objectFit="cover" className="rounded-[90px]" />
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center pt-[3px] lg:pt-[7px]">
        <div className={styles.name}>{data.creator_name}</div>
      </div>
      <div className="w-full pt-[20px] lg:pt-[36px]">
        <div className="flex justify-center items-center gap-[4px]">
          <div className="hidden lg:flex mt-[2px]">
            <SolanaLogoIcon alt="" />
          </div>
          <div className="flex lg:hidden">
            <SolanaLogoMobileIcon alt="" />
          </div>
          <div className={styles.value}>{data.total_sales}</div>
        </div>
        <div className="flex justify-center mt-[4px]">
          <div className={styles.totalSales}>{type === 'creators' ? 'Total Sales' : 'Total Purchases'}</div>
        </div>
      </div>
    </div>
  )
}

export default StatsArtistCard
