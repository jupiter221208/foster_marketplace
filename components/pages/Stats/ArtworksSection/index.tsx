import React, { useEffect, useState } from 'react'

// components
import SearchSection from '../SearchSection'
import CollectionSection from './CollectionSection'
import TableSections from './TableSection'

import { useDispatch, useSelector } from 'react-redux'

// json
import ArtworksList from 'assets/json/stats/artworks-list.json'
import PopularCategoryList from 'assets/json/popular-category.json'
import ArtworksCollectionList from 'assets/json/stats/artworks-collection-list.json'

// functions
import { stringLengthValidate } from 'utils/strings'

// styles
import styles from './index.module.scss'

// apis
import StatsAPI from 'apis/stats'
import ExplorePagination from 'components/Button/ExplorePagination'
import StatsCollectionCard from 'components/Card/StatsCollectionCard'
import Marquee from 'react-fast-marquee'
import { useViewport } from 'utils'

const ArtworksSection = () => {
  const dispatch = useDispatch()
  const viewport = useViewport()

  const [isMounted, setIsMounted] = useState(false)
  const [searchWord, setSearchWord] = useState<any>(null)
  const [list, setList] = useState<any[]>([])
  const [feedList, setFeedList] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [rowCount, setRowCount] = useState(10)
  const [period, setPeriod] = useState('all')

  useEffect(() => {
    getArtworkData(currentPage, period, searchWord, rowCount)
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    getArtworkData(currentPage, period, searchWord, rowCount)
  }, [period])

  const getSearchData = () => {
    getArtworkData(currentPage, period, searchWord, rowCount)
  }

  const getArtworkData = (curPage, curDate, search, count) => {
    dispatch({ type: 'set', isLoading: true })

    StatsAPI.getStatsArtwork({
      period: curDate,
      search: search?.length === 0 ? null : search,
      page: curPage + 1,
      per_page: count,
    }).then(
      respone => {
        dispatch({ type: 'set', isLoading: false })
        const nfts = respone
        setCurrentPage(curPage)
        setTotalCount(count * curPage + nfts.length)
        setList(nfts)
        if (feedList.length === 0) setFeedList(nfts)
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      },
      error => {
        dispatch({ type: 'set', isLoading: false })
      }
    )
  }

  const selectRowCount = count => {
    setRowCount(count)
    getArtworkData(currentPage, period, searchWord, count)
  }

  const handleNextPage = () => {
    if (totalCount < (currentPage + 1) * rowCount) return
    const nextPage = currentPage + 1
    getArtworkData(nextPage, period, searchWord, rowCount)
  }

  const handlePreviousPage = () => {
    if (currentPage === 0) return
    const prevPage = currentPage - 1
    getArtworkData(prevPage, period, searchWord, rowCount)
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>Highest Sales</div>
      <div className="w-full mb-20 mt-[25px]">
        <Marquee
          gradient={false}
          pauseOnHover={false}
          pauseOnClick={true}
          speed={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 10 : viewport === 'lg' ? 100 : 70}
        >
          <div className="w-full flex gap-4 lg:gap-7 mx-[10px] lg:mx-5">
            {feedList.map((item: any, index) => (
              <StatsCollectionCard key={index} data={item} type="artworks" />
            ))}
          </div>
        </Marquee>

        {/* <CollectionSection list={feedList} /> */}
      </div>
      <SearchSection
        searchWord={searchWord}
        setSearchWord={value => setSearchWord(value.toString())}
        period={period}
        setPeriod={setPeriod}
        onSearch={() => getSearchData()}
      />
      <div className="mt-[20px]">
        <TableSections data={list} />
      </div>
      <div className="w-full flex justify-end">
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
      </div>
    </div>
  )
}

export default ArtworksSection
