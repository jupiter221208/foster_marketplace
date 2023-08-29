import React, { useEffect, useRef } from 'react'

// third party components
import { Transition } from '@headlessui/react'
import Lottie from 'lottie-react'
import PreLoaderIcon from 'assets/lottery/preloader.json'
import useOnScreen from 'components/UseOnScreen/useOnScreen'

// json

const LoadingComponent = props => {
  const { isFetching, setIsFetching } = props
  const ref = useRef<HTMLDivElement>(null)
  const isVisible = useOnScreen(ref)

  useEffect(() => {
    if (!isFetching && isVisible) {
      setIsFetching(true)
    }
  }, [isVisible])

  return (
    <div ref={ref} className="w-full flex justify-center">
      <div className="w-[500px] h-[40px]">
        <Lottie width={500} height={40} animationData={PreLoaderIcon} loop={true} />
      </div>
    </div>
  )
}

export default LoadingComponent
