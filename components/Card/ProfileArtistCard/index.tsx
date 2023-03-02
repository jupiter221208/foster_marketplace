import React from 'react'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// images and icons
import CheckedGreenIcon from 'assets/icons/checked-green.svg'

// styles
import styles from './index.module.scss'
import { useSelector } from 'react-redux'

const ProfileArtistCard = props => {
  const { image, name } = props
  const viewport = useViewport()
  const lightMode = useSelector(state => (state as any).lightMode)

  return (
    <div className={styles.container}>
      <div className={`${styles.avatarArea} ${lightMode ? styles.lightAvatarArea : ''}`}>
        <img
          src={image}
          alt=""
          width={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? 152 : 90}
          height={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? 152 : 90}
          className="rounded-full"
        />
      </div>
      <div className={`${styles.name} ${lightMode ? styles.lightName : ''}`}>{name}</div>
    </div>
  )
}

export default ProfileArtistCard
