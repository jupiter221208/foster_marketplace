import React from 'react'

// next components
import Image from 'next/image'

// functions
import { getPercentValue } from 'utils/strings'

// styles
import styles from './index.module.scss'

const StatsMarketplaceCard = props => {
  const { viewport, data } = props

  return (
    <div className={styles.container}>
      <div className={styles.imageArea}>
        <Image src={data.image} width={489} height={213} alt="" layout="fill" objectFit="cover" />
      </div>
      <div className={styles.topMask} />
      <div className={styles.bottomMask} />
      <div className="w-full flex justify-between items-end z-10">
        <div className="block">
          <div className={styles.artistName}>{data.name}</div>
        </div>
      </div>
    </div>
  )
}

export default StatsMarketplaceCard
