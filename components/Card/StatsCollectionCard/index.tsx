import React from 'react'

// next components
import Image from 'next/image'

// functions
import { getPercentValue } from 'utils/strings'

// styles
import styles from './index.module.scss'

const StatsCollectionCard = props => {
  const { data } = props

  return (
    <div className={styles.container}>
      <div className={styles.imageArea}>
        <Image src={data.image} width={287} height={180} alt="" layout="fill" objectFit="cover" />
      </div>
      <div className={styles.topMask} />
      <div className={styles.bottomMask} />
      <div className={styles.volume}>{getPercentValue(data.volume)}</div>
      <div className="w-full flex justify-between items-end z-10">
        <div className="block">
          <div className={styles.collectionName}>{data.collectionName}</div>
          <div className={styles.artistName}>{data.artistName}</div>
        </div>
        <div className={styles.avatarArea}>
          <Image
            src={data.avatar}
            alt=""
            width={32}
            height={32}
            layout="fixed"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  )
}

export default StatsCollectionCard
