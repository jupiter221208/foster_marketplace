import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import ReactPlaceholder from 'react-placeholder'
import 'react-placeholder/lib/reactPlaceholder.css'

const ImageWithFoster = props => {
  const { src, link = '', onClick = null, originalSrc, ...rest } = props
  const [loaded, setLoaded] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)

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
    <div className="w-full h-full" onClick={onClick}>
      <ReactPlaceholder
        showLoadingAnimation={true}
        type="rect"
        ready={loaded}
        color="#202427"
        style={{ marginRight: '0px' }}
      >
        <div></div>
      </ReactPlaceholder>

      {link.length > 0 ? (
        <Link href={link} passHref>
          <a className="w-full h-full flex justify-center items-center">
            <img {...rest} src={currentSrc} onLoad={() => setLoaded(true)} loading="lazy" alt="" />
          </a>
        </Link>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <img {...rest} src={currentSrc} onLoad={() => setLoaded(true)} loading="lazy" alt="" />
        </div>
      )}
    </div>
  )
}

export default ImageWithFoster
