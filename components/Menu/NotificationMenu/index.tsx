import React, { MutableRefObject, useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useViewport } from 'utils'
import { useAuthentication } from 'hooks/useAuthentication'
import { compareDate, getDateLabel } from 'utils/helpers'

import * as moment from 'moment'

// third party components
import { Menu as HMenu } from '@headlessui/react'

// Icons
import NotificationIcon from 'assets/icons/notification-icon-navbar.svg?component'

// styles
import styles from './index.module.scss'
import { useRouter } from 'next/router'

// apis
import userAPI from 'apis/user'
import artistsAPI from 'apis/artists'
import LoadingModal from 'components/Modal/LoadingModal'
import NotificationsCard from 'components/Card/NotificationsCard'

const NotificationMenu = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const menuRef = useRef<HTMLElement | null>(null)
  const itemRef = useRef<HTMLElement | null>(null)
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false)
  const [filterList, setFilterList] = useState<any[]>([])
  const [selectedTab, setSelectedTab] = useState(0)
  const [allNotification, setAllNotification] = useState<any[]>([])
  const [filterNotification, setFilterNotification] = useState<any[]>([])
  const [searchedNotification, setSearchedNotification] = useState<any[]>([])
  const [searchWord, setSearchWord] = useState('')
  const [loading, setLoading] = useState(true)
  const viewport = useViewport()
  const { profileInfo } = useAuthentication()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false) // Initially menu is hidden

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen) // Toggle the current boolean value
  }

  const handleClickOutside = event => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      itemRef.current &&
      !itemRef.current.contains(event.target)
    ) {
      setIsMenuOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  useEffect(() => {
    if (profileInfo === null || profileInfo === undefined) return

    userAPI.getNotifications().then(
      response => {
        setTimeout(() => {
          setLoading(false)
        }, 1000)
        if (response !== null) {
          if (response.notifications.length > 0) {
            getNotifications([...response.notifications])
          }
        }
      },
      error => {
        setLoading(false)
        console.log(error)
      }
    )
  }, [profileInfo])

  function getSortedNotification(notifications) {
    let today = new Date().getTime()
    let today0 = new Date().setHours(0, 0, 0, 0)
    let yestarday = today0 - 3600 * 24 * 1000
    let weekEnd = today0 - 3600 * 48 * 1000
    let weekStart = today0 - 3600 * 168 * 1000
    let monthStart = today0 - 3600 * 24 * 30 * 1000

    let sortedByDate = {}
    let newNotifications = []
    notifications.map(notification => {
      if (notification.acknowledged === false) {
        newNotifications.push(notification)
      } else {
        var utcDate = moment.utc(notification.created_at)
        var fmt = 'MM/DD/YYYY'
        const localDate = utcDate.local().format(fmt)
        const localDateTime = localDate + ' 00:00:00'
        const createdDate = new Date(localDateTime).getTime()
        const strCreatedDate = createdDate.toString()
        if (!sortedByDate.hasOwnProperty(strCreatedDate)) {
          sortedByDate[strCreatedDate] = []
        }
        sortedByDate[strCreatedDate].push(notification)
      }
    })
    let sortedNotification = []
    if (newNotifications.length > 0) sortedNotification.push({ id: 0, date: 'NEW', data: newNotifications })
    const ONE_MONTH_AGO = '1 MONTH AGO'
    let index = 1
    Object.keys(sortedByDate)
      .sort()
      .reverse()
      .forEach(function (key) {
        let createDate = new Date(parseInt(key))
        let strDate = getDateLabel(createDate)
        if (parseInt(key) === today) {
          strDate = 'TODAY'
        } else if (parseInt(key) <= today && parseInt(key) >= yestarday) {
          strDate = 'YESTERDAY'
        } else if (parseInt(key) <= yestarday && parseInt(key) >= weekStart) {
          strDate = 'THIS WEEK'
        } else if (parseInt(key) <= weekStart && parseInt(key) >= monthStart) {
          strDate = 'THIS MONTH'
        } else {
          strDate = ONE_MONTH_AGO
        }

        let existingNotification = sortedNotification.filter(notification => notification.date === strDate)
        if (existingNotification.length > 0) {
          existingNotification[0]['data'].push(...sortedByDate[key].reverse())
        } else {
          let dayNotifications = { id: index, date: strDate, data: sortedByDate[key].reverse() }
          sortedNotification.push(dayNotifications)
        }
        index++
      })

    return sortedNotification.filter(notification => notification.date !== ONE_MONTH_AGO)
  }

  async function getNotifications(notifications) {
    let followingUsers = []

    if (profileInfo !== null) {
      followingUsers = await artistsAPI.getFollowings(profileInfo.wallet_id)
    }

    notifications
      .filter(notification => notification.notification_type === 'follow')
      .forEach(notification => {
        if (followingUsers.some(item => item.wallet_id === notification.reference_wallet_id))
          notification.followed = true
        else notification.followed = false
      })

    let dateSorted = notifications.sort(compareDate)
    setAllNotification(dateSorted)
    const sorted = getSortedNotification(dateSorted)
    setFilterNotification(sorted)
    setSearchedNotification(sorted)
  }

  const onClickMarkAsRead = async () => {
    let result = await userAPI.setMarkAsReadNotification()
    if (!result) return
    userAPI.getNotifications().then(
      response => {
        if (response !== null) {
          if (response.notifications.length > 0) {
            getNotifications([...response.notifications])
            dispatch({ type: 'set', markAsRead: true })
          }
        }
      },
      error => {
        console.log(error)
      }
    )
  }

  return (
    <div className="flex items-center">
      <HMenu>
        <HMenu.Button onClick={toggleMenu} ref={itemRef as MutableRefObject<HTMLButtonElement>}>
          <div className={styles.container}>
            <div className={styles.iconArea}>
              <NotificationIcon alt="" />
            </div>
          </div>
        </HMenu.Button>
        {isMenuOpen && (
          <div ref={menuRef as MutableRefObject<HTMLDivElement>} className={styles.menuArea}>
            <div className="mt-[30px] ml-[30px]">
              <div className={styles.title}>Notifications</div>
            </div>
            {loading ? (
              <div className="mt-[140px] h-[540px] max-h-[540px]">
                <LoadingModal open={loading} />
              </div>
            ) : (
              <div className="h-[500px] max-h-[500px]">
                <NotificationsCard data={searchedNotification} onClickMarkAsRead={() => onClickMarkAsRead()} />
              </div>
            )}
          </div>
        )}
        {/* </Transition> */}
      </HMenu>
    </div>
  )
}

export default NotificationMenu
