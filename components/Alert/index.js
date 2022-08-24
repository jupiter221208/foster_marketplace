import React, { Fragment } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// components
import IconButton from 'components/Button/IconButton'

// images
import CloseGreenIcon from 'assets/icons/close-green.svg'
import CloseBlackRedIcon from 'assets/icons/close-black-red.svg'
import CloseWhiteIcon from 'assets/icons/close-white.svg'

// styles
import styles from './index.module.scss'

const Alert = props => {
  const { viewport, open, close, type, title, description } = props

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
          <div className="flex min-h-full items-start justify-center p-4 pt-[133px]">
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
                <div className={styles.title}>
                  {title}
                  <IconButton
                    icon={type === 'success' ? CloseGreenIcon : type === 'error' ? CloseBlackRedIcon : CloseWhiteIcon}
                    backgroundColor="transparent"
                    borderColor="transparent"
                    onClick={() => close()}
                    width="30px"
                    height="30px"
                    borderRadius="30px"
                  />
                </div>

                <div className={styles.description}>{description}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Alert
