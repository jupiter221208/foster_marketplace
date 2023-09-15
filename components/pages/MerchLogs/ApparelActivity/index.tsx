import React, { useEffect, useState } from 'react'

// components
import SearchSection from '../SearchSection'
import TableSections from './TableSection'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

import { useViewport } from 'utils'

// json

// functions

// styles
import styles from './index.module.scss'

const ApparelActivity = props => {
  const { activities, pendingList, allList, type, isLoading } = props

  const [searchWord, setSearchWord] = useState<any>('')
  const [filter, setFilter] = useState(0)
  const [list, setList] = useState<any[]>([])

  useEffect(() => {
    setActivityList()
  }, [isLoading, filter])

  const setActivityList = () => {
    if (filter === 0) setList(activities)
    else if (filter === 1) setList(pendingList)
    else setList(allList)
  }

  useEffect(() => {
    let length = searchWord?.length
    let searchData = []
    if (length > 0) {
      if (filter === 0) searchData = activities
      else if (filter === 1) searchData = pendingList
      else searchData = allList
      const results = searchData.filter(({ id }) => {
        return id.toString().includes(searchWord.toLowerCase())
      })
      setList(results)
    } else {
      if (length === 0) {
        setActivityList()
      }
    }
  }, [searchWord])

  return (
    <div className={styles.container}>
      <div className="hidden lg:block">
        {activities.length > 0 && (
          <SearchSection
            placeholder={'Search'}
            searchWord={searchWord}
            setSearchWord={value => setSearchWord(value.toString())}
            onFilter={value => setFilter(value)}
          />
        )}
      </div>

      {list.length > 0 && (
        <div className="mt-[10px]">
          <TableSections data={list} type={type} />
        </div>
      )}

      {!isLoading && activities?.length === 0 && searchWord.length === 0 && (
        <div className="w-full mt-[50px] lg:mt-[0px]">
          <div className={styles.noArtwork}>
            {type === 'purchases' ? 'No order history detected' : 'No sales history detected'}
          </div>
          <div className={styles.noData}>
            {type === 'purchases'
              ? "This tab displays any orders you've placed via Creator Studio"
              : "This tab displays the orders received for artwork you've enabled Creator Studio"}
          </div>
        </div>
      )}
    </div>
  )
}

export default ApparelActivity
