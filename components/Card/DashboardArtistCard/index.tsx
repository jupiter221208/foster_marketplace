import React from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

const DashboardArtistCard = props => {
  const { image, artistName } = props
  const viewport = useViewport()

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
        <div className={styles.artistName}>{artistName}</div>
      </div>
    </div>
  )
}

export default DashboardArtistCard
