import React from 'react'

const SkeletonLoader = ({ width, height, borderRadius }) => {
  return (
    <div className={`w-[${width}px] h-[${height}px] rounded-[${borderRadius}px] overflow-hidden`}>
      <div className="skeletonLoader" />
    </div>
  )
}

export default SkeletonLoader
