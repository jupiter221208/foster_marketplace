import { Fragment, useState } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// custom components
import GradientButton from 'components/Button/GradientButton'

// styles
import styles from './index.module.scss'

const ImportEAModal = props => {
  const { open, onClose, onImportUrl } = props

  const closeModal = () => {
    onClose()
  }

  const [url, setUrl] = useState('')

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
                <div className={styles.close} onClick={closeModal}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
                    <g id="Group_51239" data-name="Group 51239" transform="translate(-1164 -333)">
                      <rect
                        id="Rectangle_20877"
                        data-name="Rectangle 20877"
                        width="30"
                        height="30"
                        rx="15"
                        transform="translate(1164 333)"
                        fill="var(--modal-close-btn-bg)"
                      />
                      <path
                        id="times-7"
                        d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,1,0,1.42,1.42L12,13.41l4.29,4.3a1,1,0,1,0,1.42-1.42Z"
                        transform="translate(1167 335.999)"
                        fill="var(--text-gray-200-color)"
                      />
                    </g>
                  </svg>
                </div>
                <div className={styles.title}>Import EA Series</div>

                <div className={`${styles.url} mt-4 w-full`}>Enter the URL to your series on Exchange Art</div>

                <input
                  className={styles.inputArea}
                  value={url}
                  placeholder={'https://exchange.art/series/'}
                  onChange={event => setUrl(event.target.value)}
                />

                <div className="w-full mt-[20px] lg:mt-[15px]">
                  <GradientButton
                    label="Import"
                    fullWidth
                    onClick={() => onImportUrl(url)}
                    backgroundColor="transparent"
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

export default ImportEAModal
