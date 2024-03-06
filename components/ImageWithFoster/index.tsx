import Link from 'next/link'
import React, { useState, useEffect } from 'react'

// styles
import styles from './index.module.scss'

const ImageWithFoster = props => {
  const { src, link = '', onClick = null, originalSrc = null, showPlaceHolder = true, ...rest } = props
  const [loaded, setLoaded] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)

  return (
    <div className="w-full h-full" onClick={onClick}>
      {showPlaceHolder && !loaded && (
        <div className={styles.skeletonLoaderOuterBox}>
          <div className={styles.skeletonLoader} />
        </div>
      )}
      <div className="w-full h-full flex justify-center items-center">
        <img
          {...rest}
          src={currentSrc}
          onLoad={() => setLoaded(true)}
          loading="lazy"
          onError={() => setCurrentSrc(originalSrc)}
          alt=""
        />
      </div>
    </div>
  )
}

export default ImageWithFoster
