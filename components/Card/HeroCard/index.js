import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

const HeroCard = props => {
  const { image, nftName, collectionName, avatar, artistName } = props
  return (
    <div className={styles.container}>
      <Image src={image} alt="" width={550} height={772} layout="responsive" objectFit="cover" />
      <div className={styles.bottomSection}>
        <div className={styles.nftName}>{nftName}</div>
        <div className={`hidden lg:flex ${styles.collectionName}`}>{collectionName}</div>
        <div className="flex justify-start items-center lg:mt-[21px]">
          <div className={styles.avatar}>
            <Image
              src={avatar}
              alt=""
              width={60}
              height={60}
              layout="responsive"
              objectFit="cover"
              className="rounded-full"
            />
          </div>
          <div className="block ml-4">
            <div className={`flex lg:hidden ${styles.collectionName}`}>{collectionName}</div>
            <div className={styles.artistName}>{artistName}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroCard
