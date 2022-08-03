import React from 'react'

// next components
import Image from 'next/image'

// images and icons
import CheckedGreenIcon from 'assets/icons/checked-green.svg'

// styles
import styles from './index.module.scss'

const TrendingArtistCard = props => {
  const { image, name, onClick } = props
  return (
    <div className={styles.container} onClick={() => onClick()}>
      <div className={styles.avatarArea}>
        <div className={styles.avatar}>
          <Image
            src={image}
            alt=""
            width={206}
            height={206}
            layout="responsive"
            objectFit="cover"
            className="rounded-[103px]"
          />
        </div>
      </div>

      <div className={styles.name}>{name}</div>
    </div>
  )
}

export default TrendingArtistCard
