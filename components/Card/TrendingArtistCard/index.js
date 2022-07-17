import React from 'react'

// next components
import Image from 'next/image'

// images and icons
import CheckedGreenIcon from 'assets/icons/checked-green.svg'

// styles
import styles from './index.module.scss'

const TrendingArtistCard = props => {
  const { image, name, nfts, collections } = props
  return (
    <div className={styles.container}>
      <div className={styles.avatarArea}>
        <div className={styles.avatar}>
          <Image
            src={image}
            alt=""
            width={70}
            height={70}
            layout="responsive"
            objectFit="cover"
            className="rounded-[6px]"
          />
        </div>
      </div>
      <div className="ml-3">
        <div className="flex">
          <div className={styles.name}>{name}</div>
          <Image src={CheckedGreenIcon} alt="" />
        </div>
        <div className="flex">
          <div className={styles.boldText}>NFTs :</div>
          <div className={styles.text}>{nfts}</div>
        </div>
        <div className="flex">
          <div className={styles.boldText}>Collections :</div>
          <div className={styles.text}>{collections}</div>
        </div>
      </div>
    </div>
  )
}

export default TrendingArtistCard
