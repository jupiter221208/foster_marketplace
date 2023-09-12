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
  const { avtivities, type, isLoading } = props

  const [isMounted, setIsMounted] = useState(false)
  const [searchWord, setSearchWord] = useState<any>(null)
  const [list, setList] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [rowCount, setRowCount] = useState(12)
  const [period, setPeriod] = useState('all')
  const [loading, setLoading] = useState(isLoading)
  useEffect(() => {}, [])

  useEffect(() => {
    setList(avtivities)
    setTotalCount(12)
    setTimeout(() => {
      setLoading(false)
      setIsMounted(true)
    }, 1000)
  }, [isLoading, avtivities])

  useEffect(() => {
    if (!isMounted) return
    getMerchData(currentPage, period, searchWord, rowCount)
  }, [period])

  const getSearchData = () => {
    getMerchData(currentPage, period, searchWord, rowCount)
  }

  const cancelSearch = () => {
    setSearchWord('')
    getMerchData(currentPage, period, null, rowCount)
  }

  const getMerchData = (curPage, curDate, search, count) => {}

  return (
    <div className={styles.container}>
      <div className="hidden lg:block">
        {list.length > 0 && (
          <SearchSection
            placeholder={'Search'}
            searchWord={searchWord}
            setSearchWord={value => setSearchWord(value.toString())}
            period={period}
            setPeriod={setPeriod}
            onCancel={() => cancelSearch()}
            onSearch={() => getSearchData()}
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
