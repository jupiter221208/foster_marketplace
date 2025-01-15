import { Fragment, useState } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// styles
import styles from './index.module.scss'

import SizeList from 'assets/json/print/size-chat-modal.json'
import SizeTitleList from 'assets/json/print/size-title.json'

const SizeChartModal = props => {
  const { open, onClose, title, label } = props

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
                <div className={styles.title}>{label} Size Chart</div>
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
                        fill="rgba(var(--main-bg-color-rgb), 0.05)"
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
                <div className="w-full flex flex-col justity-center items-center">
                  <div className={styles.tableView}>
                    <div className="min-w-full">
                      <div className="overflow-hidden">
                        <table className="min-w-full text-center text-sm font-light">
                          <thead>
                            <tr className={styles.header}>
                              {SizeTitleList.map((item, index) => {
                                if (title === item.title)
                                  return item.fields.map((itemfield, index) => {
                                    return (
                                      <th key={index} className="py-3">
                                        {itemfield}
                                      </th>
                                    )
                                  })
                              })}
                            </tr>
                          </thead>
                          <tbody>
                            {SizeList.map((item, index) => {
                              if (title === item.type) {
                                return item.size.map((sizeItem, index) => {
                                  switch (title) {
                                    case 'Short Sleeve':
                                      return (
                                        <tr key={index} className={`${sizeItem.id % 2 === 1 ? styles.itemColor : ''}`}>
                                          <th className={`${styles.text} px-6 py-3`}>{sizeItem.Size}</th>
                                          <th className={`${styles.text} px-6 py-3`}>{sizeItem.Length}</th>
                                          <th className={`${styles.text} px-6 py-3`}>{sizeItem.Width}</th>
                                          <th className={`${styles.text} px-6 py-3`}>{sizeItem.Sleeves}</th>
                                        </tr>
                                      )

                                    case 'Sweatshirt':
                                      return (
                                        <tr
                                          key={index}
                                          className={`${sizeItem.id % 2 === 1 ? styles.itemColor : ''} ${styles.text}`}
                                        >
                                          <th className={`${styles.text} px-6 py-4`}>{sizeItem.Size}</th>
                                          <th className={`${styles.text} px-6 py-4`}>{sizeItem.Length}</th>
                                          <th className={`${styles.text} px-6 py-4`}>{sizeItem.Width}</th>
                                          <th className={`${styles.text} px-6 py-4`}>{sizeItem.Sleeves}</th>
                                        </tr>
                                      )

                                    case 'Hoodie':
                                      return (
                                        <tr
                                          key={index}
                                          className={`${sizeItem.id % 2 === 1 ? styles.itemColor : ''} ${styles.text}`}
                                        >
                                          <th className={`${styles.text} px-6 py-4`}>{sizeItem.Size}</th>
                                          <th className={`${styles.text} px-6 py-4`}>{sizeItem.Length}</th>
                                          <th className={`${styles.text} px-6 py-4`}>{sizeItem.Width}</th>
                                          <th className={`${styles.text} px-6 py-4`}>{sizeItem.Sleeves}</th>
                                        </tr>
                                      )

                                    case "Women's Short Sleeve":
                                      return (
                                        <tr
                                          key={index}
                                          className={`${sizeItem.id % 2 === 1 ? styles.itemColor : ''} ${styles.text}`}
                                        >
                                          <th className={`${styles.text} px-6 py-4`}>{sizeItem.Size}</th>
                                          <th className={`${styles.text} px-6 py-4`}>{sizeItem.Length}</th>
                                          <th className={`${styles.text} px-6 py-4`}>{sizeItem.Width}</th>
                                          <th className={`${styles.text} px-6 py-4`}>{sizeItem.Sleeves}</th>
                                        </tr>
                                      )

                                    case 'Long Sleeve':
                                      return (
                                        <tr
                                          key={index}
                                          className={`${sizeItem.id % 2 === 1 ? styles.itemColor : ''} ${styles.text}`}
                                        >
                                          <th className={`${styles.text} px-6 py-4`}>{sizeItem.Size}</th>
                                          <th className={`${styles.text} px-6 py-4`}>{sizeItem.Length}</th>
                                          <th className={`${styles.text} px-6 py-4`}>{sizeItem.Width}</th>
                                          <th className={`${styles.text} px-6 py-4`}>{sizeItem.Sleeves}</th>
                                        </tr>
                                      )

                                    case 'Sweatpant':
                                      return (
                                        <tr
                                          key={index}
                                          className={`${sizeItem.id % 2 === 1 ? styles.itemColor : ''} ${styles.text}`}
                                        >
                                          <th className={`${styles.text} px-6 py-4`}>{sizeItem.Size}</th>
                                          <th className={`${styles.text} px-6 py-4`}>{sizeItem.Length}</th>
                                          <th className={`${styles.text} px-6 py-4`}>{sizeItem.Width}</th>
                                        </tr>
                                      )
                                  }
                                })
                              }
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
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

export default SizeChartModal
