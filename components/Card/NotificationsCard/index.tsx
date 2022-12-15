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
import AvatarFollowIcon from 'assets/icons/avatar-follow.svg'

// styles
import styles from './index.module.scss'

// api endpoint
import artistsAPI from 'apis/artists'

const NotificationsCard = props => {
  const { data } = props
  const router = useRouter()
  const dispatch = useDispatch()
  const viewport = useViewport()

  const [list, setList] = useState<any[]>([])

  useEffect(() => {
    setList(data)
  }, [data])

  const followArtist = wallet => {
    artistsAPI.followArtist(wallet).then(response => {
      if (response && response.followed_wallet_id) {
      }
    })
  }

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
            array[index].data[idx].notification_type = status
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
        message = 'added your art to their favorites'
        break
      case 'save_collection':
        message = 'added your collection to their favorites'
        break
      case 'like':
        message = 'liked your art'
        break
      case 'offer':
        message = 'You received an offer from'
        break
      case 'bid':
        message = 'placed a bid in your auction'
        break
      case 'sale':
        message = 'Your NFT was purchased by'
        break
      case 'winner':
        message = 'is the winner of your auction'
        break
      case 'no_winner':
        message = 'Your auction ended without a winner'
        break
      case 'outbid':
        message = 'You were outbid on an auction'
        break
      case 'won':
        message =
          'You are the winner of ' +
          notification.reference_token_name +
          ', the seller has been notified to finalize the sale'
        break
      case 'purchase':
        message = 'has accepted your offer'
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

  const getTime = dateString => {
    let date = new Date(dateString)
    return date.getHours() + ':' + date.getMinutes()
  }

  const gotoUserPage = wallet => {
    router.push(`/artist-profile?id=${wallet}`)
  }

  const gotoDetailPage = notification => {
    const type = notification.notification_type
    switch (type) {
      case 'offer':
        dispatch({ type: 'set', isLoading: true })
        router.push(`/dashboard?tab=7`)
        break
      case 'bid':
      case 'save_nft':
      case 'save_collection':
      case 'like':
      case 'sale':
      case 'outbid':
      case 'purchase':
        dispatch({ type: 'set', isLoading: true })
        router.push(`/browse-nft?id=${notification.reference_token_id}`)
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

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {list.map((item: any, index) => (
          <div className="w-full pl-[15px]" key={index}>
            {item.date === 'NEW' ? (
              <div className="flex justify-between">
                <div className={styles.title}>{item.date}</div>
                <div className={styles.mark}>Mark as read</div>
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
                      <Image
                        src={
                          elem.reference_user_profile_picture !== null ? elem.reference_user_profile_picture : <div />
                        }
                        alt=""
                        width={56}
                        height={56}
                        className="rounded-full"
                      />
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
                      {elem.notification_type !== 'following' && (
                        <div className={styles.viewDetails} onClick={() => gotoDetailPage(elem)}>
                          {getViewDetail(elem)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    {elem.notification_type === 'follow' ? (
                      <GradientButton
                        label="Follow"
                        direction="rtl"
                        icon={AvatarFollowIcon}
                        onClick={() => handleClickButton(item.id, elem, 'following')}
                      />
                    ) : elem.notification_type === 'following' ? (
                      <OutlineButton label="Following" onClick={() => handleClickButton(item.id, elem, 'follow')} />
                    ) : (
                      isShowAvatar(elem) && (
                        <div>
                          <Image
                            src={elem.reference_asset_url !== null ? elem.reference_asset_url : DefaultAvatar}
                            alt=""
                            width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 39 : 50}
                            height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 39 : 50}
                            className="rounded-[8px] lg:rounded-[8px]"
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
