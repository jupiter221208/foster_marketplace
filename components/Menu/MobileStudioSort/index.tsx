import { Fragment, useState } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// styles
import styles from './index.module.scss'

const MobileStudioSort = props => {
  const { open, sort, onSort, onClose } = props
  const [selectedSort, setSelectedSort] = useState(sort)

  const handleSelectSort = index => {
    let array = [...selectedSort]
    array.map(item => {
      item.checked = false
    })
    array[index].checked = true
    setSelectedSort(array)
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className={styles.container}
        onClose={() => {
          onSort(selectedSort)
          onClose()
        }}
      >
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

                {selectedSort.map((item, index) => (
                  <div id={`check-label-${index}`} key={index} className="flex justify-between my-[8px]">
                    <label
                      className={`${styles.checkmark}`}
                      onClick={() => {
                        handleSelectSort(index)
                      }}
                    >
                      {item.name}
                    </label>
                    <input
                      className={`${styles.checkbox}`}
                      type="checkbox"
                      id={item.id}
                      checked={item.checked}
                      onChange={() => {
                        handleSelectSort(index)
                      }}
                    />
                  </div>
                ))}

                <div className="w-full flex justify-center gap-[50px]">
                  <div className={styles.cancel} onClick={onClose}>
                    Cancel
                  </div>

                  <div className={styles.cancel} onClick={() => onSort(selectedSort)}>
                    OK
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

export default MobileStudioSort
