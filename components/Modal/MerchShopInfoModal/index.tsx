import React, { Fragment } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// resources
import CloseIcon from 'assets/icons/close-wallet.svg?component'

// styles
import styles from './index.module.scss'

const MerchShopInfoModal = props => {
  const { open, close } = props

  const closeModal = () => {
    close('cancel')
  }

  return (
    <div>
      <Transition show={open} as={Fragment}>
        <Dialog as="div" className={styles.container} onClose={() => closeModal()}>
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
            <div className="flex min-h-full items-center justify-center text-center">
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
                  <div className={styles.titleSection}>
                    Product extras and costs
                    <div className={styles.close} onClick={closeModal}>
                      <CloseIcon alt="" />
                    </div>
                  </div>
                  <div className="w-full px-[36px] pb-[36px]">
                    <div className={`${styles.content} mt-[24px]`}>
                      The production price for each merch item depends on print technique and the placement options
                      selected.
                      <br />
                      Outlined below is a breakdown of placement costs based on the print technique selected.
                    </div>

                    <div className={`${styles.title} mt-[24px]`}>Embroidery</div>
                    <div className={`${styles.content} mt-[24px]`}>
                      Your design will be machine-embroidered on the product. Available embroidery options include [1]
                      Left or Center Chest [2] Right Sleeve/Wrist [3] Left Sleeve/Wrist. You can also add a DTG print to
                      the back side.
                    </div>
                    <div className={`${styles.subTitle} mt-[20px] flex justify-between`}>
                      <div>Left or Center Chest</div>
                      <div>Included in base price</div>
                    </div>
                    <div className={`${styles.subTitle} mt-[20px] flex justify-between`}>
                      <div>Back (DTG)</div>
                      <div className={styles.content}>$8.50</div>
                    </div>
                    <div className={`${styles.subTitle} mt-[20px] flex justify-between`}>
                      <div>Right Sleeve/Wrist</div>
                      <div className={styles.content}>$7.00</div>
                    </div>
                    <div className={`${styles.subTitle} mt-[20px] flex justify-between`}>
                      <div>Left Sleeve/Wrist</div>
                      <div className={styles.content}>$7.00</div>
                    </div>

                    <div className={`${styles.title} mt-[34px]`}>DTG printing</div>
                    <div className={`${styles.content} mt-[20px]`}>
                      Your design will be printed directly on the product with the DTG (direct-to-garment) technique
                      that yields bold and vibrant prints. Our base price includes one print, these are the extras you
                      can get.
                    </div>
                    <div className={`${styles.subTitle} mt-[20px] flex justify-between`}>
                      <div>Front or Back (first placement)</div>
                      <div>Included in base price</div>
                    </div>
                    <div className={`${styles.subTitle} mt-[20px] flex justify-between`}>
                      <div>Front or Back (second placement)</div>
                      <div className={styles.content}>$8.50</div>
                    </div>
                    <div className={`${styles.subTitle} mt-[20px] flex justify-between`}>
                      <div>Right Sleeve</div>
                      <div className={styles.content}>$7.00</div>
                    </div>
                    <div className={`${styles.subTitle} mt-[20px] flex justify-between`}>
                      <div>Left Sleeve</div>
                      <div className={styles.content}>$7.00</div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default MerchShopInfoModal
