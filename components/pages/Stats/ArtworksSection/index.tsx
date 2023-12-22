import React, { useEffect, useState } from 'react'

// components
import SearchSection from '../SearchSection'
import TableSections from './TableSection'

import { useDispatch } from 'react-redux'

// swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Autoplay, Lazy, Navigation } from 'swiper'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

import StatsCollectionCard from 'components/Card/StatsCollectionCard'
// import Marquee from 'react-fast-marquee'
import { useViewport } from 'utils'

// json

// functions

// styles
import styles from './index.module.scss'

// apis
import StatsAPI from 'apis/stats'
import LoadingModal from 'components/Modal/LoadingModal'
import LoadingComponent from 'pages/explore/LoadingComponent'
import { NextButton, PreviewButton } from 'components/pages/Studio/MainSection/customButton'
SwiperCore.use([Navigation])

const ArtworksSection = props => {
  const { artworks } = props
  const viewport = useViewport()

  const [isMounted, setIsMounted] = useState(false)
  const [searchWord, setSearchWord] = useState<any>(null)
  const [list, setList] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [rowCount, setRowCount] = useState(12)
  const [period, setPeriod] = useState('all')
  const [screenWidth, setScreenWidth] = useState(1920)
  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isVisibleFetching, setIsVisibleFetching] = useState(false)
  const [swiper, setSwiper] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)

  const goNext = () => {
    if (swiper !== null) swiper.slideNext()
    setCurrentStep(swiper.activeIndex)
  }

  const goPrev = () => {
    if (swiper !== null) swiper.slidePrev()
    setCurrentStep(swiper.activeIndex)
  }

  const handleOnChange = swiper => {
    setCurrentStep(swiper.activeIndex)
  }

  useEffect(() => {
    setScreenWidth(window.innerWidth)
  }, [])

  useEffect(() => {
    if (artworks.length > 0) {
      setTimeout(() => {
        setLoading(false)
        setScreenWidth(window.innerWidth)
        setList(artworks)
        setIsMounted(true)
      }, 1000)
    }
  }, [artworks])

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
    getArtworkData(currentPage, period, searchWord, rowCount, true)
  }, [period])

  const getArtworkData = (curPage, curDate, search, count, reset = false) => {
    let page = curPage
    if (reset === true) page = 0
    StatsAPI.getStatsArtwork({
      period: curDate,
      search: search?.length === 0 ? null : search,
      page: page + 1,
      per_page: count,
    }).then(
      response => {
        setIsFetching(false)
        setSearchLoading(false)
        const nfts = response.filter(item => item.asset_url !== '')
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
    getArtworkData(nextPage, period, searchWord, rowCount)
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
          <div className="w-full mb-0 lg:mb-20 lg:mt-[25px] min-h-[293px] lg:min-h-[418px]">
            <Swiper
              slidesPerView={
                viewport === 'xs'
                  ? 1.2
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
                viewport === 'xs' || viewport === 'sm' || viewport === 'md' ? 11 : viewport === 'lg' ? 20 : 25
              }
              modules={[Autoplay, Lazy]}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              onSlideChange={handleOnChange}
              onSwiper={setSwiper}
            >
              {list.map((item: any, index) => (
                <SwiperSlide key={index}>
                  <StatsCollectionCard key={index} data={item} type="artworks" />
                </SwiperSlide>
              ))}
              {list?.length > 4 && (
                <>
                  <div className={styles.prevButton} onClick={goPrev}>
                    <PreviewButton />
                  </div>
                  <div className={styles.nextButton} onClick={goNext}>
                    <NextButton />
                  </div>
                </>
              )}
            </Swiper>
          </div>
        ))}

      {!loading && (
        <SearchSection
          placeholder={'Search by artwork name'}
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

export default ArtworksSection
