import React, { Fragment } from 'react'

// third party components
import { Transition } from '@headlessui/react'
import Lottie from 'lottie-react'
import PreLoaderIcon from 'assets/lottery/preloader.json'

// json

const LoadingModal = props => {
  const { open } = props

  return (
    <Transition appear show={open} as={Fragment}>
      <div className="w-full flex justify-center items-center">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="w-[500px] h-[40px]">
            <Lottie width={500} height={40} animationData={PreLoaderIcon} loop={true} />
          </div>
        </Transition.Child>
      </div>
    </Transition>
  )
}

export default LoadingModal
