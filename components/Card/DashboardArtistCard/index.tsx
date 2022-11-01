import React from 'react'

// styles
import styles from './index.module.scss'

const DashboardArtistCard = props => {
  const { image } = props

  return (
    <div className={styles.container}>
      <div className={styles.avatarArea}>
        <div className={styles.avatar}>
          <img src={image} alt="" className="w-full h-full object-cover rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default DashboardArtistCard
