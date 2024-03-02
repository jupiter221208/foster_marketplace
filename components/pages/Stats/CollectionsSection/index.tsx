import React, { useEffect, useState } from 'react'

// components
import SearchSection from '../SearchSection'
import TableSections from './TableSection'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Autoplay, Lazy, Navigation } from 'swiper'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

// styles
import styles from './index.module.scss'

// apis
import StatsAPI from 'apis/stats'
import { useViewport } from 'utils'
import StatsCollectionCard from 'components/Card/StatsCollectionCard'
import LoadingModal from 'components/Modal/LoadingModal'
import LoadingComponent from 'pages/explore/LoadingComponent'
SwiperCore.use([Navigation])

const CollectionsSection = props => {
  const { collections } = props

  const viewport = useViewport()
  const [searchWord, setSearchWord] = useState<any>('')
  const [isMounted, setIsMounted] = useState(false)
  const [list, setList] = useState<any[]>([])
  const [period, setPeriod] = useState('all')
  const [currentPage, setCurrentPage] = useState(0)
  const [screenWidth, setScreenWidth] = useState(1920)
  const [rowCount, setRowCount] = useState(12)
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isVisibleFetching, setIsVisibleFetching] = useState(false)

  useEffect(() => {
    setScreenWidth(window.innerWidth)
    setLoading(true)
  }, [])

  useEffect(() => {
    if (collections.length > 0) {
      setTimeout(() => {
        setLoading(false)
        setList(collections)
        setIsMounted(true)
      }, 1000)
    }
  }, [collections])

  useEffect(() => {
    const resizeFunction = () => {
      setScreenWidth(window.innerWidth)
    }
    window.addEventListener('resize', resizeFunction)
  }, [])

  useEffect(() => {
    if (isFetching === true) {
      handleNextPage()
    }
  }, [isFetching])

  useEffect(() => {
    if (!isMounted) return
    setSearchLoading(true)
    setIsVisibleFetching(false)
    getCollectionData(currentPage, period, searchWord, rowCount, true)
  }, [period])

  const getCollectionData = (curPage, curDate, search, count, reset = false) => {
    setList([])
    let page = curPage
    if (reset === true) page = 0
    StatsAPI.getStatsCollection({
      period: curDate,
      search: search?.length === 0 ? null : search,
      page: page + 1,
      per_page: count,
    }).then(
      response => {
        setIsFetching(false)
        setSearchLoading(false)
        const nfts = response.filter(item => item.cover_image !== '')
        setCurrentPage(curPage)
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
    const nextPage = currentPage + 1
    getCollectionData(nextPage, period, searchWord, rowCount)
  }

  return (
    <div className={styles.container}>
      {loading && (
        <div className="mt-10">
          <LoadingModal open={loading} />
        </div>
      )}

      {!loading &&
        (list.length === 0 ? (
          !searchLoading ? (
            <div />
          ) : (
            <div className="w-full mb-0 lg:mb-20 h-[293px] lg:mt-[25px] lg:h-[418px]">
              <LoadingModal open={searchLoading} />
            </div>
          )
        ) : (
          <div className="w-full mb-0 lg:mb-20 lg:mt-[25px] min-h-[293px] lg:min-h-[418px]">
            <Swiper
              navigation={true}
              slidesPerView={
                viewport === 'xs'
                  ? 1.3
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
              spaceBetween={
                viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 40
              }
              modules={[Autoplay, Lazy, Navigation]}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              className={
                viewport === 'xs' || viewport === 'sm' || viewport === 'md'
                  ? 'noScrollNavigationSwiper'
                  : 'auctionNavigationSwiper'
              }
            >
              {list.map((item, index) => (
                <SwiperSlide key={index}>
                  <StatsCollectionCard data={item} type="collections" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ))}

      {!loading && (
        <SearchSection
          placeholder={'Search by collection name'}
          searchWord={searchWord}
          setSearchWord={value => setSearchWord(value.toString())}
          period={period}
          setPeriod={setPeriod}
        />
      )}

      {!loading && searchLoading && !isVisibleFetching && (
        <div className="mt-[-40px] lg:mt-[40px] mb-[80px] lg:mb-[160px]">
          <LoadingModal open={searchLoading} />
        </div>
      )}

      {!searchLoading && list.length > 0 && (
        <div className="mt-[20px]">
          <TableSections data={list} />
        </div>
      )}

      {!loading && !searchLoading && list.length === 0 && <div className={styles.result}>No results found</div>}

      {isMounted && isVisibleFetching && (
        <div className="w-full mt-[-40px] lg:mt-[40px] mb-[80px] lg:mb-[160px]">
          <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} />{' '}
        </div>
      )}
    </div>
  )
}

export default CollectionsSection
