import React, { Fragment, useEffect, useState } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// next components
import { useRouter } from 'next/router'

// custom components
import Image from 'next/image'
import IconButton from 'components/Button/IconButton'
import PositiveButton from 'components/Button/PositiveButton'
import NegativeButton from 'components/Button/NegativeButton'
import DefaultAvatar from 'assets/images/dashboard-avatar.png'

// images
import ArrowLeftIcon from 'assets/icons/arrow-left-single.svg'

// json
import TabList from 'assets/json/artist-profile/follow-tab-list.json'

// styles
import styles from './index.module.scss'

// apis
import artistsAPI from 'apis/artists'
import FollowSearchBox from 'components/Input/FollowSearchBox'
import FollowTab from 'components/Tab/FollowTab'

const FollowModalMobile = props => {
  const { open, close, ownWallet, type, wallet, username } = props
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

  useEffect(() => {
    onSearch(searchKey)
  }, [activeTab])

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
  const [filterFollowersList, setFilterFollowersList] = useState([])
  const [filterFollowingList, setFilterFollowingList] = useState([])
  const [searchKey, setSearchKey] = useState('')

  useEffect(() => {
    if (open) {
      reloadFollowing()
    }
  }, [open])

  const reloadFollowing = () => {
    artistsAPI.getFollowers(wallet).then(response => {
      setFilterFollowersList(response)
      setFollowersList(response)
    })
    artistsAPI.getFollowings(wallet).then(response => {
      setFilterFollowingList(response)
      setFollowingList(response)
    })
  }

  const followArtist = wallet => {
    artistsAPI.followArtist(wallet).then(response => {
      if (response && response.followed_wallet_id) {
        reloadFollowing()
      }
    })
  }

  const unfollowArtist = wallet => {
    artistsAPI.unfollowArtist(wallet).then(response => {
      reloadFollowing()
    })
  }

  const onSearch = key => {
    setSearchKey(key)
    let filtered = []
    if (activeTab === 0) {
      if (key === '') {
        setFilterFollowersList(followersList)
      } else {
        followersList.forEach(item => {
          if (item.username?.toLowerCase().includes(key.toLowerCase())) {
            filtered.push(item)
          }
        })
        setFilterFollowersList(filtered)
      }
    } else {
      if (key === '') {
        setFilterFollowingList(followingList)
      } else {
        followingList.forEach(item => {
          if (item.username?.toLowerCase().includes(key.toLowerCase())) {
            filtered.push(item)
          }
        })
        setFilterFollowingList(filtered)
      }
    }
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

          <div className="fixed inset-0 w-full h-full">
            <div className="flex h-full items-center justify-center text-center">
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
                  <div className={styles.headerView}>
                    <IconButton
                      icon={ArrowLeftIcon}
                      backgroundColor="transparent"
                      width="30px"
                      height="30px"
                      onClick={() => closeModal()}
                    />
                    <div className={styles.title}>{username}</div>
                    <div className="w-[30px] h-[30px]">&nbsp;</div>
                  </div>
                  <div className="w-full flex justify-center mt-[10px]">
                    <FollowTab tabList={tabList} onChange={item => handleSelectedTab(item)} />
                  </div>

                  <div className={styles.searchBox}>
                    <FollowSearchBox value={searchKey} onChange={value => onSearch(value)} />
                  </div>

                  <div className="w-full h-[calc(100%-220px)] flex justify-between items-start mt-4 overflow-auto">
                    {activeTab === 0 && (
                      <div className="w-full flex flex-wrap gap-[16px] pr-2 lg:pr-4">
                        {filterFollowersList.map((item, index) => (
                          <div
                            className="w-full flex justify-between items-center h-[60px] ml-[30px] mr-[20px]"
                            key={index}
                          >
                            <div className="flex gap-3 items-center">
                              <div className={styles.avatarArea}>
                                {item.profile_picture !== null && item.profile_picture.length > 0 ? (
                                  <img src={item.profile_picture} alt="" className="w-[34px] h-[34px] rounded-full" />
                                ) : (
                                  <div className="w-[34px] h-[34px] rounded-full overflow-hidden">
                                    <Image src={DefaultAvatar} alt="" />
                                  </div>
                                )}
                              </div>

                              <div
                                className={styles.username}
                                onClick={() => {
                                  router.push(`/artist-profile?id=${item.wallet_id}`)
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
                    )}
                    {activeTab === 1 && (
                      <div className="w-full flex flex-wrap gap-[16px] pr-2 lg:pr-4">
                        {filterFollowingList.map((item, index) => (
                          <div
                            className="w-full flex justify-between items-center h-[60px] ml-[30px] mr-[20px]"
                            key={index}
                          >
                            <div className="flex gap-3 items-center">
                              <div className={styles.avatarArea}>
                                {item.profile_picture !== null && item.profile_picture.length > 0 ? (
                                  <img src={item.profile_picture} alt="" className="w-[34px] h-[34px] rounded-full" />
                                ) : (
                                  <div className="w-[34px] h-[34px] rounded-full overflow-hidden">
                                    <Image src={DefaultAvatar} alt="" />
                                  </div>
                                )}
                              </div>
                              <div className="flex">
                                <div
                                  className={styles.username}
                                  onClick={() => {
                                    router.push(`/artist-profile?id=${item.wallet_id}`)
                                    close()
                                  }}
                                >
                                  {item.username}
                                </div>
                              </div>
                            </div>
                            {ownWallet !== item.wallet_id && (
                              <div className="w-24 lg:w-[146px]">
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

export default FollowModalMobile
