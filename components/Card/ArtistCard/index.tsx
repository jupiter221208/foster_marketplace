import React from 'react'
import { useSelector } from 'react-redux'

// styles
import styles from './index.module.scss'

const ArtistCard = props => {
  const { image, username, onClick } = props
  const lightMode = useSelector(state => (state as any).lightMode)

  return (
    <div className={styles.container} onClick={() => onClick()}>
      <div className={`${styles.avatar} ${lightMode ? styles.avatarLightBG : ''}`}>
        <img src={image} alt="" width={226} height={226} className="rounded-full" />
      </div>

      <div className={`${styles.name} ${lightMode ? styles.lightName : ''}`}>
        {username.length > 20 ? username.slice(0, 20) + '...' : username}
      </div>
    </div>
  )
}

export default ArtistCard
