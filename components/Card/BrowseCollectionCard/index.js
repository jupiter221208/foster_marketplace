import React from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'

const BrowseCollectionCard = props => {
  const { image, collectionName, artistName, viewport } = props

  return (
    <div className={styles.container}>
      <div className={styles.avatarArea}>
        <div className={styles.avatar}>
          <Image
            src={image}
            alt=""
            width={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? 152 : 90}
            height={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? 152 : 90}
            layout="responsive"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
      </div>
      <div className={styles.bottomSection}>
        <div className={styles.collectionName}>{collectionName}</div>
        <div className={styles.artistName}>
          Created by <span className={styles.greenText}>{artistName}</span>
        </div>
      </div>
    </div>
  )
}

export default BrowseCollectionCard
