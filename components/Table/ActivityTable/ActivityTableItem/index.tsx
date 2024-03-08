import React from 'react'
import ImageWithFoster from 'components/ImageWithFoster'

const ActivityTableItem = props => {
  const { url } = props

  return (
    <div className="w-full h-full flex justify-center items-center overflow-hidden rounded-[8px]">
      <ImageWithFoster src={url} className="w-full h-full object-cover rounded-[8px] cursor-pointer" />
    </div>
  )
}

export default ActivityTableItem
