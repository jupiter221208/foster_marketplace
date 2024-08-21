import React, { useEffect, useRef } from 'react'

// third party components
import useOnScreen from 'components/UseOnScreen/useOnScreen'
// json

// styles
import LoadingElement from './LoadingElement'

const LoadingComponent = props => {
  const { isFetching, setIsFetching, text = '' } = props
  const ref = useRef<HTMLDivElement>(null)
  const isVisible = useOnScreen(ref)

  useEffect(() => {
    if (!isFetching && isVisible) {
      setIsFetching(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible])

  return (
    <div ref={ref} className="w-full flex justify-center">
      <LoadingElement text={text} />
    </div>
  )
}

export default LoadingComponent
