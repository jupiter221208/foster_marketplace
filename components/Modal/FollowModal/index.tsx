import React, { Fragment, useEffect, useState } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// next components
import Image from 'next/image'

// custom components
import Tab from 'components/Tab'

// images
import CloseIcon from 'assets/icons/close-wallet.svg'

// json
import TabList from 'assets/json/artist-profile/follow-tab-list.json'

// styles
import styles from './index.module.scss'

const FollowModal = props => {
  const { open, close, type } = props

  const closeModal = () => {
    close()
  }

  const [activeTab, setActiveTab] = useState<any>(0)
  const [tabList, setTabList] = useState<any>(TabList)

  useEffect(() => {
    let array: any[] = []
    TabList.map(item => {
      let object: any = item
      if (item.id === type) {
        object.selected = true
      } else {
        object.selected = false
      }
      array.push(object)
    })
    setTabList(array)
    setActiveTab(type)
  }, [type])

  const handleSelectedTab = selectedItem => {
    let array: any[] = []
    TabList.map(item => {
      let object: any = item
      if (item.id === selectedItem.id) {
        object.selected = true
      } else {
        object.selected = false
      }
      array.push(object)
    })
    setTabList(array)
    setActiveTab(selectedItem.id)
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
                  <div className={styles.close} onClick={() => closeModal()}>
                    <Image src={CloseIcon} alt="" width={30} height={30} />
                  </div>
                  <div className="w-full flex justify-start">
                    <Tab tabList={tabList} onChange={item => handleSelectedTab(item)} />
                  </div>
                  <div className="w-full flex justify-between items-center mt-12">
                    {activeTab === 0 && 'aaaa'}
                    {activeTab === 1 && 'bbbb'}
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

export default FollowModal
