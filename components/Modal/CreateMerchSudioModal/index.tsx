import React, { Fragment, useEffect, useState } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// custom components
import IconButton from 'components/Button/IconButton'

// images and icons
import CloseWhiteIcon from 'assets/icons/close-white.svg'

// styles
import styles from './index.module.scss'
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'
import { useViewport } from 'utils'

const CreateMerchSudioModal = props => {
  const { open, close, onContinue } = props
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
          <div className={styles.bgView} />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center px-4 py-0">
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
                {/* <div className="absolute top-2 right-2 lg:top-4 lg:right-4">
                  <IconButton
                    icon={CloseWhiteIcon}
                    onClick={() => close()}
                    backgroundColor="#585B5D"
                    width="30px"
                    height="30px"
                    borderRadius="15px"
                    iconWidth={12}
                    iconHeight={!2}
                  />
                </div> */}
                <div className="w-full mt-4 lg:mt-0">
                  <div className={styles.title}>Foster Studio</div>
                </div>

                <div className="w-full mt-3 lg:mt-3">
                  <div className={styles.text}>
                    Foster Studio allows creators to monetize physical offerings including apparel and wall art. If a
                    user purchases a physical offering of this artwork, the creator receives a 20% commission for wall
                    art purchases and a $5.00 commission on apparel purchases.
                    <br />
                    <br />
                    By clicking &apos;continue&apos; you are providing consent to Foster Marketplace to enable
                    e-commerce purchases and fulfillment of this artwork.
                    <br />
                  </div>
                </div>
                <div className="w-full mt-5 mb-[22px]">
                  <div className={styles.greenLine} />
                </div>
                <div className="w-full flex justify-end">
                  <div className="flex gap-[20px]">
                    <OutlineButton
                      label={'Cancel'}
                      onClick={close}
                      height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '44px' : '48px'}
                      fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '14px' : '16px'}
                      width={120}
                      borderWidth={2}
                    />
                    <GradientButton
                      label={'Continue'}
                      onClick={onContinue}
                      width={120}
                      height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '44px' : '48px'}
                      fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '14px' : '16px'}
                    />
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

export default CreateMerchSudioModal
