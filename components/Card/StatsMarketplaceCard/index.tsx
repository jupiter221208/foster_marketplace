import React from 'react'

// next components
import Image from 'next/image'

// icons
import MostPopularIcon from 'assets/icons/stats-most-popular.svg'
import MostCollectedIcon from 'assets/icons/stats-most-collected.svg'
import TrendingIcon from 'assets/icons/stats-trending.svg'

// styles
import styles from './index.module.scss'

const StatsMarketplaceCard = props => {
  const { data, index } = props

  return (
    <div className={styles.container}>
      <div className={styles.imageArea}>
        <Image src={data.image} width={489} height={213} alt="" layout="fill" objectFit="cover" />
      </div>
      <div className={styles.topMask} />
      <div className={styles.bottomMask} />
      <div className="w-full relative z-10">
        <div className="absolute top-1">
          <div className="w-full flex">
            <Image
              src={index === 0 ? MostPopularIcon : index === 1 ? MostCollectedIcon : TrendingIcon}
              width={30}
              height={30}
              alt=""
            />
            <div className={`ml-[12px] ${styles.artistName}`}>
              {index === 0 ? 'Most Popular' : index === 1 ? 'Most Collected' : 'Trending'}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0">
          <div className={styles.artistName}>{data.name}</div>
        </div>
      </div>
    </div>
  )
}

export default StatsMarketplaceCard
