import { Fragment, useState, useEffect } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// styles
import styles from './index.module.scss'

// solana
import RadioMobile from 'components/RadioMobile'

const SortMobileModal = props => {
  const { open, data, sort, onSort, onClose } = props
  const [selectedSort, setSelectedSort] = useState(sort)

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className={styles.container} onClose={onClose}>
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

        <div className="fixed inset-0">
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
                <div className={styles.title}>Sort By</div>

                <RadioMobile
                  data={data}
                  selected={selectedSort}
                  onChange={item => {
                    setSelectedSort(item)
                    setTimeout(() => {
                      onSort({
                        sort: item,
                      })
                    }, 500)
                  }}
                  direction="rtl"
                />

                <div className="w-full flex justify-center">
                  <div className={styles.cancel} onClick={onClose}>
                    Cancel
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

export default SortMobileModal
