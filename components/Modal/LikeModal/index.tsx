import React, { Fragment, useEffect, useState } from 'react'

// third party components
import { Dialog, Transition } from '@headlessui/react'

// next components
import Image from 'next/image'
import { useRouter } from 'next/router'

// custom components
import PositiveButton from 'components/Button/PositiveButton'
import NegativeButton from 'components/Button/NegativeButton'

// images
import CloseIcon from 'assets/icons/close-wallet.svg'
import DefaultAvatar from 'assets/images/dashboard-avatar.png'

// styles
import styles from './index.module.scss'

// apis
import nftsAPI from 'apis/nfts'
import artistsAPI from 'apis/artists'
import { getFirstUpperString } from 'utils/helpers'

const LikeModal = props => {
  const { open, close, ownWallet, type, wallet } = props
  const router = useRouter()

  const closeModal = () => {
    close()
  }

  const [list, setList] = useState([])

  useEffect(() => {
    if (open && wallet) {
      reloadFollowing()
    }
  }, [open, wallet])

  const reloadFollowing = () => {
    if (type === 'liked') {
      console.log(wallet)

      nftsAPI.getNftLikes(wallet).then(response => {
        if (typeof response !== 'string') setList(response)
      })
    } else {
      nftsAPI.getNftSaved(wallet).then(response => {
        if (typeof response !== 'string') setList(response)
      })
    }
  }

  const followArtist = wallet => {
    artistsAPI.followArtist(wallet).then(response => {
      if (response && response.followed_wallet_id) {
        let new_list = []
        new_list = [...list]
        new_list.forEach(item => {
          if (item.wallet_id === wallet) item.following = true
        })
        setList(new_list)
      }
    })
  }

  const unfollowArtist = wallet => {
    artistsAPI.unfollowArtist(wallet).then(response => {
      let new_list = []
      new_list = [...list]
      new_list.forEach(item => {
        if (item.wallet_id === wallet) item.following = false
      })
      setList(new_list)
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
                  <div className="w-full flex justify-start ml-4">
                    <div className={styles.title}>{getFirstUpperString(type)}</div>
                  </div>
                  <div className="w-full h-full flex justify-between items-center mt-4 lg:mt-[30px] overflow-auto">
                    <div className="w-full flex flex-wrap max-h-[calc(100vh_-_200px_-_240px)] min-h-[calc(100vh_-_200px_-_240px)] h-full pr-2 lg:pr-4">
                      <div className="w-full">
                        {list.map((item, index) => (
                          <div className="w-full flex justify-between items-center h-[90px]" key={index}>
                            <div className="flex gap-3 lg:gap-[25px] items-center">
                              <div className={styles.avatarArea}>
                                {item.pfp_url !== null && item.pfp_url.length > 0 ? (
                                  <img src={item.pfp_url} alt="" className="w-[50px] h-[50px] rounded-full" />
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
                                {/* {ownWallet === wallet && <div className={styles.text}>is following you</div>} */}
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

export default LikeModal
