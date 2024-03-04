import Link from 'next/link'
import React, { useState } from 'react'
import ReactPlaceholder from 'react-placeholder'
import 'react-placeholder/lib/reactPlaceholder.css'

const ImageWithFoster = props => {
  const { src, link = '', onClick = null, noPlaceholder = false, ...rest } = props
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="w-full h-full flex justify-center items-center" onClick={onClick}>
      {!noPlaceholder && (
        <ReactPlaceholder
          showLoadingAnimation={true}
          type="rect"
          ready={loaded}
          color="#202427"
          style={{ marginRight: '0px' }}
        >
          <div></div>
        </ReactPlaceholder>
      )}
      {link.length > 0 ? (
        <Link href={link} passHref>
          <a className="w-full h-full flex justify-center items-center">
            <img {...rest} src={src} onLoad={() => setLoaded(true)} loading="lazy" alt="" />
          </a>
        </Link>
      ) : (
        <img {...rest} src={src} onLoad={() => setLoaded(true)} loading="lazy" alt="" />
      )}
    </div>
  )
}

export default ImageWithFoster
