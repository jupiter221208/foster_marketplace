import React, { Fragment, useEffect, useState } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// next components
import Image from 'next/image'
import Link from 'next/link'

// custom components
import Tab from 'components/Tab'
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'

// images
import CloseIcon from 'assets/icons/close-wallet.svg'
import AvatarFollowIcon from 'assets/icons/avatar-follow.svg'

// json
import TabList from 'assets/json/artist-profile/follow-tab-list.json'
import FollwersList from 'assets/json/artist-profile/followers-list.json'
import FollwingList from 'assets/json/artist-profile/following-list.json'

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

  const [followersList, setFollowersList] = useState(FollwersList)
  const [followingList, setFollowingList] = useState(FollwingList)

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
                  <div className="w-full flex justify-start -ml-4">
                    <Tab tabList={tabList} onChange={item => handleSelectedTab(item)} />
                  </div>
                  <div className="w-full h-full flex justify-between items-center mt-12 overflow-auto">
                    {activeTab === 0 && (
                      <div className="w-full flex flex-wrap gap-[38px] max-h-[calc(100vh_-_200px_-_170px)] h-full pr-4">
                        {followersList.map((item, index) => (
                          <div className="w-full flex justify-between items-center" key={index}>
                            <div className="flex gap-[25px] items-center">
                              <div className={styles.avatarArea}>
                                <img src={item.avatar} alt="" className="w-[50px] h-[50px] rounded-full" />
                              </div>
                              <div className="flex">
                                <Link href={item.url}>
                                  <a className={styles.username}>{item.username}</a>
                                </Link>
                                <div className={styles.text}>&nbsp;is following you</div>
                              </div>
                            </div>
                            <div className="w-[146px]">
                              {item.status === 0 ? (
                                <GradientButton
                                  label="Follow"
                                  icon={AvatarFollowIcon}
                                  onClick={() => {}}
                                  fullWidth
                                  direction="rtl"
                                />
                              ) : (
                                <OutlineButton label="Following" onClick={() => {}} fullWidth />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {activeTab === 1 && (
                      <div className="w-full flex flex-wrap gap-[38px] max-h-[calc(100vh_-_200px_-_170px)] h-full pr-4">
                        {followingList.map((item, index) => (
                          <div className="w-full flex justify-between items-center" key={index}>
                            <div className="flex gap-[25px] items-center">
                              <div className={styles.avatarArea}>
                                <img src={item.avatar} alt="" className="w-[50px] h-[50px] rounded-full" />
                              </div>
                              <div className="flex">
                                <Link href={item.url}>
                                  <a className={styles.username}>{item.username}</a>
                                </Link>
                                <div className={styles.text}>&nbsp;is following you</div>
                              </div>
                            </div>
                            <div className="w-[146px]">
                              {item.status === 0 ? (
                                <GradientButton
                                  label="Follow"
                                  icon={AvatarFollowIcon}
                                  onClick={() => {}}
                                  fullWidth
                                  direction="rtl"
                                />
                              ) : (
                                <OutlineButton label="Following" onClick={() => {}} fullWidth />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
