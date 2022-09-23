import React from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// images and icons
import CheckedGreenIcon from 'assets/icons/checked-green.svg'

// styles
import styles from './index.module.scss'

const ProfileArtistCard = props => {
  const { image, name } = props
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
        <div className={styles.name}>{name}</div>
        <div className="ml-[5px] flex pl-[9px] pr-[9px]">
          <Image
            src={CheckedGreenIcon}
            alt=""
            width={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? 28 : 18}
            height={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? 28 : 18}
          />
        </div>
      </div>
    </div>
  )
}

export default ProfileArtistCard
