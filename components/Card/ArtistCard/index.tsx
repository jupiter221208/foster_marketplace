import React, { useState } from 'react'
import Link from 'next/link'

// next components
import Image from 'next/image'

// styles
import styles from './index.module.scss'
import { useViewport } from 'utils'
import ReactPlaceholder from 'react-placeholder/lib'
import 'react-placeholder/lib/reactPlaceholder.css'
import ImageWithFallback from 'components/ImageWithFallback'

const ArtistCard = props => {
  const { image, username, onClick } = props
  const viewport = useViewport()
  const [hover, setHover] = useState(false)
  const [loaded, setLoaded] = useState(false)

  return (
    <Link href={`${window.origin}/${username}`} passHref>
      <a>
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
                <ImageWithFallback
                  src={image}
                  onClick={onClick}
                  width={226}
                  height={226}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              </div>

              <div className={`${styles.name} ${hover === true ? styles.nameHover : ''}`}>
                {username.length > 20 ? username.slice(0, 20) + '...' : username}
              </div>
            </div>
          )}
        </div>
      </a>
    </Link>
  )
}

export default ArtistCard
