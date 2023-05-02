import React, { useState } from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'
import { useViewport } from 'utils'

const ArtistCard = props => {
  const { image, username, onClick } = props
  const viewport = useViewport()
  const [hover, setHover] = useState(false)

  return (
    <div
      className={styles.container}
      onClick={() => onClick()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
        <div>
          <div className={styles.avatar}>
            <Image src={image} alt="" width={226} height={226} className="rounded-full" />
          </div>

          <div className={styles.name}>{username.length > 20 ? username.slice(0, 20) + '...' : username}</div>
        </div>
      ) : (
        <div>
          <div className={`${styles.avatar} ${hover ? styles.avatarHover : ''}`}>
            <Image src={image} alt="" width={226} height={226} className="rounded-full" />
          </div>

          <div className={`${styles.name} ${hover === true ? styles.nameHover : ''}`}>
            {username.length > 20 ? username.slice(0, 20) + '...' : username}
          </div>
        </div>
      )}
    </div>
  )
}

export default ArtistCard
