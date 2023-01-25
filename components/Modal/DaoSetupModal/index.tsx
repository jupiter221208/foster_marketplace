import React, { Fragment, useEffect, useRef, useState } from 'react'

// third party components
import { useSelector, useDispatch } from 'react-redux'
import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'

// next components
import Image from 'next/image'

// components

// custom functions
import { useViewport } from 'utils'

// images
import LogoBigIcon from 'assets/logo-big.svg'
import CloseIcon from 'assets/icons/close-wallet.svg'
import TcDAOLogo from 'assets/images/TC_DAO_Logo.png'

// styles
import styles from './index.module.scss'

const DaoSetupModal = props => {
  const { open, close } = props
  const viewport = useViewport()
  const router = useRouter()

  return (
    <div>
      {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
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
                    <div className={styles.close} onClick={() => close()}>
                      <Image src={CloseIcon} alt="" width={30} height={30} />
                    </div>
                    <div className="w-full h-[353px]">
                      <div className="w-full flex justify-center mt-[67px]">
                        <div className="w-[294px] h-[83px]">
                          <Image src={TcDAOLogo} alt="" />
                        </div>
                      </div>
                      <div className={styles.text}>
                        Turkey Circus holders inherit a 5% revenue share of Foster House Collections and an autonomous
                        vote in the DAO governing Foster Protocol provisions.
                      </div>
                      <div className={styles.learnMore} onClick={() => router.push('https://mint.turkeycircus.io/ ')}>
                        Learn more
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      ) : (
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
                    <div className={styles.close} onClick={() => close()}>
                      <Image src={CloseIcon} alt="" width={30} height={30} />
                    </div>
                    <div className={styles.rightBack}>
                      <Image src={LogoBigIcon} alt="" width={566} height={657} />
                    </div>
                    <div className="w-full h-full grid grid-cols-12 z-10">
                      <div className={styles.leftPanel}>
                        <div className="w-full flex justify-center mt-[30px]">
                          <div className="w-[424px] h-[121px]">
                            <Image src={TcDAOLogo} alt="" />
                          </div>
                        </div>
                        <div className={styles.text}>
                          Turkey Circus holders inherit a 5% revenue share of Foster House Collections and an autonomous
                          vote in the DAO governing Foster Protocol provisions.
                        </div>
                        <div className={styles.learnMore} onClick={() => router.push('https://mint.turkeycircus.io/ ')}>
                          Learn more
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </div>
  )
}

export default DaoSetupModal
