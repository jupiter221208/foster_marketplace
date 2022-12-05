import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

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
    if (status === 'Follow') {
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

  const getNotificationType = notification => {
    if (notification.notification_type === 'Like') return ' liked '
    else if (notification.notification_type === 'Follow') return ' started following '
    else if (notification.notification_type === 'Following') return ' followed '
  }

  const getTime = dateString => {
    let date = new Date(dateString)
    return date.getHours() + ':' + date.getMinutes()
  }

  const gotoUserPage = wallet => {
    router.push(`/artist-profile?id=${wallet}`)
  }
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {list.map((item: any, index) => (
          <div className="w-full" key={index}>
            <div className={styles.title}>{item.date}</div>
            <div className="mt-[25px] w-full flex flex-wrap gap-7">
              {item.data.map((elem, idx) => (
                <div className="w-full flex justify-between items-center gap-4" key={idx}>
                  <div className="flex justify-start items-center">
                    <div className={styles.dot} />
                    <div className={styles.avatarArea}>
                      <Image
                        src={elem.reference_asset_url !== null ? elem.reference_asset_url : DefaultAvatar}
                        alt=""
                        width={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 39 : 50}
                        height={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 39 : 50}
                        className="rounded-full"
                      />
                    </div>
                    <div className="block items-start">
                      <p>
                        <span className={styles.username} onClick={() => gotoUserPage(elem.reference_wallet_id)}>
                          {elem.reference_username}
                        </span>
                        <span className={styles.type}>{getNotificationType(elem)}</span>
                        <span className={styles.description}>{elem.reference_token_name}</span>
                        <span className={styles.hour}>&nbsp;{getTime(elem.created_at)}</span>
                      </p>
                      {elem.notification_type === 'Offer' && <div className={styles.viewDetails}>View Details</div>}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    {elem.notification_type === 'Follow' ? (
                      <GradientButton
                        label="Follow"
                        direction="rtl"
                        icon={AvatarFollowIcon}
                        onClick={() => handleClickButton(item.id, elem, 'Following')}
                      />
                    ) : elem.notification_type === 'Following' ? (
                      <OutlineButton label="Following" onClick={() => handleClickButton(item.id, elem, 'Follow')} />
                    ) : (
                      <div className="min-w-[56px]">
                        <Image
                          src={
                            elem.reference_user_profile_picture !== null ? elem.reference_user_profile_picture : <div />
                          }
                          alt=""
                          width={56}
                          height={56}
                          className="rounded-[15px]"
                        />
                      </div>
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
