import React from 'react'

// next components
import Image from 'next/image'

// images and icons
import CheckedGreenIcon from 'assets/icons/checked-green.svg'

// styles
import styles from './index.module.scss'

const StatsArtistCard = props => {
  const { data } = props
  return (
    <div className={styles.container}>
      <div className={styles.avatarArea}>
        <Image src={data.image} alt="" width={144} height={144} objectFit="cover" className="rounded-[72px]" />
      </div>

      <div className={styles.name}>{data.name}</div>
    </div>
  )
}

export default StatsArtistCard
