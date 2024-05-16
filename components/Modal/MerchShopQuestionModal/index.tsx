import React, { Fragment } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// resources
import CloseIcon from 'assets/icons/close-wallet.svg?component'

// styles
import styles from './index.module.scss'
import OutlineButton from 'components/Button/OutlineButton'
import GradientButton from 'components/Button/GradientButton'

const MerchShopQuestionModal = props => {
  const { type, open, close, onContinue } = props

  const closeModal = () => {
    close('cancel')
  }

  const continueModal = () => {
    onContinue(type)
  }

  const getTitle = () => {
    if (type === 'technique_dtg' || type === 'technique_emb') return 'technique'
    else if (type === 'color_white' || type === 'color_black') return 'color'
    else return 'apparel item'
  }

  const getContent = () => {
    if (type === 'technique_dtg' || type === 'technique_emb')
      return 'If you change the technique now, your changes will be lost.'
    else if (type === 'color_white' || type === 'color_black')
      return 'If you change the color now, your changes will be lost.'
    else return 'If you change the apparel item now, your changes will be lost.'
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
                    Do you want to change the {getTitle()}?
                    <div className={styles.close} onClick={closeModal}>
                      <CloseIcon alt="" />
                    </div>
                  </div>
                  <div className="w-full px-[36px] pb-[36px]">
                    <div className={`${styles.content} mt-[24px]`}>{getContent()}</div>
                    <div className="flex justify-end mt-[25px] gap-[20px]">
                      <OutlineButton label="Cancel" width={100} height={40} fontSize={16} onClick={closeModal} />
                      <GradientButton
                        label="Yes, continue"
                        width={130}
                        height={40}
                        fontSize={16}
                        backgroundColor01="var(--main-icon-color)"
                        backgroundColor02="var(--main-icon-color)"
                        color="var(--background-main-color)"
                        onClick={continueModal}
                      />
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

export default MerchShopQuestionModal
