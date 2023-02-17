import React, { useEffect, useState } from 'react'
import { useViewport } from 'utils'

import * as moment from 'moment'

// next images
import Head from 'next/head'
import Image from 'next/image'

// components
import SecondaryLayout from 'components/Layout/SecondaryLayout'
import NotificationsSearchBox from 'components/Input/NotificationsSearchBox'
import NotificationsCard from 'components/Card/NotificationsCard'
import NotificationsFilterCard from 'components/Card/NotificationsFilterCard'
import NotificationsFilterModal from 'components/Modal/NotificationsFilterModal'

// json
import NotificationsFilterList from 'assets/json/notifications/filter-list.json'

// images and icons
import EllipseGreen from 'assets/icons/ellipse-green.svg'

// styles
import styles from './index.module.scss'

// api
import userAPI from 'apis/user'

const Notifications = () => {
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false)
  const [filterList, setFilterList] = useState<any[]>([])
  const [allNotification, setAllNotification] = useState<any[]>([])
  const [filterNotification, setFilterNotification] = useState<any[]>([])
  const [searchedNotification, setSearchedNotification] = useState<any[]>([])
  const [searchWord, setSearchWord] = useState('')
  const viewport = useViewport()

  function getDateLabel(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    let month = months[date.getMonth()]
    let day = date.getDate()
    let year = date.getFullYear()
    return month + ' ' + day + ', ' + year
  }

  function getSortedNotification(notifications) {
    let today = new Date().setHours(0, 0, 0, 0)
    let yestarday = today - 3600 * 24 * 1000
    let weekEnd = today - 3600 * 48 * 1000
    let weekStart = today - 3600 * 168 * 1000
    let monthStart = today - 3600 * 24 * 30 * 1000
    let sortedByDate = {}
    let newNotifications = []
    notifications.map(notification => {
      if (notification.acknowledged === false) {
        newNotifications.push(notification)
      } else {
        var utcDate = moment.utc(notification.created_at)
        var fmt = 'YYYY MM DD'
        var localDate = utcDate.local().format(fmt)
        const createdDate = new Date(localDate).setHours(0, 0, 0, 0)
        const strCreatedDate = createdDate.toString()
        if (!sortedByDate.hasOwnProperty(strCreatedDate)) {
          sortedByDate[strCreatedDate] = []
        }
        sortedByDate[strCreatedDate].push(notification)
      }
    })
    let sortedNotification = []
    if (newNotifications.length > 0) sortedNotification.push({ id: 0, date: 'NEW', data: newNotifications })

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
          strDate = '1 MONTH AGO'
        }
        let dayNotifications = { id: index, date: strDate, data: sortedByDate[key].reverse() }
        sortedNotification.push(dayNotifications)
        index++
      })
    return sortedNotification
  }

  function comp(a, b) {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  }

  useEffect(() => {
    userAPI.getNotifications().then(
      response => {
        if (response !== null) {
          if (response.notifications.length > 0) {
            let notifications = response.notifications
            let dateSorted = notifications.sort(comp)
            setAllNotification(dateSorted)
            const sorted = getSortedNotification(dateSorted)
            setFilterNotification(sorted)
            setSearchedNotification(sorted)
          }
        }
      },
      error => {
        console.log(error)
      }
    )
  }, [])

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
    setFilterNotification(newFiltered)

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
            let notifications = response.notifications
            let dateSorted = notifications.sort(comp)
            setAllNotification(dateSorted)
            const sorted = getSortedNotification(dateSorted)
            setFilterNotification(sorted)
            setSearchedNotification(sorted)
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
        <link rel="icon" href="/logo.svg" />
      </Head>
      <div className={styles.container}>
        <div className={styles.topLeftEllipse}>
          <Image src={EllipseGreen} alt="" objectFit="cover" />
        </div>
        <div className="hidden lg:flex w-full z-10">
          <div className={styles.title}>Notifications</div>
        </div>
        <div className="w-full flex justify-between mt-[21px] lg:mt-[38px] gap-8">
          <div className="flex flex-1 flex-wrap max-w-[670px] gap-[16px] lg:gap-[35px] z-10">
            {viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? (
              <div className={styles.searchArea}>
                <div className="flex w-full">
                  <NotificationsSearchBox
                    placeholder="Search"
                    onChange={value => searchNotification(filterNotification, value)}
                  />
                </div>
                <div className={styles.filter} onClick={() => setShowFilterModal(true)}>
                  Filter
                </div>
              </div>
            ) : (
              <NotificationsSearchBox
                placeholder="Search"
                onChange={value => searchNotification(filterNotification, value)}
              />
            )}
            <NotificationsCard data={searchedNotification} onClickMarkAsRead={() => onClickMarkAsRead()} />
          </div>
          <NotificationsFilterCard
            filterList={filterList}
            onChange={index => handleSelectFilter(index)}
            onClickSelectAll={status => handleSelectAllFilters(status)}
            onClickApply={() => {}}
          />
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
