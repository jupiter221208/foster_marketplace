import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'

// next components
import Image from 'next/image'

// custom functions
import { useViewport } from 'utils'

// components
import GradientButton from 'components/Button/GradientButton'
import OutlineButton from 'components/Button/OutlineButton'

// image
import DefaultAvatar from 'assets/images/dashboard-avatar.png'

// styles
import styles from './index.module.scss'

// api endpoint
import artistsAPI from 'apis/artists'

const NotificationsCard = props => {
  const { data, onClickMarkAsRead } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const viewport = useViewport()

  const [list, setList] = useState<any[]>([])

  useEffect(() => {
    setList(data)
  }, [data])

  const handleClickButton = (itemID, notification, status) => {
    if (status === 'follow') {
      artistsAPI.followArtist(notification.reference_wallet_id).then(response => {
        if (response && response.followed_wallet_id) {
          updateList(itemID, notification.id, status)
        }
      })
    } else {
      artistsAPI.unfollowArtist(notification.reference_wallet_id).then(response => {
        updateList(itemID, notification.id, status)
      })
    }
  }

  const updateList = (itemID, elemID, status) => {
    const array = [...list]

    array.map((item: any, index) => {
      if (item.id === itemID) {
        item.data.map((elem, idx) => {
          if (elem.id === elemID) {
            array[index].data[idx].followed = status === 'follow'
          }
        })
      }
    })
    setList(array)
  }

  const getViewDetail = notification => {
    const type = notification.notification_type
    let detail = ''
    switch (type) {
      case 'offer':
        detail = 'View Offer'
        break
      case 'bid':
      case 'save_nft':
      case 'save_collection':
      case 'like':
      case 'sale':
      case 'outbid':
      case 'purchase':
        detail = notification.reference_token_name
        break
      case 'winner':
        detail = 'Finalize Sale'
        break
      case 'no_winner':
        detail = 'Cancel Auction'
        break
    }

    return detail
  }

  const getNotificationType = notification => {
    const type = notification.notification_type
    let message = ''
    switch (type) {
      case 'follow':
        message = 'started following you'
        break
      case 'following':
        message = 'started following you'
        break
      case 'save_nft':
        message = 'added your art to their favorites.'
        break
      case 'save_collection':
        message = 'added your collection to their favorites.'
        break
      case 'like':
        message = 'liked your art'
        break
      case 'offer':
        message = 'You received an offer from'
        break
      case 'bid':
        message = 'placed a bid in your auction.'
        break
      case 'sale':
        message = 'Your NFT was purchased by'
        break
      case 'winner':
        message = 'is the winner of your auction.'
        break
      case 'no_winner':
        message = 'Your auction ended without a winner.'
        break
      case 'outbid':
        message = 'You were outbid on an auction.'
        break
      case 'won':
        message =
          "You're the auction winner for " + notification.reference_token_name + '. The seller has finalized the sale.'
        break
      case 'purchase':
        message = 'has accepted your offer.'
        break
    }

    return message
  }

  const fromUser = notification => {
    const type = notification.notification_type
    let rtnValue = false
    switch (type) {
      case 'follow':
      case 'following':
      case 'save_nft':
      case 'save_collection':
      case 'like':
      case 'bid':
      case 'winner':
      case 'purchase':
        rtnValue = true
        break
    }
    return rtnValue
  }

  const fromEndUser = notification => {
    const type = notification.notification_type
    let rtnValue = false
    switch (type) {
      case 'offer':
      case 'sale':
        rtnValue = true
        break
    }
    return rtnValue
  }

  const isShowAvatar = notification => {
    const type = notification.notification_type
    let show = false
    switch (type) {
      case 'offer':
      case 'bid':
      case 'save_nft':
      case 'save_collection':
      case 'like':
      case 'purchase':
      case 'winner':
      case 'sale':
        show = true
        break
    }
    return show
  }

  const gotoUserPage = wallet => {
    router.push(`/artist-profile?id=${wallet}`)
  }

  const gotoDetailPage = notification => {
    const type = notification.notification_type
    switch (type) {
      case 'offer':
        dispatch({ type: 'set', isLoading: true })
        router.push(`/dashboard?tab=6`)
        break
      case 'bid':
      case 'save_nft':
      case 'like':
      case 'sale':
      case 'outbid':
      case 'purchase':
        dispatch({ type: 'set', isLoading: true })
        router.push(`/browse-nft?id=${notification.reference_token_id}`)
        break
      case 'save_collection':
        dispatch({ type: 'set', isLoading: true })
        router.push(`/browse-collection/${notification.reference_token_id}`)
        break
      case 'winner':
        dispatch({ type: 'set', isLoading: true })
        router.push(`/dashboard?tab=1&filter=1`)
        break
      case 'no_winner':
        dispatch({ type: 'set', isLoading: true })
        router.push(`/dashboard?tab=1&filter=1`)
        break
    }
  }

  function getUserProfileImage(elem) {
    if (
      elem.notification_type === 'won' ||
      elem.notification_type === 'no_winner' ||
      elem.notification_type === 'outbid'
    )
      return elem.reference_asset_url

    if (elem.reference_user_profile_picture !== null && elem.reference_user_profile_picture !== '')
      return elem.reference_user_profile_picture
    else return DefaultAvatar.src
  }

  function gotoNFTPage(elem) {
    router.push(`/browse-nft?id=${elem.reference_token_id}`)
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {list.map((item: any, index) => (
          <div className="w-full lg:pl-[15px]" key={index}>
            {item.date === 'NEW' ? (
              <div className="flex justify-between">
                <div className={styles.title}>{item.date}</div>
                <div className={styles.mark} onClick={() => onClickMarkAsRead()}>
                  Mark as read
                </div>
              </div>
            ) : (
              <div className={styles.title}>{item.date}</div>
            )}

            <div className="mt-[25px] w-full flex flex-wrap gap-7">
              {item.data.map((elem, idx) => (
                <div className="w-full flex justify-between items-center gap-4" key={idx}>
                  <div className="flex justify-start items-center">
                    {elem.acknowledged === true ? <div className={styles.read} /> : <div className={styles.dot} />}
                    <div className={styles.avatarArea}>
                      <img src={getUserProfileImage(elem)} alt="" className="w-full h-full rounded-full object-cover" />
                    </div>

                    <div className="block items-start">
                      <p className="max-w-[450px]">
                        {fromUser(elem) && (
                          <span className={styles.username} onClick={() => gotoUserPage(elem.reference_wallet_id)}>
                            {elem.reference_username}&nbsp;
                          </span>
                        )}

                        <span className={styles.type}>{getNotificationType(elem)}</span>

                        {fromEndUser(elem) && (
                          <span className={styles.username} onClick={() => gotoUserPage(elem.reference_wallet_id)}>
                            &nbsp;{elem.reference_username}
                          </span>
                        )}
                      </p>
                      {/* {elem.notification_type !== 'following' && (
                        <div className={styles.viewDetails} onClick={() => gotoDetailPage(elem)}>
                          {getViewDetail(elem)}
                        </div>
                      )} */}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    {elem.notification_type === 'follow' && elem.followed === false ? (
                      <GradientButton
                        label="Follow"
                        width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 89 : 122}
                        height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 32 : 52}
                        gradientDirection="bottom"
                        fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 12 : 18}
                        borderRadius={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 6 : 12}
                        onClick={() => handleClickButton(item.id, elem, 'follow')}
                      />
                    ) : elem.notification_type === 'follow' && elem.followed === true ? (
                      <OutlineButton
                        label="Following"
                        width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 89 : 122}
                        height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 32 : 52}
                        fontSize={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 12 : 18}
                        // color="#95DBD5"
                        borderRadius={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 6 : 12}
                        onClick={() => handleClickButton(item.id, elem, 'following')}
                      />
                    ) : (
                      isShowAvatar(elem) && (
                        <div className={styles.assetUrl} onClick={() => gotoNFTPage(elem)}>
                          <img
                            src={
                              elem.reference_asset_url !== null && elem.reference_asset_url !== ''
                                ? elem.reference_asset_url
                                : DefaultAvatar
                            }
                            alt=""
                            width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 39 : 50}
                            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 39 : 50}
                            className="rounded-[8px] lg:rounded-[8px] object-cover"
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationsCard
