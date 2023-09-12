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
  const { activities, type, isLoading } = props

  const [searchWord, setSearchWord] = useState<any>(null)
  const [list, setList] = useState<any[]>([])
  useEffect(() => {}, [])

  useEffect(() => {
    setList(activities)
  }, [isLoading, activities])

  useEffect(() => {
    let length = searchWord?.length
    if (length > 0) {
      const results = activities.filter(({ id }) => {
        return id.toString().includes(searchWord.toLowerCase())
      })
      setList(results)
    } else {
      if (length === 0) {
        setList(activities)
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
          />
        )}
      </div>

      {list.length > 0 && (
        <div className="mt-[10px]">
          <TableSections data={list} type={type} />
        </div>
      )}
    </div>
  )
}

export default ApparelActivity
