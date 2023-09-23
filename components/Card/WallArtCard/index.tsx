import React from 'react'

// next components
import Image from 'next/image'

// images and icons

// styles
import styles from './index.module.scss'

const WallArtCard = props => {
  const { data, onClick } = props
  return (
    <div className={styles.container}>
      <div className={styles.imageArea} onClick={onClick}>
        <div className={styles.imageContent}>
          <Image src={data.asset_url} layout="fill" alt="" className="w-full h-full rounded-[24px] object-cover" />
        </div>
      </div>
      <div className={styles.bidContainer}>
        <div className={styles.bidGradientBgView} />
        <div className={styles.bidContentView}>
          <div className="w-full flex gap-[6px] items-center">
            <div className={styles.name}>{data.name}</div>
            {data.type.length > 0 && <div className={styles.type}>&nbsp;({data.type})</div>}
          </div>
          <div className={styles.startPrice}>Starting at ${data.start_price}</div>
        </div>
      </div>
    </div>
  )
}

export default WallArtCard
