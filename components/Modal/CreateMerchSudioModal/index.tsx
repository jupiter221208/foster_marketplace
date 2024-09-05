import React, { Fragment } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

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
                <div className="w-full mt-4 lg:mt-0">
                  <div className={styles.title}>Foster Studio</div>
                </div>

                <div className="w-full mt-3 lg:mt-3">
                  <div className={styles.text}>
                    Studio 1.0 allows creators to monetize their NFTs through apparel, earning a $5 commission per sale.
                    To set your own commission rate on merch items, use Studio 2.0.
                    <br />
                    <br />
                    By clicking <span className={styles.textBold}>continue</span>, you authorize Foster Marketplace to
                    produce and fulfill merch orders for this artwork.
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
                      backgroundColor01="var(--main-icon-color)"
                      backgroundColor02="var(--main-icon-color)"
                      color="var(--background-main-color)"
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
