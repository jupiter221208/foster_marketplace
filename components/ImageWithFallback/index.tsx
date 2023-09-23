import React, { useState } from 'react'
import Image from 'next/image'
import ReactPlaceholder from 'react-placeholder'
import 'react-placeholder/lib/reactPlaceholder.css'

const ImageWithFallback = props => {
  const { src, onClick, ...rest } = props
  const [isNextImage, setIsNextImage] = useState(true)
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="w-full h-full overflow-hidden" onClick={onClick}>
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

export default ImageWithFallback
