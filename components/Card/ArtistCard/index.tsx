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
import { getDisplayUserName } from 'utils/strings'
import ImageWithFoster from 'components/ImageWithFoster'

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
                <ImageWithFoster src={image} className="rounded-full" />
              </div>

              <div className={styles.name}>{getDisplayUserName(username)}</div>
            </div>
          ) : (
            <div>
              <div className={`${styles.avatar} ${hover ? styles.avatarHover : ''}`}>
                <ImageWithFoster src={image} onClick={onClick} className="rounded-full object-cover" />
              </div>

              <div className={`${styles.name} ${hover === true ? styles.nameHover : ''}`}>
                {getDisplayUserName(username)}
              </div>
            </div>
          )}
        </div>
      </a>
    </Link>
  )
}

export default ArtistCard
