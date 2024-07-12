import { Fragment, useEffect, useState } from 'react'

// next components

// third party components
import { Dialog, Transition } from '@headlessui/react'

// componenets

// resources
import PloygonSmallMobileBG from 'assets/icons/polygon-bg-41x44.svg?component'
import DiamondEnableMobile from 'assets/icons/diamond-enable-mobile.svg?component'
import DiamondDisableMobile from 'assets/icons/diamond-disable-mobile.svg?component'
// styles
import styles from './index.module.scss'

const MerchBadgeModal = ({ open, onClose, data }) => {
  const closeModal = () => {
    onClose()
  }
  console.log(data.list, '==========data.list==========')
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
                  <div className="flex gap-[15px]">
                    <div className="relative w-[41px] h-[44px]">
                      <PloygonSmallMobileBG />
                      <div className="absolute inset-0 flex justify-center items-center">
                        {data.locked ? <DiamondDisableMobile /> : <DiamondEnableMobile />}
                      </div>
                    </div>
                    <div>
                      <div className={styles.title}>{data.title}</div>
                      <div className={styles.description}>Badge Criteria & Perks</div>
                    </div>
                  </div>
                  {data.locked ? (
                    <div className={styles.unlocked}>Locked</div>
                  ) : (
                    <div className={styles.locked}>Unlocked</div>
                  )}
                </div>
                <div className="relative w-full h-[238px] md:h-[300px] px-[25px]">
                  <div className="w-full">
                    {data.list.map((item, index) => (
                      <div key={index} className="w-full mt-[25px]">
                        <div className="w-full flex justify-between">
                          <div className={styles.text}>{item.label}</div>
                          <div className={styles.text}>
                            ({item.value}/{item.total})
                          </div>
                        </div>
                        <div className={`${styles.lineBG} mt-[15px]`}>
                          <div
                            className={
                              item.value === 0
                                ? 'w-[0px]'
                                : `w-[${(item.value * 100) / item.total}%] ${styles.progressBG}`
                            }
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.badgeBenefits}>Badge Benefits</div>
                  <div className={styles.badgeText}>{data.benefits}</div>

                  <div className={styles.bottom} onClick={onClose}>
                    Close
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

export default MerchBadgeModal
