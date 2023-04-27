import React, { Fragment } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'
import RingLoader from 'react-spinners/RingLoader'
import Lottie from 'lottie-react'
import LoadingIcon from 'assets/lottery/loader-new.json'

import styles from './index.module.scss'

// json

const FullScreenLoadingModal = props => {
  const { open } = props

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className={styles.container} onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={styles.bgView} />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel>
                <div className={styles.ringLoader}>
                  <div className="w-[200px] lg:w-[350px] h-[200px] lg:h-[350px]">
                    <Lottie animationData={LoadingIcon} loop={true} />
                  </div>

                  {/* <RingLoader color="#63D6CD" /> */}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default FullScreenLoadingModal
