import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

// components
import SearchSection from '../SearchSection'
import TableSections from './TableSection'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Lazy, Navigation } from 'swiper'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// styles
import styles from './index.module.scss'

// apis
import StatsAPI from 'apis/stats'
import { useViewport } from 'utils'
import StatsCollectionCard from 'components/Card/StatsCollectionCard'
import ExplorePagination from 'components/Button/ExplorePagination'

const CollectionsSection = () => {
  const dispatch = useDispatch()
  const viewport = useViewport()
  const [searchWord, setSearchWord] = useState<any>('')
  const [isMounted, setIsMounted] = useState(false)
  const [list, setList] = useState<any[]>([])
  const [feedList, setFeedList] = useState([])
  const [period, setPeriod] = useState('all')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [screenWidth, setScreenWidth] = useState(1920)
  const [rowCount, setRowCount] = useState(10)

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    let nfts = [
      {
        id: 0,
        asset_url: ' ',
        amount: ' ',
        asset_name: ' ',
      },
      {
        id: 1,
        asset_url: ' ',
        amount: ' ',
        asset_name: ' ',
      },
      {
        id: 2,
        asset_url: ' ',
        amount: ' ',
        asset_name: ' ',
      },
      {
        id: 3,
        asset_url: ' ',
        amount: ' ',
        asset_name: ' ',
      },
    ]
    setFeedList(nfts)
  }, [])

  useEffect(() => {
    const resizeFunction = () => {
      setScreenWidth(window.innerWidth)
    }
    window.addEventListener('resize', resizeFunction)
  }, [])

  useEffect(() => {
    getCollectionData(currentPage, period, searchWord, rowCount)
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    getCollectionData(currentPage, period, searchWord, rowCount)
  }, [period])

  useEffect(() => {
    if (searchWord.length === 0) {
      getCollectionData(currentPage, period, '', rowCount)
    }
  }, [searchWord])

  const getSearchData = () => {
    getCollectionData(currentPage, period, searchWord, rowCount)
  }

  const getCollectionData = (curPage, curDate, search, count) => {
    // dispatch({ type: 'set', isLoading: true })
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    StatsAPI.getStatsCollection({
      period: curDate,
      search: search?.length === 0 ? null : search,
      page: curPage + 1,
      per_page: count,
    }).then(
      respone => {
        // dispatch({ type: 'set', isLoading: false })
        const nfts = respone
        setCurrentPage(curPage)
        setTotalCount(count * curPage + nfts.length)
        setList(nfts)
        if (feedList.length === 0) setFeedList(nfts)
      },
      error => {
        dispatch({ type: 'set', isLoading: false })
      }
    )
  }

  const selectRowCount = count => {
    setRowCount(count)
    getCollectionData(currentPage, period, searchWord, count)
  }

  const handleNextPage = () => {
    if (totalCount < (currentPage + 1) * rowCount) return
    const nextPage = currentPage + 1
    getCollectionData(nextPage, period, searchWord, rowCount)
  }

  const handlePreviousPage = () => {
    if (currentPage === 0) return
    const prevPage = currentPage - 1
    getCollectionData(prevPage, period, searchWord, rowCount)
  }

  return (
    <div className={styles.container}>
      <div className="w-full mb-0 lg:mb-20 lg:mt-[25px]">
        <Swiper
          navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
          slidesPerView={
            viewport === 'xs'
              ? 1.6
              : viewport === 'sm'
              ? 2.5
              : viewport === 'md'
              ? 2.9
              : viewport === 'lg'
              ? 2.5
              : viewport === 'xl'
              ? screenWidth >= 1300
                ? 3
                : 2.8
              : viewport === '2xl'
              ? screenWidth >= 1768
                ? 4
                : 3.5
              : 4
          }
          spaceBetween={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 40}
          modules={[Autoplay, Lazy, Navigation]}
          className="hideNavigationSwiper"
          loop
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
        >
          {feedList.map((item, index) => (
            <SwiperSlide key={index}>
              <StatsCollectionCard data={item} type="collections" />
            </SwiperSlide>
          ))}
        </Swiper>
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

export default CollectionsSection
