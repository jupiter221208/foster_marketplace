import React, { Fragment } from 'react'

// next components
import Image from 'next/image'

// third party components
import { Dialog, Transition } from '@headlessui/react'
import Lottie from 'lottie-react'

// custom functions
import { useViewport } from 'utils'

// images
import AlertErrorBlackRedIcon from 'assets/icons/alert-error-black-red.svg'
import SuccessIcon from 'assets/lottery/success.json'
import CloseIcon from 'assets/icons/close-black-icon.svg?component'
import CloseMobileIcon from 'assets/icons/close-black-mobile-icon.svg?component'

// styles
import styles from './index.module.scss'

const Alert = props => {
  const { open, close, data } = props

  const viewport = useViewport()

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className={styles.container} onClose={() => close()}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={styles.bgView}>
            <div className="absolute top-[59px] right-[30px] lg:top-[100px] lg:right-[100px]">
              <div className={styles.closeBG}>
                <div className="lg:w-[18px] lg:h-[18px] w-[15px] h-[15px] object-cover">
                  {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
                    <CloseMobileIcon alt="" />
                  ) : (
                    <CloseIcon alt="" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="grid grid-cols-12 h-full items-center justify-center p-12 gap-x-10 gap-y-[18px]">
            {data.map((item, index) => (
              <div className="col-span-12" key={index}>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full">
                    <div className="w-full mb-[100px]">
                      <div className="w-full flex justify-center">
                        {item.type === 'success' ? (
                          <Lottie animationData={SuccessIcon} loop={true} />
                        ) : (
                          <Image src={AlertErrorBlackRedIcon} alt="" />
                        )}
                      </div>
                      <div className="w-full flex justify-center mt-1 lg:mt-[15px]">
                        <div className={styles.title}>{item.title}</div>
                      </div>
                      <div className="w-full flex justify-center mt-1 lg:mt-[15px]">
                        <div className={styles.description}>
                          You've successfully listed NFT Name for a fixed-price of 5 SOL
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            ))}
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Alert
