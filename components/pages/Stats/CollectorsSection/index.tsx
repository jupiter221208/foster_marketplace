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

// functions
import { useViewport } from 'utils'

// styles
import styles from './index.module.scss'

//apis
import StatsAPI from 'apis/stats'
import StatsArtistCard from 'components/Card/StatsArtistCard'
import ExplorePagination from 'components/Button/ExplorePagination'

const CollectorsSection = props => {
  const { collectors } = props
  const dispatch = useDispatch()
  const viewport = useViewport()
  const [searchWord, setSearchWord] = useState<any>('')
  const [list, setList] = useState<any[]>([])
  const [period, setPeriod] = useState('all')
  const [screenWidth, setScreenWidth] = useState(1920)
  const [isMounted, setIsMounted] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [rowCount, setRowCount] = useState(12)
  const [totalCount, setTotalCount] = useState(0)
  const [feedList, setFeedList] = useState([])

  useEffect(() => {
    setScreenWidth(window.innerWidth)
  }, [])

  useEffect(() => {
    const resizeFunction = () => {
      setScreenWidth(window.innerWidth)
    }
    window.addEventListener('resize', resizeFunction)
  }, [])

  useEffect(() => {
    setFeedList(collectors)
    setList(collectors)
    setTotalCount(12)
    setIsMounted(true)
  }, [collectors])

  useEffect(() => {
    if (!isMounted) return
    getCollectorData(currentPage, period, searchWord, rowCount)
  }, [period])

  const getSearchData = () => {
    getCollectorData(currentPage, period, searchWord, rowCount)
  }

  const getCollectorData = (curPage, curDate, search, count) => {
    dispatch({ type: 'set', isLoading: true })
    StatsAPI.getStatsCollector({
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
          top: viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 400 : 800,
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
    getCollectorData(currentPage, period, searchWord, count)
  }

  const handleNextPage = () => {
    if (totalCount < (currentPage + 1) * rowCount) return
    const nextPage = currentPage + 1
    getCollectorData(nextPage, period, searchWord, rowCount)
  }

  const handlePreviousPage = () => {
    if (currentPage === 0) return
    const prevPage = currentPage - 1
    getCollectorData(prevPage, period, searchWord, rowCount)
  }

  return (
    <div className={styles.container}>
      <div className="w-full mb-0 lg:mb-20 lg:mt-[25px]">
        <Swiper
          navigation={viewport === 'lg' || viewport === 'xl' || viewport === '2xl' ? true : false}
          slidesPerView={
            viewport === 'xs'
              ? 2
              : viewport === 'sm'
              ? 2.5
              : viewport === 'md'
              ? 3
              : viewport === 'lg'
              ? 3
              : viewport === 'xl'
              ? screenWidth >= 1400
                ? 4
                : 3.7
              : viewport === '2xl'
              ? screenWidth >= 1768
                ? 5
                : 4
              : 3
          }
          spaceBetween={viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 20 : viewport === 'lg' ? 20 : 32}
          modules={[Autoplay, Lazy, Navigation]}
          className="navigationSwiper"
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
        >
          {feedList.map((item, index) => (
            <SwiperSlide key={index}>
              <StatsArtistCard data={item} type="collectors" />
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

export default CollectorsSection
