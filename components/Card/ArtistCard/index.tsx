import React, { useState } from 'react'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'
import { useViewport } from 'utils'
import ReactPlaceholder from 'react-placeholder/lib'
import 'react-placeholder/lib/reactPlaceholder.css'

const ArtistCard = props => {
  const { image, username, onClick } = props
  const viewport = useViewport()
  const [hover, setHover] = useState(false)
  const [loaded, setLoaded] = useState(false)

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
            {!loaded && (
              <div className="w-full h-full overflow-hidden rounded-full">
                <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
                  <div></div>
                </ReactPlaceholder>
              </div>
            )}
            <Image
              src={image}
              alt=""
              width={226}
              height={226}
              className="rounded-full"
              onLoadingComplete={() => setLoaded(true)}
            />
          </div>

          <div className={styles.name}>{username.length > 20 ? username.slice(0, 20) + '...' : username}</div>
        </div>
      ) : (
        <div>
          <div className={`${styles.avatar} ${hover ? styles.avatarHover : ''}`}>
            {!loaded && (
              <div className="w-full h-full overflow-hidden rounded-full">
                <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
                  <div></div>
                </ReactPlaceholder>
              </div>
            )}
            <img src={image} alt="" width={226} height={226} className="rounded-full" onLoad={() => setLoaded(true)} />
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
