import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import ReactPlaceholder from 'react-placeholder'
import 'react-placeholder/lib/reactPlaceholder.css'
import styles from './index.module.scss'

const ImageWithAuction = props => {
  const { src, onClick, setImageLoaded, ...rest } = props
  const [isNextImage, setIsNextImage] = useState(true)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (setImageLoaded !== undefined && loaded === true) {
      setImageLoaded(loaded)
    }
  }, [loaded])

  return (
    <div className={`w-full h-full overflow-hidden ${styles.card}`} onClick={onClick}>
      <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
        <div></div>
      </ReactPlaceholder>
      {isNextImage ? (
        <Image
          {...rest}
          src={src}
          onLoadingComplete={() => setLoaded(true)}
          onError={() => {
            setIsNextImage(false)
          }}
        />
      ) : (
        <img {...rest} src={src} onLoad={() => setLoaded(true)} />
      )}
    </div>
  )
}

export default ImageWithAuction
