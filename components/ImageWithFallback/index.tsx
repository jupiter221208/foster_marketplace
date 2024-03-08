import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import ReactPlaceholder from 'react-placeholder'
import 'react-placeholder/lib/reactPlaceholder.css'

const ImageWithFallback = props => {
  const { src, onClick, setImageLoaded, originalSrc = null, ...rest } = props
  const [isNextImage, setIsNextImage] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)

  useEffect(() => {
    if (setImageLoaded !== undefined && loaded === true) {
      setImageLoaded(loaded)
    }
  }, [loaded])

  useEffect(() => {
    if (originalSrc) {
      const img = new window.Image()
      img.src = src
      img.onload = () => setCurrentSrc(src)
      img.onerror = () => {
        setCurrentSrc(originalSrc)
      }
    }
  }, [originalSrc])

  return (
    <div className="w-full h-full overflow-hidden" onClick={onClick}>
      <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
        <div></div>
      </ReactPlaceholder>
      {isNextImage ? (
        <Image
          {...rest}
          src={currentSrc}
          onLoadingComplete={() => setLoaded(true)}
          onError={e => {
            setIsNextImage(false)
          }}
        />
      ) : (
        <img {...rest} src={currentSrc} onLoad={() => setLoaded(true)} />
      )}
    </div>
  )
}

export default ImageWithFallback
