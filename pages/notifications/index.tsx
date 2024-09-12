import React, { useEffect, useState } from 'react'

import * as moment from 'moment'

// next images
import Head from 'next/head'

// components
import SecondaryLayout from 'components/Layout/SecondaryLayout'
import NotificationsCard from 'components/Card/NotificationsCard'
import NotificationsFilterModal from 'components/Modal/NotificationsFilterModal'

// json
import NotificationsFilterList from 'assets/json/notifications/filter-list.json'

// images and icons

// styles
import styles from './index.module.scss'

// api
import userAPI from 'apis/user'
import artistsAPI from 'apis/artists'
import { useDispatch } from 'react-redux'
import { compareDate, getDateLabel } from 'utils/helpers'
import LoadingModal from 'components/Modal/LoadingModal'
import { useAuthentication } from 'hooks/useAuthentication'

const Notifications = () => {
  const dispatch = useDispatch()
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false)
  const [filterList, setFilterList] = useState<any[]>([])
  const [allNotification, setAllNotification] = useState<any[]>([])
  const [searchedNotification, setSearchedNotification] = useState<any[]>([])
  const [searchWord, setSearchWord] = useState('')
  const [loading, setLoading] = useState(true)
  const { profileInfo } = useAuthentication()
  const [noDataAlert, setNoDataAlert] = useState(false)

  function getSortedNotification(notifications) {
    let today = new Date().getTime()
    let today0 = new Date().setHours(0, 0, 0, 0)
    let yestarday = today0 - 3600 * 24 * 1000
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
    setSearchedNotification(sorted)
  }

  useEffect(() => {
    if (profileInfo === null || profileInfo === undefined) return

    userAPI.getNotifications().then(
      response => {
        if (response !== null) {
          if (response.notifications.length > 0) {
            setTimeout(() => {
              setLoading(false)
            }, 500)
            getNotifications([...response.notifications])
          } else {
            setTimeout(() => {
              setNoDataAlert(true)
              setLoading(false)
            }, 500)
          }
        } else {
          setTimeout(() => {
            setNoDataAlert(true)
            setLoading(false)
          }, 500)
        }
      },
      error => {
        setNoDataAlert(true)
        setLoading(false)
        console.log(error)
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileInfo])

  useEffect(() => {
    let array: any[] = []
    NotificationsFilterList.forEach(item => {
      let object: any = item
      object.checked = false
      array.push(object)
    })
    setFilterList(array)
  }, [])

  const handleSelectFilter = index => {
    let array = [...filterList]
    array[index].checked = !array[index].checked
    setFilterList(array)
    let types = []
    array.forEach(item => {
      if (item.checked === true) {
        types.push(item.value)
      }
    })
    let newFiltered = []
    if (types.length === 0) {
      newFiltered = getSortedNotification(allNotification)
    } else {
      let filtered = []
      allNotification.forEach(item => {
        if (types.includes(item.notification_type)) {
          filtered.push(item)
        }
      })
      newFiltered = getSortedNotification(filtered)
    }

    if (searchWord.length > 0) {
      searchNotification(newFiltered, searchWord)
    } else {
      setSearchedNotification(newFiltered)
    }
  }

  const handleSelectAllFilters = status => {
    let array = [...filterList]
    array.forEach(item => {
      if (status === 'Select All') {
        item.checked = true
      } else {
        item.checked = false
      }
    })
    setFilterList(array)
    let newFiltered = getSortedNotification(allNotification)
    if (searchWord.length > 0) {
      searchNotification(newFiltered, searchWord)
    } else {
      setSearchedNotification(newFiltered)
    }
  }

  const searchNotification = (notifications, keyword) => {
    setSearchWord(keyword)
    let newItem = []
    let keyValue = keyword.toLowerCase()

    notifications.forEach(items => {
      let newItems = items.data.filter(item => {
        return (
          item.reference_username?.toLowerCase().includes(keyValue) ||
          item.reference_token_name?.toLowerCase().includes(keyValue)
        )
      })
      newItem.push({ id: items.id, date: items.date, data: newItems })
    })

    setSearchedNotification(newItem)
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
    <div className="g-container">
      <Head>
        <title>Foster Marketplace</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <div className={styles.container}>
        <div className="w-full">
          <div className={styles.title}>Notifications</div>
          {loading ? (
            <div className="mt-[140px] h-[540px] max-h-[540px]">
              <LoadingModal open={loading} />
            </div>
          ) : noDataAlert === true ? (
            <div className="h-[500px] max-h-[500px] flex items-center justify-center">
              <div className="mb-[30px]">
                <div className={styles.noTitle}>No notifications detected</div>
                <div className={styles.noDesc}>When you get notifications, they will show up here</div>
              </div>
            </div>
          ) : (
            <NotificationsCard data={searchedNotification} onClickMarkAsRead={() => onClickMarkAsRead()} />
          )}
        </div>
      </div>
      {showFilterModal && (
        <NotificationsFilterModal
          filterList={filterList}
          onChange={index => handleSelectFilter(index)}
          onClickSelectAll={status => handleSelectAllFilters(status)}
          onClickApply={() => setShowFilterModal(false)}
        />
      )}
    </div>
  )
}

export default Notifications

Notifications.getLayout = function getLayout(page) {
  return <SecondaryLayout>{page}</SecondaryLayout>
}
