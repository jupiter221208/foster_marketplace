import { Fragment } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// resources

// styles
import styles from './index.module.scss'

// call apis
import GradientButton from 'components/Button/GradientButton'
import MerchNftItem from 'components/Card/MerchNftItem'

const StudioNftModal = props => {
  const { open, close, item, type, action } = props

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className={styles.container} onClose={close}>
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

        <div className="fixed inset-0 lg:flex lg:justify-center lg:items-center">
          <div className={styles.modalView}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full h-full">
                <div className={styles.button}>
                  <div className="flex items-center gap-x-4">
                    <div className="w-[25px] h-[25px] rounded-[4px] overflow-hidden">
                      <MerchNftItem width={54} height={54} url={item.asset_url} />
                    </div>
                    <div className="ml-[11px]">
                      <div className={styles.title}>{item.nft_name}</div>
                    </div>
                  </div>
                </div>
                <div className={styles.panel}>
                  <GradientButton
                    fullWidth
                    label={type ? 'Disable' : 'Enable'}
                    height={43}
                    onClick={() => {
                      action(item.token_id)
                      close()
                    }}
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

export default StudioNftModal
