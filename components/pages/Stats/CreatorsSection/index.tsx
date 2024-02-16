import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

// components
import SearchSection from '../SearchSection'
import TableSections from './TableSection'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Autoplay, Lazy, Navigation } from 'swiper'
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
import LoadingModal from 'components/Modal/LoadingModal'
import LoadingComponent from 'pages/explore/LoadingComponent'
import { NextButton, PreviewButton } from 'components/pages/Studio/MainSection/customButton'
SwiperCore.use([Navigation])

const CreatorsSection = props => {
  const { creators } = props
  const [searchWord, setSearchWord] = useState<any>('')
  const [list, setList] = useState<any[]>([])
  const viewport = useViewport()
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
    if (creators.length > 0) {
      setTimeout(() => {
        setLoading(false)
        setList(creators)
        setTotalCount(12)
        setIsMounted(true)
      }, 1000)
    }
  }, [creators])

  useEffect(() => {
    if (isFetching === true) {
      handleNextPage()
    }
  }, [isFetching])

  useEffect(() => {
    if (!isMounted) return
    setSearchLoading(true)
    setIsVisibleFetching(false)
    getCreatorData(currentPage, period, searchWord, rowCount, true)
  }, [period])

  const getCreatorData = (curPage, curDate, search, count, reset = false) => {
    let page = curPage
    if (reset === true) page = 0
    StatsAPI.getStatsCreator({
      period: curDate,
      search: search?.length === 0 ? null : search,
      page: page + 1,
      per_page: count,
    }).then(
      response => {
        setIsFetching(false)
        setSearchLoading(false)
        const nfts = response.filter(item => item.pfp_url !== '')
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
    getCreatorData(nextPage, period, searchWord, rowCount)
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
          <div className="w-full mb-1 lg:mb-4 lg:mt-[25px]"></div>
        ) : (
          <div className="w-full mb-0 lg:mb-20 lg:mt-[25px]">
            <Swiper
              navigation={true}
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
                  <StatsArtistCard data={item} type="creators" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ))}

      {!loading && (
        <SearchSection
          placeholder={'Search by creator name'}
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
          <LoadingComponent isFetching={isFetching} setIsFetching={setIsFetching} />
        </div>
      )}
    </div>
  )
}

export default CreatorsSection
