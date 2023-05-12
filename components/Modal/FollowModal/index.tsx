import React, { Fragment, useEffect, useState } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// custom components

// images
import CloseIcon from 'assets/icons/close-wallet.svg'
import DefaultAvatar from 'assets/images/dashboard-avatar.png'

// json
import TabList from 'assets/json/artist-profile/follow-tab-list.json'

// styles
import styles from './index.module.scss'

// apis
import artistsAPI from 'apis/artists'
import PositiveButton from 'components/Button/PositiveButton'
import NegativeButton from 'components/Button/NegativeButton'
import FollowTab from 'components/Tab/FollowTab'

const FollowModal = props => {
  const { open, close, ownWallet, type, wallet } = props
  const router = useRouter()

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

  const [followersList, setFollowersList] = useState([])
  const [followingList, setFollowingList] = useState([])

  useEffect(() => {
    if (open) {
      reloadFollowing()
    }
  }, [open])

  const reloadFollowing = () => {
    artistsAPI.getFollowers(wallet).then(response => {
      setFollowersList(response)
    })
    artistsAPI.getFollowings(wallet).then(response => {
      setFollowingList(response)
    })
  }

  const followArtist = wallet => {
    artistsAPI.followArtist(wallet).then(response => {
      if (response && response.followed_wallet_id) {
        let new_list = []
        if (activeTab === 0) {
          new_list = [...followersList]
          new_list.forEach(item => {
            if (item.wallet_id === wallet) item.following = true
          })
          setFollowersList(new_list)
        } else {
          new_list = [...followingList]
          new_list.forEach(item => {
            if (item.wallet_id === wallet) item.following = true
          })
          setFollowingList(new_list)
        }
      }
    })
  }

  const unfollowArtist = wallet => {
    artistsAPI.unfollowArtist(wallet).then(response => {
      let new_list = []
      if (activeTab === 0) {
        new_list = [...followersList]
        new_list.forEach(item => {
          if (item.wallet_id === wallet) item.follow = false
        })
        setFollowersList(new_list)
      } else {
        new_list = [...followingList]
        new_list.forEach(item => {
          if (item.wallet_id === wallet) item.following = false
        })
        setFollowingList(new_list)
      }
    })
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
                  <div className="w-full flex justify-start -ml-4">
                    <FollowTab tabList={tabList} lightMode={false} onChange={item => handleSelectedTab(item)} />
                  </div>
                  <div className="w-full h-full flex justify-between items-center mt-4 lg:mt-[30px] overflow-auto">
                    {activeTab === 0 && (
                      <div className="w-full flex flex-wrap max-h-[calc(100vh_-_200px_-_240px)] min-h-[calc(100vh_-_200px_-_240px)] h-full pr-2 lg:pr-4">
                        <div className="w-full">
                          {followersList.map((item, index) => (
                            <div className="w-full flex justify-between items-center h-[90px]" key={index}>
                              <div className="flex gap-3 lg:gap-[25px] items-center">
                                <div className={styles.avatarArea}>
                                  {item.profile_picture !== null && item.profile_picture.length > 0 ? (
                                    <img src={item.profile_picture} alt="" className="w-[50px] h-[50px] rounded-full" />
                                  ) : (
                                    <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                                      <Image src={DefaultAvatar} alt="" />
                                    </div>
                                  )}
                                </div>

                                <div
                                  className={styles.username}
                                  onClick={() => {
                                    router.push(`/${item.username}`)
                                    close()
                                  }}
                                >
                                  {item.username}
                                  {ownWallet === wallet && <div className={styles.text}>is following you</div>}
                                </div>
                              </div>
                              {ownWallet !== item.wallet_id && (
                                <div className="w-[90px] lg:w-[122px]">
                                  {item.following === false ? (
                                    <PositiveButton
                                      label="Follow"
                                      onClick={() => {
                                        followArtist(item.wallet_id)
                                      }}
                                    />
                                  ) : (
                                    <NegativeButton
                                      label="Following"
                                      onClick={() => {
                                        unfollowArtist(item.wallet_id)
                                      }}
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {activeTab === 1 && (
                      <div className="w-full flex flex-wrap max-h-[calc(100vh_-_200px_-_240px)] min-h-[calc(100vh_-_200px_-_240px)] h-full pr-2 lg:pr-4">
                        <div className="w-full">
                          {followingList.map((item, index) => (
                            <div className="w-full flex justify-between items-center h-[90px]" key={index}>
                              <div className="flex gap-3 lg:gap-[25px] items-center">
                                <div className={styles.avatarArea}>
                                  {item.profile_picture !== null && item.profile_picture.length > 0 ? (
                                    <img src={item.profile_picture} alt="" className="w-[50px] h-[50px] rounded-full" />
                                  ) : (
                                    <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                                      <Image src={DefaultAvatar} alt="" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex">
                                  <div
                                    className={styles.username}
                                    onClick={() => {
                                      router.push(`/${item.username}`)
                                      close()
                                    }}
                                  >
                                    {item.username}
                                  </div>
                                </div>
                              </div>
                              {ownWallet !== item.wallet_id && (
                                <div className="w-24 lg:w-[122px]">
                                  {item.following === false ? (
                                    <PositiveButton
                                      label="Follow"
                                      onClick={() => {
                                        followArtist(item.wallet_id)
                                      }}
                                    />
                                  ) : (
                                    <NegativeButton
                                      label="Following"
                                      onClick={() => {
                                        unfollowArtist(item.wallet_id)
                                      }}
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
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
