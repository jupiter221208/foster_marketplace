import React from 'react'

// styles
import styles from './index.module.scss'

const ArtistCard = props => {
  const { image, username, onClick } = props
  return (
    <div className={styles.container} onClick={() => onClick()}>
      <div className={styles.avatarArea}>
        <div className={styles.avatar}>
          <img src={image} alt="" width={206} height={206} className="rounded-full" />
        </div>
      </div>

      <div className={styles.name}>{username}</div>
    </div>
  )
}

export default ArtistCard
