import React from 'react'

// next components
import Image from 'next/image'

// custom functions
import { getShortAddress } from 'utils/strings'
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

const BrowseArtistCard = props => {
  const { image, collectionName, artistName } = props

  const viewport = useViewport()

  return (
    <div className={styles.container}>
      <div className={styles.avatarArea}>
        <div className={styles.avatar}>
          {image && (
            <Image
              src={image}
              alt=""
              width={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? 152 : 90}
              height={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? 152 : 90}
              layout="responsive"
              objectFit="cover"
              className="rounded-full"
            />
          )}
        </div>
      </div>
      <div className={styles.bottomSection}>
        <div className={styles.collectionName}>{collectionName}</div>
        {artistName && (
          <div className={styles.artistName}>
            Created by <span className={styles.greenText}>{getShortAddress(artistName[0].address.toBase58())}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default BrowseArtistCard
