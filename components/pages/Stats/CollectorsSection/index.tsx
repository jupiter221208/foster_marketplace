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
import LoadingModal from 'components/Modal/LoadingModal'
import LoadingComponent from 'pages/explore/LoadingComponent'

const CollectorsSection = props => {
  const { collectors } = props
  const viewport = useViewport()
  const [searchWord, setSearchWord] = useState<any>('')
  const [list, setList] = useState<any[]>([])
  const [period, setPeriod] = useState('all')
  const [screenWidth, setScreenWidth] = useState(1920)
  const [isMounted, setIsMounted] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [rowCount, setRowCount] = useState(12)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isVisibleFetching, setIsVisibleFetching] = useState(false)

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    setLoading(true)
  }, [])

  useEffect(() => {
    const resizeFunction = () => {
      setScreenWidth(window.innerWidth)
    }
    window.addEventListener('resize', resizeFunction)
  }, [])

  useEffect(() => {
    if (collectors.length > 0) {
      setTimeout(() => {
        setLoading(false)
        setList(collectors)
        setTotalCount(12)
        setIsMounted(true)
        setIsVisibleFetching(true)
      }, 1000)
    }
  }, [collectors])

  useEffect(() => {
    if (isFetching === true) {
      handleNextPage()
    }
  }, [isFetching])

  useEffect(() => {
    if (!isMounted) return
    getCollectorData(currentPage, period, searchWord, rowCount, true)
  }, [period])

  const getSearchData = () => {
    getCollectorData(currentPage, period, searchWord, rowCount)
  }

  const cancelSearch = () => {
    setSearchWord('')
    getCollectorData(currentPage, period, null, rowCount)
  }

  const getCollectorData = (curPage, curDate, search, count, reset = false) => {
    let page = curPage
    if (reset === true) page = 0
    StatsAPI.getStatsCollector({
      period: curDate,
      search: search?.length === 0 ? null : search,
      page: page + 1,
      per_page: count,
    }).then(
      response => {
        setIsFetching(false)

        const nfts = response.filter(item => item.pfp_url !== '')
        setCurrentPage(curPage)
        setTotalCount(count * curPage + nfts.length)

        if (reset === true) setList(nfts)
        else setList([...list, ...nfts])

        if (response.length === rowCount) setIsVisibleFetching(true)
        else setIsVisibleFetching(false)
      },
      error => {
        setIsFetching(false)
        setIsVisibleFetching(false)
      }
    )
  }
  const handleNextPage = () => {
    if (totalCount < (currentPage + 1) * rowCount) return
    const nextPage = currentPage + 1
    getCollectorData(nextPage, period, searchWord, rowCount)
  }

  return (
    <div className={styles.container}>
      {loading && (
        <div className="mt-10">
          <LoadingModal open={loading} />
        </div>
      )}

      {!loading && (
        <div className="w-full mb-0 lg:mb-20 lg:mt-[25px] min-h-[293px] lg:min-h-[418px]">
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
            spaceBetween={
              viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 20 : viewport === 'lg' ? 20 : 32
            }
            modules={[Autoplay, Lazy, Navigation]}
            className="navigationSwiper"
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
          >
            {list.map((item, index) => (
              <SwiperSlide key={index}>
                <StatsArtistCard data={item} type="collectors" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {!loading && (
        <SearchSection
          placeholder={'Search by collector name'}
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
          <TableSections data={list} />
        </div>
      )}

      {isMounted && isVisibleFetching && (
        <div className="w-full mt-[-100px] mb-[40px]">
          <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} />
        </div>
      )}
    </div>
  )
}

export default CollectorsSection
