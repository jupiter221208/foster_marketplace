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
    open === true && (
      <div className={styles.container}>
        <div className={styles.bgView} />

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className={styles.ringLoader}>
              <div className="w-[200px] lg:w-[350px] h-[200px] lg:h-[350px]">
                <Lottie animationData={LoadingIcon} loop={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  )
}

export default FullScreenLoadingModal
