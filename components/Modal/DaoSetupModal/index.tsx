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
import CloseIconMobile from 'assets/icons/close-wallet-mobile.svg'
import DaoLogoSmall from 'assets/icons/dao-logo-small.svg?component'
import DaoLogoSmallMobile from 'assets/icons/dao-logo-small-mobile.svg?component'

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
                      <Image src={CloseIconMobile} alt="" width={30} height={30} />
                    </div>
                    <div className="w-full h-[353px]">
                      <div className="w-full flex justify-center mt-[67px]">
                        <DaoLogoSmallMobile alt="" />
                      </div>
                      <div className={styles.text}>
                        Turkey Circus is a digital art collection representing the governance wing of Foster
                        Marketplace. Minting a Turkey grants ownership into the Circus DAO; a group of Web 3 creatives
                        shaping the evolution of Art on Solana.
                      </div>
                      <div className={styles.learnMore} onClick={() => router.push('https://mint.turkeycircus.io/ ')}>
                        Join CircusDAO
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
                          <DaoLogoSmall alt="" />
                        </div>
                        <div className={styles.text}>
                          Turkey Circus is a digital art collection representing the governance wing of Foster
                          Marketplace. Minting a Turkey grants ownership into the Circus DAO; a group of Web 3 creatives
                          shaping the evolution of Art on Solana.
                        </div>
                        <div className={styles.learnMore} onClick={() => router.push('https://mint.turkeycircus.io/ ')}>
                          Join CircusDAO
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
