import { Fragment, useEffect, useState } from 'react'

// components

// third party components
import { Dialog, Transition } from '@headlessui/react'

// resources
import CloseIcon from 'assets/icons/close-wallet.svg?component'

// styles
import styles from './index.module.scss'
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'

const MerchShopEditModal = ({ type, open, onClose }) => {
  const closeModal = () => {
    onClose()
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className={styles.container} onClose={closeModal}>
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

        <div className="fixed inset-0 w-full h-full">
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
              <div className={styles.mainView}>
                <div className={styles.topSection}>
                  <div className={styles.title}>
                    {type === 'delist'
                      ? 'Do you want to delist this item?'
                      : type === 'cancel'
                      ? 'Do you want to cancel this item?'
                      : type === 'remove'
                      ? 'Do you want to remove this item?'
                      : ''}
                  </div>
                  <div className="lg:block hidden" onClick={closeModal}>
                    <CloseIcon />
                  </div>
                </div>
                <div className="w-full px-[16px] lg:px-[33px] pt-[24px]">
                  <div className={styles.content}>
                    {type === 'delist'
                      ? 'If you choose to delist, it will remove the item from your merch store. You can republish it at a later time if you wish.'
                      : type === 'cancel'
                      ? 'If you choose to cancel, it will remove the item from your merch store. You can republish it at a later time if you wish.'
                      : type === 'remove'
                      ? 'This action is irreversible. If you choose to remove, it will remove the item from your merch store and dashboard.'
                      : ''}
                  </div>
                  <div className="w-full flex justify-end mt-[30px] lg:mt-[15px]">
                    <div className="flex gap-[20px]">
                      <OutlineButton
                        label="Cancel"
                        width={100}
                        height={40}
                        fontSize={16}
                        onClick={() => closeModal()}
                      />
                      <GradientButton
                        label="Yes, continue"
                        width={130}
                        height={40}
                        fontSize={16}
                        onClick={() => closeModal()}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

export default MerchShopEditModal
