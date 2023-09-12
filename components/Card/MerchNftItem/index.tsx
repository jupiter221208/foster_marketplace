import React, { useState } from 'react'
import ReactPlaceholder from 'react-placeholder/lib'
import 'react-placeholder/lib/reactPlaceholder.css'

const MerchNftItem = props => {
  const { url } = props
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="w-full h-full">
      {!loaded && (
        <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
          <div></div>
        </ReactPlaceholder>
      )}
      <img
        src={url}
        loading="lazy"
        onLoad={() => {
          setLoaded(true)
        }}
        className="w-full h-full object-cover"
        alt=""
      />
    </div>
  )
}

export default MerchNftItem
