import React, { Fragment } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'
import RingLoader from 'react-spinners/RingLoader'

import styles from './index.module.scss'

// json

const ProgressingModalWithContent = props => {
  const { open, close, title, tip, content } = props

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className={styles.container} onClose={close}>
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
              <Dialog.Panel className={styles.modalView}>
                <div className={styles.ringLoader}>
                  <RingLoader color="#63D6CD" />
                </div>
                <div className="w-full flex justify-center mt-[28px]">
                  <div className={styles.greenText}>Do not close this window</div>
                </div>
                <div className="w-full flex justify-center mt-[30px]">
                  <div className="w-full max-w-[388px]">
                    <div className={styles.whiteText}>{title}</div>
                  </div>
                </div>
                <div className="w-full flex justify-center mt-[30px]">
                  <div className={styles.darkBackground}>
                    {tip}:&nbsp;
                    <span>
                      <strong>{content}</strong>
                    </span>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ProgressingModalWithContent
