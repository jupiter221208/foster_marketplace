import React, { useState } from 'react'
import ReactPlaceholder from 'react-placeholder'
import 'react-placeholder/lib/reactPlaceholder.css'

// custom functions
import { useViewport } from 'utils'

const ActivityTableItem = props => {
  const { url } = props
  const viewport = useViewport()
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="w-full h-full flex justify-center items-center">
      <ReactPlaceholder showLoadingAnimation={true} type="rect" ready={loaded} color="#202427">
        <img
          src={url}
          alt=""
          width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' || viewport === 'lg' ? 50 : 70}
          height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' || viewport === 'lg' ? 50 : 70}
          className="w-full h-full object-cover rounded-[8px] cursor-pointer"
        />
      </ReactPlaceholder>
      {!loaded && (
        <img
          src={url}
          alt=""
          width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' || viewport === 'lg' ? 50 : 70}
          height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' || viewport === 'lg' ? 50 : 70}
          className="w-full h-full object-cover rounded-[8px] cursor-pointer"
          onLoad={() => {
            setLoaded(true)
          }}
        />
      )}
    </div>
  )
}

export default ActivityTableItem
