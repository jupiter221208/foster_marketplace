import React from 'react'

import ImageWithFoster from 'components/ImageWithFoster'

const MerchNftItem = props => {
  const { url } = props

  return (
    <div className="w-full h-full">
      <ImageWithFoster src={url} className="w-full h-full object-cover" alt="" />
    </div>
  )
}

export default MerchNftItem
