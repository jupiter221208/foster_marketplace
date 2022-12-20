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
        <img
          src={image}
          alt=""
          width={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? 152 : 90}
          height={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? 152 : 90}
          className="rounded-full"
        />
      </div>
      <div className={styles.name}>{name}</div>
    </div>
  )
}

export default ProfileArtistCard
