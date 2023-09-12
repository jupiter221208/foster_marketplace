import React, { useState } from 'react'

// Next Component
import Image from 'next/image'

// thrid-part component
import ReactPlaceholder from 'react-placeholder/lib'
import 'react-placeholder/lib/reactPlaceholder.css'

const MerchNftItem = props => {
  const { url, width, height } = props
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="w-full h-full">
      {!loaded && (
        <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
          <div></div>
        </ReactPlaceholder>
      )}
      <Image
        src={url}
        width={width}
        height={height}
        onLoadingComplete={() => {
          setLoaded(true)
        }}
        className="w-full h-full object-cover"
        alt=""
      />
    </div>
  )
}

export default MerchNftItem
