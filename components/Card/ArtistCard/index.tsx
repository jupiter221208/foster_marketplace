import React from 'react'

// styles
import styles from './index.module.scss'

const ArtistCard = props => {
  const { image, username, onClick } = props
  return (
    <div className={styles.container} onClick={() => onClick()}>
      <div className={styles.avatar}>
        <img src={image} alt="" width={226} height={226} className="rounded-full" />
      </div>

      <div className={styles.name}>{username.length > 14 ? username.slice(0, 14) + '...' : username}</div>
    </div>
  )
}

export default ArtistCard
