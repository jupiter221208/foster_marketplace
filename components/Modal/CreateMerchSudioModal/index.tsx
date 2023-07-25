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
          <div className="flex min-h-full items-center justify-center p-4">
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
                <div className="absolute top-2 right-2 lg:top-5 lg:right-5">
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
                </div>
                <div className="w-full mt-4 lg:mt-1">
                  <div className={styles.title}>CreateMerchSudioModal</div>
                </div>

                <div className="w-full mt-3 lg:mt-5">
                  <div className={styles.text}>
                    Creator Merch Studio allows creators to monetize physical offerings including apparel merchandise
                    and physical prints. If a user purchases a physical print of this artwork, creators will receive a
                    10% commission from the sale.
                    <br />
                    <br />
                    By clicking 'continue' you are providing consent to Foster Marketplace to enable e-commerce
                    purchases and fulfillment of this artwork.
                    <br />
                  </div>
                </div>
                <div className="w-full mt-5 mb-[22px]">
                  <div className={styles.greenLine} />
                </div>
                <div className="w-full flex justify-between gap-[48px]">
                  <OutlineButton
                    label={'Cancel'}
                    onClick={close}
                    height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '44px' : '53px'}
                    fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '14px' : '16px'}
                    fullWidth
                    borderWidth={2}
                  />
                  <GradientButton
                    label={'Continue'}
                    onClick={onContinue}
                    height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '44px' : '53px'}
                    fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? '14px' : '16px'}
                    fullWidth
                  />
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
