import React from 'react'

// next components
import Image from 'next/image'

// images and icons
import CheckedGreenIcon from 'assets/icons/checked-green.svg'

// styles
import styles from './index.module.scss'

const ProfileArtistCard = props => {
  const { image, name } = props
  return (
    <div className={styles.container}>
      <div className={styles.avatarArea}>
        <div className={styles.avatar}>
          <Image
            src={image}
            alt=""
            width={152}
            height={152}
            layout="responsive"
            objectFit="cover"
            className="rounded-[103px]"
          />
        </div>
      </div>
      <div className={styles.bottomSection}>
        <div className={styles.name}>{name}</div>
        <div className="ml-[5px] flex pl-[9px] pr-[9px]">
          <Image src={CheckedGreenIcon} alt="" width={28} height={28} />
        </div>
      </div>
    </div>
  )
}

export default ProfileArtistCard
