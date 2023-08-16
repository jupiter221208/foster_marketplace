import React, { useEffect, useState } from 'react'

// components
import SearchSection from '../SearchSection'
import TableSections from './TableSection'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

import ExplorePagination from 'components/Button/ExplorePagination'
import { useViewport } from 'utils'

// json

// functions

// styles
import styles from './index.module.scss'

// apis
import StatsAPI from 'apis/stats'
import LoadingModal from 'components/Modal/LoadingModal'

const ApparelActivity = props => {
  const { avtivities, type } = props
  const viewport = useViewport()

  const [isMounted, setIsMounted] = useState(false)
  const [searchWord, setSearchWord] = useState<any>(null)
  const [list, setList] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [rowCount, setRowCount] = useState(12)
  const [period, setPeriod] = useState('all')
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)

  useEffect(() => {}, [])

  useEffect(() => {
    if (avtivities.length > 0) {
      setTimeout(() => {
        setLoading(false)
        setList(avtivities)
        setTotalCount(12)
        setIsMounted(true)
      }, 1000)
    }
  }, [avtivities])

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

  const selectRowCount = count => {
    setRowCount(count)
    getMerchData(currentPage, period, searchWord, count)
  }

  const handleNextPage = () => {
    if (totalCount < (currentPage + 1) * rowCount) return
    const nextPage = currentPage + 1
    getMerchData(nextPage, period, searchWord, rowCount)
  }

  const handlePreviousPage = () => {
    if (currentPage === 0) return
    const prevPage = currentPage - 1
    getMerchData(prevPage, period, searchWord, rowCount)
  }

  return (
    <div className={styles.container}>
      {loading && (
        <div className="mt-10">
          <LoadingModal open={loading} />
        </div>
      )}

      {!loading && (
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

      {!loading && searchLoading && (
        <div className="mt-10">
          <LoadingModal open={searchLoading} />
        </div>
      )}

      {!searchLoading && list.length > 0 && (
        <div className="mt-[20px]">
          <TableSections data={list} type={type} />
        </div>
      )}

      {/* <div className="w-full flex justify-end">
        <ExplorePagination
          currentPage={currentPage}
          totalCount={totalCount}
          rowCount={rowCount}
          setRowCount={count => {
            selectRowCount(count)
          }}
          handleNext={handleNextPage}
          handlePrev={handlePreviousPage}
        />
      </div> */}
    </div>
  )
}

export default ApparelActivity
